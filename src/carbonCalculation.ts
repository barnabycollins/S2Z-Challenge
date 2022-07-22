import { OffsetPlanEntry, MonthDate } from "./constructs";
import { monthsBetween } from "./dates";

const MATURE_AGE = 6 * 12; // 6 years in months
const MATURE_CARBON = 28.5 / 12; // kg per month

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

  return totalCarbon;
}

export function calculateCost() {

}