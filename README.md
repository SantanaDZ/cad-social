# CadSocial - Sistema de Cadastro de Programas Sociais

O **CadSocial** é uma plataforma moderna e segura desenvolvida para facilitar o registro e gerenciamento de beneficiários em programas sociais governamentais. O sistema prioriza a organização dos dados, a segurança da informação e a facilidade de uso tanto para cidadãos quanto para administradores.

## 🚀 Funcionalidades Principais

### 📋 Cadastro em Etapas
O sistema utiliza um formulário inteligente dividido em três etapas principais para garantir a precisão dos dados:
1.  **Dados Pessoais**: Identificação completa, incluindo CPF, RG e contato.
2.  **Endereço**: Localização detalhada para mapeamento social.
3.  **Dados Socioeconômicos**: Coleta de informações sobre renda familiar, despesas, escolaridade, situação de moradia e benefícios ativos.

### 🛡️ Níveis de Acesso (RBAC)
*   **Cidadão (User)**: Pode realizar seu próprio cadastro e acompanhar o status de suas solicitações. Tem acesso restrito apenas aos seus próprios dados.
*   **Administrador**: Possui visão global de todas as inscrições, podendo filtrar por solicitante, analisar documentos e alterar o status da inscrição (Pendente, Aprovado ou Rejeitado).

### 📶 Suporte Offline
O sistema conta com um gerenciador de sincronização inteligente. Se o usuário estiver sem internet, as inscrições são salvas localmente e sincronizadas automaticamente assim que a conexão for restabelecida.

### 📊 Painel Administrativo
Visualização clara do status de todos os registros, com sistema de busca e identificação por cores (badges) para facilitar a gestão rápida.

### 🖨️ Ficha de Inscrição
Visualização detalhada de cada registro, otimizada para impressão de fichas de acompanhamento.

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
*   **Backend & Auth**: [Supabase](https://supabase.com/)
*   **Validação**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
*   **Ícones**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Configuração do Projeto

### Pré-requisitos
*   Node.js instalado
*   Uma conta no Supabase

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves:
```env
NEXT_PUBLIC_SUPABASE_URL=https://gzogswhcipgufxapexnx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6b2dzd2hjaXBndWZ4YXBleG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDM4ODIsImV4cCI6MjA4NzQ3OTg4Mn0.-lYstYH6oZz1Q7NztTsapheqM8OJ2E4A3m8MKcTp_F0

```

### Inicialização do Banco de Dados
Os scripts SQL necessários para criar as tabelas (`inscricoes`, `profiles`) e configurar as políticas de segurança (RLS) estão localizados na pasta `scripts/`. Recomenda-se executá-los na ordem numérica:
1. `001_create_inscricoes.sql`
2. `002_updated_at_trigger.sql`
3. `003_create_profiles.sql`

---

## 👨‍💻 Como Executar

1.  Instale as dependências:
    ```bash
    npm install
    # ou
    pnpm install
    ```

2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

3.  Acesse `http://localhost:3000`.

---

## 📄 Licença
Este projeto foi desenvolvido para fins de gerenciamento governamental e social.
