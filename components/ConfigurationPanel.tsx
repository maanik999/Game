
import React from 'react';
import { Config } from '../types';
import { SettingsIcon } from './icons';

interface ConfigInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    step?: number;
    isSimulating: boolean;
    tooltip: string;
}

const ConfigInput: React.FC<ConfigInputProps> = ({ label, value, onChange, step = 1, isSimulating, tooltip }) => (
    <div className="relative group">
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            step={step}
            disabled={isSimulating}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute left-0 bottom-full mb-2 w-max max-w-xs hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 border border-gray-600 shadow-lg">
            {tooltip}
        </div>
    </div>
);


interface ConfigurationPanelProps {
    config: Config;
    setConfig: (config: Config) => void;
    isSimulating: boolean;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config, setConfig, isSimulating }) => {
    const handleConfigChange = <K extends keyof Config,>(key: K, value: Config[K]) => {
        setConfig({ ...config, [key]: value });
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center"><SettingsIcon /> <span className="ml-2">Strategy Configuration</span></h2>
            <div className="grid grid-cols-2 gap-4">
                <ConfigInput label="Initial Balance" value={config.initialBalance} onChange={(v) => handleConfigChange('initialBalance', v)} isSimulating={isSimulating} tooltip="Starting balance for the simulation." />
                <ConfigInput label="Base Bet" value={config.baseBet} onChange={(v) => handleConfigChange('baseBet', v)} isSimulating={isSimulating} tooltip="The bet amount after a win or at the start." />
                <ConfigInput label="Bet Increment" value={config.betIncrement} onChange={(v) => handleConfigChange('betIncrement', v)} isSimulating={isSimulating} tooltip="Amount to increase the bet on each loss." />
                <ConfigInput label="Max Loss Streak" value={config.maxStreak} onChange={(v) => handleConfigChange('maxStreak', v)} isSimulating={isSimulating} tooltip="Stop increasing bet amount after this many losses." />
                <ConfigInput label="Round Block" value={config.roundBlock} onChange={(v) => handleConfigChange('roundBlock', v)} isSimulating={isSimulating} tooltip="Number of loss rounds before increasing cashout multiplier." />
                <ConfigInput label="Base Cashout" value={config.baseCashout} onChange={(v) => handleConfigChange('baseCashout', v)} step={0.1} isSimulating={isSimulating} tooltip="Initial cashout multiplier target." />
                <ConfigInput label="Cashout Increment" value={config.cashoutIncrement} onChange={(v) => handleConfigChange('cashoutIncrement', v)} step={0.1} isSimulating={isSimulating} tooltip="Multiplier increase after each round block during a loss streak." />
                <ConfigInput label="Post-Max Increment" value={config.multiplierIncrementAfterMax} onChange={(v) => handleConfigChange('multiplierIncrementAfterMax', v)} step={0.01} isSimulating={isSimulating} tooltip="Multiplier increase per loss after max streak is reached." />
                <ConfigInput label="Simulation Speed (ms)" value={config.simulationSpeed} onChange={(v) => handleConfigChange('simulationSpeed', v)} step={50} isSimulating={isSimulating} tooltip="Delay between each simulated round in milliseconds." />
            </div>
        </div>
    );
};

export default ConfigurationPanel;
