export const parseOctasToApt = (amount: string): string => {
  return (Number.parseInt(amount, 10) / 100000000).toFixed(8);
};
