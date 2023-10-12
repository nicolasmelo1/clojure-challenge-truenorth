import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { useAuthentication } from "../../hooks";
import * as Styled from "./LoginPage.styles";
import { Headers } from "../../../core";

type Props = { isStorybook?: boolean } & Pick<
  ReturnType<typeof useAuthentication>,
  "onSubmit" | "error"
> &
  Partial<Omit<ReturnType<typeof useAuthentication>, "onSubmit" | "error">>;
export default function LoginPageLayout(props: Props) {
  const [username, setUsername] = useState(props.username || "");
  const [password, setPassword] = useState(props.password || "");

  useEffect(() => {
    const errorString = props.error?.request?.response?.data as
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
  }, [props.error]);

  useEffect(() => {
    if (props.username !== username && props.username)
      setUsername(props.username);
    if (props.password !== password && props.password)
      setPassword(props.password);
  }, [password, username, props.username, props.password]);

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
            title: "Register",
            link: "/register",
          },
        ]}
        isStorybook={props.isStorybook}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit();
        }}
      >
        <Styled.LoginInputsContainer>
          <Styled.Label htmlFor={"username"}>Username</Styled.Label>
          <Styled.Input
            id={"username"}
            type="text"
            placeholder="Username"
            value={props.username}
            onChange={(e) => {
              if (props.setUsername) props.setUsername(e.target.value);
              setUsername(e.target.value);
            }}
          />
          <Styled.Label htmlFor={"password"}>Password</Styled.Label>
          <Styled.Input
            id={"password"}
            type="password"
            placeholder="Password"
            value={props.password}
            onChange={(e) => {
              if (props.setPassword) props.setPassword(e.target.value);
              setPassword(e.target.value);
            }}
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
