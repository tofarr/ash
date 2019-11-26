import React, { FC, Fragment, MouseEvent, ReactNode, useState } from 'react';
import { Box, Button, Dialog, Grid } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

export interface ConfirmButtonProps extends ButtonProps{
  confirmText?: string|ReactNode;
}

const ConfirmButton: FC<ConfirmButtonProps> = (props) => {

  const [open, setOpen] = useState(false);

  function handleClick(event: MouseEvent<HTMLButtonElement>){
    setOpen(false);
    if(props.onClick){
      props.onClick(event);
    }
  }

  return (
    <Fragment>
      <Button {...props} onClick={() => setOpen(true)} />
      <Dialog open={open}>
        <Box p={2}>
          <Grid container spacing={2} >
            <Grid item xs={12}>
              {props.confirmText}
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth color="default" variant="contained" onClick={() => setOpen(false)}>
                No
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth color="primary" variant="contained" onClick={handleClick}>
                Yes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Fragment>
  )
}

ConfirmButton.defaultProps = {
  confirmText: 'Are You Sure?'
}

export default ConfirmButton;
