import React, { FC } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

export interface YearSelectProps{
  onPrev: () => void;
  onNext: () => void;
}

const SerialNavigation: FC<YearSelectProps> = ({ onPrev, onNext, children}) => (
  <Box p={1}>
    <Grid container justify="space-between" alignItems="center">
      <Grid item>
        <Button variant="contained" onClick={onPrev}>
          <NavigateBeforeIcon />
          Previous
        </Button>
      </Grid>
      <Grid item>
        {children}
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={onNext}>
          Next
          <NavigateNextIcon />
        </Button>
      </Grid>
    </Grid>
  </Box>
);


export default SerialNavigation;
