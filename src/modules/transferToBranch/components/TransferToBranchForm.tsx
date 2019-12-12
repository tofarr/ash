import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Box, Grid, TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Loader from '../../utils/components/Loader';
import TransferToBranch from '../TransferToBranch'
import { fillAndDownloadTO62ForTransfer } from '../transferToBranchService';

import BreakdownList from '../../transactions/components/BreakdownList';

import DateSelect from '../../utils/components/DateSelect';

export interface TransferToBranchFormProps{
  transfer: TransferToBranch;
  onSubmit: (transfer: TransferToBranch) => void;
  working: boolean;
}

const TransferToBranchForm: FC<TransferToBranchFormProps> = ({ transfer, onSubmit, working }) => {

  const [internalTransfer, setInternalTransfer] = useState(transfer);

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    onSubmit(internalTransfer);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box p={2}>
        <Grid container spacing={1} justify="space-between" alignItems="center">
          <Grid item xs={12} sm>
            <DateSelect
              required
              value={internalTransfer.date}
              onChange={date => setInternalTransfer({ ...internalTransfer, date: date as string })}
              label="Date" />
          </Grid>
          <Grid item xs={12} sm>
          <DateSelect
            required
            value={internalTransfer.apply_on_date}
            onChange={apply_on_date => setInternalTransfer({ ...internalTransfer, apply_on_date: apply_on_date as string })}
            label="Apply on Date" />
          </Grid>
          <Grid item xs={12} md>
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
            <BreakdownList breakdowns={internalTransfer.breakdown}
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
