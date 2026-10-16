export type V2ControlKey =
  | "fontSize"
  | "spacing"
  | "duration"
  | "scale"
  | "rotation"
  | "brightness"
  | "opacity"
  | "thickness"
  | "zoom"
  | "radius"
  | "playback"
  | "hue"
  | "blur"
  | "offsetX"
  | "offsetY"
  | "saturation";

export type V2Control = {
  key: V2ControlKey;
  label: string;
  type: "range";
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
};

const control = (
  key: V2ControlKey,
  label: string,
  value: number,
  min: number,
  max: number,
  step: number,
  suffix = "",
): V2Control => ({ key, label, type: "range", value, min, max, step, suffix });

const definitions: Record<V2ControlKey, V2Control> = {
  fontSize: control("fontSize", "Taille du texte", 32, 14, 72, 1, " px"),
  spacing: control("spacing", "Espacement du texte", 0, -4, 24, 1, " px"),
  duration: control("duration", "Durée du cycle", 1, 0.2, 3, 0.1, " s"),
  scale: control("scale", "Échelle de l’animation", 100, 60, 150, 5, "%"),
  rotation: control("rotation", "Rotation", 0, -45, 45, 1, "°"),
  brightness: control("brightness", "Luminosité", 100, 50, 150, 5, "%"),
  opacity: control("opacity", "Opacité", 80, 20, 100, 5, "%"),
  thickness: control("thickness", "Épaisseur du tracé", 3, 1, 12, 1, " px"),
  zoom: control("zoom", "Amplitude du zoom", 100, 80, 160, 2, "%"),
  radius: control("radius", "Arrondi du cadre", 16, 0, 48, 2, " px"),
  playback: control("playback", "Vitesse de lecture", 100, 25, 200, 5, "%"),
  hue: control("hue", "Teinte", 0, 0, 360, 5, "°"),
  blur: control("blur", "Flou", 0, 0, 24, 1, " px"),
  offsetX: control("offsetX", "Décalage horizontal", 0, -60, 60, 2, " px"),
  offsetY: control("offsetY", "Décalage vertical", 0, -60, 60, 2, " px"),
  saturation: control("saturation", "Saturation", 100, 0, 200, 5, "%"),
};

const controlsByAnimation: Record<string, readonly V2ControlKey[]> = {
  "text-01": ["fontSize", "offsetY", "duration"],
  "text-02": ["fontSize", "rotation", "duration"],
  "text-03": ["fontSize", "blur", "duration"],
  "text-04": ["fontSize", "scale", "duration"],
  "text-05": ["fontSize", "spacing", "duration"],
  "text-06": ["fontSize", "offsetY", "duration"],
  "text-07": ["fontSize", "offsetY", "duration"],
  "text-08": ["fontSize", "blur", "duration"],
  "text-09": ["fontSize", "spacing", "rotation"],
  "text-10": ["fontSize", "rotation", "duration"],
  "text-11": ["fontSize", "offsetY", "duration"],
  "text-12": ["fontSize", "blur", "duration"],
  "text-13": ["fontSize", "duration", "spacing"],
  "text-14": ["fontSize", "duration", "spacing"],
  "text-15": ["fontSize", "duration", "hue"],
  "text-16": ["fontSize", "hue"],
  "text-17": ["fontSize", "spacing", "scale"],
  "text-18": ["fontSize", "spacing", "scale"],
  "text-19": ["fontSize", "offsetY", "duration"],
  "text-20": ["fontSize", "duration"],
  "text-21": ["fontSize", "duration", "hue"],
  "text-22": ["fontSize", "spacing", "duration"],
  "text-23": ["fontSize", "duration", "opacity"],
  "text-24": ["fontSize", "duration", "hue"],

  "scroll-01": ["scale", "offsetY", "duration"],
  "scroll-02": ["scale", "offsetX", "duration"],
  "scroll-03": ["thickness", "hue"],
  "scroll-04": ["offsetY", "scale"],
  "scroll-05": ["scale", "duration"],
  "scroll-06": ["rotation", "duration"],
  "scroll-07": ["brightness", "hue"],
  "scroll-08": ["fontSize", "spacing"],
  "scroll-09": ["offsetX", "duration"],
  "scroll-10": ["scale", "duration"],
  "scroll-11": ["fontSize", "duration"],
  "scroll-12": ["scale", "opacity"],
  "scroll-13": ["scale", "brightness"],
  "scroll-14": ["rotation", "offsetY"],
  "scroll-15": ["thickness", "hue"],
  "scroll-16": ["fontSize", "spacing"],
  "scroll-17": ["fontSize", "opacity"],
  "scroll-18": ["thickness", "hue"],
  "scroll-19": ["scale", "offsetX"],
  "scroll-20": ["rotation", "scale"],
  "scroll-21": ["duration", "offsetY"],
  "scroll-22": ["offsetY", "duration"],

  "three-01": ["scale", "rotation"],
  "three-02": ["scale", "brightness"],
  "three-03": ["scale", "hue"],
  "three-04": ["scale", "hue"],
  "three-05": ["scale", "rotation"],
  "three-06": ["scale", "rotation"],
  "three-07": ["scale", "hue"],
  "three-08": ["scale", "rotation"],
  "three-09": ["scale", "brightness"],
  "three-10": ["scale", "hue"],
  "three-11": ["scale", "rotation"],
  "three-12": ["scale", "rotation"],
  "three-13": ["scale", "rotation"],
  "three-14": ["scale", "rotation"],
  "three-15": ["scale", "rotation"],
  "three-16": ["scale", "rotation"],
  "three-17": ["scale", "rotation"],
  "three-18": ["scale", "rotation"],
  "three-19": ["scale", "hue"],
  "three-20": ["scale", "rotation"],
  "three-21": ["scale", "hue"],
  "three-22": ["scale", "rotation"],
  "three-23": ["scale", "rotation"],
  "three-24": ["scale", "rotation"],
  "three-25": ["scale", "rotation"],
  "three-26": ["scale", "hue"],

  "particles-01": ["scale", "opacity", "hue"],
  "particles-02": ["scale", "opacity"],
  "particles-03": ["opacity", "hue"],
  "particles-04": ["scale", "opacity"],
  "particles-05": ["opacity", "hue"],
  "particles-06": ["scale", "hue"],
  "particles-07": ["scale", "hue"],
  "particles-08": ["scale", "opacity"],
  "particles-09": ["scale", "opacity", "hue"],
  "particles-10": ["scale", "opacity"],
  "particles-11": ["scale", "rotation", "hue"],
  "particles-12": ["scale", "rotation", "hue"],
  "particles-13": ["scale", "rotation", "hue"],
  "particles-14": ["scale", "rotation", "hue"],
  "particles-15": ["scale", "rotation", "hue"],
  "particles-16": ["scale", "rotation", "hue"],
  "particles-17": ["scale", "rotation", "hue"],
  "particles-18": ["scale", "rotation", "hue"],

  "media-01": ["zoom", "duration", "brightness"],
  "media-02": ["zoom", "radius", "brightness"],
  "media-03": ["scale", "duration"],
  "media-04": ["scale", "duration"],
  "media-05": ["offsetX", "offsetY"],
  "media-06": ["saturation", "brightness"],
  "media-07": ["scale", "duration"],
  "media-08": ["scale", "rotation"],
  "media-09": ["hue", "opacity"],
  "media-10": ["scale", "duration"],
  "media-11": ["zoom", "duration"],
  "media-12": ["scale", "duration"],
  "media-13": ["playback", "fontSize"],
  "media-14": ["playback", "scale"],
  "media-15": ["playback", "brightness"],
  "media-16": ["playback", "brightness"],
  "media-17": ["playback", "brightness"],
  "media-18": ["playback", "zoom", "radius"],
  "media-19": ["playback", "fontSize"],
  "media-20": ["playback", "saturation"],

  "transitions-01": ["opacity", "duration"],
  "transitions-02": ["offsetX", "duration"],
  "transitions-03": ["offsetY", "duration"],
  "transitions-04": ["scale", "duration"],
  "transitions-05": ["rotation", "duration"],
  "transitions-06": ["blur", "duration"],
  "transitions-07": ["rotation", "duration"],
  "transitions-08": ["scale", "duration"],
  "transitions-09": ["offsetX", "duration"],
  "transitions-10": ["scale", "duration"],
  "transitions-11": ["scale", "duration"],
  "transitions-12": ["offsetX", "duration"],
  "transitions-13": ["scale", "duration"],
  "transitions-14": ["offsetY", "rotation", "duration"],

  "micro-01": ["offsetX", "offsetY"],
  "micro-02": ["scale", "hue"],
  "micro-03": ["scale", "rotation"],
  "micro-04": ["scale", "duration"],
  "micro-05": ["scale", "duration"],
  "micro-06": ["spacing", "hue"],
  "micro-07": ["scale", "hue"],
  "micro-08": ["scale", "duration"],
  "micro-09": ["scale", "duration"],
  "micro-10": ["scale", "duration"],
  "micro-11": ["scale", "rotation"],
  "micro-12": ["hue", "brightness"],
  "micro-13": ["hue", "brightness"],
  "micro-14": ["scale", "brightness"],
  "micro-15": ["fontSize", "spacing"],
  "micro-16": ["scale", "duration"],
  "micro-17": ["scale", "duration"],
  "micro-18": ["fontSize", "duration"],
  "micro-19": ["scale", "duration"],
  "micro-20": ["scale", "rotation"],

  "lottie-01": ["scale", "rotation", "hue"],
  "lottie-02": ["scale", "brightness", "hue"],
  "lottie-03": ["scale", "rotation", "hue"],
  "lottie-04": ["scale", "brightness"],
  "lottie-05": ["scale", "rotation", "hue"],
  "lottie-06": ["scale", "brightness", "hue"],
  "lottie-07": ["scale", "rotation", "hue"],
  "lottie-08": ["scale", "brightness"],
  "lottie-09": ["scale", "brightness", "hue"],
  "lottie-10": ["scale", "brightness", "hue"],

  "sections-01": ["scale", "rotation", "hue"],
  "sections-02": ["scale", "opacity", "hue"],
  "sections-03": ["scale", "brightness", "playback"],
  "sections-04": ["scale", "offsetY", "duration"],
  "sections-05": ["scale", "offsetX", "duration"],
  "sections-06": ["fontSize", "duration"],
  "sections-07": ["scale", "hue"],
  "sections-08": ["scale", "rotation"],
  "sections-09": ["fontSize", "spacing", "scale"],
  "sections-10": ["scale", "offsetY"],
  "sections-11": ["scale", "rotation"],
  "sections-12": ["scale", "hue"],
};

export function v2ControlsFor(id: string): V2Control[] {
  const keys = controlsByAnimation[id];
  if (!keys) {
    throw new Error(`Réglages V2 manquants pour l’animation « ${id} »`);
  }
  return keys.map((key) => ({ ...definitions[key] }));
}
