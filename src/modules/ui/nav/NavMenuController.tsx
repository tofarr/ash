import React, { FC, Component } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { CREATE_MEETING_PATH } from '../meetings/components/CreateMeetingController';
import { CREATE_DEPOSIT_PATH } from '../deposits/components/CreateDepositController';
import { CREATE_TRANSACTION_PATH } from '../../persistent/transactions/components/CreateTransactionController';
import { MONTH_LIST_PATH } from '../../persistent/months/components/MonthListController';
import { currentMonthPath } from '../monthTransactions/components/MonthTransactionsController';


export interface NavMenuProps {
  onClick?: () => void;
  setTitle: (title: string) => void;
}

export const NAV_MENU_PATH = "/nav"

const NavMenuController: FC<NavMenuProps> = ({ onClick, setTitle }) => {
  setTitle('Accounts Servant Helper');
  const { push } = useHistory();

  function handleClick(destination: string){
    push(destination);
    if(onClick){
      onClick();
    }
  }

  function renderMenuItem(label: string, destination: string, icon?: Component,){
    return (
      <Grid item xs>
        <Box pb={1}>
          <Button fullWidth variant="contained" onClick={() => handleClick(destination)}>
            {icon}
            {label}
          </Button>
        </Box>
      </Grid>
    );
  }

  return (
    <Box p={1}>
      <Grid container direction="column">
        {renderMenuItem('Add Meeting', CREATE_MEETING_PATH)}
        {renderMenuItem('Add Deposit', CREATE_DEPOSIT_PATH)}
        {renderMenuItem('Add WEFTS Transfer', '/add-wefts')}
        {renderMenuItem('Add Transaction', CREATE_TRANSACTION_PATH)}
        {renderMenuItem('Current Month', currentMonthPath())}
        {renderMenuItem('Select Month', MONTH_LIST_PATH)}
        {renderMenuItem('Settings', '/settings')}
      </Grid>
    </Box>
  );
}

export default NavMenuController;
