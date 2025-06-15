
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PlayerNameInput from './components/PlayerNameInput';
import MatchupSelector from './components/MatchupSelector';
import PredictionDisplay from './components/PredictionDisplay';
import { NUM_OTHER_PLAYERS, TOTAL_ROUNDS_DISPLAYED, CYCLE_LENGTH } from './constants';

const App: React.FC = () => {
  const [player1Name, setPlayer1Name] = useState<string>('');
  const [otherPlayerNames, setOtherPlayerNames] = useState<string[]>(Array(NUM_OTHER_PLAYERS).fill(''));

  const [r1Opponent, setR1Opponent] = useState<string>('');
  const [r2Opponent, setR2Opponent] = useState<string>('');
  const [r3OpponentDerived, setR3OpponentDerived] = useState<string>(''); 
  const [r4Opponent, setR4Opponent] = useState<string>('');
  const [r5OpponentDerived, setR5OpponentDerived] = useState<string>(''); 
  const [r6OpponentDerived, setR6OpponentDerived] = useState<string>(''); 

  const [predictionsForP1, setPredictionsForP1] = useState<string[]>(Array(TOTAL_ROUNDS_DISPLAYED).fill('?'));

  const handleOtherPlayerNameChange = (index: number, name: string) => {
    const newNames = [...otherPlayerNames];
    newNames[index] = name;
    setOtherPlayerNames(newNames);
  };

  const allAvailablePlayerNames = useMemo(() => {
    return [player1Name, ...otherPlayerNames].filter(name => name && name.trim() !== '').reduce((acc, name) => {
      if (!acc.includes(name)) acc.push(name); 
      return acc;
    }, [] as string[]);
  }, [player1Name, otherPlayerNames]);

  const p1OpponentOptions = useMemo(() => {
    return otherPlayerNames.filter(name => name && name.trim() !== '');
  }, [otherPlayerNames]);

  const getFilteredOptions = useCallback((excludePlayerName?: string) => {
    if (!excludePlayerName) return allAvailablePlayerNames;
    return allAvailablePlayerNames.filter(name => name !== excludePlayerName);
  }, [allAvailablePlayerNames]);
  
  useEffect(() => {
    if (r1Opponent && !p1OpponentOptions.includes(r1Opponent)) setR1Opponent('');
  }, [r1Opponent, p1OpponentOptions]);
  useEffect(() => {
    if (r2Opponent && !p1OpponentOptions.includes(r2Opponent)) setR2Opponent('');
  }, [r2Opponent, p1OpponentOptions]);
  useEffect(() => {
    if (r4Opponent && !p1OpponentOptions.includes(r4Opponent)) setR4Opponent('');
  }, [r4Opponent, p1OpponentOptions]);

  useEffect(() => {
    const options = getFilteredOptions(r1Opponent);
    if (r3OpponentDerived && r1Opponent && !options.includes(r3OpponentDerived)) {
      setR3OpponentDerived('');
    } else if (r3OpponentDerived && !r1Opponent) { 
      setR3OpponentDerived('');
    }
  }, [r3OpponentDerived, r1Opponent, getFilteredOptions]);

  useEffect(() => {
    const options = getFilteredOptions(r1Opponent);
    if (r5OpponentDerived && r1Opponent && !options.includes(r5OpponentDerived)) {
      setR5OpponentDerived('');
    } else if (r5OpponentDerived && !r1Opponent) {
      setR5OpponentDerived('');
    }
  }, [r5OpponentDerived, r1Opponent, getFilteredOptions]);
  
  const p1sR3OpponentActual = r3OpponentDerived;
  useEffect(() => {
    const options = getFilteredOptions(p1sR3OpponentActual);
    if (r6OpponentDerived && p1sR3OpponentActual && !options.includes(r6OpponentDerived)) {
       setR6OpponentDerived('');
    } else if (r6OpponentDerived && !p1sR3OpponentActual) {
       setR6OpponentDerived('');
    }
  }, [r6OpponentDerived, p1sR3OpponentActual, getFilteredOptions]);


  useEffect(() => {
    let calculatedR7Opponent = '?';
    const filledOtherPlayerNames = otherPlayerNames.filter(name => name && name.trim() !== '');
    
    const p1OpponentsR1ToR6 = [
        r1Opponent, r2Opponent, r3OpponentDerived, 
        r4Opponent, r5OpponentDerived, r6OpponentDerived
    ].filter(name => name && name.trim() !== '');

    if (filledOtherPlayerNames.length === NUM_OTHER_PLAYERS && new Set(filledOtherPlayerNames).size === NUM_OTHER_PLAYERS) {
        const uniqueP1OpponentsR1ToR6 = [...new Set(p1OpponentsR1ToR6)];
        if (uniqueP1OpponentsR1ToR6.length === 6) { 
            const allR1ToR6AreValidOpponentsInList = uniqueP1OpponentsR1ToR6.every(op => filledOtherPlayerNames.includes(op));
            if (allR1ToR6AreValidOpponentsInList) {
                const remainingPlayers = filledOtherPlayerNames.filter(
                    name => !uniqueP1OpponentsR1ToR6.includes(name)
                );
                if (remainingPlayers.length === 1) {
                    calculatedR7Opponent = remainingPlayers[0];
                }
            }
        }
    }

    const cycle1Opponents = [
      r1Opponent,
      r2Opponent,
      r3OpponentDerived,
      r4Opponent,
      r5OpponentDerived,
      r6OpponentDerived,
      calculatedR7Opponent, 
    ];

    const newPredictions = Array(TOTAL_ROUNDS_DISPLAYED).fill('?');
    for (let i = 0; i < CYCLE_LENGTH; i++) {
      const opponentName = cycle1Opponents[i] || '?';

      if (i < TOTAL_ROUNDS_DISPLAYED) {
        newPredictions[i] = opponentName; 
      }
      if (i + CYCLE_LENGTH < TOTAL_ROUNDS_DISPLAYED) {
        newPredictions[i + CYCLE_LENGTH] = opponentName; 
      }
      if (i + 2 * CYCLE_LENGTH < TOTAL_ROUNDS_DISPLAYED) {
         newPredictions[i + 2 * CYCLE_LENGTH] = opponentName;
      }
    }
    setPredictionsForP1(newPredictions);
  }, [
    r1Opponent, r2Opponent, r3OpponentDerived, r4Opponent,
    r5OpponentDerived, r6OpponentDerived, otherPlayerNames
  ]);

  const resetAllInputs = () => {
    setPlayer1Name('');
    setOtherPlayerNames(Array(NUM_OTHER_PLAYERS).fill(''));
    setR1Opponent('');
    setR2Opponent('');
    setR3OpponentDerived('');
    setR4Opponent('');
    setR5OpponentDerived('');
    setR6OpponentDerived('');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-[#22DFBF]">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#22DFBF]">
          Magic Chess GoGo Matchup Counter
        </h1>
        <div className="mt-4">
          <p className="text-[#22DFBF] text-lg md:text-xl">BY FML Playaz</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-[#001301] p-6 rounded-xl shadow-2xl border border-[#22DFBF]/30">
          <h2 className="text-2xl font-bold text-[#22DFBF] mb-6">Player Information</h2>
          <PlayerNameInput
            id="player1Name"
            label="Your Name (Player 1)"
            value={player1Name}
            onChange={setPlayer1Name}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {otherPlayerNames.map((name, index) => (
              <PlayerNameInput
                key={`otherPlayer-${index}`}
                id={`otherPlayer-${index}`}
                label={`Other Player ${index + 2} Name`}
                value={name}
                onChange={(val) => handleOtherPlayerNameChange(index, val)}
              />
            ))}
          </div>

          <h2 className="text-2xl font-bold text-[#22DFBF] mt-8 mb-6">Matchup History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <MatchupSelector
              id="p1r1vs"
              label={<>Who will <strong>you ({player1Name || 'P1'})</strong> fight in R1?</>}
              value={r1Opponent}
              onChange={setR1Opponent}
              options={p1OpponentOptions}
              disabled={!player1Name || p1OpponentOptions.length === 0}
              placeholder="Select R1 Opponent"
            />
            <MatchupSelector
              id="p1r2vs"
              label={<>Who will <strong>you ({player1Name || 'P1'})</strong> fight in R2?</>}
              value={r2Opponent}
              onChange={setR2Opponent}
              options={p1OpponentOptions}
              disabled={!player1Name || p1OpponentOptions.length === 0}
              placeholder="Select R2 Opponent"
            />
            <MatchupSelector
              id="p1r1opp_r2vs"
              label={<>Who did <strong>{r1Opponent || 'Your R1 Opp.'}</strong> fight in R2? (Determines P1's R3)</>}
              value={r3OpponentDerived}
              onChange={setR3OpponentDerived}
              options={getFilteredOptions(r1Opponent)}
              disabled={!r1Opponent || getFilteredOptions(r1Opponent).length === 0}
              placeholder="Select their R2 Opponent"
            />
            <MatchupSelector
              id="p1r4vs"
              label={<>Who will <strong>you ({player1Name || 'P1'})</strong> fight in R4?</>}
              value={r4Opponent}
              onChange={setR4Opponent}
              options={p1OpponentOptions}
              disabled={!player1Name || p1OpponentOptions.length === 0}
              placeholder="Select R4 Opponent"
            />
            <MatchupSelector
              id="p1r1opp_r4vs"
              label={<>Who did <strong>{r1Opponent || 'Your R1 Opp.'}</strong> fight in R4? (Determines P1's R5)</>}
              value={r5OpponentDerived}
              onChange={setR5OpponentDerived}
              options={getFilteredOptions(r1Opponent)}
              disabled={!r1Opponent || getFilteredOptions(r1Opponent).length === 0}
              placeholder="Select their R4 Opponent"
            />
            <MatchupSelector
              id="p1r3opp_r5vs"
              label={<>Who did <strong>{p1sR3OpponentActual || 'Your R3 Opp.'}</strong> fight in R5? (Determines P1's R6)</>}
              value={r6OpponentDerived}
              onChange={setR6OpponentDerived}
              options={getFilteredOptions(p1sR3OpponentActual)}
              disabled={!p1sR3OpponentActual || getFilteredOptions(p1sR3OpponentActual).length === 0}
              placeholder="Select their R5 Opponent"
            />
          </div>
          <button
            onClick={resetAllInputs}
            className="w-full mt-8 bg-[#22DFBF] hover:bg-[#1ABEA9] text-[#000000] font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22DFBF] focus:ring-opacity-75"
          >
            Reset All Inputs
          </button>
        </div>
        
        <div className="lg:col-span-1 lg:sticky lg:top-8">
          <PredictionDisplay player1Name={player1Name} predictions={predictionsForP1} />
        </div>
      </div>

      <footer className="text-center text-[#22DFBF]/70 mt-12 pb-8">
        <p>© 2025 Magic Chess: GoGo Matchup Counter by GroovGRV (FML PLAYAZ). For entertainment purposes only.</p>
      </footer>
    </div>
  );
};

export default App;