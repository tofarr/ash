import React, { FC, Fragment, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';

import Loader from '../../utils/components/Loader';
import ContributionBox from '../ContributionBox';
import { create, newInstance } from '../contributionBoxService';
import ContributionBoxForm from './ContributionBoxForm';
import { CONTRIBUTION_BOXES_PATH } from './ContributionBoxesController';

export const CREATE_CONTRIBUTION_BOX_PATH = '/create-contribution-box';

export interface CreateContributionBoxControllerProps{
  setTitle: (title: string) => void;
}

const CreateContributionBoxController: FC<CreateContributionBoxControllerProps> = ({ setTitle }) => {

  setTitle('Create Contribution Box');
  const { push } = useHistory();
  const [working,setWorking] = useState(false);
  const [box, setBox] = useState<ContributionBox>(newInstance);

  function handleSubmit(box: ContributionBox){
    setWorking(true);
    create(box).then(() => {
      setWorking(false);
      push(CONTRIBUTION_BOXES_PATH);
    }, () => {
      setWorking(false);
    });
  }

  if(working){
    return <Loader />
  }

  return (
    <Fragment>
      <Box p={1}>
        <Grid container justify="flex-end">
          <Grid item xs sm="auto">
            <Button fullWidth variant="contained" onClick={() => push(CONTRIBUTION_BOXES_PATH)}>
              <NavigateBeforeIcon />
              Back to Contribution Boxes
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ContributionBoxForm
        box={box}
        onChange={setBox}
        onSubmit={handleSubmit}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary">
            <AddIcon />
            Create Contribution Box
          </Button>
      </ContributionBoxForm>
    </Fragment>
  );
}

export default CreateContributionBoxController;
