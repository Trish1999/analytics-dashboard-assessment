import React from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold"> EV Analytics Dashboard</h1>
      </header>

      <main>
        <Dashboard />
      </main>
    </div>
  );
}
