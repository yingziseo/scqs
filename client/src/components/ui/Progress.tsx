import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md'
  showLabel?: boolean
  label?: string
}

export default function Progress({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  label,
}: ProgressProps) {
  const percent = Math.min((value / max) * 100, 100)

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
  }

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-apple-gray-500">{label}</span>
          {showLabel && (
            <span className="text-sm font-medium text-apple-gray-600">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-apple-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full bg-apple-blue rounded-full transition-all duration-300 ease-apple',
            sizes[size]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
