import React, { ChangeEvent, FC, FocusEvent, KeyboardEvent, useState } from 'react';
import { fromS, toS } from '../MoneyService';
import { TextField } from '@material-ui/core';

export interface IMoneyInputProps {
  label?: string;
  value?: number;
  onChange: (value?: number) => void;
}

const MoneyInput: FC<IMoneyInputProps> = ({ label, value, onChange}) => {

  const [internalValue, setInternalValue] = useState(toS(value));
  const [prevValue, setPrevValue] = useState(value);

  if(value != prevValue){
    setInternalValue(toS(value));
    setPrevValue(value);
  }

  function handleChange(){
    const newInternalValue = fromS(internalValue);
    setInternalValue(toS(newInternalValue));
    onChange(newInternalValue);
  }

  return <TextField
    label={label}
    fullWidth
    type="number"
    variant="outlined"
    value={internalValue}
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
