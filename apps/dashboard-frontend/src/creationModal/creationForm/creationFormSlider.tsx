import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TForm } from "@/interfaces/interfaces";

interface IProps {
  value: number[];
  form: TForm;
}
const CreationFormSlider = ({ value, form }: IProps) => {
  const handleChange = (value: number[]) => {
    form.setValue("priority", value[0]);
  };

  return (
    <div className="flex items-center gap-4">
      <Slider
        max={10}
        min={1}
        step={1}
        value={value}
        onValueChange={handleChange}
      />
      <Label className="w-10 h-8 text-lg text-center rounded-md border border-zinc-500">
        {value}
      </Label>
    </div>
  );
};

export default CreationFormSlider;
