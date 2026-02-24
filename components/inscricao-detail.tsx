"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ArrowLeft,
  Printer,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  MapPin,
  BarChart3,
  ShieldCheck,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Inscricao } from "@/lib/types"
import { escolaridadeOptions, situacaoMoradiaOptions, generoOptions } from "@/lib/types"

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pendente: { label: "Pendente", icon: Clock, className: "bg-warning/15 text-warning-foreground border-warning/30" },
  aprovado: { label: "Aprovado", icon: CheckCircle2, className: "bg-success/15 text-success border-success/30" },
  rejeitado: { label: "Rejeitado", icon: XCircle, className: "bg-destructive/15 text-destructive border-destructive/30" },
}

function getLabel(options: { value: string; label: string }[], value: string | undefined | null) {
  if (!value) return "Não informado"
  return options.find((o) => o.value === value)?.label ?? value
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "Não informado"
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function InscricaoDetail({ inscricao }: { inscricao: Inscricao }) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const status = statusConfig[inscricao.status] ?? statusConfig.pendente
  const StatusIcon = status.icon

  async function handleStatusChange(newStatus: string) {
    setUpdatingStatus(newStatus)
    const supabase = createClient()
    const { error } = await supabase
      .from("inscricoes")
      .update({ status: newStatus })
      .eq("id", inscricao.id)

    if (error) {
      toast.error("Erro ao atualizar status", { description: error.message })
    } else {
      toast.success(`Status atualizado para ${statusConfig[newStatus]?.label ?? newStatus}`)
      router.refresh()
    }
    setUpdatingStatus(null)
  }

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("inscricoes")
      .delete()
      .eq("id", inscricao.id)

    if (error) {
      toast.error("Erro ao excluir", { description: error.message })
      setDeleting(false)
    } else {
      toast.success("Inscrição excluída")
      router.push("/dashboard")
      router.refresh()
    }
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6 print-full-width">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Detalhes da Inscrição</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Excluir</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir inscrição?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A inscrição de{" "}
                  <strong>{inscricao.nome_completo}</strong> será permanentemente removida.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Print header - only visible in print */}
      <div className="hidden print:block">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-xl font-bold">CadSocial - Ficha de Inscrição</span>
        </div>
        <Separator />
      </div>

      {/* Status and actions */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`gap-1.5 px-3 py-1.5 text-sm ${status.className}`}>
              <StatusIcon className="h-4 w-4" />
              {status.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Criado em {format(parseISO(inscricao.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-2 no-print">
            {inscricao.status !== "aprovado" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("aprovado")}
                disabled={!!updatingStatus}
                className="gap-1.5 text-success hover:bg-success/10"
              >
                {updatingStatus === "aprovado" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Aprovar
              </Button>
            )}
            {inscricao.status !== "rejeitado" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("rejeitado")}
                disabled={!!updatingStatus}
                className="gap-1.5 text-destructive hover:bg-destructive/10"
              >
                {updatingStatus === "rejeitado" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                Rejeitar
              </Button>
            )}
            {inscricao.status !== "pendente" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("pendente")}
                disabled={!!updatingStatus}
                className="gap-1.5"
              >
                {updatingStatus === "pendente" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />}
                Pendente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Data */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DataField label="Nome Completo" value={inscricao.nome_completo} />
            <DataField
              label="Data de Nascimento"
              value={inscricao.data_nascimento ? format(parseISO(inscricao.data_nascimento), "dd/MM/yyyy", { locale: ptBR }) : undefined}
            />
            <DataField label="Gênero" value={getLabel(generoOptions, inscricao.genero)} />
            <DataField label="CPF" value={inscricao.cpf} />
            <DataField label="RG" value={inscricao.rg} />
            <DataField label="Telefone" value={inscricao.telefone} />
          </dl>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <CardTitle className="text-lg">Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DataField label="Endereço" value={inscricao.endereco} className="sm:col-span-2" />
            <DataField label="Bairro" value={inscricao.bairro} />
            <DataField label="Cidade" value={inscricao.cidade} />
            <DataField label="Estado" value={inscricao.estado} />
            <DataField label="CEP" value={inscricao.cep} />
          </dl>
        </CardContent>
      </Card>

      {/* Socioeconomic */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Dados Socioeconômicos</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DataField label="Renda Familiar" value={formatCurrency(inscricao.renda_familiar)} />
            <DataField label="Membros na Família" value={inscricao.membros_familia?.toString()} />
            <DataField label="Despesas Mensais" value={formatCurrency(inscricao.despesas_mensais)} />
            <DataField label="Escolaridade" value={getLabel(escolaridadeOptions, inscricao.escolaridade)} />
            <DataField label="Situação de Moradia" value={getLabel(situacaoMoradiaOptions, inscricao.situacao_moradia)} />
            <DataField
              label="Benefício Governamental"
              value={inscricao.possui_beneficio_gov ? `Sim - ${inscricao.qual_beneficio || "Não especificado"}` : "Não"}
            />
            {inscricao.observacoes && (
              <DataField label="Observações" value={inscricao.observacoes} className="sm:col-span-2" />
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

function DataField({
  label,
  value,
  className = "",
}: {
  label: string
  value?: string | null
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value || "Não informado"}</dd>
    </div>
  )
}
