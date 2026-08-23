import type { LocalizedString } from '../../i18n/types';

export function t(vi: string, en: string): LocalizedString {
  return { vi, en };
}
