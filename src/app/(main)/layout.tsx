import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
export default async function Layout({children}: {children: ReactNode}) {
  const session = await validateRequest();
  if (!session.user) redirect("/");


  return (
      <SessionProvider value={session}>
        
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="max-w-7xl mx-auto p-5">
            {children}
          </div>
        </div>
        
      </SessionProvider>
  )
}