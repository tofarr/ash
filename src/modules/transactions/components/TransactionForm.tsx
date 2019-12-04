import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import {
Box,
Checkbox,
Collapse,
Container,
FormControlLabel,
Grid,
TextField,
Typography } from '@material-ui/core';

import Transaction from '../types/Transaction';
import TransactionBreakdown from '../types/TransactionBreakdown';
import TransactionCode, { describeTransactionCode, describeTransactionCodeShort } from '../types/TransactionCode';
import TransactionBreakdownList from './BreakdownList';

import CodeSelect from '../../utils/components/CodeSelect';
import DateSelect from '../../utils/components/DateSelect';
import MoneyInput from '../../utils/money/MoneyInput';
import useSettings from '../../settings/useSettings';

export interface TransactionFormProps{
  transaction: Transaction;
  onSubmit: (transaction: Transaction) => void;
}

const TransactionForm: FC<TransactionFormProps> = ({ transaction, onSubmit, children }) => {

  const [internalTransaction, setInternalTransaction] = useState(transaction);
  const hasBreakdown = !!internalTransaction.breakdown;
  const [descriptionError, setDescriptionError] = useState(false);
  const settings = useSettings();

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    onSubmit(internalTransaction);
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>){
    setInternalTransaction({ ...internalTransaction, description: event.target.value });
    setDescriptionError(!event.target.value);
  }

  function handleCodeChange(_code: TransactionCode){
    const code = _code as TransactionCode;
    const newTransaction = {
      ...internalTransaction,
      code,
      description: describeTransactionCodeShort(code)
    };
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
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <CodeSelect
                    label="Code"
                    value={internalTransaction.code}
                    keyFn={(code: TransactionCode) => code}
                    titleFn={(code: TransactionCode) => code}
                    descriptionFn={(code) => <Grid container spacing={2}>
                      <Grid item xs={2}>
                        <Typography variant="h6">{code}</Typography>
                      </Grid>
                      <Grid item xs>
                        {describeTransactionCode(code)}
                      </Grid>
                    </Grid>}
                    options={Object.keys(TransactionCode) as TransactionCode[]}
                    onChange={handleCodeChange} />
                </Grid>
                <Grid item xs={9}>
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
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <DateSelect
                    value={internalTransaction.date}
                    onChange={(date?: string) => {
                      setInternalTransaction({
                        ...internalTransaction, date: date as string, apply_on_date: date as string
                      });
                    }}
                    label="Date"
                    required={true}
                    displayFormat={settings.formatting.date_format} />
                </Grid>
                <Grid item xs={6}>
                  <DateSelect
                    value={internalTransaction.apply_on_date as string}
                    onChange={(apply_on_date?: string) => {
                      setInternalTransaction({ ...internalTransaction, apply_on_date });
                    }}
                    label="Applicable Date"
                    required={false}
                    displayFormat={settings.formatting.date_format} />
                </Grid>
              </Grid>
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
            <Grid item>
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
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Confirmation Code"
                variant="outlined"
                value={internalTransaction.confirmation_code}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setInternalTransaction({ ...internalTransaction, confirmation_code: event.target.value })} />
            </Grid>
            <Grid item>
              <Box pl={1} pr={1} pt={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasBreakdown}
                      color="primary"
                      onChange={() => setInternalTransaction({...internalTransaction, breakdown: hasBreakdown ? undefined : []})} />
                  }
                  label="Include Breakdown" />
              </Box>
            </Grid>
            <Grid item>
              <Collapse in={hasBreakdown}>
                {!!internalTransaction.breakdown &&
                  <TransactionBreakdownList breakdowns={internalTransaction.breakdown}
                    onChange={(breakdown: TransactionBreakdown[]) =>
                      setInternalTransaction({...internalTransaction, breakdown})} />
                }
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
