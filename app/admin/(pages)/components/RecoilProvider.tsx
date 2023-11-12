"use client";

import { RecoilRoot, atom } from "recoil";

export default function RecoilProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
