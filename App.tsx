import React, { useState, useEffect, useCallback } from 'react';
import { Config, SimulationState, HistoryEntry } from './types';
import ConfigurationPanel from './components/ConfigurationPanel';
import MultiplierInput from './components/MultiplierInput';
import Controls from './components/Controls';
import StateDisplay from './components/StateDisplay';
import ProgressChart from './components/ProgressChart';
import HistoryLog from './components/HistoryLog';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
    const [config, setConfig] = useState<Config>({
        initialBalance: 1000,
        baseBet: 10,
        betIncrement: 1,
        maxStreak: 30,
        roundBlock: 5,
        baseCashout: 1.3,
        cashoutIncrement: 0.2,
        multiplierIncrementAfterMax: 0.05,
        simulationSpeed: 500,
        liveSync: false,
        syncInterval: 30,
    });

    const [rawMultipliers, setRawMultipliers] = useState('1.5\n2.1\n1.0\n5.5\n1.2\n1.3\n1.0\n1.1\n1.0\n2.5\n1.8\n1.0\n1.0\n4.0');
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [simulationState, setSimulationState] = useState<SimulationState>({
        balance: config.initialBalance,
        currentBet: config.baseBet,
        currentCashout: config.baseCashout,
        lossStreak: 0,
    });

    const [isSimulating, setIsSimulating] = useState(false);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [multipliers, setMultipliers] = useState<number[]>([]);

    const [inputType, setInputType] = useState<'manual' | 'googleSheet'>('googleSheet');
    const [sheetId, setSheetId] = useState('14XqgVr8fthTGhxVZLqsreA3sunASY1Ru32KaQhnsE7s');
    const [sheetRange, setSheetRange] = useState('Sheet1!b1:b10000');
    const [fetchStatus, setFetchStatus] = useState<{loading: boolean; message: string; error: boolean}>({ loading: false, message: '', error: false });


    const resetSimulation = useCallback(() => {
        setIsSimulating(false);
        setHistory([]);
        setCurrentRoundIndex(0);
        setSimulationState({
            balance: config.initialBalance,
            currentBet: config.baseBet,
            currentCashout: config.baseCashout,
            lossStreak: 0,
        });
    }, [config]);

    useEffect(() => {
        resetSimulation();
    }, [config.initialBalance, config.baseBet, config.baseCashout, resetSimulation]);
    
    const handleFetchFromSheet = useCallback(async (isAutoSync = false) => {
        if (!sheetId || !sheetRange) {
            setFetchStatus({ loading: false, message: 'Spreadsheet ID and Range are required.', error: true });
            return;
        }
        setFetchStatus({ loading: true, message: isAutoSync ? 'Syncing...' : 'Fetching data from Google Sheets...', error: false });

        const rangeRegex = /'?(.*?)'?!([A-Z]+\d*:[A-Z]+\d*)/i;
        const match = sheetRange.match(rangeRegex);

        if (!match) {
            setFetchStatus({ loading: false, message: 'Invalid Sheet Name & Range format. Use "Sheet1!A1:B10".', error: true });
            return;
        }

        const sheetName = encodeURIComponent(match[1]);
        const range = encodeURIComponent(match[2]);

        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}&range=${range}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
           }
           const csvText = await response.text();

            if (csvText.includes('google.visualization.Query.setResponse')) {
                const errorMatch = csvText.match(/"errors":\[{"detailed_message":"(.*?)"/);
                if (errorMatch && errorMatch[1]) {
                    throw new Error(errorMatch[1]);
                }
                throw new Error("Invalid response from Google Sheets. Ensure sheet is public.");
            }
           
           const values = csvText.split('\n')
               .map(line => line.trim())
               .filter(line => line.length > 0)
               .map(line => line.startsWith('"') && line.endsWith('"') ? line.slice(1, -1) : line);

           if (values && values.length > 0) {
               const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));

               if (numericValues.length === 0) {
                   setFetchStatus({ loading: false, message: 'No valid numeric data found in the specified range.', error: true });
                   return;
               }

               setRawMultipliers(numericValues.join('\n'));
               setMultipliers(numericValues);

               const message = isAutoSync 
                ? `Synced ${numericValues.length} multipliers at ${new Date().toLocaleTimeString()}.`
                : `Successfully fetched ${numericValues.length} multipliers.`;
               setFetchStatus({ loading: false, message, error: false });
           } else {
               setRawMultipliers('');
               setMultipliers([]);
               setFetchStatus({ loading: false, message: 'No data found in the specified range.', error: false });
           }
       } catch (error: any) {
           setFetchStatus({ loading: false, message: `Failed to fetch data. Ensure the sheet is public ("Anyone with the link can view"). Error: ${error.message}`, error: true });
       }
    }, [sheetId, sheetRange]);

    useEffect(() => {
        if (inputType === 'googleSheet' && config.liveSync) {
            handleFetchFromSheet(true);
            const intervalId = setInterval(() => {
                handleFetchFromSheet(true);
            }, config.syncInterval * 1000);

            return () => clearInterval(intervalId);
        }
    }, [inputType, config.liveSync, config.syncInterval, handleFetchFromSheet]);

    const handleStart = () => {
        const parsedMultipliers = rawMultipliers
            .split('\n')
            .map(m => parseFloat(m))
            .filter(m => !isNaN(m) && m > 0);
        
        if (parsedMultipliers.length === 0) {
            alert("Please provide valid multipliers.");
            return;
        }

        setMultipliers(parsedMultipliers);
        if (history.length > 0 && currentRoundIndex > 0) {
             // continue simulation from where it stopped
        } else {
            const freshState = {
                balance: config.initialBalance,
                currentBet: config.baseBet,
                currentCashout: config.baseCashout,
                lossStreak: 0,
            };
            setHistory([]);
            setCurrentRoundIndex(0);
            setSimulationState(freshState);
        }
        setIsSimulating(true);
    };

    const handleStop = () => {
        setIsSimulating(false);
    };

    useEffect(() => {
        if (!isSimulating) {
            return;
        }

        if (currentRoundIndex >= multipliers.length) {
            return; // Pause simulation and wait for more multipliers
        }

        const timer = setTimeout(() => {
            const currentMultiplier = multipliers[currentRoundIndex];
            const { currentBet, currentCashout, balance, lossStreak } = simulationState;

            let result: 'win' | 'loss';
            let profit: number;

            if (currentMultiplier >= currentCashout) {
                result = 'win';
                profit = currentBet * currentCashout - currentBet;
            } else {
                result = 'loss';
                profit = -currentBet;
            }

            const newBalance = balance + profit;

            const newHistoryEntry: HistoryEntry = {
                id: currentRoundIndex,
                round: currentRoundIndex + 1,
                bet: currentBet,
                cashoutTarget: currentCashout,
                multiplier: currentMultiplier,
                result,
                profit,
                balance: newBalance,
                lossStreak: result === 'win' ? 0 : lossStreak + 1,
            };

            setHistory(prev => [...prev, newHistoryEntry]);

            let nextBet: number;
            let nextCashout: number;
            let nextLossStreak: number;

            if (result === 'win') {
                nextLossStreak = 0;
                nextBet = config.baseBet;
                nextCashout = config.baseCashout;
            } else {
                nextLossStreak = lossStreak + 1;
                if (nextLossStreak <= config.maxStreak) {
                    nextBet = currentBet + config.betIncrement;
                    const stage = Math.floor(nextLossStreak / config.roundBlock);
                    nextCashout = config.baseCashout + (stage * config.cashoutIncrement);
                } else {
                    nextBet = currentBet;
                    nextCashout = currentCashout + config.multiplierIncrementAfterMax;
                }
            }

            setSimulationState({
                balance: newBalance,
                currentBet: nextBet,
                currentCashout: parseFloat(nextCashout.toFixed(2)),
                lossStreak: nextLossStreak,
            });

            setCurrentRoundIndex(prev => prev + 1);

        }, config.simulationSpeed);

        return () => clearTimeout(timer);
    }, [isSimulating, currentRoundIndex, config, simulationState, multipliers]);
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center space-x-3 mb-8">
                    <LogoIcon />
                    <h1 className="text-3xl font-bold text-white tracking-tight">Crash Game Strategy Simulator</h1>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 flex flex-col space-y-8">
                        <ConfigurationPanel config={config} setConfig={setConfig} isSimulating={isSimulating} />
                        <MultiplierInput 
                            value={rawMultipliers} 
                            onChange={setRawMultipliers} 
                            isSimulating={isSimulating}
                            inputType={inputType}
                            setInputType={setInputType}
                            sheetId={sheetId}
                            setSheetId={setSheetId}
                            sheetRange={sheetRange}
                            setSheetRange={setSheetRange}
                            onFetch={() => handleFetchFromSheet(false)}
                            fetchStatus={fetchStatus}
                            config={config}
                            setConfig={setConfig}
                        />
                        <Controls onStart={handleStart} onStop={handleStop} onReset={resetSimulation} isSimulating={isSimulating} />
                    </div>

                    <div className="lg:col-span-2 flex flex-col space-y-8">
                        <StateDisplay state={simulationState} history={history} />
                        <ProgressChart data={history} />
                        <HistoryLog data={history} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;