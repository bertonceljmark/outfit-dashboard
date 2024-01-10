import { formSchema } from "@/creationModal/creationForm/creationFormSchema";
import { addEvent } from "@/api/operations";
import { TEvent } from "@/interfaces/interfaces";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";

interface IProps {
  createRow: (data: TEvent) => void;
  onOpenChange: (isOpen: boolean) => void;
}

const useCreateEvent = ({ createRow, onOpenChange }: IProps) => {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (form: z.infer<typeof formSchema>) => {
    setLoading(true);

    const response = await addEvent(form);

    setLoading(false);

    if (response?.data) {
      handleSuccess(response.data);
    } else {
      handleFailure(extractErrorMessage(response?.message));
    }
  };

  const handleSuccess = (data: TEvent) => {
    createRow(data);
    onOpenChange(false);

    toast.success(`Event ${data.name} created!`);
  };

  const handleFailure = (message: string) => {
    toast.error(message);
  };

  return { onSubmit, loading };
};

export default useCreateEvent;
