"use client";
import dynamic from "next/dynamic";

const Loading = () => <p className="p-10 text-mute">Chargement des animations…</p>;

/** Ces écrans utilisent WebGL, la vidéo et le DOM : on les charge côté navigateur uniquement. */
export const LazyCatalogue = dynamic(() => import("@/components/catalogue/Catalogue").then((m) => m.Catalogue), { ssr: false, loading: Loading });
export const LazySections = dynamic(() => import("@/components/catalogue/Sections").then((m) => m.Sections), { ssr: false, loading: Loading });
