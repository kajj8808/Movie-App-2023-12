import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold">Admin Page</h1>
      <Link href={"/admin/series/create"}>create series</Link>
      <Link href={"/admin/season/insert"}>ineset season</Link>
      <Link href={"/admin/episode/insert"}>insert episode</Link>
    </div>
  );
}
