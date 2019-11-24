import React, { FC, Fragment, ReactElement, useState } from 'react';
import Settings from '../../persistent/settings/Settings';
import { AppBar, Dialog, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import NavMenuController, { NAV_MENU_PATH } from './NavMenuController';

export interface NavBarProps {
  settings: Settings;
  children: (setTitle: (title: string) => void) => ReactElement | null;
}

const NavBarController: FC<NavBarProps> = ({ settings, children }) => {

  const [title, setTitle] = useState('Accounts Servant Heler');
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
    <Fragment>
      <AppBar position="static">
        <Toolbar onClick={handleNavMenu}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            {title}
          </Typography>
        </Toolbar>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <NavMenuController settings={settings} onClick={() => setOpen(false)} setTitle={setTitle} />
        </Dialog>
      </AppBar>
      {children(setTitle)}
    </Fragment>
  );
}

export default NavBarController;
