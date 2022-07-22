import { OffsetPlanEntry, MonthDate } from "./constructs";
import { CURRENT_MONTHDATE, monthsBetween } from "./dates";

const MATURE_AGE = 6 * 12; // 6 years in months
export const MATURE_CARBON_ANNUAL = 28.5; // kg per month
const MATURE_CARBON = MATURE_CARBON_ANNUAL / 12; // kg per month

const PLANT_COST = 120;
const UPKEEP_COST = 12;

export function estimatedCumulativeConsumptionAtDate(yearlyRate: number, carbonDate: MonthDate) {
  return yearlyRate/12 * monthsBetween(CURRENT_MONTHDATE, carbonDate);
}

export function estimatedConsumptionAtDate(yearlyRate: number, _: MonthDate) {
  return yearlyRate/12;
}

export function expenditureInYear(offsetPlan: OffsetPlanEntry[], desiredYear: number) {
  /**
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

  return totalCarbon / 1000; // convert to tons
}

export function carbonIntakeAtDate(offsetPlan: OffsetPlanEntry[], carbonDate: MonthDate) {
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

  return totalCarbon / 1000;
}


