
import React from 'react';
import { Member, ChurchEvent } from '../types';
import { whatsappService } from '../services/whatsappService';

interface MemberListProps {
  members: Member[];
  events: ChurchEvent[];
  onDelete: (id: string) => void;
  onSendBirthday: (member: Member) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, events, onDelete, onSendBirthday }) => {
  const todayISO = new Date().toISOString().split('T')[0];

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
            return (
              <div key={member.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {member.name.charAt(0)}
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
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => whatsappService.sendWelcomeMessage(member, events)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    <span>📅</span> Agenda
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
