import React, { FC, useState } from 'react';
import Settings from '../../persistent/settings/Settings';
import { AppBar, Box, Button, Dialog, Grid, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Redirect, useParams, useHistory } from 'react-router-dom';

import NavMenuController, { NAV_MENU_PATH } from './NavMenuController';

export interface NavBarProps {
  settings: Settings;
}

const NavBarController: FC<NavBarProps> = ({ settings }) => {

  const [open, setOpen] = useState(false);
  const { push } = useHistory();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  function handleNavMenu(){
    if(smUp){
      setOpen(true);
    }else{
      push(NAV_MENU_PATH);
    }
  }
  return (
    <AppBar position="static">
      <Toolbar onClick={handleNavMenu}>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          Accounts Servant Helper
        </Typography>
      </Toolbar>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <NavMenuController settings={settings} onClick={() => setOpen(false)} />
      </Dialog>
    </AppBar>
  );
}

export default NavBarController;
