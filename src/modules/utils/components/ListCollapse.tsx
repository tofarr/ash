import React, { Component, ReactNode } from 'react';
import { Collapse } from '@material-ui/core';

export interface IWrapper<T>{
  item: T;
  in: boolean;
  targetIn: boolean;
}

interface IProps<T>{
  items: T[];
  timeout?: number;
  component: (item:T) => ReactNode;
  identifier: (item:T) => string|number;
}

interface IState<T>{
  wrappers: IWrapper<T>[];
}


class ListCollapse<T> extends Component<IProps<T>, IState<T>> {

  static defaultProps = {
    animation: true
  }

  constructor(props:IProps<T>) {
    super(props)
    this.handleRemove = this.handleRemove.bind(this);
    this.renderWrapper = this.renderWrapper.bind(this);

    this.state = {
      wrappers: props.items.map((item:T) => {
        return { item, in: true, targetIn: true }
      })
    }
  }

  doRemovals(items:T[], wrappers:IWrapper<T>[]){
    const { identifier } = this.props;
    wrappers.forEach((wrapper) => {
      wrapper.targetIn = !!items.find((item) => identifier(item) === identifier(wrapper.item))
    });
  }

  doInsertionsAndUpdates(items:T[], wrappers:IWrapper<T>[]){
    const { identifier } = this.props;
    for(let i = 0; i < items.length; i++){
      const item = items[i];
      const index = wrappers.findIndex((wrapper) => identifier(item) === identifier(wrapper.item));
      if(index >= 0){
        wrappers[index].item = item;
      }else{
        wrappers.splice(i, 0, {item: item, in: false, targetIn: true});
      }
    }
  }

  UNSAFE_componentWillReceiveProps(newProps:IProps<T>) {
    const { items } = newProps;
    const wrappers = this.state.wrappers.slice();
    this.doRemovals(items, wrappers);
    this.doInsertionsAndUpdates(items, wrappers);
    this.setState({ wrappers: wrappers});
  }

  componentDidUpdate(){
    let doUpdate = false;
    const wrappers = this.state.wrappers.map((wrapper) => {
      if(wrapper.in !== wrapper.targetIn){
        wrapper.in = wrapper.targetIn;
        doUpdate = true;
      }
      return wrapper;
    });
    if(doUpdate){
      this.setState({ wrappers: wrappers });
    }
  }

  handleRemove(id: number){
    this.setState({
      wrappers: this.state.wrappers.filter((wrapper) => this.props.identifier(wrapper.item) !== id)
    });
  }


  renderWrapper(wrapper:IWrapper<T>) {
    const { identifier } = this.props;
    return (
      <Collapse
        key={identifier(wrapper.item)}
        in={wrapper.in}
        timeout={this.props.timeout}
        onExited={() => this.handleRemove(identifier(wrapper.item) as number)}>
        {this.props.component(wrapper.item)}
      </Collapse>
    );
  }

  render() {
    return this.state.wrappers.map(this.renderWrapper);
  }
}

export default ListCollapse;
