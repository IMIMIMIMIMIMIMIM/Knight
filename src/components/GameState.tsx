import { useState } from "react";

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

const GameState = () => {
  const [knightPos, setKnightPos] = useState<Position>([0, 0]);
  const [queenPos, setQueenPos] = useState<Position[]>([[7, 7]]);
  const [highlighted, setHighlighted] = useState<Position[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleRestart = () => {
    setKnightPos([0, 0]);
    setQueenPos([[7, 7]]);
    setHighlighted([]);
    setIsGameOver(false);
    setIsModalOpen(false);
  };

  return {
    knightPos,
    queenPos,
    highlighted,
    isGameOver,
    isModalOpen,
    handleKnightClick,
    handleCellClick,
    handleAddQueen,
    handleRemoveQueen,
    handleRestart,
  };
};

export default GameState;
