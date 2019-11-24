import React, { FC, useState } from 'react';
import { Box, Button, Collapse, Grid, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import Month from '../Month';
import { ensureMonthExists, newMonth, updateMonth } from '../MonthService';
import MoneyInput from '../../../utils/money/components/MoneyInput';
import Loader from '../../../utils/Loader';


export interface OpeningBalanceContainerProps{
  month: Month;
  onSave?: (month: Month) => void;
}

const OpeningBalanceContainer: FC<OpeningBalanceContainerProps> = ({ month, onSave }) => {

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [working, setWorking] = useState(false);
  const [internalMonth, setInternalMonth] = useState(month);

  function handleRefresh(){
    setWorking(true);
    newMonth(month.year, month.month).then((m) => {
      const { opening_primary, opening_receipts, opening_other } = m;
      setInternalMonth({ ...month, opening_primary, opening_receipts, opening_other })
      setWorking(false)
    }, () => setWorking(false));
  }

  function handleSave(){
    setWorking(true);
    return ensureMonthExists(month.month, month.year).then(() => {
      updateMonth(internalMonth).then((updatedMonth) => {
        setWorking(false);
        if(onSave){
          onSave(updatedMonth);
        }
      }, handleReject);
    }, handleReject);
  }

  function handleReject(){
    setWorking(false);
  }

  return (
    <Box p={1}>
      <Box pb={2}>
        <Typography variant="h5">Opening Balance</Typography>
      </Box>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Grid container direction={smUp ? "row" : "column"} spacing={1}>
            <Grid item xs={12} sm={4}>
              <MoneyInput
                label="Receipts"
                value={internalMonth.opening_receipts}
                onChange={(opening_receipts) => setInternalMonth({ ...internalMonth, opening_receipts: opening_receipts as number })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MoneyInput
                label="Primary"
                value={internalMonth.opening_primary}
                onChange={(opening_primary) => setInternalMonth({ ...internalMonth, opening_primary: opening_primary as number })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MoneyInput
                label="Other"
                value={internalMonth.opening_other}
                onChange={(opening_other) => setInternalMonth({ ...internalMonth, opening_other: opening_other as number })} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Collapse in={true}>
            {working ? <Loader /> :
              <Grid container direction={smUp ? "row" : "column"} spacing={1} justify="flex-end">
                <Grid item>
                  <Button
                    fullWidth={!smUp}
                    variant="contained"
                    color="primary"
                    onClick={() => handleRefresh()}>
                    <RefreshIcon />
                    Regenerate
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    fullWidth={!smUp}
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave()}>
                    <EditIcon />
                    Save
                  </Button>
                </Grid>
              </Grid>
            }
          </Collapse>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OpeningBalanceContainer;
