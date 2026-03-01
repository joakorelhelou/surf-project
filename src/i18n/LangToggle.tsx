import { currentLang, setLang } from './index';

export default function LangToggle() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-full flex overflow-hidden shadow-sm border border-ocean-100 text-xs font-semibold select-none">
      <button
        onClick={() => currentLang !== 'es' && setLang('es')}
        className={`px-3 py-1.5 transition-colors ${
          currentLang === 'es'
            ? 'bg-ocean-600 text-white'
            : 'text-ocean-700 hover:bg-white/60'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => currentLang !== 'en' && setLang('en')}
        className={`px-3 py-1.5 transition-colors ${
          currentLang === 'en'
            ? 'bg-ocean-600 text-white'
            : 'text-ocean-700 hover:bg-white/60'
        }`}
      >
        EN
      </button>
    </div>
  );
}
