import { useEffect, useState } from "react";

export type Position = [number, number];

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

const stageSettings = [
  { boardSize: 5, queenCount: 1 },
  { boardSize: 5, queenCount: 2 },
  { boardSize: 6, queenCount: 2 },
  { boardSize: 6, queenCount: 3 },
  { boardSize: 7, queenCount: 3 },
  { boardSize: 7, queenCount: 4 },
  { boardSize: 8, queenCount: 4 },
  { boardSize: 8, queenCount: 5 },
];

export const useGame = () => {
  const [stage, setStage] = useState(0);
  const [restartKey, setRestartKey] = useState(0); // ← restart trigger
  const { boardSize, queenCount } = stageSettings[stage];
  const [knightPos, setKnightPos] = useState<Position>([0, 0]);
  const [queenPos, setQueenPos] = useState<Position[]>([]);
  const [highlighted, setHighlighted] = useState<Position[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isClear, setIsClear] = useState(false);

  const getQueenRange = ([qx, qy]: Position): Position[] => {
    const range: Position[] = [];
    for (let i = 0; i < boardSize; i++) {
      if (i !== qx) range.push([i, qy]);
      if (i !== qy) range.push([qx, i]);
    }
    for (let i = 1; i < boardSize; i++) {
      if (qx + i < boardSize && qy + i < boardSize)
        range.push([qx + i, qy + i]);
      if (qx - i >= 0 && qy + i < boardSize) range.push([qx - i, qy + i]);
      if (qx + i < boardSize && qy - i >= 0) range.push([qx + i, qy - i]);
      if (qx - i >= 0 && qy - i >= 0) range.push([qx - i, qy - i]);
    }
    return range;
  };

  const getKnightRange = ([x, y]: Position): Position[] =>
    knightMoves
      .map(([dx, dy]) => [x + dx, y + dy] as Position)
      .filter(
        ([nx, ny]) => nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize
      );

  useEffect(() => {
    const queens: Position[] = [];
    while (queens.length < queenCount) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      if (queens.some(([qx, qy]) => qx === x && qy === y)) continue;

      let valid = true;
      for (const q of queens) {
        if (getQueenRange(q).some(([rx, ry]) => rx === x && ry === y)) {
          valid = false;
          break;
        }
      }
      if (valid) queens.push([x, y]);
    }

    let knight: Position = [-1, -1];
    let attempts = 0;
    while (attempts < 1000) {
      attempts++;
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      const danger = queens.some((q) =>
        getQueenRange(q).some(([qx, qy]) => qx === x && qy === y)
      );
      const attacking = getKnightRange([x, y]).some(([kx, ky]) =>
        queens.some(([qx, qy]) => qx === kx && qy === ky)
      );
      if (
        !danger &&
        !attacking &&
        !queens.some(([qx, qy]) => qx === x && qy === y)
      ) {
        knight = [x, y];
        break;
      }
    }

    setKnightPos(knight);
    setQueenPos(queens);
    setHighlighted([]);
    setIsGameOver(false);
    setIsClear(false);
  }, [stage, restartKey, boardSize, queenCount]); // ← restartKey 추가

  const handleKnightClick = () => {
    setHighlighted(getKnightRange(knightPos));
  };

  const handleCellClick = (x: number, y: number) => {
    if (!highlighted.some(([hx, hy]) => hx === x && hy === y)) return;
    setKnightPos([x, y]);
    setHighlighted([]);

    const danger = queenPos.some((q) =>
      getQueenRange(q).some(([qx, qy]) => qx === x && qy === y)
    );
    if (danger) {
      setIsGameOver(true);
    } else {
      const remaining = queenPos.filter((q) => q[0] !== x || q[1] !== y);
      setQueenPos(remaining);
      if (remaining.length === 0) setIsClear(true);
    }
  };

  const nextStage = () =>
    setStage((prev) => Math.min(prev + 1, stageSettings.length - 1));

  const restart = () => {
    setRestartKey((prev) => prev + 1); // ← 이걸로 effect 재실행
  };

  return {
    boardSize,
    knightPos,
    queenPos,
    highlighted,
    isGameOver,
    isClear,
    handleCellClick,
    handleKnightClick,
    nextStage,
    restart,
    getQueenRange,
  };
};
