import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { monthTransactionsPath } from '../../../ui/monthTransactions/components/MonthTransactionsController';

import Loader from '../../../utils/Loader';
import Deposit from '../Deposit';
import { newDeposit, createDeposit } from '../DepositService';
import DepositForm from './DepositForm'


export const CREATE_DEPOSIT_PATH = '/create-deposit';

export interface CreateDepositControllerProps{
  setTitle: (title: string) => void;
}

const CreateDepositController: FC<CreateDepositControllerProps> = ({ setTitle }) => {

  setTitle('Add Deposit');
  const { push } = useHistory();
  const [working,setWorking] = useState(false);
  const [deposit,setDeposit] = useState<undefined|Deposit>(undefined);

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    newDeposit().then((deposit) => {
      if(mounted){
        setDeposit(deposit);
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
  }, []);

  function handleSubmit(deposit: Deposit){
    setWorking(true);
    createDeposit(deposit).then(() => {
      setWorking(false)
      push(monthTransactionsPath(deposit.year, deposit.month));
    }, () => setWorking(false));
  }

  if(working && !deposit){
    return <Loader />
  }

  if(!deposit){
    return null; // error should have been thrown
  }

  return (
    <DepositForm
      deposit={deposit as Deposit}
      onSubmit={handleSubmit}
      working={working} />
  )
}

export default CreateDepositController;
