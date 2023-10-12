import type { Meta, StoryObj } from "@storybook/react";

import HeadersLayout from "./Headers.layout";
const logger = console;

const meta = {
  title: "Core/Headers",
  component: HeadersLayout,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof HeadersLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    headers: [
      {
        title: "Login",
      },
      {
        title: "Register",
        link: "/register",
      },
    ],
    isLogged: false,
    isStorybook: true,
  },
};

export const LoggedIn: Story = {
  args: {
    headers: [
      {
        title: "User Records",
      },
      {
        title: "Calculator",
        link: "/calculator",
      },
    ],
    isLogged: true,
    logout: () => logger.log("Logout"),
    isStorybook: true,
  },
};
