# HealthBuddy - Environment Variables Setup Guide

Este guia fornece instruções passo-a-passo para obter todas as variáveis de ambiente necessárias para fazer o deployment da HealthBuddy na Vercel.

## Variáveis Necessárias

A HealthBuddy requer as seguintes variáveis de ambiente:

| Variável | Descrição | Onde Obter |
|----------|-----------|-----------|
| `DATABASE_URL` | Conexão MySQL | Criar banco de dados |
| `JWT_SECRET` | Chave para assinar tokens | Gerar aleatoriamente |
| `OAUTH_SERVER_URL` | URL do servidor OAuth | Manus/Seu provedor OAuth |
| `VITE_OAUTH_PORTAL_URL` | URL do portal OAuth | Manus/Seu provedor OAuth |
| `VITE_APP_ID` | ID da aplicação OAuth | Manus/Seu provedor OAuth |
| `VITE_APP_TITLE` | Título da aplicação | Definir como "HealthBuddy" |
| `VITE_APP_LOGO` | URL do logo | Fazer upload para S3 ou CDN |
| `BUILT_IN_FORGE_API_URL` | URL da API Forge | Manus |
| `BUILT_IN_FORGE_API_KEY` | Chave da API Forge | Manus |
| `STRIPE_SECRET_KEY` | Chave secreta Stripe | Stripe |
| `STRIPE_PUBLISHABLE_KEY` | Chave pública Stripe | Stripe |

---

## Passo 1: Criar Banco de Dados MySQL

### Opção A: Usando PlanetScale (Recomendado - Gratuito)

1. **Aceda a https://planetscale.com**
2. **Crie uma conta** (ou faça login se já tiver)
3. **Clique em "Create a database"**
4. **Preencha os detalhes:**
   - Database name: `healthbuddy`
   - Region: Escolha a mais próxima de você
5. **Clique em "Create database"**
6. **Vá para "Connections"** e copie a **MySQL connection string**
7. **Guarde esta string** - será o seu `DATABASE_URL`

Exemplo de `DATABASE_URL`:
```
mysql://root:password@aws.connect.psdb.cloud/healthbuddy?sslaccept=strict
```

### Opção B: Usando AWS RDS

1. **Aceda a https://aws.amazon.com**
2. **Vá para RDS** (Relational Database Service)
3. **Clique em "Create database"**
4. **Escolha MySQL** e a versão mais recente
5. **Preencha os detalhes:**
   - DB instance identifier: `healthbuddy`
   - Master username: `admin`
   - Master password: Crie uma senha forte
6. **Clique em "Create database"**
7. **Após criar, copie o "Endpoint"** e construa a connection string:
```
mysql://admin:password@healthbuddy.xxxxx.us-east-1.rds.amazonaws.com:3306/healthbuddy
```

### Opção C: Usando Railway

1. **Aceda a https://railway.app**
2. **Crie uma conta** (ou faça login)
3. **Clique em "New Project"** → **"Provision MySQL"**
4. **Aguarde a criação**
5. **Vá para "Variables"** e copie a **DATABASE_URL**

---

## Passo 2: Gerar JWT_SECRET

O `JWT_SECRET` é uma chave aleatória para assinar tokens de autenticação.

### Gerar no Terminal (Linux/Mac):

```bash
openssl rand -base64 32
```

Isto vai gerar algo como:
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890==
```

**Copie este valor** - será o seu `JWT_SECRET`.

### Gerar Online:

Se não conseguir usar o terminal, visite: https://generate-random.org/base64-generator e gere uma string de 32 caracteres.

---

## Passo 3: Configurar OAuth (Manus)

A HealthBuddy usa Manus OAuth para autenticação.

1. **Aceda a https://manus.im** (ou seu provedor OAuth)
2. **Crie uma aplicação:**
   - Name: `HealthBuddy`
   - Redirect URI: `https://seu-dominio.vercel.app/api/oauth/callback`
3. **Copie os seguintes valores:**
   - `VITE_APP_ID` (Application ID)
   - `OAUTH_SERVER_URL` (geralmente `https://api.manus.im`)
   - `VITE_OAUTH_PORTAL_URL` (geralmente `https://oauth.manus.im`)
   - `BUILT_IN_FORGE_API_KEY` (API Key)
   - `BUILT_IN_FORGE_API_URL` (geralmente `https://api.manus.im`)

---

## Passo 4: Configurar Stripe (Pagamentos)

A HealthBuddy usa Stripe para processar pagamentos das subscrições.

1. **Aceda a https://stripe.com**
2. **Crie uma conta** (ou faça login)
3. **Vá para "Developers"** → **"API Keys"**
4. **Copie:**
   - `STRIPE_SECRET_KEY` (Secret key)
   - `STRIPE_PUBLISHABLE_KEY` (Publishable key)

**Nota:** Use as chaves de teste (`sk_test_` e `pk_test_`) para desenvolvimento. Após lançar em produção, use as chaves de produção.

---

## Passo 5: Configurar Variáveis Simples

As seguintes variáveis podem ser definidas diretamente:

```
VITE_APP_TITLE=HealthBuddy
VITE_APP_LOGO=https://seu-dominio.com/logo.png
```

Para o logo, você pode:
- Usar um URL de um CDN
- Fazer upload para S3
- Usar um serviço de hospedagem de imagens

---

## Passo 6: Fazer Upload do Código para GitHub

1. **Crie um repositório no GitHub:**
   - Aceda a https://github.com/new
   - Nome: `HealthBuddyApp`
   - Descrição: `Your Personal Health & Wellness AI Companion`
   - Escolha "Private" ou "Public"
   - Clique em "Create repository"

2. **No seu terminal local:**
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

## Passo 7: Deploy na Vercel

1. **Aceda a https://vercel.com**
2. **Faça login** com sua conta
3. **Clique em "New Project"**
4. **Selecione seu repositório GitHub** (`HealthBuddyApp`)
5. **Clique em "Import"**
6. **Configure as variáveis de ambiente:**
   - Clique em "Environment Variables"
   - Adicione cada variável:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `OAUTH_SERVER_URL`
     - `VITE_OAUTH_PORTAL_URL`
     - `VITE_APP_ID`
     - `VITE_APP_TITLE`
     - `VITE_APP_LOGO`
     - `BUILT_IN_FORGE_API_URL`
     - `BUILT_IN_FORGE_API_KEY`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PUBLISHABLE_KEY`

7. **Clique em "Deploy"**
8. **Aguarde a conclusão** (geralmente 2-5 minutos)
9. **Copie a URL da sua aplicação** (algo como `https://healthbuddy-xyz.vercel.app`)

---

## Resumo das Variáveis

Aqui está um modelo que você pode copiar e preencher:

```
DATABASE_URL=mysql://root:password@aws.connect.psdb.cloud/healthbuddy?sslaccept=strict
JWT_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890==
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=seu-app-id-aqui
VITE_APP_TITLE=HealthBuddy
VITE_APP_LOGO=https://seu-dominio.com/logo.png
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api-aqui
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxx
```

---

## Troubleshooting

### Erro: "DATABASE_URL is required"
- Certifique-se de que a variável `DATABASE_URL` está configurada na Vercel
- Verifique se a connection string está correta

### Erro: "Invalid OAuth credentials"
- Verifique se `VITE_APP_ID` está correto
- Certifique-se de que o redirect URI está configurado corretamente no provedor OAuth

### Erro: "Stripe API key is invalid"
- Verifique se está usando as chaves corretas (teste vs. produção)
- Certifique-se de que não há espaços extras nas chaves

### Aplicação está lenta
- Verifique se o banco de dados está respondendo
- Considere usar um plano pago para melhor performance
- Ative caching na Vercel

---

## Próximos Passos

Após o deployment bem-sucedido:

1. **Teste a aplicação** em `https://seu-dominio.vercel.app`
2. **Configure um domínio personalizado** (opcional):
   - Vá para "Settings" → "Domains"
   - Adicione seu domínio personalizado
   - Siga as instruções de DNS

3. **Configure monitoramento:**
   - Ative Vercel Analytics
   - Configure alertas para erros

4. **Faça backup regular** dos dados do banco de dados

---

## Suporte

Se encontrar problemas:

1. Verifique os logs da Vercel: `Deployments` → `Logs`
2. Consulte a documentação: https://vercel.com/docs
3. Contacte o suporte do Manus ou Stripe conforme necessário

---

**Parabéns!** A sua HealthBuddy está agora ao vivo na internet! 🎉

