import React, { ChangeEvent, FC, FormEvent } from 'react';
import { Box, Grid, TextField, Typography } from '@material-ui/core';

import CodeSelect from '../../utils/components/CodeSelect';
import ContributionBox from '../ContributionBox';
import TransactionCode, { describeTransactionCode, describeTransactionCodeShort } from '../../transactions/types/TransactionCode';


export const CONTRIBUTION_BOXES_PATH = '/contribution-boxes';

export interface ContributionBoxFormProps{
  box: ContributionBox;
  onChange: (box: ContributionBox) => void;
  onSubmit: (box: ContributionBox) => void;
}

const ContributionBoxForm: FC<ContributionBoxFormProps> = ({ box, onChange, onSubmit, children }) => {

  function handleSubmit(event: FormEvent){
    event.preventDefault();
    onSubmit(box);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box p={1} pt={2}>
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
          <Grid item xs={10}>
            <TextField
              required
              fullWidth
              label="Title"
              variant="outlined"
              value={box.title}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({...box, title: event.target.value})} />
          </Grid>
          <Grid item xs={12} sm="auto">
            <Box pt={1}>
              {children}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}

export default ContributionBoxForm;
