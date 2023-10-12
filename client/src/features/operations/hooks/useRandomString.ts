import * as z from "zod";
import { MutationTypes, useMutate } from "../../core";

const randomStringSchema = z.object({
  type: z.literal("random-string"),
});
export function useRandomString() {
  const { mutate, error, data } = useMutate<
    z.infer<typeof randomStringSchema>,
    {
      result: string;
      balance: number;
    }
  >(
    MutationTypes.POST,
    ["operations", "new", "random-string"],
    "/operations/new",
    randomStringSchema,
    {
      customRequestParams: {
        isAuthenticated: true,
      },
    }
  );

  return {
    fetch: () =>
      mutate({
        data: {
          type: "random-string",
        },
      }),
    error,
    data,
  };
}
