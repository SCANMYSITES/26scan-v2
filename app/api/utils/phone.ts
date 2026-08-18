// app/api/utils/phone.ts

/**
 * validateAndNormalizePhone
 * -------------------------
 * Accepts ANY user input (dashes, spaces, parentheses)
 * Validates that it contains EXACTLY 10 digits
 * Converts it to Twilio‑ready E.164 format: +1XXXXXXXXXX
 */

export function validateAndNormalizePhone(input: string) {
  // Remove all non-digit characters
  const digits = input.trim().replace(/\D/g, "");


  // Must be exactly 10 digits
  if (digits.length !== 10) {
    return {
      valid: false,
      error: "Phone number must be 10 digits (example: 5551234567)."
    };
  }

  // Must be numeric
  if (!/^\d{10}$/.test(digits)) {
    return {
      valid: false,
      error: "Phone number must contain only digits."
    };
  }

  // Normalize to E.164 (+1XXXXXXXXXX)
  const normalized = `+1${digits}`;

  return {
    valid: true,
    phone: normalized
  };
}
