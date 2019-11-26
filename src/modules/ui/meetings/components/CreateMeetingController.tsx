import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { monthTransactionsPath } from '../../../ui/monthTransactions/components/MonthTransactionsController';

import Meeting from '../Meeting'
import { newMeeting, createMeeting } from '../MeetingService';
import MeetingForm from './MeetingForm'


export const CREATE_MEETING_PATH = '/create-meeting';

export interface CreateMeetingControllerProps{
  setTitle: (title: string) => void;
}

const CreateMeetingController: FC<CreateMeetingControllerProps> = ({ setTitle }) => {

  setTitle('Add Meeting Contributions');
  const { push } = useHistory();
  const [working,setWorking] = useState(false);

  function handleSubmit(meeting: Meeting){
    setWorking(true);
    createMeeting(meeting).then(() => {
      setWorking(false)
      push(monthTransactionsPath(meeting.year, meeting.month));
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
