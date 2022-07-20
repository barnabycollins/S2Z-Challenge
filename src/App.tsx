import React from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import OffsetPlanEntry from './constructs';
import './App.scss';

interface AppProps {};
interface AppState {
  offsetPlan: OffsetPlanEntry[]
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      offsetPlan: []
    };
  }

  updatePlan(newPlan: OffsetPlanEntry[]) {
    this.setState({
      offsetPlan: newPlan
    });
  }

  render() {
    return (
      <div id="app">
        <Header></Header>
        <AppBody updatePlan={this.updatePlan}></AppBody>
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div id="header">
        <h1>Carbon Offset Simulation Tool</h1>
      </div>
    );
  }
}

interface AppBodyProps {
  updatePlan(newPlan: OffsetPlanEntry[]): void
};

class AppBody extends React.Component<AppBodyProps, {}> {
  render() {
    return (
      <div id="main">
        <LeftPanel></LeftPanel>
        <RightPanel></RightPanel>
      </div>
    );
  }
}

export default App;
