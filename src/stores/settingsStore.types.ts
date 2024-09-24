export type _SettingsStore = {
    language: string;
    currency: string;
    setLanguage: (language: string) => void;
    setCurrency: (currency: string) => void;
}