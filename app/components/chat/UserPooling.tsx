import { useEffect, useState } from "react";
import Popup from "../common/Popup";
import { classNames } from "~/utils/classNames";
import { range } from "~/utils/range";
import { usePostNPS } from "~/lib/hooks/tanstack/useAnalytics";

function UserPoolingPopup() {
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex relative items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">

    </div>
  </div>
}

export default function UserPooling() {
  const [showNPS, setShowNPS] = useState(false);
  const [showPMF, setShowPMF] = useState(false);
  const { mutateAsync: postNPS } = usePostNPS();

  // const npsColors: string[] = (range(1, 9).map(i => `bg-green-${i * 100}`));
  // npsColors.push("bg-green-950");
  const npsColors = [
    'bg-red-600',
    'bg-red-500',
    'bg-orange-500', 
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
  ];

  const handleGradeClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event.currentTarget.id);
    const grade = parseInt(event.currentTarget.id);
    try {
      if (isNaN(grade)) {
        throw new Error("WTF, grade is string");
      }
      await postNPS({ grade });
    } catch (error) {
      console.error("Failed to post NPS data", error);
    } finally {
      setShowNPS(false);
    }
  }

  const handleNPS = () => {
    setShowNPS(!showNPS);
  }

  const handlePMF = () => {
    setShowPMF(!showPMF);
  }

  useEffect(() => {
    const userVisits = parseInt(localStorage.getItem("userVisits") || "1");
    const lastUserVisit = parseInt(localStorage.getItem("lastUserVisit") || "0");
    if (userVisits % 10 === 0) {
      setShowNPS(true);
    } else if (userVisits === 3 || userVisits % 18 === 0) {
      setShowPMF(true);
    }

    const userVisitCooldown = 3 * 60 * 60 * 1000;
    if (lastUserVisit + userVisitCooldown < Date.now()) {
      localStorage.setItem("userVisits", (userVisits + 1).toString());
      localStorage.setItem("lastUserVisit", Date.now().toString())
    }
  })

  return (
    <Popup isShow={showNPS} handleToggle={handleNPS} positionClasses="sm:my-12">
      <h3 className="text-2xl mb-8">How likely you are to recommend Aimpact to a friend?</h3>
      <div className="flex w-full justify-between mb-4">
        {range(0, 9).map(i => (
          <div
            key={i}
            id={i.toString()}
            className={classNames(`${npsColors[i]} px-3 py-2 rounded-sm cursor-pointer text-white
              transition-transform hover:scale-[108%] duration-200 ease-in-out`)}
            onClick={handleGradeClick}>
            <p>{i + 1}</p>
          </div>
        ))}
      </div>
    </Popup>
  )
}