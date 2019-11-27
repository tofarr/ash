import React, { ChangeEvent, FC } from 'react';
import { Collapse, Grid, TextField } from '@material-ui/core';

import TransactionBreakdown from '../models/TransactionBreakdown';
import TransactionBreakdownCode, { describeTransactionBreakdownCode } from '../models/TransactionBreakdownCode';

import CodeSelect from '../../../utils/CodeSelect';
import MoneyInput from '../../../utils/money/components/MoneyInput';

export interface TransactionBreakdownRowProps{
  breakdown: TransactionBreakdown;
  onChange: (breakdown: TransactionBreakdown) => void;
  descriptionRequired?: boolean;
  amtRequired?: boolean;
}

const TransactionBreakdownRow: FC<TransactionBreakdownRowProps> = ({ breakdown, onChange, children, descriptionRequired, amtRequired}) => {

  const isOther = breakdown.code == TransactionBreakdownCode.OTHER;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm>
        <CodeSelect
          label="Type"
          value={breakdown.code}
          required={true}
          keyFn={(code?: TransactionBreakdownCode) => code}
          titleFn={describeTransactionBreakdownCode}
          descriptionFn={describeTransactionBreakdownCode}
          options={Object.keys(TransactionBreakdownCode) as TransactionBreakdownCode[]}
          onChange={(code?: TransactionBreakdownCode) =>
            onChange({ ...breakdown,
               code: code as TransactionBreakdownCode,
               description: code === TransactionBreakdownCode.OTHER ? '' : describeTransactionBreakdownCode(code)})} />
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
        <Collapse in={isOther}>
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
