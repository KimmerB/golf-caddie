import { clsx } from 'clsx';

type ToggleChipProps = {
  label: string;
  active: boolean | null;
  onChange: (value: boolean | null) => void;
};

export const ToggleChip = ({ label, active, onChange }: ToggleChipProps) => {
  const toggle = () => {
    if (active === null) {
      onChange(true);
    } else if (active) {
      onChange(false);
    } else {
      onChange(null);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx(
        'rounded-full border px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        active
          ? 'border-transparent bg-primary text-white shadow-subtle'
          : 'border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-primary'
      )}
    >
      {label}
    </button>
  );
};
