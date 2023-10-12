import { useCallback, useState, useContext } from "react";
import * as z from "zod";

import {
  AuthenticationContext,
  useMutate,
  MutationTypes,
  api,
} from "../../core";
import { router } from "../../../routes";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type TokenResponse = {
  token: string;
  "refresh-token": string;
};

export default function useAuthentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated } = useContext(AuthenticationContext);

  const { mutate, error } = useMutate<
    z.infer<typeof loginSchema>,
    TokenResponse
  >(MutationTypes.POST, ["login"], "/auth/login", loginSchema, {
    useMutationParams: {
      onSuccess: async (data) => {
        if (data) {
          const formattedLoginData = {
            token: data.token,
            refreshToken: data["refresh-token"],
          };
          setIsAuthenticated(true);
          await api.setTokens(formattedLoginData);
          router.navigate({ to: "/app/operations/calculator" });
        }
      },
    },
  });

  function onSubmit() {
    mutate({
      data: {
        username,
        password,
      },
    });
  }

  return {
    username,
    password,
    setUsername,
    setPassword,
    error,
    onSubmit: useCallback(onSubmit, [mutate, username, password]),
  };
}
