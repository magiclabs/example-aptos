import { MagicAptosWallet } from "@magic-ext/aptos";
import { create } from "zustand";

type AptosWalletState = {
  aptosWallet: MagicAptosWallet | null;
  setAptosWallet: (aptosWallet: MagicAptosWallet) => void;
};

const AptosWalletStore = create<AptosWalletState>((set) => ({
  aptosWallet: null,
  setAptosWallet: (aptosWallet: MagicAptosWallet) => set({ aptosWallet }),
}));

export const useSetAptosWallet = () =>
  AptosWalletStore((state) => state.setAptosWallet);

export const useAptosWallet = () =>
  AptosWalletStore((state) => state.aptosWallet);
