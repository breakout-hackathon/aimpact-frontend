import { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import idl from '../solana/idl.json';

// Make Buffer available globally for Solana libraries
window.Buffer = Buffer;

// Game state types
export type Player = 0 | 1 | 2; // 0 = empty, 1 = X, 2 = O
export type Board = Player[];
export type GameStatus = 'waiting' | 'playing' | 'won' | 'draw';

const PROGRAM_ID = new PublicKey(idl.address);
const GAME_DOMAIN = new BN(1); // Domain for our tic-tac-toe game

export function useTicTacToe() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [board, setBoard] = useState<Board>(Array(9).fill(0));
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
  const [isLoading, setIsLoading] = useState(false);

  const getProvider = useCallback(() => {
    if (!wallet.wallet || !wallet.publicKey) return null;
    return new AnchorProvider(connection, wallet as any, {});
  }, [connection, wallet]);

  const getProgram = useCallback(() => {
    const provider = getProvider();
    if (!provider) return null;
    return new Program(idl as any, provider);
  }, [getProvider]);

  // Get PDA for a specific board position
  const getPDA = useCallback((position: number) => {
    const [pda] = PublicKey.findProgramAddressSync(
      [
        GAME_DOMAIN.toArrayLike(Buffer, 'le', 8),
        new BN(position).toArrayLike(Buffer, 'le', 8)
      ],
      PROGRAM_ID
    );
    return pda;
  }, []);

  // Initialize a board position
  const initializePosition = useCallback(async (position: number) => {
    const program = getProgram();
    if (!program || !wallet.publicKey) return false;

    try {
      const pda = getPDA(position);
      
      await program.methods
        .initialize(GAME_DOMAIN, new BN(position))
        .accounts({
          val: pda,
          signer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return true;
    } catch (error) {
      console.error('Failed to initialize position:', error);
      return false;
    }
  }, [getProgram, getPDA, wallet.publicKey]);

  // Set a value at a specific position
  const setPosition = useCallback(async (position: number, player: 1 | 2) => {
    const program = getProgram();
    if (!program || !wallet.publicKey) return false;

    try {
      const pda = getPDA(position);
      
      await program.methods
        .set(GAME_DOMAIN, new BN(position), new BN(player))
        .accounts({
          val: pda,
        })
        .rpc();

      return true;
    } catch (error) {
      console.error('Failed to set position:', error);
      return false;
    }
  }, [getProgram, getPDA, wallet.publicKey]);

  // Get value at a specific position
  const getPosition = useCallback(async (position: number): Promise<Player> => {
    const program = getProgram();
    if (!program) return 0;

    try {
      const result = await program.methods
        .get(GAME_DOMAIN, new BN(position))
        .accounts({
          val: getPDA(position),
        })
        .view();

      return result.toNumber() as Player;
    } catch (error) {
      // Position not initialized yet
      return 0;
    }
  }, [getProgram, getPDA]);

  // Load the current board state from blockchain
  const loadBoard = useCallback(async () => {
    setIsLoading(true);
    try {
      const newBoard: Board = [];
      for (let i = 0; i < 9; i++) {
        const value = await getPosition(i);
        newBoard[i] = value;
      }
      setBoard(newBoard);
      
      // Check game status
      const winner = checkWinner(newBoard);
      if (winner) {
        setGameStatus('won');
      } else if (newBoard.every(cell => cell !== 0)) {
        setGameStatus('draw');
      } else {
        setGameStatus('playing');
      }
    } catch (error) {
      console.error('Failed to load board:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getPosition]);

  // Make a move
  const makeMove = useCallback(async (position: number) => {
    if (board[position] !== 0 || gameStatus !== 'playing' || isLoading) return;

    setIsLoading(true);
    try {
      // First try to initialize the position (in case it's the first move)
      await initializePosition(position);
      
      // Then set the value
      const success = await setPosition(position, currentPlayer);
      
      if (success) {
        // Update local state immediately for better UX
        const newBoard = [...board];
        newBoard[position] = currentPlayer;
        setBoard(newBoard);
        
        // Check for winner
        const winner = checkWinner(newBoard);
        if (winner) {
          setGameStatus('won');
        } else if (newBoard.every(cell => cell !== 0)) {
          setGameStatus('draw');
        } else {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
        
        // Reload from blockchain to ensure consistency
        setTimeout(() => loadBoard(), 1000);
      }
    } catch (error) {
      console.error('Failed to make move:', error);
    } finally {
      setIsLoading(false);
    }
  }, [board, currentPlayer, gameStatus, isLoading, initializePosition, setPosition, loadBoard]);

  // Check for winner
  const checkWinner = (board: Board): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return 0;
  };

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(0));
    setCurrentPlayer(1);
    setGameStatus('waiting');
  }, []);

  // Start new game
  const startGame = useCallback(async () => {
    if (!wallet.connected) return;
    setGameStatus('playing');
    await loadBoard();
  }, [wallet.connected, loadBoard]);

  // Effect to start game when wallet connects
  useEffect(() => {
    if (wallet.connected && gameStatus === 'waiting') {
      startGame();
    }
  }, [wallet.connected, gameStatus, startGame]);

  return {
    board,
    currentPlayer,
    gameStatus,
    isLoading,
    makeMove,
    resetGame,
    startGame,
    loadBoard,
    isConnected: wallet.connected,
    winner: gameStatus === 'won' ? checkWinner(board) : null
  };
} 