import React, { FC, Component } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { CREATE_MEETING_PATH } from '../meetings/components/CreateMeetingController';
import { CREATE_DEPOSIT_PATH } from '../deposits/components/CreateDepositController';
import { CREATE_TRANSFER_PATH } from '../transferToBranch/components/CreateTransferToBranchController';
import { CREATE_TRANSACTION_PATH } from '../transactions/components/CreateTransactionController';
import { monthTransactionsPath } from '../transactions/components/MonthTransactionsController';
import { monthListPath } from '../months/MonthListController';

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
        <Button fullWidth variant="contained" onClick={() => handleClick(destination)}>
          {icon}
          {label}
        </Button>
      </Grid>
    );
  }

  return (
    <Box p={1}>
      <Grid container direction="column" spacing={1}>
        {renderMenuItem('Add Meeting', CREATE_MEETING_PATH)}
        {renderMenuItem('Add Deposit', CREATE_DEPOSIT_PATH)}
        {renderMenuItem('Add Transfer To Branch', CREATE_TRANSFER_PATH)}
        {renderMenuItem('Add Transaction', CREATE_TRANSACTION_PATH)}
        {renderMenuItem('Current Month', monthTransactionsPath())}
        {renderMenuItem('Select Month', monthListPath())}
        {renderMenuItem('Settings', '/settings')}
        {renderMenuItem('Backups', '/backups')}

      </Grid>
    </Box>
  );
}

export default NavMenuController;
