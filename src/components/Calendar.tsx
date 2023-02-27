import { useState } from "react";
import { Fragment } from "react";

import { useRouter } from "next/router";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";

import { Menu, Transition } from "@headlessui/react";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import MonthlyView from "./calenderViews/Monthly";

export default function Calendar() {
  type Events = {
    id: string;
    name: string | null;
    eventStartDate: Date;
    eventEndDate: Date;
    userId: string;
    carId: string;
    createdAt: Date;
    updatedAt: Date;
  };

  type Days = {
    date: string;
    isCurrentMonth?: boolean;
    isSelected?: boolean;
    isToday?: boolean;
    events: Array<Events>;
  };

  type Months = {
    id: number;
    year: string;
    month: string;
    nameOfMonth: string;
    isCurrentMonth?: boolean;
  };

  const months: Array<Months> = [
    { id: 0, year: "2023", month: "01", nameOfMonth: "Januar" },
    {
      id: 1,
      year: "2023",
      month: "02",
      nameOfMonth: "Februar",
      isCurrentMonth: true,
    },
    {
      id: 2,
      year: "2023",
      month: "03",
      nameOfMonth: "März",
    },
  ];

  const utils = api.useContext();
  const router = useRouter();
  const { carId } = router.query;
  const [selectedMonth, setSelectedMonth] = useState<Months>(
    months.find((m) => m.isCurrentMonth)!
  );

  const { data: days } = api.calendar.getCalendar.useQuery(
    { carId: carId as string },
    {
      select: (days) =>
        days.filter(
          (day) =>
            day.date.slice(0, 4) === selectedMonth.year &&
            day.date.slice(5, 7) === selectedMonth.month
        ),
      onError: () => {
        toast.error("Fehler beim Erzeugen des Kalenders");
        return [];
      },
      enabled: carId !== undefined,
    }
  );

  const [selectedDay, setSelectedDay] = useState<Days>({
    date: new Date().toISOString().slice(0, 10),
    isCurrentMonth: true,
    isSelected: true,
    events: [],
  });

  const updateCachedQuery = (selectedDate: Array<Days>) => {
    utils.calendar.getCalendar.setData(
      { carId: carId as string },
      (oldData) => {
        const newData = oldData?.map((obj) => {
          if (obj.isSelected === true) {
            const { isSelected, ...rest } = obj;
            return rest;
          } else {
            return obj;
          }
        });

        return newData?.map(
          (obj) => selectedDate.find((d) => d.date === obj.date) || obj
        );
      }
    );
  };

  const classNames = (...classes: any[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <>
      {/* {JSON.stringify(selectedDay)} */}
      {days && (
        <>
          {/* offsetMonths: {JSON.stringify(offsetMonths)} */}
          <div className="mt-10 lg:flex lg:h-full lg:flex-col">
            <header className="flex items-center justify-between border-b border-gray-200 py-4 px-6 lg:flex-none">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                <time dateTime={`${selectedMonth.year}-${selectedMonth.month}`}>
                  {selectedMonth.nameOfMonth} {selectedMonth.year}
                </time>
              </h1>
              <div className="flex items-center">
                <div className="flex items-center rounded-md shadow-sm md:items-stretch">
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                    onClick={() => {
                      if (selectedMonth?.id != 0) {
                        setSelectedMonth(
                          months.find(
                            (month) =>
                              month.id === (selectedMonth.id as number) - 1
                          )!
                        );
                      }
                    }}
                  >
                    <span className="sr-only">Vorheriger Monat</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
                  >
                    {selectedMonth?.nameOfMonth}
                  </button>
                  <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                    onClick={() => {
                      if (months.length - 1 > selectedMonth.id) {
                        setSelectedMonth(
                          months.find(
                            (month) =>
                              month.id === (selectedMonth.id as number) + 1
                          )!
                        );
                      }
                    }}
                  >
                    <span className="sr-only">Nächster Monat</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="hidden md:ml-4 md:flex md:items-center">
                  <Menu as="div" className="relative">
                    <Menu.Button
                      type="button"
                      className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Monatsansicht
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Tagesansicht
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Wochenansicht
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Monatsansicht
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <div className="ml-6 h-6 w-px bg-gray-300" />
                  <button
                    type="button"
                    className="ml-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Auto buchen
                  </button>
                </div>
                <Menu as="div" className="relative ml-6 md:hidden">
                  <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Open menu</span>
                    <EllipsisHorizontalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Auto buchen
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Heute
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Tagesansicht
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Wochenansicht
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Monatsansicht
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </header>
            {/* monthly view */}
            <MonthlyView
              days={days}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              updateCachedQuery={updateCachedQuery}
            />
          </div>
        </>
      )}
    </>
  );
}
