import { createClient } from "@/lib/supabase/server"
import { InscricoesList } from "@/components/inscricoes-list"
import type { Inscricao } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch user data
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single()

  const isAdmin = profile?.role === "admin"

  // Fetch inscriptions with owner email if available
  const { data: inscricoes, error } = await supabase
    .from("inscricoes")
    .select(`
      *,
      profiles:user_id (
        email
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <InscricoesList
      initialData={(inscricoes as any[]) ?? []}
      error={error?.message}
      isAdmin={isAdmin}
      currentUserId={user?.id}
    />
  )
}
