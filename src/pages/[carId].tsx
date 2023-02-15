import { Fragment, useState } from "react";

import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";

import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "../utils/api";

// TODO change icons
const messageType = [
  {
    name: "Parken",
    value: "parking",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Tanken",
    value: "fuel",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Schaden",
    value: "damage",
    icon: FaceSmileIcon,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Reinigung",
    value: "clean",
    icon: FaceFrownIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Flüssigkeiten",
    value: "fluids",
    icon: HandThumbUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "Nicht spezifiziert",
    value: null,
    icon: XMarkIcon,
    iconColor: "text-gray-400",
    bgColor: "bg-transparent",
  },
];

const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function CarDetails() {
  const [selected, setSelected] = useState(messageType[5]);
  const [message, setMessage] = useState("");

  const { data: sessionData } = useSession();
  const { carId } = useRouter().query;

  // TODO paginate query
  const { data: carMessages } = api.car.messages.useQuery(
    {
      carId: carId as string,
    },
    { enabled: carId !== undefined }
  );

  return (
    <>
      {sessionData && (
        <>
          <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
            Nachrichten - {carMessages?.licencePlate}
          </h3>
          <div className="mt-4 flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Image
                className="inline-block h-10 w-10 rounded-full"
                src={sessionData?.user?.image as string}
                alt={`image of ${sessionData?.user?.name as string}`}
                height={600}
                width={450}
              />
            </div>
            <div className="min-w-0 flex-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(message);
                }}
                className="relative"
              >
                <div className="overflow-hidden rounded-lg border border-gray-300 p-1 shadow-sm">
                  <label htmlFor="comment" className="sr-only">
                    Add your comment
                  </label>
                  <textarea
                    rows={3}
                    name="comment"
                    id="comment"
                    className="block w-full resize-none border-0 py-3  sm:text-sm"
                    placeholder="Add your comment..."
                    defaultValue={""}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  {/* Spacer element to match the height of the toolbar */}
                  <div className="py-2" aria-hidden="true">
                    {/* Matches height of button in toolbar (1px border + 36px content height) */}
                    <div className="py-px">
                      <div className="h-9" />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                  <div className="flex items-center space-x-5">
                    <div className="flex items-center">
                      <Listbox value={selected} onChange={setSelected}>
                        {({ open }) => (
                          <>
                            <Listbox.Label className="sr-only">
                              {" "}
                              Your mood{" "}
                            </Listbox.Label>
                            <div className="relative">
                              <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                                <span className="flex items-center justify-center">
                                  {selected.value === null ? (
                                    <span>
                                      {/* TODO change icon */}
                                      <FaceSmileIcon
                                        className="h-5 w-5 flex-shrink-0"
                                        aria-hidden="true"
                                      />
                                      <span className="sr-only">
                                        {" "}
                                        Nachrichtentyp festlegen{" "}
                                      </span>
                                    </span>
                                  ) : (
                                    <span>
                                      <span
                                        className={classNames(
                                          selected.bgColor,
                                          "flex h-8 w-8 items-center justify-center rounded-full"
                                        )}
                                      >
                                        <selected.icon
                                          className="h-5 w-5 flex-shrink-0 text-white"
                                          aria-hidden="true"
                                        />
                                      </span>
                                      <span className="sr-only">
                                        {selected.name}
                                      </span>
                                    </span>
                                  )}
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                                  {messageType.map((mtype) => (
                                    <Listbox.Option
                                      key={mtype.value}
                                      className={({ active }) =>
                                        classNames(
                                          active ? "bg-gray-100" : "bg-white",
                                          "relative cursor-default select-none py-2 px-3"
                                        )
                                      }
                                      value={mtype}
                                    >
                                      <div className="flex items-center">
                                        <div
                                          className={classNames(
                                            mtype.bgColor,
                                            "flex h-8 w-8 items-center justify-center rounded-full"
                                          )}
                                        >
                                          <mtype.icon
                                            className={classNames(
                                              mtype.iconColor,
                                              "h-5 w-5 flex-shrink-0"
                                            )}
                                            aria-hidden="true"
                                          />
                                        </div>
                                        <span className="ml-3 block truncate font-medium">
                                          {mtype.name}
                                        </span>
                                      </div>
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {!sessionData && <p>Bitte Einloggen</p>}
      {JSON.stringify(carMessages)}
    </>
  );
}
