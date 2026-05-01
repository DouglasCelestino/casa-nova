// ── Supabase client (credentials filled in Task 5) ──
const supabaseClient = window.supabase.createClient(
  CONFIG.supabase.url,
  CONFIG.supabase.anonKey
)

// ── State ──────────────────────────────────────────
const reservedIds    = new Set()
let   selectedGiftId = null
let   triggerButton  = null  // for focus restoration on modal close

// ── Render ─────────────────────────────────────────

function renderHero() {
  document.getElementById('couple-name').textContent    = CONFIG.casal
  document.getElementById('event-date').textContent     = CONFIG.data
  document.getElementById('event-time').textContent     = CONFIG.horario
  document.getElementById('event-address').textContent  = CONFIG.endereco
  document.getElementById('invite-message').textContent = CONFIG.mensagemConvite
}

function renderHistoria() {
  document.getElementById('historia-text').textContent = CONFIG.historia
}

function renderTrocadilho() {
  document.getElementById('trocadilho-text').textContent = CONFIG.trocadilho
}

function renderProgramacao() {
  document.getElementById('programacao-grid').innerHTML = CONFIG.programacao.map(item => `
    <div class="programacao-card">
      <div class="prog-icone">${item.icone}</div>
      <p class="prog-titulo">${item.titulo}</p>
      <p class="prog-pun">${item.pun}</p>
    </div>
  `).join('')
}

function renderPresentes() {
  document.getElementById('presentes-grid').innerHTML = CONFIG.presentes.map(gift => `
    <div class="gift-card" id="gift-${gift.id}">
      <img class="gift-img" src="${gift.imagem}" alt="${gift.nome}"
        data-nome="${gift.nome}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="gift-img-placeholder" style="display:none">${gift.nome}</div>
      <div class="gift-body">
        <p class="gift-name">${gift.nome}</p>
        <p class="gift-desc">${gift.descricao}</p>
        <p class="gift-price">Sugestão: R$ ${gift.preco.toFixed(2).replace('.', ',')}</p>
        <div class="color-dots">
          <div class="color-dot" style="background:#D3D3D3" title="Cinza claro"></div>
          <div class="color-dot" style="background:#8D8D8D" title="Inox"></div>
          <div class="color-dot" style="background:#FAF8F5" title="Off-white"></div>
        </div>
        <button class="btn-reserve" data-id="${gift.id}">Quero presentear</button>
        <div class="reserved-badge">Já reservado 🎁</div>
      </div>
    </div>
  `).join('')
}

function renderPix() {
  document.getElementById('pix-phone').textContent = CONFIG.pix.telefone
  document.getElementById('pix-key').textContent   = CONFIG.pix.chave
}

function renderFooter() {
  document.getElementById('footer-couple').textContent = CONFIG.casal
}

// ── Modal ──────────────────────────────────────────

function openModal(gift, fromButton) {
  selectedGiftId = gift.id
  triggerButton  = fromButton

  const img = document.getElementById('modal-gift-img')
  img.src = gift.imagem
  img.alt = gift.nome

  document.getElementById('modal-gift-name').textContent  = gift.nome
  document.getElementById('modal-gift-price').textContent =
    `Sugestão: R$ ${gift.preco.toFixed(2).replace('.', ',')}`

  document.getElementById('reservation-form').classList.remove('hidden')
  document.getElementById('reservation-success').classList.add('hidden')
  document.getElementById('form-error').classList.add('hidden')
  document.getElementById('field-name').value     = ''
  document.getElementById('field-whatsapp').value = ''
  document.getElementById('field-color').value    = ''
  document.querySelectorAll('.color-circle').forEach(c => {
    c.classList.remove('selected')
    c.setAttribute('aria-pressed', 'false')
  })

  const btn = document.getElementById('btn-submit')
  btn.disabled    = false
  btn.textContent = 'Confirmar reserva'

  document.getElementById('modal-overlay').classList.remove('hidden')
  document.body.style.overflow = 'hidden'

  // Move focus to first input for accessibility
  setTimeout(() => document.getElementById('field-name').focus(), 50)
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden')
  document.body.style.overflow = ''

  // Restore focus to the button that opened the modal
  if (triggerButton) triggerButton.focus()
  triggerButton  = null
  selectedGiftId = null
}

// ── Helpers ────────────────────────────────────────

function maskWhatsApp(value) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function markGiftAsReserved(giftId) {
  reservedIds.add(giftId)
  const card = document.getElementById(`gift-${giftId}`)
  if (card) {
    card.classList.add('reserved')
    card.setAttribute('inert', '')  // blocks both mouse and keyboard
  }
}

function copyPixKey() {
  navigator.clipboard.writeText(CONFIG.pix.chave).then(() => {
    const fb = document.getElementById('copy-feedback')
    fb.classList.remove('hidden')
    setTimeout(() => fb.classList.add('hidden'), 2000)
  }).catch(() => {
    const fb = document.getElementById('copy-feedback')
    fb.textContent = 'Use Ctrl+C na chave acima'
    fb.classList.remove('hidden')
    setTimeout(() => fb.classList.add('hidden'), 3000)
  })
}

// ── Supabase ───────────────────────────────────────

async function loadReservedGifts() {
  const { data, error } = await supabaseClient.from('reservas').select('presente_id')
  if (error) { console.error('Erro ao carregar reservas:', error); return }
  data.forEach(row => markGiftAsReserved(row.presente_id))
}

function subscribeToReservations() {
  supabaseClient
    .channel('reservas-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'reservas' },
      payload => markGiftAsReserved(payload.new.presente_id)
    )
    .subscribe()
}

async function submitReservation() {
  if (!selectedGiftId) return

  const name     = document.getElementById('field-name').value.trim()
  const whatsapp = document.getElementById('field-whatsapp').value.trim()
  const color    = document.getElementById('field-color').value
  const errorEl  = document.getElementById('form-error')

  errorEl.classList.add('hidden')

  if (!name || !whatsapp || !color) {
    errorEl.textContent = 'Preencha todos os campos, incluindo a cor.'
    errorEl.classList.remove('hidden')
    return
  }

  if (whatsapp.replace(/\D/g, '').length < 10) {
    errorEl.textContent = 'WhatsApp inválido. Use o formato (11) 99999-9999.'
    errorEl.classList.remove('hidden')
    return
  }

  const btn = document.getElementById('btn-submit')
  btn.disabled    = true
  btn.textContent = 'Confirmando...'

  const { error } = await supabaseClient.from('reservas').insert({
    presente_id:    selectedGiftId,
    nome_convidado: name,
    whatsapp:       whatsapp,
    cor_escolhida:  color,
  })

  btn.disabled    = false
  btn.textContent = 'Confirmar reserva'

  if (error) {
    errorEl.textContent = error.code === '23505'
      ? 'Ops! Esse presente acabou de ser reservado por outra pessoa.'
      : 'Erro ao confirmar. Tente novamente.'
    if (error.code !== '23505') console.error(error)
    errorEl.classList.remove('hidden')
    return
  }

  document.getElementById('reservation-form').classList.add('hidden')
  document.getElementById('success-message').textContent = CONFIG.confirmacao
  document.getElementById('reservation-success').classList.remove('hidden')
  setTimeout(closeModal, 4500)
}

// ── Event listeners ────────────────────────────────

function setupEventListeners() {
  // Reserve buttons (event delegation on grid)
  document.getElementById('presentes-grid').addEventListener('click', e => {
    const btn = e.target.closest('.btn-reserve')
    if (!btn) return
    const gift = CONFIG.presentes.find(g => g.id === btn.dataset.id)
    if (gift) openModal(gift, btn)
  })

  // Modal close
  document.getElementById('modal-close').addEventListener('click', closeModal)
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal()
  })

  // Escape key closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && selectedGiftId !== null) closeModal()
  })

  // Color circles
  document.getElementById('color-options').addEventListener('click', e => {
    const circle = e.target.closest('.color-circle')
    if (!circle) return
    document.querySelectorAll('.color-circle').forEach(c => {
      c.classList.remove('selected')
      c.setAttribute('aria-pressed', 'false')
    })
    circle.classList.add('selected')
    circle.setAttribute('aria-pressed', 'true')
    document.getElementById('field-color').value = circle.dataset.color
  })

  // WhatsApp mask
  document.getElementById('field-whatsapp').addEventListener('input', e => {
    e.target.value = maskWhatsApp(e.target.value)
  })

  // Form submit
  document.getElementById('reservation-form').addEventListener('submit', e => {
    e.preventDefault()
    submitReservation()
  })

  // Pix copy
  document.getElementById('btn-copy-pix').addEventListener('click', copyPixKey)
}

// ── Init ───────────────────────────────────────────

async function init() {
  renderHero()
  renderHistoria()
  renderTrocadilho()
  renderProgramacao()
  renderPresentes()
  renderPix()
  renderFooter()
  setupEventListeners()
  await loadReservedGifts()
  subscribeToReservations()
}

init()
