import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import moment from 'moment';

import Loader from '../../../utils/Loader';
import MonthNavigation from './MonthNavigation';
import MetaRow from './MetaRow';
import OpeningBalanceRow from './OpeningBalanceRow';
import Money from '../../../utils/money/components/Money';
import Settings from '../../../persistent/settings/Settings';
import MonthTransactions from '../MonthTransactions';
import MonthTransactionsRow from './MonthTransactionsRow';
import Transaction from '../../../persistent/transactions/models/Transaction';
import { getReceiptsClosingBalance, getPrimaryClosingBalance,
  getOtherClosingBalance, loadOrNewMonthTransactions, fillAndDownloadS26} from '../MonthTransactionsService';

export interface MonthTransactionsContainerProps{
  year: number;
  month: number;
  settings: Settings;
  onChangeMonth: (year: number, month: number) => void;
  onTransactionEdit: (transactionId: number) => void;
}

const MonthTransactionContainer: FC<MonthTransactionsContainerProps> =
  ({ year, month, settings, onChangeMonth, onTransactionEdit }) => {

    const [working, setWorking] = useState(false);
    const [monthTransactions, setMonthTransactions] = useState<null|MonthTransactions>(null);

    useEffect(() => {
      let mounted = true;
      setWorking(true);
      loadOrNewMonthTransactions(year, month).then((monthTransactions) => {
        if(mounted){
          setMonthTransactions(monthTransactions);
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
    }, [year, month]);

    function renderMonthTransactions(){
      if(!monthTransactions){
        return null;
      }
      return (
        <div>
          {renderHeaderButtons()}
          {renderHeaderRow()}
          {renderOpeningBalance()}
          {monthTransactions.transactions.map(renderTransaction)}
          {renderClosingBalance()}
        </div>
      );
    }

    function renderHeaderButtons(){
      if(monthTransactions == null){
        return null;
      }
      return (
        <Grid container spacing={1} alignItems="stretch">
          <Grid item xs>
            <Button fullWidth variant="contained"
              onClick={() => fillAndDownloadS26(monthTransactions)}>
              S26
            </Button>
          </Grid>
          <Grid item xs>
            <Button fullWidth variant="contained">
              S30
            </Button>
          </Grid>
          <Grid item xs>
            <Button fullWidth variant="contained">
              Warnings
            </Button>
          </Grid>
        </Grid>
      )
    }

    function renderHeaderRow(){
      return (
        <Box fontWeight={500}>
          <MetaRow
            receipts="Receipts"
            primary="Primary"
            other="Other" />
        </Box>
      );
    }

    function renderOpeningBalance(){
      if(!monthTransactions){
        return null;
      }
      return <OpeningBalanceRow month={monthTransactions.month} />
    }

    function renderTransaction(transaction: Transaction){
      if(!monthTransactions){
        return null;
      }
      const label = [moment()
        .startOf('year')
        .year(transaction.year)
        .month(transaction.month)
        .date(transaction.day)
        .format(settings.formatting.date_format), ': '];
      if(transaction.code){
        label.push(transaction.code, ' : ');
      }
      label.push(transaction.description);
      return <MonthTransactionsRow
        key={transaction.id}
        label={label.join('')}
        receipts={transaction.receipts_amt}
        primary={transaction.primary_amt}
        other={transaction.other_amt}
        onEdit={() => onTransactionEdit(transaction.id as number)} />
    }

    function renderClosingBalance(){
      if(!monthTransactions){
        return null;
      }
      return (
        <Box fontWeight={500}>
          <MetaRow
            receipts={<Money value={getReceiptsClosingBalance(monthTransactions)} />}
            primary={<Money value={getPrimaryClosingBalance(monthTransactions)} />}
            other={<Money value={getOtherClosingBalance(monthTransactions)} />} />
        </Box>
      )
    }

    return (
      <div>
        <MonthNavigation
          year={year}
          month={month}
          onChange={onChangeMonth}
          settings={settings} />
        <Box p={1}>
          {working ? <Loader /> : renderMonthTransactions()}
        </Box>
      </div>
    );
  }

export default MonthTransactionContainer;
