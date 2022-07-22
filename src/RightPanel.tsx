import React from 'react';
import { LineChart, ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { cumulativeCarbonAtDate } from './carbonCalculation';
import { MonthDate, OffsetPlanEntry } from './constructs';
import { currentMonthRange, getDateText } from './dates';

interface GraphProps {
  offsetPlan: OffsetPlanEntry[]
};

interface GraphDataEntry {
  monthDate: MonthDate,
  monthName: string,
  value: number
}

class CumulativeCarbonGraph extends React.Component<GraphProps> {
  render() {
    const data: GraphDataEntry[] = currentMonthRange.map((month: MonthDate) => {
      return {
        monthDate: month,
        monthName: getDateText(month),
        value: cumulativeCarbonAtDate(this.props.offsetPlan, month)
      };
    });

    console.log(data);
  
    return (
      <ComposedChart width={400} height={400} data={data}>
        <Area type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid></CartesianGrid>
        <XAxis dataKey="monthName"></XAxis>
        <YAxis label={{value: "Cumulative carbon captured", angle: -90}}></YAxis>
        <Tooltip />
      </ComposedChart>
    );
  }
};

class CostGraph extends React.Component<GraphProps> {
  render() {
    const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];
  
    return (
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid></CartesianGrid>
        <XAxis></XAxis>
        <YAxis></YAxis>
      </LineChart>
    );
  }
};

interface RightPanelProps {
  offsetPlan: OffsetPlanEntry[]
}

class RightPanel extends React.Component<RightPanelProps> {
  render() {
    return (
      <div id="rightPanel">
        <CumulativeCarbonGraph offsetPlan={this.props.offsetPlan}></CumulativeCarbonGraph>
        <CostGraph offsetPlan={this.props.offsetPlan}></CostGraph>
      </div>
    );
  }
};

export default RightPanel;