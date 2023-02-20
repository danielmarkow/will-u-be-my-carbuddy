import { type AppType } from "next/app";
import Link from "next/link";
import { type Session } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

import { Toaster } from "react-hot-toast";

import "../styles/globals.css";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import Navbar from "../components/Navbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
