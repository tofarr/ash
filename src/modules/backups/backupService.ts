
import Backup from './Backup';
import BackupSettings from './BackupSettings';
import backupSchema from './backupSchema';
import * as fileDAO from './FileDAO';
import * as transactionService from '../transactions/transactionService';
import * as settingsService from '../settings/settingsService';
import * as contributionBoxService from '../contributionBoxes/contributionBoxService';
import * as transferToBranchService from '../transferToBranch/transferToBranchService';
import * as backupSettingsDAO from './backupSettingsDAO';

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
  return new Promise((resolve, reject) => {
    backupSchema().validate(backup).then(() => {
      clear().then(() => {

        const promises = backup.transactions.map(transaction => transactionService.create(transaction))

        promises.push(settingsService.storeSettings(backup.settings));

        promises.push(contributionBoxService.editAll(backup.boxes.map((box) => {
          return {
            ...box,
            id: undefined,
          }
        })));

        promises.push(transferToBranchService.storeDefaultBreakdown(
          backup.default_transaction_breakdowns.map(breakdown => {
            return {
              ...breakdown,
              id: undefined,
            }
          })
        ));

        Promise.all(promises).then(() => {
          loadBackupSettings().then(backupSettings => {
            storeBackupSettings({ ...backupSettings, backed_up_at: new Date().getTime() }).then(resolve, reject);
          }, reject);
        }, reject)

      }, reject);
    }, reject);
  });
}

function clear(){
  return new Promise((resolve, reject) => {
    transactionService.list().then((transactions) => {
      Promise.all(transactions.map(transaction =>
         transactionService.destroy(transaction.id as number)))
      .then(resolve, reject);
    });
  });
}

export function createBackup(){
  return new Promise<Backup>((resolve, reject) => {
    Promise.all([
      settingsService.loadSettings(),
      transactionService.list(),
      contributionBoxService.list(),
      transferToBranchService.loadDefaultBreakdown()
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
  const dao = getAvailableDAOs().find(dao => dao.code == settings.dao_code);
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
