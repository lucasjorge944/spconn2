import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 text-left">
      <Card>
        <CardHeader>
          <CardTitle>Airports</CardTitle>
          <CardDescription>
            <code className="text-xs">SELECT * FROM ADMSPCE16.AEROPORTO</code>{' '}
            via <code className="text-xs">getAllAirports()</code>. Requires{' '}
            <strong>jdbc-sidecar</strong> and the Electron shell (
            <code className="text-xs">apps/desktop</code>).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            onClick={runQuery}
            disabled={loading}
            variant="default"
          >
            {loading ? 'Loading…' : 'Load all airports'}
          </Button>

          {error != null && error !== '' && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          )}

          {!loading && airports != null && airports.length === 0 && (
            <p className="text-sm text-muted-foreground">No rows returned.</p>
          )}

          {!loading && airports != null && airports.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>UE</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {airports.map((a) => (
                  <TableRow key={`${a.code}-${a.federativeUnitCode}`}>
                    <TableCell className="font-mono text-xs">{a.code}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {a.federativeUnitCode}
                    </TableCell>
                    <TableCell>{a.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
