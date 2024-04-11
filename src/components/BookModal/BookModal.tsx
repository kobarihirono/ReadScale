// components/BookModal/BookModal.tsx

"use client";
import React from "react";
import { useForm } from "react-hook-form";

interface BookFormData {
  completedDate: string;
}

interface BookFormProps {
  defaultCompletedDate?: string;
  onSubmit: (data: BookFormData) => void;
}

const BookForm: React.FC<BookFormProps> = ({
  defaultCompletedDate = "",
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      completedDate: defaultCompletedDate,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <label
        htmlFor="completedDate"
        className="block text-sm font-medium text-gray-700"
      >
        読了日
      </label>
      <input
        type="date"
        {...register("completedDate", { required: "読了日を入力してください" })}
        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none sm:text-sm"
      />
      {errors.completedDate && (
        <p className="text-red-500">{errors.completedDate.message}</p>
      )}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </form>
  );
};

export default BookForm;
