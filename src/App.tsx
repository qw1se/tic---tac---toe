import { useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function calculateWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

export default function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [gameOver, setGameOver] = useState(false);

  const winResult = calculateWinner(board);
  const winner = winResult?.winner ?? null;
  const winningLine = winResult?.line ?? [];
  const isDraw = !winner && board.every((c) => c !== null);

  function handleClick(index: number) {
    if (board[index] || gameOver) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result) {
      setScores((p) => ({ ...p, [result.winner]: p[result.winner] + 1 }));
      setGameOver(true);
    } else if (newBoard.every((c) => c !== null)) {
      setScores((p) => ({ ...p, draw: p.draw + 1 }));
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(winner ?? (currentPlayer === "X" ? "O" : "X"));
    setGameOver(false);
  }

  function resetAll() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setScores({ X: 0, O: 0, draw: 0 });
    setGameOver(false);
  }

  let status = "";
  if (winner) status = `${winner} wins!`;
  else if (isDraw) status = "Draw";
  else status = `Turn: ${currentPlayer}`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-800">Tic-Tac-Toe</h1>

      {/* Score */}
      <div className="flex gap-8 text-center">
        <div>
          <div className="text-xs text-gray-400 uppercase mb-1">X</div>
          <div className="text-3xl font-bold text-gray-800">{scores.X}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase mb-1">Draw</div>
          <div className="text-3xl font-bold text-gray-800">{scores.draw}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase mb-1">O</div>
          <div className="text-3xl font-bold text-gray-800">{scores.O}</div>
        </div>
      </div>

      {/* Status */}
      <div className="text-base text-gray-500 h-6">{status}</div>

      {/* Board */}
      <div className="grid grid-cols-3 border border-gray-200" style={{ width: 300, height: 300 }}>
        {board.map((cell, i) => {
          const isWin = winningLine.includes(i);
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || gameOver}
              className={[
                "flex items-center justify-center text-4xl font-light select-none transition-colors duration-100",
                col < 2 ? "border-r border-gray-200" : "",
                row < 2 ? "border-b border-gray-200" : "",
                isWin ? "bg-gray-100" : "",
                !cell && !gameOver ? "hover:bg-gray-50 cursor-pointer" : "cursor-default",
              ].join(" ")}
              style={{ width: 100, height: 100 }}
            >
              {cell === "X" && (
                <span className={isWin ? "text-gray-800" : "text-gray-700"}>✕</span>
              )}
              {cell === "O" && (
                <span className={isWin ? "text-gray-800" : "text-gray-400"}>○</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={resetGame}
          className="px-5 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
        >
          New game
        </button>
        <button
          onClick={resetAll}
          className="px-5 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Reset score
        </button>
      </div>
    </div>
  );
}
