import React from 'react';
import { LineChart, Line } from 'recharts';

class Graph extends React.Component {
  render() {
    const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];
  
    return (
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
    );
  }
};

class RightPanel extends React.Component {
  render() {
    return (
      <div id="rightPanel">
        <Graph></Graph>
      </div>
    );
  }
};

export default RightPanel;