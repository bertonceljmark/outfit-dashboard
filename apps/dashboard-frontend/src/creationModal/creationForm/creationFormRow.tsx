import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface IProps {
  title: string;
  children: React.ReactNode;
}
const CreationFormRow = ({ title, children }: IProps) => {
  return (
    <FormItem>
      <FormLabel>{title}</FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default CreationFormRow;
