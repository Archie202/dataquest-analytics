"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Zap, Star, Sparkles } from "lucide-react"

interface SuccessPopupProps {
  show: boolean
  xpEarned: number
  questTitle: string
  onClose: () => void
}

export function SuccessPopup({ show, xpEarned, questTitle, onClose }: SuccessPopupProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([])

  useEffect(() => {
    if (show) {
      const p = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        delay: Math.random() * 0.3,
      }))
      setParticles(p)

      const timer = setTimeout(() => onClose(), 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Popup card */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 mx-4 w-full max-w-sm"
          >
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-900/90 via-indigo-800/80 to-blue-900/80 p-8 text-center shadow-2xl shadow-indigo-500/20">
              {/* Background glow */}
              <div className="pointer-events-none absolute -inset-20">
                <div className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
              </div>

              {/* Particles */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/2"
                >
                  <div className="size-1.5 rounded-full bg-indigo-400" />
                </motion.div>
              ))}

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="relative mx-auto flex size-16 items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-500/30 blur-sm" />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600">
                  <Trophy className="size-8 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative mt-4 text-xl font-bold text-white"
              >
                Quest Completed!
              </motion.h2>

              {/* Quest name */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative mt-1 text-sm text-indigo-200"
              >
                {questTitle}
              </motion.p>

              {/* XP reward */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.5 }}
                className="relative mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-5 py-2"
              >
                <Zap className="size-5 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">+{xpEarned} XP</span>
              </motion.div>

              {/* Decorative stars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: 0.2, repeat: Infinity }}
                className="absolute top-3 right-4"
              >
                <Sparkles className="size-4 text-indigo-300" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, delay: 0.5, repeat: Infinity }}
                className="absolute bottom-10 left-4"
              >
                <Star className="size-3 text-blue-300" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
