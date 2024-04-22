import useJsonData from "@/hooks/useJsonData";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";
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

      <ImagePositionsTable
        positions={markedPositions}
        onDelete={async (position) => {
          setMarkedPositions((positions) =>
            positions.filter((p) => p !== position)
          );
        }}
      />

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

      <ImagePositionsTable
        positions={formImagePositions}
        onDelete={async (position) => {
          if (formImagePositions) {
            await updateFormImagePositions(
              formImagePositions.filter((p) => p !== position)
            );
          }
        }}
      />
    </div>
  );
};
export default MarkedPositionsPage;

interface ImagePositionsTableProps {
  positions?: MarkedPosition[];
  onDelete: (position: MarkedPosition) => Promise<void>;
}
const ImagePositionsTable: React.FC<ImagePositionsTableProps> = ({
  positions,
  onDelete,
}) => {
  const [deletedIndex, setDeletedIndex] = useState(-1);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Text</TableHead>
          <TableHead>Top</TableHead>
          <TableHead>Left</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions?.map((position, i) => (
          <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{position.text}</TableCell>
            <TableCell>{position.position.top}</TableCell>
            <TableCell>{position.position.left}</TableCell>
            <TableCell>
              <DeleteButton
                loading={deletedIndex === i}
                onClick={async () => {
                  setDeletedIndex(i);
                  await onDelete(position);
                  setDeletedIndex(-1);
                }}
              >
                Delete
              </DeleteButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface DeleteButtonProps {
  onClick?: () => void;
  loading: boolean;
  children: string;
}
const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  loading,
  children,
}) => {
  return (
    <Button variant="outline" onClick={onClick} disabled={loading}>
      <span className="flex items-center gap-2">
        {loading ? <Loader size={16} /> : <Trash2 size={16} color="red" />}{" "}
        <span>{children}</span>
      </span>
    </Button>
  );
};
