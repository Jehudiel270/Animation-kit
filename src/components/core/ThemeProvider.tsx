"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { Check, ChevronDown, Palette } from "lucide-react";

export const THEMES = [
  { id: "violet", label: "Violet", colors: ["#0e0f1a", "#171a2b", "#2b3050", "#edeef7", "#a3a8c7", "#7c5cff", "#3ddbd9", "#ffb547"] },
  { id: "ocean", label: "Océan", colors: ["#071923", "#0d2a39", "#17465a", "#e6f8ff", "#a9cbd8", "#22a6c7", "#64e4dc", "#f9c784"] },
  { id: "forest", label: "Forêt", colors: ["#101b15", "#1b2c20", "#334b38", "#eff7ed", "#b0c2ad", "#63a96b", "#9ad9b0", "#e9c46a"] },
  { id: "sunset", label: "Coucher de soleil", colors: ["#201018", "#351926", "#58303d", "#fff0e8", "#d6adb2", "#f06b63", "#f6aa72", "#f4d58d"] },
  { id: "rose", label: "Rose", colors: ["#21121c", "#351e30", "#57354c", "#fff0f7", "#d6b5c8", "#e56ab1", "#f4a6d7", "#f4c2a1"] },
  { id: "amber", label: "Ambre", colors: ["#1c1710", "#30251a", "#51402b", "#fff5e4", "#d2c0a3", "#e4a544", "#f0cd7a", "#e98658"] },
  { id: "arctic", label: "Arctique", colors: ["#101820", "#1b2935", "#324352", "#f1f8ff", "#b7c6d4", "#6ba8e8", "#8ce0e4", "#f0d28a"] },
  { id: "lavender", label: "Lavande", colors: ["#171421", "#272238", "#413858", "#f6f0ff", "#c4bad9", "#a68bea", "#d3a4ef", "#f0c0bb"] },
  { id: "mint", label: "Menthe", colors: ["#0d1b1a", "#172c29", "#2d4943", "#eafff8", "#a8c9bf", "#43b99b", "#83e2c2", "#d7dc8b"] },
  { id: "cyberpunk", label: "Cyberpunk", colors: ["#100b1f", "#1d1234", "#38204d", "#f8efff", "#c4aed8", "#fb3faf", "#20e3d2", "#e9f45c"] },
  { id: "mono", label: "Monochrome", colors: ["#111111", "#202020", "#393939", "#f5f5f5", "#b8b8b8", "#d0d0d0", "#999999", "#eeeeee"] },
  { id: "cobalt", label: "Cobalt", colors: ["#091329", "#122343", "#203b68", "#eef4ff", "#b3c3e3", "#5288ff", "#77d7ff", "#ffd166"] },
  { id: "ember", label: "Braise", colors: ["#1b100e", "#2e1a16", "#4e2b21", "#fff3eb", "#d0b4a6", "#ed6947", "#f3a15e", "#f2d17d"] },
  { id: "plum", label: "Prune", colors: ["#1a101d", "#2b1c30", "#47304d", "#fbf0ff", "#c9b5d2", "#c278dc", "#e2a1c8", "#a7c3f2"] },
  { id: "obsidian", label: "Obsidienne", colors: ["#08090b", "#141518", "#292b30", "#f4f4f5", "#a1a1aa", "#a1a1aa", "#d4d4d8", "#737373"] },
  { id: "noir-bleu", label: "Noir & bleu", colors: ["#080d18", "#101a2b", "#22334c", "#eff6ff", "#a6b6cc", "#4d8dff", "#6ccaff", "#bdc9ff"] },
  { id: "noir-rouge", label: "Noir & rouge", colors: ["#120a0b", "#211213", "#402022", "#fff2f2", "#c5a9aa", "#ef4444", "#fb7185", "#fca5a5"] },
  { id: "noir-violet", label: "Noir & violet", colors: ["#0d0a14", "#191326", "#302342", "#f8f4ff", "#b8aacb", "#a78bfa", "#d8b4fe", "#f0abfc"] },
  { id: "charcoal", label: "Charbon", colors: ["#151515", "#222222", "#383838", "#eeeeee", "#b0b0b0", "#f97316", "#fbbf24", "#fda4af"] },
  { id: "white", label: "Blanc pur", mode: "light", colors: ["#ffffff", "#f5f5f5", "#d9d9d9", "#171717", "#626262", "#525252", "#343434", "#737373"] },
  { id: "paper", label: "Papier", mode: "light", colors: ["#f4f1e9", "#e9e4d9", "#d6cebf", "#27251f", "#777165", "#554f46", "#3f5e59", "#a56a43"] },
  { id: "ivory", label: "Ivoire", mode: "light", colors: ["#fffaf0", "#f4ecd9", "#e1d5bd", "#342b20", "#847765", "#8b6f47", "#56736a", "#b28a54"] },
  { id: "snow", label: "Neige", mode: "light", colors: ["#f7fbff", "#eaf2fa", "#d2e1ef", "#17283a", "#60758a", "#477db3", "#368c91", "#b07842"] },
  { id: "pearl", label: "Perle", mode: "light", colors: ["#f5f3f2", "#e9e5e3", "#d5cecb", "#2d2928", "#756d69", "#806b78", "#5e7777", "#98785c"] },
  { id: "silver", label: "Argent", mode: "light", colors: ["#eceff1", "#dde2e5", "#c6cdd1", "#202629", "#59646a", "#596d78", "#3f7777", "#79634e"] },
  { id: "high-contrast", label: "Noir & blanc", colors: ["#000000", "#111111", "#333333", "#ffffff", "#e5e5e5", "#ffffff", "#bdbdbd", "#8a8a8a"] },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];
type ThemeChoice = (typeof THEMES)[number];
type ThemeContextValue = { theme: ThemeId; setTheme: (theme: ThemeId, origin?: { x: number; y: number }) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "motion-kit-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>("violet");
  const [transition, setTransition] = useState<{ theme: ThemeChoice; origin: { x: number; y: number } } | null>(null);
  const reducedMotion = useReducedMotion();

  const applyTheme = useCallback((id: ThemeId) => {
    const selected = THEMES.find((option) => option.id === id);
    if (!selected) return;
    const root = document.documentElement;
    root.dataset.theme = id;
    root.style.colorScheme = "mode" in selected ? selected.mode : "dark";
    const [ink, panel, line, text, mute, violet, teal, amber] = selected.colors;
    root.style.setProperty("--color-ink", ink);
    root.style.setProperty("--color-panel", panel);
    root.style.setProperty("--color-line", line);
    root.style.setProperty("--color-text", text);
    root.style.setProperty("--color-mute", mute);
    root.style.setProperty("--color-violet", violet);
    root.style.setProperty("--color-teal", teal);
    root.style.setProperty("--color-amber", amber);
    setTheme(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch (error) {
      console.error("Impossible de mémoriser le thème sélectionné.", error);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (THEMES.some((option) => option.id === saved)) applyTheme(saved as ThemeId);
    } catch (error) {
      console.error("Impossible de restaurer le thème sauvegardé.", error);
    }
  }, [applyTheme]);

  const changeTheme = useCallback((id: ThemeId, origin?: { x: number; y: number }) => {
    if (id === theme) return;
    const next = THEMES.find((option) => option.id === id);
    if (!next) return;
    if (reducedMotion) {
      applyTheme(id);
      return;
    }
    setTransition({ theme: next, origin: origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 } });
  }, [applyTheme, reducedMotion, theme]);

  const value = useMemo(() => ({ theme, setTheme: changeTheme }), [theme, changeTheme]);
  const ink = transition?.theme.colors[0] ?? "";
  const violet = transition?.theme.colors[5] ?? "";
  const teal = transition?.theme.colors[6] ?? "";
  return (
    <ThemeContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <AnimatePresence>
        {transition && (
          <motion.div
            aria-hidden="true"
            initial={{ clipPath: `circle(0px at ${transition.origin.x}px ${transition.origin.y}px)` }}
            animate={{ clipPath: `circle(150vmax at ${transition.origin.x}px ${transition.origin.y}px)` }}
            exit={{ opacity: 0 }}
            transition={{ clipPath: { duration: 0.72, ease: [0.76, 0, 0.24, 1] }, opacity: { duration: 0.12 } }}
            onAnimationComplete={() => {
              if (!transition) return;
              try {
                applyTheme(transition.theme.id);
                setTransition(null);
              } catch (error) {
                setTransition(null);
                console.error("Impossible d'appliquer le thème sélectionné.", error);
              }
            }}
            className="pointer-events-none fixed inset-0 z-[200]"
            style={{ background: `radial-gradient(ellipse at 70% 20%, ${teal}55, transparent 46%), radial-gradient(ellipse at 25% 80%, ${violet}55, transparent 52%), ${ink}` }}
          />
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}

export function ThemePicker() {
  const context = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  if (!context) throw new Error("ThemePicker must be used inside ThemeProvider");

  const selected = THEMES.find((option) => option.id === context.theme)!;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={pickerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={`Thème du site : ${selected.label}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-2 text-sm text-text transition hover:border-teal focus-visible:border-teal"
      >
        <Palette size={16} aria-hidden="true" className="text-violet" />
        <span className="hidden sm:inline">{selected.label}</span>
        <span className="flex -space-x-1" aria-hidden="true">
          {selected.colors.slice(5, 8).map((color) => <span key={color} className="size-3 rounded-full border border-ink" style={{ backgroundColor: color }} />)}
        </span>
        <ChevronDown size={14} aria-hidden="true" className={`text-mute transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Choisir un thème"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+0.65rem)] z-[60] w-[min(19rem,calc(100vw-1.5rem))] rounded-2xl border border-line bg-panel p-3 shadow-2xl shadow-black/40"
          >
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <span className="text-sm font-semibold text-text">Choisir un thème</span>
              <span className="text-xs text-mute">{THEMES.length} palettes</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {THEMES.map((theme) => {
                const active = theme.id === context.theme;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    aria-pressed={active}
                    onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); context.setTheme(theme.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }); setOpen(false); }}
                    className={`flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-xs transition ${active ? "border-violet bg-ink/70 text-text" : "border-transparent text-mute hover:border-line hover:bg-ink/50 hover:text-text"}`}
                  >
                    <span className="flex shrink-0 -space-x-1" aria-hidden="true">
                      {theme.colors.slice(5, 8).map((color) => <span key={color} className="size-4 rounded-full border-2 border-panel" style={{ backgroundColor: color }} />)}
                    </span>
                    <span className="truncate">{theme.label}</span>
                    {active && <Check size={14} aria-hidden="true" className="ml-auto shrink-0 text-violet" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
