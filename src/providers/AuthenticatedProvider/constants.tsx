import { createContext } from "react";

import type { AuthenticatedActionsContext } from "@/providers/AuthenticatedProvider/types";

export const authenticatedInContext =
  createContext<AuthenticatedActionsContext>({} as AuthenticatedActionsContext);
