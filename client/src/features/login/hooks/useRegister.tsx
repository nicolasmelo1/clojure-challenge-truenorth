import { useCallback, useState } from "react";
import * as z from "zod";
import { toast } from "react-toastify";

import { useMutate, MutationTypes } from "../../core";
import { router } from "../../../routes";

const registerSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export default function useRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, error } = useMutate<z.infer<typeof registerSchema>, unknown>(
    MutationTypes.POST,
    ["create-user"],
    "/auth/create-user",
    registerSchema,
    {
      useMutationParams: {
        onSuccess: async (data) => {
          if (data) {
            toast.success("New Account created", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            router.navigate({ to: "/login" });
          }
        },
      },
    }
  );

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
