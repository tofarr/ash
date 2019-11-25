import React from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Settings from './modules/persistent/settings/Settings';
import SettingsLoader from './modules/persistent/settings/components/SettingsLoader';
import CustomTheme from './modules/utils/CustomTheme';
import NavBarController from './modules/ui/nav/NavBarController';
import NavMenuController, { NAV_MENU_PATH } from './modules/ui/nav/NavMenuController';
import CurrentMsgContainer from './modules/utils/msgs/components/CurrentMsgContainer';
import CurrentMsgBar from './modules/utils/msgs/components/CurrentMsgBar';

import './App.css';
import MonthListController, { MONTH_LIST_PATH } from './modules/persistent/months/components/MonthListController';
import MonthTransactionsController, { MONTH_TRANSACTIONS_PATH } from './modules/ui/monthTransactions/components/MonthTransactionsController';
import CreateTransactionController, { CREATE_TRANSACTION_PATH } from './modules/persistent/transactions/components/CreateTransactionController';
import UpdateTransactionController, { UPDATE_TRANSACTION_PATH } from './modules/persistent/transactions/components/UpdateTransactionController';

const App: React.FC = () => {
  return (
    <SettingsLoader>
      {(settings: Settings) => (
        <CustomTheme>
          <Router>
            <NavBarController settings={settings}>
              {(setTitle) => {
                return (
                  <Switch>
                    <Route path={NAV_MENU_PATH} exact={true} component={() => <NavMenuController settings={settings} setTitle={setTitle} />} />
                    <Route path={MONTH_LIST_PATH} exact={false} component={() => <MonthListController settings={settings} setTitle={setTitle} />} />
                    <Route path={MONTH_TRANSACTIONS_PATH} exact={false} component={() => <MonthTransactionsController settings={settings} setTitle={setTitle} />} />
                    <Route path={CREATE_TRANSACTION_PATH} exact={false} component={() => <CreateTransactionController settings={settings} setTitle={setTitle} />} />
                    <Route path={UPDATE_TRANSACTION_PATH} exact={false} component={() => <UpdateTransactionController settings={settings} setTitle={setTitle} />} />
                    <Redirect from="/" to={NAV_MENU_PATH} />
                  </Switch>
                )
              }}
            </NavBarController>
            <CurrentMsgContainer>
              {(msg) => <CurrentMsgBar msg={msg} />}
            </CurrentMsgContainer>
          </Router>
        </CustomTheme>
      )}
    </SettingsLoader>
  );
}

export default App;
