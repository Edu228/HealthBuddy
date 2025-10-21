# HealthBuddy - Vercel Deployment Guide

## Configuração Rápida para Vercel

Seu email registado: **edu228@icloud.com**

### Variáveis de Ambiente Geradas

**JWT_SECRET (já gerado):**
```
afK/s3TufOV7fcslPYOr889ng5TxQtqEYIgyqVPJNwA=
```

---

## Passo 1: Configurar Banco de Dados (PlanetScale)

1. Aceda a https://planetscale.com
2. Faça login com seu email: **edu228@icloud.com**
3. Clique em "Create a database"
4. Nome: `healthbuddy`
5. Region: Escolha a mais próxima
6. Clique em "Create database"
7. Vá para "Connections" → "Connect with MySQL"
8. Copie a connection string (será seu `DATABASE_URL`)

**Exemplo:**
```
mysql://root:password@aws.connect.psdb.cloud/healthbuddy?sslaccept=strict
```

---

## Passo 2: Configurar Stripe

### Opção A: Modo TESTE (Recomendado para começar)

1. Aceda a https://stripe.com
2. Crie conta com seu email: **edu228@icloud.com**
3. Vá para "Developers" → "API Keys"
4. Use as chaves de TESTE:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_PUBLISHABLE_KEY=pk_test_...`

### Opção B: Modo PRODUÇÃO (Após testes)

1. Na mesma conta Stripe
2. Ative o modo produção
3. Use as chaves de PRODUÇÃO:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_PUBLISHABLE_KEY=pk_live_...`

---

## Passo 3: Configurar OAuth (Manus)

1. Aceda a https://manus.im (ou seu provedor OAuth)
2. Crie uma aplicação com seu email: **edu228@icloud.com**
3. Nome da aplicação: `HealthBuddy`
4. Redirect URI: `https://seu-dominio-vercel.vercel.app/api/oauth/callback`
5. Copie:
   - `VITE_APP_ID`
   - `BUILT_IN_FORGE_API_KEY`

---

## Passo 4: Fazer Upload para GitHub

1. Aceda a https://github.com
2. Faça login com sua conta (ou crie uma com seu email)
3. Clique em "New repository"
4. Nome: `HealthBuddyApp`
5. Descrição: `Your Personal Health & Wellness AI Companion`
6. Escolha "Private" ou "Public"
7. Clique em "Create repository"

**No terminal (execute estes comandos):**
```bash
cd /home/ubuntu/HealthBuddyApp
git init
git add .
git commit -m "Initial commit: HealthBuddy application"
git branch -M main
git remote add origin https://github.com/seu-usuario/HealthBuddyApp.git
git push -u origin main
```

---

## Passo 5: Deploy na Vercel

1. Aceda a https://vercel.com
2. Faça login com seu email: **edu228@icloud.com**
3. Clique em "New Project"
4. Selecione seu repositório `HealthBuddyApp`
5. Clique em "Import"
6. **Configure as variáveis de ambiente:**

### Variáveis Necessárias:

```
DATABASE_URL=mysql://root:password@aws.connect.psdb.cloud/healthbuddy?sslaccept=strict
JWT_SECRET=afK/s3TufOV7fcslPYOr889ng5TxQtqEYIgyqVPJNwA=
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=seu-app-id-do-manus
VITE_APP_TITLE=HealthBuddy
VITE_APP_LOGO=https://seu-dominio.com/logo.png
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api-do-manus
STRIPE_SECRET_KEY=sk_test_xxxxx (ou sk_live_xxxxx para produção)
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx (ou pk_live_xxxxx para produção)
NODE_ENV=production
```

7. Clique em "Deploy"
8. Aguarde 2-5 minutos
9. Copie a URL final: `https://healthbuddy-xyz.vercel.app`

---

## Resumo das Contas Criadas

| Serviço | Email | Uso |
|---------|-------|-----|
| Vercel | edu228@icloud.com | Hosting da aplicação |
| PlanetScale | edu228@icloud.com | Banco de dados MySQL |
| Stripe | edu228@icloud.com | Pagamentos (teste + produção) |
| GitHub | seu-usuario | Repositório do código |
| Manus/OAuth | edu228@icloud.com | Autenticação |

---

## Checklist Final

- [ ] Banco de dados criado no PlanetScale
- [ ] DATABASE_URL copiado
- [ ] Conta Stripe criada (teste)
- [ ] Chaves Stripe copiadas
- [ ] Aplicação OAuth criada no Manus
- [ ] Código feito push para GitHub
- [ ] Variáveis configuradas na Vercel
- [ ] Deploy concluído com sucesso
- [ ] URL permanente obtida

---

## Próximos Passos Após Deploy

1. **Testar a aplicação:**
   - Visite `https://seu-dominio.vercel.app`
   - Teste o login
   - Teste o fluxo de subscrição

2. **Configurar domínio personalizado (opcional):**
   - Vá para "Settings" → "Domains"
   - Adicione seu domínio
   - Configure DNS

3. **Monitoramento:**
   - Ative Vercel Analytics
   - Configure alertas

4. **Produção:**
   - Mude Stripe para modo produção
   - Atualize as chaves na Vercel
   - Teste pagamentos reais

---

## Troubleshooting

### Erro: "DATABASE_URL is required"
- Certifique-se de que a variável está configurada na Vercel
- Verifique se a connection string está correta

### Erro: "Failed to connect to database"
- Verifique se o PlanetScale está ativo
- Teste a connection string localmente

### Erro: "Invalid Stripe key"
- Verifique se está usando a chave correta (teste vs. produção)
- Certifique-se de que não há espaços extras

---

## Suporte

- Documentação Vercel: https://vercel.com/docs
- Documentação PlanetScale: https://planetscale.com/docs
- Documentação Stripe: https://stripe.com/docs
- Documentação Manus: https://manus.im/docs

---

**Parabéns! A sua HealthBuddy está pronta para ir ao vivo! 🚀**

Para mais informações, consulte `ENVIRONMENT_SETUP.md` ou `PRODUCTION_DEPLOYMENT.md`.

