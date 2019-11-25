import React, { FC, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Loader from '../../../utils/Loader';
import Settings from '../../settings/Settings';
import TransactionForm from './TransactionForm'
import Transaction from '../models/Transaction';
import { newTransaction, createTransaction } from '../TransactionService';
import { ensureMonthExists } from '../../months/MonthService';
import { monthTransactionsPath } from '../../../ui/monthTransactions/components/MonthTransactionsController';

export const CREATE_TRANSACTION_PATH = '/create-transaction';

export interface CreateTransactionControllerProps{
  settings: Settings,
  setTitle: (title: string) => void;
}

function newDummyTransaction(){
  const m = moment();
  return newTransaction(m.year(), m.month() + 1, m.date(), '');
}

const CreateTransactionController: FC<CreateTransactionControllerProps> = ({ settings, setTitle }) => {
  setTitle('Add Transaction');
  const { push } = useHistory();
  const [working,setWorking] = useState(false);

  function handleSave(transaction: Transaction){
    setWorking(true);
    return new Promise<Transaction>((resolve, reject) => {
      function handleReject(err: any){
        setWorking(false);
        reject(err);
      }
      ensureMonthExists(transaction.year, transaction.month).then(() => {
        createTransaction(transaction).then(() => {
          resolve();
          push(monthTransactionsPath(transaction.year, transaction.month));
        }, handleReject);
      }, handleReject);
    });
  }

  return (
    <TransactionForm
      transaction={newDummyTransaction()}
      settings={settings}
      onSubmit={handleSave}>
      {working ? <Loader /> :
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary">
          <AddIcon />
          Create Transaction
        </Button>
      }
    </TransactionForm>
  )
}

export default CreateTransactionController;
