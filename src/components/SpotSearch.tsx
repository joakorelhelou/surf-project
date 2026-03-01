import { useState, useMemo } from 'react';
import type { Spot } from '../types';
import { t } from '../i18n';

interface SpotSearchProps {
  spots: Spot[];
  onSelect: (spot: Spot) => void;
}

export default function SpotSearch({ spots, onSelect }: SpotSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return spots.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, spots]);

  function handleSelect(spot: Spot) {
    onSelect(spot);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-100 px-3 py-2 gap-2">
        <span className="text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={t.search.placeholder}
          className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="text-gray-300 hover:text-gray-500 transition-colors text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[9999]">
          {filtered.map((spot) => (
            <button
              key={spot.id}
              onMouseDown={() => handleSelect(spot)}
              className="w-full text-left px-4 py-2.5 hover:bg-ocean-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="text-sm font-medium text-gray-900">{spot.name}</div>
              <div className="text-xs text-gray-500">{spot.country}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
