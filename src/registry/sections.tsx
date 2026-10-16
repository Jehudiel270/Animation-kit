"use client";
import * as S from "@/components/sections";
import { make } from "./types";

export const sections = make("sections", [
  ["Hero 3D plein écran", "R3F · GSAP SplitText", S.Hero3D],
  ["Hero à particules", "tsParticles · Motion", S.HeroParticles],
  ["Hero vidéo avec bandeau", "HTML5 video · GSAP", S.HeroVideo],
  ["Présentation épinglée en 3 étapes", "GSAP ScrollTrigger (pin)", S.PinnedShowcase],
  ["Galerie horizontale épinglée", "GSAP ScrollTrigger (pin)", S.HorizontalGallery],
  ["Chiffres qui comptent", "Motion", S.Stats],
  ["Grille de fonctionnalités à projecteur", "Motion · lucide-react", S.FeatureGrid],
  ["Témoignages glissables", "Motion · drag", S.Testimonials],
  ["Bandeau de technologies", "GSAP", S.LogosMarquee],
  ["Récit en parallaxe", "GSAP ScrollTrigger", S.ParallaxStory],
  ["Tarifs inclinables", "Motion", S.PricingTilt],
  ["Pied de page interactif", "GSAP", S.InteractiveFooter],
]);
