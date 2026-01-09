
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'MEMBER' as UserRole
  });

  useEffect(() => {
    setUsers(storageService.getUsers());
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      ...formData,
      id: crypto.randomUUID()
    };
    storageService.saveUser(newUser);
    setUsers(storageService.getUsers());
    setShowForm(false);
    setFormData({ name: '', username: '', password: '', role: 'MEMBER' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este acesso?')) {
      storageService.deleteUser(id);
      setUsers(storageService.getUsers());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Membros da Equipe</h2>
          <p className="text-slate-500">Gerencie quem tem acesso ao aplicativo IEQ CONNECT.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2"
        >
          <span>👤</span> Novo Operador
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase ${user.role === 'ADMIN' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {user.role}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-700 text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{user.name}</h4>
                <p className="text-xs text-slate-400 font-mono">@{user.username}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
              <span className="text-xs text-slate-400 font-medium italic">Senha: {user.password}</span>
              {user.id !== 'admin-001' && (
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="text-red-400 hover:text-red-600 text-sm font-bold"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-indigo-700 p-6 text-white text-center font-bold text-xl">Novo Cadastro de Acesso</div>
            <form onSubmit={handleCreateUser} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Membro</label>
                <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Usuário de Login</label>
                <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" 
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().trim()})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha de Acesso</label>
                <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Acesso</label>
                <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                  <option value="MEMBER">Membro (Operacional)</option>
                  <option value="ADMIN">Administrador (Total)</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 font-bold text-slate-400">Cancelar</button>
                <button type="submit" className="flex-2 bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold">Criar Acesso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
