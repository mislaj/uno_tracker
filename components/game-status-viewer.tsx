"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Users, Target, Clock } from "lucide-react"
import type { Player } from "@/app/page"

interface GameStatusViewerProps {
  gameData: {
    players: Player[]
    targetScore: number
    currentRound: number
    winner?: Player | null
  }
  type: "game" | "winner"
}

export default function GameStatusViewer({ gameData, type }: GameStatusViewerProps) {
  const [timeShared, setTimeShared] = useState<string>("")

  useEffect(() => {
    setTimeShared(new Date().toLocaleString())
  }, [])

  const sortedPlayers = [...gameData.players].sort((a, b) => b.score - a.score)
  const leader = sortedPlayers[0]

  if (type === "winner" && gameData.winner) {
    return (
      <div className="winner-container max-w-2xl mx-auto p-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-2xl">
        <div className="text-center text-white">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="mb-6"
          >
            <Trophy className="w-20 h-20 mx-auto text-yellow-200" />
          </motion.div>

          <h1 className="text-5xl font-black mb-4 drop-shadow-2xl">🎉 WINNER! 🎉</h1>

          <h2 className="text-4xl font-black mb-6 drop-shadow-xl">{gameData.winner.name}</h2>

          <div className="bg-white/20 rounded-2xl p-4 mb-4">
            <div className="text-2xl font-bold">Final Score: {gameData.winner.score} points</div>
            <div className="text-lg opacity-90">Target: {gameData.targetScore} points</div>
          </div>

          <div className="text-sm opacity-75">Shared on {timeShared}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8" />
            <h1 className="text-3xl font-black">UNO Game Status</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/20 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5" />
                <span className="font-bold">Round</span>
              </div>
              <div className="text-2xl font-black">{gameData.currentRound}</div>
            </div>

            <div className="bg-white/20 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-5 h-5" />
                <span className="font-bold">Target</span>
              </div>
              <div className="text-2xl font-black">{gameData.targetScore}</div>
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-black text-gray-800 text-center mb-6">Current Standings</h2>

          {sortedPlayers.map((player, index) => {
            const isLeader = player.id === leader.id && player.score > 0
            const progressPercentage = Math.min((player.score / gameData.targetScore) * 100, 100)

            return (
              <div
                key={player.id}
                className={`p-4 rounded-2xl border-4 ${
                  isLeader
                    ? "border-yellow-400 bg-gradient-to-r from-yellow-100 to-orange-100"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black ${
                        isLeader ? "bg-yellow-500" : "bg-gray-500"
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-black ${isLeader ? "text-yellow-700" : "text-gray-800"}`}>
                          {player.name}
                        </span>
                        {isLeader && <Trophy className="w-5 h-5 text-yellow-600" />}
                      </div>
                    </div>
                  </div>
                  <span className={`text-3xl font-black ${isLeader ? "text-yellow-700" : "text-gray-800"}`}>
                    {player.score}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full ${
                      isLeader
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                        : "bg-gradient-to-r from-blue-400 to-purple-500"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="text-sm font-bold text-gray-600 mt-2 text-center">
                  {gameData.targetScore - player.score > 0
                    ? `${gameData.targetScore - player.score} points to win`
                    : "🏆 WINNER! 🏆"}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <div className="text-sm text-gray-600">Shared on {timeShared}</div>
          <div className="text-xs text-gray-500 mt-1">UNO Score Tracker</div>
        </div>
      </div>
    </div>
  )
}
