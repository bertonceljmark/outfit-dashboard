import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TFormField } from "@/interfaces/interfaces";
//crosspromo, liveops, app, ads
const eventTypes = [
  { value: "crosspromo", label: "Crosspromo" },
  { value: "liveops", label: "Liveops" },
  { value: "app", label: "App" },
  { value: "ads", label: "Ads" },
];

interface IProps {
  field: TFormField;
}

const CreationFormDropdown = ({ field }: IProps) => {
  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value as string | undefined}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select type of event to track" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {eventTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CreationFormDropdown;
