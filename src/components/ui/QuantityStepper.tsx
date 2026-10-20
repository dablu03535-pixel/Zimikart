import { Icon } from './Icon';

interface Props {
  value: number;
  max: number;
  min?: number;
  onChange: (next: number) => void;
  label?: string;
}

export function QuantityStepper({ value, max, min = 1, onChange, label = 'Quantity' }: Props) {
  const btn = 'flex h-11 w-11 items-center justify-center text-ink hover:bg-cream-deep disabled:opacity-40';
  return (
    <div role="group" aria-label={label} className="inline-flex items-center overflow-hidden rounded-xl border border-ink/25 bg-white">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`}>
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite" className="min-w-[2.5rem] text-center text-sm font-semibold">{value}</output>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
