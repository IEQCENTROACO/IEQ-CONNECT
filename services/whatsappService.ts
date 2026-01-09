
import { Visitor, ChurchEvent } from '../types';

export const whatsappService = {
  formatPhone: (phone: string) => {
    return phone.replace(/\D/g, '');
  },

  sendWelcomeMessage: (visitor: Visitor, events: ChurchEvent[]) => {
    const agendaText = events.length > 0 
      ? events.map(e => {
          const timeDisplay = e.secondaryTime ? `${e.time} e ${e.secondaryTime}` : e.time;
          return `📍 *${e.title}*\n📅 ${e.dayOfWeek} às ${timeDisplay}\n_${e.description}_`;
        }).join('\n\n')
      : "Fique atento às nossas redes sociais para os próximos eventos!";

    const message = `Paz do Senhor, *${visitor.name}*! ✨\n\nÉ com imensa alegria que a família *IEQ* agradece sua visita em nosso último culto. Sua presença foi um presente de Deus para nós e trouxe muita luz ao nosso ambiente! ⛪❤️\n\nCremos que Deus tem planos maravilhosos para sua vida e gostaríamos muito de te ver novamente. Você já é parte da nossa família e nossa casa estará sempre de portas abertas para você.\n\nPara que você não perca nada, preparamos nossa *Agenda Especial* abaixo. Escolha um momento e venha estar conosco novamente:\n\n${agendaText}\n\nSerá uma honra caminhar ao seu lado! Que Deus te abençoe grandemente. 🙏✨`;
    
    const url = `https://wa.me/55${whatsappService.formatPhone(visitor.phone)}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },

  sendBirthdayMessage: (visitor: Visitor) => {
    const message = `Olá, *${visitor.name}*! 🎉🎂\n\nA família *IEQ* passa por aqui para desejar um Feliz Aniversário! \n\nQue o Senhor Jesus derrame bênçãos sem medida sobre sua vida, te dando saúde, paz e muitas alegrias neste novo ciclo. \n\n_"O Senhor te abençoe e te guarde!" (Números 6:24)_ \n\nParabéns! 🎈🎊`;
    
    const url = `https://wa.me/55${whatsappService.formatPhone(visitor.phone)}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
};
