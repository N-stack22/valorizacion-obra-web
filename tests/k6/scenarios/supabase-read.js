import { DEFAULT_THRESHOLDS } from '../shared/config.js';
import { requestSupabaseAuthSettingsProbe, requestSupabaseReadProbe, thinkTime } from '../shared/helpers.js';

export const options = {
  thresholds: DEFAULT_THRESHOLDS,
  scenarios: {
    supabase_read_probe: {
      executor: 'constant-vus',
      vus: Number(__ENV.VUS || 5),
      duration: __ENV.DURATION || '2m',
      gracefulStop: '20s',
    },
  },
};

export default function () {
  requestSupabaseAuthSettingsProbe();
  thinkTime();
  requestSupabaseReadProbe();
  thinkTime();
}
