import React, { useState, useEffect } from 'react';
import { DepartmentVideo, DirectorySection, DirectoryMachine } from '../../types';
import { parseVideoUrl } from '../../utils/videoUtils';

interface AddDepartmentVideoModalProps {
  isOpen: boolean;
  section: DirectorySection | null;
  onClose: () => void;
  onSubmit: (sectionId: string, video: Omit<DepartmentVideo, 'id'>) => void;
}

const PRESET_DEMO_VIDEOS = [
  {
    title: 'Automated Sample Loading & Rack Barcode Feed',
    url: 'https://www.youtube.com/watch?v=0k5iYyU0h0I',
    duration: '05:45',
    tags: ['Automate', 'Loading', 'Rack']
  },
  {
    title: 'Daily Analyzer Calibration & QC Run Protocol',
    url: 'https://www.youtube.com/watch?v=2Tz8XoI_q6g',
    duration: '06:20',
    tags: ['Calibration', 'QC', 'Standard']
  },
  {
    title: 'Emergency STAT Priority Lane Bypass & STAT Rerun',
    url: 'https://www.youtube.com/watch?v=J_7bY9Yq1_w',
    duration: '04:15',
    tags: ['STAT', 'Urgent', 'Bypass']
  },
  {
    title: 'Automated Probe Cleaning & Optical Wash Maintenance',
    url: 'https://www.youtube.com/watch?v=d_KzM8iR0aM',
    duration: '03:50',
    tags: ['Maintenance', 'Cleaning', 'Probe']
  }
];

export const AddDepartmentVideoModal: React.FC<AddDepartmentVideoModalProps> = ({
  isOpen,
  section,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [titleThai, setTitleThai] = useState('');
  const [url, setUrl] = useState('');
  const [machineId, setMachineId] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Automate']);
  const [author, setAuthor] = useState('');
  const [previewThumbnail, setPreviewThumbnail] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen && section) {
      setTitle('');
      setTitleThai('');
      setUrl('');
      setMachineId(section.machines[0]?.id || '');
      setDuration('05:00');
      setDescription('');
      setStepsText('Step 1: Check reagent inventory & status\nStep 2: Load barcoded sample tubes in rack\nStep 3: Press Start on automated sampler');
      setTags(['Automate', 'Workflow']);
      setAuthor('Lab MT Specialist');
      setPreviewThumbnail(undefined);
    }
  }, [isOpen, section]);

  // Update thumbnail preview when URL changes
  useEffect(() => {
    if (url.trim()) {
      const parsed = parseVideoUrl(url);
      if (parsed.thumbnailUrl) {
        setPreviewThumbnail(parsed.thumbnailUrl);
      }
    } else {
      setPreviewThumbnail(undefined);
    }
  }, [url]);

  if (!isOpen || !section) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleApplyPreset = (preset: typeof PRESET_DEMO_VIDEOS[0]) => {
    setTitle(preset.title);
    setUrl(preset.url);
    setDuration(preset.duration);
    setTags(preset.tags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const selectedMachine = section.machines.find((m) => m.id === machineId);

    const steps = stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsed = parseVideoUrl(url.trim());
    const finalThumbnail =
      previewThumbnail ||
      parsed.thumbnailUrl ||
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80';

    onSubmit(section.id, {
      title: title.trim(),
      titleThai: titleThai.trim() || undefined,
      url: url.trim(),
      thumbnailUrl: finalThumbnail,
      machineId: machineId || undefined,
      machineName: selectedMachine ? selectedMachine.name : 'General Department Automation',
      duration: duration.trim() || '05:00',
      description: description.trim() || 'Instructional walkthrough and operation guide for laboratory analyzer.',
      steps: steps.length > 0 ? steps : undefined,
      addedDate: new Date().toISOString().split('T')[0],
      author: author.trim() || 'Lab Specialist',
      tags: tags.length > 0 ? tags : ['Automate']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">smart_display</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Add Automation Video Guide
              </h2>
              <p className="text-xs text-[#64748B]">
                Department: <span className="font-bold text-[#1E40AF]">{section.title}</span> ({section.titleThai})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9] cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Presets */}
          <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E40AF] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                <span>Quick Automation Video Templates (ตัวอย่างรวดเร็ว)</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_DEMO_VIDEOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-left p-2 rounded-xl bg-white hover:bg-white/80 border border-blue-200 text-xs text-[#0F172A] hover:text-[#1E40AF] transition-all cursor-pointer flex items-center gap-2 shadow-2xs group"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#1E40AF] group-hover:scale-110 transition-transform">
                    play_circle
                  </span>
                  <span className="truncate font-medium">{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Video Title (ชื่อวิดีโอคู่มือ/สาธิต) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cobas 8000 Automated Routine Loading & Calibration"
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          {/* Title in Thai & Machine Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Thai Title / Subtitle (ชื่อภาษาไทย)
              </label>
              <input
                type="text"
                value={titleThai}
                onChange={(e) => setTitleThai(e.target.value)}
                placeholder="e.g. ขั้นตอนการโหลดตัวอย่างเครื่องอัตโนมัติ"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Target Machine / Analyzer (เครื่องตรวจ)
              </label>
              <select
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A] font-medium"
              >
                <option value="">General Department Automation (รวมทั้งแผนก)</option>
                {section.machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.model ? `(${m.model})` : ''} - {m.extension}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Video URL & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Video URL (YouTube, Vimeo, or MP4) *
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or .mp4 link"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#94A3B8]">
                  link
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Duration (ความยาว)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 05:30"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          {/* Live Thumbnail Preview */}
          {previewThumbnail && (
            <div className="flex items-center gap-4 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
              <img
                src={previewThumbnail}
                alt="Preview"
                className="w-24 h-16 object-cover rounded-xl border border-[#CBD5E1] shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div className="text-xs space-y-1">
                <p className="font-bold text-[#0F172A]">Video Preview Detected</p>
                <p className="text-[#64748B]">Auto-generated high quality thumbnail ready for staff view.</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Overview & Objectives (รายละเอียดและวัตถุประสงค์)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this automation video tutorial covers..."
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1 flex items-center justify-between">
              <span>Step-by-Step Procedure Guide (ขั้นตอนการปฏิบัติงานทีละสเต็ป - 1 บรรทัดต่อ 1 ขั้นตอน)</span>
              <span className="text-[10px] text-[#94A3B8] font-normal">Optional</span>
            </label>
            <textarea
              rows={3}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder="Step 1: Check reagent inventory...&#10;Step 2: Load sample racks...&#10;Step 3: Press Start..."
              className="w-full px-4 py-2.5 text-xs font-mono bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          {/* Tags & Instructor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Instructor / Author (ผู้จัดทำ/ผู้สอน)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Somchai P. (Senior MT)"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Tags (แท็ก)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. STAT, QC, Prime"
                  className="flex-1 px-3 py-2 text-xs bg-[#F1F5F9] border border-[#E2E8F0] focus:bg-white rounded-xl outline-none text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  + Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#1E40AF] hover:text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Save & Publish Video</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
