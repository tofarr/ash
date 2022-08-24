
import Backup from './Backup';
import BackupSettings from './BackupSettings';
import backupSchema from './backupSchema';
import * as fileDAO from './FileDAO';
import * as transactionDAO from '../transactions/transactionDAO';
import * as SettingsDAO from '../settings/SettingsDAO';
import * as SettingsService from '../settings/SettingsService';
import * as contributionBoxDAO from '../contributionBoxes/contributionBoxDAO';
import * as transferToBranchDAO from '../transferToBranch/transferToBranchDAO';
import * as backupSettingsDAO from './backupSettingsDAO';
import { addMsg } from '../utils/msgs/service';

export function loadBackupSettings(){
  return new Promise<BackupSettings>((resolve, reject) => {
    backupSettingsDAO.load().then((backupSettings) => {
      resolve(backupSettings || newBackupSettings());
    }, reject);
  });
}

export function newBackupSettings(): BackupSettings{
  return {
    dao_code: fileDAO.code,
    settings: null
  }
}

export function storeBackupSettings(settings: BackupSettings){
  return backupSettingsDAO.store(settings);
}

export function saveBackup(){
  return new Promise<BackupSettings>((resolve, reject) => {
    Promise.all([
      createBackup(),
      loadBackupSettings()
    ]).then(([backup, backupSettings]) => {
      storeBackup(backup, backupSettings).then(backupSettings => {
        storeBackupSettings(backupSettings).then(() => resolve(backupSettings), reject);
      }, reject);
    }, reject);
  });
}

export function restoreFromBackup(backup: Backup){
  return new Promise<BackupSettings>((resolve, reject) => {
    backupSchema().validate(backup).then(() => {
      clear().then(() => {

        const promises = [] as Promise<any>[]
        promises.push.apply(promises, backup.transactions.map(transaction => transactionDAO.create(transaction)));
        promises.push(SettingsDAO.store(backup.settings));
        promises.push(contributionBoxDAO.restore(backup.boxes));
        promises.push(transferToBranchDAO.restore(backup.default_transaction_breakdowns));

        Promise.all(promises).then(() => {
          loadBackupSettings().then(backupSettings => {
            backupSettings = { ...backupSettings, backed_up_at: new Date().getTime() };
            storeBackupSettings(backupSettings).then(() => {
              addMsg('Local State Restored from Backup');
              resolve(backupSettings);
            }, reject);
          }, reject);
        }, reject)

      }, reject);
    }, reject);
  });
}

function clear(){
  return new Promise((resolve, reject) => {
    transactionDAO.list().then((transactions) => {
      Promise.all(transactions.map(transaction =>
         transactionDAO.destroy(transaction.id as number)))
      .then(resolve, reject);
    });
  });
}

export function createBackup(){
  return new Promise<Backup>((resolve, reject) => {
    Promise.all([
      SettingsService.loadSettings(),
      transactionDAO.list(),
      contributionBoxDAO.list(),
      transferToBranchDAO.list()
    ]).then(([settings, transactions, boxes, default_transaction_breakdowns]) => {
      resolve({
        timestamp: new Date().getTime(),
        settings,
        transactions,
        boxes,
        default_transaction_breakdowns
      })
    }, reject)
  });
}

export function storeBackup(backup: Backup, settings: BackupSettings){
  return getDAO(settings).save(backup, settings);
}

export function getDAO(settings: BackupSettings){
  const dao = getAvailableDAOs().find(dao => dao.code === settings.dao_code);
  if(!dao){
    throw new Error('Unknown DAO: '+settings.dao_code);
  }
  return dao;
}

export function getAvailableDAOs(){
  return [fileDAO];
}


//https://www.dropbox.com/developers/apps/create

//Maybe just use the saver button? Maybe programatically save, but have a restore be from a file - a longer process...

//In this case, the dropbox just becomes a boolean

//Will not work - opens a window.
