import React, { FC, Fragment, useState } from 'react';
import { Box, Button, Dialog, Typography } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';


import Msg from '../Msg';
import MsgList from './MsgList';

export interface MsgDialogProps {
  msgs: Msg[];
  onClearMsgs?: () => void;
}

const MsgDialog: FC<MsgDialogProps> = ({ msgs, onClearMsgs }) => {

  const [open,setOpen] = useState(false);

  function handleClearMsgs(){
    setOpen(false);
    if(onClearMsgs){
      onClearMsgs();
    }
  }

  return (
    <Fragment>
      {!!msgs.length &&
        <Button color="inherit" onClick={() => setOpen(true)}>
          <Box pr={1}>
            <Typography variant="caption">{msgs.length}</Typography>
          </Box>
          <MessageIcon />
        </Button>
      }
      <Dialog open={open} onClose={() => setOpen(false)}>
        <MsgList msgs={msgs} onClearMsgs={handleClearMsgs} />
      </Dialog>
    </Fragment>
  );
}

export default MsgDialog;
