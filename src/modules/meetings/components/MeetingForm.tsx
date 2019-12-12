import React, { Fragment, FC, FormEvent, ReactNode, useState } from 'react';
import { Box, Divider, Grid, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import DateSelect from '../../utils/components/DateSelect';
import Loader from '../../utils/components/Loader';
import MoneyInput from '../../utils/money/MoneyInput';
import Money from '../../utils/money/Money';

import Meeting from '../Meeting';
import ContributionBoxContributions from '../ContributionBoxContributions';

export interface MeetingFormProps{
  meeting: Meeting;
  onSubmit: (meeting: Meeting) => void;
  working: boolean;
}

const MeetingForm: FC<MeetingFormProps> = ({ meeting, onSubmit, working }) => {

  const [internalMeeting, setInternalMeeting] = useState(meeting);
  const { boxes } = internalMeeting;

  const totalCash = boxes.reduce((sum, box) => {
    return sum + box.cash
  }, 0);
  const totalCheques = boxes.reduce((sum, box) => {
    return sum + box.cheques
  }, 0);

  function renderRowLayout(label: string, cash: ReactNode, cheques: ReactNode, total: ReactNode, divider = false){
    return (
      <Fragment>
        <Box p={2} pt={0} pb={1}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm>
              {label}
            </Grid>
            <Grid item xs={4} sm={2}>
              {cash}
            </Grid>
            <Grid item xs={4} sm={2}>
              {cheques}
            </Grid>
            <Grid item xs={4} sm={2}>
              {total}
            </Grid>
          </Grid>
        </Box>
        {divider && <Divider />}
      </Fragment>
    );
  }

  function renderHeader(){
    return renderRowLayout('',
          <Typography style={{fontWeight: 500, textAlign: 'right'}}>Cash</Typography>,
          <Typography style={{fontWeight: 500, textAlign: 'right'}}>Cheques</Typography>,
          <Typography style={{fontWeight: 500, textAlign: 'right'}}>Total</Typography>);
  }

  function renderRow(label: string,
       cash: number|undefined,
       onCashChange: (newCash: number|undefined) => void,
       cheques: number|undefined,
       onChequesChange: (newCheques: number|undefined) => void){
    const total = cash as number + (cheques as number);
    return renderRowLayout(label,
        <MoneyInput value={cash} onChange={onCashChange} required />,
        <MoneyInput value={cheques} onChange={onChequesChange} required />,
        !Number.isNaN(total) && <Money value={total} />,
        true);
  }

  function renderBoxes(){
    return boxes.map((box, index) => (
        <Grid item key={index}>
          {renderRow(box.box.title, box.cash,
            (value?: number) => handleBox({...box, cash: value as number}, index),
            box.cheques,
            (value?: number) => handleBox({...box, cheques: value as number}, index),
          )}
        </Grid>
    ));
  }

  function handleBox(box: ContributionBoxContributions, index: number){
    const boxes = internalMeeting.boxes.slice();
    boxes[index] = box;
    setInternalMeeting({...internalMeeting, boxes});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    onSubmit(internalMeeting);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Box p={2}>
            <DateSelect
              required
              value={internalMeeting.date}
              onChange={date => setInternalMeeting({ ...internalMeeting, date: date as string })}
              label="Date" />
            </Box>
        </Grid>
        <Grid item>
          {renderHeader()}
        </Grid>
        {renderBoxes()}
        <Grid item>
          {renderRowLayout('Total',
            <Money value={totalCash} />,
            <Money value={totalCheques} />,
            <Money value={totalCash + totalCheques} />)}
        </Grid>
        <Grid item>
          <Box p={2}>
            {working ?
              <Loader />
              :
              <Grid container justify="flex-end">
                <Grid item xs sm="auto">
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary">
                    <AddIcon />
                    Add Meeting
                  </Button>
                </Grid>
              </Grid>
            }
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}


export default MeetingForm;
