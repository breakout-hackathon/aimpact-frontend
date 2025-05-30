import { classNames } from "~/utils/classNames";
import { Button } from "../ui";
import waterStyles from '../ui/WaterButton.module.scss';
import { useState } from "react";

export default function getMessagesButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        className={classNames(
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-300',
          waterStyles.waterButton,
          waterStyles.green,
        )}
        onClick={handleToggle}
      >
        <div className={waterStyles.effectLayer}>
          <div className={waterStyles.waterDroplets}></div>
          <div className={waterStyles.waterSurface}></div>
        </div>
        <div className={waterStyles.buttonContent}>
          Get Free Messages!
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex relative items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={handleToggle}></div>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform border-2 border-bolt-elements-borderColor rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <button
                onClick={handleToggle}
                className="flex absolute right-0 items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-gray-500/10 dark:hover:bg-gray-500/20 group transition-all duration-200"
              >
                <div className="i-ph:x w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-500 transition-colors" />
              </button>

              <div className="px-4 py-5 sm:p-6 bg-bolt-elements-background bg-bolt-elements-background-depth-3 text-center">
                <h3 className="text-2xl font-bold mb-4">Free messages quest</h3>
                <p><b>Comming soon...</b></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}