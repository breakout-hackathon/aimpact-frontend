import { useEffect, useState } from "react";
import Popup from "../common/Popup";

export function IntroPopup() {
  const [showPopup, setShowPopup] = useState(true);

  const setPopupShowTime = () => {
    localStorage.setItem("lastPopupShow", Date.now().toString());
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  }

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = '/api/widget-script';
  //   script.async = true;
  //   document.head.appendChild(script);
    
  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);

  // useEffect(() => {
  //     const rawLastTime = localStorage.getItem("lastPopupShow");
  //     const lastTime = rawLastTime ? parseInt(rawLastTime, 10) : NaN;
  //     if (isNaN(lastTime)) {
  //       setPopupShowTime();
  //       setShowPopup(true);
  //     }
  
  //     const cooldown = 60 * 30 * 1000
  //     const expectedTime = lastTime + cooldown;
  //     if (expectedTime < Date.now()) {
  //       setPopupShowTime();
  //       setShowPopup(true);
  //     }
  //   }, []);

  return (<></>
    // <Popup isShow={showPopup} handleToggle={handleClosePopup}>
    //   <h3 className='text-2xl font-bold mb-4'>You are using AImpact v0.01</h3>
    //   <p className='text-left'>
    //     <br />
    //     You can use the service if you want to, but be ready, it's not in production at the moment.
    //     After launch, all users will have some free messages and also, there will be quests to get more free ones. 
    //     <br /> <br />
    //     At the moment, we removed free messages temporarily, so the service does not get abused while we are not launched, but feel free to buy some if you want to start early and support us.
    //     <br /> <br />
    //     Follow our <a href='https://x.com/ostolex' target='_blank' className='underline'>Twitter</a> to be updated on our launch and other news.
    //   </p>
    // </Popup>

    // <Popup isShow={showPopup} handleToggle={handleClosePopup}>
    //   <div data-youform-open="axqnjquv" data-youform-position="center" />
    //   <button data-youform-open="axqnjquv" data-youform-position="center" >12312312</button>
    // </Popup>
  )
}