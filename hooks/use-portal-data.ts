import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { EventSourcePolyfill as EventSource } from "event-source-polyfill"

export interface DataHookConfig<T> {
  path: string
  initialData?: T
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
}

export function usePortalData<T>(config: DataHookConfig<T>) {
  const [data, setData] = useState<T | undefined>(config.initialData)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(!config.initialData)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    let eventSource: EventSource | null = null

    const fetchData = async () => {
      try {
        const response = await fetch(`/api${config.path}`)
        if (!response.ok) throw new Error("Failed to fetch data")
        const json = await response.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError(err as Error)
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchData()

    // Set up real-time updates if user is authenticated
    if (user) {
      eventSource = new EventSource(`/api${config.path}/live`, {
        withCredentials: true,
      })

      eventSource.onmessage = (event) => {
        try {
          const updatedData = JSON.parse(event.data)
          setData(updatedData)
        } catch (err) {
          console.error("Failed to parse SSE data:", err)
        }
      }

      eventSource.onerror = () => {
        eventSource?.close()
        toast({
          title: "Connection Lost",
          description: "Real-time updates are currently unavailable.",
          variant: "destructive",
        })
      }
    }

    // Cleanup
    return () => {
      eventSource?.close()
    }
  }, [config.path, toast, user])

  // Function to manually trigger a refresh
  const refresh = () => {
    setIsLoading(true)
    fetch(`/api${config.path}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setError(null)
      })
      .catch((err) => {
        setError(err)
        toast({
          title: "Error",
          description: "Failed to refresh data. Please try again.",
          variant: "destructive",
        })
      })
      .finally(() => setIsLoading(false))
  }

  // Function to optimistically update data
  const mutate = async (
    updateFn: (currentData: T | undefined) => T | undefined,
    serverAction: () => Promise<any>
  ) => {
    const previousData = data
    try {
      // Optimistically update the UI
      setData(updateFn(data))
      
      // Perform the server action
      await serverAction()
    } catch (err) {
      // Revert on error
      setData(previousData)
      toast({
        title: "Error",
        description: "Failed to update data. Changes have been reverted.",
        variant: "destructive",
      })
    }
  }

  return {
    data,
    error,
    isLoading,
    refresh,
    mutate,
  }
}
