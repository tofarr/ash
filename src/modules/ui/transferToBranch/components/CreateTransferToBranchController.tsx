import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { monthTransactionsPath } from '../../../ui/monthTransactions/components/MonthTransactionsController';

import Loader from '../../../utils/Loader';
import TransferToBranch from '../TransferToBranch';
import { newTransferToBranch, createTransferToBranch } from '../TransferToBranchService';
import TransferToBranchForm from './TransferToBranchForm'


export const CREATE_TRANSFER_PATH = '/create-transfer';

export interface CreateTransferToBranchControllerProps{
  setTitle: (title: string) => void;
}

const CreateTransferToBranchController: FC<CreateTransferToBranchControllerProps> = ({ setTitle }) => {

  setTitle('Add Transfer To Branch');
  const { push } = useHistory();
  const [working,setWorking] = useState(false);
  const [transfer,setTransfer] = useState<undefined|TransferToBranch>(undefined);

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    newTransferToBranch().then((transferToBranch) => {
      if(mounted){
        setTransfer(transferToBranch);
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

  function handleSubmit(transferToBranch: TransferToBranch){
    setWorking(true);
    createTransferToBranch(transferToBranch).then(() => {
      setWorking(false)
      push(monthTransactionsPath(transferToBranch.year, transferToBranch.month));
    }, () => setWorking(false));
  }

  if(working && !transfer){
    return <Loader />
  }

  if(!transfer){
    return null; // error should have been thrown
  }

  return (
    <TransferToBranchForm
      transfer={transfer as TransferToBranch}
      onSubmit={handleSubmit}
      working={working} />
  )
}

export default CreateTransferToBranchController;
