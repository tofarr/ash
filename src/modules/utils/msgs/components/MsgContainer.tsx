import React, { Component, ReactElement } from 'react';
import { subscribeToMsgs, unsubscribeFromMsgs, clearMsgs } from '../MsgService';
import Msg from '../Msg';
import MsgType from '../MsgType';

export interface MsgContainerProps {
  children: (msgs: Msg[], clearMsgs: () => void) => ReactElement | null;
}

export interface MsgContainerState {
  msgs: Msg[],
}

export default class MsgContainer extends Component<MsgContainerProps, MsgContainerState> {
  state = {
    msgs: []
  }

  constructor(props:MsgContainerProps){
    super(props);
    this.setMsgs = this.setMsgs.bind(this);
  }

  setMsgs(msgs: Msg[]){
    this.setState({ msgs });
  }

  componentDidMount(){
    subscribeToMsgs(this.setMsgs);
  }

  componentWillUnmount(){
    unsubscribeFromMsgs(this.setMsgs);
  }

  render(){
    return this.props.children(this.state.msgs, clearMsgs);
  }
}
