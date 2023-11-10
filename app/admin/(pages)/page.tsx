import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Page</h1>
      <Link href={"/admin/create-series"}>create series</Link>
    </div>
  );
}
