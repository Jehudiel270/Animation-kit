import type { Metadata } from "next";
import { LazyCatalogue } from "@/components/core/Lazy";

export const metadata: Metadata = { title: "Catalogue d’animations" };
export default function Page() { return <LazyCatalogue />; }
