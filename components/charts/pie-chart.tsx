"use client"

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"

interface PieChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
  height?: number
  showTooltip?: boolean
  className?: string
}

export function PieChart({ data, height = 300, showTooltip = true, className }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsPieChart>
        {showTooltip && (
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-bold">{data.name}</span>
                      <span className="text-muted-foreground">{data.value}</span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        )}
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

