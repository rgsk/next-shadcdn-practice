import useLocalStorageState from "@/hooks/useLocalStorageState";
import { MarkedPosition } from "../NavigateImage/NavigateImage";
import { Button } from "../ui/button";

interface MarkedPositionsPageProps {}
const MarkedPositionsPage: React.FC<MarkedPositionsPageProps> = ({}) => {
  const [markedPositions, setMarkedPositions] = useLocalStorageState<
    MarkedPosition[]
  >("markedPositions", []);
  return (
    <div>
      <div className="p-4">
        <div className="flex gap-4">
          <Button onClick={async () => {}}>Add Positions</Button>
          <Button onClick={async () => {}}>Replace Positions</Button>
        </div>
      </div>
      <textarea
        value={JSON.stringify(markedPositions, null, 2)}
        onChange={(e) => {
          setMarkedPositions(JSON.parse(e.target.value));
        }}
        className="w-full h-[500px]"
      />
    </div>
  );
};
export default MarkedPositionsPage;
