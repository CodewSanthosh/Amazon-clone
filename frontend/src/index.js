import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

import { Provider } from "react-redux";
import Store from "./redux/store";

// Global axios config for cross-origin cookie support
axios.defaults.withCredentials = true;

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
