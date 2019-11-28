import React, { FC } from 'react';
import { Box } from '@material-ui/core';

import { toMoneyS } from './service';

export interface IMoneyProps {
  value: number;
  fontWeight?: number;
}

const Money: FC<IMoneyProps> = ({ value, fontWeight }) => {
  return <Box textAlign="right" fontWeight={fontWeight}>{toMoneyS(value)}</Box>
}

export default Money;
