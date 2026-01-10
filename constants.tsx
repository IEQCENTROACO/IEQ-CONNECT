
import React from 'react';
import { ChurchEvent } from './types';

export const INITIAL_EVENTS: ChurchEvent[] = [
  { id: '1', title: 'Culto de Celebração (Manhã)', dayOfWeek: 'Domingo', time: '09:00', icon: '⛪', description: 'Nossa primeira celebração do dia, começando a manhã na presença do Senhor.' },
  { id: '1.5', title: 'Culto da Família (Noite)', dayOfWeek: 'Domingo', time: '19:00', icon: '🏠', description: 'Um momento especial para toda a família se reunir em adoração.' },
  { id: '2', title: 'Culto de Ensino', dayOfWeek: 'Quarta-feira', time: '20:00', icon: '📖', description: 'Aprofundando no conhecimento da Palavra de Deus.' },
  { id: '3', title: 'Reunião de Jovens', dayOfWeek: 'Sábado', time: '19:30', icon: '⚡', description: 'Comunhão, louvor e palavra para a juventude.' },
];

export const COLORS = {
  primary: 'bg-blue-700',
  secondary: 'bg-amber-500',
  accent: 'bg-red-600',
};
