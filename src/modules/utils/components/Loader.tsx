import React, { FC } from 'react';
import { Box, CircularProgress, Grid } from '@material-ui/core';

const Loader: FC = () => {
  return (
    <Box p={2}>
      <Grid container justify="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Loader;
