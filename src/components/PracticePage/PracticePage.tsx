import { useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */
interface PracticePageProps {}
const PracticePage: React.FC<PracticePageProps> = ({}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<any[]>([]);
  return (
    <div>
      <div className="h-screen flex">
        <div
          ref={divRef}
          className="h-full relative"
          onClick={(e) => {
            const divE = divRef.current!;
            const width = divE.clientWidth ?? 0;
            const height = divE.clientHeight ?? 0;
            const leftOffset = Math.floor((e.clientX / width) * 100);
            const topOffset = Math.floor((e.clientY / height) * 100);

            const text = prompt();
            const newValue = {
              text,
              position: { top: `${topOffset}%`, left: `${leftOffset}%` },
            };
            console.log(newValue);
            setValues([...values, newValue]);
          }}
        >
          <div
            className="absolute h-[20px] w-[20px] rounded-full bg-red-500"
            style={{
              top: `${46}%`,
              left: `${87}%`,
            }}
          ></div>
          <img src="/form_image.png" alt="form image" className="h-full" />
        </div>
      </div>
    </div>
  );
};
export default PracticePage;
