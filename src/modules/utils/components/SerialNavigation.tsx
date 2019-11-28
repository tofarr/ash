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
    <Box p={1}>
      <Grid container justify="space-between" alignItems="center" spacing={1}>
        <Grid item>
          <Button variant="contained" onClick={onPrev}>
            <NavigateBeforeIcon />
            {smUp && "Previous"}
          </Button>
        </Grid>
        <Grid item xs>
          {children}
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={onNext}>
            {smUp && "Next"}
            <NavigateNextIcon />
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}


export default SerialNavigation;
