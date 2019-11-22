import err from './Err';

export const tasks:string[] = [];
const subscribers: ((working:string[]) => void)[] = [];

export function addTask(name:string){
  tasks.push(name);
}

export function removeTask(name:string){
  const index = tasks.indexOf(name);
  if(index >= 0){
    tasks.splice(index, 1);
  }else{
    console.error('NonExistantTask', name);
  }
}

export function monitor<T>(name:string, promise:Promise<T>){
  addTask(name);
  promise.then(() => removeTask(name), (e:any) => {
    removeTask(name);
    err(e);
  });
  return promise;
}

export function subscribeToTasks(callback: (tasks:string[]) => void){
  subscribers.push(callback);
}

export function unsubscribeFromTasks(callback: (working:string[]) => void){
  const index = subscribers.indexOf(callback);
  if(index >= 0){
    subscribers.splice(index, 1);
  }else{
    console.error('Attempted to unsubscribe callback which was not subscribed!', callback);
  }
}
