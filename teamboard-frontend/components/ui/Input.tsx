import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-xs text-tx-label uppercase tracking-wider mb-1.5 font-medium">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full bg-surface-elevated border border-border rounded px-3 py-2',
          'text-sm text-tx-primary placeholder:text-tx-muted',
          'focus:outline-none focus:border-blue-500 transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
