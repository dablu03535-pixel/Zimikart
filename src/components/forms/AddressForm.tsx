import type { FormEvent } from 'react';
import { useForm } from '@/hooks/useForm';
import { all, indianMobile, pincode, required } from '@/lib/validation';
import type { Address } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Fields';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

type Values = { label: string; fullName: string; phone: string; line1: string; line2: string; landmark: string; city: string; state: string; pincode: string };
export type AddressValues = Omit<Address, 'id'>;

interface Props {
  submitLabel: string;
  busy?: boolean;
  onSubmit: (a: AddressValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function AddressForm({ submitLabel, busy, onSubmit, onCancel }: Props) {
  const f = useForm<Values>(
    { label: 'Home', fullName: '', phone: '', line1: '', line2: '', landmark: '', city: '', state: '', pincode: '' },
    {
      fullName: required('Full name'),
      phone: all(required('Mobile number'), indianMobile()),
      line1: required('Address line 1'),
      city: required('City'),
      state: required('State'),
      pincode: all(required('Pincode'), pincode()),
    },
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.validate()) return;
    const v = f.values;
    const out: AddressValues = {
      label: v.label as Address['label'], fullName: v.fullName.trim(), phone: v.phone, line1: v.line1.trim(), city: v.city.trim(), state: v.state, pincode: v.pincode,
      ...(v.line2.trim() ? { line2: v.line2.trim() } : {}),
      ...(v.landmark.trim() ? { landmark: v.landmark.trim() } : {}),
    };
    void onSubmit(out);
  };
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><TextField label="Full name" autoComplete="name" required {...f.field('fullName')} /></div>
      <TextField label="Mobile number" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" required hint="10 digits, no +91" {...f.field('phone')} />
      <SelectField label="Address type" {...f.field('label')}><option>Home</option><option>Work</option><option>Other</option></SelectField>
      <div className="sm:col-span-2"><TextField label="Address line 1" autoComplete="address-line1" required hint="House / flat no., building, street" {...f.field('line1')} /></div>
      <div className="sm:col-span-2"><TextField label="Address line 2 (optional)" autoComplete="address-line2" {...f.field('line2')} /></div>
      <div className="sm:col-span-2"><TextField label="Landmark (optional)" {...f.field('landmark')} /></div>
      <TextField label="City" autoComplete="address-level2" required {...f.field('city')} />
      <SelectField label="State" autoComplete="address-level1" required {...f.field('state')}>
        <option value="">Select state</option>
        {INDIAN_STATES.map((s) => (<option key={s}>{s}</option>))}
      </SelectField>
      <TextField label="Pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" required {...f.field('pincode')} />
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" loading={busy ?? false}>{submitLabel}</Button>
        {onCancel ? <Button variant="ghost" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}
