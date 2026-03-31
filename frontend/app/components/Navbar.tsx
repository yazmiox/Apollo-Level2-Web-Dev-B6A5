import { Suspense } from "react";
import AuthArea, { MobileAuthArea } from "./AuthArea";
import AuthSkeleton, { MobileAuthSkeleton } from "./AuthSkeleton";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <NavbarClient
      authArea={
        <Suspense fallback={<AuthSkeleton />}>
          <AuthArea />
        </Suspense>
      }
      mobileAuthArea={
        <Suspense fallback={<MobileAuthSkeleton />}>
          <MobileAuthArea />
        </Suspense>
      }
    />
  );
}
