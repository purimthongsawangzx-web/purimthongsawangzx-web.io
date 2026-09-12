import React, { useState } from 'react';
import { DepartmentVideo, DirectorySection } from '../../types';
import { parseVideoUrl } from '../../utils/videoUtils';

interface VideoPlayerModalProps {
  isOpen: boolean;
  video: DepartmentVideo | null;
  section: DirectorySection | null;
  onClose: () => void;
  onDeleteVideo?: (sectionId: string, videoId: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  video,
  section,
  onClose,
  onDeleteVideo
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  if (!isOpen || !video) return null;

  const parsed = parseVideoUrl(video.url);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const matchingEngineer = section?.engineers.find((e) =>
    video.machineName && e.machineSupport.toLowerCase().includes(video.machineName.toLowerCase().split(' ')[0])
  ) || section?.engineers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0F172A] text-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[94vh]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            </span>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-white truncate">
                {video.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{section?.title || 'Laboratory Department'}</span>
                {video.machineName && (
                  <>
                    <span>•</span>
                    <span className="text-blue-400 font-semibold">{video.machineName}</span>
                  </>
                )}
                {video.duration && (
                  <>
                    <span>•</span>
                    <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      {video.duration}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onDeleteVideo && section && (
              <>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2 bg-red-950/90 border border-red-800 px-3 py-1 rounded-full animate-in fade-in">
                    <span className="text-xs font-semibold text-red-200">Delete video?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteVideo(section.id, video.id);
                        setShowDeleteConfirm(false);
                        onClose();
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-slate-400 hover:text-red-400 p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Delete this tutorial video"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close player"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Responsive 16:9 Screen */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
            {parsed.type === 'youtube' || parsed.type === 'vimeo' ? (
              <iframe
                src={parsed.embedUrl}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : parsed.type === 'direct' ? (
              <video
                src={parsed.embedUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                <span className="material-symbols-outlined text-5xl text-blue-500 mb-2">
                  ondemand_video
                </span>
                <p className="text-sm font-semibold text-white mb-2">{video.title}</p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-all flex items-center gap-2"
                >
                  <span>Open Video in External Tab</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            )}
          </div>

          {/* Details & Interactive Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details & Step-by-Step Instructions */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-white">
                    {video.title}
                  </h3>
                  {video.tags &&
                    video.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                {video.titleThai && (
                  <p className="text-sm text-blue-400 font-medium">{video.titleThai}</p>
                )}
                {video.description && (
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800">
                    {video.description}
                  </p>
                )}
              </div>

              {/* Step by Step SOP Walkthrough */}
              {video.steps && video.steps.length > 0 && (
                <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">checklist</span>
                      <span>Automate SOP Checklist (ขั้นตอนการปฏิบัติงานทีละสเต็ป)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {Object.values(completedSteps).filter(Boolean).length} / {video.steps.length} completed
                    </span>
                  </div>

                  <div className="space-y-2">
                    {video.steps.map((step, idx) => {
                      const isDone = !!completedSteps[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleStep(idx)}
                          className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer select-none ${
                            isDone
                              ? 'bg-emerald-950/40 border-emerald-800 text-slate-400 line-through'
                              : 'bg-slate-800/60 border-slate-700 hover:border-blue-500 text-slate-200'
                          }`}
                        >
                          <div
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-500 bg-slate-900'
                            }`}
                          >
                            {isDone && (
                              <span className="material-symbols-outlined text-[12px]">check</span>
                            )}
                          </div>
                          <span className="text-xs sm:text-sm font-medium leading-snug">
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Support Contact & Machine Metadata */}
            <div className="space-y-4">
              {/* Machine Badge */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Automation System
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">precision_manufacturing</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {video.machineName || 'Automated Line'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Author: {video.author || 'Laboratory MT'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Machine Field Support Engineer Card */}
              {matchingEngineer && (
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Machine Field Engineer (ช่างผู้เชี่ยวชาญ)
                    </p>
                    {matchingEngineer.emergency24h && (
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-red-950 text-red-400 border border-red-800">
                        24H STAT
                      </span>
                    )}
                  </div>

                  <div>
                    <h5 className="font-bold text-sm text-white">{matchingEngineer.name}</h5>
                    <p className="text-xs text-slate-400">
                      {matchingEngineer.vendor} • {matchingEngineer.title}
                    </p>
                  </div>

                  <a
                    href={`tel:${matchingEngineer.phone.replace(/[^0-9+]/g, '')}`}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[15px]">call</span>
                    <span>Call Support: {matchingEngineer.phone}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Added on {video.addedDate || 'Recent'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-colors cursor-pointer"
          >
            Close Video
          </button>
        </div>
      </div>
    </div>
  );
};
