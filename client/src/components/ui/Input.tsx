import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-apple-gray-600 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full h-12 px-4 bg-white border border-apple-gray-200 rounded-apple',
            'text-apple-gray-600 placeholder:text-apple-gray-400',
            'transition-apple focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent',
            'disabled:bg-apple-gray-50 disabled:text-apple-gray-400',
            error && 'border-apple-red focus:ring-apple-red',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-apple-red">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
