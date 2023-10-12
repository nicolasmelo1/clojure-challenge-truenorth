import { Fragment } from "react";
import * as Styled from "./Headers.styles";

type Props = {
  isLogged?: boolean;
  headers: {
    title: string;
    link?: string;
  }[];
  isStorybook?: boolean;
  logout: () => void;
};
export default function HeadersLayout(props: Props) {
  return (
    <Styled.TitleContainer>
      {props.headers.map((header, index) => (
        <Fragment key={header.title}>
          {header.link ? (
            props.isStorybook !== true ? (
              <Styled.PageLink
                key={header.title}
                to={header.link}
                $selected={false}
              >
                {header.title}
              </Styled.PageLink>
            ) : (
              <Styled.PageLink key={header.title} $selected={false}>
                {header.title}
              </Styled.PageLink>
            )
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
        <Styled.LogoutButton onClick={() => props.logout()}>
          {"Logout"}
        </Styled.LogoutButton>
      ) : null}
    </Styled.TitleContainer>
  );
}
