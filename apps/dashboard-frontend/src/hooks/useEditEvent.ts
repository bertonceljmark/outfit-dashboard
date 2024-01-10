import { formSchema } from "@/creationModal/creationForm/creationFormSchema";
import { editEvent } from "@/api/operations";
import { TEvent } from "@/interfaces/interfaces";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";

interface IProps {
  rowData: TEvent;
  updateRow: (data: TEvent) => void;
  onOpenChange: (isOpen: boolean) => void;
}

const useEditEvent = ({ updateRow, onOpenChange, rowData }: IProps) => {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (form: z.infer<typeof formSchema>) => {
    setLoading(true);

    const response = await editEvent(form, rowData.id);

    setLoading(false);

    if (response?.data) {
      handleSuccess(response.data);
    } else {
      handleFailure(extractErrorMessage(response?.message));
    }
  };

  const handleSuccess = (data: TEvent) => {
    updateRow(data);
    onOpenChange(false);

    toast.success(`Event ${data.name} edited!`);
  };

  const handleFailure = (message: string) => {
    toast.error(message);
  };

  return { onSubmit, loading };
};

export default useEditEvent;
