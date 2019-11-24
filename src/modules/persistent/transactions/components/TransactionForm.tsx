import React, { ChangeEvent, FC, ReactElement, useState } from 'react';
import { Box,
Checkbox,
Collapse,
Container,
FormControlLabel,
Grid,
TextField } from '@material-ui/core';

import Transaction from '../models/Transaction';
import TransactionCode from '../models/TransactionCode';

import DateSelect from '../../../utils/DateSelect';
import ValueSelect from '../../../utils/ValueSelect';
import MoneyInput from '../../../utils/money/components/MoneyInput';
import Settings from '../../settings/Settings';

export interface TransactionFormProps{
  transaction: Transaction;
  settings: Settings;
  children: (transaction: Transaction) => ReactElement | null;
}

const TransactionForm: FC<TransactionFormProps> = ({ transaction, settings, children }) => {

  const [internalTransaction, setInternalTransaction] = useState(transaction);
  const [hasStatementDate, setHasStatementDate] = useState(!!(internalTransaction.statement_year &&
                                  internalTransaction.statement_month &&
                                  internalTransaction.statement_day));

  function handleHasStatementDate(){
    const newHasStatementDate = !hasStatementDate;
    if(newHasStatementDate && !(internalTransaction.statement_year && internalTransaction.statement_month && internalTransaction.statement_day)){
      setInternalTransaction({
        ...internalTransaction,
        statement_year: transaction.year,
        statement_month: transaction.month,
        statement_day: transaction.day
      });
    }
    setHasStatementDate(newHasStatementDate);
  }

  function getTransactionToSave(){
    const transactionToSave = { ...internalTransaction };
    if(!hasStatementDate){
      delete transactionToSave.statement_year;
      delete transactionToSave.statement_month;
      delete transactionToSave.statement_day;
    }
    return transactionToSave;
  }

  return (
    <Container>
      <Box pt={2} pb={2}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <DateSelect
              year={internalTransaction.year}
              month={internalTransaction.month}
              day={internalTransaction.day}
              onDateChange={(year: number, month: number, day: number) => {
                setInternalTransaction({
                  ...internalTransaction, year, month, day,
                });
              }}
              label="Date"
              settings={settings} />
          </Grid>
          <Grid item>
            <ValueSelect
              label="Code"
              value={internalTransaction.code}
              keyFn={(code?: TransactionCode) => code}
              titleFn={(code?: TransactionCode) => code || 'None'}
              options={Object.keys(TransactionCode) as TransactionCode[]}
              onChange={(code) => setInternalTransaction({ ...internalTransaction, code })} />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              multiline
              label="Description"
              variant="outlined"
              value={internalTransaction.description}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setInternalTransaction({ ...internalTransaction, description: event.target.value })} />
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <MoneyInput
                  label="Receipts"
                  value={internalTransaction.receipts_amt}
                  onChange={(receipts_amt) => setInternalTransaction({ ...internalTransaction, receipts_amt: receipts_amt as number })} />
              </Grid>
              <Grid item xs={4}>
                <MoneyInput
                  label="Primary"
                  value={internalTransaction.primary_amt}
                  onChange={(primary_amt) => setInternalTransaction({ ...internalTransaction, primary_amt: primary_amt as number })} />
              </Grid>
              <Grid item xs={4}>
                <MoneyInput
                  label="Other"
                  value={internalTransaction.other_amt}
                  onChange={(other_amt) => setInternalTransaction({ ...internalTransaction, other_amt: other_amt as number })} />
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <Box pl={1} pr={1} pt={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasStatementDate}
                    color="primary"
                    onChange={handleHasStatementDate} />
                }
                label="Transaction should be applied on a different date to when it was created" />
            </Box>
          </Grid>
          <Grid item>
            <Collapse in={hasStatementDate}>
              <Box pb={1}>
                <DateSelect
                  year={internalTransaction.statement_year || internalTransaction.year}
                  month={internalTransaction.statement_month  || internalTransaction.month}
                  day={internalTransaction.statement_day  || internalTransaction.day}
                  onDateChange={(statement_year: number, statement_month: number, statement_day: number) => {
                    setInternalTransaction({
                      ...internalTransaction, statement_year, statement_month, statement_day,
                    });
                  }}
                  label="Applicable Date"
                  settings={settings} />
              </Box>
            </Collapse>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <MoneyInput
                  label="Cash"
                  value={internalTransaction.cash}
                  onChange={(cash) => setInternalTransaction({ ...internalTransaction, cash })} />
              </Grid>
              <Grid item xs={6}>
                <MoneyInput
                  label="Cheques"
                  value={internalTransaction.cheques}
                  onChange={(cheques) => setInternalTransaction({ ...internalTransaction, cheques })} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Box pb={2} pt={1}>
              <Grid container justify="flex-end">
                <Grid item>
                  {children(getTransactionToSave())}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default TransactionForm;
