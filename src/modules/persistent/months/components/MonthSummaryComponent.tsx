import React, { FC } from 'react';
import moment from 'moment';
import { Box, Button, Chip, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import Settings from '../../../persistent/settings/Settings';

export interface MonthSummaryComponentProps {
  year: number;
  month: number;
  hasData: boolean;
  settings: Settings;
  onSelect: (year: number, month: number, hasData: boolean) => void;
}

const MonthSummaryComponent: FC<MonthSummaryComponentProps> = ({ year, month, hasData, onSelect, settings }) => {

  const isCurrent = moment().month() == month && moment().year() == year;

  return (
    <Box pb={1}>
      <Button
        fullWidth
        variant="contained"
        color={isCurrent ? "primary" : "default"}
        onClick={() => onSelect(year, month, hasData)}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            {moment().startOf('month').year(year).month(month-1).format(settings.formatting.month_format)}
          </Grid>
          <Grid item style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            {hasData ? <EditIcon /> : <AddIcon /> }
          </Grid>
        </Grid>
      </Button>
    </Box>
  );
}

export default MonthSummaryComponent;
