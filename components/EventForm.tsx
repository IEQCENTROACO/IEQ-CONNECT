
import React, { useState, useEffect } from 'react';
import { ChurchEvent } from '../types';

interface EventFormProps {
  onSave: (event: Omit<ChurchEvent, 'id'> | ChurchEvent) => void;
  onCancel: () => void;
  initialData?: ChurchEvent;
}

const EVENT_ICONS = ['⛪', '📖', '🙏', '⚡', '🏠', '🍴', '🕊️', '🎼', '🎓', '🛡️', '❤️', '🔥'];

const EventForm: React.FC<EventFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    dayOfWeek: 'Domingo',
    time: '',
    secondaryTime: '',
    description: '',
    icon: '⛪'
  });
  const [hasSecondaryTime, setHasSecondaryTime] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        dayOfWeek: initialData.dayOfWeek,
        time: initialData.time,
        secondaryTime: initialData.secondaryTime || '',
        description: initialData.description,
        icon: initialData.icon || '⛪'
      });
      setHasSecondaryTime(!!initialData.secondaryTime);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.time) return;
    
    const dataToSave = {
      ...formData,
      secondaryTime: hasSecondaryTime ? formData.secondaryTime : undefined
    };

    if (initialData) {
      onSave({ ...dataToSave, id: initialData.id });
    } else {
      onSave(dataToSave);
    }
  };

  const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-700 p-6 text-white text-center">
          <h3 className="text-2xl font-bold">{initialData ? 'Editar Evento' : 'Novo Evento'}</h3>
          <p className="text-indigo-100 text-sm opacity-80">
            {initialData ? 'Modifique os detalhes do evento' : 'Configure um novo evento na agenda'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Título do Evento</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Ex: Culto de Domingo"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Escolha um Ícone</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all ${
                    formData.icon === icon 
                    ? 'bg-indigo-100 border-2 border-indigo-600 scale-110' 
                    : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Dia da Semana</label>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={formData.dayOfWeek}
              onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
            >
              {days.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <label className="block text-sm font-semibold text-slate-700">Configurar Horários</label>
               <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="secondary-toggle"
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    checked={hasSecondaryTime}
                    onChange={e => setHasSecondaryTime(e.target.checked)}
                  />
                  <label htmlFor="secondary-toggle" className="text-xs font-medium text-slate-500 cursor-pointer">Dois horários no dia?</label>
               </div>
            </div>
            
            <div className={`grid gap-4 ${hasSecondaryTime ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div className="relative">
                {hasSecondaryTime && <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Horário 1 🕒</span>}
                {!hasSecondaryTime && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🕒</span>}
                <input
                  required
                  type="time"
                  className={`w-full ${!hasSecondaryTime ? 'pl-10' : 'px-4'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              
              {hasSecondaryTime && (
                <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Horário 2 🕒</span>
                  <input
                    required={hasSecondaryTime}
                    type="time"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={formData.secondaryTime}
                    onChange={e => setFormData({ ...formData, secondaryTime: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição Curta</label>
            <textarea
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Breve descrição do evento..."
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-800 transition-colors shadow-indigo-200"
            >
              {initialData ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
