import { DEFAULT_THRESHOLDS, SOAK_SCENARIO } from '../shared/config.js';
import { runReadOnlyValuationJourney } from '../shared/helpers.js';

export const options = {
  thresholds: DEFAULT_THRESHOLDS,
  scenarios: {
    soak: SOAK_SCENARIO,
  },
};

export default function () {
  runReadOnlyValuationJourney();
}
