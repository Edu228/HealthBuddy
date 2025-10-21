# HealthBuddy - Guia Completo de Testes

## 📋 Índice
1. Preparação para Testes
2. Testes de Funcionalidade
3. Testes de Autenticação
4. Testes de Subscrição
5. Testes de Pagamento (Stripe)
6. Testes de IA
7. Testes de Comunidade
8. Testes de Performance
9. Testes de Segurança
10. Checklist Final

---

## 1. Preparação para Testes

### Ambiente de Teste
- **URL:** https://3000-id3ixcbdc5dhamagvccov-2eb3b229.manusvm.computer
- **Modo:** Desenvolvimento
- **Stripe:** Modo Teste (chaves começam com `test_`)

### Ferramentas Necessárias
- Navegador moderno (Chrome, Firefox, Safari)
- Ferramentas de Desenvolvedor (F12)
- Conta de teste Stripe
- Email para testes

### Dados de Teste
```
Email: teste@example.com
Senha: (usar OAuth para login)
Cartão Stripe Teste: 4242 4242 4242 4242
Validade: 12/25
CVC: 123
```

---

## 2. Testes de Funcionalidade

### 2.1 Página Home
- [ ] Carregar página sem erros
- [ ] Verificar hero section com imagem
- [ ] Testar botão "Go to Dashboard"
- [ ] Testar botão "Start Free Trial"
- [ ] Verificar seção de features com imagens
- [ ] Testar pricing cards
- [ ] Verificar footer com links
- [ ] Testar responsividade em mobile

### 2.2 Navegação
- [ ] Menu funciona em desktop
- [ ] Menu responsivo em mobile
- [ ] Links internos funcionam
- [ ] Breadcrumbs aparecem corretamente
- [ ] Voltar para home funciona

### 2.3 Dashboard
- [ ] Carregar sem erros
- [ ] Mostrar nome do utilizador
- [ ] Exibir estatísticas semanais
- [ ] Gráficos carregam corretamente
- [ ] Quick actions funcionam
- [ ] Achievements aparecem
- [ ] Histórico de atividades mostra dados
- [ ] Botões de ação funcionam

### 2.4 Wellness
- [ ] Abrir página sem erros
- [ ] Tabs (Fitness, Meditation, Nutrition) funcionam
- [ ] Exercícios carregam corretamente
- [ ] Meditações listadas
- [ ] Planos nutricionais aparecem
- [ ] Botões "Start", "Listen", "View Plan" funcionam
- [ ] Filtros funcionam (se implementados)

### 2.5 Comunidade
- [ ] Carregar feed de posts
- [ ] Posts aparecem com informações corretas
- [ ] Sistema de likes funciona
- [ ] Comentários aparecem
- [ ] Desafios ativos listados
- [ ] Botão "Join Challenge" funciona
- [ ] Criar novo post funciona

### 2.6 AI Chat
- [ ] Chat carrega corretamente
- [ ] Histórico de mensagens aparece
- [ ] Perguntas sugeridas funcionam
- [ ] Enviar mensagem funciona
- [ ] Respostas da IA aparecem
- [ ] Input limpa após envio

### 2.7 Perfil
- [ ] Dados pessoais carregam
- [ ] Editar perfil funciona
- [ ] Salvar alterações funciona
- [ ] Histórico de atividades mostra dados
- [ ] Foto de perfil carrega

### 2.8 Configurações
- [ ] Abrir página sem erros
- [ ] Notificações podem ser ativadas/desativadas
- [ ] Privacidade pode ser ajustada
- [ ] Segurança funciona
- [ ] Logout funciona

---

## 3. Testes de Autenticação

### 3.1 Login
- [ ] Botão "Sign In" funciona
- [ ] Redireciona para OAuth
- [ ] Login com sucesso
- [ ] Utilizador autenticado aparece no header
- [ ] Sessão persiste ao recarregar página

### 3.2 Logout
- [ ] Botão "Logout" funciona
- [ ] Redireciona para home
- [ ] Sessão termina
- [ ] Não pode acessar páginas protegidas

### 3.3 Proteção de Rotas
- [ ] Páginas protegidas redirecionam para login
- [ ] Utilizador não autenticado não pode acessar dashboard
- [ ] Após login, pode acessar todas as páginas

---

## 4. Testes de Subscrição

### 4.1 Teste Gratuito
- [ ] Novo utilizador recebe 7 dias grátis
- [ ] Acesso completo durante período de teste
- [ ] Contagem regressiva mostra dias restantes
- [ ] Notificação quando teste está acabando

### 4.2 Plano Básico (£5/mês)
- [ ] Pode fazer upgrade para plano básico
- [ ] Funcionalidades básicas desbloqueadas
- [ ] Renovação automática funciona
- [ ] Pode cancelar subscrição

### 4.3 Plano Premium (£12/mês)
- [ ] Pode fazer upgrade para premium
- [ ] Todas as funcionalidades desbloqueadas
- [ ] Acesso ilimitado a conteúdos
- [ ] Pode cancelar subscrição

### 4.4 Cancelamento
- [ ] Botão cancelar funciona
- [ ] Confirmação aparece
- [ ] Subscrição cancela corretamente
- [ ] Acesso revogado após período atual

---

## 5. Testes de Pagamento (Stripe)

### 5.1 Modo Teste
- [ ] Usar cartão de teste: 4242 4242 4242 4242
- [ ] Validade: 12/25
- [ ] CVC: 123
- [ ] Transação completa com sucesso

### 5.2 Erros de Pagamento
- [ ] Cartão recusado (4000 0000 0000 0002) mostra erro
- [ ] Expirado (4000 0000 0000 0069) mostra erro
- [ ] CVC inválido mostra erro
- [ ] Mensagens de erro claras

### 5.3 Webhook
- [ ] Stripe webhook recebe eventos
- [ ] Subscrição atualiza na base de dados
- [ ] Pagamento registrado corretamente

### 5.4 Recibos
- [ ] Recibo enviado por email
- [ ] Recibo contém informações corretas
- [ ] Link para download funciona

---

## 6. Testes de IA

### 6.1 Chat com IA
- [ ] Mensagens enviam corretamente
- [ ] Respostas aparecem
- [ ] Histórico persiste
- [ ] Perguntas sugeridas funcionam

### 6.2 Recomendações
- [ ] IA recomenda exercícios
- [ ] IA recomenda meditações
- [ ] IA recomenda planos nutricionais
- [ ] Recomendações são personalizadas

### 6.3 Contexto
- [ ] IA entende ciclo menstrual
- [ ] IA entende menopausa
- [ ] IA entende faixa etária
- [ ] IA entende preferências

---

## 7. Testes de Comunidade

### 7.1 Posts
- [ ] Criar novo post funciona
- [ ] Post aparece no feed
- [ ] Pode editar post
- [ ] Pode deletar post

### 7.2 Interações
- [ ] Like funciona
- [ ] Comentar funciona
- [ ] Compartilhar funciona
- [ ] Contador de likes atualiza

### 7.3 Desafios
- [ ] Desafios listados corretamente
- [ ] Pode fazer join em desafio
- [ ] Progresso do desafio mostra
- [ ] Recompensas aparecem ao completar

### 7.4 Badges
- [ ] Badges desbloqueados aparecem
- [ ] Descrição de badge mostra
- [ ] Progresso para próximo badge mostra

---

## 8. Testes de Performance

### 8.1 Velocidade de Carregamento
- [ ] Home carrega em < 2 segundos
- [ ] Dashboard carrega em < 3 segundos
- [ ] Wellness carrega em < 2 segundos
- [ ] Comunidade carrega em < 3 segundos

### 8.2 Responsividade
- [ ] Desktop (1920px): Layout perfeito
- [ ] Tablet (768px): Layout adaptado
- [ ] Mobile (375px): Layout responsivo
- [ ] Sem scroll horizontal

### 8.3 Imagens
- [ ] Imagens carregam corretamente
- [ ] Imagens otimizadas
- [ ] Sem quebra de layout
- [ ] Alt text presente

### 8.4 Animações
- [ ] Animações suaves
- [ ] Sem lag ou stuttering
- [ ] Transições funcionam
- [ ] Hover effects funcionam

---

## 9. Testes de Segurança

### 9.1 Autenticação
- [ ] Senha não é armazenada em plain text
- [ ] JWT token é seguro
- [ ] Session cookie é httpOnly
- [ ] CSRF token presente

### 9.2 Dados Sensíveis
- [ ] Dados de cartão não são armazenados
- [ ] Stripe trata dados sensíveis
- [ ] HTTPS obrigatório
- [ ] Sem exposição de dados

### 9.3 Validação
- [ ] Input é validado no cliente
- [ ] Input é validado no servidor
- [ ] SQL injection prevenido
- [ ] XSS prevenido

### 9.4 Autorização
- [ ] Utilizador não pode acessar dados de outro
- [ ] Utilizador não pode modificar dados de outro
- [ ] Admin pode acessar dados de admin
- [ ] Roles funcionam corretamente

---

## 10. Checklist Final

### Antes de Publicar
- [ ] Todos os testes de funcionalidade passam
- [ ] Todos os testes de autenticação passam
- [ ] Todos os testes de subscrição passam
- [ ] Todos os testes de pagamento passam
- [ ] Todos os testes de IA passam
- [ ] Todos os testes de comunidade passam
- [ ] Todos os testes de performance passam
- [ ] Todos os testes de segurança passam
- [ ] Sem erros no console
- [ ] Sem warnings de TypeScript
- [ ] Documentação atualizada
- [ ] Variáveis de ambiente configuradas
- [ ] Backups realizados
- [ ] Plano de rollback pronto

### Documentação
- [ ] README atualizado
- [ ] DEPLOYMENT.md atualizado
- [ ] API documentation completa
- [ ] User guide criado

### Deployment
- [ ] Repositório GitHub criado
- [ ] Vercel conectada
- [ ] Variáveis de ambiente configuradas
- [ ] Build funciona
- [ ] Preview funciona
- [ ] URL permanente obtida

---

## 11. Relatório de Testes

### Template de Relatório
```
Data: [DATA]
Testador: [NOME]
Ambiente: [URL]

Testes Passados: [NÚMERO]
Testes Falhados: [NÚMERO]
Taxa de Sucesso: [PERCENTAGEM]

Problemas Encontrados:
1. [PROBLEMA] - Severidade: [ALTA/MÉDIA/BAIXA]
2. [PROBLEMA] - Severidade: [ALTA/MÉDIA/BAIXA]

Recomendações:
1. [RECOMENDAÇÃO]
2. [RECOMENDAÇÃO]

Status Geral: [PRONTO/NÃO PRONTO]
```

---

## 12. Contatos de Suporte

**Email:** edu228@icloud.com  
**Documentação:** Consulte os arquivos .md no repositório  
**Stripe Support:** https://support.stripe.com

---

**Última Atualização:** Outubro 2025  
**Versão:** 1.0.0  
**Status:** Pronto para Testes

