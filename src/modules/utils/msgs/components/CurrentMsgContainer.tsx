import React, { Component, ReactElement } from 'react';
import { subscribeToMsgs, unsubscribeFromMsgs, clearMsgs } from '../MsgService';
import Msg from '../Msg';
import MsgType from '../MsgType';

export interface CurrentMsgContainerProps {
  msgTimeout?: number;
  children: (msg: Msg|null) => ReactElement | null;
}

export interface CurrentMsgContainerState {
  msg: Msg|null;
  timeoutId?: number;
}

export default class CurrentMsgContainer extends Component<CurrentMsgContainerProps, CurrentMsgContainerState> {

  state = {
    msg: null,
    timeoutId: undefined
  }

  static defaultProps = {
    msgTimeout: 3000
  }

  constructor(props:CurrentMsgContainerProps){
    super(props);
    this.setMsgs = this.setMsgs.bind(this);
    this.clearMsg = this.clearMsg.bind(this);
  }

  setMsgs(msgs: Msg[]){
    const msg = msgs[msgs.length - 1];
    if(msg){
      window.clearInterval(this.state.timeoutId);
      this.setState({ msg, timeoutId: window.setTimeout(this.clearMsg, this.props.msgTimeout) });
    }
  }

  clearMsg(){
    window.clearInterval(this.state.timeoutId);
    this.setState({ msg: null, timeoutId: undefined});
  }

  componentDidMount(){
    subscribeToMsgs(this.setMsgs);
  }

  componentWillUnmount(){
    unsubscribeFromMsgs(this.setMsgs);
    window.clearInterval(this.state.timeoutId);
  }

  render(){
    return this.props.children(this.state.msg);
  }
}
