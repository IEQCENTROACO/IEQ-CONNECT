
import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface ForceChangePasswordProps {
  user: User;
  onUpdated: (updatedUser: User) => void;
}

const ForceChangePassword: React.FC<ForceChangePasswordProps> = ({ user, onUpdated }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const updatedUser: User = {
      ...user,
      username: formData.username,
      name: formData.name,
      password: formData.password,
      mustChangePassword: false
    };

    storageService.updateUser(updatedUser);
    onUpdated(updatedUser);
  };

  return (
    <div className="fixed inset-0 bg-blue-900 flex items-center justify-center z-[200] p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-amber-500 p-8 text-blue-900 text-center">
          <div className="text-4xl mb-2">🔐</div>
          <h2 className="text-2xl font-black">Segurança Primeiro</h2>
          <p className="font-medium opacity-80">Por favor, personalize seu acesso antes de continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-1">Seu Nome (Como deseja ser chamado)</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-1">Novo Nome de Usuário</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-1">Nova Senha</label>
            <input
              required
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
              placeholder="Crie uma senha forte"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-1">Confirme a Senha</label>
            <input
              required
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
              placeholder="Repita a nova senha"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-black shadow-lg transition-all active:scale-95"
          >
            Salvar e Entrar no App
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForceChangePassword;
