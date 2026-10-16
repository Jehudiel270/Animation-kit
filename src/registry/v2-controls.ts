import type { FamilyId } from "./types";

export type V2Control = {
  key: string;
  label: string;
  type: "range" | "color";
  value: number | string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

const accent = (value: string): V2Control => ({
  key: "accent",
  label: "Couleur d’accent",
  type: "color",
  value,
});

const range = (
  key: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step: number,
  suffix = "",
): V2Control => ({ key, label, value, min, max, step, suffix, type: "range" });

const ACCENTS = ["#7c5cff", "#3ddbd9", "#ffb547", "#ff6b9a", "#a78bfa", "#22c55e"];

export function v2ControlsFor(id: string, title: string, family: FamilyId): V2Control[] {
  const index = Number(id.match(/-(\d+)$/)?.[1] ?? 1);
  const color = ACCENTS[(index - 1) % ACCENTS.length];
  const name = title.toLowerCase();

  switch (family) {
    case "text":
      if (name.includes("bandeau")) {
        return [
          range("fontSize", "Taille des caractères", 40, 20, 72, 2, " px"),
          range("spacing", "Espacement des mots", 0, 0, 32, 2, " px"),
          range("duration", "Durée du cycle", 1, 0.2, 3, 0.1, " s"),
          accent(color),
        ];
      }
      if (name.includes("écrire") || name.includes("brouillage") || name.includes("compteur")) {
        return [
          range("fontSize", "Taille du texte", 32, 16, 64, 1, " px"),
          range("duration", name.includes("compteur") ? "Durée du comptage" : "Durée du cycle", 1, 0.2, 3, 0.1, " s"),
          accent(color),
        ];
      }
      return [
        range("fontSize", "Taille du texte", 28 + (index % 4) * 2, 16, 64, 1, " px"),
        range("spacing", "Espacement des caractères", 0, -4, 16, 1, " px"),
        accent(color),
      ];
    case "scroll":
      if (name.includes("barre de progression") || name.includes("tracé de courbe") || name.includes("cercle de progression")) {
        return [
          range("thickness", name.includes("barre") ? "Épaisseur de la barre" : "Épaisseur du tracé", 3, 1, 12, 1, " px"),
          range("duration", "Vitesse de progression", 1, 0.2, 3, 0.1, "×"),
          accent(color),
        ];
      }
      return [
        range("intensity", "Échelle de l’animation au défilement", 100, 60, 150, 5, "%"),
        range("duration", "Durée de révélation", 0.8 + (index % 4) * 0.2, 0.2, 3, 0.1, " s"),
        accent(color),
      ];
    case "three":
      return [
        range("scale", "Échelle de la scène", 100, 60, 150, 5, "%"),
        range("rotation", "Inclinaison de la scène", 0, -30, 30, 1, "°"),
        accent(color),
      ];
    case "particles":
      return [
        range("fieldScale", "Échelle du champ", 100, 60, 150, 5, "%"),
        range("opacity", "Intensité visuelle", 80, 20, 100, 5, "%"),
        accent(color),
      ];
    case "media":
      if (name.includes("zoom au survol") || name.includes("zoom lent")) {
        return [
          range("zoom", "Amplitude du zoom", 125, 100, 160, 2, "%"),
          range("duration", "Durée du mouvement", 1, 0.2, 3, 0.1, " s"),
          range("radius", "Arrondi du cadre", 16, 0, 48, 2, " px"),
        ];
      }
      if (name.includes("vidéo")) {
        return [
          range("zoom", "Échelle de la vidéo", 100, 100, 150, 2, "%"),
          range("brightness", "Luminosité", 100, 50, 150, 5, "%"),
          range("playback", "Vitesse de lecture", 100, 25, 200, 5, "%"),
        ];
      }
      return [
        range("zoom", "Zoom de l’image", 100, 100, 150, 2, "%"),
        range("radius", "Arrondi du cadre", 16, 0, 48, 2, " px"),
        range("brightness", "Luminosité", 100, 50, 150, 5, "%"),
      ];
    case "transitions":
      return [
        range("duration", name.includes("zoom") ? "Durée du zoom" : "Durée de transition", 700 + (index % 4) * 100, 200, 1800, 50, " ms"),
        range("distance", name.includes("fondu") ? "Échelle de sortie" : "Amplitude du mouvement", 100, 40, 160, 5, "%"),
        accent(color),
      ];
    case "micro":
      if (name.includes("accordéon") || name.includes("info-bulle") || name.includes("notification")) {
        return [
          range("size", "Échelle du panneau", 100, 70, 140, 5, "%"),
          range("duration", "Durée d’apparition", 0.4, 0.1, 1.5, 0.05, " s"),
          accent(color),
        ];
      }
      if (name.includes("champ")) {
        return [
          range("fontSize", "Taille du libellé", 16, 12, 28, 1, " px"),
          range("spacing", "Espacement du texte", 0, -2, 8, 1, " px"),
          accent(color),
        ];
      }
      return [
        range("size", title.toLowerCase().includes("bouton") ? "Taille du bouton" : "Échelle de l’élément", 100, 70, 140, 5, "%"),
        range("response", "Réactivité de l’interaction", 100, 25, 200, 5, "%"),
        accent(color),
      ];
    case "lottie":
      return [
        range("size", "Taille de l’animation", 100, 60, 150, 5, "%"),
        range("playback", "Vitesse de lecture", 100, 25, 200, 5, "%"),
        accent(color),
      ];
    default:
      return [];
  }
}
