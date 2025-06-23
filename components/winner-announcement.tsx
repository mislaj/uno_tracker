"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trophy, RotateCcw, Zap, Crown, Sparkles, Share2 } from "lucide-react"
import type { Player } from "@/app/page"

interface WinnerAnnouncementProps {
  winner: Player
  players: Player[]
  onNewGame: () => void
  onShare: () => void
}

const roastMessages = [
  "Better luck next time, losers! 🔥",
  "Ouch! That's gotta hurt! 😬",
  "Maybe try a different strategy next time? 🤔",
  "Don't worry, participation trophies are still trophies! 🏆",
  "At least you had fun... right? 😅",
  "Time to practice more UNO! 📚",
  "The winner takes it all! 🎵",
  "Victory tastes so sweet! 🍯",
  "Dominated! Absolutely dominated! 💪",
  "That was brutal! 💀",
  "Someone call the fire department! 🚒",
  "Absolutely demolished! 🏗️",
]

export default function WinnerAnnouncement({ winner, players, onNewGame, onShare }: WinnerAnnouncementProps) {
  const losers = players.filter((p) => p.id !== winner.id).sort((a, b) => b.score - a.score)
  const randomRoast = roastMessages[Math.floor(Math.random() * roastMessages.length)]

  return (
    <div className="max-w-4xl mx-auto px-4 winner-container">
      {/* Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
              y: -10,
              rotate: 0,
            }}
            animate={{
              y: (typeof window !== "undefined" ? window.innerHeight : 800) + 10,
              rotate: 360,
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Winner Card */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, type: "spring", bounce: 0.5 }}
        className="relative mb-6 sm:mb-8"
      >
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border-4 border-white/50 overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
          <div className="relative text-center p-6 sm:p-8">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="mb-4 sm:mb-6"
            >
              <Trophy className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-yellow-200 drop-shadow-2xl" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl font-black mb-2 sm:mb-4 drop-shadow-2xl tracking-wider"
              style={{
                textShadow:
                  "4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 2px 2px 0px #000",
              }}
              animate={{
                textShadow: [
                  "4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 2px 2px 0px #000",
                  "6px 6px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 2px 2px 0px #000",
                  "4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 2px 2px 0px #000",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              🎉 WINNER! 🎉
            </motion.h1>

            <motion.h2
              className="text-3xl sm:text-5xl font-black mb-4 sm:mb-6 drop-shadow-xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {winner.name}
            </motion.h2>

            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xl sm:text-2xl font-bold">
              <Crown className="w-6 h-6 sm:w-8 sm:h-8" />
              <span>Final Score: {winner.score} points</span>
              <Crown className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Roast Section */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border-4 border-white/50 overflow-hidden mb-6 sm:mb-8"
      >
        {/* Roast Header */}
        <div className="bg-gradient-to-r from-red-500 to-purple-600 p-4 sm:p-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg tracking-wide">
              TIME FOR ROASTING!
            </h3>
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <motion.p
            className="text-lg sm:text-2xl text-white font-bold text-center drop-shadow"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {randomRoast}
          </motion.p>
        </div>

        <div className="p-4 sm:p-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <h4 className="text-xl sm:text-2xl font-black text-gray-800">Final Standings</h4>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
          </div>

          <div className="space-y-3 sm:space-y-4">
            {losers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div
                  className="flex justify-between items-center p-4 sm:p-6 rounded-2xl border-4 border-gray-200 shadow-lg bg-white"
                  style={{
                    background: `linear-gradient(135deg, ${player.color}15, ${player.color}05)`,
                  }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                    >
                      #{index + 2}
                    </motion.div>
                    <span className="text-xl sm:text-2xl font-black text-gray-800">{player.name}</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-gray-600 relative z-10">{player.score} pts</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons - Mobile Responsive */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onShare}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xl sm:text-2xl font-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-2xl border-4 border-white w-full sm:w-auto"
          >
            <Share2 className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
            SHARE WIN
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onNewGame}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-xl sm:text-2xl font-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-2xl border-4 border-white w-full sm:w-auto"
          >
            <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
            NEW GAME
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
