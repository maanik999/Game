
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { HistoryEntry } from '../types';
import { ChartIcon } from './icons';


interface ProgressChartProps {
    data: HistoryEntry[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-lg text-sm">
                <p className="font-bold text-white">{`Round ${label}`}</p>
                <p className="text-gray-300">{`Balance: $${data.balance.toFixed(2)}`}</p>
                <p className={data.result === 'win' ? 'text-green-400' : 'text-red-400'}>
                    {`Profit: $${data.profit.toFixed(2)}`}
                </p>
                <p className="text-gray-400">{`Multiplier: ${data.multiplier}x`}</p>
                <p className="text-gray-400">{`Bet: $${data.bet.toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg h-96">
            <h2 className="text-xl font-semibold mb-4 flex items-center"><ChartIcon /><span className="ml-2">Balance Progression</span></h2>
            {data.length === 0 ? (
                 <div className="flex items-center justify-center h-full text-gray-500">
                    Start the simulation to see chart data.
                </div>
            ) : (
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="round" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" domain={['dataMin - 10', 'dataMax + 10']} tickFormatter={(tick) => `$${tick}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="balance" stroke="#4F46E5" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} name="Balance" />
                </LineChart>
            </ResponsiveContainer>
            )}
        </div>
    );
};

export default ProgressChart;
