import useJsonData from "@/hooks/useJsonData";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { MarkedPosition } from "../NavigateImage/NavigateImage";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
interface MarkedPositionsPageProps {}
const MarkedPositionsPage: React.FC<MarkedPositionsPageProps> = ({}) => {
  const [markedPositions, setMarkedPositions] = useLocalStorageState<
    MarkedPosition[]
  >("markedPositions", []);
  const [formImagePositions, updateFormImagePositions] =
    useJsonData<MarkedPosition[]>("formImagePositions");
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl my-4">Marked Positions: </p>
        <div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setMarkedPositions([]);
              }}
            >
              Clear
            </Button>
            <Button
              onClick={async () => {
                updateFormImagePositions([
                  ...(formImagePositions ?? []),
                  ...markedPositions,
                ]).then(() => {
                  setMarkedPositions([]);
                });
              }}
            >
              Add Positions
            </Button>
          </div>
        </div>
      </div>

      <ImagePositionsTable positions={markedPositions} />

      <div className="h-[1px] my-[100px] bg-gray-500"></div>
      <div className="flex items-center justify-between">
        <p className="text-2xl mb-4">Form Image Positions: </p>
        <div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                updateFormImagePositions([]);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <ImagePositionsTable positions={formImagePositions} />
    </div>
  );
};
export default MarkedPositionsPage;

interface ImagePositionsTableProps {
  positions?: MarkedPosition[];
}
const ImagePositionsTable: React.FC<ImagePositionsTableProps> = ({
  positions,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Text</TableHead>
          <TableHead>Top</TableHead>
          <TableHead>Left</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions?.map((position, i) => (
          <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{position.text}</TableCell>
            <TableCell>{position.position.top}</TableCell>
            <TableCell>{position.position.left}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
