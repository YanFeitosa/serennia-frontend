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
  }>,
): Promise<SalonSettings> {
  return request<SalonSettings>('/salon', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
