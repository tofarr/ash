import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { dateToMonth } from '../../utils/date';
import Loader from '../../utils/components/Loader';
import TransactionForm from './TransactionForm'
import Transaction from '../types/Transaction';
import { newInstance, create } from '../transactionService';
import { monthTransactionsPath } from './MonthTransactionsController';

export const CREATE_TRANSACTION_PATH = '/create-transaction';

export interface CreateTransactionControllerProps{
  setTitle: (title: string) => void;
}

const CreateTransactionController: FC<CreateTransactionControllerProps> = ({ setTitle }) => {
  setTitle('Add Transaction');
  const { push } = useHistory();
  const [working,setWorking] = useState(false);

  function handleSave(transaction: Transaction){
    setWorking(true);
    return new Promise<Transaction>((resolve, reject) => {
      create(transaction).then(() => {
        resolve();
        push(monthTransactionsPath(dateToMonth(transaction.date)));
      }, (err: any) => {
        setWorking(false);
        reject(err);
      });
    });
  }

  return (
    <TransactionForm
      transaction={newInstance('')}
      onSubmit={handleSave}>
      {working ? <Loader /> :
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary">
          <AddIcon />
          Add Transaction
        </Button>
      }
    </TransactionForm>
  )
}

export default CreateTransactionController;
