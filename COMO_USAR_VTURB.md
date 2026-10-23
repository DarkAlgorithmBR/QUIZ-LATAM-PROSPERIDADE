# 🎬 Como Inserir o Vídeo do VTurb na Mini VSL (Vertical 9:16)

A última etapa do Quiz está formatada no padrão **Vertical 9:16**, idêntico ao modelo do seu print!

---

## 📌 Passo 1: Onde Colar o Link ou Código do VTurb

Abra o arquivo `index.html` e desça até a **ETAPA FINAL** (por volta da linha 445).

Você verá o seguinte bloco:

```html
<div id="vturb-player-container" class="vturb-vertical-box">
  
  <!-- 👉 COLE O SEU EMBED / IFRAME DO VTURB AQUI EMBAIXO: -->

</div>
```

Basta colar o código gerado no painel do VTurb aqui dentro!

### Se for Iframe / Link Direto:
```html
<iframe src="SEU_LINK_DO_VTURB_AQUI" frameborder="0" allowfullscreen allow="autoplay"></iframe>
```

### Se for Código JS / Smart Player do VTurb:
```html
<div id="vid_68XXXXXXXXXX" style="position:relative;width:100%;padding: 177.77% 0 0;">
  <img id="thumb_68XXXXXXXXXX" src="https://images.converteai.net/..." style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">
  <div id="backdrop_68XXXXXXXXXX" style="position:absolute;top:0;left:0;width:100%;height:100%;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);"></div>
</div>
<script type="text/javascript" id="scr_68XXXXXXXXXX">
  var s=document.createElement("script");
  s.src="https://scripts.converteai.net/.../players/.../player.js",
  s.async=!0,document.head.appendChild(s);
</script>
```

---

## 🟢 Passo 2: O Botão Verde "ACCEDER A MI SALMO"

O botão verde está salvo e guardado no `index.html`:

```html
<div class="vsl-cta-container" id="vsl-cta" style="display: none;">
  <a href="SEU_LINK_DE_CHECKOUT_AQUI" class="vsl-cta-btn green-btn" id="vsl-cta-link" target="_blank">
    ACCEDER A MI SALMO
  </a>
</div>
```

- **Se você for usar o botão nativo configurado direto no VTurb**:  
  Deixe como está (`display: none;`). O próprio player do VTurb cuidará de mostrar o botão no minuto/segundo exato do pitch do vídeo.

- **Se você quiser que este botão da página apareça**:  
  Basta trocar `style="display: none;"` por `style="display: block;"`, ou se quiser que ele apareça após X segundos de vídeo, chame `setupVturbDelay(segundos)` no `assets/quiz.js`.
