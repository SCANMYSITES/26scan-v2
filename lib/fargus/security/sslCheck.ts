import https from "https";

export async function checkSslValidity(targetUrl: string) {
  return new Promise<{ sslValid: boolean; daysToExpiry: number | null }>((resolve) => {
    try {
      const url = new URL(targetUrl);

      const req = https.get(
        {
          hostname: url.hostname,
          port: 443,
          method: "GET",
        },
        (res) => {
          const tlsSocket: any = res.socket;

          // ⭐ Universal certificate extraction (works in Node 18–26)
          const cert =
            tlsSocket.getPeerCertificate?.() ||
            tlsSocket.getCertificate?.() ||
            tlsSocket.getTLSSocket?.()?.getPeerCertificate?.() ||
            null;

          if (!cert || !cert.valid_to) {
            return resolve({ sslValid: false, daysToExpiry: null });
          }

          const expiry = new Date(cert.valid_to);
          const now = new Date();
          const diffMs = expiry.getTime() - now.getTime();
          const daysToExpiry = Math.round(diffMs / (1000 * 60 * 60 * 24));

          resolve({
            sslValid: diffMs > 0,
            daysToExpiry,
          });
        }
      );

      req.on("error", () => {
        resolve({ sslValid: false, daysToExpiry: null });
      });
    } catch {
      resolve({ sslValid: false, daysToExpiry: null });
    }
  });
}
