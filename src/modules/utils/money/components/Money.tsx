import React, { FC } from 'react';
import { toS } from '../MoneyService';

export interface IMoneyProps {
  value: number;
}

const Money: FC<IMoneyProps> = ({ value }) => {
  return <div>{toS(value)}</div>
}

export default Money;
