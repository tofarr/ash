import React, { FC } from 'react';
import moment from 'moment';
import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Msg from '../Msg';
import MsgIcon from './MsgIcon';

export interface MsgListProps {
  msgs: Msg[];
  onClearMsgs?: () => void;
  dateFormat: string;
}

const MsgList: FC<MsgListProps> = ({ msgs, onClearMsgs, dateFormat }) => {

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
          <Typography variant="caption">{m.format(dateFormat)}</Typography>
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
