export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Pseudo-aléatoire déterministe (0..1) : même résultat à chaque rendu. */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
