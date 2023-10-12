import { useRandomString } from "../../hooks/useRandomString";
import RandomStringPageLayout from "./RandomStringPage.layout";

export default function RandomStringPage() {
  const { error, fetch, data } = useRandomString();

  return <RandomStringPageLayout fetch={fetch} error={error} data={data} />;
}
