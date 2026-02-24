"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Plus, Search, Filter, ChevronRight, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Inscricao } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

const statusMap: Record<string, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-warning/15 text-warning-foreground border-warning/30" },
  aprovado: { label: "Aprovado", className: "bg-success/15 text-success border-success/30" },
  rejeitado: { label: "Rejeitado", className: "bg-destructive/15 text-destructive border-destructive/30" },
}

export function InscricoesList({
  initialData,
  error,
  isAdmin,
  currentUserId,
}: {
  initialData: Inscricao[]
  error?: string
  isAdmin?: boolean
  currentUserId?: string
}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [viewMode, setViewMode] = useState<"minhas" | "todas">("minhas")

  const filtered = useMemo(() => {
    return initialData.filter((item) => {
      // Filter by view mode for admins
      if (isAdmin && viewMode === "minhas" && item.user_id !== currentUserId) {
        return false
      }

      const matchesSearch =
        item.nome_completo.toLowerCase().includes(search.toLowerCase()) ||
        item.cpf?.includes(search) ||
        item.cidade.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "todos" || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [initialData, search, statusFilter, isAdmin, viewMode, currentUserId])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Inscrições</h1>
            {isAdmin && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Administrador
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "registro mostrado" : "registros mostrados"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {isAdmin && (
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "minhas" | "todas")}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="minhas">Minhas</TabsTrigger>
                <TabsTrigger value="todas">Todas</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <Link href="/dashboard/nova-inscricao">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              <Plus className="h-4 w-4" />
              Nova Inscrição
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Erro ao carregar inscrições: {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="rejeitado">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground">
              {initialData.length === 0
                ? "Nenhuma inscrição ainda"
                : "Nenhum resultado encontrado"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {initialData.length === 0
                ? "Clique em 'Nova Inscrição' para adicionar o primeiro registro."
                : "Tente alterar os filtros de busca."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((inscricao: any) => {
            const status = statusMap[inscricao.status] ?? statusMap.pendente
            const ownerEmail = inscricao.profiles?.email || "Usuário Desconhecido"
            const isOwnRegistration = inscricao.user_id === currentUserId

            return (
              <Link
                key={inscricao.id}
                href={`/dashboard/inscricao/${inscricao.id}`}
                className="group"
              >
                <Card className="transition-colors hover:border-primary/30 hover:bg-primary/5">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-foreground">
                          {inscricao.nome_completo}
                        </h3>
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                        {isAdmin && viewMode === "todas" && (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none text-[10px] py-0 px-2 h-5">
                            {isOwnRegistration ? "Sua" : `De: ${ownerEmail}`}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{inscricao.cidade}, {inscricao.estado}</span>
                        {inscricao.cpf && <span>CPF: {inscricao.cpf}</span>}
                        <span>
                          {format(parseISO(inscricao.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
