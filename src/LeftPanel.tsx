import React from "react";
import { FormDataType } from './constructs';
import { OffsetPlanForm } from './OffsetPlanForm';

interface LeftPanelProps {
  updateFormData(formData: FormDataType): void,
  totalTrees: number
};

export default class LeftPanel extends React.Component<LeftPanelProps, {}> {
  render() {
    return (
      <div id="leftPanel">
        <div id="header">
          <h1>Carbon Offset Simulator</h1>
        </div>
        <OffsetPlanForm updateFormData={this.props.updateFormData} totalTrees={this.props.totalTrees}></OffsetPlanForm>
        <div id="summary">
          <p>Average personal consumption: many tons per year.</p>
          <p>Minimum number of fully-grown trees required to replenish this annual usage: </p>
        </div>
      </div>
    );
  }
}