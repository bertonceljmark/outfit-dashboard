import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, { message: "Title required" }),
  type: z.enum(["crosspromo", "liveops", "app", "ads"]),
  description: z.string().min(1, { message: "Description required" }),
  priority: z
    .number()
    .max(10, {
      message: "Priority must be less than or equal to 10",
    })
    .min(1, {
      message: "Priority must be greater than or equal to 1",
    }),
});

export const defaultFormValues = {
  name: "",
  type: undefined,
  description: "",
  priority: 1,
};
