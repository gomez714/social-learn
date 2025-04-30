import UserButton from "@/components/UserButton";
import Link from "next/link";
import SearchField from "@/components/SearchField";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          AI Social Learning
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}
