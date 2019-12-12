import { boolean, number, object, string } from 'yup';

export default function settingsSchema(){
  return object().shape({
    formatting: formattingSchema().required(),

    congregation_name: string(),
    city: string(),
    province_or_state: string(),
    accounts_servant_or_overseer: string(),
    authorized_signer: string(),
    other_account_description: string(),

    cash_box: boolean().required(),
    min_num_interest: number().integer().min(0).required(),
    min_num_expenditure: number().integer().min(0).required(),

    meeting_days: meetingDaysSchema().required(),
  })
}

export function formattingSchema(){
  return object().shape({
    date_format: string().required(),
    month_format: string().required(),
  });
}

export function meetingDaysSchema(){
  return object().shape({
    sun: boolean().required(),
    mon: boolean().required(),
    tue: boolean().required(),
    wed: boolean().required(),
    thu: boolean().required(),
    fri: boolean().required(),
    sat: boolean().required(),
  });
}
//Validate settings
