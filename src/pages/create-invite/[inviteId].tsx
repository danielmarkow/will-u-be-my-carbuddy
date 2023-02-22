import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// When you create an invite to join in using
// the car you own, you get redirected here

export default function CreatedInvite() {
  const router = useRouter();
  const { inviteId } = router.query;

  const { data: sessionData } = useSession();

  return (
    <>
      {sessionData && (
        <>
          <p>Einladung generiert - Teile via ...</p>
          <p>{`${process.env.NEXT_PUBLIC_INVITE_URL as string}/invite/${
            inviteId as string
          }`}</p>
        </>
      )}
      {!sessionData && <p>Bitte Einloggen</p>}
    </>
  );
}
