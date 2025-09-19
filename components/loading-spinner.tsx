export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-muted rounded-full animate-spin border-t-primary mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold animate-pulse">Parizah Vogue</h2>
          <p className="text-muted-foreground text-sm animate-pulse">Loading your fashion destination...</p>
        </div>
      </div>
    </div>
  )
}
