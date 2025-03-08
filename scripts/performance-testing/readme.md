# Performance Testing Guide

This repository contains tools and scripts for performance testing our API application. The tests are designed to measure response times, throughput, and error rates under various load conditions.

## Prerequisites

- [k6](https://k6.io/) - Load testing tool
- SSH access to the server (for monitoring)
- Basic knowledge of terminal commands

## Installation

### Install k6

**macOS:**

```bash
brew install k6
```

**Linux:**

```bash
sudo apt install k6
```

**Windows:**

```bash
choco install k6
```

## Performance Test Script

The repository includes a `performanceTesting.js` script that tests various API endpoints under configured load patterns.

### Key Features

- Gradually increases load from 0 to 50 users over 30 seconds
- Maintains 100 concurrent users for 1 minute
- Gradually reduces load back to 0 over 30 seconds
- Verifies that 95% of requests complete in under 2 seconds
- Enforces a failure rate below 1%

### Endpoints Tested

The script tests the following endpoints:

- Paginated card listing: `/cards?page=1`
- Single card by ID: `/cards/670580711d3345f198753b1d`
- Scrapbook cards: `/cards/scrapbook`
- Theme listing: `/themes`
- Map cards with location data: `/map/allcardswithlocation`

## Running Performance Tests

1. **Clone this repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Review and update the BASE_URL in performanceTesting.js if needed:**

   ```javascript
   const BASE_URL = "http://129.10.111.197/api";
   ```

3. **Run the performance test:**

   ```bash
   k6 run performanceTesting.js
   ```

4. **View the results:**
   k6 will display a summary of the test results in the terminal, including:
   - Total number of requests
   - Request rate per second
   - Average, median, and 95th percentile response times
   - Success/failure rates

## Monitoring Server Resources

While the tests are running, you should monitor server resource usage to identify potential bottlenecks.

### Connect to the Server

```bash
ssh username@129.10.111.197
```

### Monitor CPU and Memory Usage with htop

```bash
htop
```

**Using htop:**

- Press `F2` to customize the display
- Press `F6` to sort processes (e.g., by CPU or memory usage)
- Press `F10` or `q` to exit

### Additional Monitoring Commands

**View real-time CPU usage:**

```bash
top
```

**Monitor system load average:**

```bash
uptime
```

**Check memory usage:**

```bash
free -m
```

**Check disk I/O:**

```bash
iostat -x 1
```

**Monitor network traffic:**

```bash
iftop
```

(Install with `sudo apt install iftop` if not available)

## Analyzing Results

1. Review the k6 output summary for:
   - HTTP request failure rate
   - Response time percentiles (p95, p99)
   - Requests per second
2. Correlate with server metrics:
   - CPU usage should ideally stay below 70% for sustained periods
   - Memory usage should not approach the server's total RAM
   - Watch for excessive I/O wait times or network saturation
3. Check the previous test results for comparison:
   [Previous Test Results](https://drive.google.com/drive/folders/1MKWoDZs1FORqXRZxfiLAxit_QT9WJ938?usp=drive_link)

## Common Issues and Solutions

- **High response times:** Check database queries and API endpoint optimization
- **Memory leaks:** Monitor increasing memory usage that doesn't decrease after tests
- **CPU bottlenecks:** Consider scaling horizontally or optimizing compute-intensive operations
- **Network issues:** Check for network saturation or rate limiting

## Next Steps

After identifying performance bottlenecks:

1. Optimize the problematic components
2. Run the tests again with the same parameters
3. Compare results to verify improvements
4. Document findings and optimizations
