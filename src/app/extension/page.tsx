'use client';

import { Button } from "@/components/ui/button";
import { Chrome, Download, ShieldCheck, Zap } from "lucide-react";

export default function ExtensionPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-12 pt-[100px]">
            <div className="space-y-4 max-w-2xl">
                <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-3xl">
                    <Chrome size={40} className="text-white" />
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-white">
                    ClearFrame for Browser
                </h1>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed">
                    Analyze news, tweets, and articles instantly with our Chrome Extension. Get truth extraction directly from any webpage.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                {[
                    { icon: ShieldCheck, title: "Bias Detection", desc: "Instantly see political leaning" },
                    { icon: Zap, title: "Emotion Map", desc: "Identify manipulation tactics" },
                    { icon: Download, title: "Cloud Sync", desc: "Sync analysis to your dashboard" }
                ].map((feature, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 text-left">
                        <feature.icon size={24} className="text-zinc-400" />
                        <h3 className="font-bold text-white">{feature.title}</h3>
                        <p className="text-sm text-zinc-500">{feature.desc}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-12 w-full max-w-4xl">
                <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-[#333] backdrop-blur-3xl text-left space-y-8 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Download size={24} className="text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Installation Guide</h2>
                            <p className="text-zinc-500 text-sm">Follow these 4 steps to get started</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { step: "01", title: "Download Source", desc: "Download the extension source folder to your local machine." },
                            { step: "02", title: "Browser Settings", desc: "Open Chrome and navigate to `chrome://extensions` in the address bar." },
                            { step: "03", title: "Developer Mode", desc: "Enable 'Developer mode' using the toggle in the top right corner." },
                            { step: "04", title: "Load Unpacked", desc: "Click 'Load unpacked' and select the downloaded `extension` folder." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                                <span className="text-3xl font-black text-white/5 group-hover:text-emerald-500/20 transition-colors uppercase italic">{item.step}</span>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-zinc-300 group-hover:text-white transition-colors">{item.title}</h4>
                                    <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex flex-col items-center gap-6">
                        <a 
                            href="https://github.com/rajaryan2007/clearframe/archive/refs/heads/main.zip" 
                            className="bg-white text-black hover:bg-zinc-200 rounded-2xl px-12 py-5 text-lg font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center gap-3"
                        >
                            <Download size={20} />
                            Download Extension Folder
                        </a>
                        <p className="text-[9px] text-zinc-800 uppercase tracking-[0.4em] font-black opacity-40">
                            ClearFrame Protocol v1.0.4
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}