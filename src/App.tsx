import React from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { FormDataType, OffsetPlanEntry }  from './constructs';
import './App.scss';

interface AppProps {};
interface AppState {
  offsetPlan: OffsetPlanEntry[],
  totalTrees: number,
  estimatedProduction: number,
};

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      offsetPlan: [],
      totalTrees: 0,
      estimatedProduction: 0
    };
  }

  updateFormData(formData: FormDataType) {
    const totalTrees = formData.offsetPlan.reduce((total, entry) => total + entry.trees, 0);

    this.setState({
      ...this.state,
      offsetPlan: formData.offsetPlan,
      totalTrees: totalTrees,
      estimatedProduction: formData.estimatedProduction
    });
  }

  render() {
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
