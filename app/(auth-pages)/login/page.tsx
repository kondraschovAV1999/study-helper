// app/auth/page.tsx

import { RightSideAuthForm } from "@/components/auth/right-side-auth-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return <RightSideAuthForm />;
}
