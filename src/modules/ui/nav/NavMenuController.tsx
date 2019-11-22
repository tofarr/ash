import React, { FC, Component } from 'react';
import Settings from '../../persistent/settings/Settings';
import { AppBar, Box, Button, Grid, IconButton, Menu, MenuItem, MenuList, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Redirect, useParams, useHistory } from 'react-router-dom';

import { MONTH_LIST_PATH } from '../../persistent/months/components/MonthListController';
import { currentMonthPath } from '../monthTransactions/components/MonthTransactionsController';


export interface NavMenuProps {
  settings: Settings;
  onClick?: () => void;
}

export const NAV_MENU_PATH = "/nav"

const NavMenuController: FC<NavMenuProps> = ({ settings, onClick }) => {
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
        {renderMenuItem('Add Meeting', '/add-meeting')}
        {renderMenuItem('Add Deposit', '/add-deposit')}
        {renderMenuItem('Add WEFTS Transfer', '/add-wefts')}
        {renderMenuItem('Add Generic Transaction', '/add-wefts')}
        {renderMenuItem('Current Month', currentMonthPath())}
        {renderMenuItem('Select Month', MONTH_LIST_PATH)}
      </Grid>
    </Box>
  );
}

export default NavMenuController;
