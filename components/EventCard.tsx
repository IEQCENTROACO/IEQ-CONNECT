
import React from 'react';
import { ChurchEvent } from '../types';

interface EventCardProps {
  event: ChurchEvent;
  onEdit: (event: ChurchEvent) => void;
  onDelete?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  // Logic to determine theme based on event title
  const getTheme = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('família')) return { color: 'bg-amber-500', icon: '🏠', light: 'bg-amber-50', text: 'text-amber-700' };
    if (t.includes('ensino')) return { color: 'bg-blue-600', icon: '📖', light: 'bg-blue-50', text: 'text-blue-700' };
    if (t.includes('jovens')) return { color: 'bg-indigo-600', icon: '⚡', light: 'bg-indigo-50', text: 'text-indigo-700' };
    return { color: 'bg-slate-600', icon: '⛪', light: 'bg-slate-50', text: 'text-slate-700' };
  };

  const theme = getTheme(event.title);

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 w-2 h-full ${theme.color}`} />
      
      <div className="p-6 pl-8">
        <div className="flex justify-between items-start mb-4">
          <div className={`${theme.light} ${theme.text} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
            {event.dayOfWeek}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(event)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 p-2 rounded-lg transition-colors border border-slate-100"
              title="Editar Evento"
            >
              ✏️
            </button>
            {onDelete && (
              <button 
                onClick={() => onDelete(event.id)}
                className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 p-2 rounded-lg transition-colors border border-slate-100"
                title="Excluir Evento"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
          {event.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-sm font-bold border border-blue-100">
            <span>🕒</span>
            <span>{event.time}</span>
          </div>
          {event.secondaryTime && (
            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-sm font-bold border border-indigo-100">
              <span>🕒</span>
              <span>{event.secondaryTime}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-500 leading-relaxed italic">
          "{event.description}"
        </p>

        <div className="mt-4 flex justify-end">
           <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300">
            {theme.icon}
          </span>
        </div>
      </div>

      <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 ${theme.color} absolute bottom-0`} />
    </div>
  );
};

export default EventCard;
