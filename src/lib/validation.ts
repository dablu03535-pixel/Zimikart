export type Rule = (value: string, all: Record<string, string>) => string | undefined;

export const required =
  (label: string): Rule =>
  (v) =>
    v.trim() ? undefined : `${label} is required.`;

export const minLength =
  (label: string, n: number): Rule =>
  (v) =>
    !v || v.length >= n ? undefined : `${label} must be at least ${n} characters.`;

export const email =
  (): Rule =>
  (v) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? undefined : 'Enter a valid email address.';

export const indianMobile =
  (): Rule =>
  (v) =>
    !v || /^[6-9]\d{9}$/.test(v) ? undefined : 'Enter a 10-digit Indian mobile number.';

export const pincode =
  (): Rule =>
  (v) =>
    !v || /^[1-9]\d{5}$/.test(v) ? undefined : 'Enter a valid 6-digit pincode.';

export const gstin =
  (): Rule =>
  (v) =>
    !v || /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/.test(v.toUpperCase())
      ? undefined
      : 'GSTIN format looks wrong (15 characters). Leave blank if not applicable.';

export const positiveNumber =
  (label: string): Rule =>
  (v) =>
    !v || (Number.isFinite(Number(v)) && Number(v) > 0) ? undefined : `${label} must be greater than 0.`;

export const matches =
  (other: string, message: string): Rule =>
  (v, all) =>
    v === all[other] ? undefined : message;

export const truthy =
  (message: string): Rule =>
  (v) =>
    v === 'true' ? undefined : message;

export const all =
  (...rules: Rule[]): Rule =>
  (v, a) => {
    for (const r of rules) {
      const e = r(v, a);
      if (e) return e;
    }
    return undefined;
  };
