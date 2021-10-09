import React from "react";
import { Provider } from "react-redux";
import store from "../store";
import RootRouter from "../routers/Router.js";

export default function RootContainer() {
  return (
    <Provider store={store}>
      <RootRouter />
    </Provider>
  );
}

