import { useLogout } from "../../../login";
import HeadersLayout from "./Headers.layout";

type Props = {
  isLogged?: boolean;
  headers: {
    title: string;
    link?: string;
  }[];
  isStorybook?: boolean;
};
export default function Headers(props: Props) {
  const logout = useLogout();

  return (
    <HeadersLayout {...props} logout={logout} isStorybook={props.isStorybook} />
  );
}
