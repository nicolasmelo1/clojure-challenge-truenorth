import { useContext, useEffect, useState } from "react";

import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { api } from "..";

export default function useMe() {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get("/auth/me", undefined, { isAuthenticated: true })
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (response.response.data) setData(response.response.data as any);
      })
      .catch((error) => {
        setError(error);
      });
  }, [isAuthenticated]);

  return {
    data,
    error,
  };
}
