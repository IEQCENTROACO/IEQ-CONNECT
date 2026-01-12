
import React, { useState } from 'react';
import { Member, ChurchEvent } from '../types';

interface MemberListProps {
  members: Member[];
  events: ChurchEvent[];
  onDelete: (id: string) => void;
  onEdit: (member: Member) => void;
  onSendBirthday: (member: Member) => void;
  onSendWelcome: (member: Member) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, events, onDelete, onEdit, onSendBirthday, onSendWelcome }) => {
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const todayISO = new Date().toISOString().split('T')[0];

  const handleSendAgenda = (member: Member) => {
    onSendWelcome(member);
    setFeedbackId(member.id + '_agenda');
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
          <h2 className="text-2xl font-bold text-slate-800">Corpo de Membros</h2>
          <p className="text-sm text-slate-500">Gestão dos membros ativos da igreja.</p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">
          {members.length} Membros
        </span>
      </div>

      {members.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center text-slate-400">
           <div className="text-5xl mb-4">⛪</div>
           <p className="text-xl font-bold">Nenhum membro cadastrado.</p>
           <p className="text-sm">Comece a cadastrar os membros da sua igreja aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => {
            const alreadySentBirthday = member.lastBirthdayWishedAt === todayISO;
            const alreadySentAgenda = member.lastWelcomeSentAt === todayISO;
            const isAgendaSent = feedbackId === member.id + '_agenda';

            return (
              <div key={member.id} className={`bg-white rounded-[2rem] p-6 shadow-sm border transition-all group ${isAgendaSent ? 'animate-glow border-indigo-400' : 'border-slate-100 hover:shadow-xl'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-colors ${isAgendaSent ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    {isAgendaSent ? '📅' : member.name.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <button 
                       onClick={() => onEdit(member)}
                       className="bg-slate-50 hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 transition-all p-2 rounded-xl border border-slate-100"
                       title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                       onClick={() => onDelete(member.id)}
                       className="bg-slate-50 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all p-2 rounded-xl border border-slate-100"
                       title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-800 mb-1">{member.name}</h4>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="opacity-50">📞</span> {member.phone}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="opacity-50">🎂</span> {new Date(member.birthDate).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-2 italic">
                    <span className="opacity-50">📍</span> {member.address || 'Endereço não informado'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl mb-6 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Histórico de Contato</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">📅 Agenda:</span>
                    <span className={`font-bold ${member.lastWelcomeSentAt ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {formatDate(member.lastWelcomeSentAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">🎂 Parabéns:</span>
                    <span className={`font-bold ${member.lastBirthdayWishedAt ? 'text-blue-600' : 'text-slate-400'}`}>
                      {formatDate(member.lastBirthdayWishedAt)}
                    </span>
                  </div>
                  <div className="pt-1 mt-1 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-300">
                    <span>📝 Cadastro:</span>
                    <span>{new Date(member.registrationDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendAgenda(member)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                      alreadySentAgenda 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                    }`}
                  >
                    <span>{isAgendaSent || alreadySentAgenda ? '✅' : '📅'}</span>
                    <span>{alreadySentAgenda ? 'Enviado' : 'Agenda'}</span>
                  </button>
                  <button
                    disabled={alreadySentBirthday}
                    onClick={() => onSendBirthday(member)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      alreadySentBirthday 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100'
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

export default MemberList;
