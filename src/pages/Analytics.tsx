import { useQuery } from "@tanstack/react-query";
import { fetchBeans } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { calculateCosts } from "@/lib/costCalculations";

const COLORS = ["#967259", "#E6D5C3", "#634832", "#F5E6D3"];

export default function Analytics() {
  const { data: beans = [] } = useQuery({
    queryKey: ["beans"],
    queryFn: fetchBeans,
  });

  // Calculate average rating by roaster
  const roasterRatings = beans.reduce((acc: any, bean: any) => {
    if (!acc[bean.roaster]) {
      acc[bean.roaster] = { total: 0, count: 0 };
    }
    acc[bean.roaster].total += bean.rank;
    acc[bean.roaster].count += 1;
    return acc;
  }, {});

  const roasterRatingsData = Object.entries(roasterRatings).map(
    ([roaster, data]: [string, any]) => ({
      roaster,
      rating: data.total / data.count,
    })
  );

  // Calculate cost distribution
  const costData = beans.map((bean: any) => {
    const costs = calculateCosts(bean);
    return {
      name: bean.name,
      costPerShot: Number(costs.costPerShot),
    };
  });

  // Count beans by origin
  const originData = beans.reduce((acc: any, bean: any) => {
    acc[bean.origin] = (acc[bean.origin] || 0) + 1;
    return acc;
  }, {});

  const originPieData = Object.entries(originData).map(([origin, value]) => ({
    name: origin,
    value,
  }));

  // Track purchase history over time
  const purchaseData = beans
    .filter((bean: any) => bean.purchaseCount)
    .map((bean: any) => ({
      name: bean.name,
      purchases: bean.purchaseCount,
    }));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold text-coffee-dark dark:text-white mb-8">
        Coffee Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 dark:bg-[#171717]">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Average Ratings by Roaster
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roasterRatingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="roaster"
                tick={{ fill: "currentColor" }}
                stroke="currentColor"
              />
              <YAxis
                tick={{ fill: "currentColor" }}
                stroke="currentColor"
                domain={[0, 5]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="rating" fill="#967259" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 dark:bg-[#171717]">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Cost per Shot Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "currentColor" }}
                stroke="currentColor"
              />
              <YAxis
                tick={{ fill: "currentColor" }}
                stroke="currentColor"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="costPerShot"
                stroke="#E6D5C3"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 dark:bg-[#171717]">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Beans by Origin
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={originPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  name,
                }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="currentColor"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {originPieData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 dark:bg-[#171717]">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Purchase History
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={purchaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "currentColor" }}
                stroke="currentColor"
              />
              <YAxis
                tick={{ fill: "currentColor" }}
                stroke="currentColor"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="purchases" fill="#634832" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}