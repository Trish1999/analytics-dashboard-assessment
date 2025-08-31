import React, { useMemo, useState } from 'react';

export default function DataTable({ data, states = [], topMakes = [] }) {
  const [q, setQ] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [makeFilter, setMakeFilter] = useState('');

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (stateFilter && d.state !== stateFilter) return false;
      if (makeFilter && d.make !== makeFilter) return false;
      if (!q) return true;
      const txt = q.toLowerCase();
      return (
        (d.vin && d.vin.toLowerCase().includes(txt)) ||
        (d.city && d.city.toLowerCase().includes(txt)) ||
        (d.make && d.make.toLowerCase().includes(txt)) ||
        (d.model && d.model.toLowerCase().includes(txt))
      );
    });
  }, [data, q, stateFilter, makeFilter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search VIN, make, model, city..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="px-3 py-2 border rounded w-full md:w-1/2"
        />
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
          className="px-3 py-2 border rounded">
          <option value="">All states</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={makeFilter} onChange={(e) => setMakeFilter(e.target.value)}
          className="px-3 py-2 border rounded">
          <option value="">All makes</option>
          {topMakes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-3 py-2 text-sm">VIN</th>
              <th className="px-3 py-2 text-sm">Year</th>
              <th className="px-3 py-2 text-sm">Make</th>
              <th className="px-3 py-2 text-sm">Model</th>
              <th className="px-3 py-2 text-sm">City</th>
              <th className="px-3 py-2 text-sm">State</th>
              <th className="px-3 py-2 text-sm">Range (mi)</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r, idx) => (
              <tr key={r.vin || idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-3 py-2 text-sm">{r.vin}</td>
                <td className="px-3 py-2 text-sm">{r.modelYear || '-'}</td>
                <td className="px-3 py-2 text-sm">{r.make}</td>
                <td className="px-3 py-2 text-sm">{r.model}</td>
                <td className="px-3 py-2 text-sm">{r.city}</td>
                <td className="px-3 py-2 text-sm">{r.state}</td>
                <td className="px-3 py-2 text-sm">{r.electricRange || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-gray-600">{filtered.length} rows shown</div>
    </div>
  );
}
