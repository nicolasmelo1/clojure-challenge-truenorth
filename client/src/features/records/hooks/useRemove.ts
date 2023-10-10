import { api } from "../../utils";

export default function useRemove() {
  return (id: number) =>
    api.del(`/records/${id}`, undefined, {
      isAuthenticated: true,
    });
}
