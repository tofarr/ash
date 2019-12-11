
import DbService from '../utils/db';
import Settings from './Settings';
import settingsSchema from './settingsSchema';

DbService.version(1).stores({
  settings: ''
})

function table(){
  return DbService.table<Settings>('settings');
}

export function load(){
  return table().get(1);
}

export function store(settings: Settings){
  return new Promise((resolve, reject) => {
    settingsSchema().validate(settings).then(() => {
      table().put(settings, 1).then(resolve, reject);
    }, reject);
  });
}
