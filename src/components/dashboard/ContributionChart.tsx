import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', contributions: 2000, target: 2000 },
  { month: 'Feb', contributions: 2000, target: 2000 },
  { month: 'Mar', contributions: 1500, target: 2000 },
  { month: 'Apr', contributions: 2000, target: 2000 },
  { month: 'May', contributions: 2000, target: 2000 },
  { month: 'Jun', contributions: 1500, target: 2000 },
  { month: 'Jul', contributions: 2000, target: 2000 },
  { month: 'Aug', contributions: 2000, target: 2000 },
  { month: 'Sep', contributions: 2000, target: 2000 },
  { month: 'Oct', contributions: 2000, target: 2000 },
  { month: 'Nov', contributions: 1500, target: 2000 },
  { month: 'Dec', contributions: 0, target: 2000 },
];

export function ContributionChart() {
  return (
    <div className="card-community p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Monthly Contributions</h3>
          <p className="text-sm text-muted-foreground mt-0.5">2024 collection overview</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Collected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Target</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="contributionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 85%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(200, 85%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
              tickFormatter={(value) => `E${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(210, 20%, 90%)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number) => [`E${value.toLocaleString()}`, '']}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(210, 15%, 85%)"
              strokeDasharray="5 5"
              fill="transparent"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="contributions"
              stroke="hsl(200, 85%, 50%)"
              fill="url(#contributionGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
