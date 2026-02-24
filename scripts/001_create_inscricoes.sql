-- Create inscrições table for social program registrations
CREATE TABLE IF NOT EXISTS public.inscricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dados pessoais
  nome_completo TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  genero TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  telefone TEXT,
  
  -- Endereço
  endereco TEXT NOT NULL,
  bairro TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT,
  
  -- Dados socioeconômicos
  renda_familiar NUMERIC(10,2),
  membros_familia INTEGER,
  despesas_mensais NUMERIC(10,2),
  escolaridade TEXT,
  situacao_moradia TEXT,
  possui_beneficio_gov BOOLEAN DEFAULT FALSE,
  qual_beneficio TEXT,
  
  -- Status e metadados
  status TEXT DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.inscricoes ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only see and edit their own registrations
CREATE POLICY "inscricoes_select_own" ON public.inscricoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "inscricoes_insert_own" ON public.inscricoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "inscricoes_update_own" ON public.inscricoes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "inscricoes_delete_own" ON public.inscricoes FOR DELETE USING (auth.uid() = user_id);
