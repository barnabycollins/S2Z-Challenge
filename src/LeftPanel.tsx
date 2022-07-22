import React from "react";
import { FormDataType, OffsetPlanEntry } from './constructs';
import { OffsetPlanForm } from './OffsetPlanForm';
import { MATURE_CARBON_ANNUAL, getNeutralDate } from './offsetCalculations';
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

    const neutralText = neutralDate.month === -1 ? "you will not reach carbon neutrality" : `you will reach carbon neutrality by the end of ${getDateText(neutralDate)}`;

    return (
      <div id="leftPanel">
        <div id="header">
          <h1>Carbon Offset Simulator</h1>
        </div>
        <OffsetPlanForm updateFormData={this.props.updateFormData} totalTrees={this.props.totalTrees}></OffsetPlanForm>
        <div id="summary">
          <p>
            The average person in your country produces {this.props.estimatedProduction} tons of carbon dioxide per year.
            This amount would require {requiredTrees} trees to compensate for annual emissions.
          </p>
          <p>
            With your current offset plan, {neutralText}.
          </p>
        </div>
      </div>
    );
  }
}