import React, { FC } from 'react';

import SerialNavigation from '../../../utils/SerialNavigation';

export interface YearNavigationProps{
  value?: number;
  onChange: (year: number) => void;
}

const YearNavigation: FC<YearNavigationProps> = ({ value, onChange}) => {
  if(!value){
    return null;
  }
  return (
    <SerialNavigation
      onPrev={() => { onChange(value - 1) }}
      onNext={() => { onChange(value + 1) }}>
      {value}
    </SerialNavigation>
  );
}

export default YearNavigation;
