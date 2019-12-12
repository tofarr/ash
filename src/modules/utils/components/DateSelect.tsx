import React, { FC, useState } from 'react';
import { Button, Dialog, TextField } from '@material-ui/core';

import moment from 'moment';
import {
  DatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { DATE_FORMAT } from '../date';

export interface DatePickerProps{
  value: string;
  onChange: (value?: string) => void;
  label: string;
  required?: boolean;
  displayFormat?: string;
}

const DateSelect: FC<DatePickerProps> = ({ value, onChange, label, required, displayFormat }) => {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  if(!value && required){
    value = moment().format(DATE_FORMAT);
  }
  const valueStr = value ? moment(value, DATE_FORMAT).format(displayFormat || DATE_FORMAT) : '';

  function handleDateChange(newDate: any){
    const newMoment = moment(newDate);
    onChange(newMoment.format(DATE_FORMAT));
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
        required={required}
        variant="outlined"
        label={label}
        value={valueStr}
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        onClick={() => setOpen(true)}
        inputProps={{ style: {caretColor: 'transparent'} }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DatePicker
          variant="static"
          value={value ? moment(value, DATE_FORMAT) : moment()}
          onChange={handleDateChange} />
          <Button
            variant="contained"
            onClick={() => {
              onChange(undefined);
              setOpen(false);
            }}>
            Clear
          </Button>
      </Dialog>
    </MuiPickersUtilsProvider>
  );
}

export default DateSelect;
