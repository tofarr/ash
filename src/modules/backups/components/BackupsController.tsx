import React, { FC, useEffect, useState} from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import moment from 'moment';
import Loader from '../../utils/components/Loader';
import BackupSettings from '../BackupSettings';
import { loadBackupSettings, saveBackup, restoreFromBackup } from '../backupService';
import useSettings, { setSettings as setGlobalSettings } from '../../settings/useSettings';
import * as settingsService from '../../settings/settingsService';
import addErr from '../../utils/err';
import { addMsg } from '../../utils/msgs/service';


export const BACKUPS_PATH = '/backups';

export interface BackupsControllerProps{
  setTitle: (title: string) => void;
}

const BackupsController: FC<BackupsControllerProps> = ({ setTitle }) => {
  setTitle('Backups');
  const [working, setWorking] = useState(false);
  const [backupSettings, setBackupSettings] = useState<BackupSettings|undefined>(undefined);
  const settings = useSettings();

  useEffect(() => {
    let mounted = true;
    setWorking(true);
    loadBackupSettings().then(backupSettings => {
      if(mounted){
        setBackupSettings(backupSettings);
        setWorking(false);
      }
    }, (err) => {
      addErr(err);
      setWorking(false);
    });
    return () => {
      mounted = false;
    }
  }, []);

  function handleSave(){
    setWorking(true);
    saveBackup().then(backupSettings => {
      addMsg('Backup Created');
      setBackupSettings(backupSettings);
      setWorking(false);
    }, (err) => {
      addErr(err);
      setWorking(false);
    });
  }

  function handleRestore(){
    const fileSelect = document.querySelector('#backup_file') as any;
    fileSelect.click();
  }

  function handleSelectFileForRestore(event: any){
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = () => {
      const jsonStr = reader.result as string;
      const backup = JSON.parse(jsonStr);
      restoreFromBackup(backup).then((backupSettings) => {
        setBackupSettings(backupSettings);
        settingsService.loadSettings().then(setGlobalSettings)
      });
    }
    reader.readAsText(file);
  }

  function renderMostRecentBackup(){
    const backedUpAt = backupSettings && backupSettings.backed_up_at;
    if(!backedUpAt){
      return 'Never';
    }
    const m = moment(new Date(backedUpAt));
    return m.format(`${settings.formatting.date_format} HH:mm:ss`);
  }

  if(working){
    return <Loader />;
  }

  if(!backupSettings){
    return null;
  }

  return (
    <Grid container spacing={1} justify="flex-end">
      <Grid item xs={12}>
        <TextField
          fullWidth
          disabled
          variant="outlined"
          label="Most Recent Back Up"
          value={renderMostRecentBackup()} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSave}>
          Save Backup
        </Button>
      </Grid>
      <Grid item xs={12} md={4}>
        <input
          id="backup_file"
          type="file"
          style={{display: 'none'}}
          onChange={handleSelectFileForRestore}
          accept=".json,application/json" />
        <Button
          fullWidth
          variant="contained"
          onClick={handleRestore}>
          Restore from Backup
        </Button>
      </Grid>
    </Grid>
  );
}

export default BackupsController;
