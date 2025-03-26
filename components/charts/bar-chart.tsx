"use client"

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BarChartProps {
  data: any[]
  xKey: string
  yKey: string
  color?: string
  height?: number
  showXAxis?: boolean
  showYAxis?: boolean
  showTooltip?: boolean
  className?: string
}

export function BarChart({
  data,
  xKey,
  yKey,
  color = "hsl(var(--primary))",
  height = 300,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  className,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        {showXAxis && (
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={10} stroke="#888888" fontSize={12} />
        )}
        {showYAxis && <YAxis tickLine={false} axisLine={false} tickMargin={10} stroke="#888888" fontSize={12} />}
        {showTooltip && (
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">{xKey}</span>
                        <span className="font-bold text-muted-foreground">{payload[0].payload[xKey]}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">{yKey}</span>
                        <span className="font-bold">{payload[0].payload[yKey]}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        )}
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

