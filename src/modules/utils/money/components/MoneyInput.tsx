import React, { ChangeEvent, FC } from 'react';
import { fromS, toS } from '../MoneyService';

export interface IMoneyInputProps {
  value: number;
  onChange: (value: number) => void;
}

const MoneyInput: FC<IMoneyInputProps> = ({ value, onChange}) => {
  return <input
    type="number"
    value={toS(value)}
    onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(fromS(event.target.value))}
    />

}

export default MoneyInput;
