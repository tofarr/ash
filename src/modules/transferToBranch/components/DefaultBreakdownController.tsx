import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import Loader from '../../utils/components/Loader';
import TransactionBreakdown from '../../transactions/types/TransactionBreakdown';
import BreakdownList from '../../transactions/components/BreakdownList';
import { loadDefaultBreakdown, storeDefaultBreakdown } from '../transferToBranchService';

export const DEFAULT_BREAKDOWN_PATH = '/default-breakdown';

export interface DefaultBreakdownControllerProps{
  setTitle: (title: string) => void;
}

const DefaultBreakdownController: FC<DefaultBreakdownControllerProps> = ({ setTitle }) => {

  setTitle('Default Transfer Breakdown');
  const [working,setWorking] = useState(false);
  const [breakdown, setBreakdown] = useState<TransactionBreakdown[]|undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    loadDefaultBreakdown().then(breakdown => {
      if(mounted){
        setBreakdown(breakdown);
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

  function renderForm(){
    if(!breakdown){
      return null;
    }
    return (
      <form onSubmit={() => storeDefaultBreakdown(breakdown)}>
        <BreakdownList breakdowns={breakdown} onChange={setBreakdown} amtRequired={true} />
        <Grid container justify="flex-end">
          <Grid item xs sm="auto">
            <Button fullWidth variant="contained" type="submit" color="primary">
              <EditIcon />
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }

  return <Box p={1}>
    {working && <Loader />}
    {renderForm()}
  </Box>

}

export default DefaultBreakdownController;
