import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import { useRegister } from "../../hooks";
import * as Styled from "./RegisterPage.styles";
import { Headers } from "../../../utils";

export default function RegisterPage() {
  const { error, onSubmit, password, setPassword, setUsername, username } =
    useRegister();

  useEffect(() => {
    const errorString = error?.request?.response?.data as
      | {
          data: {
            "user-create-error"?: [string];
          };
        }
      | undefined;
    if (errorString?.data?.["user-create-error"])
      toast.error(errorString?.data?.["user-create-error"][0], {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  }, [error]);

  return (
    <Styled.Container>
      <h1>🧮 Simple Calculator</h1>
      <Headers
        isLogged={false}
        headers={[
          {
            title: "Login",
            link: "/login",
          },
          {
            title: "Regiser",
          },
        ]}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Styled.InputsContainer>
          <Styled.Label htmlFor={"username"}>Username</Styled.Label>
          <Styled.Input
            id={"username"}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Styled.Label htmlFor={"password"}>Password</Styled.Label>
          <Styled.Input
            id={"password"}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Styled.RegisterButton
            type={"submit"}
            disabled={password.length === 0 || username.length === 0}
          >
            {"Register"}
          </Styled.RegisterButton>
        </Styled.InputsContainer>
      </form>
      <ToastContainer />
    </Styled.Container>
  );
}
