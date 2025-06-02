import { classNames } from "~/utils/classNames";
import { Button } from "../ui";
import waterStyles from '../ui/WaterButton.module.scss';
import { useEffect, useState, type FormEvent, type FormEventHandler } from "react";
import { useRequestMessages } from "~/lib/hooks/tanstack/useMessages";
import { toast } from "react-toastify";

interface VerifyButtonsProps {
  actionButtonText?: string;
  verifyButtonText?: string;
  handleVerifyClick: () => void;
  handleActionClicked: () => void;
  disableVerify: boolean;
  actionLink: string;
  completed: boolean;
  actionClicked: boolean;
}

function VerifyButtons(
  { actionButtonText="Subscribe", verifyButtonText="Verify", handleVerifyClick, handleActionClicked,
    actionLink, disableVerify, completed, actionClicked }: VerifyButtonsProps
) {

  return (
    <div className="flex gap-2">
      <a href={actionLink} target="_blank">
        <Button variant="default" disabled={completed} onClick={handleActionClicked}>
          {actionButtonText}
        </Button>
      </a>
    </div>
  )
}

export default function getMessagesButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [verifyClicked, setVerifyClicked] = useState(false);
  const [disableVerify, setDisableVerify] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionClicked, setActionClicked] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState("");
  const { mutateAsync: requestMessages } = useRequestMessages();

  const twitterHandleRegex = /^@?[A-Za-z0-9_]{1,15}$/;

  const handleTwitterHandleInput = (event: FormEvent<HTMLInputElement>) => {
    setTwitterHandle(event.currentTarget.value);
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const handleActionClicked = async () => {
    if (verifyClicked) {
      setDisableVerify(false);
    } else {
      await sleep(2000);
      setActionClicked(true);
    }
  }

  const validateTwitterHandle = (twitterHandle: string) => {
    return twitterHandleRegex.test(twitterHandle);
  }

  const handleVerifyClicked = async () => {
    console.log(verifyClicked);
    const delay = Math.random() * 1.2 + 1 * 1000;
    await sleep(delay);

    if (validateTwitterHandle(twitterHandle)) {
      setError("Invalid twitter handle.")
    }

    if (!verifyClicked) {
      setError("Failed to verify tasks. Looks like you didn't subscribed. Try again");
      setVerifyClicked(true);
      setDisableVerify(true);
    } else {
      setError("");
      try {
        await requestMessages({ twitterHandle });
        toast.info("Your messages will appear shortly!", { autoClose: false });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message;
        toast.error(`Failed to request free messages: ${errorMessage}`);
        return;
      }
      setTasksCompleted(true);
      localStorage.setItem("tasksCompelted", "true");
    }
  }

  useEffect(() => {
    setTasksCompleted(!!localStorage.getItem("tasksCompelted"));
  }, [])

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
                <div className="text-left mb-4">
                  <h4 className="text-xl font-bold mb-2">Tasks</h4>
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="flex justify-between items-center px-0.5">
                      <div className="flex gap-2 items-center justify-center">
                        <p>Subscribe to @ostolex on X</p>
                        {tasksCompleted && <div className="i-ph:check-circle text-green text-xl" />}
                      </div>
                      <VerifyButtons completed={tasksCompleted} disableVerify={disableVerify} actionClicked={actionClicked}
                        handleVerifyClick={handleVerifyClicked} actionLink="https://x.com/ostolex" handleActionClicked={handleActionClicked} />
                    </div>
                  </div>

                  <div className="flex gap-2 items-center justify-between px-0.5">
                    <label>Twitter handle:</label>
                    <div className="border border-bolt-elements-borderColor rounded-md flex p-0.5 bg-white">
                      <div className="flex gap-1 mr-1">
                        <p className="text-black">@</p>
                      </div>
                      <input className="border-none" required onInput={handleTwitterHandleInput} value={twitterHandle} placeholder="username" />
                    </div>
                  </div>

                  <p className={classNames(
                    error ? "text-red-700" : "text-white",
                    "text-sm text-center h-[20px]"
                  )}>{error || message}</p>
                </div>

                {tasksCompleted ? (
                  <Button variant="default" className="px-10 py-2.5 text-lg" onClick={handleToggle} disabled={!tasksCompleted}>
                    Close
                  </Button>
                ) : (
                  <Button variant="default" disabled={!twitterHandle || !actionClicked || disableVerify} onClick={handleActionClicked} className="px-10 py-2.5 text-lg">
                    Verify
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}