import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/moving-border";
import { TextGenerateEffect } from "../ui/text-generate-effect";

interface SampleAceternityProps {}
const SampleAceternity: React.FC<SampleAceternityProps> = ({}) => {
  return (
    <div>
      <ModeToggle />
      <TextGenerateEffect words="Hii, How are you?" />
      <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        Borders are cool
      </Button>
    </div>
  );
};
export default SampleAceternity;
