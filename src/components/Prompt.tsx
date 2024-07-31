import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { copySVG, downloadSVG, exportReactFlowToSVG } from "../utils/svg-export";
import { getNodesBounds, getTransformForBounds, useReactFlow } from "reactflow";
import { CopyIcon, DownloadIcon, Link2Icon, MagicWandIcon, RocketIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useCallback } from "react";

export type PromptProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Prompt = ({ isOpen, onClose }: PromptProps) => {
  const cancelButtonRef = useRef(null);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [hasCopiedSVG, setHasCopiedSVG] = useState(false);
  const { getNodes } = useReactFlow();

  const shareLink = window.location.href;

  const getSVGSource = useCallback(async () => {
    const nodesBounds = getNodesBounds(getNodes());
    const width = nodesBounds.width;
    const height = nodesBounds.height;
    const transform = getTransformForBounds(nodesBounds, width, height, 0.5, 2);
    const cssTransform = `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`;
    return exportReactFlowToSVG(width, height, cssTransform);
  }, [getNodes]);

  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null);
  const needsPreviewBuild = useRef(true);
  useEffect(() => {
    if (!isOpen) {
      needsPreviewBuild.current = true;
      return;
    }

    const buildPreviewImage = async () => {
      const svgSource = await getSVGSource();
      setPreviewImageURL(URL.createObjectURL(new Blob([svgSource], { type: "image/svg+xml" })));
      needsPreviewBuild.current = false;
    };
    buildPreviewImage();
  }, [getSVGSource, isOpen]);

  const handleExportSVGToFile = async () => {
    const svgSource = await getSVGSource();
    downloadSVG(svgSource, "diagram.svg");
  };

  const handleCopySVG = async () => {
    const svgSource = await getSVGSource();
    await copySVG(svgSource);
    setHasCopiedSVG(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setHasCopiedLink(true);
  };

  return (
    <Transition.Root as={Fragment} show={isOpen}>
      <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white bg-opacity-100 transition-opacity" />
        </Transition.Child>

        <div className="overflow-y-auto fixed inset-0 z-10 w-screen">
          <div className="flex justify-center items-end p-4 min-h-full text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="flex overflow-hidden flex-col w-full text-left bg-white rounded shadow-xl max-w-[650px]">
                <Dialog.Title
                  as="h3"
                  className="py-3 px-3 text-base font-semibold leading-6 text-white bg-blue-800"
                >
                  Build your form
                </Dialog.Title>

                <div className="flex flex-col gap-4 py-4 px-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium leading-6 text-gray-900">
                      How would you like to create this form?
                    </label>
                    <div className="flex gap-2">
                      {/* copy to clipboard */}
                      <button
                        className="flex flex-1 gap-2 justify-center items-center py-3 px-2 text-xs leading-none text-blue-700 rounded shadow-sm bg-blue-700/30 hover:bg-blue-700/40 border border-blue-700 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        type="button"
                        // onClick={handleCopySVG}
                      >
                        Describe
                      </button>

                      <button
                        className="flex flex-1 gap-2 justify-center items-center py-3 px-2 text-xs leading-none text-blue-700 rounded shadow-sm bg-gray-100 hover:bg-blue-700/30 border border-blue-700 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        type="button"
                        // onClick={handleExportSVGToFile}
                      >
                        Import questions
                      </button>

                      <button
                        className="flex flex-1 gap-2 justify-center items-center py-3 px-2 text-xs leading-none text-blue-700 rounded shadow-sm bg-gray-100 hover:bg-blue-700/30 border border-blue-700 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        type="button"
                        // onClick={handleExportSVGToFile}
                      >
                        Import form
                      </button>

                      <button
                        className="flex flex-1 gap-2 justify-center items-center py-3 px-2 text-xs leading-none text-blue-700 rounded shadow-sm bg-gray-100 hover:bg-blue-700/30 border border-blue-700 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        type="button"
                        // onClick={handleExportSVGToFile}
                      >
                        From PDF
                      </button>
                    </div>
                  </div>

                  {/* share link */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium leading-6 text-gray-900">
                      Describe the form you'd like
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <div className="flex relative flex-grow items-stretch focus-within:z-10">
                        <textarea
                          className="block py-1.5 px-2 w-full rounded-none rounded-l-md border-0 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset focus:ring-indigo-600 placeholder:text-gray-400"
                          id="description"
                          name="description"
                          placeholder="A form to..."
                          // value={shareLink}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center p-3 sm:flex-row-reverse sm:justify-start">
                  <button
                    ref={cancelButtonRef}
                    className="flex flex-1 gap-2 justify-center items-center py-3 px-2 text-sm leading-none text-white rounded shadow-sm sm:flex-grow-0 bg-blue-700/90 hover:bg-blue-700/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    type="button"
                    onClick={onClose}
                  >
                    Generate
                    {/* <RocketIcon /> */}
                    <MagicWandIcon />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
