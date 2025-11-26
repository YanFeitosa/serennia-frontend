import { request } from '../request';

export interface PaymentConfig {
  configured: boolean;
  provider?: 'mercadopago' | 'stripe';
  publicKey?: string;
}

export interface PixPaymentResult {
  success: boolean;
  qrCode?: string;
  qrCodeBase64?: string;
  copyPaste?: string;
  expirationDate?: string;
  paymentId?: string;
  error?: string;
}

export interface CardPaymentResult {
  success: boolean;
  paymentId?: string;
  status?: string;
  error?: string;
}

export interface StripePaymentIntentResult {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

export async function getPaymentConfig(): Promise<PaymentConfig> {
  return request<PaymentConfig>('/payments/config');
}

export async function createPixPayment(params: {
  orderId: string;
  amount: number;
  description?: string;
  payerEmail?: string;
  payerName?: string;
}): Promise<PixPaymentResult> {
  return request<PixPaymentResult>('/payments/pix', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function createCardPayment(params: {
  orderId: string;
  amount: number;
  token: string;
  payerEmail: string;
  installments?: number;
}): Promise<CardPaymentResult> {
  return request<CardPaymentResult>('/payments/card', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function createStripePaymentIntent(params: {
  orderId: string;
  amount: number;
  description?: string;
}): Promise<StripePaymentIntentResult> {
  return request<StripePaymentIntentResult>('/payments/stripe/intent', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function checkPaymentStatus(paymentId: string): Promise<{ status: string }> {
  return request<{ status: string }>(`/payments/status/${paymentId}`);
}

