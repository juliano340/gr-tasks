# 🔧 Guia de Configuração do Stripe

## Passo 1: Criar Conta no Stripe

1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Ative o **Modo de Teste** (toggle no canto superior direito)

## Passo 2: Criar Produto Premium

1. No dashboard do Stripe, vá em **Produtos** → **Adicionar produto**
2. Preencha:
   - **Nome**: Premium
   - **Descrição**: Plano Premium - Até 50 tasks
   - **Preço**: R$ 9,90 (ou o valor que preferir)
   - **Tipo de cobrança**: Recorrente
   - **Período**: Mensal
3. Clique em **Salvar produto**
4. **Copie o Price ID** (começa com `price_...`)

## Passo 3: Obter Chaves API

### Chave Secreta (Secret Key)
1. Vá em **Desenvolvedores** → **Chaves de API**
2. Copie a **Chave secreta** (começa com `sk_test_...`)

### Chave Publicável (Publishable Key)
1. Na mesma página, copie a **Chave publicável** (começa com `pk_test_...`)

## Passo 4: Configurar Webhook

1. Vá em **Desenvolvedores** → **Webhooks**
2. Clique em **Adicionar endpoint**
3. **URL do endpoint**: `http://localhost:3000/api/webhooks/stripe`
   - Para produção, use sua URL real (ex: `https://seudominio.com/api/webhooks/stripe`)
4. **Eventos para escutar**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Clique em **Adicionar endpoint**
6. **Copie o Signing secret** (começa com `whsec_...`)

## Passo 5: Atualizar .env

Edite o arquivo `.env` e adicione as chaves:

\`\`\`env
STRIPE_SECRET_KEY=sk_test_sua-chave-aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave-aqui
STRIPE_WEBHOOK_SECRET=whsec_sua-webhook-secret-aqui
STRIPE_PREMIUM_PRICE_ID=price_sua-price-id-aqui
\`\`\`

## Passo 6: Testar Localmente com Stripe CLI (Opcional)

Para testar webhooks localmente:

\`\`\`bash
# Instalar Stripe CLI
# Windows: https://github.com/stripe/stripe-cli/releases

# Login
stripe login

# Encaminhar webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
\`\`\`

## Passo 7: Testar Pagamento

1. Acesse `/dashboard/upgrade`
2. Clique em **Assinar Agora**
3. Use cartão de teste: `4242 4242 4242 4242`
   - Data: Qualquer data futura
   - CVC: Qualquer 3 dígitos
   - CEP: Qualquer

## Cartões de Teste do Stripe

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

## Produção

Quando for para produção:
1. Desative o **Modo de Teste**
2. Crie um novo produto (ou use o mesmo)
3. Atualize as chaves no `.env` para as chaves de produção
4. Configure o webhook com a URL de produção
5. Ative sua conta Stripe (verificação de identidade)
