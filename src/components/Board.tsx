import { useGame } from "../hooks/useGame";
import Knight from "./Knight";
import Queen from "./Queen";

const Board = () => {
  const {
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
  } = useGame();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          width: 400,
          height: 400,
        }}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, idx) => {
          const x = idx % boardSize;
          const y = Math.floor(idx / boardSize);

          const isKnight = knightPos[0] === x && knightPos[1] === y;
          const isHighlight = highlighted.some(
            ([hx, hy]) => hx === x && hy === y
          );
          const queenHere = queenPos.find(([qx, qy]) => qx === x && qy === y);

          // 퀸의 위험 영역 확인
          const queenDanger =
            queenHere &&
            getQueenRange(queenHere).some(
              ([qx, qy]) => qx === knightPos[0] && qy === knightPos[1]
            );

          const bg = isHighlight
            ? "bg-green-300"
            : (x + y) % 2 === 0
            ? "bg-gray-200"
            : "bg-white";

          return (
            <div
              key={idx}
              onClick={() => handleCellClick(x, y)}
              className={`border flex items-center justify-center w-full h-full ${bg} ${
                isHighlight ? "cursor-pointer" : ""
              }`}
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
              {queenHere && (
                <Queen color={queenDanger ? "text-red-500" : "text-black"} />
              )}
            </div>
          );
        })}
      </div>

      {(isGameOver || isClear) && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold">
              {isGameOver ? "YOU DIED" : "STAGE CLEAR!"}
            </h2>
            <div className="flex space-x-4 mt-4">
              {isClear ? (
                <button
                  onClick={nextStage}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  다음 스테이지
                </button>
              ) : (
                <button
                  onClick={restart}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  다시 하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
