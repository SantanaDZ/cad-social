"use client"

import { useOnlineStatus } from "@/hooks/use-offline-queue"
import { Wifi, WifiOff } from "lucide-react"

export function OnlineIndicator() {
  const isOnline = useOnlineStatus()

  return (
    <div className="flex items-center gap-1.5">
      {isOnline ? (
        <>
          <Wifi className="h-3.5 w-3.5 text-success" />
          <span className="text-xs text-success">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5 text-warning" />
          <span className="text-xs text-warning">Offline</span>
        </>
      )}
    </div>
  )
}
