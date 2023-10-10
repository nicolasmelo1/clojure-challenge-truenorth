import { useContext, useEffect, useState } from "react";

import { AuthenticationContext } from "../contexts/AuthenticationContext";

export default function useBaseAppReady<D extends unknown[]>(
  validateCallback: (...dependencies: D) => Promise<boolean>,
  dependencies: D
) {
  const { isLoadingAuth, isAuthenticated, setIsAuthenticated } = useContext(
    AuthenticationContext
  );
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (isLoadingAuth === false) {
      if (isAuthenticated === false) setIsAppReady(true);
      else {
        validateCallback(...dependencies)
          .then((isReady) => setIsAppReady(isReady))
          .catch(() => setIsAppReady(true));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, isLoadingAuth]);

  return {
    setIsAuthenticated,
    isAuthenticated,
    isAppReady,
  };
}
