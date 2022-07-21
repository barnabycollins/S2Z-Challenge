import React from "react";
import { OffsetPlanEntry } from './constructs';
import { OffsetPlanForm } from './OffsetPlanForm';

interface LeftPanelProps {
  updatePlan(newPlan: OffsetPlanEntry[]): void
};

export default class LeftPanel extends React.Component<LeftPanelProps, {}> {
  render() {
    return (
      <div id="leftPanel">
        <OffsetPlanForm updatePlan={this.props.updatePlan}></OffsetPlanForm>
      </div>
    );
  }
}