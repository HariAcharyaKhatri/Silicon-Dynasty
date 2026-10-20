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
      <div className="bg-[#161b22] border-t border-[#30363d] px-4 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-400 uppercase text-[10px] tracking-wider font-semibold">
            TELETYPE MONITOR
          </span>
          <span className="text-gray-400">Listening to industry telegraph wires...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#161b22] border-t border-[#30363d] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setSelectedAnchor(latestNews)}>
          <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">HISTORICAL ANCHOR</span>
          </div>

          <div className="truncate font-medium text-gray-200 hover:text-emerald-400 transition-colors">
            <span className="font-mono text-gray-400 mr-2">[{latestNews.date}]</span>
            {latestNews.headline}
          </div>
        </div>

        <button
          onClick={() => setSelectedAnchor(latestNews)}
          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 ml-4"
        >
          Details <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Detail Modal */}
      {selectedAnchor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-[#0d1117] px-5 py-3 border-b border-[#30363d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs uppercase font-bold text-gray-300">
                  DISPATCH: {selectedAnchor.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedAnchor(null)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#21262d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <h3 className="text-base font-bold text-white leading-snug">
                {selectedAnchor.headline}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed">
                {selectedAnchor.body}
              </p>

              {selectedAnchor.gameplayHook && (
                <div className="bg-[#0d1117] border border-emerald-500/30 p-3 rounded-lg flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide block">
                      Market Consequence
                    </span>
                    <span className="text-xs text-gray-300">
                      {selectedAnchor.gameplayHook}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#0d1117] px-5 py-3 border-t border-[#30363d] flex justify-end">
              <button
                onClick={() => setSelectedAnchor(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#21262d] text-white rounded-lg hover:bg-[#30363d] transition-all"
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
