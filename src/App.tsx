import React from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Settings from './modules/persistent/settings/Settings';
import SettingsLoader from './modules/persistent/settings/components/SettingsLoader';
import NavBarController from './modules/ui/nav/NavBarController';
import NavMenuController, { NAV_MENU_PATH } from './modules/ui/nav/NavMenuController';

import './App.css';
import MonthListController, { MONTH_LIST_PATH } from './modules/persistent/months/components/MonthListController';
//import YearController, { YEAR_PATH } from './modules/persistent/months/components/YearController';
import MonthTransactionsController, { MONTH_TRANSACTIONS_PATH } from './modules/ui/monthTransactions/components/MonthTransactionsController';

const App: React.FC = () => {
  return (
    <SettingsLoader>
      {(settings: Settings) => (
        <Router>
          <NavBarController settings={settings} />
          <Switch>
            <Route path={NAV_MENU_PATH} exact={true} component={() => <NavMenuController settings={settings} />} />
            {/*<Route path={YEAR_PATH} exact={false} component={() => <YearController settings={settings} />} />
            <Redirect to={YEAR_PATH} />*/}
            <Route path={MONTH_LIST_PATH} exact={false} component={() => <MonthListController settings={settings} />} />
            <Route path={MONTH_TRANSACTIONS_PATH} exact={false} component={() => <MonthTransactionsController settings={settings} />} />
            <Redirect from="/" to={NAV_MENU_PATH} />
          </Switch>
        </Router>
      )}
    </SettingsLoader>
  );
}

export default App;
