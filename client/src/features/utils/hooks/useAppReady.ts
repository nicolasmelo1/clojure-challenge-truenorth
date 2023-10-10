import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { AuthenticationContext } from "../contexts/AuthenticationContext";
import api from "../utils/api";
import useBaseAppReady from "./useBaseAppReady";
import useMe from "./useMe";

export default function useAppReady() {
  const { setIsAuthenticated, isAuthenticated } = useContext(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AuthenticationContext
  );
  const queryClient = useQueryClient();
  const { data: userData, error } = useMe();

  const { isAppReady } = useBaseAppReady(
    async (userData, error) => {
      const hasDataOrErrorOnFirstRequest =
        userData !== undefined || (error !== null && error !== undefined);
      if (hasDataOrErrorOnFirstRequest) {
        const isReallyAuthenticated = userData !== undefined;
        if (!isReallyAuthenticated) {
          await Promise.all([
            api.removeTokens(),
            queryClient.invalidateQueries(),
          ]);
        }
        setIsAuthenticated(isReallyAuthenticated);
      }
      return hasDataOrErrorOnFirstRequest;
    },
    [userData, error]
  );

  return {
    userData,
    isAuthenticated,
    isAppReady,
  };
}
