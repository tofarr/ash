import Settings from './Settings';

let settings: Settings|undefined = undefined;

export default function useSettings(){
  if(!settings){
    throw new Error("Settings not set - SettingsLoader should be a parent of the calling component");
  }
  return settings;
}

export function setSettings(updatedSettings: Settings){
  settings = updatedSettings;
}
