import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#A78BFA', '#F97316'];

export default function Chart({ vehiclesByYear, topMakes, typeDistribution }) {
  return (
    <div style={{ width: '100%', height: 600 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={vehiclesByYear}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="p-4 bg-grey-50 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium mb-3">Top Makes</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topMakes}>
              <XAxis dataKey="make" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h4 className="text-sm font-semibold mb-3">EV Type Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeDistribution}
                dataKey="count"
                nameKey="type"
                outerRadius={60}
                label={(entry) => `${entry.type} (${entry.count})`}
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
