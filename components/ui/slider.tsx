'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  formatValue,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  formatValue?: (value: number) => string
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  )

  const [activeThumb, setActiveThumb] = React.useState<number | null>(null)

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-gray-600 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-blue-500 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>

      {/* Tooltips — rendered as siblings to avoid clip-path clipping */}
      {_values.map((val, index) => {
        if (activeThumb !== index) return null
        const pct = max === min ? 0 : ((val - min) / (max - min)) * 100
        const label = formatValue ? formatValue(val) : String(val)
        return (
          <div
            key={`tooltip-${index}`}
            className="absolute -top-8 bg-gray-900 border border-gray-600 text-blue-300 text-xs font-medium px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10"
            style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
          >
            {label}
          </div>
        )
      })}

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          onPointerEnter={() => setActiveThumb(index)}
          onPointerLeave={() => setActiveThumb(null)}
          onFocus={() => setActiveThumb(index)}
          onBlur={() => setActiveThumb(null)}
          className="block w-3 h-5 shrink-0 bg-blue-400 hover:bg-blue-300 shadow transition-colors focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          style={{
            clipPath: index === 0
              ? 'polygon(0% 0%, 100% 50%, 0% 100%)'
              : 'polygon(100% 0%, 0% 50%, 100% 100%)',
          }}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
