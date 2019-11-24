import React, { FC, Fragment, useState } from 'react';
import { Box, Dialog } from '@material-ui/core';

import Month from '../../../persistent/months/Month';
import OpeningBalanceContainer from '../../../persistent/months/components/OpeningBalanceContainer';
import MonthTransactionsRow from './MonthTransactionsRow';

export interface OpeningBalanceRowProps{
  month: Month;
}

const OpeningBalanceRow: FC<OpeningBalanceRowProps> = ({ month }) => {

  const [open, setOpen] = useState(false);

  return <Fragment>
    <MonthTransactionsRow
      label="Opening Balance"
      receipts={month.opening_receipts}
      primary={month.opening_primary}
      other={month.opening_other}
      onEdit={() => setOpen(true)} />
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box p={1}>
        <OpeningBalanceContainer month={month} onSave={() => setOpen(false)} />
      </Box>
    </Dialog>
  </Fragment>
}

export default OpeningBalanceRow;
