
import { Visitor, Member, ChurchEvent, User } from '../types';
import { INITIAL_EVENTS } from '../constants';

const VISITORS_KEY = 'ieq_connect_visitors';
const MEMBERS_KEY = 'ieq_connect_members';
const EVENTS_KEY = 'ieq_connect_events';
const USERS_KEY = 'ieq_connect_users';
const SESSION_KEY = 'ieq_connect_session';

const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  username: 'admin',
  password: 'admin',
  name: 'Administrador IEQ',
  role: 'ADMIN',
  mustChangePassword: true
};

export const storageService = {
  // --- USERS ---
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
      return [DEFAULT_ADMIN];
    }
    const users = JSON.parse(data);
    const adminIndex = users.findIndex((u: User) => u.id === 'admin-001');
    if (adminIndex !== -1 && users[adminIndex].password === '123') {
        users[adminIndex].password = 'admin';
        users[adminIndex].mustChangePassword = true;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  updateUser: (updatedUser: User) => {
    const users = storageService.getUsers().map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const current = storageService.getCurrentUser();
    if (current && current.id === updatedUser.id) {
      storageService.setCurrentUser(updatedUser);
    }
  },

  deleteUser: (id: string) => {
    if (id === 'admin-001') return; 
    const users = storageService.getUsers().filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // --- SESSION ---
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  // --- VISITORS ---
  getVisitors: (): Visitor[] => {
    const data = localStorage.getItem(VISITORS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveVisitor: (visitor: Visitor) => {
    const visitors = storageService.getVisitors();
    visitors.push(visitor);
    localStorage.setItem(VISITORS_KEY, JSON.stringify(visitors));
  },

  updateVisitor: (updatedVisitor: Visitor) => {
    const visitors = storageService.getVisitors().map(v => 
      v.id === updatedVisitor.id ? updatedVisitor : v
    );
    localStorage.setItem(VISITORS_KEY, JSON.stringify(visitors));
  },

  deleteVisitor: (id: string) => {
    const visitors = storageService.getVisitors().filter(v => v.id !== id);
    localStorage.setItem(VISITORS_KEY, JSON.stringify(visitors));
  },

  // --- MEMBERS ---
  getMembers: (): Member[] => {
    const data = localStorage.getItem(MEMBERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveMember: (member: Member) => {
    const members = storageService.getMembers();
    members.push(member);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  },

  updateMember: (updatedMember: Member) => {
    const members = storageService.getMembers().map(m => 
      m.id === updatedMember.id ? updatedMember : m
    );
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  },

  deleteMember: (id: string) => {
    const members = storageService.getMembers().filter(m => m.id !== id);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  },

  // --- EVENTS ---
  getEvents: (): ChurchEvent[] => {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : INITIAL_EVENTS;
  },

  saveEvent: (event: ChurchEvent) => {
    const events = storageService.getEvents();
    events.push(event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },

  updateEvent: (updatedEvent: ChurchEvent) => {
    const events = storageService.getEvents().map(e => 
      e.id === updatedEvent.id ? updatedEvent : e
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },

  deleteEvent: (id: string) => {
    const events = storageService.getEvents().filter(e => e.id !== id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }
};
