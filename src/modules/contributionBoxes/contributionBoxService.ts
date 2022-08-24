
import ContributionBox from './ContributionBox';

import * as dao from './contributionBoxDAO';

import { addMsg } from '../utils/msgs/service';
import addErr from '../utils/Err';
import TransactionCode, { describeTransactionCodeShort } from '../transactions/types/TransactionCode';

export function newInstance(): ContributionBox{
  return {
    code: TransactionCode.W,
    title: describeTransactionCodeShort(TransactionCode.W),
  }
}

export function create(contributionBox: ContributionBox){
  return new Promise((resolve, reject) => {
    dao.create(contributionBox).then((contributionBox) => {
      addMsg('Contribution Box Created');
      resolve(contributionBox);
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  })
}

export function read(id: number){
  return dao.read(id);
}

export function update(contributionBox: ContributionBox){
  return new Promise((resolve, reject) => {
    dao.update(contributionBox).then((contributionBox) => {
      addMsg('Contribution Box Updated');
      resolve(contributionBox);
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  });
}

export function destroy(id: number){
  return new Promise((resolve, reject) => {
    dao.destroy(id).then(() => {
      addMsg('Contribution Box Destroyed');
      resolve();
    }, (err: any) => {
      addErr(err);
      reject(err);
    });
  });
}

export function list(){
  return dao.list();
}
