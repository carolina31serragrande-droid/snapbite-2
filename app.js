/* SnapBite — app.js
   Auth, Carrinho, Cookies, Toasts, Modal
   Login local, horários de compra e envio de e-mail do pedido
*/

'use strict';

// ────────────────────────────────────────
// ESTADO GLOBAL
// ────────────────────────────────────────
const App = {
  usuario: JSON.parse(localStorage.getItem('snapbite_user') || 'null'),
  carrinho: JSON.parse(localStorage.getItem('snapbite_cart') || '[]'),
  pendingProduct: null,
  metodoPagamento: null,
  pixChaveAtual: null,
  codigoResgate: null,
};
window.App = App;

// ────────────────────────────────────────
// UTILIDADES
// ────────────────────────────────────────
function formatBRL(valor) {
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

function salvarCarrinho() {
  localStorage.setItem('snapbite_cart', JSON.stringify(App.carrinho));
}

function atualizarBadgeCarrinho() {
  const badges = document.querySelectorAll('.carrinho-badge');
  const total = App.carrinho.reduce((acc, i) => acc + i.qtd, 0);

  badges.forEach((badge) => {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ────────────────────────────────────────
// HORÁRIO DE COMPRA
// ────────────────────────────────────────
function estaNoHorarioDeCompra() {
  const agora = new Date();
  const dia = agora.getDay(); // 0 domingo, 6 sábado

  if (dia === 0 || dia === 6) return false;

  const totalMin = agora.getHours() * 60 + agora.getMinutes();

  const inicioManha = 7 * 60;        // 07:00
  const fimManha = 8 * 60 + 30;      // 08:30
  const inicioTarde = 11 * 60;       // 11:00
  const fimTarde = 12 * 60 + 90;     // 12:30

  const dentroManha = totalMin >= inicioManha && totalMin <= fimManha;
  const dentroTarde = totalMin >= inicioTarde && totalMin <= fimTarde;

  return dentroManha || dentroTarde;
}

function getMensagemHorarioCompra() {
  return 'Compras liberadas somente de 07:00 às 08:30 e de 11:00 às 12:30.';
}

function atualizarEstadoDosBotoesCompra() {
  const liberado = estaNoHorarioDeCompra();

  const botoes = document.querySelectorAll('.btn-add, .prod-add-btn, .btn-finalizar');

  botoes.forEach((btn) => {
    btn.disabled = !liberado;
    btn.style.opacity = liberado ? '1' : '0.55';
    btn.style.cursor = liberado ? 'pointer' : 'not-allowed';
    btn.title = liberado ? '' : getMensagemHorarioCompra();
  });
}

// ────────────────────────────────────────
// GERADORES
// ────────────────────────────────────────
function gerarChavePix() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const seg = (n) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  return `snp-${seg(4)}-${seg(4)}@pix.senai.br`;
}

function gerarCodigoResgate() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const seg = (n) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  return `SB-${seg(4)}-${seg(4)}`;
}

// ────────────────────────────────────────
// COPIAR
// ────────────────────────────────────────
function copiarTexto(texto, mensagemSucesso, mensagemErro) {
  if (!texto) return;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(texto)
      .then(() => showToast(mensagemSucesso, 'success'))
      .catch(() => showToast(mensagemErro, 'warning'));
    return;
  }

  const el = document.createElement('textarea');
  el.value = texto;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  showToast(mensagemSucesso, 'success');
}

function copiarChavePix() {
  copiarTexto(
    App.pixChaveAtual,
    'Chave PIX copiada! 📋',
    'Não foi possível copiar automaticamente.'
  );
}

function copiarCodigoResgate() {
  copiarTexto(
    App.codigoResgate,
    'Código copiado! 🎟️',
    'Não foi possível copiar automaticamente.'
  );
}

// ────────────────────────────────────────
// QR CODE PIX
// ────────────────────────────────────────
function renderizarQRCodePix(chave) {
  const qrEl = document.getElementById('pix-qrcode');
  if (!qrEl) return;

  qrEl.innerHTML = '';

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrEl, {
      text: chave,
      width: 160,
      height: 160,
      colorDark: '#1A0F0A',
      colorLight: '#FFF8F0',
      correctLevel: QRCode.CorrectLevel.M,
    });
    return;
  }

  const encoded = encodeURIComponent(chave);
  const img = document.createElement('img');
  img.src = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=${encoded}&choe=UTF-8`;
  img.alt = 'QR Code PIX';
  img.style.cssText =
    'border-radius:8px;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.12);';

  qrEl.appendChild(img);
}

// ────────────────────────────────────────
// TOASTS
// ────────────────────────────────────────
function showToast(msg, tipo = 'success', duracao = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `<span class="toast-icon">${icons[tipo] || '✅'}</span> ${msg}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s, transform 0.4s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    setTimeout(() => toast.remove(), 400);
  }, duracao);
}

// ────────────────────────────────────────
// MODAIS
// ────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ────────────────────────────────────────
// NAVBAR
// ────────────────────────────────────────
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach((a) => {
    if (a.getAttribute('href') === current) {
      a.classList.add('active');
    }
  });

  atualizarNavAuth();
}

function atualizarNavAuth() {
  const areaLogin = document.getElementById('nav-auth-area');
  if (!areaLogin) return;

  if (App.usuario) {
    areaLogin.innerHTML = `
      <span style="color:#aaa;font-size:0.85rem;font-weight:700;">
        Olá, <strong style="color:var(--mostarda)">${App.usuario.nome.split(' ')[0]}</strong>
      </span>
      <button onclick="logout()" class="btn-login-nav" style="border-color:var(--terracota);color:var(--terracota);">
        Sair
      </button>
    `;
    return;
  }

  areaLogin.innerHTML = `
    <button onclick="openModal('modal-login')" class="btn-login-nav">Entrar</button>
  `;
}

// ────────────────────────────────────────
// AUTENTICAÇÃO
// ────────────────────────────────────────
function mockServerAuth(tipo, dados) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuarios = JSON.parse(localStorage.getItem('snapbite_usuarios') || '[]');

      if (tipo === 'google') {
        resolve({
          nome: 'Estudante Google',
          email: 'aluno@gmail.com',
          avatar: '🧑‍🎓',
          provider: 'google',
        });
        return;
      }

      if (tipo === 'facebook') {
        resolve({
          nome: 'Estudante Facebook',
          email: 'aluno@facebook.com',
          avatar: '📘',
          provider: 'facebook',
        });
        return;
      }

      if (tipo === 'cadastro') {
        const nome = dados.nome?.trim();
        const email = dados.email?.trim().toLowerCase();
        const senha = dados.senha?.trim();

        if (!nome || !email || !senha || senha.length < 6) {
          reject('Preencha todos os campos corretamente.');
          return;
        }

        const existe = usuarios.find((u) => u.email === email);
        if (existe) {
          reject('Este e-mail já está cadastrado.');
          return;
        }

        const novoUsuario = {
          nome,
          email,
          senha,
          avatar: '🎒',
          provider: 'site',
        };

        usuarios.push(novoUsuario);
        localStorage.setItem('snapbite_usuarios', JSON.stringify(usuarios));

        resolve({
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          avatar: novoUsuario.avatar,
          provider: novoUsuario.provider,
        });
        return;
      }

      if (tipo === 'login') {
        const email = dados.email?.trim().toLowerCase();
        const senha = dados.senha?.trim();

        if (!email || !senha) {
          reject('Preencha email e senha.');
          return;
        }

        const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

        if (!usuario) {
          reject('Email ou senha inválidos.');
          return;
        }

        resolve({
          nome: usuario.nome,
          email: usuario.email,
          avatar: usuario.avatar,
          provider: usuario.provider,
        });
        return;
      }

      reject('Tipo de autenticação inválido.');
    }, 500);
  });
}

async function fazerLogin(tipo, dados = {}) {
  showToast('Conectando...', 'info', 1500);

  try {
    const user = await mockServerAuth(tipo, dados);
    App.usuario = user;
    localStorage.setItem('snapbite_user', JSON.stringify(user));
    closeModal('modal-login');
    atualizarNavAuth();
    showToast(`Bem-vindo(a), ${user.nome.split(' ')[0]}! 🎉`, 'success');

    if (App.pendingProduct) {
      const produtoPendente = App.pendingProduct;
      App.pendingProduct = null;
      adicionarAoCarrinho(produtoPendente);
    }
  } catch (erro) {
    showToast(erro || 'Erro ao fazer login. Tente novamente.', 'error');
  }
}

function logout() {
  if (App.usuario?.provider === 'google' && typeof window.logoutFirebaseReal === 'function') {
    window.logoutFirebaseReal();
    return;
  }

  App.usuario = null;
  localStorage.removeItem('snapbite_user');
  atualizarNavAuth();
  showToast('Você saiu da conta.', 'info');
}

function redefinirSenha(email, novaSenha) {
  const usuarios = JSON.parse(localStorage.getItem('snapbite_usuarios') || '[]');
  const emailLimpo = email.trim().toLowerCase();

  const index = usuarios.findIndex((u) => u.email === emailLimpo);

  if (index === -1) {
    throw new Error('E-mail não encontrado.');
  }

  usuarios[index].senha = novaSenha;
  localStorage.setItem('snapbite_usuarios', JSON.stringify(usuarios));
}

function initAuthForms() {
  document.querySelectorAll('.modal-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.tab)?.classList.add('active');
    });
  });

  document.getElementById('form-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    await fazerLogin('login', { email, senha });
  });

  document.getElementById('form-cadastro')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('cad-nome').value;
    const email = document.getElementById('cad-email').value;
    const senha = document.getElementById('cad-senha').value;

    await fazerLogin('cadastro', { nome, email, senha });
  });

  document.getElementById('btn-google')?.addEventListener('click', () => fazerLogin('google'));
  document.getElementById('btn-facebook')?.addEventListener('click', () => fazerLogin('facebook'));

  document.querySelectorAll('.modal-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal(btn.dataset.modal || 'modal-login');
    });
  });

  document.getElementById('btn-esqueceu-senha')?.addEventListener('click', () => {
    closeModal('modal-login');
    openModal('modal-esqueceu-senha');
  });

  document.getElementById('form-esqueceu-senha')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('rec-email').value.trim();
    const senha = document.getElementById('rec-senha').value.trim();
    const senha2 = document.getElementById('rec-senha2').value.trim();

    if (senha.length < 6) {
      showToast('A senha precisa ter pelo menos 6 caracteres.', 'warning');
      return;
    }

    if (senha !== senha2) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }

    try {
      redefinirSenha(email, senha);
      showToast('Senha redefinida com sucesso!', 'success');
      closeModal('modal-esqueceu-senha');
      openModal('modal-login');
    } catch (erro) {
      showToast(erro.message || 'Erro ao redefinir senha.', 'error');
    }
  });
}

// ────────────────────────────────────────
// CARRINHO
// ────────────────────────────────────────
function adicionarAoCarrinho(produto) {
  if (!estaNoHorarioDeCompra()) {
    showToast(getMensagemHorarioCompra(), 'warning', 4500);
    return;
  }

  if (!App.usuario) {
    App.pendingProduct = produto;
    showToast('⚠️ Você precisa fazer login para comprar!', 'warning', 4000);
    openModal('modal-login');
    return;
  }

  const existente = App.carrinho.find((i) => i.id === produto.id);

  if (existente) {
    existente.qtd += 1;
  } else {
    App.carrinho.push({ ...produto, qtd: 1 });
  }

  salvarCarrinho();
  atualizarBadgeCarrinho();
  renderizarCarrinho();
  showToast(`${produto.nome} adicionado ao carrinho! 🛒`, 'success');
}

function removerDoCarrinho(id) {
  App.carrinho = App.carrinho.filter((i) => i.id !== id);
  salvarCarrinho();
  renderizarCarrinho();
  atualizarBadgeCarrinho();
}

function alterarQtd(id, delta) {
  const item = App.carrinho.find((i) => i.id === id);
  if (!item) return;

  item.qtd += delta;

  if (item.qtd <= 0) {
    removerDoCarrinho(id);
    return;
  }

  salvarCarrinho();
  renderizarCarrinho();
  atualizarBadgeCarrinho();
}

function calcularTotais() {
  const subtotal = App.carrinho.reduce((acc, i) => acc + i.preco * i.qtd, 0);
  const taxa = 0;
  return { subtotal, taxa, total: subtotal + taxa };
}

function renderizarCarrinho() {
  const lista = document.getElementById('carrinho-lista');
  const subtotalEl = document.getElementById('resumo-subtotal');
  const totalEl = document.getElementById('resumo-total');
  const qtdEl = document.getElementById('resumo-qtd');

  if (!lista) return;

  if (App.carrinho.length === 0) {
    lista.innerHTML = `
      <div class="vazio">
        <div class="vazio-emoji">🛒</div>
        <h3>Carrinho vazio</h3>
        <p>Adicione seus lanches favoritos!</p>
        <a href="cardapio.html" class="btn-primary" style="margin-top:20px;display:inline-flex">Ver Cardápio</a>
      </div>
    `;
  } else {
    lista.innerHTML = App.carrinho
      .map(
        (item) => `
          <div class="c-item" data-id="${item.id}">
            <div class="c-emoji">${item.emoji}</div>
            <div class="c-info">
              <div class="c-nome">${item.nome}</div>
              <div class="c-desc">${item.desc || ''}</div>
            </div>
            <div class="c-qtd">
              <button class="qtd-b" onclick="alterarQtd('${item.id}', -1)">−</button>
              <span class="qtd-n">${item.qtd}</span>
              <button class="qtd-b" onclick="alterarQtd('${item.id}', 1)">+</button>
            </div>
            <div class="c-preco">${formatBRL(item.preco * item.qtd)}</div>
            <button class="c-rm" onclick="removerDoCarrinho('${item.id}')" title="Remover">✕</button>
          </div>
        `
      )
      .join('');
  }

  const { subtotal, total } = calcularTotais();
  const qtd = App.carrinho.reduce((acc, i) => acc + i.qtd, 0);

  if (subtotalEl) subtotalEl.textContent = formatBRL(subtotal);
  if (totalEl) totalEl.textContent = formatBRL(total);
  if (qtdEl) qtdEl.textContent = `${qtd} ${qtd === 1 ? 'item' : 'itens'}`;

  atualizarEstadoDosBotoesCompra();
}

// ────────────────────────────────────────
// E-MAIL DO PEDIDO
// ────────────────────────────────────────
async function enviarEmailPedidoConcluido(numeroPedido) {
  if (!App.usuario?.email) {
    console.warn('Usuário sem e-mail.');
    return null;
  }

  const { total } = calcularTotais();

  const payload = {
    nomeCliente: App.usuario.nome || 'Cliente',
    emailCliente: App.usuario.email,
    numeroPedido,
    itens: App.carrinho.map((item) => ({
      nome: item.nome,
      qtd: item.qtd,
      preco: item.preco,
    })),
    total,
  };

  const resposta = await fetch('https://snapbite-pxn6.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro ao enviar e-mail.');
  }

  return dados;
}

// ────────────────────────────────────────
// PAGAMENTO
// ────────────────────────────────────────
function finalizarPedido() {
  if (!estaNoHorarioDeCompra()) {
    showToast(getMensagemHorarioCompra(), 'warning', 4500);
    return;
  }

  if (!App.usuario) {
    showToast('⚠️ Você precisa fazer login!', 'warning');
    openModal('modal-login');
    return;
  }

  if (App.carrinho.length === 0) {
    showToast('Seu carrinho está vazio!', 'error');
    return;
  }

  const pillEl = document.getElementById('pag-total-pill');
  if (pillEl) {
    const { total } = calcularTotais();
    pillEl.textContent = `Total: ${formatBRL(total)}`;
  }

  document.querySelectorAll('.metodo-btn').forEach((b) => b.classList.remove('ativo'));
  document.querySelectorAll('.pag-extra').forEach((el) => {
    el.style.display = 'none';
  });

  const btnConf = document.getElementById('btn-confirmar-pag');
  if (btnConf) {
    btnConf.disabled = true;
    btnConf.textContent = 'Confirmar pagamento';
  }

  App.metodoPagamento = null;
  App.pixChaveAtual = null;

  const chaveEl = document.getElementById('pix-chave');
  const qrEl = document.getElementById('pix-qrcode');

  if (chaveEl) chaveEl.textContent = '—';
  if (qrEl) {
    qrEl.innerHTML =
      '<div style="font-size:0.8rem;color:var(--cinza-q)">Gerando QR Code...</div>';
  }

  openModal('modal-pagamento');
}

function selecionarPagamento(btn) {
  document.querySelectorAll('.metodo-btn').forEach((b) => b.classList.remove('ativo'));
  document.querySelectorAll('.pag-extra').forEach((el) => {
    el.style.display = 'none';
  });

  btn.classList.add('ativo');
  const metodo = btn.dataset.metodo;
  App.metodoPagamento = metodo;

  if (metodo === 'cartao') {
    document.getElementById('form-cartao')?.style.setProperty('display', 'block');
  } else if (metodo === 'pix') {
    const chave = gerarChavePix();
    App.pixChaveAtual = chave;

    const chaveEl = document.getElementById('pix-chave');
    if (chaveEl) chaveEl.textContent = chave;

    renderizarQRCodePix(chave);
    document.getElementById('info-pix')?.style.setProperty('display', 'block');
  } else if (metodo === 'paypal') {
    const emojiEl = document.getElementById('wallet-emoji');
    const msgEl = document.getElementById('wallet-msg');

    if (emojiEl) emojiEl.textContent = '🅿️';
    if (msgEl) {
      msgEl.textContent = 'Você será direcionado ao PayPal na retirada. Tenha sua conta pronta!';
    }

    document.getElementById('info-wallet')?.style.setProperty('display', 'block');
  } else if (metodo === 'picpay') {
    const emojiEl = document.getElementById('wallet-emoji');
    const msgEl = document.getElementById('wallet-msg');

    if (emojiEl) emojiEl.textContent = '🟢';
    if (msgEl) {
      msgEl.textContent =
        'Pague via PicPay na retirada usando o QR Code que será exibido no balcão.';
    }

    document.getElementById('info-wallet')?.style.setProperty('display', 'block');
  }

  const btnConf = document.getElementById('btn-confirmar-pag');
  if (btnConf) btnConf.disabled = false;
}

async function confirmarPagamento() {
  if (!estaNoHorarioDeCompra()) {
    showToast(getMensagemHorarioCompra(), 'warning', 4500);
    closeModal('modal-pagamento');
    return;
  }

  if (!App.metodoPagamento) {
    showToast('Selecione uma forma de pagamento.', 'warning');
    return;
  }

  const btn = document.getElementById('btn-confirmar-pag');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Processando...';
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const codigo = gerarCodigoResgate();
  App.codigoResgate = codigo;

  try {
    await enviarEmailPedidoConcluido(codigo);
    showToast('Pedido concluído! E-mail enviado 📩', 'success');
  } catch (erro) {
    console.error(erro);
    showToast('Pedido concluído, mas houve falha no envio do e-mail.', 'warning', 5000);
  }

  const codigoEl = document.getElementById('codigo-resgate');
  if (codigoEl) codigoEl.textContent = codigo;

  App.carrinho = [];
  salvarCarrinho();
  atualizarBadgeCarrinho();
  renderizarCarrinho();

  closeModal('modal-pagamento');
  setTimeout(() => openModal('modal-sucesso'), 250);

  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Confirmar pagamento';
  }
}

// ────────────────────────────────────────
// COOKIES
// ────────────────────────────────────────
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const aceito = localStorage.getItem('snapbite_cookies');
  if (aceito) {
    banner.classList.add('hidden');
    return;
  }

  document.getElementById('btn-aceitar-cookies')?.addEventListener('click', () => {
    localStorage.setItem('snapbite_cookies', 'aceito');
    banner.classList.add('hidden');
    showToast('Cookies aceitos! Obrigado 🍪', 'success', 2500);
  });

  document.getElementById('btn-recusar-cookies')?.addEventListener('click', () => {
    localStorage.setItem('snapbite_cookies', 'recusado');
    banner.classList.add('hidden');
  });
}

// ────────────────────────────────────────
// COUNTDOWN DE PROMOÇÕES
// ────────────────────────────────────────
function initCountdown() {
  const el = document.getElementById('promo-countdown');
  if (!el) return;

  const target = new Date();
  target.setHours(target.getHours() + 6, 30, 0, 0);

  function atualizar() {
    const agora = new Date();
    const diff = Math.max(0, target - agora);

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const hEl = document.getElementById('cd-horas');
    const mEl = document.getElementById('cd-min');
    const sEl = document.getElementById('cd-seg');

    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }

  atualizar();
  setInterval(atualizar, 1000);
}

// ────────────────────────────────────────
// FILTROS DO CARDÁPIO
// ────────────────────────────────────────
function initFiltros() {
  const btns = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.prod-card');

  if (!btns.length || !cards.length) return;

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filtro = btn.dataset.filtro;

      cards.forEach((card) => {
        if (filtro === 'todos' || card.dataset.categoria === filtro) {
          card.style.display = '';
          card.style.animation = 'fadeInCard 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const buscaInput = document.getElementById('busca-cardapio');
  if (buscaInput) {
    buscaInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();

      cards.forEach((card) => {
        const nome = card.querySelector('.prod-nome')?.textContent.toLowerCase() || '';
        card.style.display = nome.includes(q) ? '' : 'none';
      });
    });
  }
}

// ────────────────────────────────────────
// FORMULÁRIO DE CONTATO
// ────────────────────────────────────────
function initContato() {
  const form = document.getElementById('form-contato');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Mensagem enviada com sucesso! Em breve retornaremos. 📬', 'success', 4000);
    form.reset();
  });
}

// ────────────────────────────────────────
// INIT GERAL
// ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAuthForms();
  initCookieBanner();
  initCountdown();
  initFiltros();
  initContato();
  atualizarBadgeCarrinho();
  atualizarEstadoDosBotoesCompra();

  setInterval(atualizarEstadoDosBotoesCompra, 30000);

  if (document.getElementById('carrinho-lista')) {
    renderizarCarrinho();
  }
});

// ────────────────────────────────────────
// EXPOR FUNÇÕES GLOBAIS
// ────────────────────────────────────────
window.removerDoCarrinho = removerDoCarrinho;
window.alterarQtd = alterarQtd;
window.finalizarPedido = finalizarPedido;
window.selecionarPagamento = selecionarPagamento;
window.confirmarPagamento = confirmarPagamento;
window.openModal = openModal;
window.closeModal = closeModal;
window.logout = logout;
window.showToast = showToast;
window.copiarChavePix = copiarChavePix;
window.copiarCodigoResgate = copiarCodigoResgate;
window.atualizarNavAuth = atualizarNavAuth;
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.location.href = `pedido-confirmado.html?id=${docRef.id}`;