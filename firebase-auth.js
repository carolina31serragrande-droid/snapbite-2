import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

// ─────────────────────────────────────────────────────
//  🔑  SUBSTITUA os valores abaixo pelas credenciais
//  do seu projeto Firebase real (console.firebase.google.com)
//
//  PASSOS para ativar o Google Login:
//  1. Acesse https://console.firebase.google.com
//  2. Selecione (ou crie) seu projeto
//  3. Authentication → Sign-in method → Ative "Google"
//  4. Authentication → Settings → Authorized domains →
//     adicione o domínio do seu site (ex: seliga.jovem)
//  5. Copie as credenciais do projeto (Project settings → General)
//     e cole no objeto abaixo.
// ─────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyCPQuK79XDc8B5bgr8tVSUwcLkSHlVJU6c",
  authDomain:        "snapbite-85943.firebaseapp.com",
  projectId:         "snapbite-85943",
  storageBucket:     "snapbite-85943.firebasestorage.app",
  messagingSenderId: "839470161933",
  appId:             "1:839470161933:web:fc3fe935406a2406e13544",
  measurementId:     "G-CXMLLXPZLP"
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

// Persistência local: login sobrevive a fechar o browser
setPersistence(auth, browserLocalPersistence).catch(console.error);

// ─────────────────────────────────────────────────────
// Helpers: dados extras (telefone, termos) no localStorage
// ─────────────────────────────────────────────────────
function getCadastroExtra(uid) {
  const extras = JSON.parse(localStorage.getItem('snapbite_auth_extras') || '{}');
  return extras[uid] || null;
}

function salvarCadastroExtra(uid, dados) {
  const extras = JSON.parse(localStorage.getItem('snapbite_auth_extras') || '{}');
  extras[uid] = dados;
  localStorage.setItem('snapbite_auth_extras', JSON.stringify(extras));
}

// ─────────────────────────────────────────────────────
// Sincroniza usuário Firebase → App.usuario + localStorage
// ─────────────────────────────────────────────────────
function syncUsuarioFirebase(user) {
  if (!user) return null;

  const extra = getCadastroExtra(user.uid);

  const usuario = {
    uid:             user.uid,
    nome:            user.displayName || 'Usuário',
    email:           user.email || '',
    foto:            user.photoURL || '',
    provider:        'google',
    telefone:        extra?.telefone || '',
    aceitouTermos:   !!extra?.aceitouTermos,
    cadastroCompleto: !!(extra?.telefone && extra?.aceitouTermos)
  };

  localStorage.setItem('snapbite_user', JSON.stringify(usuario));

  if (window.App) window.App.usuario = usuario;

  if (typeof window.atualizarNavAuth === 'function') {
    window.atualizarNavAuth();
  }

  // Dispara evento global — welcome.html escuta para redirecionar
  window.dispatchEvent(new CustomEvent('snapbite:login', { detail: usuario }));

  return usuario;
}

// ─────────────────────────────────────────────────────
// Abre modal para completar cadastro (telefone + termos)
// ─────────────────────────────────────────────────────
function abrirModalCompletarCadastro() {
  window.closeModal?.('modal-login');
  window.openModal?.('modal-completar-cadastro');
}

// ─────────────────────────────────────────────────────
// Login com Google (popup)
// ─────────────────────────────────────────────────────
async function loginComGoogleReal() {
  try {
    const result  = await signInWithPopup(auth, provider);
    const user    = result.user;
    const usuario = syncUsuarioFirebase(user);

    if (!usuario.cadastroCompleto) {
      // Preenche campos do modal de completar cadastro
      const nomeEl  = document.getElementById('extra-nome');
      const emailEl = document.getElementById('extra-email');
      const telEl   = document.getElementById('extra-telefone');
      const termEl  = document.getElementById('extra-termos');

      if (nomeEl)  nomeEl.value  = usuario.nome   || '';
      if (emailEl) emailEl.value = usuario.email  || '';
      if (telEl)   telEl.value   = usuario.telefone || '';
      if (termEl)  termEl.checked = !!usuario.aceitouTermos;

      abrirModalCompletarCadastro();
    } else {
      window.closeModal?.('modal-login');
      window.showToast?.(`Bem-vindo(a), ${usuario.nome.split(' ')[0]}! 🎉`, 'success');

      // Se tinha produto pendente, adiciona ao carrinho
      if (window.App?.pendingProduct && typeof window.adicionarAoCarrinho === 'function') {
        const produto = window.App.pendingProduct;
        window.App.pendingProduct = null;
        window.adicionarAoCarrinho(produto);
      }

      // Redireciona da welcome.html para o home
      _redirecionarSeWelcome();
    }
  } catch (error) {
    console.error('Firebase Google Auth error:', error);
    window.showToast?.('Não foi possível entrar com Google.', 'error');
  }
}

// ─────────────────────────────────────────────────────
// Se o usuário estiver na welcome.html, redireciona
// ─────────────────────────────────────────────────────
function _redirecionarSeWelcome() {
  if (window.location.pathname.endsWith('welcome.html') ||
      window.location.pathname === '/' ||
      window.location.pathname === '') {

    const usuario = JSON.parse(localStorage.getItem('snapbite_user') || 'null');
    if (usuario?.cadastroCompleto) {
      window.location.replace('index.html');
    }
  }
}

// ─────────────────────────────────────────────────────
// Completar cadastro (telefone + termos)
// ─────────────────────────────────────────────────────
function initCadastroExtra() {
  const form = document.getElementById('form-completar-cadastro');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    if (!currentUser) {
      window.showToast?.('Sessão não encontrada. Tente entrar novamente.', 'error');
      return;
    }

    const telefone    = document.getElementById('extra-telefone')?.value.trim();
    const aceitouTermos = document.getElementById('extra-termos')?.checked;

    if (!telefone) {
      window.showToast?.('Digite seu telefone.', 'warning');
      return;
    }
    if (!aceitouTermos) {
      window.showToast?.('Você precisa aceitar os termos.', 'warning');
      return;
    }

    salvarCadastroExtra(currentUser.uid, { telefone, aceitouTermos: true });

    const usuario = syncUsuarioFirebase(currentUser);

    window.closeModal?.('modal-completar-cadastro');
    window.showToast?.(`Conta concluída, ${usuario.nome.split(' ')[0]}! ✅`, 'success');

    if (window.App?.pendingProduct && typeof window.adicionarAoCarrinho === 'function') {
      const produto = window.App.pendingProduct;
      window.App.pendingProduct = null;
      window.adicionarAoCarrinho(produto);
    }

    // Redireciona da welcome.html para o home
    _redirecionarSeWelcome();
  });
}

// ─────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────
function logoutFirebaseReal() {
  signOut(auth).catch(console.error);
  localStorage.removeItem('snapbite_user');

  if (window.App) window.App.usuario = null;

  window.atualizarNavAuth?.();
  window.showToast?.('Você saiu da conta.', 'info');
}

// ─────────────────────────────────────────────────────
// Observer de estado de autenticação
// ─────────────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user) {
    const usuario = syncUsuarioFirebase(user);
    if (usuario.cadastroCompleto) {
      window.closeModal?.('modal-login');
      window.closeModal?.('modal-completar-cadastro');
    }
  } else {
    localStorage.removeItem('snapbite_user');
    if (window.App) window.App.usuario = null;
    window.atualizarNavAuth?.();
  }
});

// Expõe globalmente para os botões do HTML chamarem
window.loginComGoogleReal  = loginComGoogleReal;
window.logoutFirebaseReal  = logoutFirebaseReal;

document.addEventListener('DOMContentLoaded', () => {
  initCadastroExtra();
});
