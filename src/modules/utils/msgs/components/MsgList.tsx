import React, { FC, Fragment, useState } from 'react';
import moment from 'moment';
import { AppBar, Box, Button, Dialog, Divider, Grid, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Settings from '../../../persistent/settings/Settings';

import Msg from '../Msg';
import MsgType from '../MsgType';
import MsgIcon from './MsgIcon';

export interface MsgListProps {
  msgs: Msg[];
  onClearMsgs?: () => void;
  settings: Settings;
}

const MsgList: FC<MsgListProps> = ({ msgs, settings, onClearMsgs }) => {

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  function renderMsg(msg: Msg){
    return (
      <Grid item key={msg.timestamp.getTime()}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={1} style={{minWidth:32}}>
            <MsgIcon msg={msg} />
          </Grid>
          <Grid item>
            {renderTimestamp(msg.timestamp)}
          </Grid>
          <Grid item xs>
            <Box pb={1} pt={1}>
              {msg.msg}
            </Box>
          </Grid>
        </Grid>
        <Divider />
      </Grid>
    )
  }

  function renderTimestamp(date: Date){
    const m = moment(date);
    return (
      <Grid container direction={smUp ? "row" : "column"} alignItems="center">
        <Grid item>
          <Typography variant="caption">{m.format(settings.formatting.date_format)}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">{m.format('HH:mm:ss')}</Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <Box p={2}>
      <Grid container spacing={1} justify="space-between" direction={smUp ? 'row' : 'column'}>
        <Grid item>
          <Typography gutterBottom variant="h5">Messages</Typography>
        </Grid>
        {!!onClearMsgs &&
          <Grid item xs sm='auto'>
            <Button fullWidth={!smUp} variant="contained" onClick={onClearMsgs}>
              Clear messages
            </Button>
          </Grid>
        }
      </Grid>
      <Grid container direction="column">
        <Box p={1}>
          {msgs.map(renderMsg)}
        </Box>
      </Grid>
    </Box>
  );
}

export default MsgList;
