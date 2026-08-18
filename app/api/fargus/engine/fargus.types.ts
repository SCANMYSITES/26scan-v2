// C:\A_DEVJUL\26SCAN\app\api\fargus\engine\fargus.types.ts

export interface FargusParams {
  query: string;
  mode: string;
  userId: string;
  flags: {
    verbose: boolean;
    diagnostics: boolean;
  };
  timestamp: number;
}

export interface FargusResult {
  ok: boolean;
  data?: any;
  error?: any;
  timestamp: number;
  meta?: any;
}
