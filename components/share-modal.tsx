"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, QrCode, Camera, Copy, X, Download, Trophy, Users } from "lucide-react"
import QRCode from "qrcode"
import html2canvas from "html2canvas"
import type { Player } from "@/app/page"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  gameData: {
    players: Player[]
    targetScore: number
    currentRound: number
    winner?: Player | null
  }
  type: "game" | "winner"
}

export default function ShareModal({ isOpen, onClose, gameData, type }: ShareModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [shareUrl, setShareUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [screenshotTaken, setScreenshotTaken] = useState(false)

  const generateShareUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const gameState = encodeURIComponent(JSON.stringify(gameData))
    const url = `${baseUrl}?shared=${gameState}&type=${type}`
    setShareUrl(url)
    return url
  }

  const generateQRCode = async () => {
    try {
      const url = generateShareUrl()
      const qrUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const copyToClipboard = async () => {
    try {
      const url = shareUrl || generateShareUrl()
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const takeScreenshot = async () => {
    try {
      const element = document.querySelector(type === "winner" ? ".winner-container" : ".game-container")
      if (element) {
        const canvas = await html2canvas(element as HTMLElement, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
        })

        const link = document.createElement("a")
        link.download = `uno-${type === "winner" ? "winner" : "game"}-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()

        setScreenshotTaken(true)
        setTimeout(() => setScreenshotTaken(false), 2000)
      }
    } catch (error) {
      console.error("Failed to take screenshot:", error)
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        const url = shareUrl || generateShareUrl()
        await navigator.share({
          title: type === "winner" ? `🏆 ${gameData.winner?.name} Won UNO!` : "🎮 UNO Game in Progress",
          text:
            type === "winner"
              ? `${gameData.winner?.name} just won our UNO game with ${gameData.winner?.score} points!`
              : `Join our UNO game! Currently on round ${gameData.currentRound}`,
          url: url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800">Share Game</h2>
                  <p className="text-sm text-gray-600">
                    {type === "winner" ? "Share the winner!" : "Share current status"}
                  </p>
                </div>
              </div>
              <Button onClick={onClose} variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Game Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                {type === "winner" ? (
                  <Trophy className="w-5 h-5 text-yellow-600" />
                ) : (
                  <Users className="w-5 h-5 text-blue-600" />
                )}
                <span className="font-bold text-gray-800">
                  {type === "winner" ? `${gameData.winner?.name} Won!` : `Round ${gameData.currentRound}`}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {type === "winner" ? (
                  <div>
                    <div>Final Score: {gameData.winner?.score} points</div>
                    <div>Target: {gameData.targetScore} points</div>
                  </div>
                ) : (
                  <div>
                    <div>{gameData.players.length} players</div>
                    <div>Target: {gameData.targetScore} points</div>
                  </div>
                )}
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              {/* Native Share (Mobile) */}
              {typeof navigator !== "undefined" && navigator.share && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={shareNative}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 rounded-2xl"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </motion.div>
              )}

              {/* Copy Link */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Share Link</label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl || generateShareUrl()}
                    readOnly
                    className="flex-1 text-sm"
                    placeholder="Generating link..."
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className={`px-3 ${copied ? "bg-green-100 border-green-300" : ""}`}
                    >
                      {copied ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600">
                          ✓
                        </motion.div>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* QR Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700">QR Code</label>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={generateQRCode} variant="outline" size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {qrCodeUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex justify-center p-4 bg-white rounded-2xl border-2 border-gray-200"
                    >
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-32 h-32" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Screenshot */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={takeScreenshot}
                  variant="outline"
                  className={`w-full font-bold py-3 rounded-2xl ${
                    screenshotTaken ? "bg-green-100 border-green-300 text-green-700" : ""
                  }`}
                >
                  {screenshotTaken ? (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Screenshot Saved!
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Take Screenshot
                    </>
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">Share your UNO game with friends and family!</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
