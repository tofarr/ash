import React, { FC, Fragment } from 'react';
import { AppBar, Box, Collapse, Toolbar, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Msg from '../Msg';
import MsgType from '../MsgType';
import MsgIcon from './MsgIcon';

export interface CurrentMsgBarProps {
  msg: Msg|null;
}

const CurrentMsgBar: FC<CurrentMsgBarProps> = ({ msg }) => {

  const theme = useTheme();


  function renderMsg(){
    if(!msg){
      return null;
    }
    return (
      <Fragment>
        <MsgIcon msg={msg} color="inherit" />
        <Box pl={1}>
          <Typography color="inherit" style={{flexGrow: 1}}>
            {msg.msg}
          </Typography>
        </Box>
      </Fragment>
    );
  }

  function renderStyle(){
    if(!msg || msg.type === MsgType.Info){
      return {};
    }
    return {
      background: theme.palette.error.main,
      color: theme.palette.error.contrastText
    };
  }

  return (
    <AppBar>
      <Collapse in={!!msg}>
        <Toolbar color="primary" style={renderStyle()}>
          {renderMsg()}
        </Toolbar>
      </Collapse>
    </AppBar>
  );
}

export default CurrentMsgBar;
