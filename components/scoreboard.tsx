"use client"

import { motion } from "framer-motion"
import { Trophy, Target, Crown } from "lucide-react"
import type { Player } from "@/app/page"

interface ScoreboardProps {
  players: Player[]
  targetScore: number
}

export default function Scoreboard({ players, targetScore }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const leader = sortedPlayers[0]

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border-4 border-white/50 overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 sm:p-6"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg tracking-wide">SCOREBOARD</h2>
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <div className="flex items-center justify-center gap-2 text-white/90">
          <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-base sm:text-lg font-bold">Target: {targetScore} points</span>
        </div>
      </motion.div>

      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {sortedPlayers.map((player, index) => {
          const isLeader = player.id === leader.id && player.score > 0
          const progressPercentage = Math.min((player.score / targetScore) * 100, 100)

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              className="relative"
              style={{ perspective: "1000px" }}
            >
              {/* Clean Card Style */}
              <div
                className={`relative p-4 sm:p-6 rounded-2xl border-4 transition-all duration-300 transform-gpu ${
                  isLeader
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100 shadow-2xl shadow-yellow-500/30"
                    : "border-gray-300 bg-gradient-to-br from-white to-gray-50 shadow-xl"
                }`}
                style={{
                  background: isLeader
                    ? `linear-gradient(135deg, ${player.color}20, ${player.color}10)`
                    : `linear-gradient(135deg, ${player.color}15, ${player.color}05)`,
                }}
              >
                {/* Card Corner Decorations */}
                <div
                  className="absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full opacity-20"
                  style={{ backgroundColor: player.color }}
                />
                <div
                  className="absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full opacity-20"
                  style={{ backgroundColor: player.color }}
                />

                {/* Player Info */}
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-black text-sm sm:text-lg shadow-lg ${
                        isLeader ? "bg-yellow-500" : "bg-gray-500"
                      }`}
                      animate={isLeader ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      #{index + 1}
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg sm:text-xl font-black ${isLeader ? "text-yellow-700" : "text-gray-800"}`}
                        >
                          {player.name}
                        </span>
                        {isLeader && (
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                  <motion.span
                    className={`text-2xl sm:text-3xl font-black ${isLeader ? "text-yellow-700" : "text-gray-800"}`}
                    animate={isLeader ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {player.score}
                  </motion.span>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isLeader
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                          : "bg-gradient-to-r from-blue-400 to-purple-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    />
                  </div>

                  {/* Progress Text */}
                  <motion.div
                    className="text-xs sm:text-sm font-bold text-gray-600 mt-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    {targetScore - player.score > 0 ? `${targetScore - player.score} points to win` : "🏆 WINNER! 🏆"}
                  </motion.div>
                </div>

                {/* Winning Glow Effect */}
                {player.score >= targetScore && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
