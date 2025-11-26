import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({ children, className, padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-apple-lg shadow-apple',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-apple-gray-600">{title}</h2>
        {subtitle && (
          <p className="text-sm text-apple-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}
