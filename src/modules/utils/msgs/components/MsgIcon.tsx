import React, { FC } from 'react';
import InfoIcon from '@material-ui/icons/Info';
import ErrorIcon from '@material-ui/icons/Error';

import Msg from '../Msg';
import MsgType from '../MsgType';

export interface MsgIconProps {
  msg: Msg;
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'disabled' | 'error';
}

const MsgIcon: FC<MsgIconProps> = ({ msg, color }) => {

  const { type } = msg;

  switch(type){
    case MsgType.Info:
      return <InfoIcon color={color || 'primary'} />
    case MsgType.Warning:
    case MsgType.Error:
      return <ErrorIcon color={color || 'error'} />
    default:
      return null;
  }
}

export default MsgIcon;
