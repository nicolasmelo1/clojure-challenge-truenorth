import { useRegister } from "../../hooks";
import RegisterPageLayout from "./RegisterPage.layout";

export default function RegisterPage() {
  const { error, onSubmit, password, setPassword, setUsername, username } =
    useRegister();

  return (
    <RegisterPageLayout
      error={error}
      onSubmit={onSubmit}
      password={password}
      setPassword={setPassword}
      setUsername={setUsername}
      username={username}
    />
  );
}
