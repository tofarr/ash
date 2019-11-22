import React, { FC, ReactElement, useEffect, useState } from 'react';
import Settings from '../../settings/Settings';
import { loadSettings } from '../../settings/SettingsService';
import Loader from '../../../utils/Loader';

export interface SettingsLoaderProps{
  children: (settings: Settings) => ReactElement | null;
}

const SettingsLoader: FC<SettingsLoaderProps> = ({ children }) => {

  const [working, setWorking] = useState(false);
  const [settings, setSettings] = useState<null|Settings>(null);

  useEffect(() => {
    setWorking(true);
    loadSettings().then((settings) => {
      setSettings(settings);
      setWorking(false);
    }, () => setWorking(false));
  }, []);

  if(working){
    return <Loader />;
  }

  if(!settings){
    return null;
  }

  return children(settings);
}


export default SettingsLoader;
