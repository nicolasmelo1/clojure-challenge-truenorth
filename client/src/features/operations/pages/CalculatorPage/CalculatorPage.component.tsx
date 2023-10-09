import { useState } from "react";
import { Input } from "../../../utils";
import * as Styled from "./CalculatorPage.styles";

export default function CalculatorPage() {
  const [calculation, setCalculation] = useState("");
  const [result, setResult] = useState(undefined);
  const [userBalance, setUserBalance] = useState(0);

  return (
    <Styled.CalculatorPageContainer>
      <Styled.CalculatorContainer>
        <Input
          label="Calculation"
          type="text"
          onChange={setCalculation}
          initialValue={calculation}
        />
        <Styled.ButtonsRow>
          <button>AC</button>
          <button>()</button>
          <button>\|</button>
          <button>/</button>
        </Styled.ButtonsRow>
        <Styled.ButtonsRow>
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>x</button>
        </Styled.ButtonsRow>
        <Styled.ButtonsRow>
          <button>4</button>
          <button>5</button>
          <button>6</button>
          <button>-</button>
        </Styled.ButtonsRow>
        <Styled.ButtonsRow>
          <button>7</button>
          <button>8</button>
          <button>9</button>
          <button>+</button>
        </Styled.ButtonsRow>
        <Styled.ButtonsRow>
          <button>0</button>
          <button>,</button>
          <button>{"B"}</button>
          <button>{"="}</button>
        </Styled.ButtonsRow>
      </Styled.CalculatorContainer>
    </Styled.CalculatorPageContainer>
  );
}
