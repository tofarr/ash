
import AvailableLocale from '../../utils/locale/AvailableLocale';
import TransactionBreakdown from '../transactions/models/TransactionBreakdown';

export interface MeetingDays{
  sun: boolean,
  mon: boolean,
  tue: boolean,
  wed: boolean,
  thu: boolean,
  fri: boolean,
  sat: boolean,
}

/*
export interface RulesSettings{
  interest: true,
  wefts: true
}
*/

export interface Formatting{
  date_format: string,
  month_format: string,
}

export default interface Settings{
  locale: AvailableLocale,
  formatting: Formatting,

  congregation_name: string,
  city: string,
  province_or_state: string,
  accounts_servant_or_overseer: string,
  authorized_signer: string,


  cash_box: boolean,
  meeting_days: MeetingDays,
  // walkthrough: boolean,
  // rules: RulesSettings,
  transferToBranchDefaults: TransactionBreakdown[],
}
