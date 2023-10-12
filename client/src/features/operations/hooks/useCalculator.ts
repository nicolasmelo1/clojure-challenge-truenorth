import * as z from "zod";
import { MutationTypes, useMutate } from "../../core";

const expressionStringSchema = z.object({
  type: z.literal("expression"),
  expression: z.string().min(1),
});

export function useCalculator() {
  const { mutate, error, data } = useMutate<
    z.infer<typeof expressionStringSchema>,
    {
      result: string;
      balance: number;
    }
  >(
    MutationTypes.POST,
    ["operations", "new", "expression"],
    "/operations/new",
    expressionStringSchema,
    {
      customRequestParams: {
        isAuthenticated: true,
      },
    }
  );

  return {
    fetch: (expression: string) =>
      mutate({
        data: {
          type: "expression",
          expression,
        },
      }),
    error,
    data,
  };
}
