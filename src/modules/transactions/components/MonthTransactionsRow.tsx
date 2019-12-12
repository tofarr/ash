import React, { FC, ReactNode } from 'react';

import { Box, Grid } from '@material-ui/core';

interface MonthTransactionsRowProps {
  description?: ReactNode;
  receipts: ReactNode;
  primary: ReactNode;
  other: ReactNode;
}

const MonthTransactionsRow: FC<MonthTransactionsRowProps> = ({ description, receipts, primary, other }) => (
  <Grid container spacing={1} justify="flex-end">
    {!!description &&
      <Grid item xs={12} md={6}>
        <Box textAlign="left">
          {description}
        </Box>
      </Grid>
    }
    <Grid item xs={4} md={2}>
      {receipts}
    </Grid>
    <Grid item xs={4} md={2}>
      {primary}
    </Grid>
    <Grid item xs={4} md={2}>
      {other}
    </Grid>
  </Grid>
);

export default MonthTransactionsRow
