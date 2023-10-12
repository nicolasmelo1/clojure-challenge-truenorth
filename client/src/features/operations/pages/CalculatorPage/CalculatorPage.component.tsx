import { useCalculator } from "../../hooks/useCalculator";
import CalculatorPageLayout from "./CalculatorPage.layout";

export default function CalculatorPage() {
  const { fetch, error, data } = useCalculator();

  return <CalculatorPageLayout fetch={fetch} error={error} data={data} />;
}
