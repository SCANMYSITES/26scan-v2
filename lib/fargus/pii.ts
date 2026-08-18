// lib/fargus/pii.ts
import axios from "axios";
import * as cheerio from "cheerio";

export async function runPIIScan(url: string) {
  const results = {
    emailsFound: [],
    phonesFound: [],
    addressesFound: [],
    apiKeysFound: [],
    tokensFound: [],
    insecureForms: [],
    thirdPartyForms: [],
  };

  try {
    const response = await axios.get(url, { timeout: 8000 });
    const $ = cheerio.load(response.data);
    const html = $.html();

    // ---------------------------
    // EMAILS
    // ---------------------------
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    results.emailsFound = html.match(emailRegex) || [];

    // ---------------------------
    // PHONE NUMBERS
    // ---------------------------
    const phoneRegex = /\+?\d[\d\s\-()]{7,}/g;
    results.phonesFound = html.match(phoneRegex) || [];

    // ---------------------------
    // ADDRESSES
    // ---------------------------
    const addressRegex = /\d{1,5}\s\w+(\s\w+)*(?:\sAve|\sRd|\sSt|\sBlvd|\sLane|\sDrive)/gi;
    results.addressesFound = html.match(addressRegex) || [];

    // ---------------------------
    // API KEYS
    // ---------------------------
    const apiKeyRegex = /(AIza[0-9A-Za-z\-_]{35})|(sk_live_[0-9A-Za-z]{24,})/g;
    results.apiKeysFound = html.match(apiKeyRegex) || [];

    // ---------------------------
    // TOKENS
    // ---------------------------
    const tokenRegex = /token=[A-Za-z0-9\-_]+/g;
    results.tokensFound = html.match(tokenRegex) || [];

    // ---------------------------
    // INSECURE FORMS
    // ---------------------------
    $("form").each((_, el) => {
      const action = $(el).attr("action") || "";
      if (action.startsWith("http://")) {
        results.insecureForms.push(action);
      }
    });

    // ---------------------------
    // THIRD-PARTY FORMS
    // ---------------------------
    $("form").each((_, el) => {
      const action = $(el).attr("action") || "";
      if (action && !action.includes(url)) {
        results.thirdPartyForms.push(action);
      }
    });

    return results;
  } catch (err) {
    return { error: "PII scan failed", details: err };
  }
}
