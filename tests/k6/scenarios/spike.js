import { DEFAULT_THRESHOLDS, SPIKE_STAGES } from '../shared/config.js';
import { runReadOnlyValuationJourney } from '../shared/helpers.js';

export const options = {
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    http_req_failed: ['rate<0.03'],
    http_req_duration: ['p(95)<5000', 'p(99)<8000'],
  },
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      stages: SPIKE_STAGES,
      gracefulRampDown: '30s',
    },
  },
};

export default function () {
  runReadOnlyValuationJourney();
}
