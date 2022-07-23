import React from "react";
import { FormDataType, OffsetPlanEntry } from './constructs';
import { OffsetPlanForm } from './OffsetPlanForm';
import { MATURE_CARBON_ANNUAL, getNeutralDate, getNetPositiveDate, PLANT_COST, UPKEEP_COST } from './offsetCalculations';
import { getDateText } from "./dates";

interface LeftPanelProps {
  updateFormData(formData: FormDataType): void,
  totalTrees: number,
  estimatedProduction: number,
  offsetPlan: OffsetPlanEntry[]
};

export default class LeftPanel extends React.Component<LeftPanelProps, {}> {
  render() {
    const requiredTrees = Math.ceil(this.props.estimatedProduction * 1000 / MATURE_CARBON_ANNUAL);

    const neutralDate = getNeutralDate(this.props.offsetPlan, this.props.estimatedProduction);
    const netPositiveDate = getNetPositiveDate(this.props.offsetPlan, this.props.estimatedProduction);

    const neutralText = neutralDate.month === -1 ? "you will not reach carbon neutrality" : `you will reach carbon neutrality by the end of ${getDateText(neutralDate)}`;
    const netPositiveText = netPositiveDate.month === -1 ? "you will not reach net carbon positivity in the next 1000 years" : `you will reach net carbon positivity by the end of ${getDateText(netPositiveDate)}`;

    let yearlyTrees: {[year: string]: number} = {};

    this.props.offsetPlan.forEach((entry) => {
      const year = entry.date.year;
      yearlyTrees[year] = year in yearlyTrees ? yearlyTrees[year] + entry.trees : entry.trees;
    });
    
    const yearsOverMaxTrees: string[] = Object.keys(yearlyTrees).filter(key => yearlyTrees[key] > 55);
    const treeQuantityWarning = (() => {
      const yearCount = yearsOverMaxTrees.length;
      const isPlural = yearCount > 1;

      if (yearCount > 0) {
        return <p className="formWarning">{`
          Warning: the year${isPlural ? "s" : ""} ${yearsOverMaxTrees.join(", ")}
          ${isPlural ? "have" : "has"} too many tree planting operations!
          Please consider reducing the number of trees planted in this year below the 55-tree maximum.
        `}</p>;
      }
      else return <></>;
    })();

    const plantCost = this.props.totalTrees * PLANT_COST;
    const upkeepCost = this.props.totalTrees * UPKEEP_COST;

    return (
      <div id="leftPanel">
        <div id="header">
          <h1>Carbon Offset Simulator</h1>
        </div>
        <OffsetPlanForm updateFormData={this.props.updateFormData} totalTrees={this.props.totalTrees}></OffsetPlanForm>
        <div id="summary">
          {treeQuantityWarning}
          <p>
            The average person in your country produces {this.props.estimatedProduction} tons of carbon dioxide per year.
            This amount would require {requiredTrees} trees to compensate for annual emissions.
          </p>
          <p>
            With your current offset plan, {neutralText} and {netPositiveText}.
          </p>
          <p>
            Reaching this level of carbon removal will require ${plantCost} in planting costs and ${upkeepCost} in annual upkeep
            (at ${PLANT_COST} to plant a tree and ${UPKEEP_COST} per year to maintain it).
          </p>
        </div>
      </div>
    );
  }
}