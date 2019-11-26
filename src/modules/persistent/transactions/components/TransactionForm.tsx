import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
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

export interface TransactionFormProps{
  transaction: Transaction;
  onSubmit: (transaction: Transaction) => void;
}

const TransactionForm: FC<TransactionFormProps> = ({ transaction, onSubmit, children }) => {

  const [internalTransaction, setInternalTransaction] = useState(transaction);
  const [hasStatementDate, setHasStatementDate] = useState(!!(internalTransaction.statement_year &&
                                  internalTransaction.statement_month &&
                                  internalTransaction.statement_day));
  const hasCashChequesBreakdown = !!(internalTransaction.cash ||
                                  internalTransaction.cheques ||
                                  internalTransaction.code === TransactionCode.W ||
                                  internalTransaction.code === TransactionCode.C ||
                                  internalTransaction.code === TransactionCode.D);
  const [descriptionError, setDescriptionError] = useState(false);

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
      transactionToSave.statement_year =
        transactionToSave.statement_month =
        transactionToSave.statement_day = undefined;
    }
    return transactionToSave;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    onSubmit(getTransactionToSave());
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>){
    setInternalTransaction({ ...internalTransaction, description: event.target.value });
    setDescriptionError(!event.target.value);
  }

  function handleCodeChange(code: TransactionCode|undefined){
    const newTransaction = { ...internalTransaction, code };
    if(!transaction.description){
      switch(code){
        case TransactionCode.W:
          newTransaction.description = 'Contributions - WW';
          break;
        case TransactionCode.C:
          newTransaction.description = 'Contributions - Congregation';
          break;
        case TransactionCode.D:
          newTransaction.description = 'Deposit';
          break;
      }
    }
    setInternalTransaction(newTransaction);
    setDescriptionError(descriptionError && !newTransaction.description);
  }

  function handleCash(cash?: number){
    setInternalTransaction(decorateTransaction({ ...internalTransaction, cash }));
  }

  function handleCheques(cheques?: number){
    setInternalTransaction(decorateTransaction({ ...internalTransaction, cheques }));
  }

  function decorateTransaction(newTransaction: Transaction){
    const { code, cash, cheques} = newTransaction;
    if((cash != null) && (cheques != null)){
      if(code === TransactionCode.D){
        newTransaction.primary_amt = cash + cheques;
        newTransaction.receipts_amt = -newTransaction.primary_amt;
      }else{
        newTransaction.receipts_amt = cash + cheques;
      }
    }
    return newTransaction;
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
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
                label="Date" />
            </Grid>
            <Grid item>
              <ValueSelect
                label="Code"
                value={internalTransaction.code}
                keyFn={(code?: TransactionCode) => code}
                titleFn={(code?: TransactionCode) => code || 'None'}
                options={Object.keys(TransactionCode) as TransactionCode[]}
                onChange={handleCodeChange} />
            </Grid>
            <Grid item>
              <Collapse in={hasCashChequesBreakdown}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <MoneyInput
                      label="Cash"
                      value={internalTransaction.cash}
                      onChange={handleCash} />
                  </Grid>
                  <Grid item xs={6}>
                    <MoneyInput
                      label="Cheques"
                      value={internalTransaction.cheques}
                      onChange={handleCheques} />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
            <Grid item>
              <TextField
                required
                fullWidth
                multiline
                error={descriptionError}
                label="Description"
                variant="outlined"
                value={internalTransaction.description}
                onChange={handleDescriptionChange}
                onBlur={() => setDescriptionError(!internalTransaction.description)} />
            </Grid>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <MoneyInput
                    required
                    label="Receipts"
                    value={internalTransaction.receipts_amt}
                    onChange={(receipts_amt) => setInternalTransaction({ ...internalTransaction, receipts_amt: receipts_amt as number })} />
                </Grid>
                <Grid item xs={4}>
                  <MoneyInput
                    required
                    label="Primary"
                    value={internalTransaction.primary_amt}
                    onChange={(primary_amt) => setInternalTransaction({ ...internalTransaction, primary_amt: primary_amt as number })} />
                </Grid>
                <Grid item xs={4}>
                  <MoneyInput
                    required
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
                    label="Applicable Date" />
                </Box>
              </Collapse>
            </Grid>
            <Grid item>
              <Box pb={2} pt={1}>
                <Grid container justify="flex-end">
                  <Grid item xs sm="auto">
                    {children}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Container>
  )
}

export default TransactionForm;
