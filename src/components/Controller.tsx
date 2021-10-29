/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useState } from 'react';
import { PlayIcon, StopIcon } from '@heroicons/react/outline';

type TileProps = {
  gameActive: boolean;
  setGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  speed: number;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
};

const Tile: FC<TileProps> = ({ gameActive, setGameActive, speed, setSpeed, size, setSize, children, ...props }) => {
  const toggleGameActive = () => setGameActive(!gameActive);
  const [currentSize, setCurrentSize] = useState(size);

  return (
    <div className="flex-1 flex flex-col justify-center items-center" {...props}>
      <div>
        <button
          className={`w-24 h-24 p-2 rounded-full bg-white shadow-xl transition-colors duration-500 hover:bg-gray-100 ${
            gameActive ? 'text-red-500 active:text-red-700' : 'text-green-500 active:text-green-700'
          } `}
          type="button"
          onClick={toggleGameActive}
        >
          {gameActive ? <StopIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="flex flex-col justify-center items-center mt-8 bg-white shadow-xl p-5 rounded-xl">
        <input
          type="range"
          value={currentSize}
          min="2"
          max="100"
          className="w-40 mb-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentSize(parseInt(e.target.value, 10));
          }}
          onMouseUp={(e: React.MouseEvent<HTMLInputElement>) => {
            setSize(parseInt(e.currentTarget.value, 10));
          }}
        />
        <div>
          Size: <b>{currentSize}</b>
        </div>
        <input
          type="range"
          value={speed}
          min="10"
          max="1000"
          className="w-40 mt-8 mb-2"
          onChange={(e) => {
            setSpeed(parseInt(e.target.value, 10));
          }}
        />
        <div>
          Speed: <b>{speed}</b> ticks/min
        </div>
      </div>
    </div>
  );
};

export default Tile;
