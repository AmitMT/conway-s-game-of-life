/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import produce from 'immer';
import Controller from './components/Controller';

export type TileType = { id: number; black: boolean };

const checkSides = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const App: FC = () => {
  const [gameActive, setGameActive] = useState(false);
  const gameActiveRef = useRef(gameActive);
  gameActiveRef.current = gameActive;
  const [speed, setSpeed] = useState(120);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const createGrid = (size: number) =>
    Array.from({ length: size }, (_1, i) =>
      Array.from(
        { length: size },
        (_2, j) =>
          ({
            id: i * size + j,
            black: false,
          } as TileType)
      )
    );

  const [size, setSize] = useState(10);
  const [grid, setGrid] = useState(createGrid(size));

  useEffect(() => {
    setGrid(createGrid(size));
  }, [size]);

  const simulate = useCallback(() => {
    if (!gameActiveRef.current) return;

    setGrid((g) =>
      produce(g, (draftGrid) => {
        for (let i = 0; i < g.length; i += 1) {
          for (let j = 0; j < g[i].length; j += 1) {
            const neighbors = checkSides.reduce<number>((prev, current) => {
              const pos = [i + current[0], j + current[1]];
              if (pos[0] >= 0 && pos[0] < g.length && pos[1] >= 0 && pos[1] < g[i].length && g[pos[0]][pos[1]].black)
                return prev + 1;
              return prev;
            }, 0);

            if (neighbors < 2 || neighbors > 3) {
              draftGrid[i][j].black = false;
            } else if (neighbors === 3 && g[i][j].black === false) draftGrid[i][j].black = true;
          }
        }
      })
    );
    setTimeout(simulate, 60000 / speedRef.current);
  }, []);

  useEffect(() => {
    if (gameActive) simulate();
  }, [gameActive, simulate]);

  return (
    <main className="flex justify-center items-center bg-gray-200">
      <Controller {...{ gameActive, setGameActive, speed, setSpeed, size, setSize }} />
      <div className="h-screen p-10">
        <div className="hi h-full flex flex-col border-2 border-black divide-y-2 divide-black">
          {grid.map((row, i) => (
            <div className="flex-1 flex divide-x-2 divide-black" key={i}>
              {row.map((tile, j) => (
                <button
                  key={`${i}-${j}`}
                  type="button"
                  aria-label="tile"
                  className={`flex-1 flex justify-center items-center select-none transition-all ${
                    tile.black
                      ? 'bg-black hover:bg-gray-900 active:bg-red-500'
                      : 'bg-gray-100 hover:bg-gray-200 active:bg-green-500'
                  }`}
                  onClick={() => {
                    if (!gameActive) {
                      setGrid(
                        produce(grid, (draftGrid) => {
                          // eslint-disable-next-line no-param-reassign
                          draftGrid[i][j].black = !draftGrid[i][j].black;
                        })
                      );
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1" />
    </main>
  );
};

export default App;
