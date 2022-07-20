import React from "react";
import OffsetPlanEntry from './constructs';

interface LeftPanelProps {
  updatePlan(newPlan: OffsetPlanEntry[]): void
};

export default class LeftPanel extends React.Component<LeftPanelProps, {}> {
  render() {
    return (
      <div id="header">
        <h1>Carbon Offset Simulation Tool</h1>
      </div>
    );
  }
}