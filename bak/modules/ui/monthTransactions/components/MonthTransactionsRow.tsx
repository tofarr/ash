import React, { FC } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import Money from '../../../utils/money/components/Money';

export interface MonthTransactionsRowProps{
  label: string;
  receipts: number;
  primary: number;
  other: number;
  onEdit: () => void;
}

const MonthTransactionsRow: FC<MonthTransactionsRowProps> = ({ label, receipts, primary, other, onEdit }) => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Box pb={1}>
      <Button
        fullWidth
        variant="contained"
        onClick={() => onEdit()}>
        <Grid container alignItems="center">
          <Grid item xs={smUp ? 6 : 12} style={{textAlign:'left'}}>
            {label}
          </Grid>
          <Grid item xs={smUp ? 2 : 4}>
            <Money value={receipts} />
          </Grid>
          <Grid item xs={smUp ? 2 : 4}>
            <Money value={primary} />
          </Grid>
          <Grid item xs={smUp ? 2 : 4}>
            <Money value={other} />
          </Grid>
        </Grid>
      </Button>
    </Box>
  );
}

export default MonthTransactionsRow;
