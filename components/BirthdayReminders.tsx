
import React, { useMemo, useState } from 'react';
import { Person } from '../types';

interface BirthdayRemindersProps {
  people: Person[];
  onSendBirthday: (person: Person) => void;
}

type FilterType = 'today' | 'next7' | 'month';

const BirthdayReminders: React.FC<BirthdayRemindersProps> = ({ people, onSendBirthday }) => {
  const [filterType, setFilterType] = useState<FilterType>('month');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const todayISO = today.toISOString().split('T')[0];

  const filteredBirthdays = useMemo(() => {
    return people.filter(p => {
      const bDate = new Date(p.birthDate);
      // Adjust for timezone offset to get correct day/month from ISO string
      const bDay = new Date(bDate.getTime() + bDate.getTimezoneOffset() * 60000);
      const personDay = bDay.getDate();
      const personMonth = bDay.getMonth();

      if (filterType === 'today') {
        return personDay === currentDay && personMonth === currentMonth;
      }

      if (filterType === 'next7') {
        // Create a comparison date for this year
        const bDateThisYear = new Date(today.getFullYear(), personMonth, personDay);
        
        // Handle year wrap around (e.g., if today is Dec 28)
        if (bDateThisYear < today && personMonth === 0 && currentMonth === 11) {
          bDateThisYear.setFullYear(today.getFullYear() + 1);
        }

        const diffTime = bDateThisYear.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 0 && diffDays <= 7;
      }

      if (filterType === 'month') {
        return personMonth === selectedMonth;
      }

      return false;
    }).sort((a, b) => {
      const bDateA = new Date(a.birthDate);
      const bDayA = new Date(bDateA.getTime() + bDateA.getTimezoneOffset() * 60000);
      const bDateB = new Date(b.birthDate);
      const bDayB = new Date(bDateB.getTime() + bDateB.getTimezoneOffset() * 60000);
      
      if (bDayA.getMonth() !== bDayB.getMonth()) {
        return bDayA.getMonth() - bDayB.getMonth();
      }
      return bDayA.getDate() - bDayB.getDate();
    });
  }, [people, filterType, selectedMonth, currentDay, currentMonth, today]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Celebrando Vidas</h2>
          <p className="text-slate-500 mt-1">
            {filterType === 'today' && 'Aniversariantes de hoje'}
            {filterType === 'next7' && 'Comemorações nos próximos 7 dias'}
            {filterType === 'month' && `Aniversariantes de ${months[selectedMonth]}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <FilterButton 
            active={filterType === 'today'} 
            onClick={() => setFilterType('today')} 
            label="Hoje" 
          />
          <FilterButton 
            active={filterType === 'next7'} 
            onClick={() => setFilterType('next7')} 
            label="Próximos 7 dias" 
          />
          <FilterButton 
            active={filterType === 'month'} 
            onClick={() => setFilterType('month')} 
            label="Por Mês" 
          />
          
          {filterType === 'month' && (
            <select 
              className="ml-2 bg-slate-50 border-none text-sm font-bold text-blue-700 px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((name, idx) => (
                <option key={name} value={idx}>{name}</option>
              ))}
            </select>
          )}
        </div>
      </header>

      {filteredBirthdays.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredBirthdays.map(v => {
            const bDate = new Date(v.birthDate);
            const adjustedDate = new Date(bDate.getTime() + bDate.getTimezoneOffset() * 60000);
            const isToday = adjustedDate.getDate() === currentDay && adjustedDate.getMonth() === currentMonth;
            const alreadySentToday = v.lastBirthdayWishedAt === todayISO;

            return (
              <div 
                key={v.id} 
                className={`bg-white p-5 rounded-[2rem] shadow-sm border flex items-center justify-between transition-all group hover:shadow-md ${
                  isToday ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-50/50' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold transition-transform group-hover:scale-105 ${
                    isToday ? 'bg-amber-400 text-white shadow-lg' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <span className="text-[10px] uppercase leading-none mb-1 opacity-80">
                      {months[adjustedDate.getMonth()].substring(0, 3)}
                    </span>
                    <span className="text-2xl leading-none">{adjustedDate.getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                      {v.name} 
                      {isToday && (
                        <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse uppercase font-black">
                          🎈 HOJE!
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                       <span className="flex items-center gap-1">📞 {v.phone}</span>
                       <span className="hidden sm:inline opacity-30">|</span>
                       <span className="hidden sm:inline">🎂 {adjustedDate.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  disabled={alreadySentToday}
                  onClick={() => onSendBirthday(v)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95 ${
                    alreadySentToday
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                    : isToday 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-100' 
                      : 'text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-500'
                  }`}
                >
                  <span className="text-lg">{alreadySentToday ? '✅' : '💬'}</span>
                  <span className="hidden md:inline text-xs uppercase tracking-widest">
                    {alreadySentToday ? 'Já Enviado' : 'Mandar Parabéns'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-24 text-center text-slate-400 border-2 border-dashed border-slate-100">
          <div className="text-6xl mb-6">🎂</div>
          <p className="text-xl font-bold text-slate-600">Nenhum aniversariante encontrado.</p>
          <p className="text-sm max-w-xs mx-auto mt-2">Tente mudar o filtro ou o mês para ver outras datas comemorativas.</p>
        </div>
      )}
    </div>
  );
};

const FilterButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
      active 
      ? 'bg-blue-700 text-white shadow-md' 
      : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

export default BirthdayReminders;
