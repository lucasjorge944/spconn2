import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  CD_CARGO_VEREADOR,
  type CandidateInsertFormState,
} from '@/domain/entities/candidateInsertForm';
import { cn } from '@/lib/utils';

/** Códigos reais em `docs/database/data/TIPO_LOGRADOURO.json` (FK). */
const TIPO_LOGRADOURO_OPTIONS: { value: string; label: string }[] = [
  { value: 'R', label: 'Rua' },
  { value: 'AV', label: 'Avenida' },
  { value: 'AL', label: 'Alameda' },
  { value: '1 TV', label: 'Travessa' },
  { value: 'PC', label: 'Praça' },
  { value: '10 R', label: '10ª Rua' },
];

const TP_ENTREGA_OPTIONS: {
  value: CandidateInsertFormState['tpEntrega'];
  label: string;
}[] = [
  { value: '0', label: 'Relatório financeiro (72h)' },
  { value: '1', label: 'Parcial' },
  { value: '2', label: 'Final' },
  { value: '3', label: 'Cancelamento de controle' },
];

type Props = {
  value: CandidateInsertFormState;
  onChange: (next: CandidateInsertFormState) => void;
  disabled?: boolean;
};

function FieldLabel({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Label htmlFor={htmlFor} className={cn('text-muted-foreground', className)}>
      {children}
    </Label>
  );
}

export function CandidateInsertForm({ value, onChange, disabled }: Props) {
  function patch<K extends keyof CandidateInsertFormState>(
    key: K,
    v: CandidateInsertFormState[K],
  ) {
    onChange({ ...value, [key]: v });
  }

  const selectClass =
    'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30';

  return (
    <div className="space-y-3 rounded-lg border border-border/80 bg-muted/20 p-4">
      <div>
        <p className="text-sm font-medium">Novo candidato a vereador</p>
        <p className="text-xs text-muted-foreground">
          Qualificação — cargo fixo <strong>Vereador</strong> (
          <code className="rounded bg-muted px-1">CD_CARGO = {CD_CARGO_VEREADOR}</code>
          ). Alinhado ao SPCE. Ver{' '}
          <code className="rounded bg-muted px-1">docs/database/candidato-cadastro.md</code>.
        </p>
      </div>

      <Tabs defaultValue="prestador" className="w-full gap-3">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="prestador" className="flex-1">
            Prestador de contas
          </TabsTrigger>
          <TabsTrigger value="endereco" className="flex-1">
            Endereço do candidato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prestador" className="space-y-6 pt-1">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Dados básicos</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <FieldLabel htmlFor="cand-nome">Nome</FieldLabel>
                <Input
                  id="cand-nome"
                  value={value.nmPessoa}
                  onChange={(e) => patch('nmPessoa', e.target.value)}
                  autoComplete="off"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cand-cpf">CPF (11 dígitos)</FieldLabel>
                <Input
                  id="cand-cpf"
                  inputMode="numeric"
                  value={value.nrCpf}
                  onChange={(e) => patch('nrCpf', e.target.value)}
                  autoComplete="off"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cand-titulo">Título de eleitor</FieldLabel>
                <Input
                  id="cand-titulo"
                  value={value.nrTituloEleitor}
                  onChange={(e) => patch('nrTituloEleitor', e.target.value)}
                  autoComplete="off"
                  maxLength={12}
                  disabled={disabled}
                />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Dados eleitorais</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <FieldLabel htmlFor="cand-cnpj">
                  CNPJ da campanha (opcional)
                </FieldLabel>
                <Input
                  id="cand-cnpj"
                  inputMode="numeric"
                  value={value.nrCnpj}
                  onChange={(e) => patch('nrCnpj', e.target.value)}
                  autoComplete="off"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cand-ue">
                  Município eleitoral (SG UE)
                </FieldLabel>
                <Input
                  id="cand-ue"
                  value={value.sgUePessoa}
                  onChange={(e) => patch('sgUePessoa', e.target.value)}
                  autoComplete="off"
                  maxLength={5}
                  disabled={disabled}
                  title="Ex.: 71072 — São Paulo capital (ver UE.json)"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cand-cargo">Cargo</FieldLabel>
                <Input
                  id="cand-cargo"
                  readOnly
                  value={`Vereador (${CD_CARGO_VEREADOR})`}
                  className="bg-muted/40 font-medium"
                  disabled={disabled}
                  aria-readonly
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cand-partido">Partido</FieldLabel>
                <Input
                  id="cand-partido"
                  inputMode="numeric"
                  value={value.nrPartido}
                  onChange={(e) => patch('nrPartido', e.target.value)}
                  autoComplete="off"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cand-nr">Número na urna</FieldLabel>
                <Input
                  id="cand-nr"
                  inputMode="numeric"
                  value={value.nrCandidato}
                  onChange={(e) => patch('nrCandidato', e.target.value)}
                  autoComplete="off"
                  disabled={disabled}
                  aria-describedby="cand-nr-hint"
                />
                <p id="cand-nr-hint" className="text-xs text-muted-foreground">
                  Deve começar com o mesmo número do partido (ex.: partido 13 →
                  13123).
                </p>
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cand-eleicao">
                  Código da eleição (primeira entrega)
                </FieldLabel>
                <Input
                  id="cand-eleicao"
                  inputMode="numeric"
                  value={value.cdEleicao}
                  onChange={(e) => patch('cdEleicao', e.target.value)}
                  autoComplete="off"
                  disabled={disabled}
                />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Dados da prestação de contas</h3>
            <div className="space-y-2">
              <FieldLabel htmlFor="tp-entrega">Tipo de entrega</FieldLabel>
              <RadioGroup
                id="tp-entrega"
                value={value.tpEntrega}
                onValueChange={(v) =>
                  patch('tpEntrega', v as CandidateInsertFormState['tpEntrega'])
                }
                disabled={disabled}
                className="grid gap-2 sm:grid-cols-2"
              >
                {TP_ENTREGA_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={opt.value}
                      id={`tp-${opt.value}`}
                      disabled={disabled}
                    />
                    <Label
                      htmlFor={`tp-${opt.value}`}
                      className="font-normal text-muted-foreground"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Turno
              </span>
              <RadioGroup
                value={value.stSegundoTurno}
                onValueChange={(v) =>
                  patch(
                    'stSegundoTurno',
                    v as CandidateInsertFormState['stSegundoTurno'],
                  )
                }
                disabled={disabled}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="0" id="turno-1" disabled={disabled} />
                  <Label htmlFor="turno-1" className="font-normal">
                    1º turno
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="1" id="turno-2" disabled={disabled} />
                  <Label htmlFor="turno-2" className="font-normal">
                    2º turno
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Esta prestação de contas é retificadora?
              </span>
              <RadioGroup
                value={value.stRetificadora}
                onValueChange={(v) =>
                  patch(
                    'stRetificadora',
                    v as CandidateInsertFormState['stRetificadora'],
                  )
                }
                disabled={disabled}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="0" id="ret-n" disabled={disabled} />
                  <Label htmlFor="ret-n" className="font-normal">
                    Não
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="1" id="ret-s" disabled={disabled} />
                  <Label htmlFor="ret-s" className="font-normal">
                    Sim
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="endereco" className="space-y-3 pt-1">
          <p className="text-xs text-muted-foreground">
            Endereço para comunicação com a Justiça Eleitoral — gravado em{' '}
            <code className="rounded bg-muted px-1">EPC_ENDERECO</code> com{' '}
            <code className="rounded bg-muted px-1">TP_ENDERECO = &apos;Q&apos;</code>.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <FieldLabel htmlFor="end-tipo">Tipo</FieldLabel>
              <select
                id="end-tipo"
                className={selectClass}
                value={value.cdTipoLogradouro}
                onChange={(e) => patch('cdTipoLogradouro', e.target.value)}
                disabled={disabled}
              >
                {TIPO_LOGRADOURO_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label} ({o.value})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="end-ue-mun">UF / Município (SG UE)</FieldLabel>
              <Input
                id="end-ue-mun"
                value={value.sgUeEndereco}
                onChange={(e) => patch('sgUeEndereco', e.target.value)}
                maxLength={5}
                disabled={disabled}
                title="Código de UE do município; vazio replica a UE da candidatura"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <FieldLabel htmlFor="end-logr">Logradouro</FieldLabel>
              <Input
                id="end-logr"
                value={value.dsLogradouro}
                onChange={(e) => patch('dsLogradouro', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="end-nr">Número</FieldLabel>
              <Input
                id="end-nr"
                value={value.nrLogradouro}
                onChange={(e) => patch('nrLogradouro', e.target.value)}
                maxLength={10}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="end-comp">Complemento</FieldLabel>
              <Input
                id="end-comp"
                value={value.dsComplemento}
                onChange={(e) => patch('dsComplemento', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <FieldLabel htmlFor="end-bairro">Bairro / distrito</FieldLabel>
              <Input
                id="end-bairro"
                value={value.dsBairro}
                onChange={(e) => patch('dsBairro', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="end-cep">CEP (8 dígitos)</FieldLabel>
              <Input
                id="end-cep"
                inputMode="numeric"
                value={value.nrCep}
                onChange={(e) => patch('nrCep', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="end-tel">Telefone</FieldLabel>
              <Input
                id="end-tel"
                inputMode="tel"
                value={value.nrTelefone}
                onChange={(e) => patch('nrTelefone', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="end-cel">Celular</FieldLabel>
              <Input
                id="end-cel"
                inputMode="tel"
                value={value.nrCelular}
                onChange={(e) => patch('nrCelular', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="end-fax">Fax</FieldLabel>
              <Input
                id="end-fax"
                inputMode="tel"
                value={value.nrFax}
                onChange={(e) => patch('nrFax', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <FieldLabel htmlFor="end-mail">E-mail</FieldLabel>
              <Input
                id="end-mail"
                type="email"
                value={value.nmEmail}
                onChange={(e) => patch('nmEmail', e.target.value)}
                autoComplete="off"
                disabled={disabled}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
