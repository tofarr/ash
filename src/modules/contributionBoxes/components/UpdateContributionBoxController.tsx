import React, { FC, Fragment, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useParams, useHistory } from 'react-router-dom';

import ConfirmButton from '../../utils/components/ConfirmButton';
import Loader from '../../utils/components/Loader';
import Alert from '../../utils/components/Alert';
import ContributionBox from '../ContributionBox';
import { read, update, destroy } from '../contributionBoxService';
import ContributionBoxForm from './ContributionBoxForm';
import { CONTRIBUTION_BOXES_PATH } from './ContributionBoxesController';

export const UPDATE_CONTRIBUTION_BOX_PATH = '/contribution-box/:boxId';

export function updateContributionBoxPath(transactionId: number){
  return UPDATE_CONTRIBUTION_BOX_PATH.replace(':boxId', transactionId.toString());
}

export interface UpdateContributionBoxControllerProps{
  setTitle: (title: string) => void;
}

export interface UpdateContributionBoxControllerParams{
  boxId: string;
}

const UpdateContributionBoxController: FC<UpdateContributionBoxControllerProps> = ({ setTitle }) => {

  setTitle('Update Contribution Box');
  const { push } = useHistory();
  const boxId = parseInt(useParams<UpdateContributionBoxControllerParams>().boxId as any);
  const [working,setWorking] = useState(false);
  const [box, setBox] = useState<ContributionBox|undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    read(boxId).then((box) => {
      if(mounted){
        setBox(box);
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
  }, [boxId]);

  function handleSubmit(box: ContributionBox){
    setWorking(true);
    update(box).then(() => {
      setWorking(false);
      push(CONTRIBUTION_BOXES_PATH);
    }, () => setWorking(false));
  }

  function handleDelete(box: ContributionBox){
    setWorking(true);
    update(box).then(() => {
      destroy(box.id as number);
      push(CONTRIBUTION_BOXES_PATH);
    }, () => setWorking(false));
  }

  if(working){
    return <Loader />
  }

  if(!box){
    return <Alert msg="No Contribution Box Found" />
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
        <Grid container spacing={1}>
          <Grid item xs={12} sm="auto">
            <ConfirmButton
              fullWidth
              type="button"
              variant="contained"
              onClick={() => handleDelete(box)}>
              <DeleteIcon />
              Delete Contribution Box
            </ConfirmButton>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary">
              <EditIcon />
              Update Contribution Box
            </Button>
          </Grid>
        </Grid>
      </ContributionBoxForm>
    </Fragment>
  );
}

export default UpdateContributionBoxController;
