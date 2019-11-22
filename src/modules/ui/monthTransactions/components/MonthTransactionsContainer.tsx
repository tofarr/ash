import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import Loader from '../../../utils/Loader';
import MonthNavigation from './MonthNavigation';
import MetaRow from './MetaRow';
import Money from '../../../utils/money/components/Money';
import Settings from '../../../persistent/settings/Settings';
import MonthTransactions from '../MonthTransactions';
import MonthTransactionsRow from './MonthTransactionsRow';
import Transaction from '../../../persistent/transactions/models/Transaction';
import { getReceiptsClosingBalance, getPrimaryClosingBalance, getOtherClosingBalance, loadOrNewMonthTransactions, saveMonthTransactions} from '../MonthTransactionsService';

export interface MonthTransactionsContainerProps{
  year: number;
  month: number;
  settings: Settings;
  onChangeMonth: (year: number, month: number) => void;
}

const MonthTransactionContainer: FC<MonthTransactionsContainerProps> =
  ({ year, month, settings, onChangeMonth}) => {

    const [working, setWorking] = useState(false);
    const [monthTransactions, setMonthTransactions] = useState<null|MonthTransactions>(null);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));

    useEffect(() => {
      setWorking(true);
      loadOrNewMonthTransactions(year, month).then((monthTransactions) => {
        setMonthTransactions(monthTransactions);
        setWorking(false);
      }, (err) => {
        setWorking(false)
      });
    }, [year]);

    function handleOpeningBalanceEdit(){
      debugger;
    }

    function handleTransactionEdit(transaction: Transaction){
      debugger;
    }

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
      return (
        <Grid container spacing={1} alignItems="stretch">
          <Grid item xs>
            <Button fullWidth variant="contained">
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
        <MetaRow
          receipts="Receipts"
          primary="Primary"
          other="Other" />
      );
    }

    function renderOpeningBalance(){
      if(!monthTransactions){
        return null;
      }
      return <MonthTransactionsRow
        label="Opening Balance"
        receipts={monthTransactions.month.opening_receipts}
        primary={monthTransactions.month.opening_primary}
        other={monthTransactions.month.opening_other}
        onEdit={handleOpeningBalanceEdit}
        settings={settings} />
    }

    function renderTransaction(transaction: Transaction){
      if(!monthTransactions){
        return null;
      }
      return <MonthTransactionsRow
        key={transaction.id}
        label={`${transaction.code} : ${transaction.description}`}
        receipts={transaction.receipts_amt}
        primary={transaction.primary_amt}
        other={transaction.other_amt}
        onEdit={() => handleTransactionEdit(transaction)}
        settings={settings} />
    }

    function renderClosingBalance(){
      if(!monthTransactions){
        return null;
      }
      return (
        <MetaRow
          receipts={<Money value={getReceiptsClosingBalance(monthTransactions)} />}
          primary={<Money value={getPrimaryClosingBalance(monthTransactions)} />}
          other={<Money value={getOtherClosingBalance(monthTransactions)} />} />
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
