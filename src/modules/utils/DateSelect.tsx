import React, { FC, useState } from 'react';
import { Dialog, TextField } from '@material-ui/core';
import moment from 'moment';
import {
  DatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Settings from '../persistent/settings/Settings';

export interface DatePickerProps{
  year: number;
  month: number;
  day: number;
  onDateChange: (year: number, month: number, day: number) => void;
  settings: Settings;
  label: string;
}

const DateSelect: FC<DatePickerProps> = ({ year, month, day, onDateChange, settings, label }) => {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(false);

  const date = moment().startOf('year').year(year).month(month-1).date(day);

  function handleDateChange(newDate: any){
    const newMoment = moment(newDate);
    onDateChange(newMoment.year(), newMoment.month()+1, newMoment.date());
    setOpen(false);
  }

  function handleFocus(newFocus: boolean){
    if(newFocus && !focus){
      setOpen(true);
      setFocus(true);
    }else if(!open){
      setFocus(false);
    }
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        value={date.format(settings.formatting.date_format)}
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        onClick={() => setOpen(true)}
        inputProps={{ style: {caretColor: 'transparent'} }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DatePicker
          variant="static"
          value={moment().year(year).month(month-1).date(day)}
          onChange={handleDateChange} />
      </Dialog>
    </MuiPickersUtilsProvider>
  );
}

export default DateSelect;
