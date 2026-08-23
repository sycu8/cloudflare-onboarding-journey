import type { LocalizedString } from '../../i18n/types';

export function t(vi: string, en: string, km?: string): LocalizedString {
  return km ? { vi, en, km } : { vi, en };
}
