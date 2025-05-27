import { workbenchStore } from "~/lib/stores/workbench";
import { IconButton } from "../ui";
import { useStore } from "@nanostores/react";

export default function Footer() { 
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  if (showWorkbench) { // TODO: It's not really good syntax
    return;
  }

  return (
    <footer className="pb-2.5 px-2.5 absolute bottom-0 w-full">
      {/* Bug bounty button and Cast-Dev popup  */}
      <div className="relative w-full flex justify-between items-center">
        <div>
          <div className="flex flex-col gap-2">
            <IconButton className="text-4xl">
              <div className="i-bolt:bugbounty text-gray-400 hover:text-purple-400"></div>
            </IconButton>
            <IconButton className="text-4xl">
              <div className="i-bolt:custdev text-gray-400 hover:text-purple-400"></div>
            </IconButton>
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