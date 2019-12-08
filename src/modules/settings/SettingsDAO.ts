
import DbService from '../utils/db';
import Settings from './Settings';

DbService.version(1).stores({
  settings: 'id++'
})

function table(){
  return DbService.table<Settings>('settings');
}

export function load(){
  return table().get(1);
}

export function store(settings: Settings){
  return table().put(settings, 1);
}
