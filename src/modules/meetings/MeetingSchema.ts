import { array, object } from 'yup';
import { dateStr } from '../utils/schemas';
import contributionBoxContributionsSchema from './contributionBoxContributionsSchema';

export default function meetingSchema(){
  return object().shape({
    date: dateStr.required(),
    special_contribution_boxes: array().of(contributionBoxContributionsSchema().required()),
  });
};
