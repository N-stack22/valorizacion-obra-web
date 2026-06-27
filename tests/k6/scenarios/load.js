import { DEFAULT_THRESHOLDS, LOAD_STAGES } from '../shared/config.js';
import { runReadOnlyValuationJourney } from '../shared/helpers.js';

export const options = {
  thresholds: DEFAULT_THRESHOLDS,
  scenarios: {
    expected_load: {
      executor: 'ramping-vus',
      stages: LOAD_STAGES,
      gracefulRampDown: '30s',
    },
  },
};

export default function () {
  runReadOnlyValuationJourney();
}
