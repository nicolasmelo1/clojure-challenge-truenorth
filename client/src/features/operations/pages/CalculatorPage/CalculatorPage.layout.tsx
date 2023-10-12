import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

import { Headers } from "../../../core";
import * as Styled from "./CalculatorPage.styles";
import { useCalculator } from "../../hooks/useCalculator";

type Props = ReturnType<typeof useCalculator> & { isStorybook?: boolean };
export default function CalculatorPageLayout(props: Props) {
  const [calculation, setCalculation] = useState("");

  function onReset() {
    setCalculation("");
  }

  function onFetchResult() {
    props.fetch(
      (calculation || "")
        .replace(/√/g, "|/")
        .replace(/x/g, "*")
        .replace(/,/g, ".")
    );
  }

  function onAddValue(
    value:
      | "()"
      | "B"
      | "|/"
      | "1"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"
      | "0"
      | ","
      | "x"
      | "/"
      | "+"
      | "-"
      | "."
  ) {
    const checkIfShouldOpenOrCloseParenthesis = () => {
      const previousChar = calculation[calculation.length - 1];
      if (/\d/g.test(previousChar)) return ")";
      return "(";
    };
    setCalculation(
      (calculation) =>
        calculation +
        (value === "|/"
          ? "√"
          : value === "()"
          ? checkIfShouldOpenOrCloseParenthesis()
          : value)
    );
  }

  useEffect(() => {
    if (props.data?.result)
      setCalculation((calculation) =>
        typeof props.data?.result === "string" ||
        typeof props.data?.result === "number"
          ? `${props.data.result}`
          : calculation
      );
  }, [props.data]);

  useEffect(() => {
    const errorString = props.error?.request?.response?.data as
      | {
          data: {
            "not-enough-money"?: [string];
            "invalid-syntax"?: [string];
          };
        }
      | undefined;
    if (errorString?.data?.["not-enough-money"])
      toast.error(errorString?.data?.["not-enough-money"][0], {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    if (errorString?.data?.["invalid-syntax"])
      toast.error(errorString?.data?.["invalid-syntax"][0], {
        position: "top-right",
        autoClose: 3000,
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
          },
          {
            title: "Random String",
            link: "/app/operations/random-string",
          },
        ]}
        isStorybook={props.isStorybook}
      />
      <Styled.CalculatorContainer>
        <Styled.Display>{calculation}</Styled.Display>

        <Styled.ButtonsRow>
          <Styled.Button $type="operations" onClick={() => onReset()}>
            {"AC"}
          </Styled.Button>
          <Styled.Button $type="operations" onClick={() => onAddValue("()")}>
            {"()"}
          </Styled.Button>
          <Styled.Button $type="operations" onClick={() => onAddValue("|/")}>
            {"√"}
          </Styled.Button>
          <Styled.Button $type="operations" onClick={() => onAddValue("/")}>
            {"/"}
          </Styled.Button>
        </Styled.ButtonsRow>
        <Styled.ButtonsRow>
          <Styled.Button $type="number" onClick={() => onAddValue("1")}>
            1
          </Styled.Button>
          <Styled.Button $type="number" onClick={() => onAddValue("2")}>
            2
          </Styled.Button>
          <Styled.Button $type="number" onClick={() => onAddValue("3")}>
            3
          </Styled.Button>
          <Styled.Button $type="operations" onClick={() => onAddValue("x")}>
            x
          </Styled.Button>
        </Styled.ButtonsRow>
        <Styled.ButtonsRow>
          <Styled.Button $type="number" onClick={() => onAddValue("4")}>
            4
          </Styled.Button>
          <Styled.Button $type="number" onClick={() => onAddValue("5")}>
            5
          </Styled.Button>
          <Styled.Button $type="number" onClick={() => onAddValue("6")}>
            6
          </Styled.Button>
          <Styled.Button $type="operations" onClick={() => onAddValue("-")}>
            -
          </Styled.Button>
        </Styled.ButtonsRow>
        <Styled.ButtonsRow>
          <Styled.Button $type="number" onClick={() => onAddValue("7")}>
            7
          </Styled.Button>
          <Styled.Button $type="number" onClick={() => onAddValue("8")}>
            8
          </Styled.Button>
          <Styled.Button $type="number" onClick={() => onAddValue("9")}>
            9
          </Styled.Button>
          <Styled.Button $type="operations" onClick={() => onAddValue("+")}>
            +
          </Styled.Button>
        </Styled.ButtonsRow>
        <Styled.ButtonsRow>
          <Styled.Button $type="number" onClick={() => onAddValue("0")}>
            0
          </Styled.Button>
          <Styled.Button $type="number" onClick={() => onAddValue(".")}>
            {"."}
          </Styled.Button>
          <Styled.Button
            $type="number"
            onClick={() =>
              setCalculation((calculation) =>
                calculation.substring(0, calculation.length - 1)
              )
            }
          >
            <FontAwesomeIcon icon={faDeleteLeft} />
          </Styled.Button>
          <Styled.Button $type="equal" onClick={() => onFetchResult()}>
            {"="}
          </Styled.Button>
        </Styled.ButtonsRow>
      </Styled.CalculatorContainer>
      <ToastContainer />
    </Styled.Container>
  );
}
