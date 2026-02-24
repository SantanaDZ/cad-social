"use client"

import { useState, useEffect, useCallback } from "react"

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}

interface QueueItem {
  id: string
  data: Record<string, unknown>
  timestamp: number
}

const QUEUE_KEY = "cadsocial_offline_queue"

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const isOnline = useOnlineStatus()

  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUEUE_KEY)
      if (stored) {
        setQueue(JSON.parse(stored))
      }
    } catch {
      // localStorage not available
    }
  }, [])

  const addToQueue = useCallback((data: Record<string, unknown>) => {
    const item: QueueItem = {
      id: crypto.randomUUID(),
      data,
      timestamp: Date.now(),
    }
    setQueue((prev) => {
      const next = [...prev, item]
      try {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(next))
      } catch {
        // localStorage not available
      }
      return next
    })
    return item.id
  }, [])

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => {
      const next = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(next))
      } catch {
        // localStorage not available
      }
      return next
    })
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
    try {
      localStorage.removeItem(QUEUE_KEY)
    } catch {
      // localStorage not available
    }
  }, [])

  return { queue, addToQueue, removeFromQueue, clearQueue, isOnline }
}
