import { useEffect, useState } from "react";
import * as Styled from "./Selector.styles";
import { useClickOutside } from "../../hooks";

type Props<TClickOnSameOptionToUnselect extends boolean = false> = {
  label: JSX.Element | string;
  searchPlaceholder?: string;
  onSelectOption?: (
    option:
      | Props["options"][number]["value"]
      | (TClickOnSameOptionToUnselect extends true ? undefined : never)
  ) => void;
  selectedOption?:
    | Props["options"][number]
    | (TClickOnSameOptionToUnselect extends true ? undefined : never);
  closeOnSelect?: boolean;
  clickOnSameOptionToUnselect?: TClickOnSameOptionToUnselect;
  showSearch?: boolean;
  options: {
    label: string | (() => JSX.Element);
    value: string;
  }[];
};
export default function Selector<
  TClickOnSameOptionToUnselect extends boolean = false
>(props: Props<TClickOnSameOptionToUnselect>) {
  const [options, setOptions] = useState(props.options);
  const [filter, setFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState<
    Props["options"][number] | undefined
  >(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const clickOutsideRef = useClickOutside(() => {
    setIsDropdownOpen(false);
    setFilter("");
  });

  function onSelectOption(option: Props["options"][number] | undefined) {
    if (
      props.clickOnSameOptionToUnselect &&
      selectedOption?.value === option?.value
    )
      option = undefined;
    setSelectedOption(option);
    props.onSelectOption?.(
      option?.value as
        | Props["options"][number]["value"]
        | (TClickOnSameOptionToUnselect extends true ? undefined : never)
    );
    if (props.closeOnSelect) setIsDropdownOpen(false);
  }
  useEffect(() => {
    if (JSON.stringify(options) !== JSON.stringify(props.options))
      setOptions(props.options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.options]);

  useEffect(() => {
    const receivedSelectedOptions = props.selectedOption as
      | Props["options"][number]
      | undefined;

    const areInternalAndExternalStateEqual =
      (selectedOption === undefined && props.selectedOption === undefined) ||
      selectedOption?.value === receivedSelectedOptions?.value;
    if (!areInternalAndExternalStateEqual)
      setSelectedOption(props.selectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption]);
  return (
    <Styled.Container ref={clickOutsideRef}>
      <Styled.Option
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        {selectedOption
          ? typeof selectedOption.label === "string"
            ? selectedOption.label
            : selectedOption.label()
          : props.label}
      </Styled.Option>
      {isDropdownOpen ? (
        <Styled.DropdownContainer>
          {props.showSearch !== false ? (
            <input
              type="text"
              placeholder={props.searchPlaceholder || "Search..."}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setOptions(
                  props.options.filter((option) =>
                    typeof option.label === "string"
                      ? option.label.includes(e.target.value)
                      : true
                  )
                );
              }}
            />
          ) : null}
          <Styled.OptionsList>
            {options.map((option) => (
              <Styled.Option
                key={option.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectOption(option);
                }}
              >
                {typeof option.label === "string"
                  ? option.label
                  : option.label()}
              </Styled.Option>
            ))}
          </Styled.OptionsList>
        </Styled.DropdownContainer>
      ) : null}
    </Styled.Container>
  );
}
