import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/button";

interface HomePageProps {}
const HomePage: React.FC<HomePageProps> = ({}) => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);
  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/answer-evaluator">
        <Button>Answer Evaluator</Button>
      </Link>
    </div>
  );
};
export default HomePage;
