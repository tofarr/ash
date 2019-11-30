import React, { FC } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

export interface YearSelectProps{
  onPrev: () => void;
  onNext: () => void;
}

const SerialNavigation: FC<YearSelectProps> = ({ onPrev, onNext, children}) => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Grid container justify="space-between" alignItems="center" spacing={1}>
      <Grid item>
        <Button variant="contained" onClick={onPrev}>
          <NavigateBeforeIcon />
          {smUp && "Previous"}
        </Button>
      </Grid>
      <Grid item xs>
        <Box textAlign="center">
          {children}
        </Box>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={onNext}>
          {smUp && "Next"}
          <NavigateNextIcon />
        </Button>
      </Grid>
    </Grid>
  )
}


export default SerialNavigation;
