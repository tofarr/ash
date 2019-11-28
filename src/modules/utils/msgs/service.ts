import Msg from './Msg';
import MsgType from './MsgType';

const subscribers: ((msgs: Msg[]) => void)[] = [];
export const msgs: Msg[] = [];

export function addMsg(msg:string, type:MsgType = MsgType.Info){
  msgs.push({
    type,
    msg,
    timestamp: new Date(),
  });
  _publish();
}

export function clearMsgs(){
  msgs.length = 0;
  _publish();
}

export function subscribeToMsgs(callback: (msg: Msg[]) => void){
  subscribers.push(callback);
}

export function unsubscribeFromMsgs(callback: (msg: Msg[]) => void){
  const index = subscribers.indexOf(callback);
  if(index >= 0){
    subscribers.splice(index, 1);
  }else{
    console.error('Attempted to unsubscribe callback which was not subscribed!', callback);
  }
}

function _publish(){
  subscribers.forEach((subscriber) => subscriber(msgs));
}
