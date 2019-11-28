import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { monthTransactionsPath } from '../../transactions/components/MonthTransactionsController';

import { dateToMonth } from '../../utils/date';
import Meeting from '../Meeting'
import { newMeeting, createMeeting } from '../MeetingService';
import MeetingForm from './MeetingForm'


export const CREATE_MEETING_PATH = '/create-meeting';

export interface CreateMeetingControllerProps{
  setTitle: (title: string) => void;
}

const CreateMeetingController: FC<CreateMeetingControllerProps> = ({ setTitle }) => {

  setTitle('Add Meeting');
  const { push } = useHistory();
  const [working,setWorking] = useState(false);

  function handleSubmit(meeting: Meeting){
    setWorking(true);
    createMeeting(meeting).then(() => {
      setWorking(false)
      push(monthTransactionsPath(dateToMonth(meeting.date)));
    }, () => setWorking(false));
  }

  return (
    <MeetingForm
      meeting={newMeeting()}
      onSubmit={handleSubmit}
      working={working} />
  )
}

export default CreateMeetingController;
