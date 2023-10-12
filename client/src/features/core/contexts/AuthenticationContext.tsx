import { useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

import GlobalContexts from "./index";
import api from "../utils/api";
import { TokensType } from "../utils/api/types";
import { router } from "../../../routes";

type State = {
  isLoadingAuth: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (newValue: boolean) => void;
};

export const AuthenticationContext = createContext({} as State);

export function AuthenticationProvider(props: PropsWithChildren<unknown>) {
  const isHandlingUnauthenticated = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, _setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  /**
   * If we deauthenticate the user we should invalidate all queries from the cache so when he logs back in again
   * we can safely refetch everything without issues
   * @param newState - If the user is authenticated or not
   */
  function setIsAuthenticated(newState: boolean) {
    _setIsAuthenticated(newState);
    // We'll wait for the next tick of the event loop so we can get the state updates
    //if (newState === false)
    //  setTimeout(() => void queryClient.invalidateQueries());
  }

  /**
   * This will handle when the user is unauthenticated inside of the app. When this happens what we do is that we
   * will try to get the refresh token ant then we will try to make the request again, if not possible we will redirect
   * the user to the login page.
   */
  async function handleUnauthenticated(
    response: AxiosResponse | undefined,
    makeRequestAgain: () => void
  ) {
    const { refreshToken } = await api.getTokens();
    const isUnauthorized = response?.status === 401;
    const canRefreshTheToken =
      isUnauthorized &&
      isHandlingUnauthenticated.current === false &&
      typeof refreshToken === "string" &&
      refreshToken !== "";

    if (canRefreshTheToken) {
      isHandlingUnauthenticated.current = true;
      const { response: refreshResponse } = await api.post<unknown, TokensType>(
        "/auth/refresh",
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      const isSuccessResponse = [200, 201].includes(refreshResponse?.status);
      if (isSuccessResponse) {
        const tokens = response.data.data as {
          token: string;
          "refresh-tokens": string;
        };
        await api.setTokens({
          token: tokens.token,
          refreshToken: tokens["refresh-tokens"],
        });
        makeRequestAgain();
      } else {
        await Promise.all([
          api.removeTokens(),
          queryClient.invalidateQueries(),
        ]);
        setIsAuthenticated(false);
        router.navigate({ to: "/login" });
      }
      isHandlingUnauthenticated.current = false;
    }
  }

  useEffect(() => {
    api.exceptionObserver.addCallback(handleUnauthenticated);
    void api.getTokens().then((tokens) => {
      if (tokens.accessToken && tokens.refreshToken) setIsAuthenticated(true);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        isLoadingAuth: isLoading,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}

GlobalContexts.registerProviders(AuthenticationProvider);
