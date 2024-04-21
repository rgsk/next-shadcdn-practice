import Link from "next/link";

interface HomePageProps {}
const HomePage: React.FC<HomePageProps> = ({}) => {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/navigate-image">Navigate Image</Link>
      <Link href="/transcribe-text">Transcribe Text</Link>
    </div>
  );
};
export default HomePage;
