import React, { ChangeEvent, FC } from 'react';
import DateStamp from '../DateStamp';
import { fromS, toS } from '../DateStampService';

export interface DateStampInputProps {
  value: DateStamp;
  onChange: (value: DateStamp) => void;
  format: string;
}

const DateStampInput: FC<DateStampInputProps> = ({ value, onChange, format}) => {
  return <input
    type="text"
    value={toS(value, format)}
    onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(fromS(event.target.value, format))}
    />

}

export default DateStampInput;
