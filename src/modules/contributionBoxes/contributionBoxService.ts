
import ContributionBox from './ContributionBox';

import * as dao from './contributionBoxDAO';

import { addMsg } from '../utils/msgs/service';
import addErr from '../utils/err';

export function editAll(boxes: ContributionBox[]){
  return new Promise<ContributionBox[]>((resolve, reject) => {
    dao.list().then((existing) => {
      const toDestroy = existing
        .map(box => box.id as number)
        .filter(id => !!boxes.find(box => box.id === id));
      const toCreate = boxes.filter(box => box.id == null);
      const toUpdate = boxes.filter(box => box.id != null);
      dao.editAll(toCreate, toUpdate, toDestroy).then((boxes) => {
        addMsg('Contribution Boxes Updated');
        resolve(boxes);
      }, (err: any) => {
        addErr(err);
        reject(err);
      })
    });
  });
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
