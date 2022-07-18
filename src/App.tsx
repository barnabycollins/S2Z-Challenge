import Form from './Form';
import RightPanel from './RightPanel';
import './App.scss';

function Header() {
  return (
    <div id="header">
      <h1>Carbon Offset Simulation Tool</h1>
    </div>
  );
}

function Main() {
  return (
    <div id="main">
      <Form></Form>
      <RightPanel></RightPanel>
    </div>
  );
}

function App() {

  return (
    <div id="app">
      <Header></Header>
      <Main></Main>
    </div>
  );
}

export default App;
