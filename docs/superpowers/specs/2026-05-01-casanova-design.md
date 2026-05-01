# Chá de Casa Nova — Design Spec

**Data:** 2026-05-01  
**Casal:** Douglas & Keila  
**Status:** Aprovado

---

## Objetivo

Site estático de convite e lista de presentes para o Chá de Casa Nova de Douglas & Keila. Hospedado no GitHub Pages. Persistência de reservas via Supabase (free tier). Sem backend customizado — apenas HTML, CSS e JS puro.

---

## Arquitetura

**Abordagem:** Multi-arquivo estático com `config.js` como ponto único de edição de conteúdo.

```
casa-nova/
├── index.html
├── styles.css
├── app.js
├── config.js          ← editar aqui: presentes, Pix, data, endereço
├── assets/
│   ├── casal/         ← fotos do casal
│   └── presentes/     ← fotos dos presentes
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-01-casanova-design.md
```

**Deploy:** GitHub Pages na branch `main` → `https://<usuario>.github.io/casa-nova`

**Back-end:** Supabase (configurado pelo usuário — credenciais fornecidas via `config.js`)

---

## Paleta de cores

| Papel | Cor |
|---|---|
| Fundo | Off-white (`#FAF8F5`) |
| Título principal | Dourado (`#C9A84C`) |
| Textos | Verde oliva (`#6B7C5A`) |
| Fundo cards | Branco (`#FFFFFF`) |
| Bordas e sutis | Bege claro (`#EDE8DF`) |

**Fonte do título:** Cursiva elegante (ex: *Playfair Display* ou *Great Vibes* via Google Fonts)  
**Fonte do corpo:** Sem serifa limpa (ex: *Lato* ou *Inter*)

---

## Estrutura da página (scroll único)

### 1. Hero
- Nome "Douglas & Keila" em dourado cursivo, grande
- Subtítulo: "Chá de Casa Nova"
- Data e horário (placeholder: "A definir")
- Endereço (placeholder: "A definir")
- Mensagem de convite elaborada (gerada na implementação)

### 2. Nossa história
- Foto do casal (placeholder até foto real)
- Parágrafo curto sobre o momento da mudança (placeholder até texto real)

### 3. Trocadilho de abertura
- Foto do Douglas com expressão faminta
- Texto bem-humorado: *"Venha pro nosso chá… vai ter muita comida"* (tom descontraído)

### 4. Programação do dia
- Cards com ícone/imagem + título + trocadilho para cada item
- Itens configuráveis no `config.js`
- Itens padrão: Comer, Brincar, Abrir presentes

### 5. Lista de presentes
- Grid responsivo de cards
- Cada card contém: imagem, nome, preço sugerido, 3 círculos de cor, botão "Quero presentear"
- Presentes já reservados: selo "Já reservado" + botão desabilitado
- Atualização em tempo real via Supabase Realtime

### 6. Contribuir com Pix
- QR code (mockado por enquanto)
- Número de telefone
- Botão "Copiar chave Pix"

### 7. Rodapé
- Nome do casal
- Mensagem de agradecimento curta

---

## Paleta de cores dos presentes

Seletor de 3 círculos embaixo de cada card de presente. A pessoa escolhe qual cor vai comprar:

| Nome | Cor |
|---|---|
| Cinza claro | `#D3D3D3` |
| Inox | `#8D8D8D` |
| Off-white | `#FAF8F5` |

---

## Fluxo de reserva de presente

1. Usuário clica em **"Quero presentear"**
2. Abre modal com: nome do presente, imagem, campos de preenchimento
3. Campos obrigatórios:
   - Nome completo
   - WhatsApp (com máscara de telefone brasileiro)
   - Cor escolhida (um dos 3 círculos — obrigatório)
4. Usuário clica **"Confirmar reserva"**
5. Sistema grava no Supabase: `presente_id`, `nome`, `whatsapp`, `cor_escolhida`, `reservado_em`
6. Card atualizado em tempo real para todos os visitantes
7. Mensagem de confirmação: *"Que alegria! Estamos ansiosos com a sua presença e já contamos com você pra esse momento especial 🏠"*

**Concorrência:** Se dois usuários tentarem reservar o mesmo presente simultaneamente, o Supabase garante atomicidade — o segundo recebe mensagem informando que o presente acabou de ser reservado.

---

## Modelo de dados (Supabase)

A lista de presentes vive **apenas no `config.js`** (junto com as fotos no repo). O Supabase armazena somente as reservas.

### Tabela `reservas` (única tabela no Supabase)

| campo | tipo | notas |
|---|---|---|
| `id` | uuid | PK |
| `presente_id` | text | ID do presente conforme definido no `config.js` |
| `nome_convidado` | text | |
| `whatsapp` | text | |
| `cor_escolhida` | text | "cinza-claro", "inox" ou "off-white" |
| `reservado_em` | timestamptz | gerado automaticamente (`now()`) |

**Constraint de unicidade:** `UNIQUE(presente_id)` — impede que dois usuários reservem o mesmo presente, garantindo atomicidade no banco sem necessidade de trigger.

**Como verificar disponibilidade:** ao carregar a página, o app busca todos os `presente_id` já em `reservas` e bloqueia os cards correspondentes. Supabase Realtime notifica todos os visitantes em tempo real quando uma nova reserva é inserida.

---

## config.js — estrutura

```js
const CONFIG = {
  casal: "Douglas & Keila",
  data: "A definir",
  horario: "A definir",
  endereco: "A definir",
  mensagemConvite: "...",

  supabase: {
    url: "SUA_URL_AQUI",
    anonKey: "SUA_ANON_KEY_AQUI",
  },

  pix: {
    telefone: "(xx) xxxxx-xxxx",
    chave: "xxxxxxxxxxx",
  },

  programacao: [
    { icone: "🍽️", titulo: "Comer", trocadilho: "..." },
    { icone: "🎮", titulo: "Brincar", trocadilho: "..." },
    { icone: "🎁", titulo: "Abrir presentes", trocadilho: "..." },
  ],

  presentes: [
    {
      id: "1",
      nome: "Jogo de panelas",
      descricao: "...",
      preco: 89.90,
      imagem: "assets/presentes/panelas.jpg",
    },
  ],
}
```

---

## Responsividade

- Mobile-first (maioria dos convidados abrirá pelo celular)
- Grid de presentes: 1 coluna no mobile, 2-3 no desktop
- Modal de reserva: ocupa tela cheia no mobile
- Fonte do título ajustada por breakpoint

---

## Fotos

Hospedadas diretamente no repositório GitHub na pasta `assets/`. Enviadas pelo usuário quando disponíveis — placeholders usados na implementação inicial.

---

## Fora do escopo

- Painel administrativo (gerenciamento via Supabase Dashboard)
- Autenticação de convidados
- Notificações por e-mail/WhatsApp
- Múltiplos idiomas
