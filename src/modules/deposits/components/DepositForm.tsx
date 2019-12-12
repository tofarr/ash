import React, { FC, FormEvent, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Loader from '../../utils/components/Loader';
import Deposit from '../Deposit'
import { newDeposit } from '../DepositService';

import MoneyInput from '../../utils/money/MoneyInput';
import Money from '../../utils/money/Money';
import DateSelect from '../../utils/components/DateSelect';

export interface DepositFormProps{
  deposit: Deposit;
  onSubmit: (deposit: Deposit) => void;
  working: boolean;
}

const DepositForm: FC<DepositFormProps> = ({ deposit, onSubmit, working }) => {

  const [internalDeposit, setInternalDeposit] = useState(deposit);
  const {cash, cheques } = internalDeposit;
  const total = cash + cheques;

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    onSubmit(internalDeposit);
  }

  function handleDateChange(date?: string){
    setInternalDeposit({ ...internalDeposit, date: date as string })
    newDeposit(date).then((deposit) => {
      setInternalDeposit(deposit);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box p={2}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <DateSelect
              required
              value={internalDeposit.date}
              onChange={handleDateChange}
              label="Date" />
          </Grid>
          <Grid item xs={6}>
            <DateSelect
              required
              value={internalDeposit.apply_on_date as string}
              onChange={(apply_on_date?: string) => {
                setInternalDeposit({ ...internalDeposit, apply_on_date: (apply_on_date as string) });
              }}
              label="Applicable Date" />
          </Grid>
          <Grid item xs={6}>
            <MoneyInput
              label="Cash"
              required
              value={cash}
              onChange={(newCash) => setInternalDeposit({ ...internalDeposit, cash: newCash as number })} />
          </Grid>
          <Grid item xs={6}>
            <MoneyInput
              label="Cheques"
              required
              value={cheques}
              onChange={(newCheques) => setInternalDeposit({ ...internalDeposit, cheques: newCheques as number })} />
          </Grid>
          <Grid item xs={12}>
            <Box p={2}>
              <Grid container justify="flex-end" spacing={1}>
                <Grid item>
                  Total:
                </Grid>
                <Grid item>
                  <Money value={total} />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box p={2} pl={0} pr={0}>
              <Grid container justify="flex-end" spacing={1}>
                <Grid item xs sm="auto">
                {working ?
                  <Loader />
                  :
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary">
                    <AddIcon />
                    Add Deposit
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


export default DepositForm;
