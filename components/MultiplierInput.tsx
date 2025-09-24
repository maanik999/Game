
import React from 'react';
import { ListIcon, GoogleSheetIcon, LoadingIcon } from './icons';
import { Config } from '../types';

interface MultiplierInputProps {
    value: string;
    onChange: (value: string) => void;
    isSimulating: boolean;
    inputType: 'manual' | 'googleSheet';
    setInputType: (type: 'manual' | 'googleSheet') => void;
    sheetId: string;
    setSheetId: (id: string) => void;
    sheetRange: string;
    setSheetRange: (range: string) => void;
    onFetch: () => void;
    fetchStatus: {
        loading: boolean;
        message: string;
        error: boolean;
    };
    config: Config;
    setConfig: (config: Config) => void;
}

const MultiplierInput: React.FC<MultiplierInputProps> = ({ 
    value, onChange, isSimulating, 
    inputType, setInputType,
    sheetId, setSheetId,
    sheetRange, setSheetRange,
    onFetch, fetchStatus,
    config, setConfig
}) => {

    const TabButton: React.FC<{active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode}> = ({ active, onClick, children, icon }) => (
        <button
            onClick={onClick}
            disabled={isSimulating}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed ${
                active 
                ? 'bg-gray-700/80 border-b-2 border-indigo-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
            }`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center"><ListIcon /><span className='ml-2'>Round Multipliers</span></h2>
            
            <div className="flex border-b border-gray-700 -mb-px">
                <TabButton active={inputType === 'manual'} onClick={() => setInputType('manual')} icon={<ListIcon />}>
                    Manual Input
                </TabButton>
                <TabButton active={inputType === 'googleSheet'} onClick={() => setInputType('googleSheet')} icon={<GoogleSheetIcon />}>
                    Google Sheets
                </TabButton>
            </div>
            
            <div className='bg-gray-700/30 p-4 rounded-b-lg'>
                {inputType === 'googleSheet' && (
                    <div className="mb-4 space-y-4">
                        <div>
                            <label htmlFor="sheetId" className="block text-sm font-medium text-gray-400">Spreadsheet ID</label>
                            <input
                                type="text"
                                id="sheetId"
                                value={sheetId}
                                onChange={(e) => setSheetId(e.target.value)}
                                disabled={isSimulating}
                                placeholder="e.g. 1BxiMVs0XRA5nFMd..."
                                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="sheetRange" className="block text-sm font-medium text-gray-400">Sheet Name & Range</label>
                            <input
                                type="text"
                                id="sheetRange"
                                value={sheetRange}
                                onChange={(e) => setSheetRange(e.target.value)}
                                disabled={isSimulating}
                                placeholder="e.g. Sheet1!A1:A100"
                                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                            />
                        </div>
                        <p className="text-xs text-gray-500 !mt-2">
                            Note: Your Google Sheet must be public ("Anyone with the link can view").
                        </p>
                        <button
                            onClick={onFetch}
                            disabled={isSimulating || fetchStatus.loading}
                            className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        >
                            {fetchStatus.loading && !config.liveSync ? <LoadingIcon /> : 'Fetch Multipliers'}
                        </button>
                        
                        <div className="pt-4 border-t border-gray-600/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <label htmlFor="liveSync" className="font-medium text-gray-300">
                                    Enable Live Sync
                                    <span className="block text-xs text-gray-500 font-normal">Auto-fetch new data while simulating.</span>
                                </label>
                                 <input
                                    id="liveSync"
                                    type="checkbox"
                                    checked={config.liveSync}
                                    onChange={(e) => setConfig({ ...config, liveSync: e.target.checked })}
                                    disabled={isSimulating}
                                    className="h-5 w-5 rounded border-gray-500 bg-gray-800 text-indigo-500 focus:ring-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            {config.liveSync && (
                                <div>
                                    <label htmlFor="syncInterval" className="block text-sm font-medium text-gray-400">Sync Interval (seconds)</label>
                                    <input
                                        type="number"
                                        id="syncInterval"
                                        value={config.syncInterval}
                                        onChange={(e) => setConfig({ ...config, syncInterval: parseInt(e.target.value, 10) || 30 })}
                                        disabled={isSimulating}
                                        min="5"
                                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                                    />
                                </div>
                            )}
                        </div>

                        {fetchStatus.message && (
                            <p className={`text-sm text-center !mt-3 ${fetchStatus.error ? 'text-red-400' : 'text-green-400'}`}>
                                {fetchStatus.message}
                            </p>
                        )}
                    </div>
                )}
                
                <p className="text-sm text-gray-400 mb-3">
                    {inputType === 'manual'
                        ? "Enter one crash multiplier per line. The simulation will run through them in order."
                        : "Data from Google Sheets will appear below. Switch to 'Manual Input' to edit."
                    }
                </p>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isSimulating || inputType === 'googleSheet'}
                    rows={10}
                    className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                    placeholder="e.g.&#10;1.23&#10;2.5&#10;10.1&#10;1.01"
                />
            </div>
        </div>
    );
};

export default MultiplierInput;