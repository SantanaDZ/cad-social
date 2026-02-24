"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { OnlineIndicator } from "@/components/online-indicator"

export function DashboardHeader({ email }: { email: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Sessao encerrada")
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card no-print">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground">CadSocial</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <OnlineIndicator />
          <span className="text-sm text-muted-foreground">{email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <OnlineIndicator />
              <span className="text-sm text-muted-foreground">{email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
