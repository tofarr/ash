import React, { FC } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';

interface AlertProps{
  msg: string;
}

const Alert: FC<AlertProps> = ({ msg }) => {
  return (
    <Box p={2}>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h6">{msg}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Alert;
