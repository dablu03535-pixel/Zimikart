import { useCallback, useState, type ChangeEvent } from 'react';
import type { Rule } from '@/lib/validation';

type Values = Record<string, string>;
type Rules<V extends Values> = { [K in keyof V]?: Rule };

export function useForm<V extends Values>(initial: V, rules: Rules<V>) {
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof V, string>>>({});

  const setValue = useCallback((name: keyof V, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const field = (name: keyof V & string) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValue(name, e.target.value),
  });

  const check = (name: keyof V & string) => ({
    name,
    checked: values[name] === 'true',
    error: errors[name],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(name, e.target.checked ? 'true' : ''),
  });

  const validate = (): boolean => {
    const next: Partial<Record<keyof V, string>> = {};
    (Object.keys(rules) as (keyof V)[]).forEach((k) => {
      const rule = rules[k];
      if (rule) {
        const msg = rule(values[k], values);
        if (msg) next[k] = msg;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  return { values, errors, field, check, setValue, validate, reset };
}
