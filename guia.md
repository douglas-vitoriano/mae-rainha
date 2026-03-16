# 🚀 Guia de Deploy — Grupo de Oração Mãe Rainha

> Roteiro completo: GitHub → Fly.io → Google Play → App Store  
> Atualizado em: Março 2026

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [GitHub](#etapa-1--github)
3. [Deploy Fly.io](#etapa-2--deploy-no-flyio)
4. [AWS (opcional)](#etapa-3--aws-opcional)
5. [Google Play Store](#etapa-4--google-play-store)
6. [Apple App Store](#etapa-5--apple-app-store)
7. [GitHub Actions (CI/CD)](#etapa-7--github-actions-cicd)
8. [Lighthouse em produção](#etapa-8--lighthouse-em-produção)
9. [Resumo de custos](#resumo-de-custos)
10. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

- [ ] Node.js instalado (`node -v`)
- [ ] Ruby 3.2.8 instalado (`ruby -v`)
- [ ] Git instalado (`git -v`)
- [ ] Conta no [GitHub](https://github.com)
- [ ] Conta no [Fly.io](https://fly.io)
- [ ] Build funcionando localmente (`bin/bridgetown start`)

---

## ETAPA 1 — GitHub

### 1.1 Criar o `.gitignore`

Na raiz do projeto, crie o arquivo `.gitignore`:

```
# Bridgetown
output/
.bridgetown-cache/

# Node
node_modules/

# Ruby
tmp/
.bundle/

# Env
.env
.env.local

# Sistema
.DS_Store
Thumbs.db
```

### 1.2 Inicializar e subir o repositório

```bash
# Na raiz do projeto
git init
git add .
git commit -m "feat: initial commit — PWA Mãe Rainha"
```

Acesse [github.com/new](https://github.com/new), crie o repositório `mae-rainha` (privado ou público), depois:

```bash
git remote add origin https://github.com/SEU_USUARIO/mae-rainha.git
git branch -M main
git push -u origin main
```

### 1.3 Fluxo de atualização (uso diário)

```bash
git add .
git commit -m "descrição do que mudou"
git push
```

---

## ETAPA 2 — Deploy no Fly.io

> **Resultado:** `https://nome-do-app.fly.dev` com HTTPS automático e gratuito.  
> Plano free inclui 3 VMs compartilhadas + 160 GB banda/mês.

### 2.1 Instalar o CLI do Fly

```bash
# Linux / macOS
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2.2 Criar conta e fazer login

```bash
fly auth signup   # primeira vez
# ou
fly auth login    # já tem conta
```

### 2.3 Configurar a URL no projeto

Antes do deploy, edite `config/initializers.rb`:

```ruby
Bridgetown.configure do |config|
  url "https://nome-do-app.fly.dev"   # ← troque pelo nome que vai escolher
  # ...
end
```

### 2.4 Buildar o frontend

```bash
npm run esbuild
```

### 2.5 Lançar a aplicação

```bash
# Na raiz do projeto — detecta Ruby/Rack automaticamente
fly launch
```

Responda as perguntas:
- **App name:** `mae-rainha` (ou outro disponível)
- **Region:** `gru` — São Paulo (mais próximo do Brasil)
- **PostgreSQL:** No
- **Redis:** No
- **Deploy now:** Yes

### 2.6 Deploy e atualizações futuras

```bash
# Sempre buildar antes de fazer deploy
npm run esbuild && fly deploy
```

### 2.7 Comandos úteis do Fly

```bash
fly status          # status da aplicação
fly logs            # ver logs em tempo real
fly open            # abre o app no browser
fly ssh console     # acessa o servidor remotamente
fly scale show      # mostra recursos alocados
```

### 2.8 Variáveis de ambiente (se precisar)

```bash
fly secrets set MINHA_VARIAVEL="valor"
fly secrets list
```

---

## ETAPA 3 — AWS (opcional)

> Só vale a pena quando o site crescer e precisar armazenar imagens pesadas.  
> **Free Tier:** S3 = 5 GB storage + 20.000 GET requests/mês (12 meses grátis).

### Quando usar AWS S3

- Imagens de alta resolução (fotos de eventos, vídeos)
- Backups automáticos
- Servir assets com CDN via CloudFront

### Setup básico (quando necessário)

```bash
# Instala AWS CLI
pip install awscli

# Configura credenciais
aws configure
# → AWS Access Key ID: (do console da AWS)
# → AWS Secret Access Key: (do console da AWS)
# → Default region: sa-east-1  (São Paulo)
# → Output format: json

# Cria um bucket
aws s3 mb s3://mae-rainha-assets

# Sobe uma imagem
aws s3 cp src/images/logotipo.png s3://mae-rainha-assets/
```

**Por enquanto, o Fly.io serve tudo. Deixe a AWS para depois.**

---

## ETAPA 4 — Google Play Store

> **Custo único: $25** (conta de desenvolvedor Google)  
> PWAs funcionam muito bem via Trusted Web Activity (TWA).  
> Requisito: Lighthouse score ≥ 80 em produção.

### 4.1 Verificar o Lighthouse em produção

Antes de empacotar, rode o Lighthouse na URL do Fly.io em aba anônima e verifique se está ≥ 80.

### 4.2 Gerar o pacote Android via PWABuilder

1. Acesse [pwabuilder.com](https://pwabuilder.com)
2. Cole a URL: `https://nome-do-app.fly.dev`
3. Clique em **"Package for Stores"**
4. Escolha **Android**
5. Configure:
   - **Package ID:** `com.maerainhaoracao.app`
   - **App name:** Mãe Rainha
   - **Version:** 1.0.0
6. Clique em **"Generate Package"**
7. Baixe o `.zip` com o `.aab` e o `assetlinks.json`

### 4.3 Configurar o Digital Asset Links

O `assetlinks.json` vincula o domínio ao app Android. Coloque o arquivo em:

```
src/.well-known/assetlinks.json
```

O arquivo gerado pelo PWABuilder tem este formato:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.maerainhaoracao.app",
    "sha256_cert_fingerprints": ["AA:BB:CC:..."]
  }
}]
```

Certifique-se que a URL `https://nome-do-app.fly.dev/.well-known/assetlinks.json` retorna o arquivo corretamente.

### 4.4 Publicar na Play Store

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Crie uma conta de desenvolvedor ($25)
3. **"Criar aplicativo"**
4. Preencha título, descrição, categoria (Estilo de vida)
5. Vá em **"Produção"** → **"Criar nova versão"**
6. Faça upload do `.aab`
7. Preencha os campos obrigatórios (screenshots, ícones, classificação)
8. Submeta para revisão (leva de 1 a 7 dias)

### 4.5 Screenshots necessários para a Play Store

| Tipo | Tamanho |
|---|---|
| Celular | mínimo 2, máximo 8 (1080×1920px) |
| Ícone hi-res | 512×512px |
| Imagem de destaque | 1024×500px |

---

## ETAPA 5 — Apple App Store

> **Custo: $99/ano** (Apple Developer Program)  
> **Requisito obrigatório: Mac com Xcode** (ou usar Codemagic na nuvem)  
> ⚠️ A Apple é mais restritiva com PWAs — prepare uma descrição de funcionalidades offline.

### 5.1 Opções para compilar sem Mac

**Codemagic** (recomendado): compila o Xcode na nuvem.
- Gratuito: 500 minutos/mês
- Acesse [codemagic.io](https://codemagic.io)

### 5.2 Gerar o pacote iOS via PWABuilder

1. Acesse [pwabuilder.com](https://pwabuilder.com)
2. Cole a URL: `https://nome-do-app.fly.dev`
3. Clique em **"Package for Stores"**
4. Escolha **iOS**
5. Configure:
   - **Bundle ID:** `com.maerainhaoracao.app`
   - **App name:** Mãe Rainha
   - **Version:** 1.0.0
6. Baixe o projeto Xcode gerado (`.zip`)

### 5.3 Compilar com Codemagic (sem Mac)

1. Crie conta em [codemagic.io](https://codemagic.io)
2. Conecte o repositório GitHub
3. Faça upload do projeto iOS do PWABuilder
4. Configure o workflow para iOS
5. Gere o `.ipa` assinado

### 5.4 Cadastro Apple Developer

1. Acesse [developer.apple.com](https://developer.apple.com)
2. Inscreva-se no **Apple Developer Program** ($99/ano)
3. Crie o App ID em **Certificates, IDs & Profiles**
4. Configure o **Provisioning Profile**

### 5.5 Publicar na App Store Connect

1. Acesse [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. **"Meu Apps"** → **"+"** → **"Novo App"**
3. Plataforma: iOS
4. Preencha nome, idioma, Bundle ID, SKU
5. Faça upload do `.ipa` via Xcode ou Transporter
6. Preencha metadados:
   - Descrição (destaque funcionalidades offline)
   - Screenshots (obrigatório: 6,5" e 5,5")
   - Categoria: Estilo de Vida / Referência
7. Submeta para revisão (leva de 1 a 3 dias)

### 5.6 Screenshots necessários para a App Store

| Dispositivo | Tamanho |
|---|---|
| iPhone 6,5" (obrigatório) | 1284×2778px |
| iPhone 5,5" (obrigatório) | 1242×2208px |
| iPad Pro 12,9" (se suportar) | 2048×2732px |

### 5.7 Dica para evitar rejeição

Na descrição do app, mencione explicitamente as funcionalidades offline:

> "Acesse a liturgia diária, os mistérios do rosário e as orações mesmo sem conexão com a internet. O aplicativo armazena o conteúdo localmente para uso offline."

---


## ETAPA 7 — GitHub Actions (CI/CD)

> Automatiza o build e o deploy a cada `git push`.  
> Dois workflows: **CI** (verifica o build em todo PR) e **Deploy** (sobe no Fly.io ao mergear na `main`).

### 7.1 Estrutura de arquivos

Crie a pasta e os dois arquivos na raiz do projeto:

```
.github/
└── workflows/
    ├── ci.yml       ← roda em todo PR e push
    └── deploy.yml   ← deploy automático na main
```

### 7.2 `.github/workflows/ci.yml`

```yaml
name: CI

# Roda em todo PR e push para main/develop
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build & Verify
    runs-on: ubuntu-latest

    steps:
      # ── 1. Checkout do código ──────────────────────────────────────
      - name: Checkout
        uses: actions/checkout@v4

      # ── 2. Setup Ruby ──────────────────────────────────────────────
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: .ruby-version   # usa o 3.2.8 do seu .ruby-version
          bundler-cache: true           # instala gems e faz cache automático

      # ── 3. Setup Node.js ───────────────────────────────────────────
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # ── 4. Instala dependências Node ───────────────────────────────
      - name: Install Node dependencies
        run: npm ci

      # ── 5. Build do frontend (esbuild) ────────────────────────────
      - name: Build frontend
        run: npm run esbuild

      # ── 6. Build do site Bridgetown ───────────────────────────────
      - name: Build Bridgetown site
        run: bundle exec bridgetown build
        env:
          BRIDGETOWN_ENV: production

      # ── 7. Verifica se os arquivos críticos existem no output ─────
      - name: Verify PWA files exist
        run: |
          echo "Verificando arquivos críticos da PWA..."
          test -f output/sw.js          && echo "✅ sw.js"          || echo "❌ sw.js AUSENTE"
          test -f output/manifest.json  && echo "✅ manifest.json"  || echo "❌ manifest.json AUSENTE"
          test -f output/offline.html   && echo "✅ offline.html"   || echo "❌ offline.html AUSENTE"
          test -f output/index.html     && echo "✅ index.html"     || echo "❌ index.html AUSENTE"
          test -f output/404.html       && echo "✅ 404.html"       || echo "❌ 404.html AUSENTE"

          # Falha o CI se sw.js ou manifest.json estiverem ausentes
          test -f output/sw.js && test -f output/manifest.json
```

### 7.3 `.github/workflows/deploy.yml`

```yaml
name: Deploy

# Só faz deploy quando o push for direto na main
on:
  push:
    branches: [main]

  # Permite disparar manualmente pelo GitHub Actions UI
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Fly.io
    runs-on: ubuntu-latest

    steps:
      # ── 1. Checkout ───────────────────────────────────────────────
      - name: Checkout
        uses: actions/checkout@v4

      # ── 2. Setup Ruby ─────────────────────────────────────────────
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: .ruby-version
          bundler-cache: true

      # ── 3. Setup Node.js ──────────────────────────────────────────
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # ── 4. Instala dependências Node ──────────────────────────────
      - name: Install Node dependencies
        run: npm ci

      # ── 5. Build do frontend com minificação (produção) ───────────
      - name: Build frontend (minified)
        run: npm run esbuild   # já tem --minify no script do package.json

      # ── 6. Deploy no Fly.io ───────────────────────────────────────
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master

      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### 7.4 Configurar o token secreto no GitHub (obrigatório)

**Passo 1** — Gere o token no terminal:

```bash
fly tokens create deploy -x 999999h
# Copie o token gerado (começa com fo1_...)
```

**Passo 2** — Adicione ao GitHub:

1. Vá em **Settings** do repositório
2. **Secrets and variables** → **Actions**
3. **New repository secret**
4. Nome: `FLY_API_TOKEN`
5. Valor: cole o token copiado

### 7.5 Como os dois workflows funcionam juntos

```
Você faz push na main
        │
        ├── ci.yml ──────────────────────────────────────────────────────┐
        │    ├── Instala Ruby + gems                                      │
        │    ├── Instala Node + npm                                       │
        │    ├── npm run esbuild                                          │
        │    ├── bridgetown build                                         │
        │    └── Verifica sw.js, manifest.json, index.html no /output    │
        │                                                                 │
        └── deploy.yml ───────────────────────────────────────────────────┘
             ├── Mesmos passos de build
             └── flyctl deploy → Fly.io
```

Ambos rodam em **paralelo** ao push na `main`.  
Se quiser que o deploy aguarde o CI passar, adicione no `deploy.yml`:

```yaml
jobs:
  deploy:

## ETAPA 8 — Lighthouse em produção

Após o deploy no Fly.io, rode o Lighthouse corretamente:

1. Abra **aba anônima** (`Ctrl+Shift+N`)
2. Acesse `https://nome-do-app.fly.dev`
3. Abra DevTools (`F12`) → aba **Lighthouse**
4. Configuração:
   - Mode: **Navigation**
   - Device: **Mobile**
   - Categories: todas marcadas
5. Clique **"Analyze page load"**
6. **Não minimize a janela** até terminar

### Metas de score

| Categoria | Meta |
|---|---|
| Performance | ≥ 80 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |
| PWA | ✅ Instalável |

---

## Resumo de custos

| Item | Custo | Quando |
|---|---|---|
| GitHub | **Gratuito** | Agora |
| Fly.io `.fly.dev` | **Gratuito** | Agora |
| AWS S3 | **Gratuito** (5GB/12 meses) | Quando precisar |
| Google Play (conta dev) | **$25 único** | Antes da Play Store |
| Apple Developer Program | **$99/ano** | Antes da App Store |
| Codemagic (build iOS) | **Gratuito** (500 min/mês) | Antes da App Store |

**Total mínimo para lançar nas duas lojas: ~$124 no primeiro ano**

---

## Troubleshooting

### `fly deploy` falha no build

```bash
# Verifica se o frontend foi buildado
npm run esbuild

# Verifica logs detalhados
fly logs

# Força rebuild completo
fly deploy --no-cache
```

### Service Worker não atualiza

```bash
# No DevTools → Application → Service Workers
# Marque "Update on reload" durante desenvolvimento
# Em produção, o banner de atualização cuida disso automaticamente
```

### PWABuilder rejeita a URL

- Verifique se o `manifest.json` está acessível: `https://seu-app.fly.dev/manifest.json`
- Verifique se o `sw.js` está acessível: `https://seu-app.fly.dev/sw.js`
- Rode o Lighthouse primeiro e garanta score ≥ 80

### App rejeitado na App Store (erro 4.2)

- Adicione funcionalidades offline claras na descrição
- Certifique-se que o app funciona sem internet (SW cacheando corretamente)
- Considere usar **Capacitor** para um wrapper mais nativo

### Canonical URL incorreta no Lighthouse

Certifique-se que o `config/initializers.rb` tem a URL correta antes do deploy:

```ruby
url "https://nome-do-app.fly.dev"
```

---

*Guia gerado para o projeto Grupo de Oração Mãe Rainha — Março 2026*

---


    needs: build   # aguarda o job "build" do ci.yml
```