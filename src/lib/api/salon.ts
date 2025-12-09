import { request } from '../request';

export interface ThemePalette {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface SalonTheme {
  platformName?: string;
  light: ThemePalette;
  dark: ThemePalette;
}

export interface SalonSettings {
  id: string;
  name: string;
  defaultCommissionRate: number | null;
  commissionMode: 'service' | 'professional';
  fixedCostsMonthly?: number | null;
  variableCostRate?: number | null;
  rolePermissions?: Record<string, any> | null;
  theme?: SalonTheme | null;
  stockControlEnabled?: boolean;
  // WhatsApp Integration
  whatsappApiUrl?: string | null;
  whatsappApiKey?: string | null;
  whatsappInstanceId?: string | null;
  whatsappPhone?: string | null;
  whatsappConnected?: boolean;
  // Payment Integration
  paymentProvider?: 'mercadopago' | 'stripe' | null;
  mpAccessToken?: string | null;
  mpPublicKey?: string | null;
  stripeSecretKey?: string | null;
  stripePublishableKey?: string | null;
}

export async function getSalonSettings(): Promise<SalonSettings> {
  return request<SalonSettings>('/salon');
}

export async function updateSalonSettings(
  input: Partial<{
    name: string;
    defaultCommissionRate: number;
    commissionMode: 'service' | 'professional';
    fixedCostsMonthly: number;
    variableCostRate: number;
    rolePermissions: Record<string, any> | null;
    theme: SalonTheme | null;
    stockControlEnabled: boolean;
    // WhatsApp Integration
    whatsappApiUrl: string | null;
    whatsappApiKey: string | null;
    whatsappInstanceId: string | null;
    whatsappPhone: string | null;
    whatsappConnected: boolean;
    // Payment Integration
    paymentProvider: 'mercadopago' | 'stripe' | null;
    mpAccessToken: string | null;
    mpPublicKey: string | null;
    stripeSecretKey: string | null;
    stripePublishableKey: string | null;
  }>,
): Promise<SalonSettings> {
  return request<SalonSettings>('/salon', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

// Test WhatsApp connection
export async function testWhatsAppConnection(): Promise<{ success: boolean; error?: string }> {
  return request<{ success: boolean; error?: string }>('/salon/test-whatsapp', {
    method: 'POST',
  });
}

// Test Payment connection
export async function testPaymentConnection(): Promise<{ success: boolean; error?: string }> {
  return request<{ success: boolean; error?: string }>('/salon/test-payment', {
    method: 'POST',
  });
}
