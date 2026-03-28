import { useState } from 'react';
import { getDIContainer } from '@/infrastructure/di/DIContainer';
import type { AirportViewModel } from '@/presentation/viewmodels/AirportViewModel';

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [airports, setAirports] = useState<AirportViewModel[] | null>(null);

  async function runQuery() {
    setError(null);
    setAirports(null);
    setLoading(true);
    try {
      const controller = getDIContainer().airports.getAirportController();
      const rows = await controller.getAllAirports();
      setAirports(rows);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === 'string'
            ? e
            : JSON.stringify(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>Airports (AEROPORTO)</h1>
      <p>
        Query:{' '}
        <code>SELECT * FROM ADMSPCE16.AEROPORTO</code> via{' '}
        <code>getAllAirports()</code>
      </p>
      <p className="teste-hint">
        Requires <strong>jdbc-sidecar</strong> and <strong>apps/desktop</strong>{' '}
        (Electron).
      </p>
      <button type="button" onClick={runQuery} disabled={loading}>
        {loading ? 'Loading…' : 'Load all airports'}
      </button>
      {error != null && error !== '' && (
        <pre className="teste-erro">{error}</pre>
      )}
      {airports != null && (
        <pre className="teste-resultado">
          {JSON.stringify(airports, null, 2)}
        </pre>
      )}
    </section>
  );
}
