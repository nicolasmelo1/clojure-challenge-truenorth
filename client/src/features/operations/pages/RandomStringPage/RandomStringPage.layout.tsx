import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import { Headers } from "../../../core";
import * as Styled from "./RandomStringPage.styles";
import { useRandomString } from "../../hooks/useRandomString";

type Props = ReturnType<typeof useRandomString> & { isStorybook?: boolean };
export default function RandomStringPageLayout(props: Props) {
  useEffect(() => {
    const errorString = props.error?.request?.response?.data as
      | {
          data: {
            "not-enough-money": [string];
          };
        }
      | undefined;
    if (errorString?.data?.["not-enough-money"])
      toast.error(errorString?.data?.["not-enough-money"][0], {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  }, [props.error]);

  return (
    <Styled.Container>
      <Headers
        headers={[
          {
            title: "History",
            link: "/app/records",
          },
          {
            title: "Calculator",
            link: "/app/operations/calculator",
          },
          {
            title: "Random String",
          },
        ]}
        isStorybook={props.isStorybook}
      />
      <Styled.RandomStringContainer>
        <Styled.Display>
          {props.data && props.data?.result ? props.data.result : ""}
        </Styled.Display>
        <Styled.ButtonToGenerate onClick={() => props.fetch()}>
          {"Generate"}
        </Styled.ButtonToGenerate>
      </Styled.RandomStringContainer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Styled.Container>
  );
}
