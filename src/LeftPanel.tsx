import React from "react";
import { OffsetPlanEntry } from './constructs';
import { OffsetPlanForm, FormDataType } from './OffsetPlanForm';
import { MATURE_CARBON_ANNUAL, getNeutralDate, getNetPositiveDate, PLANT_COST, UPKEEP_COST, MAX_ANNUAL_TREES_PLANTED } from './offsetCalculations';
import { getDateText } from "./dates";

interface LeftPanelProps {
  updateFormData(formData: FormDataType): void,
  totalTrees: number,
  estimatedProduction: number,
  offsetPlan: OffsetPlanEntry[]
};

export default class LeftPanel extends React.Component<LeftPanelProps> {
  /**
   * Component for the left hand side of the UI. Includes code to generate the
   * summaries at the bottom of the page.
   */

  render() {
    // Calculate the number of trees needed to equal the user's annual carbon production
    const requiredTrees = Math.ceil(this.props.estimatedProduction * 1000 / MATURE_CARBON_ANNUAL);

    // Compute the date by which the user will equal their annual production (carbon neutrality)
    const neutralDate = getNeutralDate(this.props.offsetPlan, this.props.estimatedProduction);
    
    // Compute the date by which the user will equal their cumulative production from now onwards (net carbon positivity)
    const netPositiveDate = getNetPositiveDate(this.props.offsetPlan, this.props.estimatedProduction);

    const neutralText = neutralDate.month === -1 ? "you will not reach carbon neutrality" : `you will reach carbon neutrality by the end of ${getDateText(neutralDate)}`;
    const netPositiveText = netPositiveDate.month === -1 ? "you will not reach net carbon positivity in the next 1000 years" : `you will reach net carbon positivity by the end of ${getDateText(netPositiveDate)} (excluding previous emissions)`;

    // Find the total number of trees being planted each year
    let yearlyTrees: {[year: string]: number} = {};
    this.props.offsetPlan.forEach((entry) => {
      const year = entry.date.year;
      yearlyTrees[year] = year in yearlyTrees ? yearlyTrees[year] + entry.trees : entry.trees;
    });
    
    // Check if any years have exceeded MAX_ANNUAL_TREES_PLANTED
    const yearsOverMaxTrees: string[] = Object.keys(yearlyTrees).filter(key => yearlyTrees[key] > MAX_ANNUAL_TREES_PLANTED);
    const treeQuantityWarning = (() => {
      const yearCount = yearsOverMaxTrees.length;
      const isPlural = yearCount > 1;

      if (yearCount > 0) {
        return <p id="treeQuantityWarning">{`
          Warning: the year${isPlural ? "s" : ""} ${yearsOverMaxTrees.join(", ")}
          ${isPlural ? "have" : "has"} too many tree planting operations!
          The simulator will still compute accurate values for the data you have
          entered, but please consider reducing the number of trees planted in
          ${isPlural ? "these years" : "this year"} below the 55-tree maximum.
        `}</p>;
      }
      else return <></>;
    })();

    const totalPlantCost = this.props.totalTrees * PLANT_COST;
    const totalUpkeepCost = this.props.totalTrees * UPKEEP_COST;

    return (
      <div id="leftPanel">
        <div id="header">
          <h1>Carbon Offset Simulator</h1>
        </div>
        <OffsetPlanForm updateFormData={this.props.updateFormData} totalTrees={this.props.totalTrees}></OffsetPlanForm>
        <div id="summary">
          {/* Admittedly the summary could probably have been put into its own React component */}
          {treeQuantityWarning}
          <p>
            The average person in your country produces {this.props.estimatedProduction} tons of carbon dioxide per year.
            This amount would require {requiredTrees} trees to compensate for annual emissions.
          </p>
          <p>
            With your current offset plan, {neutralText} and {netPositiveText}.
          </p>
          <p>
            Reaching this level of carbon removal will require ${totalPlantCost} in planting costs and ${totalUpkeepCost} in annual upkeep
            (at ${PLANT_COST} to plant a tree and ${UPKEEP_COST} per year to maintain it).
          </p>
        </div>
      </div>
    );
  }
}