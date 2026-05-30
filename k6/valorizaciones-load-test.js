import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "20s", target: 5 },
    { duration: "40s", target: 10 },
    { duration: "40s", target: 25 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1000"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:5173";

export default function () {
  const res = http.get(`${BASE_URL}/login`);

  check(res, {
    "status 200": (r) => r.status === 200,
    "carga html de la app": (r) =>
      r.body && (r.body.includes("root") || r.body.includes("script")),
  });

  sleep(1);
}