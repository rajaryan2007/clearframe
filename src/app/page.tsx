"use client"
import LightRays from "@/components/LightRays";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      
      <div className="fixed inset-0 -z-10 bg-black">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.8}
          lightSpread={0.6}
          rayLength={3.5}
          followMouse={true}
          mouseInfluence={0.05}
          noiseAmount={0.02}
          distortion={0.1}
          className="opacity-60"
          pulsating={true}
          fadeDistance={0.8}
          saturation={1}
        />
      </div>

    
      <div className="z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-1000 ease-out">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Welcome to <span className="text-white">ClearFrame</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          Transforming information extraction with clarity and precision. 
          Experience the future of intelligent data processing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-700">
          <Link 
            href="/chat" 
            className="px-12 py-5 bg-white text-black font-black rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] text-xl"
          >
            Start Exploring
          </Link>
          <Link 
            href="/extension" 
            className="px-12 py-5 bg-white/5 text-white font-black rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:scale-105 transition-all duration-300 text-xl"
          >
            Get Extension
          </Link>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse transition-all duration-5000" />
    </div>
  );
}
