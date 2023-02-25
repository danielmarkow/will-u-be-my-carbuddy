import { Fragment, useState } from "react";

import { Listbox, Transition } from "@headlessui/react";

import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";

import { api } from "../utils/api";

import IconGenerator from "../components/common/IconGenerator";
import Calendar from "../components/Calendar";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

interface MessageType {
  name: string;
  value: string | null;
}

const messageTopic: Array<MessageType> = [
  {
    name: "Parken",
    value: "parking",
  },
  {
    name: "Tanken",
    value: "fuel",
  },
  {
    name: "Schaden",
    value: "damage",
  },
  {
    name: "Reinigung",
    value: "clean",
  },
  {
    name: "Flüssigkeiten",
    value: "fluids",
  },
  {
    name: "Nicht spezifiziert",
    value: "notdefined",
  },
];

// eslint-disable-next-line
const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function CarDetails() {
  const [selected, setSelected] = useState<MessageType>(
    messageTopic[5] as MessageType
  );
  const [message, setMessage] = useState("");

  const utils = api.useContext();

  const { data: sessionData } = useSession();
  const { carId } = useRouter().query;

  // TODO paginate query
  const { data: carMessages } = api.car.messages.useQuery(
    {
      carId: carId as string,
      userId: sessionData?.user?.id as string,
    },
    { enabled: carId !== undefined && sessionData !== undefined }
  );
  const sendMessageMut = api.messages.createMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      setSelected(messageTopic[5] as MessageType);
      void utils.car.messages.invalidate();
    },
  });

  return (
    <>
      {sessionData && carMessages && (
        <>
          <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
            Nachrichten - {carMessages?.licencePlate}
          </h3>
          {/* message box */}
          <div className="mt-4 flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Image
                className="inline-block h-8 w-8 rounded-full"
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
                  sendMessageMut.mutate({
                    carId: carMessages?.id,
                    userId: sessionData.user?.id as string,
                    topic: selected.value as string,
                    message,
                  });
                }}
                className="relative"
              >
                <div className="overflow-hidden rounded-lg border border-gray-300 p-1 shadow-sm">
                  <label htmlFor="comment" className="sr-only">
                    Gib deine Nachricht ein
                  </label>
                  <textarea
                    rows={3}
                    name="comment"
                    id="comment"
                    className="block w-full resize-none border-0 py-3 px-1 sm:text-sm"
                    placeholder="Gib hier deine Nachricht ein..."
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
                                  {selected?.value === "notdefined" ? (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                                      {/* TODO change icon */}
                                      <IconGenerator
                                        value="notdefined"
                                        className="h-5 w-5 flex-shrink-0 text-white"
                                        aria-hidden="true"
                                      />
                                      <span className="sr-only">
                                        {" "}
                                        Nachrichtentyp festlegen{" "}
                                      </span>
                                    </span>
                                  ) : (
                                    <span>
                                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                                        <IconGenerator
                                          value={selected?.value}
                                          className="h-5 w-5 flex-shrink-0 text-white"
                                          aria-hidden="true"
                                        />
                                      </span>
                                      <span className="sr-only">
                                        {selected?.name}
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
                                  {messageTopic.map((mtype) => (
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
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                                          <IconGenerator
                                            value={mtype.value}
                                            className="h-5 w-5 flex-shrink-0 text-white"
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
                      className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* message timeline */}
          <div className="mt-4 flow-root">
            <ul role="list" className="-mb-8">
              {carMessages.CarMessages.map((carmessage, cmIdx) => (
                <li key={carmessage.id}>
                  <div className="relative pb-8">
                    {cmIdx !== carMessages.CarMessages.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div className="flex">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black ring-8 ring-white">
                          <IconGenerator
                            value={carmessage.topic}
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </span>
                        <Image
                          className="ml-1 inline-block h-8 w-8 rounded-full"
                          src={carmessage.user.image as string}
                          alt={`image of ${carmessage.user.name as string}`}
                          height={600}
                          width={450}
                        />
                        <div className="ml-1 flex border-gray-300 px-1">
                          <div className="ml-1 flex min-w-0 flex-1 justify-between space-x-4 ">
                            <div>
                              <p className="text-base text-gray-900">
                                {carmessage.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {carmessage.user.name}, posted{" "}
                                {dayjs(carmessage.createdAt).fromNow()} ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {!sessionData && <p>Bitte Einloggen</p>}
      <Calendar />
    </>
  );
}
