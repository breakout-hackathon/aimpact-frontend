import { useEffect, useState } from "react";
import Popup from "./Popup";
import { Button } from "../ui";

export default function OnlyDesktopMessage() {
  const [showWarning, setShowWarning] = useState(true);
  const [alreadyShowed, setAlreadyShowed] = useState(false);
  
  const handleCloseWarn = () => {
    setShowWarning(false);
    localStorage.setItem("mobileWarningShow", Date.now().toString())
  }

  useEffect(() => {
    const rawLastTime = localStorage.getItem("mobileWarningShow") || "0";
    const lastTime = parseInt(rawLastTime);

    const cooldown = 60 * 60 * 4 * 1000
    const expectedTime = lastTime + cooldown;
    console.log(lastTime, expectedTime, expectedTime < Date.now())
    if (isNaN(lastTime) || expectedTime < Date.now()) {
      setAlreadyShowed(false);
    } else {
      setAlreadyShowed(true);
    }
  }, [])

  return (
    <Popup isShow={showWarning && !alreadyShowed} handleToggle={handleCloseWarn} positionClasses="w-full m-8" closeByTouch={false}>
      <div className="flex flex-col gap-5">
        <h1 className="font-bold text-orange-300 text-3xl">Warning</h1>
        <p className="text-xl">
          AImpact is not optimized for mobile. You may encounter difficulties when working on mobile devices. <br /> <br />
          <span className="font-bold">We recommend using app on a desktop computer!</span>
        </p>

        <Button onClick={handleCloseWarn} className="mx-auto px-12 text-xl">Close</Button>
      </div>
    </Popup>
  )
}