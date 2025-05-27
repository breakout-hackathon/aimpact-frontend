import { workbenchStore } from "~/lib/stores/workbench";
import { IconButton } from "../ui";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import CustDevPopup from "./CustDevPopup";

export default function Footer() {
  const [custIsOpen, setCustIsOpen] = useState(false);
  const custHandleToggle = () => {
    console.log(custIsOpen);
    setCustIsOpen(!custIsOpen);
  }

  return (
    <footer className="pb-2.5 px-2.5 absolute bottom-0 w-full">
      {/* Bug bounty button and Cast-Dev popup  */}
      <div className="relative w-full flex justify-between items-center">
        <div>
          <div className="flex flex-col gap-2">
            <a href="https://forms.gle/RQs67LKavBFiP1JL8" target="_blank">
              <IconButton className="text-4xl">
                <div className="i-bolt:bugbounty text-gray-400 hover:text-purple-400"></div>
              </IconButton>
            </a>
            <IconButton className="text-4xl" onClick={custHandleToggle}>
              <div className="i-bolt:custdev text-gray-400 hover:text-purple-400" />
            </IconButton>
            {custIsOpen && <CustDevPopup handleToggle={custHandleToggle} />}
          </div>
        </div>

        <div className="flex gap-2 text-4xl margin-0 p-0 flex-col">
          <a href="https://x.com/ostolex" target="_blank">
            <IconButton>
              <div className="i-ph:x-logo text-gray-400 hover:text-purple-400" />
            </IconButton>
          </a>

          <a href="https://discord.gg/bRXXS9cE" target="_blank" className="margin-0 p-0">
            <IconButton>
              <div className="i-ph:discord-logo text-gray-400 hover:text-purple-400 text-4xl" />
            </IconButton>
          </a>
        </div>
      </div>
    </footer>
  )
}