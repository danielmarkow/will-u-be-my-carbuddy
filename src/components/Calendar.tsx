import { useState } from "react";
import { Fragment } from "react";

import { useRouter } from "next/router";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";

import { Menu, Transition } from "@headlessui/react";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";

export default function Calendar() {
  type Event = {
    id: number;
    name: string;
    time: string;
    datetime: string;
    href: string;
  };

  type Days = {
    date: string;
    isCurrentMonth?: boolean;
    isSelected?: boolean;
    isToday?: boolean;
    events: Array<Event>;
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
            <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
              <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
                <div className="bg-white py-2">
                  M<span className="sr-only sm:not-sr-only">o</span>
                </div>
                <div className="bg-white py-2">
                  D<span className="sr-only sm:not-sr-only">ie</span>
                </div>
                <div className="bg-white py-2">
                  M<span className="sr-only sm:not-sr-only">i</span>
                </div>
                <div className="bg-white py-2">
                  D<span className="sr-only sm:not-sr-only">o</span>
                </div>
                <div className="bg-white py-2">
                  F<span className="sr-only sm:not-sr-only">r</span>
                </div>
                <div className="bg-white py-2">
                  S<span className="sr-only sm:not-sr-only">a</span>
                </div>
                <div className="bg-white py-2">
                  S<span className="sr-only sm:not-sr-only">o</span>
                </div>
              </div>
              <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
                <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
                  {days.map((day) => (
                    <div
                      key={day.date}
                      className={classNames(
                        day.isCurrentMonth
                          ? "bg-white"
                          : "bg-gray-50 text-gray-500",
                        "relative py-2 px-3"
                      )}
                    >
                      <time
                        dateTime={day.date}
                        className={
                          day.isToday
                            ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                            : undefined
                        }
                      >
                        {day.date.split("-")?.pop()?.replace(/^0/, "")}
                      </time>
                      {day.events.length > 0 && (
                        <ol className="mt-2">
                          {day.events.slice(0, 2).map((event) => (
                            <li key={event.id}>
                              <a href={event.href} className="group flex">
                                <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                                  {event.name}
                                </p>
                                <time
                                  dateTime={event.datetime}
                                  className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                                >
                                  {event.time}
                                </time>
                              </a>
                            </li>
                          ))}
                          {day.events.length > 2 && (
                            <li className="text-gray-500">
                              + {day.events.length - 2} more
                            </li>
                          )}
                        </ol>
                      )}
                    </div>
                  ))}
                </div>
                <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
                  {days.map((day) => (
                    <button
                      key={day.date}
                      id={day.date}
                      type="button"
                      className={classNames(
                        day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                        (day.isSelected || day.isToday) && "font-semibold",
                        day.isSelected && "text-white",
                        !day.isSelected && day.isToday && "text-indigo-600",
                        !day.isSelected &&
                          day.isCurrentMonth &&
                          !day.isToday &&
                          "text-gray-900",
                        !day.isSelected &&
                          !day.isCurrentMonth &&
                          !day.isToday &&
                          "text-gray-500",
                        "flex h-14 flex-col py-2 px-3 hover:bg-gray-100 focus:z-10"
                      )}
                      onClick={(e) => {
                        const newlySelectedDay = days.find(
                          (day) => day.date === e.currentTarget.id
                        )!;
                        setSelectedDay(newlySelectedDay);
                        updateCachedQuery([
                          { ...newlySelectedDay, isSelected: true },
                        ]);
                      }}
                    >
                      <time
                        dateTime={day.date}
                        className={classNames(
                          day.isSelected &&
                            "flex h-6 w-6 items-center justify-center rounded-full",
                          day.isSelected && day.isToday && "bg-indigo-600",
                          day.isSelected && !day.isToday && "bg-gray-900",
                          "ml-auto"
                        )}
                      >
                        {day.date.split("-")?.pop()?.replace(/^0/, "")}
                      </time>
                      <span className="sr-only">
                        {day.events.length} events
                      </span>
                      {day.events.length > 0 && (
                        <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                          {day.events.map((event) => (
                            <span
                              key={event.id}
                              className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {selectedDay && selectedDay.events.length > 0 && (
              <div className="py-10 px-4 sm:px-6 lg:hidden">
                <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
                  {selectedDay.events.map((event) => (
                    <li
                      key={event.id}
                      className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
                    >
                      <div className="flex-auto">
                        <p className="font-semibold text-gray-900">
                          {event.name}
                        </p>
                        <time
                          dateTime={event.datetime}
                          className="mt-2 flex items-center text-gray-700"
                        >
                          <ClockIcon
                            className="mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {event.time}
                        </time>
                      </div>
                      <a
                        href={event.href}
                        className="ml-6 flex-none self-center rounded-md border border-gray-300 bg-white py-2 px-3 font-semibold text-gray-700 opacity-0 shadow-sm hover:bg-gray-50 focus:opacity-100 group-hover:opacity-100"
                      >
                        Edit<span className="sr-only">, {event.name}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
