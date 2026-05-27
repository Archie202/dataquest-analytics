"use client"

import { useRef, useState, useMemo } from "react"
import Link from "next/link"
import { Lock, Swords, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import type { Phase } from "@/types/curriculum"
import { cn } from "@/lib/utils"

// ─── Color themes per phase ──────────────────────────────────────────────────

const phaseThemes = [
  {
    id: "indigo",
    accent: "#818cf8",
    accentDim: "rgba(129,140,248,0.12)",
    accentMid: "rgba(129,140,248,0.20)",
    accentGlow: "rgba(129,140,248,0.35)",
    from: "from-indigo-500/8",
    to: "to-blue-500/5",
    border: "border-indigo-500/25",
    text: "text-indigo-400",
    dot: "#818cf8",
    label: "Foundations",
    islandBg: "radial-gradient(ellipse at 60% 40%, rgba(129,140,248,0.10), transparent 70%)",
    gridColor: "rgba(129,140,248,0.04)",
  },
  {
    id: "purple",
    accent: "#a855f7",
    accentDim: "rgba(168,85,247,0.12)",
    accentMid: "rgba(168,85,247,0.20)",
    accentGlow: "rgba(168,85,247,0.35)",
    from: "from-purple-500/8",
    to: "to-pink-500/5",
    border: "border-purple-500/25",
    text: "text-purple-400",
    dot: "#a855f7",
    label: "Domains",
    islandBg: "radial-gradient(ellipse at 60% 40%, rgba(168,85,247,0.10), transparent 70%)",
    gridColor: "rgba(168,85,247,0.04)",
  },
  {
    id: "emerald",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.12)",
    accentMid: "rgba(16,185,129,0.20)",
    accentGlow: "rgba(16,185,129,0.35)",
    from: "from-emerald-500/8",
    to: "to-teal-500/5",
    border: "border-emerald-500/25",
    text: "text-emerald-400",
    dot: "#10b981",
    label: "Tools",
    islandBg: "radial-gradient(ellipse at 60% 40%, rgba(16,185,129,0.10), transparent 70%)",
    gridColor: "rgba(16,185,129,0.04)",
  },
  {
    id: "blue",
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.12)",
    accentMid: "rgba(59,130,246,0.20)",
    accentGlow: "rgba(59,130,246,0.35)",
    from: "from-blue-500/8",
    to: "to-cyan-500/5",
    border: "border-blue-500/25",
    text: "text-blue-400",
    dot: "#3b82f6",
    label: "BI",
    islandBg: "radial-gradient(ellipse at 60% 40%, rgba(59,130,246,0.10), transparent 70%)",
    gridColor: "rgba(59,130,246,0.04)",
  },
]

// ─── Layout constants ────────────────────────────────────────────────────────

const PHASE_WIDTH = 880
const PHASE_GAP = 120
const MODULE_SPACING_X = 260
const MODULE_BASE_Y = 280
const MODULE_Y_ALTERNATE = 110
const TOPIC_SPACING_Y = 110
const TOPIC_X_OFFSET = 55
const NODE_TOPIC = 16
const NODE_MODULE = 26
const NODE_BOSS = 36
const MAP_HEIGHT = 680

// ─── Types ───────────────────────────────────────────────────────────────────

interface PositionedNode {
  id: string
  x: number
  y: number
  type: "topic" | "module" | "boss"
  label: string
  unlocked: boolean
  href: string
  moduleIndex: number
}

interface PositionedModule {
  id: string
  x: number
  y: number
  label: string
  unlocked: boolean
  unlockLevel: number
  moduleIndex: number
  nodes: PositionedNode[]
}

interface PositionedPhase {
  id: string
  index: number
  x: number
  title: string
  description: string
  unlocked: boolean
  modules: PositionedModule[]
}

// ─── Position calculator ─────────────────────────────────────────────────────

function buildPhasePositions(phases: Phase[], userLevel: number): PositionedPhase[] {
  return phases.map((phase, pIdx) => {
    const unlocked = userLevel >= phase.unlock_level
    const phaseX = pIdx * (PHASE_WIDTH + PHASE_GAP) + 80

    const positionedModules: PositionedModule[] = phase.modules.map((mod, mIdx) => {
      const modUnlocked = unlocked && userLevel >= mod.unlock_level
      const modsCount = phase.modules.length
      const offsetX = (mIdx - (modsCount - 1) / 2) * MODULE_SPACING_X
      const modX = phaseX + PHASE_WIDTH / 2 + offsetX
      const modY = MODULE_BASE_Y + (mIdx % 2 === 0 ? -MODULE_Y_ALTERNATE : MODULE_Y_ALTERNATE)

      const nodes: PositionedNode[] = mod.topics.map((topic, tIdx) => {
        const topicUnlocked = modUnlocked && userLevel >= topic.unlock_level
        const tx = modX + (tIdx + 1) * TOPIC_X_OFFSET
        const ty = modY + (tIdx + 1) * TOPIC_SPACING_Y
        return {
          id: topic.id,
          x: tx,
          y: ty,
          type: "topic",
          label: topic.title,
          unlocked: topicUnlocked,
          href: topicUnlocked ? `/topics/${topic.id}` : "#",
          moduleIndex: mIdx,
        }
      })

      const bossUnlocked = modUnlocked
      const bossX = modX + (mod.topics.length + 0.5) * TOPIC_X_OFFSET
      const bossY = modY + (mod.topics.length + 1) * TOPIC_SPACING_Y
      nodes.push({
        id: `${mod.id}-boss`,
        x: bossX,
        y: bossY,
        type: "boss",
        label: `${mod.title} Challenge`,
        unlocked: bossUnlocked,
        href: bossUnlocked ? `/modules/${mod.id}` : "#",
        moduleIndex: mIdx,
      })

      return {
        id: mod.id,
        x: modX,
        y: modY,
        label: mod.title,
        unlocked: modUnlocked,
        unlockLevel: mod.unlock_level,
        moduleIndex: mIdx,
        nodes,
      }
    })

    return {
      id: phase.id,
      index: pIdx,
      x: phaseX,
      title: phase.title,
      description: phase.description,
      unlocked,
      modules: positionedModules,
    }
  })
}

// ─── SVG path builders ───────────────────────────────────────────────────────

function cubicCurve(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.abs(x2 - x1) * 0.5
  const cpx1 = x1 + dx
  const cpx2 = x2 - dx
  return `C ${cpx1} ${y1}, ${cpx2} ${y2}, ${x2} ${y2}`
}

function modulePath(nodes: { x: number; y: number }[]): string {
  if (nodes.length < 2) return ""
  const parts = nodes.map((n, i) => {
    if (i === 0) return `M ${n.x} ${n.y}`
    const prev = nodes[i - 1]
    const dx = Math.abs(n.x - prev.x) * 0.6
    return `C ${prev.x + dx} ${prev.y}, ${n.x - dx} ${n.y}, ${n.x} ${n.y}`
  })
  return parts.join(" ")
}

// ─── Particles ───────────────────────────────────────────────────────────────

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 3,
}))

// ─── Component ───────────────────────────────────────────────────────────────

interface WorldMapProps {
  phases: Phase[]
  userLevel: number
}

export function WorldMap({ phases, userLevel }: WorldMapProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const positionedPhases = useMemo(
    () => buildPhasePositions(phases, userLevel),
    [phases, userLevel]
  )
  const totalWidth = positionedPhases.reduce(
    (sum, _, i) =>
      sum +
      (i === 0 ? PHASE_WIDTH + 80 : PHASE_WIDTH + PHASE_GAP) +
      PHASE_GAP,
    PHASE_GAP
  )

  return (
    <div
      ref={scrollRef}
      className="relative overflow-x-auto overflow-y-hidden"
      style={{ height: MAP_HEIGHT }}
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(59,130,246,0.03),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Floating orbs */}
        <div className="absolute -top-24 left-[15%] size-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute top-1/3 left-[45%] size-64 rounded-full bg-blue-500/4 blur-3xl" />
        <div className="absolute bottom-0 right-[20%] size-80 rounded-full bg-purple-500/4 blur-3xl" />
        <div className="absolute top-1/2 right-[10%] size-48 rounded-full bg-emerald-500/3 blur-3xl" />

        {/* Floating particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-indigo-500/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Terrain islands per phase */}
      {positionedPhases.map((pp) => {
        const theme = phaseThemes[pp.index] ?? phaseThemes[0]
        return (
          <div
            key={`terrain-${pp.id}`}
            className="pointer-events-none absolute bottom-8 top-8 rounded-[3rem] opacity-40"
            style={{
              left: pp.x - 40,
              width: PHASE_WIDTH + 80,
              background: pp.unlocked ? theme.islandBg : undefined,
              border: pp.unlocked
                ? `1px solid ${theme.accent}08`
                : "1px solid rgba(255,255,255,0.02)",
              boxShadow: pp.unlocked
                ? `inset 0 0 120px ${theme.accentDim}`
                : undefined,
            }}
          />
        )
      })}

      <div className="relative" style={{ width: totalWidth, height: MAP_HEIGHT - 80 }}>
        {/* SVG paths */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={totalWidth}
          height={MAP_HEIGHT - 80}
        >
          <defs>
            {phaseThemes.map((t, i) => (
              <linearGradient key={t.id} id={`pathGlow-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={t.accent} stopOpacity="0.1" />
                <stop offset="50%" stopColor={t.accent} stopOpacity="0.25" />
                <stop offset="100%" stopColor={t.accent} stopOpacity="0.1" />
              </linearGradient>
            ))}
          </defs>

          {/* Intra-module paths */}
          {positionedPhases.map((pp) => {
            const theme = phaseThemes[pp.index] ?? phaseThemes[0]
            return pp.modules.map((pm) => {
              const pts = [
                { x: pm.x + NODE_MODULE, y: pm.y },
                ...pm.nodes.slice(0, -1).map((n) => ({
                  x: n.x,
                  y: n.y - (n.type === "boss" ? NODE_BOSS / 2 : NODE_TOPIC / 2),
                })),
                {
                  x: pm.nodes[pm.nodes.length - 1].x,
                  y: pm.nodes[pm.nodes.length - 1].y - NODE_BOSS / 2,
                },
              ]
              if (pts.length < 2) return null
              const d = modulePath(pts)
              return (
                <g key={pm.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke={pp.unlocked ? `${theme.accent}50` : "rgb(113 113 122 / 0.25)"}
                    strokeWidth={2}
                    strokeDasharray={pp.unlocked ? "none" : "5 5"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {pp.unlocked && (
                    <>
                      <path
                        d={d}
                        fill="none"
                        stroke={`url(#pathGlow-${pp.index})`}
                        strokeWidth={8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={d}
                        fill="none"
                        stroke={theme.accent}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.15}
                      />
                    </>
                  )}
                </g>
              )
            })
          })}

          {/* Cross-module connectors */}
          {positionedPhases.map((pp) => {
            const theme = phaseThemes[pp.index] ?? phaseThemes[0]
            const segments: { key: string; d: string }[] = []
            for (let i = 0; i < pp.modules.length - 1; i++) {
              const from = pp.modules[i]
              const to = pp.modules[i + 1]
              const fx = from.x + NODE_MODULE + 6
              const fy = from.y
              const tx = to.x - NODE_MODULE - 6
              const ty = to.y
              segments.push({
                key: `conn-${from.id}`,
                d: cubicCurve(fx, fy, tx, ty),
              })
            }
            return segments.map((seg) => (
              <g key={seg.key}>
                <path
                  d={seg.d}
                  fill="none"
                  stroke={pp.unlocked ? `${theme.accent}40` : "rgb(113 113 122 / 0.15)"}
                  strokeWidth={1.5}
                  strokeDasharray={pp.unlocked ? "none" : "5 5"}
                  strokeLinecap="round"
                />
                {pp.unlocked && (
                  <path
                    d={seg.d}
                    fill="none"
                    stroke={theme.accent}
                    strokeWidth={6}
                    strokeLinecap="round"
                    opacity={0.08}
                  />
                )}
              </g>
            ))
          })}
        </svg>

        {/* Phase regions & nodes */}
        {positionedPhases.map((pp) => {
          const theme = phaseThemes[pp.index] ?? phaseThemes[0]
          return (
            <div
              key={pp.id}
              className="absolute inset-0"
              style={{ left: pp.x, width: PHASE_WIDTH }}
            >
              {/* Region header line */}
              <div className="absolute left-0 top-3.5 flex items-center gap-3">
                <div
                  className="h-[2px] w-8 rounded-full transition-all duration-500"
                  style={{
                    background: pp.unlocked
                      ? `linear-gradient(90deg, ${theme.accent}, ${theme.accent}60)`
                      : "rgb(113 113 122 / 0.3)",
                  }}
                />
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-500",
                    pp.unlocked ? theme.text : "text-muted-foreground/35"
                  )}
                >
                  {theme.label} Region
                </span>
                <div
                  className="h-[2px] flex-1 rounded-full"
                  style={{
                    background: pp.unlocked
                      ? `linear-gradient(90deg, ${theme.accent}50, transparent)`
                      : undefined,
                  }}
                />
              </div>

              {/* Phase intro card */}
              <div
                className={cn(
                  "absolute left-0 top-10 max-w-[280px] rounded-xl border p-4 transition-all duration-500",
                  pp.unlocked
                    ? [
                        "bg-background/70 backdrop-blur-md",
                        "hover:shadow-lg",
                      ].join(" ")
                    : "border-muted-foreground/10 bg-muted/20"
                )}
                style={
                  pp.unlocked
                    ? {
                        borderColor: `${theme.accent}25`,
                        boxShadow: `0 0 30px ${theme.accentDim}`,
                      }
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.18em]",
                      pp.unlocked ? theme.text : "text-muted-foreground/45"
                    )}
                  >
                    Phase {pp.index + 1}
                  </span>
                  {pp.unlocked && (
                    <span
                      className="rounded-full border px-2 py-0.5 text-[9px] font-medium"
                      style={{
                        borderColor: `${theme.accent}20`,
                        color: theme.accent,
                        background: `${theme.accent}10`,
                      }}
                    >
                      {pp.title}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-1.5 text-xs leading-relaxed transition-colors",
                    pp.unlocked ? "text-muted-foreground" : "text-muted-foreground/45"
                  )}
                >
                  {pp.description}
                </p>
                {!pp.unlocked && (
                  <p className="mt-2 text-[11px] font-semibold" style={{ color: theme.accent }}>
                    Unlocks at Level {pp.modules.length > 0 ? pp.modules[0].unlockLevel : "?"}
                  </p>
                )}
                {pp.unlocked && (
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{pp.modules.length} module{pp.modules.length !== 1 ? "s" : ""}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span style={{ color: theme.accent }}>
                      {pp.modules.reduce(
                        (acc, m) => acc + m.nodes.filter((n) => n.unlocked).length,
                        0
                      )}{" "}
                      / {pp.modules.reduce((acc, m) => acc + m.nodes.length, 0)} unlocked
                    </span>
                  </div>
                )}
              </div>

              {/* Module & topic nodes */}
              {pp.modules.map((pm) => (
                <div key={pm.id}>
                  {/* Module node */}
                  <Link
                    href={pm.unlocked ? `/modules/${pm.id}` : "#"}
                    className="absolute z-10"
                    style={{ left: pm.x - NODE_MODULE, top: pm.y - NODE_MODULE }}
                  >
                    <motion.div
                      initial={false}
                      whileHover={{ scale: pm.unlocked ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 18 }}
                      className={cn(
                        "flex items-center justify-center rounded-full border-2 transition-all duration-500",
                        pm.unlocked
                          ? "bg-background shadow-lg"
                          : "bg-muted/50 border-muted-foreground/15"
                      )}
                      style={{
                        width: NODE_MODULE * 2,
                        height: NODE_MODULE * 2,
                        borderColor: pm.unlocked ? theme.accent : undefined,
                        boxShadow: pm.unlocked
                          ? `0 0 20px ${theme.accentGlow}, 0 0 60px ${theme.accentDim}`
                          : undefined,
                      }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: pm.unlocked ? theme.accent : "rgb(113 113 122 / 0.6)" }}
                      >
                        {pm.moduleIndex + 1}
                      </span>
                    </motion.div>
                  </Link>

                  {/* Module label - to the right of the node */}
                  <div
                    className="pointer-events-none absolute"
                    style={{
                      left: pm.x + NODE_MODULE + 10,
                      top: pm.y - 10,
                      maxWidth: 140,
                    }}
                  >
                    <p
                      className={cn(
                        "text-[11px] font-medium leading-snug transition-colors",
                        pm.unlocked
                          ? "text-foreground/80 [text-shadow:_0_0_12px_rgb(0_0_0_/_50%)]"
                          : "text-muted-foreground/35"
                      )}
                    >
                      {pm.label}
                    </p>
                  </div>

                  {/* Topic & boss nodes */}
                  {pm.nodes.map((node) => {
                    const isBoss = node.type === "boss"
                    const isTopic = node.type === "topic"
                    const sz = isBoss ? NODE_BOSS : isTopic ? NODE_TOPIC : NODE_MODULE

                    return (
                      <Link
                        key={node.id}
                        href={node.unlocked ? node.href : "#"}
                        className="absolute z-10"
                        style={{
                          left: node.x - sz,
                          top: node.y - sz,
                        }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <motion.div
                          initial={false}
                          whileHover={{
                            scale: node.unlocked ? 1.2 : 1,
                          }}
                          animate={
                            node.unlocked && isBoss
                              ? {
                                  boxShadow: [
                                    `0 0 12px ${theme.accent}90`,
                                    `0 0 28px ${theme.accent}`,
                                    `0 0 12px ${theme.accent}90`,
                                  ],
                                }
                              : {}
                          }
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 18,
                            ...(node.unlocked && isBoss
                              ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                              : {}),
                          }}
                          className={cn(
                            "flex items-center justify-center rounded-full border-2 transition-all",
                            isBoss && node.unlocked && "shadow-lg",
                            isTopic && node.unlocked && "bg-background hover:shadow-md",
                            isTopic && !node.unlocked && "border-muted-foreground/10 bg-muted/30",
                            isBoss && !node.unlocked && "border-muted-foreground/10",
                          )}
                          style={{
                            width: sz * 2,
                            height: sz * 2,
                            borderColor: node.unlocked
                              ? isBoss
                                ? theme.accent
                                : `${theme.accent}55`
                              : undefined,
                            background: node.unlocked
                              ? isBoss
                                ? `radial-gradient(circle, ${theme.accent}18, ${theme.accent}08)`
                                : isTopic
                                  ? "var(--background)"
                                  : undefined
                              : undefined,
                          }}
                        >
                          {!node.unlocked ? (
                            <Lock
                              className={isBoss ? "size-4" : "size-3"}
                              style={{ color: "rgb(113 113 122 / 0.5)" }}
                            />
                          ) : isBoss ? (
                            <Swords
                              className="size-4"
                              style={{ color: theme.accent }}
                            />
                          ) : isTopic ? (
                            <div
                              className="rounded-full"
                              style={{
                                width: 5,
                                height: 5,
                                background: theme.accent,
                                boxShadow: `0 0 6px ${theme.accent}`,
                              }}
                            />
                          ) : null}
                        </motion.div>

                        {/* Persistent label beside topic/boss nodes */}
                        {node.unlocked && !isTopic && (
                          <div
                            className="pointer-events-none absolute"
                            style={{
                              left: sz * 2 + 8,
                              top: sz - 8,
                              width: 180,
                            }}
                          >
                            <span className="text-[10px] font-medium leading-tight text-muted-foreground/70 [text-shadow:_0_0_10px_rgb(0_0_0_/_60%)]">
                              {node.label}
                            </span>
                          </div>
                        )}

                        {/* Tooltip on hover for topic nodes */}
                        {hoveredNode === node.id && node.unlocked && isTopic && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2"
                          >
                            <div
                              className="whitespace-nowrap rounded-lg border px-2.5 py-1 text-[10px] font-medium shadow-lg backdrop-blur-md"
                              style={{
                                borderColor: `${theme.accent}20`,
                                background: `color-mix(in srgb, var(--background) 90%, transparent)`,
                                color: theme.accent,
                              }}
                            >
                              {node.label}
                            </div>
                          </motion.div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })}

        {/* Journey end marker */}
        <div className="absolute" style={{ left: totalWidth - 60, top: MODULE_BASE_Y }}>
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="size-4 text-muted-foreground/40" />
              </motion.div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/30">
                Frontier
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
