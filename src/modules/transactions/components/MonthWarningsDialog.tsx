import React, { FC } from 'react';
import { Box, Dialog, Grid, Typography } from '@material-ui/core';
import WarningList from './WarningList';

export interface MonthWarningsDialogProps{
  open: boolean;
  onClose: () => void;
  warnings?: string[];
  working: boolean;
}


const MonthWarningsDialog: FC<MonthWarningsDialogProps> = ({ open, onClose, warnings, working }) => {

  return (
    <Dialog open={open} onClose={onClose}>
      <Box p={1}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h6">Warnings</Typography>
          </Grid>
          <WarningList warnings={warnings} working={working} />
        </Grid>
      </Box>
    </Dialog>
  )
}

export default MonthWarningsDialog
