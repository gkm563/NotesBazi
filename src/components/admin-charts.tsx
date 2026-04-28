"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const yearData = [
  { name: "1st Year", count: 45 },
  { name: "2nd Year", count: 72 },
  { name: "3rd Year", count: 110 },
  { name: "4th Year", count: 38 },
];

const typeData = [
  { name: "Notes", value: 120, color: "#4f46e5" },
  { name: "Assignments", value: 85, color: "#8b5cf6" },
  { name: "PYQs", value: 60, color: "#ec4899" },
];

const trendData = [
  { month: "Jan", uploads: 20 },
  { month: "Feb", uploads: 35 },
  { month: "Mar", uploads: 55 },
  { month: "Apr", uploads: 45 },
  { month: "May", uploads: 80 },
  { month: "Jun", uploads: 95 },
];

export function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Trend */}
      <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8">
          <CardTitle className="text-2xl font-black">Upload Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] p-8 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="uploads" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorUploads)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribution */}
      <div className="grid grid-cols-1 gap-8">
         <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black">Resources by Year</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] px-8">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                     />
                     <Bar dataKey="count" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black">Content Type Split</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center p-8 pt-0">
               <div className="h-[150px] w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={typeData}
                           innerRadius={40}
                           outerRadius={60}
                           paddingAngle={8}
                           dataKey="value"
                        >
                           {typeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="w-1/2 space-y-3">
                  {typeData.map((item) => (
                     <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                           <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}</span>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
