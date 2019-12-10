import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import Loader from '../../utils/components/Loader';
import ContributionBox from '../ContributionBox';
import ContributionBoxList from './ContributionBoxList';
import { editAll, list } from '../contributionBoxService';

export const CONTRIBUTION_BOXES_PATH = '/contribution-boxes';

export interface ContributionBoxesControllerProps{
  setTitle: (title: string) => void;
}

const ContributionBoxesController: FC<ContributionBoxesControllerProps> = ({ setTitle }) => {

  setTitle('Contribution Boxes');
  const [working,setWorking] = useState(false);
  const [boxes, setBoxes] = useState<ContributionBox[]|undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    list().then((boxes) => {
      if(mounted){
        setBoxes(boxes);
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
    if(!boxes){
      return null;
    }
    return (
      <form onSubmit={() => editAll(boxes)}>
        <ContributionBoxList boxes={boxes} onChange={setBoxes} />
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

export default ContributionBoxesController;
