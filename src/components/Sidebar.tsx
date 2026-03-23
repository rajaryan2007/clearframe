'use client';

import { useEffect, useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, History, MessageSquare, Shield, Settings2, MoreHorizontal, PlusCircle, PanelLeftClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisItem {
  _id: string;
  input: string;
  result: {
    manipulation_score: number;
    bias: { direction: string };
  };
  createdAt: string;
}

interface SidebarProps {
  onSelectHistory: (item: AnalysisItem) => void;
  onNewAnalysis: () => void;
  onClose?: () => void;
  activeId?: string;
}

export default function Sidebar({ onSelectHistory, onNewAnalysis, activeId, onClose }: SidebarProps) {
  const { user, isSignedIn } = useUser();
  const [history, setHistory] = useState<AnalysisItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchHistory();
    }
  }, [isSignedIn]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-[#333]/30 w-72 shrink-0 transition-all duration-500">
      <div className="flex-1 overflow-hidden flex flex-col p-2">
        <div className="px-4 py-6 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">History</span>
           </div>
           <div className="flex items-center gap-1">
              <button 
                onClick={onNewAnalysis}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-500 hover:text-white"
              >
                  <Plus className="w-4 h-4" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-500 hover:text-white"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
           </div>
        </div>

        <ScrollArea className="flex-1">
           <div className="space-y-1.5 px-1.5">
              {!isSignedIn ? (
                <div className="px-6 py-12 text-center text-zinc-600 space-y-4">
                   <div className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto">
                      <MessageSquare className="w-4 h-4 opacity-20" />
                   </div>
                   <p className="text-[11px] font-medium leading-relaxed">Sign in to sync your<br/>extraction history.</p>
                </div>
              ) : isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <div key={i} className="h-10 w-full animate-pulse bg-white/[0.01] rounded-xl mb-1.5" />
                ))
              ) : history.length === 0 ? (
                <div className="px-4 py-8 text-center text-zinc-700">
                   <p className="text-[11px] uppercase tracking-widest font-bold opacity-30">Empty Frame</p>
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => onSelectHistory(item)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 group relative border",
                      activeId === item._id 
                        ? "bg-white/5 text-white border-zinc-800" 
                        : "hover:bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border-transparent hover:border-zinc-800"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full shrink-0 transition-all",
                      item.result.manipulation_score > 70 ? "bg-red-500/60" :
                      item.result.manipulation_score > 30 ? "bg-yellow-500/60" :
                      "bg-emerald-500/60",
                      activeId === item._id && "scale-125"
                    )} />
                    <p className="text-xs font-semibold truncate flex-1 tracking-tight">
                      {item.input}
                    </p>
                    <MoreHorizontal className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </button>
                ))
              )}
           </div>
        </ScrollArea>
      </div>

      <div className="p-4 space-y-4 border-t border-[#333]/50 bg-black/40">
         <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              {isSignedIn && <UserButton />}
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">
                  {user?.firstName || 'ClearUser'}
                </span>
                <span className="text-[9px] text-emerald-500/50 font-bold uppercase italic tracking-tighter">Verified Node</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <Settings2 className="w-4 h-4 text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors" />
            </div>
         </div>
      </div>
    </div>
  );
}
