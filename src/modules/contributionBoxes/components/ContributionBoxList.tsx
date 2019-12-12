import React, { ChangeEvent, FC, ReactNode, useState } from 'react';
import { Box, Button, Grid, Paper, TextField, Typography } from '@material-ui/core';

import CodeSelect from '../../utils/components/CodeSelect';
import ListCollapse from '../../utils/components/ListCollapse';
import ConfirmButton from '../../utils/components/ConfirmButton';
import ContributionBox from '../ContributionBox';
import TransactionCode, { describeTransactionCode, describeTransactionCodeShort } from '../../transactions/types/TransactionCode';

export interface ContributionBoxListProps{
  boxes: ContributionBox[];
  onChange: (boxes: ContributionBox[]) => void;
}

const ContributionBoxList: FC<ContributionBoxListProps> = ({ boxes, onChange}) => {

  const [newBox,setNewBox] = useState<ContributionBox>({
    id: -(new Date().getTime()),
    title: describeTransactionCodeShort(TransactionCode.B),
    code: TransactionCode.B
  });

  function renderItems(){
    return (
      <ListCollapse
        items={boxes}
        identifier={(breakdown) => breakdown.id as number}
        component={renderItem} />
    );
  }

  function renderItem(box: ContributionBox){
    return renderItemLayout(box,
      handleBoxUpdate,
      <ConfirmButton variant="contained" onClick={() => handleBoxDelete(box) }>
        Delete
      </ConfirmButton>);
  }

  function renderItemLayout(box: ContributionBox,
    onChange: (box: ContributionBox) => void,
    button: ReactNode){
    return (
      <Box key={box.id} pb={2}>
        <Grid container spacing={1} alignItems="center" justify="flex-end">
          <Grid item xs={2} sm={2}>
            <CodeSelect
              label="Code"
              value={box.code}
              keyFn={(code: TransactionCode) => code}
              titleFn={(code: TransactionCode) => code}
              descriptionFn={(code) => <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Typography variant="h6">{code}</Typography>
                </Grid>
                <Grid item xs>
                  {describeTransactionCode(code)}
                </Grid>
              </Grid>}
              options={Object.keys(TransactionCode) as TransactionCode[]}
              onChange={(code: TransactionCode) => {
                const title = describeTransactionCodeShort(code);
                onChange({...box, code, title})
              }} />
          </Grid>
          <Grid item xs={10} sm={true}>
            <TextField
              required
              fullWidth
              label="Title"
              variant="outlined"
              value={box.title}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({...box, title: event.target.value})} />
          </Grid>
          <Grid item>
            {button}
          </Grid>
        </Grid>
      </Box>
    )
  }

  function renderCreate(){
    return (
      <Box pb={2}>
        <Paper>
          <Box p={1}>
            {renderItemLayout(newBox,
              setNewBox,
              <Button variant="contained" onClick={handleBoxCreate}>
                Create
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    )
  }

  function handleBoxCreate(){
    const newBoxes = boxes.slice();
    newBoxes.push({ ...newBox, id: -(new Date().getTime()) })
    onChange(newBoxes);
  }

  function handleBoxDelete(box: ContributionBox){
    const index = boxes.findIndex((b) => b.id === box.id);
    const newBoxes = boxes.slice();
    newBoxes.splice(index, 1);
    onChange(newBoxes);
  }

  function handleBoxUpdate(box: ContributionBox){
    const index = boxes.findIndex((b) => b.id === box.id);
    const newBoxes = boxes.slice();
    newBoxes[index] = box;
    onChange(newBoxes);
  }

  return <Box p={1}>
    <Grid container direction="column" spacing={1}>
      {renderItems()}
      {renderCreate()}
    </Grid>
  </Box>

}

export default ContributionBoxList;
