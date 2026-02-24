"use client"

import { useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useOfflineQueue, useOnlineStatus } from "@/hooks/use-offline-queue"
import { toast } from "sonner"
import { WifiOff, Upload, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function OfflineSyncManager() {
  const { queue, removeFromQueue, clearQueue } = useOfflineQueue()
  const isOnline = useOnlineStatus()
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()

  const syncQueue = useCallback(async () => {
    if (queue.length === 0 || !isOnline || syncing) return

    setSyncing(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setSyncing(false)
      return
    }

    let successCount = 0
    let errorCount = 0

    const queueItems = [...queue]

    for (const item of queueItems) {
      try {
        const { error } = await supabase.from("inscricoes").insert({
          ...item.data,
          user_id: user.id,
          status: "pendente",
        })

        if (error) {
          errorCount++
        } else {
          removeFromQueue(item.id)
          successCount++
        }
      } catch (err) {
        errorCount++
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} inscrição(ões) sincronizada(s) com sucesso!`)
      router.refresh()
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} inscrição(ões) falharam ao sincronizar.`)
    }

    setSyncing(false)
  }, [queue, isOnline, syncing, removeFromQueue, router])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      syncQueue()
    }
  }, [isOnline, queue.length, syncQueue])

  if (queue.length === 0) return null

  return (
    <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 shrink-0 text-warning-foreground" />
          <div>
            <p className="text-sm font-medium text-warning-foreground">
              {queue.length} inscrição(ões) pendente(s) de sincronização
            </p>
            <p className="text-xs text-warning-foreground/70">
              {isOnline
                ? "Clique para sincronizar agora"
                : "Será sincronizado quando a conexão voltar"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOnline && (
            <Button
              size="sm"
              variant="outline"
              onClick={syncQueue}
              disabled={syncing}
              className="gap-2"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Sincronizar
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={clearQueue}
            className="text-xs text-warning-foreground/70"
          >
            Descartar
          </Button>
        </div>
      </div>
    </div>
  )
}
