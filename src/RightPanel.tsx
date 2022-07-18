import { LineChart, Line } from 'recharts';

function Graph() {
  const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];

  return (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  );
};

function RightPanel() {
  return (
    <div id="rightPanel">
      <Graph></Graph>
    </div>
  );
};

export default RightPanel;