import type { Meta, StoryObj } from "@storybook/react";

import Selector from "./Selector.component";
import { ComponentProps } from "react";

const logger = console;

const meta = {
  title: "Core/Selector",
  component: (props: ComponentProps<typeof Selector>) => (
    <div style={{ width: 100, height: 100 }}>
      <Selector {...props} />
    </div>
  ),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Selector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: "Select",
    options: [
      {
        value: "1",
        label: "Option 1",
      },
      {
        value: "2",
        label: "Option 2",
      },
      {
        value: "3",
        label: "Option 3",
      },
    ],
    clickOnSameOptionToUnselect: false,
    onSelectOption: (value) => logger.log("onSelectOption:", value),
    closeOnSelect: false,
    searchPlaceholder: "Search",
    showSearch: true,
  },
};

export const ClickOnSameToUnselect: Story = {
  args: {
    label: "Select",
    options: [
      {
        value: "1",
        label: "Option 1",
      },
      {
        value: "2",
        label: "Option 2",
      },
      {
        value: "3",
        label: "Option 3",
      },
    ],
    clickOnSameOptionToUnselect: true,
    onSelectOption: (value) => logger.log("onSelectOption:", value),
    closeOnSelect: false,
    searchPlaceholder: "Search",
    showSearch: true,
  },
};

export const CloseOnSelect: Story = {
  args: {
    label: "Select",
    options: [
      {
        value: "1",
        label: "Option 1",
      },
      {
        value: "2",
        label: "Option 2",
      },
      {
        value: "3",
        label: "Option 3",
      },
    ],
    clickOnSameOptionToUnselect: true,
    onSelectOption: (value) => logger.log("onSelectOption:", value),
    closeOnSelect: true,
    searchPlaceholder: "Search",
    showSearch: true,
  },
};

export const WithoutSearch: Story = {
  args: {
    label: "Select",
    options: [
      {
        value: "1",
        label: "Option 1",
      },
      {
        value: "2",
        label: "Option 2",
      },
      {
        value: "3",
        label: "Option 3",
      },
    ],
    clickOnSameOptionToUnselect: true,
    onSelectOption: (value) => logger.log("onSelectOption:", value),
    closeOnSelect: true,
    searchPlaceholder: "Search",
    showSearch: false,
  },
};
