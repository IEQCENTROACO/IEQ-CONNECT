
import React, { useState } from 'react';
import { Visitor, ChurchEvent } from '../types';

interface VisitorListProps {
  visitors: Visitor[];
  events: ChurchEvent[];
  onDelete: (id: string) => void;
  onEdit: (visitor: Visitor) => void;
  onSendBirthday: (visitor: Visitor) => void;
  onSendWelcome: (visitor: Visitor) => void;
}

const VisitorList: React.FC<VisitorListProps> = ({ visitors, events, onDelete, onEdit, onSendBirthday, onSendWelcome }) => {
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const todayISO = new Date().toISOString().split('T')[0];

  const handleWelcome = (visitor: Visitor) => {
    onSendWelcome(visitor);
    setFeedbackId(visitor.id + '_welcome');
    setTimeout(() => setFeedbackId(null), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Nunca';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Diretório de Visitantes</h2>
          <p className="text-sm text-slate-500">Acompanhe todos os que passaram pela IEQ.</p>
        </div>
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">
          {visitors.length} Registros
        </span>
      </div>

      {visitors.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center text-slate-400">
           <div className="text-5xl mb-4">👥</div>
           <p className="text-xl font-bold">Nenhum visitante cadastrado ainda.</p>
           <p className="text-sm">Os novos membros e visitas aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitors.map(visitor => {
            const alreadySentBirthday = visitor.lastBirthdayWishedAt === todayISO;
            const alreadySentWelcome = visitor.lastWelcomeSentAt === todayISO;
            const isSentSuccess = feedbackId === visitor.id + '_welcome';

            return (
              <div key={visitor.id} className={`bg-white rounded-[2rem] p-6 shadow-sm border transition-all group ${isSentSuccess ? 'animate-glow border-green-500 shadow-lg shadow-green-50' : 'border-slate-100 hover:shadow-xl'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-colors ${isSentSuccess ? 'bg-green-500 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                    {isSentSuccess ? '✅' : visitor.name.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <button 
                       onClick={() => onEdit(visitor)}
                       className="bg-slate-50 hover:bg-blue-50 text-slate-300 hover:text-blue-600 transition-all p-2 rounded-xl border border-slate-100"
                       title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                       onClick={() => onDelete(visitor.id)}
                       className="bg-slate-50 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all p-2 rounded-xl border border-slate-100"
                       title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-800 mb-1">{visitor.name}</h4>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="opacity-50">📞</span> {visitor.phone}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="opacity-50">🎂</span> {new Date(visitor.birthDate).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-2 italic">
                    <span className="opacity-50">📍</span> {visitor.address || 'Endereço não informado'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl mb-6 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Histórico de Contato</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">🙏 Agradecimento:</span>
                    <span className={`font-bold ${visitor.lastWelcomeSentAt ? 'text-green-600' : 'text-slate-400'}`}>
                      {formatDate(visitor.lastWelcomeSentAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">🎂 Parabéns:</span>
                    <span className={`font-bold ${visitor.lastBirthdayWishedAt ? 'text-blue-600' : 'text-slate-400'}`}>
                      {formatDate(visitor.lastBirthdayWishedAt)}
                    </span>
                  </div>
                  <div className="pt-1 mt-1 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-300">
                    <span>📝 Cadastro:</span>
                    <span>{new Date(visitor.registrationDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleWelcome(visitor)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                      alreadySentWelcome 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-green-100'
                    }`}
                  >
                    <span>{isSentSuccess || alreadySentWelcome ? '✅' : '🙏'}</span>
                    <span>{alreadySentWelcome ? 'Enviado' : 'Agradecer'}</span>
                  </button>
                  <button
                    disabled={alreadySentBirthday}
                    onClick={() => onSendBirthday(visitor)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      alreadySentBirthday 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100'
                    }`}
                  >
                    {alreadySentBirthday ? '✅ Enviado' : '🎂 Parabéns'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VisitorList;
