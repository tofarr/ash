import React from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Settings from './modules/settings/Settings';
import SettingsLoader from './modules/settings/components/SettingsLoader';
import CustomTheme from './modules/utils/components/CustomTheme';
import NavBarController from './modules/nav/NavBarController';
import NavMenuController, { NAV_MENU_PATH } from './modules/nav/NavMenuController';
import CurrentMsgContainer from './modules/utils/msgs/components/CurrentMsgContainer';
import CurrentMsgBar from './modules/utils/msgs/components/CurrentMsgBar';

import './App.css';
import CreateMeetingController, { CREATE_MEETING_PATH } from './modules/meetings/components/CreateMeetingController';
import CreateDepositController, { CREATE_DEPOSIT_PATH } from './modules/deposits/components/CreateDepositController';
import CreateTransactionController, { CREATE_TRANSACTION_PATH } from './modules/transactions/components/CreateTransactionController';
import MonthTransactionsController, { MONTH_TRANSACTIONS_PATH } from './modules/transactions/components/MonthTransactionsController';
import MonthWarningsController, { MONTH_WARNINGS_PATH } from './modules/transactions/components/MonthWarningsController';
import UpdateTransactionController, { UPDATE_TRANSACTION_PATH } from './modules/transactions/components/UpdateTransactionController';
import DateBalanceController, { DATE_BALANCE_PATH } from './modules/transactions/components/DateBalanceController';
import CreateTransferToBranchController, { CREATE_TRANSFER_PATH } from './modules/transferToBranch/components/CreateTransferToBranchController';
import MonthListController, { MONTH_LIST_PATH } from './modules/months/MonthListController';
import SettingsController, { SETTINGS_PATH } from './modules/settings/components/SettingsController';
import ContributionBoxesController, { CONTRIBUTION_BOXES_PATH } from './modules/contributionBoxes/components/ContributionBoxesController';
import CreateContributionBoxController, { CREATE_CONTRIBUTION_BOX_PATH } from './modules/contributionBoxes/components/CreateContributionBoxController';
import UpdateContributionBoxController, { UPDATE_CONTRIBUTION_BOX_PATH } from './modules/contributionBoxes/components/UpdateContributionBoxController';

import DefaultBreakdownController, { DEFAULT_BREAKDOWN_PATH } from './modules/transferToBranch/components/DefaultBreakdownController';
import BackupsController, { BACKUPS_PATH } from './modules/backups/components/BackupsController';


const App: React.FC = () => {
  return (
    <SettingsLoader>
      {(settings: Settings) => (
        <CustomTheme>
          <Router>
            <NavBarController>
              {(setTitle) => {
                return (
                  <Switch>
                    <Route path={NAV_MENU_PATH} component={() => <NavMenuController setTitle={setTitle} />} />
                    <Route path={CREATE_MEETING_PATH} component={() => <CreateMeetingController setTitle={setTitle} />} />
                    <Route path={CREATE_DEPOSIT_PATH} component={() => <CreateDepositController setTitle={setTitle} />} />
                    <Route path={CREATE_TRANSFER_PATH} component={() => <CreateTransferToBranchController setTitle={setTitle} />} />
                    <Route path={CREATE_TRANSACTION_PATH} component={() => <CreateTransactionController setTitle={setTitle} />} />
                    <Route path={UPDATE_TRANSACTION_PATH} component={() => <UpdateTransactionController setTitle={setTitle} />} />
                    <Route path={MONTH_TRANSACTIONS_PATH} component={() => <MonthTransactionsController setTitle={setTitle} />} />
                    <Route path={MONTH_WARNINGS_PATH} component={() => <MonthWarningsController setTitle={setTitle} />} />
                    <Route path={DATE_BALANCE_PATH} component={() => <DateBalanceController setTitle={setTitle} />} />
                    <Route path={MONTH_LIST_PATH} component={() => <MonthListController setTitle={setTitle} />} />
                    <Route path={SETTINGS_PATH} component={() => <SettingsController setTitle={setTitle} />} />
                    <Route path={CONTRIBUTION_BOXES_PATH} component={() => <ContributionBoxesController setTitle={setTitle} />} />
                    <Route path={CREATE_CONTRIBUTION_BOX_PATH} component={() => <CreateContributionBoxController setTitle={setTitle} />} />
                    <Route path={UPDATE_CONTRIBUTION_BOX_PATH} component={() => <UpdateContributionBoxController setTitle={setTitle} />} />
                    <Route path={DEFAULT_BREAKDOWN_PATH} component={() => <DefaultBreakdownController setTitle={setTitle} />} />
                    <Route path={BACKUPS_PATH} component={() => <BackupsController setTitle={setTitle} />} />
                    <Redirect from="/" exact={true} to={NAV_MENU_PATH} />
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
