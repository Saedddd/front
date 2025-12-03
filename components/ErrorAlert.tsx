"use client";

interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-sm animate-fade-in">
      <strong className="font-semibold">Ошибка: </strong> {message}
    </div>
  );
}
