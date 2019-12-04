import React, { FC } from 'react';
import { Box, Grid } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import Loader from '../../utils/components/Loader';

export interface WarningListProps{
  warnings?: string[];
  working: boolean;
}

const WarningList: FC<WarningListProps> = ({ warnings, working }) => {

  function renderWarning(warning: string){
    return (
      <Grid key={warning} container spacing={1}>
        <Grid item>
          <Box color="error.main">
            <ErrorIcon />
          </Box>
        </Grid>
        <Grid item xs>
          {warning}
        </Grid>
      </Grid>
    );
  }

  if(working){
    return <Loader />
  }

  if(!warnings){
    return null;
  }

  return (
    <Grid container direction="column">
      {warnings.map(renderWarning)}
    </Grid>
  )
}

export default WarningList;
