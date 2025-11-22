import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsView = ({ incidents }) => {
    // Prepare data for charts
    const typeData = [
        { name: 'Accident', value: incidents.filter(i => i.type === 'accident').length },
        { name: 'Congestion', value: incidents.filter(i => i.type === 'congestion').length },
        { name: 'Blockage', value: incidents.filter(i => i.type === 'road_blockage').length },
    ];

    const COLORS = ['#ef4444', '#f97316', '#3b82f6'];

    // Dummy hourly data (in a real app, this would come from backend aggregation)
    const hourlyData = [
        { name: '8am', incidents: 2 },
        { name: '10am', incidents: 5 },
        { name: '12pm', incidents: 3 },
        { name: '2pm', incidents: 6 },
        { name: '4pm', incidents: 8 },
        { name: '6pm', incidents: 4 },
    ];

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold mb-6">Traffic Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Incident Distribution */}
                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">Incident Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Hourly Trend */}
                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">Hourly Trend (Today)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                />
                                <Bar dataKey="incidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="glass p-6 rounded-2xl border-l-4 border-red-500">
                    <h4 className="text-gray-400 text-sm uppercase">Most Dangerous Area</h4>
                    <p className="text-2xl font-bold mt-1">Remera Junction</p>
                    <p className="text-xs text-gray-500 mt-2">3 accidents this week</p>
                </div>
                <div className="glass p-6 rounded-2xl border-l-4 border-orange-500">
                    <h4 className="text-gray-400 text-sm uppercase">Peak Congestion</h4>
                    <p className="text-2xl font-bold mt-1">05:30 PM</p>
                    <p className="text-xs text-gray-500 mt-2">Average delay: 25 mins</p>
                </div>
                <div className="glass p-6 rounded-2xl border-l-4 border-blue-500">
                    <h4 className="text-gray-400 text-sm uppercase">System Health</h4>
                    <p className="text-2xl font-bold mt-1">98.5%</p>
                    <p className="text-xs text-gray-500 mt-2">All cameras operational</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
