
export interface Config {
  initialBalance: number;
  baseBet: number;
  betIncrement: number;
  maxStreak: number;
  roundBlock: number;
  baseCashout: number;
  cashoutIncrement: number;
  multiplierIncrementAfterMax: number;
  simulationSpeed: number; // in ms
  liveSync: boolean;
  syncInterval: number; // in seconds
}

export interface SimulationState {
  currentBet: number;
  currentCashout: number;
  lossStreak: number;
  balance: number;
}

export interface HistoryEntry {
  id: number;
  round: number;
  bet: number;
  cashoutTarget: number;
  multiplier: number;
  result: 'win' | 'loss' | 'running';
  profit: number;
  balance: number;
  lossStreak: number;
}