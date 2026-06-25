import { useEffect, useState } from 'react'

export function useMockRealtime(initialValue: number, step = 1, intervalMs = 4500) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((current) => current + step)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [intervalMs, step])

  return value
}
