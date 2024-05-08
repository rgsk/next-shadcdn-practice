import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface GenerateRadioProps {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (v: string) => void;
}
const GenerateRadio: React.FC<GenerateRadioProps> = ({
  options,
  value,
  onValueChange,
}) => {
  return (
    <div>
      <RadioGroup value={value} onValueChange={onValueChange}>
        {options.map((option) => {
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
export default GenerateRadio;
