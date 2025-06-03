import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTicTacToe, type Player } from '../hooks/useTicTacToe';
import { cn } from '../utils/utils';

export function TicTacToe() {
  const { connected } = useWallet();
  const {
    board,
    currentPlayer,
    gameStatus,
    isLoading,
    makeMove,
    resetGame,
    winner,
    isConnected,
    gameId
  } = useTicTacToe();

  const getPlayerSymbol = (player: Player) => {
    if (player === 1) return 'X';
    if (player === 2) return 'O';
    return '';
  };

  const getPlayerName = (player: Player) => {
    if (player === 1) return 'Player X';
    if (player === 2) return 'Player O';
    return '';
  };

  const getCellStyle = (player: Player, index: number) => {
    let baseStyle = "w-24 h-24 border-2 border-gray-300 flex items-center justify-center text-4xl font-bold cursor-pointer transition-all duration-200 hover:bg-gray-50";
    
    if (player === 1) {
      baseStyle += " text-blue-600";
    } else if (player === 2) {
      baseStyle += " text-red-600";
    }
    
    if (player === 0 && gameStatus === 'playing') {
      baseStyle += " hover:bg-blue-50";
    } else if (player !== 0) {
      baseStyle += " cursor-not-allowed";
    }
    
    return baseStyle;
  };

  const getStatusMessage = () => {
    if (!connected) return "Connect your Phantom wallet to play";
    if (gameStatus === 'waiting') return "Loading game...";
    if (gameStatus === 'won' && winner) return `🎉 ${getPlayerName(winner)} wins!`;
    if (gameStatus === 'draw') return "It's a draw! 🤝";
    if (gameStatus === 'playing') return `Current turn: ${getPlayerName(currentPlayer)}`;
    return "";
  };

  const getStatusColor = () => {
    if (!connected) return "text-gray-600";
    if (gameStatus === 'won') return "text-green-600";
    if (gameStatus === 'draw') return "text-yellow-600";
    if (currentPlayer === 1) return "text-blue-600";
    return "text-red-600";
  };

  const copyGameUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Tic Tac Toe
          </h1>
          <p className="text-gray-600 mb-4">
            On-chain gaming with Solana
          </p>
          
          {/* Game ID Display */}
          {gameId && (
            <div className="mb-4 p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Game ID:</p>
              <p className="text-sm font-mono text-gray-800 break-all">{gameId}</p>
              <button 
                onClick={copyGameUrl}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                📋 Copy game URL
              </button>
            </div>
          )}
          
          {/* Wallet Connection */}
          <div className="mb-6">
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
          </div>
          
          {/* Status */}
          <div className={cn("text-lg font-semibold", getStatusColor())}>
            {getStatusMessage()}
          </div>
        </div>

        {/* Game Board */}
        {connected && (
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2 mx-auto w-fit">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => makeMove(index)}
                  disabled={cell !== 0 || gameStatus !== 'playing' || isLoading}
                  className={getCellStyle(cell, index)}
                >
                  {getPlayerSymbol(cell)}
                </button>
              ))}
            </div>
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">Processing on blockchain...</span>
              </div>
            )}
          </div>
        )}

        {/* Game Controls */}
        {connected && (gameStatus === 'won' || gameStatus === 'draw') && (
          <div className="text-center">
            <button
              onClick={resetGame}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              New Game
            </button>
          </div>
        )}

        {/* Game Info */}
        {connected && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Game state is stored on Solana blockchain</p>
            <p>Each move requires ONE transaction signature</p>
            <p className="text-xs mt-1 text-gray-400">
              Share the URL to continue this game later!
            </p>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-8 max-w-md text-center text-gray-600 text-sm">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Each game gets a unique ID stored in the URL</li>
          <li>First move on a cell = <strong>Initialize</strong> + <strong>Set</strong> (1 signature)</li>
          <li>Subsequent moves on other cells = <strong>Initialize</strong> + <strong>Set</strong> (1 signature)</li>
          <li>Moves on initialized cells = <strong>Set</strong> only (1 signature)</li>
          <li>Loading game = <strong>Get</strong> all positions (no signature)</li>
        </ol>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
          <h4 className="font-semibold text-blue-800 mb-1">Smart Optimization:</h4>
          <p className="text-blue-700">
            Each board position is initialized only once per game. 
            Subsequent moves only update the value, reducing transaction costs!
          </p>
        </div>
      </div>
    </div>
  );
} 