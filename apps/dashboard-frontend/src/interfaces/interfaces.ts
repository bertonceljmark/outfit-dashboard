import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type TEvent = {
  id: string;
  name: string;
  description: string;
  type: "crosspromo" | "liveops" | "app" | "ads";
  priority: number;
  countryCode?: string;
};

export type TCreateEvent = Omit<TEvent, "id">;

export type TForm = UseFormReturn<TCreateEvent, any, undefined>;

export type TFormField = ControllerRenderProps<
  TCreateEvent,
  keyof TCreateEvent
>;

export type TErrorResponse =
  | {
      error?: string;
      message?: string[] | string;
      statusCode?: number;
      data?: null;
    }
  | undefined;

export type TSuccessResponse<T> = {
  data: T;
};

export type TResponse<T> = XOR<TErrorResponse, TSuccessResponse<T>>;
