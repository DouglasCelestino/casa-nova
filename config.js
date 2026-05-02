// config.js — populated in Task 3
const CONFIG = {
  casal:   "Douglas & Keila",
  data:    "07/06/2026",
  horario: "15:00",
  endereco: "Rua German Lorca, 1000 - Condomínio Amapá",
  linkEndereco: "https://www.google.com/maps/search/?api=1&query=Rua%20German%20Lorca%201000%20Condom%C3%ADnio%20Amap%C3%A1",
  historia:
    "Depois de sonhar, planejar e esperar, chegou a hora. " +
    "Douglas e Keila estão prontos para escrever uma nova história e agora com endereço fixo. " +
    "Esse cantinho é o reflexo de tudo que construímos juntos, " +
    "e não faria sentido inaugurá-lo sem as pessoas que amamos.",

  programacao: [
    {
      imagem: "assets/casal/faminto.jpeg",
      titulo: "Comer bem",
    },
    {
      imagem: "assets/casal/brincadeiras.jpeg",
      titulo: "Brincadeiras",
    },
    {
      imagem: "assets/casal/presentes.mp4",
      titulo: "Abrir presentes",
    },
  ],

  confirmacao:
    "Que alegria! Estamos ansiosos com a sua presença " +
    "e já contamos com você pra esse momento especial. 🏠",

  pix: {
    chave:    "11 96590-2078",
  },

  supabase: {
    url:      "https://mckjhufqviqgnnysdknd.supabase.co",
    anonKey:  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ja2podWZxdmlxZ25ueXNka25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NjI4OTYsImV4cCI6MjA5MzIzODg5Nn0.qNC3uySG87NwwQsrKLmU-17ukISA_MZFR50FMdpyNyg",
  },

  presentes: [
    {
      id: "p1",
      nome: "Talheres",
      descricao: "Conjunto de talheres para o dia a dia",
      preco: 79.90,
      imagem: "assets/presentes/talheres.jpg",
    },
    {
      id: "p2",
      nome: "Pratos",
      descricao: "Jogo de pratos para a nova casa",
      preco: 75.00,
      imagem: "assets/presentes/pratos.jpg",
    },
    {
      id: "p3",
      nome: "Copos",
      descricao: "Jogo de copos transparentes",
      preco: 44.00,
      imagem: "assets/presentes/copos.jpg",
    },
    {
      id: "p4",
      nome: "Taças + Jarra",
      descricao: "Jogo de taças para servir bebidas",
      preco: 57.30,
      imagem: "assets/presentes/tacas.jpg",
    },
    {
      id: "p5",
      nome: "Jogo de sobremesa",
      descricao: "Conjunto para servir sobremesas",
      preco: 53.90,
      imagem: "assets/presentes/jogo-sobremesa.jpg",
    },
    {
      id: "p6",
      nome: "Formas",
      descricao: "Kit de formas para assar e preparar receitas",
      preco: 150.00,
      imagem: "assets/presentes/formas.jpg",
    },
    {
      id: "p7",
      nome: "Kit utensílios de cozinha silicone",
      descricao: "Utensílios variados para preparo de alimentos",
      preco: 140.00,
      imagem: "assets/presentes/utensilios-cozinha.jpg",
    },
    {
      id: "p8",
      nome: "Kit de xícaras para café 220ml",
      descricao: "Conjunto de xícaras para café",
      preco: 130.00,
      imagem: "assets/presentes/xicaras-cafe.jpg",
    },
    {
      id: "p9",
      nome: "Chaleira elétrica",
      descricao: "Chaleira elétrica para aquecer água com praticidade",
      preco: 115.90,
      imagem: "assets/presentes/chaleira-eletrica.jpg",
    },
    {
      id: "p10",
      nome: "Liquidificador",
      descricao: "Liquidificador para sucos, vitaminas e receitas",
      preco: 100.00,
      imagem: "assets/presentes/liquidificador.jpg",
    },
    {
      id: "p11",
      nome: "Sanduicheira",
      descricao: "Sanduicheira elétrica para lanches rápidos",
      preco: 70.00,
      imagem: "assets/presentes/sanduicheira.jpg",
    },
    {
      id: "p12",
      nome: "Kit potes de vidro",
      descricao: "Potes de vidro para armazenar alimentos",
      preco: 100.00,
      imagem: "assets/presentes/potes-vidro.jpg",
    },
    {
      id: "p13",
      nome: "Saladeira de vidro",
      descricao: "Conjunto de saladeiras de vidro",
      preco: 80.00,
      imagem: "assets/presentes/saladeira-vidro.jpg",
    },
    {
      id: "p14",
      nome: "Açucareiro",
      descricao: "Açucareiro de vidro para mesa ou cozinha",
      preco: 30.00,
      imagem: "assets/presentes/acucareiro.jpg",
    },
    {
      id: "p15",
      nome: "Kit de faqueiro",
      descricao: "Conjunto de facas e acessórios para cozinha",
      preco: 130.00,
      imagem: "assets/presentes/faqueiro.jpg",
    },
    {
      id: "p16",
      nome: "Tábua de vidro",
      descricao: "Tábua de vidro para preparo de alimentos",
      preco: 51.17,
      imagem: "assets/presentes/tabua-vidro.jpg",
    },
    {
      id: "p17",
      nome: "Kit de panelas",
      descricao: "Conjunto de panelas para a nova cozinha",
      preco: 205.00,
      imagem: "assets/presentes/kit-panelas.jpg",
    },
    {
      id: "p18",
      nome: "Escorredor de louças",
      descricao: "Escorredor para pratos, copos e talheres",
      preco: 89.91,
      imagem: "assets/presentes/escorredor-loucas.jpg",
    },
    {
      id: "p19",
      nome: "Panela de pressão",
      descricao: "Panela de pressão para o dia a dia",
      preco: 189.90,
      imagem: "assets/presentes/panela-pressao.jpg",
    },
    {
      id: "p20",
      nome: "Kit de potes para mantimentos",
      descricao: "Potes para organizar mantimentos na cozinha",
      preco: 109.90,
      imagem: "assets/presentes/potes-mantimentos.jpg",
    },
    {
      id: "p21",
      nome: "Travessa de vidro",
      descricao: "Travessas de vidro para servir e preparar alimentos",
      preco: 74.75,
      imagem: "assets/presentes/travessa-vidro.jpg",
    },
    {
      id: "p22",
      nome: "Kit porta temperos",
      descricao: "Potes para organizar temperos",
      preco: 72.90,
      imagem: "assets/presentes/porta-temperos.jpg",
    },
    {
      id: "p23",
      nome: "Ralador",
      descricao: "Ralador multiuso para cozinha",
      preco: 29.90,
      imagem: "assets/presentes/ralador.jpg",
    },
    {
      id: "p24",
      nome: "Escorredor de macarrão",
      descricao: "Escorredor de inox para massas e alimentos",
      preco: 39.90,
      imagem: "assets/presentes/escorredor-macarrao.jpg",
    },
    {
      id: "p25",
      nome: "Ferro de passar roupa",
      descricao: "Ferro para passar roupas",
      preco: 89.00,
      imagem: "assets/presentes/ferro-passar.jpg",
    },
    {
      id: "p26",
      nome: "Mop",
      descricao: "Mop para limpeza da casa",
      preco: 99.00,
      imagem: "assets/presentes/mop.jpg",
    },
    {
      id: "p27",
      nome: "Ventilador",
      descricao: "Para não morrer de calor",
      preco: 120.00,
      imagem: "assets/presentes/ventilador.jpg",
    },
    {
      id: "p28",
      nome: "Batedeira elétrica",
      descricao: "Batedeira para preparar bolos, massas e receitas",
      preco: 89.00,
      imagem: "assets/presentes/batedeira.jpg",
    },
    {
      id: "p29",
      nome: "Micro-ondas",
      descricao: "Micro-ondas para o dia a dia",
      preco: 350.00,
      imagem: "assets/presentes/microondas.jpg",
    },
    {
      id: "p30",
      nome: "Air fryer",
      descricao: "Air fryer para preparar alimentos de forma mais saudável",
      preco: 250.00,
      imagem: "assets/presentes/airfryer.jpg",
    },
    {
      id: "p31",
      nome: "Varal de chão",
      descricao: "Varal de chão para secar roupas",
      preco: 70.00,
      imagem: "assets/presentes/varal-chao.jpg",
    }
  ],
}