import React, { FunctionComponent, FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

export interface AppRoute{
  path: string;
  component: FunctionComponent;
  fuzzy?: boolean
}

interface ControllerProps{
  routes: AppRoute[];
  defaultRedirect?: string;
  defaultComponent?: FunctionComponent;
}

const Controller: FC<ControllerProps> = ({ routes, defaultRedirect, defaultComponent }) => {

  return (<Switch>
    {routes.map((route) => <Route key={route.path} path={route.path} exact={!route.fuzzy} component={route.component} />)}
    {!!defaultRedirect && <Redirect to={defaultRedirect} />}
    {defaultComponent}
  </Switch>);
}

export default Controller;
