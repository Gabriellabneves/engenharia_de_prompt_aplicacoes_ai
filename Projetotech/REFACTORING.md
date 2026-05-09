# 🚀 Refatoração: Eventos Tech Brasília - Design Sprint Federal

## 📋 Visão Geral

Refatoração completa do projeto **Eventos de Tecnologia em Brasília** implementando:

✅ **Design System Gov.br** conforme https://www.gov.br/ds/home  
✅ **Buscador de eventos em tempo real** com múltiplas fontes  
✅ **API Service** integrado com EventBrite, Meetup, GitHub e Portal Gov.br  
✅ **WCAG 2.1 AA** - 100% acessível  
✅ **Mobile-first** responsivo  
✅ **Zero dependências externas** - Vanilla JavaScript puro

---

## 🎯 Objetivos Alcançados

### Design Sprint Federal
- Paleta de cores oficial federal (#00305e, #1f5a96, #2b9cd9)
- Componentes padronizados conforme gov.br
- Navegação intuitiva e clara
- Footer com links federais

### Busca de Eventos em Tempo Real
```javascript
// Busca multicanal
const apiService = new EventAPIService();
const events = await apiService.searchEvents('python', 'Web', '2026-05-12');
```

**Fontes de dados:**
- **EventBrite** - Eventos pagos/gratuitos
- **Meetup.com** - Comunidades locais
- **GitHub API** - Eventos de repositórios
- **Portal Gov.br** - Eventos governamentais

### Deduplicação Automática
Evita mostrar o mesmo evento duas vezes de múltiplas fontes:
```javascript
const deduplicated = apiService.deduplicateEvents(allEvents);
```

### Filtros Simultâneos
```javascript
// Busca por: termo + categoria + data
filtro: "IA" | "Web" | "Cloud" | "Data" | "Segurança" | "DevOps" | "Startups"
data: YYYY-MM-DD
```

---

## 📁 Estrutura de Arquivos

```
Projetotech/
├── index-refatorado.html      ✨ HTML semântico com gov.br design
├── styles-gov-br.css          🎨 Design System Federal completo
├── api-service.js             🔌 Integração com 4 APIs
├── app.js                      ⚙️ Lógica de busca e UI
├── README.md                   📖 Documentação original
└── index.html                  (arquivo original preservado)
```

---

## 🔍 Funcionalidades Principais

### 1. **Busca em Tempo Real**
- Debounce de 300ms para performance
- Sem recarregar página
- Resultados instantâneos

### 2. **Filtros Avançados**
- Por termo de busca (título/descrição)
- Por categoria (7 categorias)
- Por data
- Combinação de filtros

### 3. **Deduplicação**
```javascript
// Mesmo evento de múltiplas fontes = mostrado 1x
title + date = chave única
```

### 4. **Compartilhamento**
- Share API nativa (dispositivos que suportam)
- Fallback para clipboard
- URLs parametrizadas: `?search=python&category=Web&date=2026-05-12`

### 5. **Acessibilidade**
- ♿ WCAG 2.1 AA
- ✅ Navegação completa por teclado
- ✅ ARIA labels em tudo
- ✅ Contraste 4.5:1
- ✅ Focus visível (3px outline)
- ✅ Suporte a leitores de tela
- ✅ Respeita prefers-reduced-motion

---

## 🏗️ Design Sprint Federal Aplicado

### Cores Oficiais
```css
--federal-blue: #00305e;          /* Azul principal */
--federal-light-blue: #1f5a96;    /* Azul secundário */
--federal-bright-blue: #2b9cd9;   /* Azul destaque */
--federal-green: #0aa650;         /* Verde (sucesso) */
--federal-red: #e31c23;           /* Vermelho (erro) */
```

### Componentes Padrão
- Header sticky com navegação
- Hero section com CTA
- Search box flutuante
- Grid responsivo de cards
- Footer federal
- Alerts e badges

### Tipografia
- Font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- Escala: 0.875rem → 2rem
- Line-height: 1.6 (leitura)

---

## 🚀 Como Usar

### 1. **Abrir no Navegador**
```bash
# Abra o arquivo no navegador
open index-refatorado.html  # macOS
# ou acesse via HTTP server
python3 -m http.server 8000
```

### 2. **Buscar Eventos**
```
1. Digite um termo (ex: "Python", "IA", "DevOps")
2. Selecione categoria (opcional)
3. Escolha data (opcional)
4. Clique "Buscar" ou enter
```

### 3. **Usar Parâmetros de URL**
```
# Busca direta por URL
?search=python&category=Web&date=2026-05-12
```

### 4. **Integrar em Seu Sistema**
```javascript
// Importar API Service
const apiService = new EventAPIService();

// Buscar eventos
const events = await apiService.searchEvents('python');

// Filtrar resultados
const filtered = apiService.filterEvents(events, 'IA', '2026-05-12');

// Obter categorias
const categories = apiService.getCategories(events);
```

---

## 📊 Dados Padrão (Mock)

Quando as APIs não estão disponíveis:

| Evento | Data | Categoria | Local |
|--------|------|-----------|-------|
| Tech Summit Brasília 2026 | 15/03/2026 | IA | Centro Convenções |
| Python Day Brasília | 20/04/2026 | Web | UnB |
| JavaScript Conference DF | 12/05/2026 | Web | Câmara Deputados |
| DevOps Day Brasília | 08/06/2026 | DevOps | Parque Cidade |
| Startup & Innovation Week | 25-29/07/2026 | Startups | Parque Itiquira |

---

## 🔗 Referências

- **Design System:** https://www.gov.br/ds/home
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **APIs:**
  - EventBrite: https://www.eventbrite.com/platform/api
  - Meetup: https://www.meetup.com/api/
  - GitHub: https://docs.github.com/en/rest
  - Gov.br: https://www.gov.br

---

## ✅ Checklist de Acessibilidade

- ✓ Navegação completa por teclado
- ✓ Focus indicators visíveis (3px outline)
- ✓ ARIA labels em inputs e botões
- ✓ Contraste de texto 4.5:1 (WCAG AA)
- ✓ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ✓ Alt text em imagens
- ✓ Live regions para feedback dinâmico
- ✓ Suporta leitores de tela (NVDA, JAWS, VoiceOver)
- ✓ Modo dark respeita `prefers-color-scheme`
- ✓ Animações respeitam `prefers-reduced-motion`
- ✓ Tamanho mínimo de botão/link: 44x44px
- ✓ Zoom até 200% sem perder funcionalidade

---

## 📱 Responsividade

```css
/* Desktop */
> 1200px: Grid 4 colunas

/* Tablet */
768px - 1200px: Grid 2 colunas

/* Mobile */
< 768px: Grid 1 coluna
```

---

## 🔐 Segurança

- ✅ XSS Protection - Escape de HTML via `escapeHtml()`
- ✅ CORS - Requer proxy para APIs externas
- ✅ No dados sensíveis em URL
- ✅ HTTPS recomendado
- ✅ Rate limiting (cache 5min)

---

## 🐛 Debug

### Modo Development
```javascript
// No console do navegador
console.log(app.currentEvents);      // Ver eventos atuais
app.performSearch();                 // Forçar busca
app.apiService.getDefaultEvents();   // Eventos padrão
```

### Logs da API
```javascript
// Em api-service.js descomentar:
console.log('Resultado EventBrite:', eventbriteEvents);
console.log('Resultado Meetup:', meetupEvents);
```

---

## 🚀 Próximas Melhorias

1. **Backend Node.js**
   - Proxy para APIs
   - Cache persistente (Redis)
   - Rate limiting avançado

2. **Banco de Dados**
   - PostgreSQL para eventos
   - Sincronização periódica

3. **Autenticação**
   - Login para salvar eventos favoritos
   - Notificações por email

4. **PWA (Progressive Web App)**
   - Service Worker
   - Modo offline
   - Push notifications

5. **Analytics**
   - Rastrear buscas populares
   - Eventos mais visualizados

---

## 📄 Licença

MIT - Desenvolvido para comunidade tech de Brasília ❤️

**Última atualização:** 2026-05-09
**Versão:** 2.0 - Design Sprint Federal
