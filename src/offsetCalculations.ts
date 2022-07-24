import { OffsetPlanEntry, MonthDate } from "./constructs";
import { CURRENT_MONTHDATE, CURRENT_YEAR, incrementMonth, monthsBetween } from "./dates";

const MATURE_AGE = 6 * 12; // 6 years in months

/** Annual carbon sequestration by a single tree (in kg per year) */
export const MATURE_CARBON_ANNUAL = 28.5;

// kg per month
const MATURE_CARBON = MATURE_CARBON_ANNUAL / 12;

/** The maximum number of trees that can be planted per year */
export const MAX_ANNUAL_TREES_PLANTED = 55;

/** Cost of planting a single tree (in USD) */
export const PLANT_COST = 120;

/** Annual upkeep cost for one tree (in USD) */
export const UPKEEP_COST = 12;

export function estimatedCumulativeProductionAtDate(yearlyRate: number, carbonDate: MonthDate) {
  /** Calculates the user's estimated total carbon production between now and the given date (in tons) */
  return yearlyRate/12 * monthsBetween(CURRENT_MONTHDATE, carbonDate);
}

export function estimatedProductionAtDate(yearlyRate: number, _: MonthDate) {
  /** Returns the user's estimated rate of carbon production at the given date (in tons) */
  return yearlyRate/12;
}

export function expenditureInYear(offsetPlan: OffsetPlanEntry[], desiredYear: number) {
  /**
   * Calculates the user's total expenditure in the given year.
   * 
   * NOTE: this function assumes that offsetPlan is sorted. In this application,
   * this is done in the input form's onSubmit function automatically, but care
   * should be taken if using this function elsewhere.
   */

  let totalCost = 0;

  let planIndex = 0;

  while (offsetPlan[planIndex]?.date.year < desiredYear) {
    totalCost += UPKEEP_COST*offsetPlan[planIndex].trees;
    planIndex += 1;
  }

  while (offsetPlan[planIndex]?.date.year === desiredYear) {
    totalCost += PLANT_COST*offsetPlan[planIndex].trees;
    planIndex += 1;
  }

  return totalCost;
}

export function cumulativeExpenditureToYear(offsetPlan: OffsetPlanEntry[], desiredYear: number) {
  /**
   * Calculates the user's total expenditure up to and including the given year.
   * 
   * NOTE: this function assumes that offsetPlan is sorted. In this application,
   * this is done in the input form's onSubmit function automatically, but care
   * should be taken if using this function elsewhere.
   */

  let totalCost = 0;

  let planIndex = 0;

  while (offsetPlan[planIndex]?.date.year <= desiredYear) {
    totalCost += (PLANT_COST + UPKEEP_COST * (desiredYear - offsetPlan[planIndex].date.year)) * offsetPlan[planIndex].trees;
    planIndex += 1;
  }

  return totalCost;
}


export function cumulativeCarbonAtDate(offsetPlan: OffsetPlanEntry[], carbonDate: MonthDate) {
  /**
   * Calculates the total quantity of carbon (in tons) sequestered by the offsetPlan between now and the given date.
   */

  let totalCarbon = 0;

  offsetPlan.forEach((entry) => {
    totalCarbon += entry.trees * (() => {
      const treeAge = monthsBetween(entry.date, carbonDate);

      if (treeAge <= 0) return 0;
      
      if (treeAge < MATURE_AGE) {
        // model growing trees as having linear increase in carbon
        // integrating the function for rate of carbon increase:
        // y = 28.5/6 x  =>  y = 28.5/(6*2) x^2
        return (MATURE_CARBON * treeAge**2) / (MATURE_AGE * 2);
      }
      
      // By calculation, once mature a tree has consumed MATURE_CARBON*MATURE_AGE/2 kg of CO2
      // This is half of the MATURE_CARBON*MATURE_AGE that it would consume if it consumed 28.5kg
      // per year from the start, so we must subtract MATURE_CARBON*MATURE_AGE/2
      return MATURE_CARBON * treeAge - MATURE_CARBON * MATURE_AGE / 2;
    })();
  });

  return totalCarbon / 1000;  // convert to tons
}

export function carbonIntakeAtDate(offsetPlan: OffsetPlanEntry[], carbonDate: MonthDate) {
  /**
   * Calculates the monthly carbon intake for the given month (in tons).
   */

  let totalCarbon = 0;

  offsetPlan.forEach((entry) => {
    totalCarbon += entry.trees * (() => {
      const treeAge = monthsBetween(entry.date, carbonDate);

      if (treeAge <= 0) return 0;
      
      if (treeAge < MATURE_AGE) {
        // model growing trees as having linear increase in carbon
        return (MATURE_CARBON * treeAge) / MATURE_AGE;
      }
      
      return MATURE_CARBON;
    })();
  });

  return totalCarbon / 1000;  // convert to tons
}

export function getNeutralDate(offsetPlan: OffsetPlanEntry[], yearlyRate: number) {
  /**
   * Finds the first month in which the user's trees sequester more carbon than the user produces.
   */

  const totalTrees = offsetPlan.reduce((total, entry) => total + entry.trees, 0);

  if (totalTrees * MATURE_CARBON_ANNUAL < yearlyRate*1000) return {month: -1, year: -1};

  let currentDate = CURRENT_MONTHDATE;
  while (carbonIntakeAtDate(offsetPlan, currentDate)*12 < yearlyRate) {
    if (currentDate.year > CURRENT_YEAR + 1000) return {month: -1, year: -1};
    currentDate = incrementMonth(currentDate);
  }
  
  return currentDate;
}

export function getNetPositiveDate(offsetPlan: OffsetPlanEntry[], yearlyRate: number) {
  /**
   * Finds the year in which the total carbon sequestered exceeds the user's
   * total carbon production (both since the current date)
   */

  const totalTrees = offsetPlan.reduce((total, entry) => total + entry.trees, 0);

  if (totalTrees * MATURE_CARBON_ANNUAL <= yearlyRate*1000) return {month: -1, year: -1};

  let currentDate = incrementMonth(CURRENT_MONTHDATE);
  while (cumulativeCarbonAtDate(offsetPlan, currentDate) < estimatedCumulativeProductionAtDate(yearlyRate, currentDate)) {
    if (currentDate.year > CURRENT_YEAR + 1000) return {month: -1, year: -1};
    currentDate = incrementMonth(currentDate);
  }
  
  return currentDate;
}
