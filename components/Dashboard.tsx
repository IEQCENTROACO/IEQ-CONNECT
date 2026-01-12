
import React, { useMemo, useState } from 'react';
import { Visitor, Member, ChurchEvent, Person } from '../types';

interface DashboardProps {
  visitors: Visitor[];
  members: Member[];
  events: ChurchEvent[];
  onAddVisitor: () => void;
  onAddMember: () => void;
  onSendBirthday: (person: Person) => void;
  onSendWelcome: (person: Person) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ visitors, members, events, onAddVisitor, onAddMember, onSendBirthday, onSendWelcome }) => {
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const todayISO = today.toISOString().split('T')[0];

  const allPeople = useMemo(() => [...visitors, ...members], [visitors, members]);

  const birthdaysToday = useMemo(() => {
    return allPeople.filter(v => {
      const bDay = new Date(v.birthDate);
      const adjustedDate = new Date(bDay.getTime() + bDay.getTimezoneOffset() * 60000);
      return adjustedDate.getDate() === currentDay && adjustedDate.getMonth() === currentMonth;
    });
  }, [allPeople, currentDay, currentMonth]);

  const recentVisitors = useMemo(() => {
    return [...visitors]
      .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
      .slice(0, 3);
  }, [visitors]);

  const handleAgradecer = (v: Visitor) => {
    onSendWelcome(v);
    setFeedbackId(v.id);
    setTimeout(() => setFeedbackId(null), 2000);
  };

  const totalVisitorsThisMonth = useMemo(() => {
    return visitors.filter(v => {
      const regDate = new Date(v.registrationDate);
      return regDate.getMonth() === currentMonth && regDate.getFullYear() === today.getFullYear();
    }).length;
  }, [visitors, currentMonth]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Paz do Senhor! 🙌</h2>
          <p className="text-slate-500">Gestão integrada IEQ CONNECT.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onAddMember}
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>➕ Novo Membro</span>
          </button>
          <button
            onClick={onAddVisitor}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>➕ Novo Visitante</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total de Membros" value={members.length} icon="⛪" color="bg-indigo-100 text-indigo-700" />
        <StatCard title="Total de Visitantes" value={visitors.length} icon="👥" color="bg-blue-100 text-blue-700" />
        <StatCard title="Novas Visitas no Mês" value={totalVisitorsThisMonth} icon="✨" color="bg-green-100 text-green-700" />
        <StatCard title="Eventos na Agenda" value={events.length} icon="📅" color="bg-purple-100 text-purple-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">🎉</span> Aniversariantes de Hoje
            </h3>

            {birthdaysToday.length > 0 ? (
              <div className="space-y-3">
                {birthdaysToday.map(v => {
                  const alreadySent = v.lastBirthdayWishedAt === todayISO;
                  const isMember = members.some(m => m.id === v.id);
                  return (
                    <div key={v.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isMember ? 'bg-indigo-50 border-indigo-100' : 'bg-amber-50 border-amber-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isMember ? 'bg-indigo-200 text-indigo-700' : 'bg-amber-200 text-amber-700'}`}>
                          {v.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                          <p className="text-[10px] uppercase font-bold opacity-60">
                            {isMember ? 'Membro' : 'Visitante'} 
                            {v.lastBirthdayWishedAt && <span className="text-green-600 ml-2">• Enviado ✅</span>}
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={alreadySent}
                        onClick={() => onSendBirthday(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          alreadySent ? 'bg-slate-200 text-slate-400' : 'bg-green-500 text-white shadow-md hover:bg-green-600'
                        }`}
                      >
                        {alreadySent ? '✅ Enviado' : 'Parabenizar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-slate-400 text-sm">Nenhum aniversariante hoje.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">🤝</span> Agradecer Últimas Visitas
            </h3>
            {recentVisitors.length > 0 ? (
              <div className="space-y-3">
                {recentVisitors.map(v => {
                  const isSuccess = feedbackId === v.id;
                  const alreadySentWelcome = v.lastWelcomeSentAt === todayISO;
                  return (
                    <div key={v.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isSuccess ? 'bg-green-50 border-green-200 animate-glow' : 'hover:bg-slate-50 border-transparent hover:border-slate-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${isSuccess ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
                          {isSuccess ? '✅' : v.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">
                            Visitou em {new Date(v.registrationDate).toLocaleDateString('pt-BR')}
                            {v.lastWelcomeSentAt && <span className="text-green-600 ml-2">• Contato realizado ✅</span>}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAgradecer(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          alreadySentWelcome || isSuccess
                          ? 'bg-green-600 text-white border-green-600' 
                          : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-700 hover:text-white'
                        }`}
                      >
                        {isSuccess || alreadySentWelcome ? 'Enviado!' : 'Agradecer'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-slate-400 text-sm">Nenhum visitante recente.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">⛪</span> Agenda Semanal
          </h3>
          <div className="space-y-4">
            {events.map(e => (
              <div key={e.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-xl font-bold min-w-[85px] text-center flex flex-col justify-center shadow-sm">
                  <p className="text-[10px] uppercase border-b border-blue-200 mb-1">{e.dayOfWeek.substring(0, 3)}</p>
                  <p className="text-sm leading-tight">{e.time}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-lg">{e.icon || '⛪'}</span>
                    <h4 className="font-bold text-slate-800 text-sm">{e.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 italic">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: number | string, icon: string, color: string }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-tight">{title}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
