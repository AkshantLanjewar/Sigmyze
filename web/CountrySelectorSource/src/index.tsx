import * as React from "react"
import { render } from "react-dom";
import TestComponent from "./test-component";
 
const App = () => <div><TestComponent /></div>;

render(<App />, document.getElementById("app"))