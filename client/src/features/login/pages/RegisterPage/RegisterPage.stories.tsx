import type { Meta, StoryObj } from "@storybook/react";

import RegisterPage from "./RegisterPage.layout";
import { ValidationError } from "../../../core/utils/validate";

const logger = console;

const meta = {
  title: "Login/RegisterPage",
  component: RegisterPage,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof RegisterPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    onSubmit: () => logger.log("onSubmit"),
    error: null,
    isStorybook: true,
  },
};

export const Error: Story = {
  args: {
    onSubmit: () => logger.log("onSubmit"),
    isStorybook: true,
    error: new ValidationError({
      data: null,
      request: {
        response: {
          data: {
            data: {
              "user-create-error": ["Failed to create user"],
            },
          },
        },
      } as any,
    }),
  },
};
