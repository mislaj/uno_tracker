"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PlayerSetup from "@/components/player-setup"
import GameInterface from "@/components/game-interface"
import Scoreboard from "@/components/scoreboard"
import WinnerAnnouncement from "@/components/winner-announcement"
import ShareModal from "@/components/share-modal"
import GameStatusViewer from "@/components/game-status-viewer"
import { Button } from "@/components/ui/button"
import { RotateCcw, Sparkles, Share2 } from "lucide-react"

export interface Player {
  id: string
  name: string
  score: number
  color: string
}

export interface GameState {
  players: Player[]
  targetScore: number
  currentRound: number
  gameStarted: boolean
  gameEnded: boolean
  winner: Player | null
}

const initialGameState: GameState = {
  players: [],
  targetScore: 250,
  currentRound: 1,
  gameStarted: false,
  gameEnded: false,
  winner: null,
}

// Authentic UNO colors
const unoColors = ["#E53E3E", "#FFD700", "#3182CE", "#38A169", "#9F7AEA", "#F56500", "#ED64A6", "#4FD1C7"]

export default function UnoTracker() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareType, setShareType] = useState<"game" | "winner">("game")

  // Check for shared game data in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sharedData = urlParams.get("shared")
    const type = urlParams.get("type") as "game" | "winner"

    if (sharedData) {
      try {
        const gameData = JSON.parse(decodeURIComponent(sharedData))
        // Show shared game status
        return
      } catch (error) {
        console.error("Failed to parse shared game data:", error)
      }
    }
  }, [])

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedGame = localStorage.getItem("uno-game-state")
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame)
        setGameState(parsedGame)
      } catch (error) {
        console.error("Failed to load saved game:", error)
      }
    }
  }, [])

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameState.gameStarted) {
      localStorage.setItem("uno-game-state", JSON.stringify(gameState))
    }
  }, [gameState])

  const startGame = (players: Player[], targetScore: number) => {
    const playersWithColors = players.map((player, index) => ({
      ...player,
      color: unoColors[index % unoColors.length],
    }))

    const newGameState: GameState = {
      players: playersWithColors,
      targetScore,
      currentRound: 1,
      gameStarted: true,
      gameEnded: false,
      winner: null,
    }
    setGameState(newGameState)
  }

  const submitRound = (winnerId: string, playerScores: Record<string, number>) => {
    const totalPoints = Object.values(playerScores).reduce((sum, score) => sum + score, 0)

    const updatedPlayers = gameState.players.map((player) => {
      if (player.id === winnerId) {
        return { ...player, score: player.score + totalPoints }
      }
      return player
    })

    // Check for winner
    const winner = updatedPlayers.find((player) => player.score >= gameState.targetScore)

    setGameState((prev) => ({
      ...prev,
      players: updatedPlayers,
      currentRound: prev.currentRound + 1,
      gameEnded: !!winner,
      winner: winner || null,
    }))
  }

  const resetGame = () => {
    localStorage.removeItem("uno-game-state")
    setGameState(initialGameState)
  }

  const openShareModal = (type: "game" | "winner") => {
    setShareType(type)
    setShareModalOpen(true)
  }

  // Check if viewing shared content
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
  const sharedData = urlParams?.get("shared")
  const viewType = urlParams?.get("type") as "game" | "winner"

  if (sharedData) {
    try {
      const gameData = JSON.parse(decodeURIComponent(sharedData))
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
          <GameStatusViewer gameData={gameData} type={viewType || "game"} />
        </div>
      )
    } catch (error) {
      console.error("Failed to parse shared game data:", error)
    }
  }

  return (
    <div
      className={`min-h-screen font-uno ${!gameState.gameStarted ? "bg-uno-landing" : "bg-gradient-to-br from-red-500 via-yellow-400 via-green-500 to-blue-500"} p-4`}
    >
      {/* UNO Card Background Pattern - Only for Landing Page */}
      {!gameState.gameStarted && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-48 bg-red-500 rounded-2xl transform rotate-12 uno-card-shadow" />
          <div className="absolute top-20 right-20 w-32 h-48 bg-blue-500 rounded-2xl transform -rotate-12 uno-card-shadow" />
          <div className="absolute bottom-20 left-20 w-32 h-48 bg-green-500 rounded-2xl transform rotate-45 uno-card-shadow" />
          <div className="absolute bottom-10 right-10 w-32 h-48 bg-yellow-500 rounded-2xl transform -rotate-45 uno-card-shadow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-60 bg-purple-500 rounded-2xl rotate-6 uno-card-shadow" />
        </div>
      )}

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {gameState.gameEnded && gameState.winner ? (
            <motion.div
              key="winner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <WinnerAnnouncement
                winner={gameState.winner}
                players={gameState.players}
                onNewGame={resetGame}
                onShare={() => openShareModal("winner")}
              />
            </motion.div>
          ) : !gameState.gameStarted ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.h1
                  className="text-6xl font-black text-white mb-2 drop-shadow-2xl tracking-wider"
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
                  UNO
                </motion.h1>
                <motion.div
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <p className="text-2xl text-white/90 drop-shadow font-bold">Score Tracker</p>
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
              </motion.div>
              <PlayerSetup onStartGame={startGame} />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto game-container"
            >
              <motion.div
                className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-white text-center sm:text-left">
                  <motion.h1
                    className="text-3xl sm:text-4xl font-black drop-shadow-2xl tracking-wider"
                    style={{
                      textShadow:
                        "3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000",
                    }}
                    animate={{
                      textShadow: [
                        "3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000",
                        "4px 4px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000",
                        "3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    UNO TRACKER
                  </motion.h1>
                  <motion.p
                    className="text-lg sm:text-xl text-white/90 font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Round {gameState.currentRound}
                  </motion.p>
                </div>

                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => openShareModal("game")}
                      className="bg-blue-500/80 border-2 border-white/30 text-white hover:bg-blue-600/80 backdrop-blur-sm font-bold text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-xl"
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Share
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={resetGame}
                      className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-xl"
                    >
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      New Game
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Scoreboard players={gameState.players} targetScore={gameState.targetScore} />
                </motion.div>
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <GameInterface players={gameState.players} onSubmitRound={submitRound} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        gameData={{
          players: gameState.players,
          targetScore: gameState.targetScore,
          currentRound: gameState.currentRound,
          winner: gameState.winner,
        }}
        type={shareType}
      />
    </div>
  )
}
