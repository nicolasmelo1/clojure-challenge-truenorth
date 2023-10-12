import { useContext } from "react";

import { router } from "../../../routes";
import { api, AuthenticationContext } from "../../core";

export default function useLogout() {
  const { setIsAuthenticated } = useContext(AuthenticationContext);

  return () => {
    api.removeTokens();
    setIsAuthenticated(false);
    router.navigate({
      to: "/login",
    });
  };
}
