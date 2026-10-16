import type { Metadata } from "next";
import { LazySections } from "@/components/core/Lazy";

export const metadata: Metadata = { title: "Sections de landing" };
export default function Page() { return <LazySections />; }
