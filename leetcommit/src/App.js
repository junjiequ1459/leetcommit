import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import RootPage from "./component/RootPage/RootPage";
import InstructionPage from "./component/InstructionPage/InstructionPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <RootPage />
          </Route>
          <Route path="/instructions">
            <InstructionPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
