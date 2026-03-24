"use client"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, SendHorizontal, Image as ImageIcon, X, User, Bot, Sparkles, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Sidebar from "@/components/Sidebar"
import AnalysisResult from "@/components/AnalysisResult"
import { createWorker } from 'tesseract.js'
import { Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'bot'
  content: string
  image?: string | null
  analysisResult?: any
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const startAnalysis = async (text: string) => {
    setIsAnalyzing(true)


    const botMessageId = messages.length + 1
    setMessages(prev => [...prev, {
      role: 'bot',
      content: "Analyzing text for bias and manipulation..."
    }])

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) throw new Error('Failed to start analysis')


      const interval = setInterval(async () => {
        const historyRes = await fetch('/api/history')
        const historyData = await historyRes.json()

        const latest = historyData.find((item: any) => item.input.trim() === text.trim())
        if (latest) {
          clearInterval(interval)
          setMessages(prev => {
            const newMsgs = [...prev]
            const lastBotMsg = newMsgs[newMsgs.length - 1]
            if (lastBotMsg && lastBotMsg.role === 'bot') {
              lastBotMsg.content = "Analysis complete."
              lastBotMsg.analysisResult = latest.result
            }
            return newMsgs
          })
          setActiveHistoryId(latest._id)
          setIsAnalyzing(false)
        }
      }, 3000)

      setTimeout(() => clearInterval(interval), 60000)

    } catch (error) {
      console.error('Analysis error:', error)
      setIsAnalyzing(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() && !image) return

    let textToAnalyze = input



    const newMessage: Message = {
      role: 'user',
      content: input,
      image: image
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")
    setImage(null)

    if (textToAnalyze.trim()) {
      await startAnalysis(textToAnalyze)
    } else if (image) {

      setMessages(prev => [...prev, {
        role: 'bot',
        content: "I've received your image. Please provide some text to analyze, or use the OCR feature to extract text from the image."
      }])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (f) => {
        const dataUrl = f.target?.result as string
        setImage(dataUrl)

        // Auto-OCR for convenience
        const worker = await createWorker('eng')
        const { data: { text } } = await worker.recognize(dataUrl)
        await worker.terminate()
        if (text.trim()) {
          setInput(prev => prev + (prev ? '\n' : '') + text)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelectHistory = (item: any) => {
    setMessages([
      { role: 'user', content: item.input },
      { role: 'bot', content: "Analysis from history.", analysisResult: item.result }
    ])
    setActiveHistoryId(item._id)
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden pt-[88px]">
      <div className={cn(
        "transition-all duration-300 ease-in-out h-full overflow-hidden",
        isSidebarOpen ? "w-72" : "w-0"
      )}>
        <Sidebar
          onSelectHistory={handleSelectHistory}
          onNewAnalysis={() => {
            setMessages([])
            setActiveHistoryId(undefined)
          }}
          activeId={activeHistoryId}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-[104px] z-50 rounded-xl bg-white/[0.03] border border-[#333] text-zinc-600 hover:text-white hover:bg-white/5"
        >
          <PanelLeft size={18} />
        </Button>
      )}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4 scrollbar-hide">
          <div className="max-w-[800px] mx-auto space-y-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in zoom-in duration-1000 ease-out">
                <div className="relative group p-6 rounded-2xl border border-white/[0.01] hover:border-white/5 transition-all duration-700">
                  <div className="absolute inset-0 bg-white/[0.02] blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative w-12 h-12 flex items-center justify-center bg-black border border-[#333] rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-500">
                    <div className="w-4 h-4 border-2 border-white/20 rounded-sm" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white/40 italic">
                    How can I <span className="text-white/80">clear the frame?</span>
                  </h2>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn("flex items-start gap-4 w-full", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn(
                      "shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                      msg.role === 'user'
                        ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        : "bg-[#111] text-white/40 border-[#333]"
                    )}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    <div className={cn(
                      "flex flex-col gap-2 max-w-[80%]",
                      msg.role === 'user' ? "items-end" : "items-start"
                    )}>
                      {msg.image && (
                        <div className="group relative">
                          <img
                            src={msg.image}
                            alt="User upload"
                            className="relative rounded-xl border border-[#333] max-h-60 w-auto object-cover shadow-xl"
                          />
                        </div>
                      )}
                      <div className={cn(
                        "px-5 py-3 rounded-xl text-base leading-[1.6] break-words shadow-sm transition-all duration-300",
                        msg.role === 'user'
                          ? "bg-[#1a1a1a] text-white hover:bg-[#222]"
                          : "bg-white/[0.03] text-white/80 border border-[#333] backdrop-blur-md"
                      )}>
                        {msg.content}
                        {msg.role === 'bot' && isAnalyzing && <Loader2 className="w-3 h-3 animate-spin inline ml-2 opacity-50" />}
                      </div>
                    </div>
                  </div>

                  {msg.analysisResult && (
                    <div className="w-full mt-2 pl-12">
                      <AnalysisResult result={msg.analysisResult} />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={scrollEndRef} className="h-4" />
          </div>
        </div>

        {/* Refined Minimalist Input Area */}
        <div className="w-full px-6 pb-6 mt-auto">
          <div className="max-w-[800px] mx-auto relative group">
            {image && (
              <div className="absolute bottom-full mb-3 left-0 p-1.5 bg-[#121212] border border-[#333] rounded-xl animate-in fade-in slide-in-from-bottom-2 shadow-2xl">
                <div className="relative">
                  <img src={image} alt="Upload preview" className="h-24 w-auto rounded-lg object-cover" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white shadow-xl transition-all"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            )}

            <div className="relative flex items-end bg-[#141414] border border-[#333] rounded-xl overflow-hidden focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/10 transition-all duration-300 shadow-2xl">
              <div className="p-3 flex items-center">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg w-9 h-9 text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus size={18} />
                </Button>
              </div>

              <Textarea
                placeholder="Ask ClearFrame anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[52px] max-h-[200px] w-full bg-transparent border-0 focus-visible:ring-0 resize-none px-3 py-4 text-sm placeholder:text-zinc-700 tracking-tight font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />

              <div className="p-3 flex items-center">
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={(!input.trim() && !image) || isAnalyzing}
                  className={cn(
                    "rounded-lg w-9 h-9 transition-all duration-300 border border-transparent",
                    (input.trim() || image) && !isAnalyzing
                      ? "bg-white text-black hover:scale-105"
                      : "bg-white/[0.02] text-zinc-800"
                  )}
                >
                  {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <SendHorizontal size={16} />}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-[8px] text-center text-zinc-800 mt-4 font-black tracking-[0.3em] uppercase opacity-30">
            Extraction Protocol v7.2
          </p>
        </div>
      </div>
    </div>
  )
}