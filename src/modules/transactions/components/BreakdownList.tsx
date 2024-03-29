import React, { FC, ReactNode, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';

import ListCollapse from '../../utils/components/ListCollapse';
import ConfirmButton from '../../utils/components/ConfirmButton';
import TransactionBreakdown from '../types/TransactionBreakdown';
import TransactionBreakdownCode from '../types/TransactionBreakdownCode';
import BreakdownRow from './BreakdownRow';

export interface TransactionBreakdownListProps{
  breakdowns: TransactionBreakdown[];
  onChange: (breakdowns: TransactionBreakdown[]) => void;
  amtRequired?: boolean;
}

const TransactionBreakdownList: FC<TransactionBreakdownListProps> = ({ breakdowns, onChange, amtRequired}) => {

  const [newBreakdown,setNewBreakdown] = useState<TransactionBreakdown>({
    code: TransactionBreakdownCode.OTHER,
    description: '',
    amt: 0 });

  function renderItems(){
    return (
      <ListCollapse
        items={breakdowns}
        identifier={(breakdown) => breakdown.id as number}
        component={renderItem} />
    );
  }

  function renderItem(breakdown: TransactionBreakdown){
    return renderItemLayout(breakdown,
      handleBreakdownUpdate,
      <ConfirmButton variant="contained" onClick={() => handleBreakdownDelete(breakdown) }>
        Delete
      </ConfirmButton>);
  }

  function renderItemLayout(breakdown: TransactionBreakdown,
    onChange: (breakdown: TransactionBreakdown) => void,
    button: ReactNode,
    descriptionRequired = true){
    return (
      <Box key={breakdown.id} pb={3}>
        <BreakdownRow
          breakdown={breakdown}
          onChange={onChange}
          descriptionRequired={descriptionRequired}
          amtRequired={amtRequired}>
          {button}
        </BreakdownRow>
      </Box>
    )
  }

  function renderCreate(){
    return renderItemLayout(newBreakdown,
      setNewBreakdown,
      <Button variant="contained" onClick={handleBreakdownCreate}>
        Create
      </Button>, false);
  }

  function handleBreakdownCreate(){
    const newBreakdowns = breakdowns.slice();
    newBreakdowns.push({ ...newBreakdown, id: new Date().getTime() })
    onChange(newBreakdowns);
  }

  function handleBreakdownDelete(breakdown: TransactionBreakdown){
    const index = breakdowns.findIndex((b) => b.id === breakdown.id);
    const newBreakdowns = breakdowns.slice();
    newBreakdowns.splice(index, 1);
    onChange(newBreakdowns);
  }

  function handleBreakdownUpdate(breakdown: TransactionBreakdown){
    const index = breakdowns.findIndex((b) => b.id === breakdown.id);
    const newBreakdowns = breakdowns.slice();
    newBreakdowns[index] = breakdown;
    onChange(newBreakdowns);
  }

  return <Box p={1}>
    <Grid container direction="column" spacing={1}>
      {renderItems()}
      {renderCreate()}
    </Grid>
  </Box>

}

export default TransactionBreakdownList;
