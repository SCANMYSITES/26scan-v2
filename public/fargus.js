// FARGUS Website Monitoring Agent
// This script runs inside the user's website and sends events to 26Scan.

(function () {
  const FARGUS_ENDPOINT = "/api/fargus/event-analysis";

  // Utility: send event to FARGUS backend
  async function sendEvent(event) {
    try {
      const res = await fetch(FARGUS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)
      });

      const data = await res.json();
      console.log("FARGUS Analysis:", data);
    } catch (err) {
      console.error("FARGUS error:", err);
    }
  }

  // Example event: SSL expiration check
  function checkSSL() {
    // Placeholder — real SSL checks require server-side logic
    const event = {
      event_type: "ssl_expiring",
      domain: window.location.hostname,
      days_left: 14
    };

    sendEvent(event);
  }

  // Example event: Page load performance
  function checkPerformance() {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;

    const event = {
      event_type: "performance",
      domain: window.location.hostname,
      load_time_ms: loadTime
    };

    sendEvent(event);
  }

  // Example event: Heartbeat (site is alive)
  function heartbeat() {
    const event = {
      event_type: "heartbeat",
      domain: window.location.hostname,
      timestamp: new Date().toISOString()
    };

    sendEvent(event);
  }

  // Run checks
  window.addEventListener("load", () => {
    checkSSL();
    checkPerformance();
    heartbeat();
  });

  // Send heartbeat every 24 hours
  setInterval(heartbeat, 24 * 60 * 60 * 1000);
})();
