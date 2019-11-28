import React, { FC, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { dateToMonth } from '../../utils/date';
import Loader from '../../utils/components/Loader';
import ConfirmButton from '../../utils/components/ConfirmButton';
import TransactionForm from './TransactionForm'
import Transaction from '../types/Transaction';
import { read, update, destroy } from '../transactionService';
import { monthTransactionsPath } from './MonthTransactionsController';

export const UPDATE_TRANSACTION_PATH = '/update-transaction/:transactionId';

export function updateTransactionPath(transactionId: number){
  return UPDATE_TRANSACTION_PATH.replace(':transactionId', transactionId.toString());
}

export interface UpdateTransactionControllerProps{
  setTitle: (title: string) => void;
}

export interface UpdateTransactionControllerParams{
  transactionId: string;
}

const UpdateTransactionController: FC<UpdateTransactionControllerProps> = ({ setTitle }) => {
  setTitle('Update Transaction');
  const { push } = useHistory();
  const transactionId = parseInt(useParams<UpdateTransactionControllerParams>().transactionId as any);
  const [working,setWorking] = useState(false);
  const [transaction,setTransaction] = useState<Transaction|undefined>(undefined);
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    read(transactionId).then((transaction) => {
      if(mounted){
        setTransaction(transaction);
        setWorking(false);
      }
    }, () => {
      if(mounted){
        setWorking(false)
      }
    });
    return () => {
      mounted = false;
    }
  }, [transactionId]);

  function handleSave(transaction: Transaction){
    setWorking(true);
    return new Promise<Transaction>((resolve, reject) => {
      function handleReject(err: any){
        setWorking(false);
        reject(err);
      }
      update(transaction).then(() => {
        setWorking(false);
        resolve();
        push(monthTransactionsPath(dateToMonth(transaction.date)));
      }, handleReject);
    });
  }

  function handleDelete(){
    setWorking(true);
    return new Promise<Transaction>((resolve, reject) => {
      destroy((transaction as Transaction).id as number).then(() => {
        resolve();
        if(transaction){
          push(monthTransactionsPath(dateToMonth(transaction.date)));
        }
      }, (err: any) => {
        setWorking(false);
        reject(err);
      });
    });
  }

  if(working){
    return <Loader />
  }

  if(!transaction){
    return (
      <Box p={2}>
        <Grid container justify="center">
          <Grid item>
            <Typography variant="h6">No Transaction Found!</Typography>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <TransactionForm
      transaction={transaction}
      onSubmit={handleSave}>
      {working ? <Loader /> :
        <Grid container direction={smUp ? 'row' : 'column'} spacing={1} alignItems="stretch">
          <Grid item xs={(!smUp) || 'auto'}>
            <Button
              fullWidth={!smUp}
              type="submit"
              variant="contained"
              color="primary">
              <EditIcon />
              Update Transaction {!smUp}
            </Button>
          </Grid>
          <Grid item xs={(!smUp) || 'auto'}>
            <ConfirmButton
              fullWidth={!smUp}
              type="button"
              variant="contained"
              onClick={handleDelete}>
              <EditIcon />
              Delete Transaction
            </ConfirmButton>
          </Grid>
        </Grid>
      }
    </TransactionForm>
  )
}

export default UpdateTransactionController;
