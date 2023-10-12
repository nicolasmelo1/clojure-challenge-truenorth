import type { Meta, StoryObj } from "@storybook/react";

import RandomStringPageLayout from "./RandomStringPage.layout";
import { useState } from "react";

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const meta = {
  title: "Operations/RandomStringPage",
  component: () => {
    const [data, setData] = useState<
      { result: string; balance: number } | undefined
    >();

    return (
      <RandomStringPageLayout
        fetch={() => setData({ result: makeid(10), balance: 0 })}
        error={null}
        data={data}
        isStorybook={true}
      />
    );
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof RandomStringPageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
