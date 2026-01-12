
import React, { useState } from 'react';
import { Member, ChurchEvent } from '../types';
import { whatsappService } from '../services/whatsappService';

interface MemberListProps {
  members: Member[];
  events: ChurchEvent[];
  onDelete: (id: string) => void;
  onSendBirthday: (member: Member) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, events, onDelete, onSendBirthday }) => {
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const todayISO = new Date().toISOString().split('T')[0];

  const handleSendAgenda = (member: Member) => {
    whatsappService.sendWelcomeMessage(member, events);
    setFeedbackId(member.id + '_agenda');
    setTimeout(() => setFeedbackId(null), 2000);
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
            const alreadySent = member.lastBirthdayWishedAt === todayISO;
            const isAgendaSent = feedbackId === member.id + '_agenda';

            return (
              <div key={member.id} className={`bg-white rounded-[2rem] p-6 shadow-sm border transition-all group ${isAgendaSent ? 'animate-glow border-indigo-400' : 'border-slate-100 hover:shadow-xl'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-colors ${isAgendaSent ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    {isAgendaSent ? '📅' : member.name.charAt(0)}
                  </div>
                  <button 
                     onClick={() => onDelete(member.id)}
                     className="bg-slate-50 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all p-2 rounded-xl"
                  >
                    🗑️
                  </button>
                </div>

                <h4 className="text-lg font-bold text-slate-800 mb-1">{member.name}</h4>
                <div className="space-y-1 mb-6">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="opacity-50">📞</span> {member.phone}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="opacity-50">🎂</span> {new Date(member.birthDate).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-2 italic">
                    <span className="opacity-50">📍</span> {member.address || 'Endereço não informado'}
                  </p>
                  <div className="pt-2 mt-2 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 flex items-center gap-2 font-medium">
                      <span className="opacity-50">📝</span> Cadastrado em: {new Date(member.registrationDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendAgenda(member)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                      isAgendaSent 
                      ? 'bg-indigo-700 text-white animate-success' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                    }`}
                  >
                    <span>{isAgendaSent ? '✅' : '📅'}</span>
                    <span>{isAgendaSent ? 'Enviado!' : 'Agenda'}</span>
                  </button>
                  <button
                    disabled={alreadySent}
                    onClick={() => onSendBirthday(member)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      alreadySent 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100'
                    }`}
                  >
                    {alreadySent ? '✅ Enviado' : '🎂 Parabéns'}
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
