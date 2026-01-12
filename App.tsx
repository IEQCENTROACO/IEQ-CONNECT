
import React, { useState, useEffect } from 'react';
import { Visitor, Member, ChurchEvent, View, User, Person } from './types';
import { storageService } from './services/storageService';
import { whatsappService } from './services/whatsappService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VisitorForm from './components/VisitorForm';
import VisitorList from './components/VisitorList';
import MemberForm from './components/MemberForm';
import MemberList from './components/MemberList';
import BirthdayReminders from './components/BirthdayReminders';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import LoginForm from './components/LoginForm';
import UserManagement from './components/UserManagement';
import ForceChangePassword from './components/ForceChangePassword';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | undefined>(undefined);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | undefined>(undefined);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    setVisitors(storageService.getVisitors());
    setMembers(storageService.getMembers());
    setEvents(storageService.getEvents());
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  if (!currentUser) {
    return <LoginForm onLoginSuccess={setCurrentUser} />;
  }

  if (currentUser.mustChangePassword) {
    return <ForceChangePassword user={currentUser} onUpdated={setCurrentUser} />;
  }

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleSaveVisitor = (visitorData: Omit<Visitor, 'id' | 'registrationDate'> | Visitor) => {
    if ('id' in visitorData) {
      storageService.updateVisitor(visitorData as Visitor);
    } else {
      const newVisitor: Visitor = {
        ...visitorData,
        id: crypto.randomUUID(),
        registrationDate: new Date().toISOString()
      };
      storageService.saveVisitor(newVisitor);
      setTimeout(() => {
        if (confirm(`Visitante ${newVisitor.name} cadastrado! Deseja enviar a mensagem de boas-vindas e agenda agora?`)) {
          handleSendWelcome(newVisitor);
        }
      }, 500);
    }
    setVisitors(storageService.getVisitors());
    setShowVisitorForm(false);
    setEditingVisitor(undefined);
  };

  const handleSaveMember = (memberData: Omit<Member, 'id' | 'registrationDate'> | Member) => {
    if ('id' in memberData) {
      storageService.updateMember(memberData as Member);
    } else {
      const newMember: Member = {
        ...memberData,
        id: crypto.randomUUID(),
        registrationDate: new Date().toISOString()
      };
      storageService.saveMember(newMember);
      alert(`Membro ${newMember.name} cadastrado com sucesso!`);
    }
    setMembers(storageService.getMembers());
    setShowMemberForm(false);
    setEditingMember(undefined);
  };

  const handleSendWelcome = (person: Person) => {
    whatsappService.sendWelcomeMessage(person, events);
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = { ...person, lastWelcomeSentAt: todayStr };
    
    if (members.some(m => m.id === person.id)) {
      storageService.updateMember(updated as Member);
      setMembers(storageService.getMembers());
    } else {
      storageService.updateVisitor(updated as Visitor);
      setVisitors(storageService.getVisitors());
    }
  };

  const handleSendBirthdayMessage = (person: Person) => {
    whatsappService.sendBirthdayMessage(person);
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = { ...person, lastBirthdayWishedAt: todayStr };
    
    if (members.some(m => m.id === person.id)) {
      storageService.updateMember(updated as Member);
      setMembers(storageService.getMembers());
    } else {
      storageService.updateVisitor(updated as Visitor);
      setVisitors(storageService.getVisitors());
    }
  };

  const handleSaveEvent = (eventData: Omit<ChurchEvent, 'id'> | ChurchEvent) => {
    if ('id' in eventData) {
      storageService.updateEvent(eventData as ChurchEvent);
    } else {
      const newEvent: ChurchEvent = { ...eventData, id: crypto.randomUUID() };
      storageService.saveEvent(newEvent);
    }
    setEvents(storageService.getEvents());
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const handleDeleteVisitor = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este visitante?')) {
      storageService.deleteVisitor(id);
      setVisitors(storageService.getVisitors());
    }
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      storageService.deleteMember(id);
      setMembers(storageService.getMembers());
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento da agenda?')) {
      storageService.deleteEvent(id);
      setEvents(storageService.getEvents());
    }
  };

  const allPeople = [...visitors, ...members];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          visitors={visitors} 
          members={members}
          events={events} 
          onAddVisitor={() => { setEditingVisitor(undefined); setShowVisitorForm(true); }} 
          onAddMember={() => { setEditingMember(undefined); setShowMemberForm(true); }}
          onSendBirthday={handleSendBirthdayMessage}
          onSendWelcome={handleSendWelcome}
        />;
      case 'members':
        return <MemberList 
          members={members} 
          events={events} 
          onDelete={handleDeleteMember} 
          onEdit={(m) => { setEditingMember(m); setShowMemberForm(true); }}
          onSendBirthday={handleSendBirthdayMessage}
          onSendWelcome={handleSendWelcome}
        />;
      case 'visitors':
        return <VisitorList 
          visitors={visitors} 
          events={events} 
          onDelete={handleDeleteVisitor} 
          onEdit={(v) => { setEditingVisitor(v); setShowVisitorForm(true); }}
          onSendBirthday={handleSendBirthdayMessage}
          onSendWelcome={handleSendWelcome}
        />;
      case 'birthdays':
        return <BirthdayReminders 
          people={allPeople} 
          onSendBirthday={handleSendBirthdayMessage}
        />;
      case 'events':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Agenda Semanal IEQ</h2>
                <p className="text-slate-500 mt-1">Datas e horários dos cultos e eventos.</p>
              </div>
              <button
                onClick={() => { setEditingEvent(undefined); setShowEventForm(true); }}
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
              >
                <span>➕ Novo Evento</span>
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onEdit={(e) => { setEditingEvent(e); setShowEventForm(true); }} 
                  onDelete={handleDeleteEvent} 
                />
              ))}
            </div>
          </div>
        );
      case 'users':
        return currentUser.role === 'ADMIN' ? <UserManagement /> : <div className="text-center p-20 text-slate-400">Acesso Negado</div>;
      default:
        return <Dashboard 
          visitors={visitors} 
          members={members} 
          events={events} 
          onAddVisitor={() => { setEditingVisitor(undefined); setShowVisitorForm(true); }} 
          onAddMember={() => { setEditingMember(undefined); setShowMemberForm(true); }}
          onSendBirthday={handleSendBirthdayMessage} 
          onSendWelcome={handleSendWelcome}
        />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      currentUser={currentUser} 
      onLogout={handleLogout}
    >
      {renderContent()}
      {showVisitorForm && <VisitorForm onSave={handleSaveVisitor} onCancel={() => { setShowVisitorForm(false); setEditingVisitor(undefined); }} initialData={editingVisitor} />}
      {showMemberForm && <MemberForm onSave={handleSaveMember} onCancel={() => { setShowMemberForm(false); setEditingMember(undefined); }} initialData={editingMember} />}
      {showEventForm && <EventForm onSave={handleSaveEvent} onCancel={() => { setShowEventForm(false); setEditingEvent(undefined); }} initialData={editingEvent} />}
    </Layout>
  );
};

export default App;
