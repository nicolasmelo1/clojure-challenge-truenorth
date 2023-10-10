import { AxiosError } from "axios";
import * as z from "zod";

import { ArrayElement, ValidationErrorDataType } from "../hooks/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidationError<T, D = T, ED = any> {
  data: ValidationErrorDataType<
    T extends readonly unknown[] ? ArrayElement<T> : T
  > | null;
  request!: AxiosError<D, T> | null;
  extraData?: ED;

  constructor({
    data,
    request,
    extraData,
  }: {
    data: ValidationErrorDataType<
      T extends readonly unknown[] ? ArrayElement<T> : T
    > | null;
    request: AxiosError<D, T> | null;
    extraData?: ED;
  }) {
    this.data = data;
    this.request = request;
    this.extraData = extraData;
  }
}

/**
 * Used for validating if a given data received or that is being sent to the backend matches
 * the passed DTO class.
 * @param schema - The zod schema to validate against.
 * @param data - The data to validate against the dto.
 */
export async function validateData<
  TSchema extends z.ZodType,
  T extends object | T[]
>(schema: TSchema, data: T) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrorData: ValidationErrorDataType<T> = {};
      for (const propertyError of error.issues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let objectToAppendErrorTo: any = validationErrorData;
        let path = propertyError.path[0];
        for (let i = 1; i < propertyError.path.length; i++) {
          path = propertyError.path[i];
          if (objectToAppendErrorTo[path] === undefined)
            objectToAppendErrorTo[path] = {};
          objectToAppendErrorTo = objectToAppendErrorTo[path];
        }

        if (objectToAppendErrorTo[path]) {
          objectToAppendErrorTo[path].push(propertyError.message);
        } else {
          objectToAppendErrorTo[path] = [propertyError.message];
        }
      }
      throw new ValidationError<z.infer<TSchema> | z.infer<TSchema>[]>({
        data: validationErrorData,
        request: null,
      });
    }
    throw error;
  }
}
