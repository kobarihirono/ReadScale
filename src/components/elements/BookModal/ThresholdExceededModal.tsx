// src/components/elements/ThresholdExceededModal.jsx

import React from "react";

interface ThresholdExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  height: number;
  rankName: string;
  thresholdLimit: number;
}

const ThresholdExceededModal: React.FC<ThresholdExceededModalProps> = ({
  isOpen,
  onClose,
  height,
  rankName,
  thresholdLimit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative border-2 p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg mx-4 sm:mx-6 md:mx-10 lg:mx-20 xl:mx-40">
        <h2 className="text-lg font-bold mb-2">おめでとうございます！</h2>
        <p className="mb-4">
          {rankName} と同じ高さ ({thresholdLimit} cm) に到達しました。
          <br />
          累計の高さは {height} cmです。
        </p>
        <button
          onClick={onClose}
          className="mx-auto bg-navy hover:bg-hover_button text-white font-bold py-2 px-4 rounded-full w-auto"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default ThresholdExceededModal;
