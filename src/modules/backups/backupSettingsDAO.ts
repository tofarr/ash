
import DbService from '../utils/db';
import BackupSettings from './BackupSettings';
import backupSettingsSchema from './backupSettingsSchema';

DbService.version(1).stores({
  backup_settings: ''
})

function table(){
  return DbService.table<BackupSettings>('backup_settings');
}

export function load(): Promise<BackupSettings>{
  return table().get(1);
}

export function store(settings: BackupSettings){
  return new Promise((resolve, reject) => {
    backupSettingsSchema().validate(settings).then(() => {
      table().put(settings, 1).then(resolve, reject);
    }, reject);
  });
}
