import React from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { FormDataType, OffsetPlanEntry }  from './constructs';
import './App.scss';

interface AppProps {};
interface AppState {
  offsetPlan: OffsetPlanEntry[],
  yearsOverMaxTrees: string[],
  totalTrees: number,
  estimatedProduction: number,
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      yearsOverMaxTrees: [],
      offsetPlan: [],
      totalTrees: 0,
      estimatedProduction: 0
    };
  }

  updateFormData(formData: FormDataType) {
    let yearlyTrees: {[year: string]: number} = {};
    let totalTrees = 0;

    formData.offsetPlan.forEach((entry) => {
      totalTrees += entry.trees;

      const year = entry.date.year;
      yearlyTrees[year] = year in yearlyTrees ? yearlyTrees[year] + entry.trees : entry.trees;
    });

    const yearsOverMaxTrees: string[] = Object.keys(yearlyTrees).filter(key => yearlyTrees[key] > 55);

    this.setState({
      ...this.state,
      yearsOverMaxTrees: yearsOverMaxTrees,
      offsetPlan: formData.offsetPlan,
      totalTrees: totalTrees,
      estimatedProduction: formData.estimatedProduction
    });
  }

  render() {
    const treeQuantityWarning = (() => {
      const yearCount = this.state.yearsOverMaxTrees.length;
      const isPlural = yearCount > 1;

      if (yearCount > 0) {
        return <div>{`
          Warning: the year${isPlural ? "s" : ""} ${this.state.yearsOverMaxTrees.join(", ")}
          ${isPlural ? "have" : "has"} too many tree planting operations!
          Please consider reducing the number of trees planted in this year below the 55-tree maximum.
        `}</div>;
      }
      else return <></>;
    })();

    return (
      <div id="app">
        <LeftPanel
          updateFormData={this.updateFormData.bind(this)}
          totalTrees={this.state.totalTrees}
          estimatedProduction={this.state.estimatedProduction}
          offsetPlan={this.state.offsetPlan}
        ></LeftPanel>
        <RightPanel offsetPlan={this.state.offsetPlan} estimatedProduction={this.state.estimatedProduction}></RightPanel>
      </div>
    );
  }
}

export default App;
