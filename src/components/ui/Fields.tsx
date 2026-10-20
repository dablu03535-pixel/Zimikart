import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface ShellProps {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
}

function Shell({ id, label, error, hint, required, children }: ShellProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-terracotta-600"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p id={`${id}-hint`} className="mt-1 text-xs text-ink-mute">{hint}</p> : null}
      {error ? <p id={`${id}-err`} className="mt-1 text-xs font-medium text-terracotta-700">{error}</p> : null}
    </div>
  );
}

const control = (error?: string) =>
  `block min-h-[44px] w-full rounded-xl border bg-white px-3 py-2 text-base text-ink placeholder:text-ink-mute/70 sm:text-sm ${error ? 'border-terracotta-600' : 'border-ink/25'}`;

const describe = (id: string, error?: string, hint?: string) =>
  error ? `${id}-err` : hint ? `${id}-hint` : undefined;

interface Common { label: string; error?: string | undefined; hint?: string | undefined }

export function TextField({ label, error, hint, className = '', ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={rest.required}>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} className={`${control(error)} ${className}`} {...rest} />
    </Shell>
  );
}

export function TextAreaField({ label, error, hint, className = '', ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={rest.required}>
      <textarea id={id} rows={4} aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} className={`${control(error)} ${className}`} {...rest} />
    </Shell>
  );
}

export function SelectField({ label, error, hint, className = '', children, ...rest }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={rest.required}>
      <select id={id} aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} className={`${control(error)} ${className}`} {...rest}>
        {children}
      </select>
    </Shell>
  );
}

export function CheckField({ label, error, ...rest }: { label: ReactNode; error?: string | undefined } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} type="checkbox" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className="mt-1 h-5 w-5 shrink-0 accent-ink" {...rest} />
        <label htmlFor={id} className="text-sm text-ink-soft">{label}</label>
      </div>
      {error ? <p id={`${id}-err`} className="mt-1 text-xs font-medium text-terracotta-700">{error}</p> : null}
    </div>
  );
}
