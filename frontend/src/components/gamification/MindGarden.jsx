import React from "react";
import { Sun, Cloud, CloudRain } from "lucide-react";

const MindGarden = ({ level, moodTrend }) => {
  function getSkyStyle() {
    if (moodTrend === "Improving") return "from-sky-300 to-blue-400";
    if (moodTrend === "Declining") return "from-slate-400 to-slate-600";
    return "from-sky-200 to-blue-300";
  }

  function renderWeather() {
    if (moodTrend === "Improving") {
      return (
        <div className="absolute top-4 right-8">
          <Sun className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
        </div>
      );
    }
    if (moodTrend === "Declining") {
      return (
        <div className="absolute top-4 left-0 right-0 flex justify-around items-center">
          <CloudRain className="w-10 h-10 text-slate-300 opacity-80" />
          <CloudRain className="w-12 h-12 text-slate-400 opacity-70" />
          <CloudRain className="w-10 h-10 text-slate-300 opacity-80" />
        </div>
      );
    }
    return (
      <div className="absolute top-4 left-0 right-0 flex justify-around items-center">
        <Cloud className="w-12 h-12 text-white opacity-60" />
        <Cloud className="w-10 h-10 text-white opacity-50" />
      </div>
    );
  }

  function renderMountains() {
    if (level < 5) return null;
    return (
      <div className="absolute bottom-20 left-0 right-0 flex items-end justify-center">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "70px solid transparent",
            borderRight: "70px solid transparent",
            borderBottom: "90px solid #94a3b8",
          }}
        />
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "90px solid transparent",
            borderRight: "90px solid transparent",
            borderBottom: "120px solid #64748b",
            marginLeft: "-25px",
            marginRight: "-25px",
          }}
        />
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "70px solid transparent",
            borderRight: "70px solid transparent",
            borderBottom: "90px solid #94a3b8",
          }}
        />
      </div>
    );
  }

  function renderGround() {
    return (
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-green-600 to-green-800 rounded-b-2xl" />
    );
  }

  function renderLevel1() {
    return (
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-end gap-8">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-yellow-200 rounded-full border-2 border-yellow-400 shadow" />
          <div className="w-1 h-6 bg-amber-700 rounded" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-4 h-4 bg-yellow-100 rounded-full border-2 border-yellow-300 shadow" />
          <div className="w-1 h-4 bg-amber-700 rounded" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-yellow-200 rounded-full border-2 border-yellow-400 shadow" />
          <div className="w-1 h-5 bg-amber-700 rounded" />
        </div>
      </div>
    );
  }

  function renderLevel2() {
    return (
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-end gap-8">
        <div className="flex flex-col items-center">
          <div className="w-7 h-5 bg-green-400 rounded-full" />
          <div className="w-1.5 h-10 bg-green-600 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-6 bg-green-500 rounded-full" />
          <div className="w-1.5 h-12 bg-green-600 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-7 h-5 bg-green-400 rounded-full" />
          <div className="w-1.5 h-8 bg-green-600 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-4 bg-green-300 rounded-full" />
          <div className="w-1 h-7 bg-green-600 rounded" />
        </div>
      </div>
    );
  }

  function renderLevel3() {
    return (
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-end gap-5">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-500 rounded-full" />
          <div className="w-3 h-12 bg-amber-700 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 bg-pink-400 rounded-full border-2 border-pink-300" />
          <div className="w-1.5 h-10 bg-green-600 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-300" />
          <div className="w-1.5 h-8 bg-green-600 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 bg-purple-400 rounded-full border-2 border-purple-300" />
          <div className="w-1.5 h-9 bg-green-600 rounded" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-green-600 rounded-full" />
          <div className="w-3 h-10 bg-amber-800 rounded" />
        </div>
      </div>
    );
  }

  function renderLevel4() {
    return (
      <div className="absolute bottom-20 left-0 right-0 flex justify-between items-end px-8">
        <div className="flex flex-col items-center">
          <div
            className="w-18 h-18 bg-green-600 rounded-full"
            style={{ width: "72px", height: "72px" }}
          />
          <div className="w-3 h-14 bg-amber-700 rounded" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-3 items-end">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-pink-400 rounded-full" />
              <div className="w-1.5 h-8 bg-green-500 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-yellow-400 rounded-full" />
              <div className="w-1.5 h-10 bg-green-500 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-blue-400 rounded-full" />
              <div className="w-1.5 h-8 bg-green-500 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-orange-400 rounded-full" />
              <div className="w-1.5 h-9 bg-green-500 rounded" />
            </div>
          </div>
          <div className="w-24 h-3 bg-blue-300 rounded-full opacity-80" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-500 rounded-full" />
          <div className="w-3 h-12 bg-amber-800 rounded" />
        </div>
      </div>
    );
  }

  function renderLevel5() {
    return (
      <div className="absolute bottom-20 left-0 right-0 flex justify-between items-end px-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-green-600 rounded-full shadow-lg" />
          <div className="w-4 h-16 bg-amber-700 rounded" />
        </div>
        <div className="relative flex flex-col items-center gap-2">
          <div className="flex gap-2 items-end">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-pink-400 rounded-full" />
              <div className="w-1.5 h-9 bg-green-500 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-yellow-300 rounded-full" />
              <div className="w-1.5 h-11 bg-green-500 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-purple-400 rounded-full" />
              <div className="w-1.5 h-9 bg-green-500 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-orange-300 rounded-full" />
              <div className="w-1.5 h-10 bg-green-500 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-rose-400 rounded-full" />
              <div className="w-1.5 h-8 bg-green-500 rounded" />
            </div>
          </div>
          <div className="w-32 h-3 bg-blue-300 rounded-full opacity-90" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500 rounded-full shadow-lg" />
          <div className="w-3 h-14 bg-amber-800 rounded" />
        </div>
      </div>
    );
  }

  function renderGarden() {
    if (level === 1) return renderLevel1();
    if (level === 2) return renderLevel2();
    if (level === 3) return renderLevel3();
    if (level === 4) return renderLevel4();
    if (level === 5) return renderLevel5();
    return renderLevel1();
  }

  function getMoodLabel() {
    if (moodTrend === "Improving") return "Your garden is thriving";
    if (moodTrend === "Declining") return "Rain nourishes the garden too";
    return "Your garden is steady and calm";
  }

  return (
    <div className="w-full">
      <div
        className={`relative w-full h-72 rounded-2xl overflow-hidden bg-gradient-to-b ${getSkyStyle()}`}
      >
        {renderWeather()}
        {renderMountains()}
        {renderGarden()}
        {renderGround()}
      </div>
      <p className="text-center text-sm text-gray-500 font-semibold mt-3">
        {getMoodLabel()}
      </p>
    </div>
  );
};

export default MindGarden;
