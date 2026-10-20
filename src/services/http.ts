/**
 * HTTP + mock abstraction.
 *
 * With VITE_USE_MOCK_API=true (default) services return bundled sample data.
 * With VITE_USE_MOCK_API=false they call VITE_API_BASE_URL (a future PHP REST API).
 * No backend exists in Stage 1, so only the mock path is exercised.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
export class NotFoundError extends ApiError {
  constructor(message = 'We could not find what you were looking for.') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
/** Thrown for actions that must not be faked (sign-in, payments...). */
export class NotConnectedError extends ApiError {
  constructor(message = 'This feature needs the backend, which is not connected yet.') {
    super(message, 501);
    this.name = 'NotConnectedError';
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const toQuery = (params: Record<string, string | number | boolean | undefined>): string => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== false) sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

async function request<T>(method: 'GET' | 'POST' | 'PUT', path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Network error. Please check your connection and try again.');
  }
  if (res.status === 404) throw new NotFoundError();
  if (!res.ok) throw new ApiError(`Request failed (${res.status}).`, res.status);
  return (await res.json()) as T;
}

/** Read: mock supplier in mock mode, GET in live mode. */
export async function read<T>(mock: () => T, path: string): Promise<T> {
  if (USE_MOCK) {
    await wait(300);
    return mock();
  }
  return request<T>('GET', path);
}

/** Write: in mock mode nothing is stored; the UI is told so honestly. */
export async function write<T>(mock: () => T, path: string, body: unknown, method: 'POST' | 'PUT' = 'POST'): Promise<T> {
  if (USE_MOCK) {
    await wait(400);
    return mock();
  }
  return request<T>(method, path, body);
}

export const notPersisted = (what = 'Nothing was sent to a server.') => ({
  persisted: false,
  message: `Checked in your browser only. ${what}`,
});
