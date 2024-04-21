import dynamic from "next/dynamic";
const MarkedPositionsPage = dynamic(
  () => import("@/components/MarkedPositionsPage/MarkedPositionsPage"),
  {
    ssr: false,
  }
);

const Page = () => {
  return <MarkedPositionsPage />;
};
export default Page;
