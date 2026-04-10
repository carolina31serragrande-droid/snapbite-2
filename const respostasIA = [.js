const respostasIA = [
    {
      chaves: ['mais pedido', 'lanche mais pedido', 'mais vendido'],
      resposta: 'O campeão de pedidos é o SnapBurguer Clássico. Ele é uma ótima escolha se você quer algo certeiro, saboroso e rápido.'
    },
    {
      chaves: ['combo barato', 'barato', 'mais barato', 'econômico', 'economico'],
      resposta: 'Uma boa opção econômica é montar um combo com lanche clássico + bebida. Fica equilibrado, gostoso e com preço mais leve.'
    },
    {
      chaves: ['bebida', 'bebidas', 'combina com hamburguer', 'combina com hambúrguer'],
      resposta: 'Pra combinar com hambúrguer, as opções que costumam funcionar melhor são refrigerante, suco gelado ou chá.'
    },
    {
      chaves: ['horário', 'horarios', 'horários', 'funcionamento', 'compras'],
      resposta: 'As compras ficam liberadas somente de 07:00 às 08:30 e de 11:00 às 12:30. Fora disso, os botões de compra ficam bloqueados.'
    },
    {
      chaves: ['sobremesa', 'doce'],
      resposta: 'Se quiser fechar bem o pedido, uma sobremesa leve depois do combo pode ser uma ótima escolha.'
    }
  ];
  
  let ultimaRespostaIA = 'Oi! Eu sou a IA do SnapBite. Posso te ajudar a escolher um lanche, sugerir combos ou tirar dúvidas sobre horários e pedidos.';
  
  function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }
  
  function criarMensagem(tipo, texto) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;
  
    const msg = document.createElement('div');
    msg.className = `msg ${tipo === 'user' ? 'msg-user' : 'msg-ia'}`;
  
    msg.innerHTML = `
      <div class="msg-avatar">${tipo === 'user' ? '🧑' : '🤖'}</div>
      <div class="msg-bubble">${escaparHTML(texto)}</div>
    `;
  
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  function ehPedidoDeRepeticao(texto) {
    const frases = [
      'não entendi',
      'nao entendi',
      'pode repetir',
      'repete',
      'repita',
      'como assim',
      'explica melhor',
      'explique melhor',
      'não saquei',
      'nao saquei',
      'não ficou claro',
      'nao ficou claro'
    ];
  
    return frases.some(frase => texto.includes(frase));
  }
  
  function ehPedidoDeResumo(texto) {
    const frases = [
      'resume',
      'resumir',
      'resumo',
      'mais curto',
      'simplifica',
      'simplifique'
    ];
  
    return frases.some(frase => texto.includes(frase));
  }
  
  function responderRepeticao() {
    return `Claro! Vou repetir de outro jeito:\n\n${ultimaRespostaIA}`;
  }
  
  function responderResumo() {
    return 'Resumo rápido: posso te ajudar com sugestões de lanches, combos, bebidas e horários de compra.';
  }
  
  function gerarRespostaIA(texto) {
    const textoLimpo = texto.toLowerCase().trim();
  
    if (ehPedidoDeRepeticao(textoLimpo)) {
      return responderRepeticao();
    }
  
    if (ehPedidoDeResumo(textoLimpo)) {
      return responderResumo();
    }
  
    const encontrada = respostasIA.find(item =>
      item.chaves.some(chave => textoLimpo.includes(chave))
    );
  
    if (encontrada) {
      return encontrada.resposta;
    }
  
    return 'Não entendi muito bem o que você quis dizer. Tenta perguntar sobre lanches, combos, bebidas, sobremesas ou horários de compra.';
  }
  
  function responderIA(texto) {
    criarMensagem('user', texto);
  
    setTimeout(() => {
      const resposta = gerarRespostaIA(texto);
      ultimaRespostaIA = resposta;
      criarMensagem('ia', resposta);
    }, 500);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ia-form');
    const input = document.getElementById('ia-input');
    const sugestoes = document.querySelectorAll('.sugestao-btn');
  
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const texto = input.value.trim();
      if (!texto) return;
  
      responderIA(texto);
      input.value = '';
      input.focus();
    });
  
    sugestoes.forEach(btn => {
      btn.addEventListener('click', () => {
        const texto = btn.dataset.msg;
        responderIA(texto);
      });
    });
  });