/**
 * Indian Rupee (INR) and Healthcare Metric Formatters
 * Formats numbers in Indian localized style (₹4,50,000 / ₹4.5L)
 */

export function formatINR(
  amount: number | undefined | null,
  options?: { compact?: boolean; hideSymbol?: boolean; decimals?: number }
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return options?.hideSymbol ? '0' : '₹0';
  }

  const symbol = options?.hideSymbol ? '' : '₹';
  const absAmount = Math.abs(amount);

  if (options?.compact) {
    if (absAmount >= 10000000) {
      const cr = (amount / 10000000).toFixed(options.decimals ?? 2);
      return `${symbol}${cr} Cr`;
    }
    if (absAmount >= 100000) {
      const lk = (amount / 100000).toFixed(options.decimals ?? 2);
      return `${symbol}${lk} L`;
    }
    if (absAmount >= 1000) {
      const k = (amount / 1000).toFixed(options.decimals ?? 1);
      return `${symbol}${k} K`;
    }
  }

  // Format using standard Indian numbering system (e.g. 4,50,000)
  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: options?.decimals ?? 0,
      minimumFractionDigits: options?.decimals ?? 0,
    }).format(amount);
    return `${symbol}${formatted}`;
  } catch (e) {
    return `${symbol}${amount.toLocaleString()}`;
  }
}

export function formatArea(sqFt: number | undefined | null): string {
  if (!sqFt) return '0 sq. ft.';
  return `${sqFt.toLocaleString('en-IN')} sq. ft.`;
}

export type DataSourceType = 'input' | 'estimate' | 'benchmark';

export interface DataBadgeInfo {
  type: DataSourceType;
  label: string;
  description: string;
}

export const DATA_SOURCES: Record<DataSourceType, DataBadgeInfo> = {
  input: {
    type: 'input',
    label: 'Your input',
    description: 'Entered directly by you or configured during initial setup',
  },
  estimate: {
    type: 'estimate',
    label: 'ClinicAI estimate',
    description: 'Calculated using clinic specialty, volume and geographical cost models',
  },
  benchmark: {
    type: 'benchmark',
    label: 'Reference benchmark',
    description: 'Based on prevailing Indian healthcare and commercial market standards',
  },
};

export interface CalculationDetails {
  title: string;
  headline: string;
  formula: string;
  inputs: { label: string; value: string; source: DataSourceType }[];
  explanation: string;
  basisOneLiner: string;
}
