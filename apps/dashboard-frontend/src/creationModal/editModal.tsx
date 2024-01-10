import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TEvent } from "@/interfaces/interfaces";
import CreationForm from "./creationForm/creationForm";
import useEditEvent from "@/hooks/useEditEvent";

interface IProps {
  rowData: TEvent;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  updateRow: (row: TEvent) => void;
}

const EditModal = ({ updateRow, rowData, open, setOpen }: IProps) => {
  const onOpenChange = (isOpen: boolean) => setOpen(isOpen);
  const { onSubmit, loading } = useEditEvent({
    rowData,
    updateRow,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="truncate max-w-80">
            Edit event {rowData.name}
          </DialogTitle>
          <DialogDescription>
            Edit the form below to update the event.
          </DialogDescription>
        </DialogHeader>
        <CreationForm
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
          loading={loading}
          defaultValues={rowData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
