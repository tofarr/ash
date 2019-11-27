import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import moment from 'moment';
import { Box, Grid, TextField, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Loader from '../../../utils/Loader';
import TransferToBranch from '../TransferToBranch'
import { fillAndDownloadTO62ForTransfer } from '../TransferToBranchService';

import TransactionBreakdownList from '../../../persistent/transactions/components/TransactionBreakdownList';

import DateSelect from '../../../utils/DateSelect';
import SerialNavigation from '../../../utils/SerialNavigation';
import useSettings from '../../../persistent/settings/useSettings';

export interface TransferToBranchFormProps{
  transfer: TransferToBranch;
  onSubmit: (transfer: TransferToBranch) => void;
  working: boolean;
}

const TransferToBranchForm: FC<TransferToBranchFormProps> = ({ transfer, onSubmit, working }) => {

  const [internalTransfer, setInternalTransfer] = useState(transfer);
  const settings = useSettings();
  const forMonth = moment()
    .startOf('month')
    .year(internalTransfer.for_year)
    .month(internalTransfer.for_month -1);

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    onSubmit(internalTransfer);
  }

  function handleMonth(delta: number){
    const m = forMonth.clone().add(delta, 'months');
    setInternalTransfer({ ...internalTransfer,
       for_year: m.year(),
       for_month: m.month()+1});
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box p={2}>
        <Grid container spacing={1} justify="space-between" alignItems="center">
          <Grid item xs={12} sm='auto'>
            <Typography variant="caption">For Month</Typography>
            <SerialNavigation
              onPrev={() => handleMonth(-1)}
              onNext={() => handleMonth(+1)}>
              {forMonth.format(settings.formatting.month_format)}
            </SerialNavigation>
          </Grid>
          <Grid item xs={12} sm='auto'>
            <DateSelect
              year={internalTransfer.year}
              month={internalTransfer.month}
              day={internalTransfer.day}
              onDateChange={(year: number, month: number, day: number) => {
                setInternalTransfer({
                  ...internalTransfer, year, month, day,
                });
              }}
              label="Date of Transfer" />
          </Grid>
          <Grid item xs={12} md='auto'>
            <TextField
              required
              fullWidth
              label="Confirmation Code"
              variant="outlined"
              value={internalTransfer.confirmation_code}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setInternalTransfer({ ...internalTransfer, confirmation_code: event.target.value})} />
          </Grid>
          <Grid item xs={12}>
            <TransactionBreakdownList breakdowns={internalTransfer.breakdown}
              onChange={breakdown => setInternalTransfer({ ...internalTransfer, breakdown })} />
          </Grid>
          <Grid item xs={12}>
            <Box p={2} pl={0} pr={0}>
              <Grid container justify="flex-end" spacing={1}>
                <Grid item xs={12} sm="auto">
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => fillAndDownloadTO62ForTransfer(internalTransfer)}>
                    Generate TO-62
                  </Button>
                </Grid>
                <Grid item xs={12} sm="auto">
                  {working ?
                    <Loader />
                    :
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="primary">
                      <AddIcon />
                      Add Transfer
                    </Button>
                  }
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}


export default TransferToBranchForm;
