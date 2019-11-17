import React, { FC } from 'react';
import DateStamp from '../DateStamp';
import { toS } from '../DateStampService';

export interface DateStampProps {
  value: DateStamp;
  format: string;
}

const DateStampOutput: FC<DateStampProps> = ({ value, format }) => {
  return <div>{toS(value, format)}</div>
}

export default DateStampOutput;
