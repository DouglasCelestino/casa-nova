// ── Supabase client ───────────────────────────────
const supabaseClient = window.supabase.createClient(
  CONFIG.supabase.url,
  CONFIG.supabase.anonKey
)

// ── State ──────────────────────────────────────────
const reservedIds    = new Set()
let   selectedGiftId = null
let   triggerButton  = null

// ── Helpers de DOM ─────────────────────────────────
function getEl(id) {
  return document.getElementById(id)
}

function setText(id, value) {
  const el = getEl(id)
  if (el) el.textContent = value
}

// ── Render ─────────────────────────────────────────
function renderHero() {
  const coupleNameEl = document.getElementById('couple-name')
  const eventDateEl = document.getElementById('event-date')
  const eventTimeEl = document.getElementById('event-time')
  const addressEl = document.getElementById('event-address')
  const inviteMessageEl = document.getElementById('invite-message')

  if (!coupleNameEl || !eventDateEl || !eventTimeEl || !addressEl || !inviteMessageEl) {
    return
  }

  coupleNameEl.textContent = CONFIG.casal
  eventDateEl.textContent = CONFIG.data
  eventTimeEl.textContent = CONFIG.horario

  addressEl.textContent = CONFIG.endereco

  if (CONFIG.linkEndereco) {
    addressEl.href = CONFIG.linkEndereco
  } else {
    addressEl.removeAttribute('href')
  }

  inviteMessageEl.textContent = CONFIG.mensagemConvite
}

function renderHistoria() {
  setText('historia-text', CONFIG.historia)
}

function renderProgramacao() {
  const grid = document.getElementById('programacao-grid')

  if (!grid) return

  grid.innerHTML = CONFIG.programacao.map(item => {
    const isVideo = item.imagem && item.imagem.toLowerCase().endsWith('.mp4')

    return `
      <div class="programacao-card">
        ${
          isVideo
            ? `<video class="prog-img" autoplay muted loop playsinline preload="auto"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                <source src="${item.imagem}" type="video/mp4">
              </video>
              <div class="prog-img-placeholder" style="display:none">Vídeo não encontrado</div>`
            : `<img class="prog-img" src="${item.imagem}" alt="${item.titulo}"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="prog-img-placeholder" style="display:none">Imagem não encontrada</div>`
        }
        <p class="prog-titulo">${item.titulo}</p>
      </div>
    `
  }).join('')
}

function renderPresentes() {
  const grid = getEl('presentes-grid')
  if (!grid) return

  const limit = Number.parseInt(grid.dataset.limit, 10)
  const presentes = Number.isFinite(limit)
    ? CONFIG.presentes.slice(0, limit)
    : CONFIG.presentes

  grid.innerHTML = presentes.map(gift => `
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
  setText('pix-phone', CONFIG.pix.telefone)
  setText('pix-key', CONFIG.pix.chave)
}

function renderFooter() {
  setText('footer-couple', CONFIG.casal)
}

// ── Modal ──────────────────────────────────────────
function openModal(gift, fromButton) {
  selectedGiftId = gift.id
  triggerButton  = fromButton

  const img = getEl('modal-gift-img')
  if (img) {
    img.style.display = 'block'
    img.src = gift.imagem
    img.alt = gift.nome
  }

  setText('modal-gift-name', gift.nome)
  setText('modal-gift-price', `Sugestão: R$ ${gift.preco.toFixed(2).replace('.', ',')}`)

  getEl('reservation-form')?.classList.remove('hidden')
  getEl('reservation-success')?.classList.add('hidden')
  getEl('form-error')?.classList.add('hidden')

  if (getEl('field-name')) getEl('field-name').value = ''
  if (getEl('field-whatsapp')) getEl('field-whatsapp').value = ''
  if (getEl('field-color')) getEl('field-color').value = ''

  document.querySelectorAll('.color-circle').forEach(c => {
    c.classList.remove('selected')
    c.setAttribute('aria-pressed', 'false')
  })

  const btn = getEl('btn-submit')
  if (btn) {
    btn.disabled = false
    btn.textContent = 'Confirmar reserva'
  }

  getEl('modal-overlay')?.classList.remove('hidden')
  document.body.style.overflow = 'hidden'

  setTimeout(() => getEl('field-name')?.focus(), 50)
}

function closeModal() {
  getEl('modal-overlay')?.classList.add('hidden')
  document.body.style.overflow = ''

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
  const card = getEl(`gift-${giftId}`)
  if (card) {
    card.classList.add('reserved')
    card.setAttribute('inert', '')
  }
}

function copyPixKey() {
  navigator.clipboard.writeText(CONFIG.pix.chave).then(() => {
    const fb = getEl('copy-feedback')
    if (!fb) return
    fb.classList.remove('hidden')
    setTimeout(() => fb.classList.add('hidden'), 2000)
  }).catch(() => {
    const fb = getEl('copy-feedback')
    if (!fb) return
    fb.textContent = 'Use Ctrl+C na chave acima'
    fb.classList.remove('hidden')
    setTimeout(() => fb.classList.add('hidden'), 3000)
  })
}

// ── Supabase ───────────────────────────────────────
async function loadReservedGifts() {
  const { data, error } = await supabaseClient.from('reservas').select('presente_id')
  if (error) {
    console.error('Erro ao carregar reservas:', error)
    return
  }
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

  const nameEl     = getEl('field-name')
  const whatsappEl = getEl('field-whatsapp')
  const colorEl    = getEl('field-color')
  const errorEl    = getEl('form-error')

  const name     = nameEl?.value.trim() || ''
  const whatsapp = whatsappEl?.value.trim() || ''
  const color    = colorEl?.value || ''

  errorEl?.classList.add('hidden')

  if (!name || !whatsapp || !color) {
    if (errorEl) {
      errorEl.textContent = 'Preencha todos os campos, incluindo a cor.'
      errorEl.classList.remove('hidden')
    }
    return
  }

  if (whatsapp.replace(/\D/g, '').length < 10) {
    if (errorEl) {
      errorEl.textContent = 'WhatsApp inválido. Use o formato (11) 99999-9999.'
      errorEl.classList.remove('hidden')
    }
    return
  }

  const btn = getEl('btn-submit')
  if (btn) {
    btn.disabled = true
    btn.textContent = 'Confirmando...'
  }

  const { error } = await supabaseClient.from('reservas').insert({
    presente_id:    selectedGiftId,
    nome_convidado: name,
    whatsapp:       whatsapp,
    cor_escolhida:  color,
  })

  if (btn) {
    btn.disabled = false
    btn.textContent = 'Confirmar reserva'
  }

  if (error) {
    if (errorEl) {
      errorEl.textContent = error.code === '23505'
        ? 'Ops! Esse presente acabou de ser reservado por outra pessoa.'
        : 'Erro ao confirmar. Tente novamente.'
      errorEl.classList.remove('hidden')
    }
    if (error.code !== '23505') console.error(error)
    return
  }

  getEl('reservation-form')?.classList.add('hidden')
  setText('success-message', CONFIG.confirmacao)
  getEl('reservation-success')?.classList.remove('hidden')
  markGiftAsReserved(selectedGiftId)
  setTimeout(closeModal, 4500)
}

// ── Event listeners ────────────────────────────────
function setupEventListeners() {
  getEl('presentes-grid')?.addEventListener('click', e => {
    const btn = e.target.closest('.btn-reserve')
    if (!btn) return

    const gift = CONFIG.presentes.find(g => g.id === btn.dataset.id)
    if (gift) openModal(gift, btn)
  })

  getEl('modal-close')?.addEventListener('click', closeModal)

  getEl('modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal()
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && selectedGiftId !== null) closeModal()
  })

  getEl('color-options')?.addEventListener('click', e => {
    const circle = e.target.closest('.color-circle')
    if (!circle) return

    document.querySelectorAll('.color-circle').forEach(c => {
      c.classList.remove('selected')
      c.setAttribute('aria-pressed', 'false')
    })

    circle.classList.add('selected')
    circle.setAttribute('aria-pressed', 'true')
    getEl('field-color').value = circle.dataset.color
  })

  getEl('field-whatsapp')?.addEventListener('input', e => {
    e.target.value = maskWhatsApp(e.target.value)
  })

  getEl('reservation-form')?.addEventListener('submit', e => {
    e.preventDefault()
    submitReservation()
  })

  getEl('btn-copy-pix')?.addEventListener('click', copyPixKey)
}

// ── Init ───────────────────────────────────────────
async function init() {
  renderHero()
  renderHistoria()
  renderProgramacao()
  renderPresentes()
  renderPix()
  renderFooter()
  setupEventListeners()
  await loadReservedGifts()
  subscribeToReservations()
}

init()
