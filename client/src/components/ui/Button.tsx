import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-apple rounded-apple focus-ring press-effect active:scale-[0.98]'

    const variants = {
      primary: 'bg-apple-blue text-white hover:bg-apple-blue-hover disabled:bg-apple-gray-200 disabled:text-apple-gray-400',
      secondary: 'bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200 disabled:bg-apple-gray-50 disabled:text-apple-gray-300',
      ghost: 'bg-transparent text-apple-blue hover:bg-apple-blue/10 disabled:text-apple-gray-300',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
