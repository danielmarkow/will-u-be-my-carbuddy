import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { AtSymbolIcon, ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";

// When you create an invite to join in using
// the car you own, you get redirected here

export default function CreatedInvite() {
  const router = useRouter();
  const { inviteId } = router.query;

  const { data: sessionData } = useSession();

  return (
    <>
      {sessionData && (
        <div className="flex flex-col items-center">
          <div className="flex">
            <p className="mt-2 text-lg">Einladung generiert - Teile via ... </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_INVITE_URL as string}/invite/${
                    inviteId as string
                  }`
                );
                toast.success("Link kopiert");
              }}
            >
              <ClipboardDocumentIcon className="ml-2 mt-2 h-7 w-7" />
            </button>
            <AtSymbolIcon className="ml-2 mt-2 h-7 w-7" />
          </div>
          <p className="mt-4 text-gray-400">{`${
            process.env.NEXT_PUBLIC_INVITE_URL as string
          }/invite/${inviteId as string}`}</p>
        </div>
      )}
      {!sessionData && <p>Bitte Einloggen</p>}
    </>
  );
}
