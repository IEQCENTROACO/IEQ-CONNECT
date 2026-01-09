
import React, { useMemo } from 'react';
import { Person } from '../types';

interface BirthdayRemindersProps {
  people: Person[];
  onSendBirthday: (person: Person) => void;
}

const BirthdayReminders: React.FC<BirthdayRemindersProps> = ({ people, onSendBirthday }) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const currentMonth = new Date().getMonth();
  const today = new Date();
  const currentDay = today.getDate();
  const todayISO = today.toISOString().split('T')[0];

  const monthlyBirthdays = useMemo(() => {
    return people.filter(v => {
      const bDate = new Date(v.birthDate);
      const adjustedDate = new Date(bDate.getTime() + bDate.getTimezoneOffset() * 60000);
      return adjustedDate.getMonth() === currentMonth;
    }).sort((a, b) => {
      const dayA = new Date(a.birthDate).getDate();
      const dayB = new Date(b.birthDate).getDate();
      return dayA - dayB;
    });
  }, [people, currentMonth]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Aniversariantes do Mês</h2>
        <p className="text-slate-500">Comemorando as vidas em {months[currentMonth]}</p>
      </header>

      {monthlyBirthdays.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {monthlyBirthdays.map(v => {
            const bDate = new Date(v.birthDate);
            const adjustedDate = new Date(bDate.getTime() + bDate.getTimezoneOffset() * 60000);
            const isToday = adjustedDate.getDate() === currentDay;
            const alreadySentToday = v.lastBirthdayWishedAt === todayISO;

            return (
              <div 
                key={v.id} 
                className={`bg-white p-5 rounded-2xl shadow-sm border flex items-center justify-between transition-all ${
                  isToday ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-50' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold ${
                    isToday ? 'bg-amber-400 text-white shadow-lg' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <span className="text-[10px] uppercase leading-none mb-1">Dia</span>
                    <span className="text-xl leading-none">{adjustedDate.getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {v.name} 
                      {isToday && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse uppercase font-black">HOJE!</span>}
                    </h4>
                    <p className="text-sm text-slate-500">{v.phone}</p>
                  </div>
                </div>
                
                <button
                  disabled={alreadySentToday}
                  onClick={() => onSendBirthday(v)}
                  className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm ${
                    alreadySentToday
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                    : isToday 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-100' 
                      : 'text-green-600 hover:bg-green-50 border border-green-200'
                  }`}
                >
                  <span className="text-lg">{alreadySentToday ? '✅' : '💬'}</span>
                  <span className="hidden md:inline text-xs uppercase tracking-wider">{alreadySentToday ? 'Já Enviado' : 'Mandar Parabéns'}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 text-center text-slate-400 border border-slate-100 shadow-sm">
          <p className="text-xl font-bold">Nenhum aniversariante encontrado neste mês.</p>
          <p className="text-sm">As datas de nascimento aparecerão aqui conforme o cadastro.</p>
        </div>
      )}
    </div>
  );
};

export default BirthdayReminders;
