import { ButtonHTMLAttributes } from 'react';
import { Button } from './Button';

type NumberStepperProps = {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
};

const StepperButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Button
    {...props}
    variant="ghost"
    className="h-12 w-12 rounded-2xl border border-slate-200 bg-white text-lg shadow-none hover:border-primary hover:text-primary"
  />
);

export const NumberStepper = ({ label, value, onChange, min = 0, max = 20 }: NumberStepperProps) => {
  const increment = () => {
    const next = (value ?? 0) + 1;
    if (next <= max) {
      onChange(next);
    }
  };

  const decrement = () => {
    const next = (value ?? 0) - 1;
    if (next >= min) {
      onChange(next);
    }
  };

  const reset = () => onChange(null);

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{label}</span>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400 transition hover:text-primary"
        >
          Clear
        </button>
      </div>
      <div className="flex items-center justify-between">
        <StepperButton type="button" onClick={decrement} aria-label={`Decrease ${label}`}>
          −
        </StepperButton>
        <div className="flex h-16 w-24 items-center justify-center rounded-2xl bg-fog text-3xl font-semibold">
          {value ?? '—'}
        </div>
        <StepperButton type="button" onClick={increment} aria-label={`Increase ${label}`}>
          +
        </StepperButton>
      </div>
    </div>
  );
};
