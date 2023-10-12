import { useAuthentication } from "../../hooks";
import LoginPageLayout from "./LoginPage.layout";

export default function LoginPage() {
  const { error, onSubmit, password, setPassword, setUsername, username } =
    useAuthentication();

  return (
    <LoginPageLayout
      error={error}
      onSubmit={onSubmit}
      password={password}
      setPassword={setPassword}
      setUsername={setUsername}
      username={username}
    />
  );
}
