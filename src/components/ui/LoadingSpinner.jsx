export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size] || 'w-8 h-8'

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClass} border-4 border-bb-blue-lt border-t-bb-blue rounded-full animate-spin`} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <LoadingSpinner size="lg" />
    </div>
  )
}
