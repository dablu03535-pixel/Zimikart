import { useState, type FormEvent } from 'react';
import { catalogService } from '@/services/catalogService';
import { pincode as pincodeRule } from '@/lib/validation';
import type { PincodeResult } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Fields';
import { Alert } from '@/components/ui/Feedback';

export function PincodeChecker() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PincodeResult>();
  const [failure, setFailure] = useState<string>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(undefined);
    setFailure(undefined);
    const msg = !value ? 'Enter your 6-digit pincode.' : pincodeRule()(value, {});
    setError(msg);
    if (msg) return;
    setBusy(true);
    try {
      setResult(await catalogService.checkPincode(value));
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Could not check this pincode.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-3" aria-label="Check delivery to your pincode">
      <div className="flex items-end gap-2">
        <div className="flex-1"><TextField label="Delivery pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" placeholder="e.g. 560001" value={value} onChange={(e) => { setValue(e.target.value.replace(/\D/g, '')); setError(undefined); }} error={error} /></div>
        <Button type="submit" variant="outline" loading={busy}>Check</Button>
      </div>
      <div aria-live="polite">
        {result ? <Alert tone={result.serviceable ? 'success' : 'warning'} title={result.serviceable ? 'Deliverable' : 'Not deliverable'}>{result.message}</Alert> : null}
        {failure ? <Alert tone="error">{failure}</Alert> : null}
      </div>
    </form>
  );
}
