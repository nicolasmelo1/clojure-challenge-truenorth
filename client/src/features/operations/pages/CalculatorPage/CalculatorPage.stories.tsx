import type { Meta, StoryObj } from "@storybook/react";

import CalculatorPageLayout from "./CalculatorPage.layout";

const logger = console;

const meta = {
  title: "Operations/CalculatorPage",
  component: CalculatorPageLayout,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof CalculatorPageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    data: undefined,
    error: null,
    fetch: () => logger.log("fetch"),
    isStorybook: true,
  },
};
