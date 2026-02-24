import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, ClipboardList, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">CadSocial</span>
        </div>
        <Link href="/auth/login">
          <Button variant="outline" size="sm">Entrar</Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center md:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <ShieldCheck className="h-4 w-4" />
            Sistema Governamental
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Cadastro de Programas Sociais
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Plataforma segura para registro e acompanhamento de inscritos em programas sociais.
            Preencha os dados dos beneficiários de forma simples e organizada.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="gap-2">
                Criar Conta
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card px-4 py-12 md:py-16">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Cadastro Simplificado</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Formulário em etapas para facilitar o preenchimento dos dados pessoais, endereço e situação socioeconômica.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Gerenciamento Completo</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Visualize, edite e acompanhe o status de todas as inscrições em um painel organizado.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Seguro e Confiável</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Dados protegidos com criptografia e acesso restrito. Cada usuário vê apenas seus próprios registros.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
        CadSocial - Sistema de Cadastro de Programas Sociais
      </footer>
    </main>
  )
}
