/**
 * To install k6:
 * brew install k6  # macOS
 * sudo apt install k6  # Linux
 * choco install k6  # Windows

 * To run this script: k6 run performanceTesting.js
 */

import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 50 }, // Ramp-up to 50 users in 30s
    { duration: "1m", target: 100 }, // Stay at 100 users for 1 min
    { duration: "30s", target: 0 }, // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% of requests should be < 2000ms
    http_req_failed: ["rate<0.01"], // Less than 1% request failures
  },
};

const BASE_URL = "http://129.10.111.197/api";

export default function () {
  let responses = [];

  // Get all cards (paginated)
  responses.push(http.get(`${BASE_URL}/cards?page=1`));

  // Get a specific card by ID
  responses.push(http.get(`${BASE_URL}/cards/670580711d3345f198753b1d`));

  // Get scrapbook cards
  responses.push(http.get(`${BASE_URL}/cards/scrapbook`));

  // Get all themes
  responses.push(http.get(`${BASE_URL}/themes`));

  // Get all map cards with location data
  responses.push(http.get(`${BASE_URL}/map/allcardswithlocation`));

  // Validate all responses
  for (let res of responses) {
    check(res, {
      "Status is 200": (r) => r.status === 200,
      "Response time < 2000ms": (r) => r.timings.duration < 2000,
    });
  }

  sleep(1);
}
