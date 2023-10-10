import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import { Headers } from "../../../utils";
import * as Styled from "./RandomStringPage.styles";
import { useRandomString } from "../../hooks/useRandomString";

export default function RandomStringPage() {
  const { fetch, error, data } = useRandomString();

  useEffect(() => {
    const errorString = error?.request?.response?.data as
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
  }, [error]);

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
      />
      <Styled.RandomStringContainer>
        <Styled.Display>
          {data && data?.result ? data.result : ""}
        </Styled.Display>
        <Styled.ButtonToGenerate onClick={() => fetch()}>
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
