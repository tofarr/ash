import React, { FC } from 'react';
import { Grid } from '@material-ui/core';

import SerialNavigation from '../../../utils/SerialNavigation';

export interface YearNavigationProps{
  value?: number;
  onChange: (year: number) => void;
}

const YearNavigation: FC<YearNavigationProps> = ({ value, onChange}) => {
  if(!value){
    return null;
  }
  return (
    <SerialNavigation
      onPrev={() => { onChange(value - 1) }}
      onNext={() => { onChange(value + 1) }}>
      <Grid container justify="center">
        <Grid item>
          {value}
        </Grid>
      </Grid>
    </SerialNavigation>
  );
}

export default YearNavigation;
