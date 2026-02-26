import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()

  // Verificação de autenticação e papel de admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 })
  }

  // Pegar filtros da URL
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "todos"
  const view = searchParams.get("view") || "minhas"

  // Construir query para buscar TODOS os registros (sem paginação para o CSV)
  let query = supabase
    .from("inscricoes")
    .select(`
      nome_completo,
      cpf,
      telefone,
      cidade,
      estado,
      status,
      created_at,
      renda_familiar,
      profiles:user_id (email)
    `)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(`nome_completo.ilike.%${search}%,cpf.ilike.%${search}%,cidade.ilike.%${search}%`)
  }

  if (status !== "todos") {
    query = query.eq("status", status)
  }

  if (view === "minhas") {
    query = query.eq("user_id", user.id)
  }

  const { data: inscricoes, error } = await query

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  // Gerar conteúdo CSV
  const headers = ["Nome", "CPF", "Telefone", "Cidade", "Estado", "Status", "Data Criacao", "Renda Familiar", "Email Responsavel"]
  const rows = (inscricoes as any[]).map(i => [
    i.nome_completo,
    i.cpf || "",
    i.telefone || "",
    i.cidade,
    i.estado,
    i.status,
    new Date(i.created_at).toLocaleDateString('pt-BR'),
    i.renda_familiar || 0,
    i.profiles?.email || ""
  ])

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
  ].join("\n")

  // Retornar o arquivo
  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscricoes-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
