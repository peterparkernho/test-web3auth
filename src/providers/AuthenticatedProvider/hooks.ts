"use client";

import { useContext } from "react";

import { authenticatedInContext } from "@/providers/AuthenticatedProvider/constants";
import { AuthenticatedContext } from "./types";

export const useAuthenticated = (): AuthenticatedContext => {
  const actions = useContext(authenticatedInContext);

  return {
    ...actions,
  };
};
