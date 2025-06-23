"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, Zap, Crown } from "lucide-react"
import type { Player } from "@/app/page"

interface GameInterfaceProps {
  players: Player[]
  onSubmitRound: (winnerId: string, playerScores: Record<string, number>) => void
}

export default function GameInterface({ players, onSubmitRound }: GameInterfaceProps) {
  const [winnerId, setWinnerId] = useState<string>("")
  const [playerScores, setPlayerScores] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updatePlayerScore = (playerId: string, score: string) => {
    setPlayerScores((prev) => ({ ...prev, [playerId]: score }))
    // Clear error when user starts typing
    if (errors[playerId]) {
      setErrors((prev) => ({ ...prev, [playerId]: "" }))
    }
  }

  const validateAndSubmit = () => {
    const newErrors: Record<string, string> = {}
    const validatedScores: Record<string, number> = {}

    // Validate winner selection
    if (!winnerId) {
      alert("Please select a round winner!")
      return
    }

    // Validate scores for non-winners
    for (const player of players) {
      if (player.id !== winnerId) {
        const scoreStr = playerScores[player.id] || ""

        if (scoreStr === "") {
          newErrors[player.id] = "Score required"
          continue
        }

        const score = Number(scoreStr)
        if (isNaN(score) || score < 0) {
          newErrors[player.id] = "Must be a non-negative number"
          continue
        }

        validatedScores[player.id] = score
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit the round
    onSubmitRound(winnerId, validatedScores)

    // Reset form
    setWinnerId("")
    setPlayerScores({})
    setErrors({})
  }

  const totalPoints = Object.values(playerScores)
    .filter((score) => score !== "")
    .reduce((sum, score) => sum + Number(score), 0)

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border-4 border-white/50 overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-green-500 to-blue-500 p-6"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-black text-white drop-shadow-lg tracking-wide">ROUND SCORING</h2>
          <Zap className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <div className="p-8 space-y-8">
        {/* Winner Selection - Card Style */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h3 className="text-2xl font-black text-gray-800">Who won this round?</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer"
                onClick={() => setWinnerId(player.id)}
                style={{ perspective: "1000px" }}
              >
                <div
                  className={`relative p-4 rounded-2xl border-4 transition-all duration-300 transform-gpu ${
                    winnerId === player.id
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100 shadow-2xl shadow-yellow-500/50"
                      : "border-gray-300 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl"
                  }`}
                  style={{
                    background:
                      winnerId === player.id
                        ? `linear-gradient(135deg, ${player.color}30, ${player.color}10)`
                        : `linear-gradient(135deg, ${player.color}15, ${player.color}05)`,
                  }}
                >
                  {/* Card Corner */}
                  <div
                    className="absolute top-2 left-2 w-6 h-6 rounded-full opacity-30"
                    style={{ backgroundColor: player.color }}
                  />

                  {/* Player Name */}
                  <div className="text-center">
                    <div
                      className={`text-lg font-black ${winnerId === player.id ? "text-yellow-700" : "text-gray-800"}`}
                    >
                      {player.name}
                    </div>
                    <div className="text-sm text-gray-600 font-bold">Current: {player.score}</div>
                  </div>

                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {winnerId === player.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Winner Glow */}
                  {winnerId === player.id && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Score Inputs */}
        <AnimatePresence>
          {winnerId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-black text-gray-800">Enter points for each player</h3>
              </div>

              <div className="space-y-4">
                {players
                  .filter((player) => player.id !== winnerId)
                  .map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="relative"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: player.color }} />
                        <span className="w-24 text-lg font-bold text-gray-700">{player.name}:</span>
                        <motion.div className="flex-1" whileFocus={{ scale: 1.02 }}>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={playerScores[player.id] || ""}
                            onChange={(e) => updatePlayerScore(player.id, e.target.value)}
                            className={`text-center text-xl font-bold h-12 rounded-xl border-2 ${
                              errors[player.id] ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
                            }`}
                          />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {errors[player.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 mt-2 text-red-600 text-sm font-bold"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors[player.id]}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
              </div>

              {/* Points Summary */}
              <AnimatePresence>
                {totalPoints > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-4 border-blue-200"
                  >
                    <div className="text-center">
                      <div className="text-lg text-blue-800 font-bold mb-2">
                        🏆 <strong>{players.find((p) => p.id === winnerId)?.name}</strong> will receive
                      </div>
                      <motion.div
                        className="text-4xl font-black text-blue-900"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {totalPoints} POINTS
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={validateAndSubmit}
            disabled={!winnerId}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white text-2xl font-black py-6 rounded-2xl shadow-xl border-4 border-white/30"
          >
            <CheckCircle className="w-6 h-6 mr-3" />
            SUBMIT ROUND
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
