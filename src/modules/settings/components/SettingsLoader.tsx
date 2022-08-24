import React, { FC, ReactElement, useEffect, useState } from 'react';
import Settings from '../../settings/Settings';
import { loadSettings } from '../SettingsService';
import { setSettings } from '../useSettings';
import Loader from '../../utils/components/Loader';

export interface SettingsLoaderProps{
  children: (settings: Settings) => ReactElement | null;
}

const SettingsLoader: FC<SettingsLoaderProps> = ({ children }) => {

  const [working, setWorking] = useState(false);
  const [loadedSettings, setLoadedSettings] = useState<undefined|Settings>(undefined);

  useEffect(() => {
    setWorking(true);
    loadSettings().then((settings) => {
      setLoadedSettings(settings);
      setSettings(settings);
      setWorking(false);
    }, () => setWorking(false));
  }, []);

  if(working){
    return <Loader />;
  }

  if(!loadedSettings){
    return null;
  }

  return children(loadedSettings);
}


export default SettingsLoader;
