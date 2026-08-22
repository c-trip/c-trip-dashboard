"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

export interface SectionCardItem {
  description: string
  value: string
  trend?: "up" | "down"
  trendValue?: string
  footerTitle: string
  footerSubtitle: string
  footerHref?: string
}

const DEFAULT_CARDS: SectionCardItem[] = [
  {
    description: "Total Revenue",
    value: "$1,250.00",
    trend: "up",
    trendValue: "+12.5%",
    footerTitle: "Trending up this month",
    footerSubtitle: "Visitors for the last 6 months",
  },
  {
    description: "New Customers",
    value: "1,234",
    trend: "down",
    trendValue: "-20%",
    footerTitle: "Down 20% this period",
    footerSubtitle: "Acquisition needs attention",
  },
  {
    description: "Active Accounts",
    value: "45,678",
    trend: "up",
    trendValue: "+12.5%",
    footerTitle: "Strong user retention",
    footerSubtitle: "Engagement exceed targets",
  },
  {
    description: "Growth Rate",
    value: "4.5%",
    trend: "up",
    trendValue: "+4.5%",
    footerTitle: "Steady performance increase",
    footerSubtitle: "Meets growth projections",
  },
]

export function SectionCards({ cards = DEFAULT_CARDS }: { cards?: SectionCardItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => {
        const TrendIcon = card.trend === "down" ? IconTrendingDown : IconTrendingUp
        return (
          <Card key={card.description} className="@container/card">
            <CardHeader>
              <CardDescription>{card.description}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              {card.trendValue ? (
                <CardAction>
                  <Badge variant="outline">
                    <TrendIcon />
                    {card.trendValue}
                  </Badge>
                </CardAction>
              ) : null}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footerTitle}
                {card.trend ? <TrendIcon className="size-4" /> : null}
              </div>
              {card.footerHref ? (
                <a href={card.footerHref} className="text-primary hover:underline">
                  {card.footerSubtitle}
                </a>
              ) : (
                <div className="text-muted-foreground">{card.footerSubtitle}</div>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
