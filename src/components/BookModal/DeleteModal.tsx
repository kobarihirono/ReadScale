// src/components/ConfirmModal.tsx

import React from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <p className="text-gray-800">選択した書籍を削除します。</p>
        <p className='mt-4 text-sm font-bold text-red-700'>※削除した書籍のページ数は累計から減算されますがよろしいですか？</p>
        <div className="flex justify-end mt-6">
          <button className="px-4 py-2 mr-2 bg-navy text-white font-bold rounded-full hover:bg-hover_button" onClick={onClose}>
            戻る
          </button>
          <button className="px-4 py-2 bg-gray-500 font-bold text-white rounded-full hover:bg-gray-400" onClick={onDelete}>
            削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
