import { Outlet } from "@tanstack/react-router";

export default function Root() {
  return (
    <div>
      <h1>SImple Calculator</h1>
      <Outlet />
    </div>
  );
}
