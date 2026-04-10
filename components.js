(function () {
  /* Carrega biblioteca QRCode dinamicamente */
  const qrScript = document.createElement('script');
  qrScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  document.head.appendChild(qrScript);

  /* ── NAVBAR ── */
  document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a href="index.html" class="navbar-logo">Snap<em>Bite</em></a>

        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>

        <ul class="navbar-links" id="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="cardapio.html">Cardápio</a></li>
          <li><a href="promocoes.html">Promoções</a></li>
          <li><a href="sobre.html">Sobre Nós</a></li>
          <li><a href="contato.html">Contato</a></li>
          <li><a href="IA.html">IA</a></li>
        </ul>

        <div class="navbar-actions">
          <div id="nav-auth-area"></div>
          <a href="carrinho.html">
            <button class="btn-carrinho" type="button">
              🛒 Carrinho
              <span class="carrinho-badge" style="display:none">0</span>
            </button>
          </a>
        </div>
      </div>
    </nav>
  `
  );

  /* ── FOOTER ── */
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <footer class="footer">
      <div class="footer-main">
        <div class="footer-brand">
          <span class="footer-logo">Snap<em>Bite</em></span>
          <p>A lanchonete do SENAI feita por alunos pra alunos. Rápido, gostoso e do jeito que a galera gosta.</p>

          <div class="footer-socials">
            <div class="soc ig" title="Instagram">📸</div>
            <div class="soc tw" title="Twitter">🐦</div>
            <div class="soc wa" title="WhatsApp">💬</div>
          </div>
        </div>

        <div class="footer-col">
          <h4>Páginas</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="cardapio.html">Cardápio</a></li>
            <li><a href="promocoes.html">Promoções</a></li>
            <li><a href="sobre.html">Sobre Nós</a></li>
            <li><a href="contato.html">Contato</a></li>
            <li><a href="carrinho.html">Carrinho</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Categorias</h4>
          <ul>
            <li><a href="cardapio.html">Lanches</a></li>
            <li><a href="cardapio.html">Combos</a></li>
            <li><a href="cardapio.html">Bebidas</a></li>
            <li><a href="cardapio.html">Sobremesas</a></li>
            <li><a href="promocoes.html">Promoções do Dia</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Funcionamento</h4>
          <div class="horario-row">
            <span class="dia">Seg – Sex (Manhã)</span>
            <span class="hr">07:00 – 08:30</span>
          </div>
          <div class="horario-row">
            <span class="dia">Seg – Sex (Tarde)</span>
            <span class="hr">11:00 – 12:30</span>
          </div>
          <div class="horario-row off">
            <span class="dia">Sábado e Domingo</span>
            <span class="hr">Fechado</span>
          </div>
          <p style="margin-top:16px;font-size:0.8rem;color:#4A3E38;line-height:1.6">
            📍 SENAI · Bloco da Lanchonete<br>
            Retirada no balcão no intervalo
          </p>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <span>© 2026 SnapBite — Todos os direitos reservados</span>
        <div style="display:flex;gap:20px;flex-wrap:wrap">
          <a href="termos.html">Termos de Uso</a>
          <a href="termos.html#privacidade">Privacidade</a>
          <a href="termos.html#cookies">Cookies</a>
        </div>
        <span>Feito com ❤️ por estudantes do SENAI</span>
      </div>
    </footer>
  `
  );

  /* ── MODAL LOGIN ── */
  document.body.insertAdjacentHTML(
    'beforeend',
    `

    <div class="modal-overlay" id="modal-completar-cadastro">
  <div class="modal-box">
    <button class="modal-close" data-modal="modal-completar-cadastro" type="button">✕</button>
    <h2>Complete seu cadastro</h2>
    <p class="modal-sub">Só falta confirmar seu telefone e aceitar os termos.</p>

    <form id="form-completar-cadastro">
      <div class="form-group">
        <label for="extra-nome">Nome</label>
        <input type="text" id="extra-nome" readonly>
      </div>

      <div class="form-group">
        <label for="extra-email">E-mail</label>
        <input type="email" id="extra-email" readonly>
      </div>

      <div class="form-group">
        <label for="extra-telefone">Telefone</label>
        <input type="tel" id="extra-telefone" placeholder="(11) 99999-9999" required>
      </div>

      <div class="form-group" style="display:flex;gap:10px;align-items:flex-start;">
        <input type="checkbox" id="extra-termos" style="margin-top:4px;">
        <label for="extra-termos" style="line-height:1.6;">
          Li e concordo com os <a href="termos.html" target="_blank">Termos de Uso</a>.
        </label>
      </div>

      <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">
        Concluir cadastro
      </button>
    </form>
  </div>
</div>

    <div class="modal-overlay" id="modal-login">
      <div class="modal-box">
        <button class="modal-close" data-modal="modal-login" type="button">✕</button>
        <h2>Boas-vindas!</h2>
        <p class="modal-sub">Entre na sua conta para adicionar itens e finalizar seu pedido.</p>

        <div class="modal-tabs">
          <button class="modal-tab active" data-tab="tab-login" type="button">Entrar</button>
          <button class="modal-tab" data-tab="tab-cadastro" type="button">Criar conta</button>
        </div>

        <div class="social-btns">
           <button class="btn-soc" id="btn-google" type="button" onclick="loginComGoogleReal()">
            <img src="https://www.google.com/favicon.ico" alt="Google">
           Continuar com Google
           </button>

          <button class="btn-soc" id="btn-facebook" type="button">
            <img src="https://www.facebook.com/favicon.ico" alt="Facebook">
            Continuar com Facebook
          </button>
        </div>

        <div class="divider">ou use seu e-mail</div>

        <div class="tab-content active" id="tab-login">
          <form id="form-login">
            <div class="form-group">
              <label for="login-email">E-mail</label>
              <input type="email" id="login-email" placeholder="seu@email.com" required>
            </div>

            <div class="form-group">
              <label for="login-senha">Senha</label>
              <input type="password" id="login-senha" placeholder="••••••" required minlength="6">
            </div>

            <button type="submit" class="btn-primary" style="width:100%;justify-content:center;margin-top:8px">
              Entrar
            </button>

            <p style="margin-top:10px;text-align:right;">
              <button
                type="button"
                id="btn-esqueceu-senha"
                style="background:none;border:none;color:var(--mostarda);cursor:pointer;font-weight:600;"
              >
                Esqueci a senha
              </button>
            </p>
          </form>
        </div>

        <div class="tab-content" id="tab-cadastro">
          <form id="form-cadastro">
            <div class="form-group">
              <label for="cad-nome">Nome completo</label>
              <input type="text" id="cad-nome" placeholder="Seu nome" required>
            </div>

            <div class="form-group">
              <label for="cad-email">E-mail</label>
              <input type="email" id="cad-email" placeholder="seu@email.com" required>
            </div>

            <div class="form-group">
              <label for="cad-senha">Senha</label>
              <input type="password" id="cad-senha" placeholder="Mín. 6 caracteres" required minlength="6">
            </div>

            <button type="submit" class="btn-primary" style="width:100%;justify-content:center;margin-top:8px">
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  `
  );

  /* ── MODAL RECUPERAR SENHA ── */
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="modal-overlay" id="modal-esqueceu-senha">
      <div class="modal-box">
        <button class="modal-close" data-modal="modal-esqueceu-senha" type="button">✕</button>
        <h2>Recuperar senha</h2>
        <p class="modal-sub">Digite seu e-mail e escolha uma nova senha.</p>

        <form id="form-esqueceu-senha">
          <div class="form-group">
            <label for="rec-email">E-mail</label>
            <input type="email" id="rec-email" required>
          </div>

          <div class="form-group">
            <label for="rec-senha">Nova senha</label>
            <input type="password" id="rec-senha" required minlength="6">
          </div>

          <div class="form-group">
            <label for="rec-senha2">Confirmar senha</label>
            <input type="password" id="rec-senha2" required minlength="6">
          </div>

          <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">
            Redefinir senha
          </button>
        </form>
      </div>
    </div>
  `
  );

  /* ── MODAL SUCESSO ── */
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="modal-overlay modal-sucesso" id="modal-sucesso">
      <div class="modal-box" style="text-align:center">
        <button class="modal-close" data-modal="modal-sucesso" type="button">✕</button>
        <div class="sucesso-icon">🎉</div>
        <h2>Pedido confirmado!</h2>

        <div class="msg-compra">
          ✅ Compra finalizada com sucesso!<br><br>
          Seu lanche estará disponível no SENAI na hora do seu intervalo.
        </div>

        <div
          style="
            background: var(--creme);
            border: 2px dashed var(--mostarda);
            border-radius: var(--radius);
            padding: 20px 24px;
            margin: 20px 0;
          "
        >
          <div style="font-size:0.72rem;font-weight:700;color:var(--cinza-q);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">
            🎟️ Código de Retirada
          </div>

          <div
            id="codigo-resgate"
            style="
              font-family: 'DM Mono', 'Courier New', monospace;
              font-size: 1.7rem;
              font-weight: 900;
              color: var(--vinho);
              letter-spacing: 4px;
              margin-bottom: 8px;
            "
          >
            —
          </div>

          <div style="font-size:0.78rem;color:var(--cinza-q);line-height:1.6">
            Apresente este código no balcão para retirar seu pedido.<br>
            <strong>Tire um print!</strong> Ele não será exibido novamente.
          </div>

          <button
            onclick="copiarCodigoResgate()"
            type="button"
            style="
              margin-top:12px;
              background: var(--mostarda);
              border: none;
              border-radius: 6px;
              padding: 8px 20px;
              font-weight: 700;
              font-size: 0.82rem;
              cursor: pointer;
              color: var(--preto-mid);
            "
          >
            📋 Copiar código
          </button>
        </div>

        <p style="color:var(--cinza-q);font-size:0.85rem;margin-bottom:22px">
          🏫 Retirada no balcão do SENAI · Bloco da Lanchonete
        </p>

        <button class="btn-primary" onclick="closeModal('modal-sucesso')" type="button" style="margin:0 auto">
          Fazer novo pedido
        </button>
      </div>
    </div>
  `
  );

  /* ── MODAL PAGAMENTO ── */
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="modal-overlay" id="modal-pagamento">
      <div class="modal-box pagamento-box">
        <button class="modal-close" data-modal="modal-pagamento" type="button">✕</button>
        <h2>Como você quer pagar?</h2>
        <p class="modal-sub">Escolha a forma. O pagamento é feito na retirada do pedido.</p>

        <div class="pag-total-pill" id="pag-total-pill">Total: R$ 0,00</div>

        <div class="metodos-grid">
          <button class="metodo-btn" data-metodo="pix" onclick="selecionarPagamento(this)" type="button">
            <span class="metodo-icon">🟩</span>
            <div class="metodo-info">
              <span class="metodo-nome">PIX</span>
              <span class="metodo-desc">Instantâneo · Sem taxa</span>
            </div>
            <span class="metodo-check">✓</span>
          </button>

          <button class="metodo-btn" data-metodo="cartao" onclick="selecionarPagamento(this)" type="button">
            <span class="metodo-icon">💳</span>
            <div class="metodo-info">
              <span class="metodo-nome">Cartão</span>
              <span class="metodo-desc">Débito ou crédito</span>
            </div>
            <span class="metodo-check">✓</span>
          </button>

          <button class="metodo-btn" data-metodo="paypal" onclick="selecionarPagamento(this)" type="button">
            <span class="metodo-icon">🅿️</span>
            <div class="metodo-info">
              <span class="metodo-nome">PayPal</span>
              <span class="metodo-desc">Conta PayPal</span>
            </div>
            <span class="metodo-check">✓</span>
          </button>

          <button class="metodo-btn" data-metodo="picpay" onclick="selecionarPagamento(this)" type="button">
            <span class="metodo-icon">🟢</span>
            <div class="metodo-info">
              <span class="metodo-nome">PicPay</span>
              <span class="metodo-desc">Carteira digital</span>
            </div>
            <span class="metodo-check">✓</span>
          </button>
        </div>

        <div id="form-cartao" class="pag-extra" style="display:none">
          <div class="form-group">
            <label>Número do cartão</label>
            <input type="text" placeholder="0000 0000 0000 0000" maxlength="19">
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label>Validade</label>
              <input type="text" placeholder="MM/AA" maxlength="5">
            </div>

            <div class="form-group">
              <label>CVV</label>
              <input type="text" placeholder="123" maxlength="3">
            </div>
          </div>

          <div class="form-group">
            <label>Nome no cartão</label>
            <input type="text" placeholder="Como está no cartão">
          </div>

          <div class="form-group">
            <label>Parcelas</label>
            <select style="width:100%;padding:11px 14px;border:1.5px solid var(--cinza-borda);border-radius:var(--radius-sm);font-size:0.9rem;background:#fff;outline:none;color:var(--preto-q)">
              <option>1x sem juros</option>
              <option>2x sem juros</option>
              <option>3x sem juros</option>
            </select>
          </div>
        </div>

        <div id="info-pix" class="pag-extra" style="display:none">
          <div style="background:var(--creme-esc);border-radius:var(--radius-sm);padding:20px;text-align:center">
            <div style="font-size:0.78rem;font-weight:700;color:var(--cinza-q);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px">
              QR Code PIX
            </div>

            <div
              id="pix-qrcode"
              style="
                display:flex;
                justify-content:center;
                align-items:center;
                margin-bottom:16px;
                min-height:160px;
              "
            >
              <div style="font-size:0.8rem;color:var(--cinza-q)">Gerando QR Code...</div>
            </div>

            <div style="font-size:0.72rem;font-weight:700;color:var(--cinza-q);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">
              Chave PIX
            </div>

            <div
              id="pix-chave"
              style="
                font-family:'DM Mono', 'Courier New', monospace;
                font-size:0.82rem;
                color:var(--preto-q);
                background:#fff;
                padding:10px 14px;
                border-radius:var(--radius-sm);
                border:1.5px solid var(--cinza-borda);
                word-break:break-all;
                line-height:1.5;
              "
            >
              —
            </div>

            <button
              onclick="copiarChavePix()"
              type="button"
              style="
                margin-top:12px;
                background:var(--mostarda);
                border:none;
                border-radius:6px;
                padding:8px 20px;
                font-weight:700;
                font-size:0.82rem;
                cursor:pointer;
                color:var(--preto-mid);
              "
            >
              📋 Copiar chave
            </button>

            <p style="font-size:0.78rem;color:var(--cinza-q);margin-top:12px;line-height:1.6">
              Escaneie o QR Code ou copie a chave PIX.<br>
              Após pagar, clique em <strong>Confirmar pagamento</strong>.
            </p>
          </div>
        </div>

        <div id="info-wallet" class="pag-extra" style="display:none">
          <div style="background:var(--creme-esc);border-radius:var(--radius-sm);padding:20px;text-align:center">
            <div style="font-size:2.2rem;margin-bottom:8px" id="wallet-emoji">💳</div>
            <p style="font-size:0.88rem;color:var(--cinza-q);line-height:1.6" id="wallet-msg">
              O pagamento será processado na retirada no balcão do SENAI.
            </p>
          </div>
        </div>

        <button class="btn-confirmar-pag" id="btn-confirmar-pag" onclick="confirmarPagamento()" type="button" disabled>
          Confirmar pagamento
        </button>
      </div>
    </div>
  `
  );

  /* ── COOKIE ── */
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="cookie-banner" id="cookie-banner">
      <div class="cookie-inner">
        <p class="cookie-text">
          Usamos cookies para melhorar sua experiência — carrinho, sessão e preferências.
          Ao continuar, você concorda com nossa
          <a href="termos.html#cookies">Política de Cookies</a>
          e
          <a href="termos.html">Termos de Uso</a>.
        </p>

        <div class="cookie-btns">
          <button class="btn-ck-no" id="btn-recusar-cookies" type="button">Recusar</button>
          <button class="btn-ck-ok" id="btn-aceitar-cookies" type="button">Aceitar</button>
        </div>
      </div>
    </div>
  `
  );

  /* ── TOAST CONTAINER ── */
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="toast-container" id="toast-container"></div>`
  );
})();