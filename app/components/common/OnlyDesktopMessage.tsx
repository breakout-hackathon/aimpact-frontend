import { useEffect, useState } from "react";
import Popup from "./Popup";
import { Button } from "../ui";

export default function OnlyDesktopMessage() {
  const [showWarning, setShowWarning] = useState(true);
  const [alreadyShowd, setAlreadyShowed] = useState(false);
  
  const handleCloseWarn = () => {
    setShowWarning(false);
    localStorage.setItem("mobileWarningShow", "true")
  }

  useEffect(() => {
    if (localStorage.getItem("mobileWarningShow")) {
      setAlreadyShowed(true);
    }
  }, [])

  return (
    <Popup isShow={showWarning} handleToggle={handleCloseWarn} positionClasses="w-full m-8" closeByTouch={false}>
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