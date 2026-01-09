
export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  mustChangePassword?: boolean;
}

export interface Person {
  id: string;
  name: string;
  phone: string;
  birthDate: string; // ISO format YYYY-MM-DD
  address: string;
  registrationDate: string;
  lastBirthdayWishedAt?: string;
}

export interface Visitor extends Person {}
export interface Member extends Person {}

export interface ChurchEvent {
  id: string;
  title: string;
  dayOfWeek: string;
  time: string;
  secondaryTime?: string;
  description: string;
}

export type View = 'dashboard' | 'visitors' | 'members' | 'events' | 'birthdays' | 'users';
