
import React from 'react';
import { PlayIcon, StopIcon, ResetIcon } from './icons';

interface ControlsProps {
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    isSimulating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onStart, onStop, onReset, isSimulating }) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <button
                onClick={onStart}
                disabled={isSimulating}
                className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
            >
                <PlayIcon />
                <span className="ml-2">Start</span>
            </button>
            <button
                onClick={onStop}
                disabled={!isSimulating}
                className="flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400"
            >
                <StopIcon />
                <span className="ml-2">Stop</span>
            </button>
            <button
                onClick={onReset}
                disabled={isSimulating}
                className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
            >
                <ResetIcon />
                <span className="ml-2">Reset</span>
            </button>
        </div>
    );
};

export default Controls;
