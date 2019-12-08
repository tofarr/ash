import React, { FC, useState} from 'react';

import SettingsForm from './SettingsForm';
import { storeSettings } from '../SettingsService';
import useSettings, { setSettings } from '../useSettings';

export const SETTINGS_PATH = '/settings';

export interface SettingsControllerProps{
  setTitle: (title: string) => void;
}

const SettingsController: FC<SettingsControllerProps> = ({ setTitle }) => {
  setTitle('Settings');
  const [internalSettings, setInternalSettings] = useState(useSettings());

  function handleSubmit(){
    storeSettings(internalSettings).then(() => setSettings(internalSettings));
  }

  return <SettingsForm settings={internalSettings} onChange={setInternalSettings} onSubmit={handleSubmit} />
}

export default SettingsController;
