import { Fragment } from "react";
import * as Styled from "./Headers.styles";
import { useLogout } from "../../../login";

type Props = {
  isLogged?: boolean;
  headers: {
    title: string;
    link?: string;
  }[];
};
export default function Headers(props: Props) {
  const logout = useLogout();

  return (
    <Styled.TitleContainer>
      {props.headers.map((header, index) => (
        <Fragment key={header.title}>
          {header.link ? (
            <Styled.PageLink
              key={header.title}
              to={header.link}
              $selected={false}
            >
              {header.title}
            </Styled.PageLink>
          ) : (
            <Styled.PageTitle key={header.title} $selected={true}>
              {header.title}
            </Styled.PageTitle>
          )}
          {props.isLogged !== false ||
          (props.isLogged === false && index !== props.headers.length - 1) ? (
            <Styled.PageTitleDivisor>{"/"}</Styled.PageTitleDivisor>
          ) : null}
        </Fragment>
      ))}
      {props.isLogged !== false ? (
        <Styled.LogoutButton onClick={() => logout()}>
          {"Logout"}
        </Styled.LogoutButton>
      ) : null}
    </Styled.TitleContainer>
  );
}
