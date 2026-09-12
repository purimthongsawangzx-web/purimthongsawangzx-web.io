import React, { useState, useEffect, useRef } from 'react';
import { StaffMember } from '../../types';

interface AddStaffModalProps {
  isOpen: boolean;
  editingStaff?: StaffMember | null;
  onClose: () => void;
  onSubmit: (staffData: Partial<StaffMember>) => void;
  onDeleteStaff?: (id: string) => void;
}

const PRESET_AVATARS = [
  { label: 'Doctor / Senior MT', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&q=80' },
  { label: 'Pathology Tech', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&q=80' },
  { label: 'Clinical Chemist', url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&q=80' },
  { label: 'Lab Assistant', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=160&q=80' },
  { label: 'Hematologist', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=160&q=80' },
  { label: 'Microbiologist', url: 'https://images.unsplash.com/photo-1594824813589-49774640d2eb?auto=format&fit=crop&w=160&q=80' },
  { label: 'Phlebotomist', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=160&q=80' },
  { label: 'Lead Scientist', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80' }
];

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  editingStaff,
  onClose,
  onSubmit,
  onDeleteStaff
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [showPresets, setShowPresets] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingStaff) {
      setFullName(editingStaff.fullName);
      setPhone(editingStaff.phone || '');
      setEmail(editingStaff.email || '');
      setAvatarUrl(editingStaff.avatarUrl || '');
    } else {
      setFullName('');
      setPhone('');
      setEmail('');
      setAvatarUrl(PRESET_AVATARS[0].url);
    }
    setShowPresets(false);
    setConfirmDelete(false);
  }, [editingStaff, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setAvatarUrl(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name: string) => {
    if (!name.trim()) return 'ST';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const shortName =
      fullName.split(' ')[0] +
      ' ' +
      (fullName.split(' ')[1] ? fullName.split(' ')[1][0] + '.' : '');

    onSubmit({
      name: shortName,
      fullName: fullName.trim(),
      role: editingStaff?.role || 'MEDICAL TECHNOLOGIST',
      department: editingStaff?.department || 'Clinical Laboratory',
      dutyStatus: editingStaff?.dutyStatus || 'ON DUTY',
      phone: phone.trim() || '+66 2 419 7000',
      email: email.trim() || 'staff@labvibraram.hospital',
      avatarUrl: avatarUrl.trim() || undefined
    });

    onClose();
  };

  const handleDeleteCurrentStaff = () => {
    if (editingStaff && onDeleteStaff) {
      onDeleteStaff(editingStaff.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                {editingStaff ? 'Edit Staff Profile' : 'Add Laboratory Personnel'}
              </h2>
              <p className="text-xs text-[#64748B]">Staff name, contact details & profile photo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9] cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Profile Picture Management Section */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
              Staff Profile Picture (รูปภาพประจำตัว)
            </label>

            <div className="flex items-center gap-4">
              {/* Picture Preview */}
              <div className="relative group shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || 'Staff Avatar'}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#1E40AF] shadow-xs"
                    onError={() => setAvatarUrl('')}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#0284C7] text-white flex flex-col items-center justify-center font-bold text-lg shadow-xs ring-2 ring-slate-200">
                    <span>{getInitials(fullName)}</span>
                    <span className="text-[9px] font-normal uppercase tracking-widest opacity-80 mt-0.5">No Pic</span>
                  </div>
                )}

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                    title="Delete picture"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>

              {/* Action Buttons for Picture */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* File Upload Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    className="hidden"
                    id="staff-avatar-upload"
                  />
                  <label
                    htmlFor="staff-avatar-upload"
                    className="px-3.5 py-1.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    <span>Upload Pic</span>
                  </label>

                  {/* Preset Avatar Picker Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] hover:bg-[#EFF6FF] hover:border-[#1E40AF] text-[#0F172A] font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">face</span>
                    <span>Presets</span>
                  </button>

                  {/* Delete / Remove Pic Button */}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePicture}
                      className="px-3 py-1.5 rounded-full bg-white border border-red-200 hover:bg-red-50 text-red-600 font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      <span>Delete Pic</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-[#64748B]">
                  PNG, JPG, or WEBP up to 5MB. Click Upload or pick from Presets.
                </p>
              </div>
            </div>

            {/* Presets Grid */}
            {showPresets && (
              <div className="pt-3 border-t border-[#E2E8F0] space-y-2 animate-in fade-in duration-150">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  Select a Medical Staff Avatar Preset:
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PRESET_AVATARS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(p.url);
                        setShowPresets(false);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-transform hover:scale-105 cursor-pointer ${
                        avatarUrl === p.url ? 'border-[#1E40AF] ring-2 ring-[#1E40AF]/30' : 'border-transparent hover:border-slate-300'
                      }`}
                      title={p.label}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Full Name & Title (ชื่อ-นามสกุล) *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jennifer Adams"
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Extension / Phone (เบอร์โทร)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+66 2 419 7000"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Email (อีเมล)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@labvibraram.hospital"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          {/* Delete Staff Member Confirmation (Only when editing) */}
          {editingStaff && onDeleteStaff && (
            <div className="pt-3 border-t border-[#E2E8F0]">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-2 px-4 rounded-full border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Delete Staff Member from Roster</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                  <p className="text-xs font-bold text-red-800">
                    Are you sure you want to delete {editingStaff.fullName}? All their scheduled shifts will also be removed.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteCurrentStaff}
                      className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      Yes, Delete Staff
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-4 py-1.5 rounded-full bg-white text-[#0F172A] text-xs font-bold border border-slate-200 cursor-pointer hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs uppercase tracking-widest font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {editingStaff ? 'Update Profile' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
