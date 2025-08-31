import React from 'react';

export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
