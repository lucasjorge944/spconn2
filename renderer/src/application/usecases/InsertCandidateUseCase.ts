import { nrCandidatoComecaComPartido } from "@/domain/candidate/candidateNumberRules";
import type { InsertCandidateInput } from "@/domain/entities/InsertCandidateInput";
import type { NormalizedInsertCandidate } from "@/domain/entities/NormalizedInsertCandidate";
import type { CandidateRepository } from "@/domain/repositories/CandidateRepository";
import { assertUInt } from "@/domain/utils/assertUInt";
import { digitsOnly } from "@/domain/utils/digitsOnly";

/**
 * Orquestra o cadastro de candidato: valida/normaliza, depois
 * sequência no repositório (entrega → pessoa → chaves → endereço).
 */
export class InsertCandidateUseCase {
    private readonly candidateRepository: CandidateRepository;

    constructor(candidateRepository: CandidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    async execute(input: InsertCandidateInput): Promise<void> {
        const p = this.normalize(input);

        await this.candidateRepository.ensureMinimalEntregaPrestacaoIfNone(p);

        const linhasPessoa =
            await this.candidateRepository.insertPessoaCandidato(p);
        if (linhasPessoa !== 1) {
            throw new Error(
                "Inserção de pessoa não aplicou linha: confira UE (FK), EPC_ENTREGA_PRESTACAO e CONFIGURACAO_ELEICAO."
            );
        }

        const chaves =
            await this.candidateRepository.findCandidatoPessoaKeysByCpf(
                p.nrCpf
            );
        if (chaves == null) {
            throw new Error(
                "Não foi possível localizar SQ_PESSOA após inserir o candidato."
            );
        }

        const linhasEndereco =
            await this.candidateRepository.insertEnderecoCandidatoComunicacaoJe(
                p,
                chaves.sqPessoa,
                chaves.sqEntregaPrestacao
            );
        if (linhasEndereco !== 1) {
            throw new Error(
                "Inserção do endereço falhou (EPC_ENDERECO). Verifique FKs ou conflito de TP_ENDERECO para esta pessoa."
            );
        }
    }

    private normalize(raw: InsertCandidateInput): NormalizedInsertCandidate {
        const nmPessoa = raw.nmPessoa.trim();
        if (nmPessoa.length === 0 || nmPessoa.length > 150) {
            throw new Error("Nome deve ter entre 1 e 150 caracteres.");
        }

        const nrCpf = digitsOnly(raw.nrCpf, 11);
        if (nrCpf.length !== 11) {
            throw new Error("CPF deve ter 11 dígitos.");
        }

        const sgUePessoa = raw.sgUePessoa.trim();
        if (sgUePessoa.length === 0 || sgUePessoa.length > 5) {
            throw new Error(
                "SG UE (candidatura) deve ter entre 1 e 5 caracteres."
            );
        }

        const tituloRaw = raw.nrTituloEleitor.trim();
        let nrTituloEleitor: string | null = null;
        if (tituloRaw.length > 0) {
            if (tituloRaw.length > 12) {
                throw new Error("Título de eleitor: no máximo 12 caracteres.");
            }
            nrTituloEleitor = tituloRaw;
        }

        const cnpjDigits = digitsOnly(raw.nrCnpj, 14);
        let nrCnpj: string | null = null;
        if (cnpjDigits.length > 0) {
            if (cnpjDigits.length !== 14) {
                throw new Error(
                    "CNPJ da campanha deve ter 14 dígitos ou ficar vazio."
                );
            }
            nrCnpj = cnpjDigits;
        }

        assertUInt("Cargo", raw.cdCargo, 99);
        assertUInt("Partido", raw.nrPartido, 99);
        assertUInt("Número do candidato", raw.nrCandidato, 99999);
        assertUInt("Código da eleição", raw.cdEleicao, 99999999);

        if (!nrCandidatoComecaComPartido(raw.nrPartido, raw.nrCandidato)) {
            throw new Error(
                `O número do candidato (${raw.nrCandidato}) deve iniciar com o número do partido (${raw.nrPartido}).`
            );
        }

        const tpSet = new Set(["0", "1", "2", "3"]);
        if (!tpSet.has(raw.tpEntrega)) {
            throw new Error("Tipo de entrega inválido.");
        }
        if (raw.stRetificadora !== "0" && raw.stRetificadora !== "1") {
            throw new Error("Flag retificadora inválida.");
        }
        if (raw.stSegundoTurno !== "0" && raw.stSegundoTurno !== "1") {
            throw new Error("Flag segundo turno inválida.");
        }

        const cdTipoLogradouro = raw.cdTipoLogradouro.trim();
        if (cdTipoLogradouro.length === 0 || cdTipoLogradouro.length > 4) {
            throw new Error(
                "Tipo de logradouro: 1 a 4 caracteres (FK TIPO_LOGRADOURO)."
            );
        }

        let sgUeEndereco = raw.sgUeEndereco.trim();
        if (sgUeEndereco.length === 0) {
            sgUeEndereco = sgUePessoa;
        }
        if (sgUeEndereco.length > 5) {
            throw new Error("SG UE do endereço: no máximo 5 caracteres.");
        }

        const nrLogradouro = raw.nrLogradouro.trim();
        if (nrLogradouro.length === 0 || nrLogradouro.length > 10) {
            throw new Error(
                "Número do endereço é obrigatório (até 10 caracteres)."
            );
        }

        const dsLogradouro = raw.dsLogradouro.trim();
        const dsComplemento = raw.dsComplemento.trim();
        const dsBairro = raw.dsBairro.trim();

        const cepDigits = digitsOnly(raw.nrCep, 8);
        const nrCep = cepDigits.length === 0 ? null : cepDigits;
        if (cepDigits.length > 0 && cepDigits.length !== 8) {
            throw new Error("CEP deve ter 8 dígitos ou ficar vazio.");
        }

        const tel = digitsOnly(raw.nrTelefone, 11);
        const cel = digitsOnly(raw.nrCelular, 11);
        const fax = digitsOnly(raw.nrFax, 11);
        const nrTelefone = tel.length === 0 ? null : tel;
        const nrCelular = cel.length === 0 ? null : cel;
        const nrFax = fax.length === 0 ? null : fax;

        const emailRaw = raw.nmEmail.trim();
        let nmEmail: string | null = null;
        if (emailRaw.length > 0) {
            if (emailRaw.length > 80) {
                throw new Error("E-mail: no máximo 80 caracteres.");
            }
            nmEmail = emailRaw;
        }

        return {
            nmPessoa,
            nrCpf,
            sgUePessoa,
            nrTituloEleitor,
            nrCnpj,
            cdCargo: raw.cdCargo,
            nrPartido: raw.nrPartido,
            nrCandidato: raw.nrCandidato,
            cdEleicao: raw.cdEleicao,
            tpEntrega: raw.tpEntrega,
            stRetificadora: raw.stRetificadora,
            stSegundoTurno: raw.stSegundoTurno,
            cdTipoLogradouro,
            sgUeEndereco,
            nrLogradouro,
            dsLogradouro:
                dsLogradouro.length > 0 ? dsLogradouro.slice(0, 150) : null,
            dsComplemento:
                dsComplemento.length > 0 ? dsComplemento.slice(0, 100) : null,
            dsBairro: dsBairro.length > 0 ? dsBairro.slice(0, 100) : null,
            nrCep,
            nrTelefone,
            nrCelular,
            nrFax,
            nmEmail
        };
    }
}
