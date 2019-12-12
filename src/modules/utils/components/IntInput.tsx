import React, { ChangeEvent, FC, FocusEvent, KeyboardEvent, useState } from 'react';
import { TextField } from '@material-ui/core';

export interface IIntInputProps {
  name?: string;
  label?: string;
  value?: number;
  onChange: (value?: number) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const IntInput: FC<IIntInputProps> = ({ name, label, value, onChange, error, helperText, required}) => {

  if(required && error === undefined){
    error = (value == null);
  }

  const [internalValue, setInternalValue] = useState((value == null) ? '' : value.toString());
  const [prevValue, setPrevValue] = useState(value);

  if(value !== prevValue){
    setInternalValue((value == null) ? '' : value.toString());
    setPrevValue(value);
  }

  function handleChange(){
    const newInternalValue = internalValue.length ? parseInt(internalValue) : (required ? 0 : undefined);
    setInternalValue((newInternalValue == null) ? '' : newInternalValue.toString());
    onChange(newInternalValue);
  }

  return <TextField
    name={name}
    label={label}
    fullWidth
    type="number"
    variant="outlined"
    value={internalValue}
    error={error}
    helperText={helperText}
    required={required}
    onChange={(event: ChangeEvent<HTMLInputElement>) => setInternalValue(event.target.value)}
    onFocus={(event: FocusEvent<HTMLInputElement>) => event.target.select()}
    onBlur={() => handleChange()}
    onKeyDown={(event: KeyboardEvent) => {
      if(event.key === 'Enter'){
        handleChange()
      }
    }} />
}

export default IntInput;
