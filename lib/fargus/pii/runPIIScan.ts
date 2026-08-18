// Helper: fetch HTML safely using built-in fetch
async function fetchHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    return await res.text();
  } catch {
    return "";
  }
}

// 1️⃣ Email detection
function findEmails(html: string): string[] {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  return html.match(emailRegex) || [];
}

// 2️⃣ Phone number detection
function findPhones(html: string): string[] {
  const phoneRegex = /\+?\d[\d\s\-()]{7,}/g;
  return html.match(phoneRegex) || [];
}

// 3️⃣ Address detection (simple pattern)
function findAddresses(html: string): string[] {
  const addressRegex = /\d{1,5}\s\w+(\s\w+)*(?:\sAve|\sRd|\sSt|\sBlvd|\sLane|\sDrive)/gi;
  return html.match(addressRegex) || [];
}

// 4️⃣ API key detection (common formats)
function findApiKeys(html: string): string[] {
  const patterns = [
    /AIza[0-9A-Za-z\-_]{35}/g, // Google API key
    /sk_live_[0-9a-zA-Z]{24}/g, // Stripe live key
    /sk_test_[0-9a-zA-Z]{24}/g, // Stripe test key
    /pk_live_[0-9a-zA-Z]{24}/g, // Stripe publishable
    /pk_test_[0-9a-zA-Z]{24}/g,
    /AKIA[0-9A-Z]{16}/g, // AWS key
  ];

  let found: string[] = [];

  for (const regex of patterns) {
    const matches = html.match(regex);
    if (matches) found = found.concat(matches);
  }

  return found;
}

// 5️⃣ Token detection (JWT-like)
function findTokens(html: string): string[] {
  const tokenRegex = /eyJ[A-Za-z0-9_\-]+?\.[A-Za-z0-9_\-]+?\.[A-Za-z0-9_\-]+/g;
  return html.match(tokenRegex) || [];
}

// 6️⃣ Insecure forms (HTTP action)
function findInsecureForms(html: string): boolean {
  return html.includes('form action="http://');
}

// 7️⃣ Third-party form endpoints
function findThirdPartyForms(html: string): string[] {
  const formRegex = /form action="([^"]+)"/g;
  const matches = [...html.matchAll(formRegex)];

  return matches
    .map((m) => m[1])
    .filter((action) => !action.includes(window?.location?.hostname || ""));
}

// ⭐ MAIN PII SCAN
export async function runPIIScan(url: string) {
  const html = await fetchHtml(url);

  return {
    emailsFound: findEmails(html),
    phonesFound: findPhones(html),
    addressesFound: findAddresses(html),
    apiKeysFound: findApiKeys(html),
    tokensFound: findTokens(html),
    formsInsecure: findInsecureForms(html),
    thirdPartyForms: findThirdPartyForms(html),
  };
}
