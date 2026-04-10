import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { gerarHtmlEmailPedido } from './emailTemplate.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY não foi definida no arquivo .env');
}

if (!process.env.EMAIL_FROM) {
  throw new Error('EMAIL_FROM não foi definido no arquivo .env');
}

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());

function validarPedido(body) {
  const { nomeCliente, emailCliente, numeroPedido, itens, total } = body;

  if (!nomeCliente || !emailCliente || !numeroPedido) {
    return 'Dados principais do pedido estão faltando.';
  }

  if (!Array.isArray(itens) || itens.length === 0) {
    return 'O pedido precisa ter pelo menos 1 item.';
  }

  if (typeof total !== 'number' || Number.isNaN(total)) {
    return 'O total do pedido é inválido.';
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValido.test(emailCliente)) {
    return 'O e-mail do cliente é inválido.';
  }

  for (const item of itens) {
    if (
      !item ||
      typeof item.nome !== 'string' ||
      typeof item.qtd !== 'number' ||
      typeof item.preco !== 'number'
    ) {
      return 'Há itens inválidos no pedido.';
    }
  }

  return null;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Servidor do SnapBite online.' });
});

app.post('/api/enviar-email-pedido', async (req, res) => {
  try {
    const erroValidacao = validarPedido(req.body);

    if (erroValidacao) {
      return res.status(400).json({ ok: false, erro: erroValidacao });
    }

    const { nomeCliente, emailCliente, numeroPedido, itens, total } = req.body;

    const html = gerarHtmlEmailPedido({
      nomeCliente,
      numeroPedido,
      itens,
      total,
      imagemLoja: 'img/sua-imagem-aqui.png',
    });

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [emailCliente],
      subject: `Seu pedido ${numeroPedido} foi concluído com sucesso!`,
      html,
    });

    if (error) {
      console.error('Erro Resend:', error);
      return res.status(500).json({
        ok: false,
        erro: 'Falha ao enviar o e-mail.',
      });
    }

    return res.json({
      ok: true,
      messageId: data?.id || null,
    });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({
      ok: false,
      erro: 'Erro interno no servidor.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});