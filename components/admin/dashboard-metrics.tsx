"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts"
import { CheckCircle2, Clock, XCircle, Users, MapPin } from "lucide-react"

interface MetricsProps {
    metrics: {
        total: number
        pendente: number
        aprovado: number
        rejeitado: number
        avgAnalysisTime?: number
        byRegion: { name: string; value: number }[]
        byPeriod: { date: string; count: number }[]
    }
}

const COLORS = ["#f59e0b", "#10b981", "#ef4444"]

export function DashboardMetrics({ metrics }: MetricsProps) {
    const statusData = [
        { name: "Pendente", value: metrics.pendente },
        { name: "Aprovado", value: metrics.aprovado },
        { name: "Rejeitado", value: metrics.rejeitado },
    ]

    return (
        <div className="grid gap-6">
            {/* Cards de Resumo */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Inscrições</p>
                            <h3 className="text-2xl font-bold">{metrics.total}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                            <Clock className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                            <h3 className="text-2xl font-bold">{metrics.pendente}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                            <CheckCircle2 className="h-6 w-6 text-success" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Aprovadas</p>
                            <h3 className="text-2xl font-bold">{metrics.aprovado}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <XCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Rejeitadas</p>
                            <h3 className="text-2xl font-bold">{metrics.rejeitado}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Gráfico de Evolução Temporária */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Inscrições por Período</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.byPeriod}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Distribuição por Região/Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Distribuição Geográfica</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.byRegion}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {metrics.byRegion.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${100 - (index * 20)}%)`} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
