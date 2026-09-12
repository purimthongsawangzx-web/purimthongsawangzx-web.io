import React, { useState } from 'react';
import { UserAccount } from '../types';

interface LoginGatewayProps {
  onLogin: (user: UserAccount, rememberMe: boolean) => void;
  registeredUsers: UserAccount[];
  onRegisterUser: (newUser: UserAccount) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  onLogin,
  registeredUsers,
  onRegisterUser
}) => {
  // Tabs: 'signin' or 'create'
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');

  // Sign In Form States
  const [username, setUsername] = useState<string>('lab');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create Workspace Form States
  const [newFullName, setNewFullName] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState<string>('Clinical Pathology');
  const [newRole, setNewRole] = useState<string>('Medical Technologist');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const matched = registeredUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanUser ||
          (u.email && u.email.toLowerCase() === cleanUser)
      );

      if (!matched) {
        setIsLoading(false);
        setErrorMessage(
          `User "${username.trim()}" not found. If this is your first time, click "Create New Private Account" below.`
        );
        return;
      }

      const correctPassword = matched.password || 'password123';
      if (password !== correctPassword) {
        setIsLoading(false);
        setErrorMessage('Incorrect password. Only users with the correct password can view this private dataset.');
        return;
      }

      setIsLoading(false);
      onLogin(matched, rememberMe);
    }, 200);
  };

  const handleQuickTeamLogin = () => {
    const mainUser = registeredUsers.find((u) => u.username === 'lab') || registeredUsers[0];
    if (mainUser) {
      setUsername(mainUser.username);
      setPassword(mainUser.password || 'password123');
      setErrorMessage('');
      onLogin(mainUser, rememberMe);
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = newUsername.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');

    if (!cleanUser) {
      setErrorMessage('Please provide a valid username (letters, numbers, underscores).');
      return;
    }

    if (cleanUser.length < 3) {
      setErrorMessage('Username must be at least 3 characters long.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please retype carefully.');
      return;
    }

    const alreadyExists = registeredUsers.some((u) => u.username.toLowerCase() === cleanUser);
    if (alreadyExists) {
      setErrorMessage(`Username "${cleanUser}" is already in use. Please choose another username.`);
      return;
    }

    const name = newFullName.trim() || `${cleanUser.toUpperCase()} Lab`;
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'MT';

    const newUser: UserAccount = {
      id: `user-${cleanUser}-${Date.now()}`,
      username: cleanUser,
      password: newPassword,
      pin: '1234',
      fullName: name,
      role: newRole || 'Medical Technologist',
      department: newDepartment || 'Clinical Pathology Core',
      initials,
      staffId: `LAB-${Math.floor(100 + Math.random() * 900)}`
    };

    onRegisterUser(newUser);

    // Auto switch to sign in with prefilled credentials
    setUsername(newUser.username);
    setPassword(newUser.password || '');
    setSuccessMessage(`Account for "${newUser.fullName}" created! Logging in to your private dataset...`);
    setActiveTab('signin');

    // Auto login
    setTimeout(() => {
      onLogin(newUser, rememberMe);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 font-['Public_Sans',sans-serif] selection:bg-blue-600 selection:text-white">
      {/* Top Brand Bar */}
      <header className="w-full max-w-3xl flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined text-2xl">science</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-['Noto_Serif',serif]">
              LABVIBHARAM
            </h1>
            <p className="text-xs text-slate-400">Clinical Laboratory Management System</p>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 hidden sm:flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">verified_user</span>
          <span>1 User = 1 Private Dataset</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-lg my-auto py-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
          {/* Security Banner Badge */}
          <div className="mb-6 bg-blue-950/40 border border-blue-800/50 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-lg">shield_lock</span>
            </div>
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-blue-200">Private & Protected Workspaces</p>
              <p className="text-slate-400 mt-0.5">
                Each account has its own isolated dataset (1 user = 1 dataset). Only users with your password can view your records.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage('');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'signin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('create');
                setErrorMessage('');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>New Account & Dataset</span>
            </button>
          </div>

          {/* Success / Error Alerts */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-400 text-lg shrink-0">check_circle</span>
              <p className="flex-1">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/90 border border-red-700 text-red-200 text-xs flex items-center gap-2.5">
              <span className="material-symbols-outlined text-red-400 text-lg shrink-0">error</span>
              <p className="flex-1">{errorMessage}</p>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username (e.g. lab)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Stay Signed In */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Stay signed in on this device</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    <span>Opening Your Dataset...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">login</span>
                    <span>Open My Private Workspace</span>
                  </>
                )}
              </button>

              {/* Quick Login / Existing accounts */}
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Access / Default Lab:
                  </p>
                  <span className="text-[11px] text-blue-400 font-medium">1-Click</span>
                </div>

                <button
                  type="button"
                  onClick={handleQuickTeamLogin}
                  className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/50 transition-all text-left flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-300 font-bold text-xs flex items-center justify-center">
                      LT
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-blue-300">
                        Default Main Team Dataset
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Username: lab • Password: password123
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-blue-400 text-base">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: CREATE NEW ISOLATED WORKSPACE */
            <form onSubmit={handleCreateAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Full Name or Lab Title *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Dr. Somchai / Hematology Shift B"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Create Unique Username *
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                  placeholder="e.g. somchai_lab"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This username will be your private key to access your independent dataset.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 4 chars"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pr-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showNewPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Confirm Password *
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Role / Position
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Medical Technologist">Medical Technologist</option>
                    <option value="Senior MT">Senior MT</option>
                    <option value="Chief Pathologist">Chief Pathologist</option>
                    <option value="Pathology Technician">Pathology Technician</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                    <option value="Laboratory Supervisor">Laboratory Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Department / Section
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g. Clinical Chemistry"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-base">inventory_2</span>
                <span>Includes full pre-loaded templates (Stock, EQA, Machines, Rosters).</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Create Account & Start My Dataset</span>
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl text-center py-2 text-xs text-slate-500">
        © 2026 LABVIBHARAM Hospital Network • Clinical Pathology Division • Private Workspace Security
      </footer>
    </div>
  );
};
