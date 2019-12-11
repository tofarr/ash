
import { TextEncoder } from 'text-encoding';
import moment from 'moment';

import Backup from './Backup';
import BackupSettings from './BackupSettings';

export const code = 'file';
export const title = 'Save to File';

export function save(backup: Backup, settings: BackupSettings) {
  return new Promise<BackupSettings>((resolve) => {
    const jsonStr = JSON.stringify(backup);
    const arrayBuffer = new TextEncoder().encode(jsonStr);
    const blob = new Blob([arrayBuffer], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = "ash-state-"+moment().format('YYYYMMDD-HHMMSS');
    a.href = downloadUrl;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    resolve({ ...settings, backed_up_at: new Date().getTime()});
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  });
}
