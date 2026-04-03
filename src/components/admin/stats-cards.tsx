import {
  Package,
  Users,
  FolderTree,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const iconMap: Record<string, LucideIcon> = {
  Package,
  Users,
  FolderTree,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
}

interface StatItem {
  label: string
  value: number | string
  icon: string
}

interface StatsCardsProps {
  stats: StatItem[]
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] ?? Package
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-muted-foreground">
                  {stat.label}
                </p>
                <p className="font-heading text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
