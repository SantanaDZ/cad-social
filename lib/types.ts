import { z } from "zod"

export const inscricaoSchema = z.object({
  // Dados Pessoais (Step 1)
  nome_completo: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  genero: z.string().min(1, "Selecione o gênero"),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  telefone: z.string().optional(),

  // Endereço (Step 2)
  endereco: z.string().min(3, "Endereço é obrigatório"),
  bairro: z.string().optional(),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  cep: z.string().optional(),

  // Dados Socioeconômicos (Step 3)
  renda_familiar: z.coerce.number().min(0, "Renda não pode ser negativa").optional(),
  membros_familia: z.coerce.number().int().min(1, "Deve ter pelo menos 1 membro").optional(),
  despesas_mensais: z.coerce.number().min(0).optional(),
  escolaridade: z.string().optional(),
  situacao_moradia: z.string().optional(),
  possui_beneficio_gov: z.boolean().default(false),
  qual_beneficio: z.string().optional(),
  observacoes: z.string().optional(),
})

export type InscricaoFormData = z.infer<typeof inscricaoSchema>

export type Inscricao = InscricaoFormData & {
  id: string
  user_id: string
  status: "pendente" | "aprovado" | "rejeitado"
  created_at: string
  updated_at: string
}

export const step1Fields = [
  "nome_completo",
  "data_nascimento",
  "genero",
  "cpf",
  "rg",
  "telefone",
] as const

export const step2Fields = [
  "endereco",
  "bairro",
  "cidade",
  "estado",
  "cep",
] as const

export const step3Fields = [
  "renda_familiar",
  "membros_familia",
  "despesas_mensais",
  "escolaridade",
  "situacao_moradia",
  "possui_beneficio_gov",
  "qual_beneficio",
  "observacoes",
] as const

export const generoOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
  { value: "prefiro_nao_informar", label: "Prefiro não informar" },
]

export const escolaridadeOptions = [
  { value: "sem_escolaridade", label: "Sem escolaridade" },
  { value: "fundamental_incompleto", label: "Fundamental incompleto" },
  { value: "fundamental_completo", label: "Fundamental completo" },
  { value: "medio_incompleto", label: "Médio incompleto" },
  { value: "medio_completo", label: "Médio completo" },
  { value: "superior_incompleto", label: "Superior incompleto" },
  { value: "superior_completo", label: "Superior completo" },
  { value: "pos_graduacao", label: "Pós-graduação" },
]

export const situacaoMoradiaOptions = [
  { value: "propria", label: "Própria" },
  { value: "alugada", label: "Alugada" },
  { value: "cedida", label: "Cedida" },
  { value: "financiada", label: "Financiada" },
  { value: "ocupacao", label: "Ocupação" },
  { value: "situacao_rua", label: "Situação de rua" },
  { value: "outra", label: "Outra" },
]

export const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]
