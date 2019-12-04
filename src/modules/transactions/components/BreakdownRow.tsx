import React, { ChangeEvent, FC } from 'react';
import { Collapse, Grid, TextField } from '@material-ui/core';

import TransactionBreakdown from '../types/TransactionBreakdown';
import TransactionBreakdownCode, { describeTransactionBreakdownCode } from '../types/TransactionBreakdownCode';

import CodeSelect from '../../utils/components/CodeSelect';
import MoneyInput from '../../utils/money/MoneyInput';


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
        <CodeSelect
          label="Type"
          value={breakdown.code}
          keyFn={(code: TransactionBreakdownCode) => code}
          titleFn={describeTransactionBreakdownCode}
          descriptionFn={describeTransactionBreakdownCode}
          options={Object.keys(TransactionBreakdownCode) as TransactionBreakdownCode[]}
          onChange={(code: TransactionBreakdownCode) =>
            onChange({ ...breakdown,
               code,
               description: code === TransactionBreakdownCode.OTHER ? undefined : describeTransactionBreakdownCode(code) })} />
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
      <Grid item xs={12}>
        <Collapse in={!!breakdown.code}>
          <TextField
            required={descriptionRequired}
            fullWidth
            multiline
            label="Description"
            variant="outlined"
            value={breakdown.description}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange({ ...breakdown, description: event.target.value})} />
        </Collapse>
      </Grid>
    </Grid>
  );
}

TransactionBreakdownRow.defaultProps = {
  descriptionRequired: false
}

export default TransactionBreakdownRow;
