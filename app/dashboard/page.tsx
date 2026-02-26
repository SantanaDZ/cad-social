import { createClient } from "@/lib/supabase/server"
import { InscricoesList } from "@/components/inscricoes-list"
import { DashboardMetrics } from "@/components/admin/dashboard-metrics"
import { startOfDay, subDays, format } from "date-fns"

const PAGE_SIZE = 20

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; view?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const page = Math.max(1, Number(params.page ?? "1"))
  const search = params.search ?? ""
  const statusFilter = params.status ?? "todos"
  const view = params.view ?? "minhas"

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single()

  const isAdmin = profile?.role === "admin"

  // Fetch metrics ONLY for admins
  let dashboardMetrics = null
  if (isAdmin) {
    const { data: allInscricoes } = await supabase
      .from("inscricoes")
      .select("status, created_at, estado, cidade")

    if (allInscricoes) {
      const counts = allInscricoes.reduce((acc: any, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1
        return acc
      }, { pendente: 0, aprovado: 0, rejeitado: 0 })

      // Aggregates for regions
      const regionsMap = allInscricoes.reduce((acc: any, curr) => {
        const key = curr.estado || "Não informado"
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})
      const byRegion = Object.entries(regionsMap)
        .map(([name, value]) => ({ name, value: value as number }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

      // Aggregates for period (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), i), "dd/MM")
        return { date, count: 0 }
      }).reverse()

      allInscricoes.forEach(i => {
        const date = format(new Date(i.created_at), "dd/MM")
        const found = last7Days.find(d => d.date === date)
        if (found) found.count++
      })

      dashboardMetrics = {
        total: allInscricoes.length,
        ...counts,
        byRegion,
        byPeriod: last7Days
      }
    }
  }

  let query = supabase
    .from("inscricoes")
    .select(
      `*, profiles:user_id ( email )`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })

  // Admins em modo "todas" veem tudo; demais filtram pelo próprio user_id
  if (!isAdmin || view !== "todas") {
    query = query.eq("user_id", user?.id)
  }

  if (search) {
    query = query.or(
      `nome_completo.ilike.%${search}%,cpf.ilike.%${search}%,cidade.ilike.%${search}%`
    )
  }

  if (statusFilter !== "todos") {
    query = query.eq("status", statusFilter)
  }

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data: inscricoes, error, count } = await query

  return (
    <div className="container mx-auto py-8 flex flex-col gap-8">
      {isAdmin && dashboardMetrics && (
        <DashboardMetrics metrics={dashboardMetrics} />
      )}

      <InscricoesList
        data={(inscricoes as any[]) ?? []}
        error={error?.message}
        isAdmin={isAdmin}
        currentUserId={user?.id}
        totalCount={count ?? 0}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
