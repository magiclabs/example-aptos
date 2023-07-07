// Note. https://github.com/aptos-labs/token/blob/aeef75178c76f6f50f919914d45f348bd55cbb7c/minting-tool/cli/src/utils.ts#L88
export const parseOctasToApt = (amount: string): string => {
  return (Number.parseInt(amount, 10) / 100000000).toFixed(8);
};
