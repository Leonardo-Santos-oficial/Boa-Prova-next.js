# Projeto Fênix - Boa Prova Next.js

Plataforma moderna de estudos para concursos públicos construída com Next.js, TypeScript e Tailwind CSS.

## 🚀 Status

✅ **Servidor rodando em:** http://localhost:3000

### Sistema em Modo de Desenvolvimento
O projeto está configurado para usar **dados mockados** até que você configure o WordPress real.

## 🛠️ Como Usar

### 1. Desenvolvimento com Dados Mockados (Atual)

O sistema está funcionando com dados de exemplo. Acesse:
- Homepage: http://localhost:3000
- Página de exemplo: http://localhost:3000/exemplo-post
- Sobre: http://localhost:3000/sobre

### 2. Conectar ao WordPress Real

Para usar conteúdo real do WordPress:

1. Instale o plugin **WPGraphQL** no seu WordPress
2. Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://seu-site.com/graphql
```
3. Reinicie o servidor: `npm run dev`

## 📋 Features Implementadas

### ✅ Core Completo
- [x] Next.js 15 com TypeScript
- [x] Tailwind CSS v4 com dark mode
- [x] Sistema de temas (dark/light) com next-themes
- [x] Layout responsivo (Header + Footer)
- [x] Páginas dinâmicas com SSG/ISR
- [x] SEO otimizado (meta tags, Open Graph)
- [x] Modo de desenvolvimento com dados mockados

### ✅ Padrões de Design
- [x] **Facade Pattern** - API WordPress (`lib/api.ts`)
- [x] **Observer Pattern** - Modo Foco com Context
- [x] Clean Code e SOLID em todo o código

### ✅ Componentes
- [x] Button (variants: primary, secondary, ghost)
- [x] Card (container de conteúdo)
- [x] Spinner (loading indicator)
- [x] ThemeToggle (alternar tema)
- [x] FocusModeToggle (ativar modo foco)

## 🎯 Como Testar

### Rodar o Projeto
```bash
npm run dev
```

### Acessar o Site
```bash
# Homepage
http://localhost:3000

# Página de exemplo com conteúdo mockado
http://localhost:3000/exemplo-post

# Testar modo foco (clique no botão 🎯)
```

### Build de Produção
```bash
npm run build
npm start
```

## 📁 Estrutura

```
boa-prova-next/
├── pages/
│   ├── _app.tsx           # Providers (Theme, FocusMode)
│   ├── index.tsx          # Homepage
│   └── [...slug].tsx      # Páginas dinâmicas
├── components/
│   ├── core/              # Button, Card, Spinner
│   ├── layout/            # Header, Footer, Layout
│   ├── navigation/        # ThemeToggle
│   └── study-tools/       # FocusModeToggle
├── lib/
│   └── api.ts             # Facade WordPress (com mock)
├── types/                 # TypeScript definitions
├── contexts/              # React Contexts
└── styles/
    └── globals.css        # Tailwind + estilos globais
```

## 🎨 Princípios Aplicados

### Clean Code
- ✅ Nomes descritivos
- ✅ Funções pequenas e específicas
- ✅ DRY (Don't Repeat Yourself)
- ✅ Comentários apenas quando necessário

### SOLID
- ✅ **SRP**: Cada componente uma responsabilidade
- ✅ **OCP**: Extensível via props e variants
- ✅ **DIP**: Dependência de abstrações (api, contexts)

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Iniciar produção
npm start

# Lint
npm run lint

# Limpar cache
rm -rf .next
```

## 📊 Performance

- SSG (Static Site Generation)
- ISR com revalidação de 1 hora
- Otimização de imagens
- Dark mode first

## 🌙 Sistema de Temas

- Modo escuro como padrão
- Toggle entre dark/light
- Persistência no localStorage
- Classes Tailwind `dark:`

## 🎯 Próximos Passos

- [ ] Cronômetro Pomodoro (State Pattern)
- [ ] Gerador de Quiz com IA (Strategy Pattern)
- [ ] Plano de Estudos (Repository Pattern)
- [ ] Sistema de anúncios (Proxy Pattern)
- [ ] Testes automatizados

## 🐛 Troubleshooting

### Erro 404 no WordPress
✅ **Resolvido**: O sistema agora usa dados mockados quando o WordPress não está disponível.

### Fast Refresh Error
✅ **Resolvido**: Rotas internas (_next, favicon.ico) são ignoradas automaticamente.

### Erro de compilação Tailwind
✅ **Resolvido**: Usando sintaxe Tailwind v4 correta.

## 👨‍💻 Autor

Leonardo Santos

## 📄 Licença

MIT
