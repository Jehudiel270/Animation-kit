import type { Metadata } from "next";
import { IconGallery } from "@/components/icons/IconGallery";

export const metadata: Metadata = { title: "Bibliothèque d’icônes" };
export default function Page() { return <IconGallery />; }
