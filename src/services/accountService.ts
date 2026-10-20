import { addresses, orders } from '@/data/mockAccount';
import type { Address, Order, WriteResult } from '@/types/models';
import { NotConnectedError, NotFoundError, notPersisted, read, write } from './http';

const notConnected = (what: string) =>
  Promise.reject(new NotConnectedError(`${what} is not connected yet. No account was created or accessed.`));

export const accountService = {
  login: (_identifier: string, _password: string) => notConnected('Sign-in') ,
  register: (_payload: Record<string, string>) => notConnected('Registration') ,
  requestPasswordReset: (_identifier: string) => notConnected('Password reset') ,
  adminLogin: (_email: string, _password: string) => notConnected('Admin sign-in') ,

  getAddresses: (): Promise<Address[]> => read(() => addresses, '/account/addresses'),
  saveAddress: (a: Omit<Address, 'id'>): Promise<WriteResult> =>
    write(() => notPersisted('The address was not saved.'), '/account/addresses', a),

  getOrders: (): Promise<Order[]> => read(() => orders, '/account/orders'),
  getOrder: (id: string): Promise<Order> =>
    read(() => {
      const o = orders.find((x) => x.id === id);
      if (!o) throw new NotFoundError('We could not find that order.');
      return o;
    }, `/account/orders/${encodeURIComponent(id)}`),

  submitContact: (payload: Record<string, string>): Promise<WriteResult> =>
    write(() => notPersisted('Your message was not sent.'), '/contact', payload),

  /** Stand-in for order creation. Never takes payment and never creates an order. */
  previewCheckout: (payload: unknown): Promise<WriteResult> =>
    write(() => notPersisted('No order was created and no payment was taken.'), '/checkout', payload),
};
