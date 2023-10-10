import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import { useAuthentication } from "../../hooks";
import * as Styled from "./LoginPage.styles";
import { Headers } from "../../../utils";

export default function LoginPage() {
  const { error, onSubmit, password, setPassword, setUsername, username } =
    useAuthentication();

  useEffect(() => {
    const errorString = error?.request?.response?.data as
      | {
          data: {
            "login-error"?: [string];
          };
        }
      | undefined;
    if (errorString?.data?.["login-error"])
      toast.error(errorString?.data?.["login-error"][0], {
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
          },
          {
            title: "Regiser",
            link: "/register",
          },
        ]}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Styled.LoginInputsContainer>
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
          <Styled.LoginButton
            type={"submit"}
            disabled={password.length === 0 || username.length === 0}
          >
            Login
          </Styled.LoginButton>
        </Styled.LoginInputsContainer>
      </form>
      <ToastContainer />
    </Styled.Container>
  );
}
