import { deleteEvent } from "@/api/operations";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import { toast } from "sonner";

interface IProps {
  name: string;
  id: string;
  deleteRow: (id: string) => void;
}

const useDeleteEvent = ({ deleteRow, id, name }: IProps) => {
  const handleDelete = async () => {
    const result = await deleteEvent(id);

    if (result?.data?.id) {
      handleSuccess(result.data.id);
    } else {
      handleFailure(extractErrorMessage(result));
    }
  };

  const handleSuccess = (id: string) => {
    deleteRow(id);

    toast.success(`Event ${name} deleted!`);
  };

  const handleFailure = (message: string) => {
    toast.error(message);
  };

  return { handleDelete };
};

export default useDeleteEvent;
