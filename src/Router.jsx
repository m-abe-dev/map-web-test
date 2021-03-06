import React from "react";
import { Route, Switch } from "react-router";
import Auth from "./Auth";
import { Home, SignUp, SignIn, Reset, Map } from "./templates";

const Router = () => {
  return (
    <Switch>
      <Route exact path={"/signup"} component={SignUp} />
      <Route exact path={"/signin"} component={SignIn} />
      <Route exact path={"/signin/reset"} component={Reset} />

      <Auth>
        <Route exact path={"(/)?"} component={Home} />
        <Route exact path={"/map"} component={Map} />
      </Auth>
    </Switch>
  );
};

export default Router;
