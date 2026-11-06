import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ua', label: 'UA' },
];

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600"
      role="group"
      aria-label={t('app.language')}
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className="bg-white px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 aria-pressed:bg-blue-600 aria-pressed:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:aria-pressed:bg-blue-600 dark:aria-pressed:text-white"
          aria-pressed={i18n.resolvedLanguage === code}
          onClick={() => i18n.changeLanguage(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}