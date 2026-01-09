
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { User } from '../types';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storageService.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      storageService.setCurrentUser(user);
      onLoginSuccess(user);
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-10 text-white text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center font-bold text-4xl mb-4 shadow-lg rotate-3">I</div>
          <h1 className="text-3xl font-black tracking-tight">IEQ CONNECT</h1>
          <p className="text-blue-100 opacity-80 mt-2 font-medium">Acesso Restrito ao Ministério</p>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center border border-red-100 animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Usuário</label>
            <input
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
              placeholder="Digite seu usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Senha</label>
            <input
              required
              type="password"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            Entrar no Painel
          </button>
          
          <p className="text-center text-slate-400 text-sm font-medium">
            Esqueceu a senha? Contate o administrador.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
