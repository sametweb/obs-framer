import { headers } from "next/headers";
import { ClientLayout } from "../client-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This forces the layout to be dynamic
  headers();

  return <ClientLayout>{children}</ClientLayout>;
}
