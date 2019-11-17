
import AvailableLocale from '../../utils/locale/AvailableLocale';

export interface MeetingDays{
  sun: boolean,
  mon: boolean,
  tue: boolean,
  wed: boolean,
  thu: boolean,
  fri: boolean,
  sat: boolean,
}

export interface RulesSettings{
  interest: true,
  wefts: true
}

export interface Formatting{
  date_format: string,
  month_format: string,
  //money_format: string,
}

export default interface Settings{
  locale: AvailableLocale,
  formatting: Formatting,
  congregation: string,
  city: string,
  province: string,
  cash_box: boolean,
  meeting_days: MeetingDays,
  walkthrough: boolean,
  rules: RulesSettings,
}
