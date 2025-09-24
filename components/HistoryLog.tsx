
import React, { useRef, useEffect } from 'react';
import { HistoryEntry } from '../types';
import { HistoryIcon } from './icons';

interface HistoryLogProps {
    data: HistoryEntry[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ data }) => {
    const tableContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
        }
    }, [data]);

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center"><HistoryIcon /><span className="ml-2">Round History</span></h2>
            <div ref={tableContainerRef} className="max-h-96 overflow-y-auto pr-2">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Round</th>
                            <th scope="col" className="px-4 py-3">Bet</th>
                            <th scope="col" className="px-4 py-3">Target</th>
                            <th scope="col" className="px-4 py-3">Result X</th>
                            <th scope="col" className="px-4 py-3">Profit</th>
                            <th scope="col" className="px-4 py-3">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry) => (
                            <tr key={entry.id} className={`border-b border-gray-700 ${entry.result === 'win' ? 'bg-green-600/10' : 'bg-red-600/10'}`}>
                                <td className="px-4 py-2 font-medium text-white">{entry.round}</td>
                                <td className="px-4 py-2">${entry.bet.toFixed(2)}</td>
                                <td className="px-4 py-2">{entry.cashoutTarget.toFixed(2)}x</td>
                                <td className={`px-4 py-2 font-bold ${entry.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                                    {entry.multiplier.toFixed(2)}x
                                </td>
                                <td className={`px-4 py-2 font-semibold ${entry.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {entry.profit >= 0 ? `+$${entry.profit.toFixed(2)}` : `-$${Math.abs(entry.profit).toFixed(2)}`}
                                </td>
                                <td className="px-4 py-2">${entry.balance.toFixed(2)}</td>
                            </tr>
                        ))}
                         {data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    No rounds simulated yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryLog;
