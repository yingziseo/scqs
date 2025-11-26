import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
  label?: string
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (min: number, max: number) => string
}

export default function Slider({
  label,
  min,
  max,
  step = 50,
  value,
  onChange,
  formatValue,
}: SliderProps) {
  const [localMin, setLocalMin] = useState(value[0])
  const [localMax, setLocalMax] = useState(value[1])

  useEffect(() => {
    setLocalMin(value[0])
    setLocalMax(value[1])
  }, [value])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localMax - step)
    setLocalMin(newMin)
    onChange([newMin, localMax])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localMin + step)
    setLocalMax(newMax)
    onChange([localMin, newMax])
  }

  const minPercent = ((localMin - min) / (max - min)) * 100
  const maxPercent = ((localMax - min) / (max - min)) * 100

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-apple-gray-600">
            {label}
          </label>
          <span className="text-sm font-medium text-apple-blue">
            {formatValue ? formatValue(localMin, localMax) : `${localMin} - ${localMax}`}
          </span>
        </div>
      )}
      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute w-full h-2 bg-apple-gray-200 rounded-full" />

        {/* Active track */}
        <div
          className="absolute h-2 bg-apple-blue rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={handleMinChange}
          className={cn(
            'absolute w-full h-2 appearance-none bg-transparent pointer-events-none',
            '[&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:shadow-apple [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-apple-blue',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
          )}
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={handleMaxChange}
          className={cn(
            'absolute w-full h-2 appearance-none bg-transparent pointer-events-none',
            '[&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:shadow-apple [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-apple-blue',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
          )}
        />
      </div>
    </div>
  )
}
