
import { _SettingsStore } from '@/lib/types';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

const settingsStore = create<_SettingsStore>(set => ({
    language: 'en_US',
    currency: 'USD',
    setLanguage: (language: string) => set(() => ({
        language: language,
    })),
    setCurrency: (currency: string) => set(() => ({
        currency: currency,
    })),
}))

export default settingsStore;

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Settings Store', settingsStore);
}