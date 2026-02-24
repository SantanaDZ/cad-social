import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { OfflineSyncManager } from "@/components/offline-sync-manager"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DashboardHeader email={user.email ?? ""} />
      <main className="flex-1 px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <OfflineSyncManager />
          {children}
        </div>
      </main>
    </div>
  )
}
