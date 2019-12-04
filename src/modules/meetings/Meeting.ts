
import SpecialContributionBox from './SpecialContributionBox';
import Settings from '../settings/Settings';

export default interface Meeting {
  date: string;
  congregation_cash: number;
  congregation_cheques: number;
  worldwide_cash: number;
  worldwide_cheques: number;
  special_contribution_boxes: SpecialContributionBox[];
  settings: Settings;
}
