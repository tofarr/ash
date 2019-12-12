import React, { FC, Fragment, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import Loader from '../../utils/components/Loader';
import Alert from '../../utils/components/Alert';
import ContributionBox from '../ContributionBox';
import { list } from '../contributionBoxService';
import { updateContributionBoxPath } from './UpdateContributionBoxController';
import { CREATE_CONTRIBUTION_BOX_PATH } from './CreateContributionBoxController';

export const CONTRIBUTION_BOXES_PATH = '/contribution-boxes';

export interface ContributionBoxesControllerProps{
  setTitle: (title: string) => void;
}

const ContributionBoxesController: FC<ContributionBoxesControllerProps> = ({ setTitle }) => {

  setTitle('Contribution Boxes');
  const [working,setWorking] = useState(false);
  const [boxes, setBoxes] = useState<ContributionBox[]|undefined>(undefined);
  const { push } = useHistory();

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


  function renderBox(box: ContributionBox){
    return (
      <Grid key={box.id} item xs>
        <Button
          fullWidth
          variant="contained"
          onClick={() => push(updateContributionBoxPath(box.id as number))}>
          {box.title}
        </Button>
      </Grid>
    )
  }

  if(working){
    return <Loader />
  }

  if(!boxes){
    return <Alert msg="Error retrieving Boxes" />;
  }

  return (
    <Fragment>
      <Grid container direction="column" spacing={1}>
        {boxes.map(renderBox)}
      </Grid>
      <Box pt={2}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => push(CREATE_CONTRIBUTION_BOX_PATH)}>
          Create Contribution Box
        </Button>
      </Box>
    </Fragment>
  );
}

export default ContributionBoxesController;
