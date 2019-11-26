import React, { ChangeEvent, FC, useState } from 'react';
import TransactionBreakdown from '../models/TransactionBreakdown';
import { Box,  Grid, TextField } from '@material-ui/core';

import MoneyInput from '../../../utils/money/components/MoneyInput';

export interface TransactionBreakdownRowProps{
  breakdown: TransactionBreakdown;
  onChange: (breakdown: TransactionBreakdown) => void;
  descriptionRequired?: boolean;
  amtRequired?: boolean;
}

const TransactionBreakdownRow: FC<TransactionBreakdownRowProps> = ({ breakdown, onChange, children, descriptionRequired, amtRequired}) => {

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm>
        <TextField
          required={descriptionRequired}
          fullWidth
          multiline
          label="Description"
          variant="outlined"
          value={breakdown.description}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange({ ...breakdown, description: event.target.value})} />
      </Grid>
      <Grid item xs sm={4}>
        <MoneyInput
          label="Amount"
          value={breakdown.amt}
          required={amtRequired}
          onChange={(amt) => onChange({ ...breakdown, amt })} />
      </Grid>
      <Grid item>
        {children}
      </Grid>
    </Grid>
  );
}

TransactionBreakdownRow.defaultProps = {
  descriptionRequired: false
}

export default TransactionBreakdownRow;
