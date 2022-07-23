import React from 'react';
import { OffsetPlanEntry } from './constructs';
import { CarbonGraph, CostGraph } from './Graphs';

interface RightPanelProps {
  offsetPlan: OffsetPlanEntry[],
  estimatedProduction: number
}

export default class RightPanel extends React.Component<RightPanelProps> {
  render() {
    return (
      <div id="rightPanel">
        <CarbonGraph graphType="cumulative" offsetPlan={this.props.offsetPlan} estimatedProduction={this.props.estimatedProduction}></CarbonGraph>
        <CarbonGraph graphType="intake" offsetPlan={this.props.offsetPlan} estimatedProduction={this.props.estimatedProduction}></CarbonGraph>
        <CostGraph offsetPlan={this.props.offsetPlan}></CostGraph>
      </div>
    );
  }
};