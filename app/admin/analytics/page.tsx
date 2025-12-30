"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    avgSessionDuration: 0,
    topPages: [] as any[],
  })

  useEffect(() => {
    // Placeholder analytics
    setAnalytics({
      totalVisits: 1250,
      avgSessionDuration: 5.3,
      topPages: [
        { page: "/buyer/products", visits: 450 },
        { page: "/auth/login", visits: 380 },
        { page: "/checkout", visits: 280 },
        { page: "/", visits: 140 },
      ],
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Analytics & Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-card border-border neon-border-blue">
          <p className="text-muted-foreground text-sm mb-2">Total Visits</p>
          <p className="text-4xl font-bold text-primary neon-glow-blue">{analytics.totalVisits}</p>
        </Card>

        <Card className="p-6 bg-card border-border neon-border-blue">
          <p className="text-muted-foreground text-sm mb-2">Avg Session Duration</p>
          <p className="text-4xl font-bold text-secondary neon-glow-yellow">{analytics.avgSessionDuration}m</p>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Top Pages</h2>
        <div className="space-y-3">
          {analytics.topPages.map((page, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="text-foreground">{page.page}</span>
              <span className="text-secondary font-semibold">{page.visits} visits</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
