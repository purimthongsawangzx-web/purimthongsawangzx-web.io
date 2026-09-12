import React, { useState, useMemo } from 'react';
import { DirectorySection, DepartmentVideo } from '../../types';

interface ContactsViewProps {
  sections: DirectorySection[];
  searchQuery: string;
  onOpenAddMachine: (sectionId: string) => void;
  onOpenAddContact: (sectionId: string) => void;
  onOpenAddVideo: (sectionId: string) => void;
  onPlayVideo: (section: DirectorySection, video: DepartmentVideo) => void;
  onDeleteMachine: (sectionId: string, machineId: string) => void;
  onDeleteEngineer: (sectionId: string, engineerId: string) => void;
  onDeleteVideo: (sectionId: string, videoId: string) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  sections,
  searchQuery,
  onOpenAddMachine,
  onOpenAddContact,
  onOpenAddVideo,
  onPlayVideo,
  onDeleteMachine,
  onDeleteEngineer,
  onDeleteVideo
}) => {
  const [copiedExtension, setCopiedExtension] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'videos' | 'analyzers' | 'engineers'>('all');
  const [videoToDelete, setVideoToDelete] = useState<{ sectionId: string; videoId: string; title: string; sectionTitle: string } | null>(null);
  const [machineToDelete, setMachineToDelete] = useState<{ sectionId: string; machineId: string; name: string } | null>(null);
  const [engineerToDelete, setEngineerToDelete] = useState<{ sectionId: string; engineerId: string; name: string } | null>(null);

  const handleCopyExtension = (ext: string) => {
    navigator.clipboard.writeText(ext);
    setCopiedExtension(ext);
    setTimeout(() => setCopiedExtension(null), 2500);
  };

  const totalVideosCount = useMemo(() => {
    return sections.reduce((acc, sec) => acc + (sec.videos?.length || 0), 0);
  }, [sections]);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return sections
      .map((sec) => {
        const matchesSection =
          !q ||
          sec.title.toLowerCase().includes(q) ||
          sec.titleThai.toLowerCase().includes(q);

        const matchingMachines = sec.machines.filter(
          (m) =>
            !q ||
            m.name.toLowerCase().includes(q) ||
            m.extension.toLowerCase().includes(q) ||
            m.leadSpecialist.toLowerCase().includes(q) ||
            (m.model && m.model.toLowerCase().includes(q))
        );

        const matchingEngineers = sec.engineers.filter(
          (e) =>
            !q ||
            e.name.toLowerCase().includes(q) ||
            e.vendor.toLowerCase().includes(q) ||
            e.machineSupport.toLowerCase().includes(q) ||
            e.phone.toLowerCase().includes(q)
        );

        const matchingVideos = (sec.videos || []).filter(
          (v) =>
            !q ||
            v.title.toLowerCase().includes(q) ||
            (v.titleThai && v.titleThai.toLowerCase().includes(q)) ||
            (v.machineName && v.machineName.toLowerCase().includes(q)) ||
            (v.description && v.description.toLowerCase().includes(q)) ||
            (v.tags && v.tags.some((t) => t.toLowerCase().includes(q)))
        );

        if (
          matchesSection ||
          matchingMachines.length > 0 ||
          matchingEngineers.length > 0 ||
          matchingVideos.length > 0
        ) {
          return {
            ...sec,
            machines: matchesSection && !q ? sec.machines : matchingMachines,
            engineers: matchesSection && !q ? sec.engineers : matchingEngineers,
            videos: matchesSection && !q ? sec.videos || [] : matchingVideos
          };
        }
        return null;
      })
      .filter(Boolean) as DirectorySection[];
  }, [sections, searchQuery]);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {copiedExtension && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[#0284C7] text-[20px]">content_copy</span>
          <p className="text-sm font-medium">Copied {copiedExtension} to clipboard!</p>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[#0284C7] font-['Noto_Serif',serif] italic text-sm block mb-1">
            Departmental Directory & Automation Video Library
          </span>
          <h1 className="font-['Noto_Serif',serif] text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Lab Directory & Automation Guides
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Department phone extensions, analyzer operation video tutorials, and vendor field service hotlines.
          </p>
        </div>

        {/* Quick Resource Badges / Filter Switch */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setActiveCategoryFilter('videos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategoryFilter === 'videos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">smart_display</span>
            <span>Videos ({totalVideosCount})</span>
          </button>
          <button
            onClick={() => setActiveCategoryFilter('analyzers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategoryFilter === 'analyzers'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            Analyzers
          </button>
          <button
            onClick={() => setActiveCategoryFilter('engineers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategoryFilter === 'engineers'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            Engineers
          </button>
        </div>
      </div>

      {/* Directory Sections (2 Columns on large screen) */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8">
          <span className="material-symbols-outlined text-4xl text-[#94A3B8] mb-2">contact_phone</span>
          <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A]">No directory contacts or videos found</h3>
          <p className="text-sm text-[#475569] mt-1">
            No analyzer, video tutorial, or engineer matched &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredSections.map((sec) => (
            <div
              key={sec.id}
              id={`directory-section-${sec.id}`}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
            >
              <div>
                {/* Section Header with Thai Subtitle & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                  <div>
                    <h2 className="font-['Noto_Serif',serif] text-2xl font-bold text-[#0F172A]">
                      {sec.title}
                    </h2>
                    <span className="font-['Public_Sans',sans-serif] text-xs font-bold text-[#0284C7] tracking-widest uppercase block mt-0.5">
                      {sec.titleThai}
                    </span>
                    {sec.description && (
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-1">{sec.description}</p>
                    )}
                  </div>

                  {/* Add Resource Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onOpenAddVideo(sec.id)}
                      className="px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Add automation operation video tutorial"
                    >
                      <span className="material-symbols-outlined text-[15px]">video_call</span>
                      + Video
                    </button>
                    <button
                      onClick={() => onOpenAddMachine(sec.id)}
                      className="px-3 py-1.5 rounded-full border border-[#1E40AF]/40 text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                      title="Add analyzer machine"
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      Analyzer
                    </button>
                    <button
                      onClick={() => onOpenAddContact(sec.id)}
                      className="px-3 py-1.5 rounded-full border border-[#0284C7]/40 text-[#0284C7] hover:bg-[#0284C7] hover:text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                      title="Add vendor support contact"
                    >
                      <span className="material-symbols-outlined text-[14px]">person_add</span>
                      Vendor
                    </button>
                  </div>
                </div>

                {/* 1. Automation Video Tutorials Section */}
                {(activeCategoryFilter === 'all' || activeCategoryFilter === 'videos') && (
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-['Public_Sans',sans-serif] font-bold text-[#1E40AF] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px]">smart_display</span>
                        <span>Automate Tutorial Videos ({sec.videos?.length || 0})</span>
                      </p>
                      <button
                        onClick={() => onOpenAddVideo(sec.id)}
                        className="text-[11px] text-[#0284C7] hover:text-[#1E40AF] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span>+ Add Video</span>
                      </button>
                    </div>

                    {!sec.videos || sec.videos.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center space-y-2">
                        <p className="text-xs text-[#64748B]">
                          No automation video guides added for {sec.title} yet.
                        </p>
                        <button
                          onClick={() => onOpenAddVideo(sec.id)}
                          className="px-4 py-1.5 rounded-full bg-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1D4ED8] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[15px]">add_circle</span>
                          <span>Add How-To Video Guide</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sec.videos.map((video) => (
                          <div
                            key={video.id}
                            className="group relative rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden hover:border-[#1E40AF] hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            {/* Video Thumbnail & Play Trigger */}
                            <div
                              onClick={() => onPlayVideo(sec, video)}
                              className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                            >
                              <img
                                src={
                                  video.thumbnailUrl ||
                                  'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80'
                                }
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                                <div className="w-11 h-11 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 transition-all">
                                  <span className="material-symbols-outlined text-[24px]">
                                    play_arrow
                                  </span>
                                </div>
                              </div>

                              {/* Duration Badge */}
                              {video.duration && (
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono font-bold tracking-tight">
                                  {video.duration}
                                </span>
                              )}

                              {/* Machine Tag */}
                              {video.machineName && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-900/90 text-blue-200 text-[10px] font-bold tracking-tight backdrop-blur-xs">
                                  {video.machineName}
                                </span>
                              )}
                            </div>

                            {/* Video Details */}
                            <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                              <div>
                                <h4
                                  onClick={() => onPlayVideo(sec, video)}
                                  className="font-bold text-xs text-[#0F172A] line-clamp-2 hover:text-[#1E40AF] cursor-pointer"
                                  title={video.title}
                                >
                                  {video.title}
                                </h4>
                                {video.titleThai && (
                                  <p className="text-[11px] text-[#0284C7] line-clamp-1 mt-0.5 font-medium">
                                    {video.titleThai}
                                  </p>
                                )}
                              </div>

                              {/* Step count & Delete Action */}
                              <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-emerald-600">
                                    checklist
                                  </span>
                                  <span>{video.steps?.length || 0} Steps Guide</span>
                                </span>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => onPlayVideo(sec, video)}
                                    className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white font-bold text-[10px] transition-colors cursor-pointer"
                                  >
                                    Watch
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setVideoToDelete({
                                        sectionId: sec.id,
                                        videoId: video.id,
                                        title: video.title,
                                        sectionTitle: sec.title
                                      });
                                    }}
                                    className="text-[#94A3B8] hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Delete video"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">
                                      delete
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Machines / Analyzers List */}
                {(activeCategoryFilter === 'all' || activeCategoryFilter === 'analyzers') && (
                  <div className="mt-6 space-y-3">
                    <p className="text-[11px] font-['Public_Sans',sans-serif] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Analyzers & Station Extensions
                    </p>

                    {sec.machines.length === 0 ? (
                      <p className="text-xs text-[#94A3B8] italic">No analyzers listed.</p>
                    ) : (
                      sec.machines.map((machine) => (
                        <div
                          key={machine.id}
                          className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between group hover:border-[#1E40AF] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center">
                              <span className="material-symbols-outlined text-[20px]">
                                {machine.iconName || 'science'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-[#0F172A]">{machine.name}</h4>
                                {machine.model && (
                                  <span className="text-[10px] text-[#94A3B8] font-mono">
                                    ({machine.model})
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#64748B]">Lead: {machine.leadSpecialist}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyExtension(machine.extension)}
                              className="px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#BFDBFE] font-mono text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Click to copy extension"
                            >
                              <span>{machine.extension}</span>
                              <span className="material-symbols-outlined text-[13px]">content_copy</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setMachineToDelete({
                                  sectionId: sec.id,
                                  machineId: machine.id,
                                  name: machine.name
                                })
                              }
                              className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#DC2626] p-1 rounded-full hover:bg-[#FEE2E2] transition-opacity cursor-pointer"
                              title="Delete machine"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 3. Support Engineers List */}
                {(activeCategoryFilter === 'all' || activeCategoryFilter === 'engineers') && (
                  <div className="mt-6 space-y-3">
                    <p className="text-[11px] font-['Public_Sans',sans-serif] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Assigned Field Support Engineers
                    </p>

                    {sec.engineers.length === 0 ? (
                      <p className="text-xs text-[#94A3B8] italic">No support engineers assigned.</p>
                    ) : (
                      sec.engineers.map((engineer) => (
                        <div
                          key={engineer.id}
                          className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-[#0284C7]/50 transition-colors shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#0F172A]">{engineer.name}</h4>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F1F5F9] text-[#475569]">
                                {engineer.title}
                              </span>
                              {engineer.emergency24h && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FEE2E2] text-[#DC2626]">
                                  24H STAT
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              {engineer.vendor} • Support for {engineer.machineSupport}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <a
                              href={`tel:${engineer.phone.replace(/[^0-9+]/g, '')}`}
                              className="px-4 py-1.5 rounded-full bg-[#1E40AF] text-white hover:bg-[#1D4ED8] text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[15px]">call</span>
                              <span>{engineer.phone}</span>
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                setEngineerToDelete({
                                  sectionId: sec.id,
                                  engineerId: engineer.id,
                                  name: engineer.name
                                })
                              }
                              className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#DC2626] p-1 rounded-full hover:bg-[#FEE2E2] transition-opacity cursor-pointer"
                              title="Delete contact"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Video Confirmation Modal */}
      {videoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E2E8F0] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <div>
              <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A]">
                Delete Video Tutorial?
              </h3>
              <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-[#0F172A]">&quot;{videoToDelete.title}&quot;</span>? This will permanently remove the video guide and its step-by-step SOP from {videoToDelete.sectionTitle}.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setVideoToDelete(null)}
                className="px-4 py-2 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold font-['Public_Sans',sans-serif] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteVideo(videoToDelete.sectionId, videoToDelete.videoId);
                  setVideoToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-['Public_Sans',sans-serif] uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Delete Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Machine Confirmation Modal */}
      {machineToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E2E8F0] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">science</span>
            </div>
            <div>
              <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A]">
                Delete Analyzer?
              </h3>
              <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-[#0F172A]">&quot;{machineToDelete.name}&quot;</span> from the directory?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setMachineToDelete(null)}
                className="px-4 py-2 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold font-['Public_Sans',sans-serif] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteMachine(machineToDelete.sectionId, machineToDelete.machineId);
                  setMachineToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-['Public_Sans',sans-serif] uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Delete Analyzer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Engineer Confirmation Modal */}
      {engineerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E2E8F0] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">person_remove</span>
            </div>
            <div>
              <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A]">
                Delete Support Contact?
              </h3>
              <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-[#0F172A]">&quot;{engineerToDelete.name}&quot;</span> from the vendor support list?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setEngineerToDelete(null)}
                className="px-4 py-2 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold font-['Public_Sans',sans-serif] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEngineer(engineerToDelete.sectionId, engineerToDelete.engineerId);
                  setEngineerToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-['Public_Sans',sans-serif] uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

