import { useForm } from "react-hook-form";
import { formSchema } from "./creationFormSchema";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreationFormRow from "./creationFormRow";
import CreationFormSlider from "./creationFormSlider";
import CreationFormDropdown from "./creationFormDropdown";
import { zodResolver } from "@hookform/resolvers/zod";

interface IProps {
  loading: boolean;
  defaultValues: Omit<z.infer<typeof formSchema>, "type"> & {
    type: "crosspromo" | "liveops" | "app" | "ads" | undefined;
  };
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const CreationForm = ({ onSubmit, loading, defaultValues }: IProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <CreationFormRow title="Title">
              <Input placeholder="Event name" {...field} />
            </CreationFormRow>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <CreationFormRow title="Description">
              <Input placeholder="Event description" {...field} />
            </CreationFormRow>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <CreationFormRow title="Type">
              <CreationFormDropdown field={field} />
            </CreationFormRow>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => {
            return (
              <CreationFormRow title="Priority">
                <CreationFormSlider value={[field.value]} form={form} />
              </CreationFormRow>
            );
          }}
        />

        <Button type="submit" disabled={loading} role="submit">
          {loading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default CreationForm;
