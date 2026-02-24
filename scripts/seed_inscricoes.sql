-- Script to insert 10 realistic mock registrations for a specific user in MG
-- User ID: be3bad44-8a8d-42e0-a41b-8b97b4e160ff

WITH common_data AS (
  SELECT * FROM (VALUES 
    (1, 'José Silva', 'Belo Horizonte', 'Masculino'),
    (2, 'Maria Oliveira', 'Uberlândia', 'Feminino'),
    (3, 'João Santos', 'Contagem', 'Masculino'),
    (4, 'Ana Costa', 'Juiz de Fora', 'Feminino'),
    (5, 'Antônio Ferreira', 'Betim', 'Masculino'),
    (6, 'Francisca Rodrigues', 'Montes Claros', 'Feminino'),
    (7, 'Carlos Almeida', 'Ribeirão das Neves', 'Masculino'),
    (8, 'Adriana Pereira', 'Uberaba', 'Feminino'),
    (9, 'Paulo Souza', 'Governador Valadares', 'Masculino'),
    (10, 'Luciana Gomes', 'Ipatinga', 'Feminino')
  ) AS t(idx, nome, cidade, genero)
)
INSERT INTO public.inscricoes (
  user_id, 
  nome_completo, 
  data_nascimento, 
  genero, 
  cpf, 
  telefone, 
  endereco, 
  cidade, 
  estado, 
  status,
  bairro
)
SELECT 
  'be3bad44-8a8d-42e0-a41b-8b97b4e160ff'::UUID,
  cd.nome,
  '1970-01-01'::DATE + (random() * 15000 * '1 day'::INTERVAL), -- Random birth date between 1970 and 2011
  cd.genero,
  LPAD((floor(random() * 999)::int)::text, 3, '0') || '.' || 
  LPAD((floor(random() * 999)::int)::text, 3, '0') || '.' || 
  LPAD((floor(random() * 999)::int)::text, 3, '0') || '-' || 
  LPAD((floor(random() * 99)::int)::text, 2, '0'), -- Random CPF format
  '(31) 9' || (90000000 + floor(random() * 9999999)::int)::text, -- Random MG phone
  'Rua das Flores, ' || floor(random() * 1000)::int,
  cd.cidade,
  'MG',
  'pendente',
  'Centro'
FROM common_data cd;
