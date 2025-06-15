import React from 'react';
import { TOTAL_ROUNDS_DISPLAYED } from '../constants';

interface PredictionDisplayProps {
  player1Name: string;
  predictions: string[];
}

const roundToStageMapping: { [key: number]: string } = {
  1: "Stage 1-2",
  2: "Stage 1-3",
  3: "Stage 1-4 (before Fatebox 1)",
  4: "Stage 2-1 (after Fatebox 1)",
  5: "Stage 2-2",
  6: "Stage 2-4 (after Monster round)",
  7: "Stage 2-5",
  8: "Stage 2-6 (before Fatebox 2)",
  9: "Stage 3-1 (after Fatebox 2)",
  10: "Stage 3-2",
  11: "Stage 3-4 (after Monster 2)",
  12: "Stage 3-5",
  13: "Stage 3-6 (before Fatebox 3)",
  14: "Stage 4-1",
  15: "Stage 4-2",
  16: "Stage 4-4 (after Monster 3)",
  17: "Stage 4-5",
  18: "Stage 4-6 (before Fatebox 4)",
  19: "Stage 5-1 (after Fatebox 4)",
  20: "Stage 5-2",
};

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ player1Name, predictions }) => {
  if (predictions.every(p => p === '' || p === '?')) {
    return (
      <div className="bg-[#001301] p-6 rounded-xl shadow-2xl mt-8 lg:mt-0 border border-[#22DFBF]/30">
        <h2 className="text-2xl font-bold text-[#22DFBF] mb-4 flex items-center">
          <span role="img" aria-label="brain" className="mr-2 text-3xl">🧠</span>
          Matchups for {player1Name || 'Player 1'}
        </h2>
        <p className="text-[#22DFBF]/80">Enter player names and matchup information to see matchups.</p>
      </div>
    );
  }

  const renderRound = (originalRoundNumber: number, opponent: string) => {
    const stageLabel = roundToStageMapping[originalRoundNumber] || `Round ${originalRoundNumber}`;
    return (
      <li key={`round-${originalRoundNumber}`} className="py-2.5 px-3 bg-[#000000] rounded-md flex justify-between items-center text-sm">
        <span className="font-semibold text-[#22DFBF]">{stageLabel}</span>
        <span className="text-[#22DFBF]">vs {opponent || '?'}</span>
      </li>
    );
  };

  return (
    <div className="bg-[#001301] p-6 rounded-xl shadow-2xl mt-8 lg:mt-0 border border-[#22DFBF]/30">
      <h2 className="text-2xl font-bold text-[#22DFBF] mb-6 flex items-center">
        <span role="img" aria-label="brain" className="mr-2 text-3xl">🧠</span>
        Matchups for {player1Name || 'Player 1'}
      </h2>
      
      <div>
        <ul className="space-y-1.5">
          {predictions.slice(0, TOTAL_ROUNDS_DISPLAYED).map((opponent, index) => {
             const currentRoundNumber = index + 1;
             return renderRound(currentRoundNumber, opponent);
          })}
        </ul>
      </div>
    </div>
  );
};

export default PredictionDisplay;