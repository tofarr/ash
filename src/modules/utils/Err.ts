import MsgType from './msgs/MsgType';
import { addMsg } from './msgs/service';

function getMsg(err: any): string {
  if(err.msg){
    return getMsg(err.msg);
  }else if(err.message){
    return getMsg(err.message);
  }else if(err.error){
    return getMsg(err.error);
  }else{
    return err.toString();
  }
};

export default function(err: any) {
  addMsg(getMsg(err), MsgType.Error);
}
