"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, Play, Users, Target } from "lucide-react"
import type { Player } from "@/app/page"

interface PlayerSetupProps {
  onStartGame: (players: Player[], targetScore: number) => void
}

export default function PlayerSetup({ onStartGame }: PlayerSetupProps) {
  const [players, setPlayers] = useState<string[]>(["", ""])
  const [targetScore, setTargetScore] = useState(250)

  const addPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, ""])
    }
  }

  const removePlayer = () => {
    if (players.length > 2) {
      setPlayers(players.slice(0, -1))
    }
  }

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players]
    newPlayers[index] = name
    setPlayers(newPlayers)
  }

  const handleStartGame = () => {
    const validPlayers = players.filter((name) => name.trim() !== "")
    if (validPlayers.length >= 2) {
      const playerObjects: Player[] = validPlayers.map((name, index) => ({
        id: `player-${index}`,
        name: name.trim(),
        score: 0,
        color: "#FF5555",
      }))
      onStartGame(playerObjects, targetScore)
    }
  }

  const canStart = players.filter((name) => name.trim() !== "").length >= 2

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border-4 border-white/50 overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-red-500 to-blue-500 p-6 text-center"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h2
          className="text-3xl font-black text-white drop-shadow-lg tracking-wide"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          SETUP GAME
        </motion.h2>
      </motion.div>

      <div className="p-8 space-y-8">
        {/* Target Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-red-500" />
            <label className="text-xl font-bold text-gray-800">Target Score</label>
          </div>
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <Input
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              min={50}
              max={1000}
              className="text-center text-2xl font-black h-16 rounded-2xl border-4 border-gray-200 focus:border-blue-500 bg-gradient-to-r from-yellow-50 to-orange-50"
            />
          </motion.div>
        </motion.div>

        {/* Players */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              <label className="text-xl font-bold text-gray-800">Players ({players.length}/8)</label>
            </div>
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={removePlayer}
                  disabled={players.length <= 2}
                  size="sm"
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300"
                >
                  <Minus className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={addPlayer}
                  disabled={players.length >= 8}
                  size="sm"
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="space-y-4">
            {players.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <Input
                  placeholder={`Player ${index + 1} name`}
                  value={player}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="text-center text-lg font-bold h-14 rounded-2xl border-4 border-gray-200 focus:border-green-500 bg-gradient-to-r from-blue-50 to-purple-50"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleStartGame}
            disabled={!canStart}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white text-2xl font-black py-6 rounded-2xl shadow-xl border-4 border-white/30"
          >
            <Play className="w-6 h-6 mr-3" />
            START GAME
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
