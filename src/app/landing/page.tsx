import type { Metadata } from "next";
import LandingPage from "@/legacy-v1/app/landing/page";

export const metadata: Metadata = { title: "Landing immersive" };

export default function Page() {
  return <LandingPage />;
}
