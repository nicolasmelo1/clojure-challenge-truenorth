import type { Meta, StoryObj } from "@storybook/react";

import LoginPageLayout from "./LoginPage.layout";
import { ValidationError } from "../../../core/utils/validate";

const logger = console;

const meta = {
  title: "Login/LoginPage",
  component: LoginPageLayout,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoginPageLayout>;

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
              "login-error": ["Error message"],
            },
          },
        },
      } as any,
    }),
  },
};
