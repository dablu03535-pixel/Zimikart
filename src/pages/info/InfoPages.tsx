import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '@/config/brand';
import { PATHS } from '@/config/routes';
import { useForm } from '@/hooks/useForm';
import { usePageTitle } from '@/hooks/usePageTitle';
import { accountService } from '@/services/accountService';
import { all, email, required } from '@/lib/validation';
import type { WriteResult } from '@/types/models';
import { Button, ButtonLink } from '@/components/ui/Button';
import { TextAreaField, TextField } from '@/components/ui/Fields';
import { Alert } from '@/components/ui/Feedback';

function InfoPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  usePageTitle(title);
  return (
    <div className="container-page max-w-3xl py-10 sm:py-14">
      <h1 className="text-4xl font-semibold">{title}</h1>
      {intro ? <p className="mt-3 text-lg text-ink-soft">{intro}</p> : null}
      <div className="mt-8 space-y-6 leading-relaxed text-ink-soft [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">{children}</div>
    </div>
  );
}

const LegalDraft = () => (
  <Alert tone="warning" title="Draft template, not legal advice">This text describes only what the Stage 1 frontend does. It must be replaced with documents reviewed by a qualified lawyer before any public launch.</Alert>
);

export function AboutPage() {
  return (
    <InfoPage title={`About ${BRAND.name}`} intro="A prototype of a multi-vendor marketplace for Indian makers.">
      <section><h2>What this is</h2><p>This site is Stage 1 of a build: the complete customer, seller and admin interface, running on sample data. Sellers, products, prices and orders shown here are fictional.</p></section>
      <section><h2>What is not built yet</h2><ul><li>Accounts and sign-in</li><li>Payments and settlements</li><li>Seller verification</li><li>A server, database or REST API</li></ul></section>
      <section><h2>Next stage</h2><p>Connect the service layer to a PHP REST API, then add authentication, checkout and seller onboarding on the server.</p></section>
      <div className="flex flex-wrap gap-3"><ButtonLink to={PATHS.shop}>Explore the shop</ButtonLink><ButtonLink to={PATHS.sellerRegister} variant="outline">See seller onboarding</ButtonLink></div>
    </InfoPage>
  );
}

export function ContactPage() {
  const [result, setResult] = useState<WriteResult>();
  const [failure, setFailure] = useState<string>();
  const [busy, setBusy] = useState(false);
  const f = useForm({ name: '', email: '', message: '' }, { name: required('Name'), email: all(required('Email'), email()), message: all(required('Message')) });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.validate()) return;
    setBusy(true);
    setFailure(undefined);
    try {
      setResult(await accountService.submitContact({ name: f.values.name }));
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Could not send your message.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <InfoPage title="Contact" intro="This form is a preview. Messages are not delivered anywhere yet.">
      <p>Planned support address (placeholder): <span className="font-semibold text-ink">{BRAND.supportEmail}</span></p>
      <form onSubmit={submit} noValidate className="card space-y-4 p-5">
        <TextField label="Your name" autoComplete="name" required {...f.field('name')} />
        <TextField label="Email" type="email" autoComplete="email" required {...f.field('email')} />
        <TextAreaField label="Message" required {...f.field('message')} />
        <Button type="submit" loading={busy}>Send message</Button>
        <div aria-live="polite">{result ? <Alert tone="warning" title="Not sent">{result.message}</Alert> : null}{failure ? <Alert tone="error">{failure}</Alert> : null}</div>
      </form>
    </InfoPage>
  );
}

const faqs: [string, ReactNode][] = [
  ['Is this a real store?', 'No. It is a frontend prototype. Products, sellers and prices are fictional, and you cannot buy anything.'],
  ['Is my cart saved?', 'Cart and wishlist are stored in this browser on this device only, using localStorage. Clearing site data removes them.'],
  ['Can I sign in or pay?', 'Not yet. Sign-in and payments need a backend that does not exist in Stage 1, so those screens only validate input.'],
  ['How does the pincode check work?', 'It uses a sample rule for demonstration: pincodes starting with 9 show as not deliverable. Real serviceability will come from the backend.'],
  ['Are seller and admin screens secure?', 'No. They are open UI previews with mock data and no authentication. Real access control must be implemented on the server.'],
  ['How do I report a problem?', <>Use the <Link className="underline" to={PATHS.contact}>contact page</Link> (also a preview in Stage 1).</>],
];

export function FaqPage() {
  return (
    <InfoPage title="Frequently asked questions">
      <div className="space-y-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="card group p-4 open:bg-white">
            <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">{q}</summary>
            <p className="mt-2">{a}</p>
          </details>
        ))}
      </div>
    </InfoPage>
  );
}

export function PrivacyPage() {
  return (
    <InfoPage title="Privacy policy" intro="What this demo does with data.">
      <LegalDraft />
      <section><h2>Data in this demo</h2><ul><li>Cart items and wishlist ids are stored in your browser's localStorage and never sent to a server.</li><li>Forms are validated in your browser. Nothing you type is transmitted while sample mode is on.</li><li>No analytics, advertising or tracking scripts are included.</li></ul></section>
      <section><h2>When a backend is connected</h2><p>This page must be rewritten to cover what is collected, why, how long it is kept, who processes it, and how to request access or deletion under applicable Indian law.</p></section>
    </InfoPage>
  );
}

export function TermsPage() {
  return (
    <InfoPage title="Terms of use" intro="Placeholder terms for the demo.">
      <LegalDraft />
      <section><h2>Demo only</h2><p>{BRAND.name} is a non-commercial prototype. No sale, payment, delivery or seller verification takes place, and nothing shown is an offer.</p></section>
      <section><h2>Before launch</h2><p>Real terms must cover marketplace roles, seller obligations, pricing and taxes, returns and refunds, dispute handling and liability.</p></section>
    </InfoPage>
  );
}
