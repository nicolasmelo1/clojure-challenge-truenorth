import { useState } from "react";

type Props = {
  initialValue: string;
  onChange: (value: string) => void;
  label: string;
  showLabel?: boolean;
  type?: string;
  disabled?: boolean;
};

export default function Input(props: Props) {
  const [value, setValue] = useState(props.initialValue || "");
  return (
    <label>
      {props.showLabel === false ? null : <p>{props.label}</p>}
      <input
        type={props.type || "text"}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange(e.target.value);
        }}
      />
    </label>
  );
}
