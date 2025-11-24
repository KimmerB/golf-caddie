export const formatPercentage = (value: number) => `${Math.round(value)}%`;

export const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
};
