import { Wallet } from "ethers";

export interface AuthenticatedActionsContext {
  login: () => void;
  logout: () => void;
  wallet?: Wallet;
  privateKey?: string;
}

export type AuthenticatedContext = AuthenticatedActionsContext;
