
import React from 'react';
import { SimulationState, HistoryEntry } from '../types';
import { BalanceIcon, BetIcon, CashoutIcon, StreakIcon, ProfitIcon, WinRateIcon } from './icons';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass }) => (
    <div className={`bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center shadow`}>
        <div className={`p-3 rounded-md mr-4 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

interface StateDisplayProps {
    state: SimulationState;
    history: HistoryEntry[];
}

const StateDisplay: React.FC<StateDisplayProps> = ({ state, history }) => {
    const totalProfit = history.length > 0 ? state.balance - history[0].balance + history[0].profit + history[0].bet : 0;
    const wins = history.filter(h => h.result === 'win').length;
    const winRate = history.length > 0 ? ((wins / history.length) * 100).toFixed(1) + '%' : 'N/A';

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={<BalanceIcon />} label="Current Balance" value={`$${state.balance.toFixed(2)}`} colorClass="bg-blue-500/20" />
            <StatCard icon={<BetIcon />} label="Next Bet" value={`$${state.currentBet.toFixed(2)}`} colorClass="bg-purple-500/20" />
            <StatCard icon={<CashoutIcon />} label="Next Cashout" value={`${state.currentCashout.toFixed(2)}x`} colorClass="bg-teal-500/20" />
            <StatCard icon={<StreakIcon />} label="Loss Streak" value={state.lossStreak} colorClass="bg-orange-500/20" />
            <StatCard icon={<ProfitIcon />} label="Total Profit" value={`$${totalProfit.toFixed(2)}`} colorClass={totalProfit >= 0 ? "bg-green-500/20" : "bg-red-500/20"} />
            <StatCard icon={<WinRateIcon />} label="Win Rate" value={winRate} colorClass="bg-indigo-500/20" />
        </div>
    );
};

export default StateDisplay;
