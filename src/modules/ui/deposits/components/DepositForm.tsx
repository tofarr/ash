import React, { Fragment, FC, FormEvent, ReactNode, useState } from 'react';
import { Box, Divider, Grid, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Loader from '../../../utils/Loader';
import Deposit from '../Deposit'

import MoneyInput from '../../../utils/money/components/MoneyInput';
import Money from '../../../utils/money/components/Money';
import DateSelect from '../../../utils/DateSelect';

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

  return (
    <form onSubmit={handleSubmit}>
      <Box p={2}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DateSelect
              year={internalDeposit.year}
              month={internalDeposit.month}
              day={internalDeposit.day}
              onDateChange={(year: number, month: number, day: number) => {
                setInternalDeposit({
                  ...internalDeposit, year, month, day,
                });
              }}
              label="Date" />
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
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary">
                  <AddIcon />
                  Add Deposit
                </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </form>
  );

/*
  const totalCash = congregation_cash as number
    + (worldwide_cash as number) + (construction_cash as number);
  const totalCheques = congregation_cheques as number
    + (worldwide_cheques as number) + (construction_cheques as number);

  function renderRowLayout(label: string, cash: ReactNode, cheques: ReactNode, total: ReactNode, divider = false){
    return (
      <Fragment>
        <Box p={2} pt={0} pb={1}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm>
              {label}
            </Grid>
            <Grid item xs={4} sm={2}>
              {cash}
            </Grid>
            <Grid item xs={4} sm={2}>
              {cheques}
            </Grid>
            <Grid item xs={4} sm={2}>
              {total}
            </Grid>
          </Grid>
        </Box>
        {divider && <Divider />}
      </Fragment>
    );
  }

  function renderHeader(){
    return (
      <Box pt={1}>
        {renderRowLayout('',
          <Typography style={{fontWeight: 500, textAlign: 'right'}}>Cash</Typography>,
          <Typography style={{fontWeight: 500, textAlign: 'right'}}>Cheques</Typography>,
          <Typography style={{fontWeight: 500, textAlign: 'right'}}>Total</Typography>)}
      </Box>
    );
  }

  function renderRow(label: string,
       cash: number|undefined,
       onCashChange: (newCash: number|undefined) => void,
       cheques: number|undefined,
       onChequesChange: (newCheques: number|undefined) => void){
    const total = cash as number + (cheques as number);
    return renderRowLayout(label,
        <MoneyInput value={cash} onChange={onCashChange} required />,
        <MoneyInput value={cheques} onChange={onChequesChange} required />,
        !Number.isNaN(total) && <Money value={total} />,
        true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    onSubmit(internalMeeting);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <DateSelect
            year={internalMeeting.year}
            month={internalMeeting.month}
            day={internalMeeting.day}
            onDateChange={(year: number, month: number, day: number) => {
              setInternalMeeting({
                ...internalMeeting, year, month, day,
              });
            }}
            label="Date" />
        </Grid>
        <Grid item>
          {renderHeader()}
        </Grid>
        <Grid item>
          {renderRow('Congregation', internalMeeting.congregation_cash,
            (value?: number) => setInternalMeeting({...internalMeeting, congregation_cash: value as number}),
            internalMeeting.congregation_cheques,
            (value?: number) => setInternalMeeting({...internalMeeting, congregation_cheques: value as number}),
          )}
        </Grid>
        <Grid item>
          {renderRow('Worldwide Work', internalMeeting.worldwide_cash,
            (value?: number) => setInternalMeeting({...internalMeeting, worldwide_cash: value as number}),
            internalMeeting.worldwide_cheques,
            (value?: number) => setInternalMeeting({...internalMeeting, worldwide_cheques: value as number}),
          )}
        </Grid>
        <Grid item>
          {renderRow('Construction', internalMeeting.construction_cash,
            (value?: number) => setInternalMeeting({...internalMeeting, construction_cash: value as number}),
            internalMeeting.construction_cheques,
            (value?: number) => setInternalMeeting({...internalMeeting, construction_cheques: value as number}),
          )}
        </Grid>
        <Grid item>
          {renderRowLayout('Total',
            <Money value={totalCash} />,
            <Money value={totalCheques} />,
            <Money value={totalCash + totalCheques} />)}
        </Grid>
        <Grid item>
          <Box p={2}>
            {working ?
              <Loader />
              :
              <Grid container justify="flex-end">
                <Grid item xs sm="auto">
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary">
                    <AddIcon />
                    Add Meeting
                  </Button>
                </Grid>
              </Grid>
            }
          </Box>
        </Grid>
      </Grid>
    </form>
  );
  */
}


export default DepositForm;
