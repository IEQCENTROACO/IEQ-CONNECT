
import React from 'react';
import { View, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, currentUser, onLogout }) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-blue-900 text-white p-6 shadow-xl">
        <div className="mb-10 flex items-center space-x-3">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg rotate-3">I</div>
          <h1 className="text-2xl font-black tracking-tight leading-none">IEQ<br/><span className="text-sm font-medium opacity-60">CONNECT</span></h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} icon="📊" label="Dashboard" />
          <NavItem active={currentView === 'members'} onClick={() => onNavigate('members')} icon="⛪" label="Membros" />
          <NavItem active={currentView === 'visitors'} onClick={() => onNavigate('visitors')} icon="👥" label="Visitantes" />
          <NavItem active={currentView === 'birthdays'} onClick={() => onNavigate('birthdays')} icon="🎂" label="Aniversariantes" />
          <NavItem active={currentView === 'events'} onClick={() => onNavigate('events')} icon="📅" label="Agenda IEQ" />
          
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-blue-800">
               <NavItem active={currentView === 'users'} onClick={() => onNavigate('users')} icon="🛡️" label="Usuários do App" />
            </div>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-blue-800 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold text-amber-400">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{currentUser?.name}</p>
              <p className="text-[10px] uppercase font-black text-amber-500 tracking-wider">{currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl font-bold transition-all text-sm"
          >
            🚪 Sair do App
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold">I</div>
          <h1 className="text-lg font-black">IEQ CONNECT</h1>
        </div>
        <div className="flex space-x-1">
           <button className={`p-2 rounded-xl ${currentView === 'dashboard' ? 'bg-amber-500 text-blue-900' : ''}`} onClick={() => onNavigate('dashboard')}>📊</button>
           <button className={`p-2 rounded-xl ${currentView === 'members' ? 'bg-amber-500 text-blue-900' : ''}`} onClick={() => onNavigate('members')}>⛪</button>
           <button className={`p-2 rounded-xl ${currentView === 'visitors' ? 'bg-amber-500 text-blue-900' : ''}`} onClick={() => onNavigate('visitors')}>👥</button>
           <button className={`p-2 rounded-xl ${currentView === 'events' ? 'bg-amber-500 text-blue-900' : ''}`} onClick={() => onNavigate('events')}>📅</button>
           {isAdmin && <button className={`p-2 rounded-xl ${currentView === 'users' ? 'bg-amber-500 text-blue-900' : ''}`} onClick={() => onNavigate('users')}>🛡️</button>}
           <button className="p-2 rounded-xl text-red-400 bg-red-400/10" onClick={onLogout}>🚪</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[1.25rem] transition-all ${
      active ? 'bg-amber-500 text-blue-900 font-black shadow-xl scale-[1.02]' : 'hover:bg-blue-800 text-blue-100 font-semibold opacity-70 hover:opacity-100'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

export default Layout;
