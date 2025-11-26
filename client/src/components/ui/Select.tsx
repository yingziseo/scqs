import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  options: Option[]
  placeholder?: string
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, placeholder, error, id, ...props }, ref) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full h-12 px-4 pr-10 bg-white border border-apple-gray-200 rounded-apple',
              'text-apple-gray-600 appearance-none cursor-pointer',
              'transition-apple focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent',
              'disabled:bg-apple-gray-50 disabled:text-apple-gray-400 disabled:cursor-not-allowed',
              error && 'border-apple-red focus:ring-apple-red',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-apple-red">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
