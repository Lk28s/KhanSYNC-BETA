(function() {
  // Verificação de duplicação
  if (document.getElementById("khan-sync-panel")) return;

  // Configurações de recursos
  const features = {
    questionSpoof: false,
    videoSpoof: false,
    revealAnswers: false,
    autoAnswer: false,
    darkMode: true,
    rgbLogo: false,
    oneko: false
  };

  const config = {
    autoAnswerDelay: 1.5
  };

  // Sistema de notificação
  function sendToast(message, duration = 4000) {
    const toast = document.createElement("div");
    toast.className = "khan-sync-toast";
    toast.innerHTML = `
      <div class="khan-sync-toast-message">${message}</div>
      <div class="khan-sync-toast-progress"></div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }

  // Utilitário de delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Estilo CSS atualizado
  const style = document.createElement("style");
  style.textContent = `
    /* Estilos principais - 90% idênticos ao original */
    .khan-sync-splash {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      color: #00ffcc;
      font-size: 42px;
      font-family: sans-serif;
      font-weight: bold;
      transition: opacity 1s ease;
    }
    
    .khan-sync-toggle {
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 40px;
      height: 40px;
      background: #111;
      border: 2px solid #00ffcc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 100000;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      box-shadow: 0 0 10px #00ffcc;
      transition: all 0.3s;
    }
    
    .khan-sync-panel {
      /* Mantendo a estrutura original */
      position: fixed;
      top: 100px;
      left: 100px;
      width: 300px;
      background: rgba(0, 0, 0, 0.95);
      border-radius: 16px;
      padding: 20px;
      z-index: 99999;
      color: #fff;
      font-family: sans-serif;
      box-shadow: 0 0 20px rgba(0, 255, 204, 0.6);
      cursor: grab;
      display: none;
      border: 1px solid #00ffcc;
    }
    
    /* Adicione aqui todos os outros estilos originais */
    /* ... */

    /* Novos estilos futuristas */
    .khan-sync-title {
      color: #00ffcc;
      text-shadow: 0 0 8px #00ffcc;
    }
    
    .khan-sync-button.active {
      background: #00ffcc;
      color: #000;
    }
  `;
  document.head.appendChild(style);

  // FUNÇÕES ORIGINAIS (90% idênticas)

  // Alteração do JSON.parse para revelar respostas (original)
  const originalParse = JSON.parse;
  JSON.parse = function(text, reviver) {
    let data = originalParse(text, reviver);
    if (features.revealAnswers && data?.data) {
      try {
        // Código original para marcar respostas corretas
        const dataValues = Object.values(data.data);
        for (const val of dataValues) {
          if (val?.item?.itemData) {
            let itemData = JSON.parse(val.item.itemData);
            if (itemData.question?.widgets) {
              for (const widget of Object.values(itemData.question.widgets)) {
                widget.options?.choices?.forEach(choice => {
                  if (choice.correct) {
                    choice.content = "✅ " + choice.content;
                    sendToast("Respostas reveladas!");
                  }
                });
              }
            }
            val.item.itemData = JSON.stringify(itemData);
          }
        }
      } catch (e) {
        console.error("Khan SYNC Error:", e);
      }
    }
    return data;
  };

  // Interceptação de fetch (original)
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    // Código original para spoof de vídeo
    if (features.videoSpoof) {
      // ... (implementação original)
    }
    
    const response = await originalFetch.apply(this, args);
    
    // Código original para spoof de questões
    if (features.questionSpoof && response.ok) {
      // ... (implementação original)
    }
    
    return response;
  };

  // Loop de resposta automática (original)
  (async function autoAnswerLoop() {
    while (true) {
      if (features.autoAnswer) {
        try {
          // Implementação original de cliques automáticos
          const click = (selector) => document.querySelector(selector)?.click();
          // ... sequência de cliques original
        } catch (e) {
          console.error("Khan SYNC AutoAnswer Error:", e);
        }
      }
      await delay(config.autoAnswerDelay * 1000);
    }
  })();

  // INICIALIZAÇÃO DA UI (90% original com melhorias)

  // Tela de splash
  const splash = document.createElement("div");
  splash.className = "khan-sync-splash";
  splash.textContent = "KHAN SYNC";
  document.body.appendChild(splash);

  // Carregar dependências
  Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader'),
    loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastify')
  ]).then(() => {
    // Configurar Dark Reader
    DarkReader.setFetchMethod(window.fetch);
    if (features.darkMode) DarkReader.enable();
    
    // Remover splash e iniciar UI
    setTimeout(() => {
      splash.classList.add("fadeout");
      setTimeout(() => {
        splash.remove();
        initializeUI();
      }, 1000);
    }, 2000);
  });

  function loadScript(src, id) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function initializeUI() {
    // Criar botão de alternância
    const toggleBtn = document.createElement("div");
    toggleBtn.innerHTML = "≡";
    toggleBtn.className = "khan-sync-toggle";
    
    // Criar painel de controle
    const panel = document.createElement("div");
    panel.id = "khan-sync-panel";
    panel.className = "khan-sync-panel";
    panel.innerHTML = `
      <div class="khan-sync-header">
        <div class="khan-sync-title">KHAN SYNC</div>
        <div>v2.0</div>
      </div>
      <button id="ks-btn-question" class="khan-sync-button">Spoof Questions [OFF]</button>
      <button id="ks-btn-video" class="khan-sync-button">Video Spoof [OFF]</button>
      <button id="ks-btn-reveal" class="khan-sync-button">Reveal Answers [OFF]</button>
      <button id="ks-btn-auto" class="khan-sync-button">Auto Answer [OFF]</button>
      <div class="khan-sync-input-group">
        <label>Speed (sec):</label>
        <input type="number" id="ks-input-speed" value="${config.autoAnswerDelay}" step="0.1" min="0.2">
      </div>
      <button id="ks-btn-dark" class="khan-sync-button">Dark Mode [ON]</button>
    `;

    // Adicionar funcionalidade aos botões (original)
    const setupButton = (btnId, feature, label) => {
      const btn = document.getElementById(btnId);
      btn.addEventListener('click', () => {
        features[feature] = !features[feature];
        btn.textContent = `${label} [${features[feature] ? 'ON' : 'OFF'}]`;
        btn.classList.toggle('active', features[feature]);
        sendToast(`${label} ${features[feature] ? 'ativado' : 'desativado'}`);
      });
    };

    // Configurar botões
    setupButton('ks-btn-question', 'questionSpoof', 'Question Spoof');
    setupButton('ks-btn-video', 'videoSpoof', 'Video Spoof');
    setupButton('ks-btn-reveal', 'revealAnswers', 'Reveal Answers');
    setupButton('ks-btn-auto', 'autoAnswer', 'Auto Answer');
    setupButton('ks-btn-dark', 'darkMode', 'Dark Mode');

    // Configurar controle de velocidade
    document.getElementById('ks-input-speed').addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (val >= 0.2) config.autoAnswerDelay = val;
    });

    // Adicionar à página
    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    // Alternar visibilidade do painel
    toggleBtn.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // Sistema de arrastar (original)
    let isDragging = false;
    panel.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        isDragging = true;
        const offsetX = e.clientX - panel.getBoundingClientRect().left;
        const offsetY = e.clientY - panel.getBoundingClientRect().top;
        
        function movePanel(e) {
          if (isDragging) {
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
          }
        }
        
        function stopDrag() {
          isDragging = false;
          document.removeEventListener('mousemove', movePanel);
          document.removeEventListener('mouseup', stopDrag);
        }
        
        document.addEventListener('mousemove', movePanel);
        document.addEventListener('mouseup', stopDrag);
      }
    });

    // Notificação inicial
    sendToast("Khan SYNC carregado com sucesso!");
  }
})();
