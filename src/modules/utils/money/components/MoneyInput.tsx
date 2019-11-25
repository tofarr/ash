import React, { ChangeEvent, FC, FocusEvent, KeyboardEvent, useState } from 'react';
import { fromS, toS } from '../MoneyService';
import { TextField } from '@material-ui/core';

export interface IMoneyInputProps {
  name?: string;
  label?: string;
  value?: number;
  onChange: (value?: number) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const MoneyInput: FC<IMoneyInputProps> = ({ name, label, value, onChange, error, helperText, required}) => {

  if(required && error === undefined){
    error = (value == null);
  }

  const [internalValue, setInternalValue] = useState(toS(value));
  const [prevValue, setPrevValue] = useState(value);

  if(value !== prevValue){
    setInternalValue(toS(value));
    setPrevValue(value);
  }

  function handleChange(){
    const newInternalValue = fromS(internalValue);
    setInternalValue(toS(newInternalValue));
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

export default MoneyInput;
