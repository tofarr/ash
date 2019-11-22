
import MsgType from './MsgType';

export default interface Msg{
  type: MsgType,
  msg: string;
  timestamp: Date;
}
