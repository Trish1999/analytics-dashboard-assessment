import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import Charts from './Chart';
import DataTable from './DataTable';
import StatsCard from './StatsCard';

function parsePoint(pointStr) {
  if (!pointStr) return null;
  const m = pointStr.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
  if (!m) return null;
  return { lon: parseFloat(m[1]), lat: parseFloat(m[2]) };
}

export default function Dashboard() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse('/Electric_Vehicle_Population_Data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        setRawData(results.data || []);
        setLoading(false);
      },
      error: (err) => {
        console.error('CSV load error', err);
        setLoading(false);
      }
    });
  }, []);

  // normalize keys + parse numeric fields
  const data = useMemo(() => {
    return rawData.map((r) => ({
      vin: r['VIN (1-10)'],
      county: r['County'],
      city: r['City'],
      state: r['State'],
      postalCode: r['Postal Code'],
      modelYear: r['Model Year'] ? Number(r['Model Year']) : null,
      make: r['Make'],
      model: r['Model'],
      evType: r['Electric Vehicle Type'],
      cafv: r['Clean Alternative Fuel Vehicle (CAFV) Eligibility'],
      electricRange: r['Electric Range'] ? Number(r['Electric Range']) : 0,
      baseMSRP: r['Base MSRP'] ? Number(r['Base MSRP']) : 0,
      legislativeDistrict: r['Legislative District'],
      dolVehicleId: r['DOL Vehicle ID'],
      vehicleLocation: r['Vehicle Location'],
      electricUtility: r['Electric Utility'],
      censusTract: r['2020 Census Tract'],
      point: parsePoint(r['Vehicle Location']),
    }));
  }, [rawData]);

  // aggregates
  const aggregates = useMemo(() => {
    const total = data.length;
    const years = {};
    const makes = {};
    const types = {};
    let rangeSum = 0, rangeCount = 0;
    let msrpSum = 0, msrpCount = 0;
    const states = new Set();

    data.forEach(d => {
      if (d.modelYear) years[d.modelYear] = (years[d.modelYear] || 0) + 1;
      if (d.make) makes[d.make] = (makes[d.make] || 0) + 1;
      if (d.evType) types[d.evType] = (types[d.evType] || 0) + 1;
      if (d.electricRange && d.electricRange > 0) { rangeSum += d.electricRange; rangeCount++; }
      if (d.baseMSRP && d.baseMSRP > 0) { msrpSum += d.baseMSRP; msrpCount++; }
      if (d.state) states.add(d.state);
    });

    // prepare sorted arrays for charts
    const vehiclesByYear = Object.entries(years)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year);

    const topMakes = Object.entries(makes)
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const typeDistribution = Object.entries(types)
      .map(([type, count]) => ({ type, count }));

    return {
      total,
      vehiclesByYear,
      topMakes,
      typeDistribution,
      avgRange: rangeCount ? Math.round(rangeSum / rangeCount) : 0,
      avgMSRP: msrpCount ? Math.round(msrpSum / msrpCount) : 0,
      uniqueMakes: Object.keys(makes).length,
      states: Array.from(states).sort()
    };
  }, [data]);

  if (loading) return <div>Loading CSV data…</div>;
  if (!data.length) return <div>No data found in CSV.</div>;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Vehicles" value={aggregates.total} />
        <StatsCard title="Unique Makes" value={aggregates.uniqueMakes} />
        <StatsCard title="Avg Electric Range" value={`${aggregates.avgRange} mi`} />
        <StatsCard title="Avg Base MSRP" value={aggregates.avgMSRP ? `$${aggregates.avgMSRP}` : 'N/A'} />
      </section>

    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-2">Quick Insights</h3>
      <ul className="text-sm space-y-2">
        <li>Total records: <strong>{aggregates.total}</strong></li>
        <li>Distinct states: <strong>{aggregates.states.length}</strong></li>
        <li>Dist. EV types: <strong>{aggregates.typeDistribution.length}</strong></li>
        <li>Avg range (non-zero): <strong>{aggregates.avgRange} mi</strong></li>
      </ul>
    </div>

  <section className="grid grid-cols-1 gap-4">
    <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-4">EV Adoption by Year</h3>
      <Charts
        vehiclesByYear={aggregates.vehiclesByYear}
        topMakes={aggregates.topMakes}
        typeDistribution={aggregates.typeDistribution}
      />
    </div>
  </section>

  <section className="bg-white p-4 rounded-lg shadow-sm">
    <h3 className="font-semibold mb-4">Dataset (filterable)</h3>
    <DataTable
      data={data}
      states={aggregates.states}
      topMakes={aggregates.topMakes.map(t => t.make)}
    />
  </section>
</div>

  );
}
