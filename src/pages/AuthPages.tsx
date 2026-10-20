import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config/routes';
import { useForm } from '@/hooks/useForm';
import { usePageTitle } from '@/hooks/usePageTitle';
import { accountService } from '@/services/accountService';
import { all, email, indianMobile, matches, minLength, required, truthy } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { CheckField, TextField } from '@/components/ui/Fields';
import { Alert } from '@/components/ui/Feedback';
import { AuthCard, StandaloneAuth } from '@/components/forms/AuthShell';

/** Shared submit logic: validates, calls the (unconnected) service, shows the honest outcome. */
function useSubmit(validate: () => boolean, action: () => Promise<unknown>) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(undefined);
    if (!validate()) return;
    setBusy(true);
    try {
      await action();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };
  return { busy, message, submit };
}

const NotConnected = ({ message }: { message?: string | undefined }) =>
  message ? <Alert tone="info" title="Form checked, but nothing was sent">{message}</Alert> : null;

export function LoginPage() {
  usePageTitle('Sign in');
  const f = useForm({ identifier: '', password: '' }, { identifier: required('Email or mobile number'), password: required('Password') });
  const { busy, message, submit } = useSubmit(f.validate, () => accountService.login(f.values.identifier, f.values.password));
  return (
    <AuthCard title="Sign in" subtitle="Welcome back." footer={<>New here? <Link className="font-semibold underline" to={PATHS.register}>Create an account</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <NotConnected message={message} />
        <TextField label="Email or mobile number" autoComplete="username" required {...f.field('identifier')} />
        <TextField label="Password" type="password" autoComplete="current-password" required {...f.field('password')} />
        <Link to={PATHS.forgotPassword} className="block text-sm font-medium underline">Forgot password?</Link>
        <Button type="submit" full size="lg" loading={busy}>Sign in</Button>
      </form>
    </AuthCard>
  );
}

export function RegisterPage() {
  usePageTitle('Create account');
  const f = useForm(
    { name: '', email: '', phone: '', password: '', confirm: '', terms: '' },
    {
      name: required('Full name'),
      email: all(required('Email'), email()),
      phone: indianMobile(),
      password: all(required('Password'), minLength('Password', 8)),
      confirm: all(required('Confirm password'), matches('password', 'Passwords do not match.')),
      terms: truthy('Please accept the terms to continue.'),
    },
  );
  const { busy, message, submit } = useSubmit(f.validate, () => accountService.register({ name: f.values.name, email: f.values.email }));
  return (
    <AuthCard title="Create account" footer={<>Already registered? <Link className="font-semibold underline" to={PATHS.login}>Sign in</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <NotConnected message={message} />
        <TextField label="Full name" autoComplete="name" required {...f.field('name')} />
        <TextField label="Email" type="email" autoComplete="email" required {...f.field('email')} />
        <TextField label="Mobile number (optional)" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" {...f.field('phone')} />
        <TextField label="Password" type="password" autoComplete="new-password" hint="At least 8 characters" required {...f.field('password')} />
        <TextField label="Confirm password" type="password" autoComplete="new-password" required {...f.field('confirm')} />
        <CheckField label={<>I agree to the <Link className="underline" to={PATHS.terms}>terms</Link> and <Link className="underline" to={PATHS.privacy}>privacy policy</Link>.</>} {...f.check('terms')} />
        <Button type="submit" full size="lg" loading={busy}>Create account</Button>
      </form>
    </AuthCard>
  );
}

export function ForgotPasswordPage() {
  usePageTitle('Reset password');
  const f = useForm({ identifier: '' }, { identifier: all(required('Email or mobile number')) });
  const { busy, message, submit } = useSubmit(f.validate, () => accountService.requestPasswordReset(f.values.identifier));
  return (
    <AuthCard title="Reset password" subtitle="Enter your email or mobile number." footer={<Link className="font-semibold underline" to={PATHS.login}>Back to sign in</Link>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <NotConnected message={message} />
        <TextField label="Email or mobile number" autoComplete="username" required {...f.field('identifier')} />
        <Button type="submit" full size="lg" loading={busy}>Send reset link</Button>
      </form>
    </AuthCard>
  );
}

export function AdminLoginPage() {
  usePageTitle('Admin sign in');
  const f = useForm({ email: '', password: '' }, { email: all(required('Email'), email()), password: required('Password') });
  const { busy, message, submit } = useSubmit(f.validate, () => accountService.adminLogin(f.values.email, f.values.password));
  return (
    <StandaloneAuth>
      <h1 className="text-2xl font-semibold">Admin sign in</h1>
      <div className="mt-4"><Alert tone="warning" title="Preview screen">This form does not grant access. Admin authentication must be built and enforced on the server.</Alert></div>
      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <NotConnected message={message} />
        <TextField label="Admin email" type="email" autoComplete="username" required {...f.field('email')} />
        <TextField label="Password" type="password" autoComplete="current-password" required {...f.field('password')} />
        <Button type="submit" full size="lg" loading={busy}>Sign in</Button>
      </form>
      <p className="mt-6 text-center text-sm"><Link className="font-semibold underline" to={PATHS.adminDashboard}>Open the dashboard UI preview</Link> · <Link className="underline" to={PATHS.home}>Storefront</Link></p>
    </StandaloneAuth>
  );
}
