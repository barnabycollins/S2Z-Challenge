import React from 'react';
import { ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar } from 'recharts';
import { carbonIntakeAtDate, cumulativeCarbonAtDate, cumulativeExpenditureToYear, estimatedProductionAtDate, estimatedCumulativeProductionAtDate, expenditureInYear } from './offsetCalculations';
import { MonthDate, OffsetPlanEntry } from './constructs';
import { graphMonthRange, getDateText, graphYearRange } from './dates';

interface GraphProps {
  offsetPlan: OffsetPlanEntry[]
};

interface CarbonGraphProps extends GraphProps {
  estimatedProduction: number,
  graphType: "cumulative" | "intake"
}

interface CarbonGraphDataEntry {
  monthDate: MonthDate,
  monthName: string,
  offset: number
}

const graphMargins = { top: 20, right: 20, left: 20, bottom: 20 };

class CarbonGraph extends React.Component<CarbonGraphProps> {
  offsetFunction: (offsetPlan: OffsetPlanEntry[], carbonDate: MonthDate) => number;
  estimateFunction: (yearlyRate: number, carbonDate: MonthDate) => number;

  constructor(props: CarbonGraphProps) {
    super(props);

    if (props.graphType === "cumulative") {
      this.offsetFunction = cumulativeCarbonAtDate;
      this.estimateFunction = estimatedCumulativeProductionAtDate;
    }
    else {
      this.offsetFunction = carbonIntakeAtDate;
      this.estimateFunction = estimatedProductionAtDate;
    }
  }

  render() {
    const data: CarbonGraphDataEntry[] = graphMonthRange.map((month: MonthDate) => ({
      monthDate: month,
      monthName: getDateText(month),
      offset: this.offsetFunction(this.props.offsetPlan, month),
      estimatedConsumption: this.estimateFunction(this.props.estimatedProduction, month)
    }));

    const unit = this.props.graphType === "cumulative" ? "tons" : "tons pcm";
    const yLabel = this.props.graphType === "cumulative" ? "Cumulative Carbon" : "Monthly Carbon Intake";
  
    return (
      <ResponsiveContainer width={800} height="33%">
        <ComposedChart data={data} margin={graphMargins}>
          <CartesianGrid />
          <Area type="monotone" dataKey="offset" stroke="#006600" fill="#006600" />
          <Line type="monotone" dataKey="estimatedConsumption" stroke="#990000" dot={false} />
          <XAxis dataKey="monthName" />
          <YAxis label={{value: yLabel, angle: -90, position: "insideLeft", style: { textAnchor: 'middle' }}} />
          <Tooltip formatter={(value: number) => `${(Math.round(value * 1000)/1000).toFixed(3)} ${unit}`} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
};

interface CostGraphDataEntry {
  year: number,
  yearlyExpenditure: number,
  cumulativeCost: number
}

class CostGraph extends React.Component<GraphProps> {
  render() {
    const data: CostGraphDataEntry[] = graphYearRange.map((year: number) => ({
      year: year,
      yearlyExpenditure: expenditureInYear(this.props.offsetPlan, year),
      cumulativeCost: cumulativeExpenditureToYear(this.props.offsetPlan, year)
    }));
  
    return (
      <ResponsiveContainer width={800} height="33%">
        <ComposedChart data={data} margin={graphMargins}>
          <CartesianGrid />
          <Area type="monotone" dataKey="cumulativeCost" stroke="#444499" fill="#444499" />
          <Bar type="monotone" dataKey="yearlyExpenditure" barSize={10} />
          <XAxis dataKey="year" />
          <YAxis label={{value: "Cost ($)", angle: -90, position: "insideLeft", style: { textAnchor: 'middle' }}} />
          <Tooltip formatter={(value: number) => `$${value}`} allowEscapeViewBox={{ x: false, y: false }} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
};

interface RightPanelProps {
  offsetPlan: OffsetPlanEntry[],
  estimatedProduction: number
}

class RightPanel extends React.Component<RightPanelProps> {
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

export default RightPanel;