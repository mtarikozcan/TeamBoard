import { cn } from '@/lib/utils'

type SubColor = 'blue' | 'red' | 'green' | 'yellow'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  subColor?: SubColor
}

const subColorClasses: Record<SubColor, string> = {
  blue: 'text-blue-400',
  red: 'text-red-400',
  green: 'text-green-400',
  yellow: 'text-yellow-400',
}

export function StatCard({ label, value, sub, subColor = 'blue' }: StatCardProps) {
  return (
    <div className="bg-surface-elevated border border-border rounded-lg p-4">
      <p className="text-xs font-medium text-tx-label uppercase tracking-widest">
        {label}
      </p>
      <p className="text-3xl font-bold text-tx-primary mt-1">{value}</p>
      {sub && (
        <p className={cn('text-xs mt-1', subColorClasses[subColor])}>
          {sub}
        </p>
      )}
    </div>
  )
}
