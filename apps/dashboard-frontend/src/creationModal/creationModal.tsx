import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TEvent } from "@/interfaces/interfaces";
import CreationForm from "./creationForm/creationForm";
import { useState } from "react";
import useCreateEvent from "@/hooks/useCreateEvent";
import { defaultFormValues } from "./creationForm/creationFormSchema";

interface IProps {
  createRow: (row: TEvent) => void;
}
const CreationModal = ({ createRow }: IProps) => {
  const onOpenChange = (isOpen: boolean) => setOpen(isOpen);
  const { onSubmit, loading } = useCreateEvent({ createRow, onOpenChange });

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle id="dialog-title">Track new event</DialogTitle>
          <DialogDescription>
            Fill the form below to start tracking a new event.
          </DialogDescription>
        </DialogHeader>
        <CreationForm
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
          loading={loading}
          defaultValues={defaultFormValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreationModal;
