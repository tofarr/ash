
import ContributionBoxContributions from './ContributionBoxContributions';
import Settings from '../settings/Settings';

export default interface Meeting {
  date: string;
  boxes: ContributionBoxContributions[];
  settings: Settings;
}
