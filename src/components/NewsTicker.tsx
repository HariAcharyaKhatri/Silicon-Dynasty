import React from 'react';
import { NewsAnchor, GameDate } from '../types/game';
import { Radio, ChevronRight, AlertCircle, X } from 'lucide-react';

interface Props {
  newsQueue: NewsAnchor[];
  currentDate: GameDate;
}

export const NewsTicker: React.FC<Props> = ({ newsQueue, currentDate }) => {
  const [selectedAnchor, setSelectedAnchor] = React.useState<NewsAnchor | null>(null);

  // Latest news item
  const latestNews = newsQueue[newsQueue.length - 1];

  if (!latestNews) {
    return (
      <div className="sticky bottom-0 z-30 bg-[#12161f]/95 backdrop-blur-md border-t border-[#30363d] px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-400 uppercase text-[10px] tracking-wider font-semibold">
            TELETYPE MONITOR
          </span>
          <span className="text-gray-400 text-[11px] truncate">Listening to telegraph wires...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky bottom-0 z-30 bg-[#12161f]/95 backdrop-blur-md border-t border-[#30363d] px-3 sm:px-4 py-2 flex items-center justify-between text-xs shadow-lg">
        <div className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1 mr-2" onClick={() => setSelectedAnchor(latestNews)}>
          <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider hidden xs:inline">HISTORICAL ANCHOR</span>
          </div>

          <div className="truncate font-medium text-gray-200 hover:text-emerald-400 transition-colors text-xs font-mono">
            <span className="text-gray-500 mr-1.5">[{latestNews.date}]</span>
            {latestNews.headline}
          </div>
        </div>

        <button
          onClick={() => setSelectedAnchor(latestNews)}
          className="shrink-0 flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg bg-[#161c28] border border-emerald-500/30"
        >
          <span>Dispatch</span> <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Detail Modal */}
      {selectedAnchor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0d1117] px-5 py-3 border-b border-[#30363d] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs uppercase font-bold text-gray-300">
                  HISTORICAL WIRE: {selectedAnchor.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedAnchor(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#21262d] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <h3 className="text-base font-bold text-white leading-snug">
                {selectedAnchor.headline}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {selectedAnchor.body}
              </p>

              {selectedAnchor.gameplayHook && (
                <div className="bg-[#0d1117] border border-emerald-500/30 p-3 rounded-xl flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wide block">
                      Market Consequence
                    </span>
                    <span className="text-xs text-gray-300">
                      {selectedAnchor.gameplayHook}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#0d1117] px-5 py-3 border-t border-[#30363d] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedAnchor(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#21262d] text-white rounded-xl hover:bg-[#30363d] transition-all"
              >
                Acknowledge Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
