import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/Card";

type DashboardSalesChartPoint = {
  hour: string;
  total: number;
};

type DashboardSalesChartProps = {
  data: DashboardSalesChartPoint[];
};

export function DashboardSalesChart({ data }: DashboardSalesChartProps) {
  return (
    <Card variant="muted" size="lg" className="rounded-xl p-5 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Ventas</CardTitle>
        <CardDescription>Ventas por hora</CardDescription>
      </CardHeader>

      <CardContent className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.25} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="total"
              stroke="currentColor"
              fill="url(#salesGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
