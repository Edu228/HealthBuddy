# Guia Simplificado - Deploy HealthBuddy na Vercel

## Método Mais Fácil (Recomendado)

### Passo 1: Acesse Vercel
1. Abra https://vercel.com
2. Clique em **"Sign Up"** (canto superior direito)
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seu GitHub

### Passo 2: Importe seu Projeto
1. Após fazer login, clique em **"Add New"** → **"Project"**
2. Procure pelo repositório **"Noah122021"**
3. Clique em **"Import"**

### Passo 3: Configure as Variáveis de Ambiente
Quando Vercel pedir para configurar variáveis, adicione estas:

```
DATABASE_URL=mysql://seu_usuario:sua_senha@seu_host/healthbuddy
JWT_SECRET=afK/s3TufOV7fcslPYOr889ng5TxQtqEYIgyqVPJNwA=
STRIPE_SECRET_KEY=sua_chave_stripe_aqui
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
VITE_APP_TITLE=HealthBuddy
VITE_APP_LOGO=https://seu-logo-url.png
```

### Passo 4: Deploy
1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. Você receberá uma URL tipo: `https://noah122021.vercel.app`

## Se Tiver Dúvidas

- **Não consegue fazer login?** Tente com Google ou Apple
- **Variáveis de ambiente?** Deixe em branco as que não tem (exceto JWT_SECRET e STRIPE_SECRET_KEY)
- **Erro no deploy?** Verifique se o repositório GitHub tem o código completo

## Próximos Passos Após Deploy

1. Acesse a URL gerada
2. Teste o login
3. Teste a subscrição
4. Teste os pagamentos com Stripe (cartão teste: 4242 4242 4242 4242)

Boa sorte! 🚀

