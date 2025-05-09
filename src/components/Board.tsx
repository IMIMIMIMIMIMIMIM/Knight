import { useState } from "react";
import Queen from "./Queen";
import Knight from "./Knight";

type Position = [number, number];

const knightMoves = [
  [2, 1],
  [1, 2],
  [-1, 2],
  [-2, 1],
  [-2, -1],
  [-1, -2],
  [1, -2],
  [2, -1],
];

const Board = () => {
  const [knightPos, setKnightPos] = useState<Position>([0, 0]);
  const [queenPos, setQueenPos] = useState<Position[]>([[7, 7]]);
  const [highlighted, setHighlighted] = useState<Position[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleKnightClick = () => {
    const moves = knightMoves
      .map(([dx, dy]) => [knightPos[0] + dx, knightPos[1] + dy] as Position)
      .filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8);

    setHighlighted(moves);
  };

  const handleCellClick = (x: number, y: number) => {
    const canMove = highlighted.some(([hx, hy]) => hx === x && hy === y);
    if (canMove) {
      setKnightPos([x, y]);
      setHighlighted([]);

      const isInDanger = queenPos.some((queen) => {
        const queenRange = getQueenRange(queen);
        return queenRange.some(([qx, qy]) => qx === x && qy === y);
      });

      if (isInDanger) {
        setIsGameOver(true);
        setIsModalOpen(true);
      } else {
        const newQueenPos = queenPos.filter(
          ([qx, qy]) => !(qx === x && qy === y)
        );
        if (newQueenPos.length !== queenPos.length) {
          setQueenPos(newQueenPos);
          if (newQueenPos.length === 0) {
            setIsModalOpen(true);
          }
        }
      }
    }
  };

  const handleRestart = () => {
    setKnightPos([0, 0]);
    setQueenPos([[7, 7]]);
    setHighlighted([]);
    setIsGameOver(false);
    setIsModalOpen(false);
  };

  const handleAddQueen = () => {
    if (queenPos.length === 2) {
      return;
    }

    let newQueen: Position = [0, 0];
    let isValid = false;

    while (!isValid) {
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);
      newQueen = [x, y];

      const overlapsRowOrCol = queenPos.some(
        ([qx, qy]) => qx === x || qy === y
      );

      const queenRange = getQueenRange(newQueen);
      const knightAtStart = knightPos[0] === 0 && knightPos[1] === 0;
      const queenCoversKnight = queenRange.some(
        ([qx, qy]) => qx === 0 && qy === 0
      );

      if (!overlapsRowOrCol && (!knightAtStart || !queenCoversKnight)) {
        isValid = true;
      }
    }

    setQueenPos([...queenPos, newQueen]);
  };

  const handleRemoveQueen = () => {
    if (queenPos.length > 1) {
      setQueenPos(queenPos.slice(0, -1));
    }
  };

  const getQueenRange = (queenPos: Position): Position[] => {
    const [qx, qy] = queenPos;
    const range: Position[] = [];

    for (let i = 0; i < 8; i++) {
      if (i !== qx) range.push([i, qy]);
      if (i !== qy) range.push([qx, i]);
    }

    for (let i = 1; i < 8; i++) {
      if (qx + i < 8 && qy + i < 8) range.push([qx + i, qy + i]);
      if (qx - i >= 0 && qy + i < 8) range.push([qx - i, qy + i]);
      if (qx + i < 8 && qy - i >= 0) range.push([qx + i, qy - i]);
      if (qx - i >= 0 && qy - i >= 0) range.push([qx - i, qy - i]);
    }

    return range;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="absolute right-4 top-4 flex flex-col space-y-4">
        <button
          onClick={handleAddQueen}
          disabled={queenPos.length === 2}
          className={`w-12 h-12 rounded-full shadow-md text-xl/loose text-white font-bold transition
      ${
        queenPos.length === 2
          ? "bg-gray-400"
          : "bg-green-500 hover:bg-green-600"
      }
    `}
        >
          +
        </button>

        <button
          onClick={handleRemoveQueen}
          disabled={queenPos.length === 1}
          className={`w-12 h-12 rounded-full text-xl/loose shadow-md text-white font-bold transition
      ${queenPos.length === 1 ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}
    `}
        >
          -
        </button>
      </div>

      <div className="grid grid-cols-8 gap-0 w-[400px] h-[400px]">
        {Array.from({ length: 8 * 8 }).map((_, idx) => {
          const x = idx % 8;
          const y = Math.floor(idx / 8);
          const isKnight = knightPos[0] === x && knightPos[1] === y;
          const isHighlight = highlighted.some(
            ([hx, hy]) => hx === x && hy === y
          );

          const baseColor = (x + y) % 2 === 0 ? "bg-gray-200" : "bg-white";
          const cellColor = isHighlight ? "bg-green-300" : baseColor;

          const queenHere = queenPos.find(([qx, qy]) => qx === x && qy === y);

          let queenColor = "text-black";
          if (queenHere) {
            const queenRange = getQueenRange(queenHere);
            const isKnightInRange = queenRange.some(
              ([rx, ry]) => rx === knightPos[0] && ry === knightPos[1]
            );
            if (isKnightInRange) {
              queenColor = "text-red-500";
            }
          }

          return (
            <div
              key={idx}
              onClick={() => handleCellClick(x, y)}
              className={`border flex items-center justify-center w-full h-full relative
                ${cellColor}
                ${isHighlight ? "cursor-pointer" : ""}
              `}
            >
              {isKnight && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKnightClick();
                  }}
                >
                  <Knight />
                </div>
              )}
              {queenHere && <Queen color={queenColor} />}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold">
              {isGameOver ? "YOU DIED" : "WIN"}
            </h2>
            <button
              onClick={handleRestart}
              className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              다시하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
