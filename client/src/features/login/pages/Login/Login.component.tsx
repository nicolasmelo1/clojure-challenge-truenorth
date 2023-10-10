import { useAuthentication } from "../../hooks";

export default function LoginPage() {
  const { onSubmit, password, setPassword, setUsername, username } =
    useAuthentication();

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type={"submit"}>Login</button>
      </form>
    </div>
  );
}
