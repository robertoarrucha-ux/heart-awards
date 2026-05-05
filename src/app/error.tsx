'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
      </p>
      <Button
        onClick={() => reset()}
        variant="default"
        size="lg"
      >
        Intentar de nuevo
      </Button>
    </div>
  )
}
