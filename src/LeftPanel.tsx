import React from "react";
import { OffsetPlanEntry } from './constructs';
import { OffsetPlanForm } from './OffsetPlanForm';

interface LeftPanelProps {
  updatePlan(newPlan: OffsetPlanEntry[]): void,
  totalTrees: number
};

export default class LeftPanel extends React.Component<LeftPanelProps, {}> {
  render() {
    return (
      <div id="leftPanel">
        <OffsetPlanForm updatePlan={this.props.updatePlan} totalTrees={this.props.totalTrees}></OffsetPlanForm>
      </div>
    );
  }
}