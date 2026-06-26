import { DEFAULT_THRESHOLDS, SMOKE_SCENARIO } from '../shared/config.js';
import { runReadOnlyValuationJourney } from '../shared/helpers.js';

export const options = {
  thresholds: DEFAULT_THRESHOLDS,
  scenarios: {
    smoke: SMOKE_SCENARIO,
  },
};

export default function () {
  runReadOnlyValuationJourney();
}
