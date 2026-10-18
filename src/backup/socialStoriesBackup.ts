/**
 * BACKUP: Histórias Sociais para Previsibilidade
 * 
 * Este arquivo foi preservado conforme solicitação do usuário para guarda e futura restauração
 * caso haja autorização dos órgãos competentes ou interesse posterior de reinstalação.
 */

export interface SocialStoryStep {
  text: string;
  emoji: string;
}

export interface SocialStory {
  title: string;
  steps: SocialStoryStep[];
}

export const SOCIAL_STORIES_BACKUP: SocialStory[] = [
  {
    title: "Vou ao Médico/Dentista 🩺",
    steps: [
      { text: "Hoje tenho uma consulta marcada. É uma visita importante para cuidar da minha saúde física.", emoji: "🏥" },
      { text: "A sala de espera pode ter sons de televisão, conversas ou luzes fortes.", emoji: "👥" },
      { text: "Se o barulho me incomodar, eu posso colocar meus abafadores ou fones de ouvido.", emoji: "🎧" },
      { text: "O profissional pode usar aparelhos barulhentos. Posso pedir para ele me avisar antes de ligar cada um.", emoji: "🪥" },
      { text: "Ao terminar, eu posso me parabenizar por ter concluído essa etapa importante!", emoji: "🎉" }
    ]
  },
  {
    title: "Ir ao Supermercado 🛒",
    steps: [
      { text: "O supermercado é um lugar cheio de cores, embalagens e pessoas circulando.", emoji: "🏪" },
      { text: "Se houver música alta ou anúncios no alto-falante, posso focar no meu Som de Chuva do DesplugaTEA.", emoji: "🌧️" },
      { text: "Fazer uma lista escrita me ajuda a saber exatamente onde ir, sem precisar tomar muitas decisões na hora.", emoji: "📝" },
      { text: "Se eu me sentir cansado, posso parar num corredor mais calmo ou ir para perto do caixa devagar.", emoji: "🧘" },
      { text: "Depois das compras, posso ir para casa e descansar no meu cantinho favorito.", emoji: "🏠" }
    ]
  },
  {
    title: "Mudança Surpresa de Planos 🔄",
    steps: [
      { text: "Eu tinha planejado fazer algo hoje, mas por algum motivo as coisas mudaram.", emoji: "📅" },
      { text: "Isso pode me deixar triste, bravo ou confuso por alguns instantes. Esse sentimento é normal.", emoji: "😟" },
      { text: "Posso fechar meus olhos e respirar no ritmo do balão por 1 minuto para dar tempo de aceitar a mudança.", emoji: "🎈" },
      { text: "A nova atividade pode não ser o que eu queria, mas eu consigo lidar com ela um passo de cada vez.", emoji: "🚶" },
      { text: "Se eu precisar de ajuda para me reorganizar, posso pedir apoio de alguém querido ou do meu psicólogo.", emoji: "🤝" }
    ]
  },
  {
    title: "Desentendimento Familiar (Gerenciando Conflitos) 🗣️",
    steps: [
      { text: "Às vezes, minha família e eu pensamos de formas diferentes e isso pode causar uma discussão.", emoji: "🗣️" },
      { text: "Quando eles não concordam comigo, posso sentir meu rosto esquentar ou minha barriga apertar. Isso é normal.", emoji: "😟" },
      { text: "Em vez de gritar, posso respirar fundo e contar até 5 ou ir para o meu quarto por alguns minutos.", emoji: "🧘" },
      { text: "Quando estiver mais calmo, posso dizer: 'Eu me sinto chateado porque...' e ouvir o que eles têm a dizer.", emoji: "💬" },
      { text: "Famílias podem discordar e continuar se gostando. Resolver problemas com calma me deixa orgulhoso.", emoji: "💖" }
    ]
  },
  {
    title: "Entrevista de Emprego (Situação de Alta Pressão) 💼",
    steps: [
      { text: "Vou chegar 10 minutos antes do horário e avisar na recepção que tenho uma entrevista.", emoji: "⌚" },
      { text: "Quando o entrevistador me chamar, vou olhar para ele (ou para a testa dele) e dizer 'Olá' com clareza.", emoji: "🤝" },
      { text: "Eles farão perguntas sobre o que sei fazer. Posso levar um tempo para pensar antes de responder.", emoji: "💭" },
      { text: "Se eu não entender uma pergunta, tudo bem dizer: 'Pode repetir, por favor?' ou 'Não entendi'.", emoji: "❓" },
      { text: "Ao terminar, vou agradecer pelo tempo deles. Fiz o meu melhor e isso é o suficiente por hoje.", emoji: "✨" }
    ]
  },
  {
    title: "Preparação para Prova (Ansiedade de Desempenho) 📝",
    steps: [
      { text: "Antes da prova, vou revisar minhas anotações, mas também preciso descansar meu cérebro.", emoji: "📚" },
      { text: "Na noite anterior, vou dormir cedo para minha mente estar descansada e pronta.", emoji: "😴" },
      { text: "Durante a prova, se eu sentir medo, vou fechar os olhos por um segundo e lembrar de respirar devagar.", emoji: "🧘" },
      { text: "Vou ler uma questão de cada vez. Se não souber uma resposta, posso pular e voltar nela depois.", emoji: "⏱️" },
      { text: "A prova mede o que aprendi, não quem eu sou. O importante é que eu tentei fazer o meu melhor.", emoji: "🌟" }
    ]
  },
  {
    title: "Preciso Dizer \"Não\" (Limites Pessoais) 🛡️",
    steps: [
      { text: "Eu tenho o direito de não querer fazer algo, abraçar alguém ou emprestar minhas coisas.", emoji: "✋" },
      { text: "Posso dizer 'não' de forma calma e firme, sem precisar gritar ou ser rude.", emoji: "🗣️" },
      { text: "Posso usar frases como 'Não, obrigado', 'Agora não quero' ou 'Prefiro não fazer isso'.", emoji: "💬" },
      { text: "A outra pessoa pode ficar chateada, e eu não preciso consertar o sentimento dela.", emoji: "👤" },
      { text: "Dizer 'não' protege meu espaço e minha energia. É seguro cuidar de mim mesmo.", emoji: "🛡️" }
    ]
  },
  {
    title: "Pedindo um Intervalo (Prevenção de Crise) ⏸️",
    steps: [
      { text: "Às vezes, o barulho ou as luzes ficam fortes demais e meu corpo começa a ficar agitado.", emoji: "⚡" },
      { text: "Não preciso esperar explodir. Posso perceber esse sinal e decidir que preciso de uma pausa.", emoji: "🚨" },
      { text: "Posso mostrar meu cartão de pausa ou dizer: 'Preciso de um momento sozinho, por favor'.", emoji: "🎫" },
      { text: "Vou para um lugar silencioso ou uso meus fones de ouvido até me sentir 'carregado' de novo.", emoji: "🎧" },
      { text: "Pedir um intervalo é inteligente. Ajuda meu cérebro a voltar a funcionar bem.", emoji: "🔋" }
    ]
  },
  {
    title: "Mudança de Rotina (Flexibilidade Cognitiva) 🔄",
    steps: [
      { text: "Às vezes, as coisas não acontecem como eu planejei. Um lugar pode estar fechado ou alguém pode atrasar.", emoji: "🚧" },
      { text: "É normal sentir frustração ou susto quando o plano muda de repente.", emoji: "😟" },
      { text: "Posso perguntar: 'Qual é o novo plano?' ou olhar as opções que tenho agora.", emoji: "🗺️" },
      { text: "Vou tentar seguir o novo fluxo. Se for difícil, posso pedir ajuda para me reorganizar.", emoji: "🤝" },
      { text: "O mundo muda o tempo todo. Eu sou capaz de lidar com mudanças, uma de cada vez.", emoji: "🌱" }
    ]
  },
  {
    title: "Lidando com Erros (Perfeccionismo) ✏️",
    steps: [
      { text: "Todo mundo comete erros. Professores, pais e amigos erram às vezes. Eu também erro.", emoji: "🤝" },
      { text: "Quando erro, posso querer apagar tudo ou rasgar o papel, mas posso tentar respirar primeiro.", emoji: "💨" },
      { text: "Um erro é apenas uma chance de consertar. Posso usar a borracha ou pedir desculpas se magoei alguém.", emoji: "✏️" },
      { text: "O erro me ensina como fazer certo na próxima vez. Ele é como um professor.", emoji: "💡" },
      { text: "Eu sou uma boa pessoa, mesmo quando cometo erros.", emoji: "❤️" }
    ]
  },
  {
    title: "Indo a um Lugar Novo (Ansiedade Social/Sensorial) 🧭",
    steps: [
      { text: "Antes de ir a um lugar novo, posso olhar fotos na internet para saber como ele é.", emoji: "🖥️" },
      { text: "Vou levar meu 'kit de conforto' (fones, óculos ou um objeto que me acalma).", emoji: "🎒" },
      { text: "Se o lugar for muito cheio, posso procurar onde fica a saída ou um canto mais calmo.", emoji: "🚪" },
      { text: "Não preciso ficar muito tempo se não quiser. Posso combinar um horário de saída antes de ir.", emoji: "⌚" },
      { text: "Conhecer lugares novos pode ser difícil, mas também pode ser interessante. Estou seguro.", emoji: "🦁" }
    ]
  }
];
