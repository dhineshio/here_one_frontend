"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface CounterProps {
  value: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
}

export function Counter({ value, setValue, min = 0, max = 30 }: CounterProps) {
  const handleDecrement = () => {
    if (value > min) {
      setValue(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      setValue(value + 1);
    }
  };

  return (
    <div className="w-[120px] rounded-sm flex items-center justify-between h-10 px-3 bg-accent/60">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="hover:bg-accent rounded p-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium">{value}</span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="hover:bg-accent rounded p-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
