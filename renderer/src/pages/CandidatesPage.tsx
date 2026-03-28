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
import {
  defaultCandidateInsertForm,
  toInsertCandidateInput,
} from '@/domain/entities/candidateInsertForm';
import { getDIContainer } from '@/infrastructure/di/DIContainer';
import { CandidateInsertForm } from '@/pages/CandidateInsertForm';
import type { CandidateViewModel } from '@/presentation/viewmodels/CandidateViewModel';

export function CandidatesPage() {
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insertForm, setInsertForm] = useState(defaultCandidateInsertForm);
  const [candidates, setCandidates] = useState<CandidateViewModel[] | null>(
    null,
  );

  async function runQuery() {
    setError(null);
    setCandidates(null);
    setLoading(true);
    try {
      const controller = getDIContainer().candidates.getCandidateController();
      const rows = await controller.getAllCandidates();
      setCandidates(rows);
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

  async function addCandidate() {
    setError(null);
    setAdding(true);
    try {
      const payload = toInsertCandidateInput(insertForm);
      const container = getDIContainer().candidates;
      const controller = container.getCandidateController();
      await controller.insertCandidate(payload);
      if (candidates != null) {
        const rows = await controller.getAllCandidates();
        setCandidates(rows);
      }
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === 'string'
            ? e
            : JSON.stringify(e);
      setError(msg);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 text-left">
      <Card>
        <CardHeader>
          <CardTitle>Candidatos</CardTitle>
          <CardDescription>
            Cadastro de <strong>candidato a vereador</strong> —{' '}
            <code className="text-xs">
              EPC_PESSOA (TP_PESSOA = &apos;CA&apos;)
            </code>
            , <code className="text-xs">EPC_ENTREGA_PRESTACAO</code> e{' '}
            <code className="text-xs">EPC_ENDERECO</code> (TP &apos;Q&apos;).
            Mapeamento:{' '}
            <code className="text-xs">docs/database/candidato-cadastro.md</code>.
            Requer <strong>jdbc-sidecar</strong> e o shell Electron (
            <code className="text-xs">apps/desktop</code>).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CandidateInsertForm
            value={insertForm}
            onChange={setInsertForm}
            disabled={loading || adding}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={runQuery}
              disabled={loading || adding}
              variant="default"
            >
              {loading ? 'Carregando…' : 'Carregar candidatos'}
            </Button>
            <Button
              type="button"
              onClick={addCandidate}
              disabled={loading || adding}
              variant="secondary"
            >
              {adding ? 'Inserindo…' : 'Adicionar candidato'}
            </Button>
          </div>

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

          {!loading && candidates != null && candidates.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum registro encontrado.
            </p>
          )}

          {!loading && candidates != null && candidates.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Nº candidato</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Eleição</TableHead>
                    <TableHead>UE</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Partido</TableHead>
                    <TableHead className="text-right">Sq. pessoa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((c) => (
                    <TableRow key={`${c.sqPessoa}-${c.sqEntregaPrestacao}`}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.nrCandidato || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.cpf || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.cdEleicao || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.federativeUnitCode || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.cdCargo || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.nrPartido || '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {c.sqPessoa}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
