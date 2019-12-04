import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { monthTransactionsPath } from '../../transactions/components/MonthTransactionsController';

import Loader from '../../utils/components/Loader';
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
  const [meeting, setMeeting] = useState<Meeting|undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    newMeeting().then((meeting) => {
      if(mounted){
        setMeeting(meeting);
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

  function handleSubmit(meeting: Meeting){
    setWorking(true);
    createMeeting(meeting).then(() => {
      setWorking(false)
      push(monthTransactionsPath(dateToMonth(meeting.date)));
    }, () => setWorking(false));
  }

  if(working && (!meeting)){
    return <Loader />
  }

  if(!meeting){
    return null;
  }

  return <MeetingForm
           meeting={meeting}
           onSubmit={handleSubmit}
           working={working} />
}

export default CreateMeetingController;
