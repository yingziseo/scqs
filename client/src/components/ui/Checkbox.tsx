import { forwardRef, type InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          'inline-flex items-center gap-3 cursor-pointer select-none',
          props.disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <motion.div
            className={cn(
              'w-5 h-5 rounded-md border-2 transition-colors',
              checked
                ? 'bg-apple-blue border-apple-blue'
                : 'bg-white border-apple-gray-300 hover:border-apple-gray-400'
            )}
            whileTap={{ scale: 0.9 }}
          >
            {checked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center w-full h-full"
              >
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </motion.div>
        </div>
        {label && (
          <span className="text-sm text-apple-gray-600">{label}</span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
