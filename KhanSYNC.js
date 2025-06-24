(function() {
  if (document.getElementById("khan-sync-panel")) return;

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

  // Sistema de notificação moderno
  function sendToast(message, duration = 4000) {
    const toast = document.createElement("div");
    toast.className = "khan-sync-toast";
    toast.innerHTML = `
      <div class="khan-sync-toast-icon">⚡</div>
      <div class="khan-sync-toast-message">${message}</div>
      <div class="khan-sync-toast-progress"></div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Estilo futurista com efeitos cyberpunk
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'Cyber';
      src: url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
    }
    
    :root {
      --primary: #00ffcc;
      --secondary: #0099ff;
      --dark: #05050d;
      --glow: 0 0 10px var(--secondary), 0 0 20px var(--primary);
    }
    
    @keyframes fadeOut { 0% { opacity: 1 } 100% { opacity: 0 } }
    @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
    @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.7 } }
    @keyframes scanline { 0% { top: 0 } 100% { top: 100% } }
    
    .khan-sync-splash {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0d0d1a, #05050d);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      color: var(--primary);
      font-size: 48px;
      font-family: 'Orbitron', sans-serif;
      font-weight: bold;
      overflow: hidden;
      transition: opacity 1s ease;
    }
    
    .khan-sync-splash::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        rgba(0, 255, 204, 0.1) 0.1em,
        transparent 0.1em
      );
      background-size: 100% 0.3em;
      pointer-events: none;
    }
    
    .khan-sync-splash::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--primary);
      box-shadow: var(--glow);
      animation: scanline 4s linear infinite;
    }
    
    .khan-sync-splash.fadeout { animation: fadeOut 1s ease forwards; }
    
    .khan-sync-logo {
      position: relative;
      animation: float 3s ease-in-out infinite;
      text-shadow: var(--glow);
    }
    
    .khan-sync-loading {
      margin-top: 20px;
      font-size: 16px;
      color: var(--secondary);
    }
    
    .khan-sync-loading::after {
      content: "▮";
      animation: pulse 1s infinite;
      display: inline-block;
    }
    
    .khan-sync-toggle {
      position: fixed;
      bottom: 25px;
      left: 25px;
      width: 60px;
      height: 60px;
      background: rgba(5, 5, 13, 0.9);
      border: 2px solid var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 100000;
      color: var(--primary);
      font-size: 28px;
      font-weight: bold;
      box-shadow: var(--glow);
      font-family: 'Orbitron', sans-serif;
      transition: all 0.3s;
    }
    
    .khan-sync-toggle:hover {
      background: var(--primary);
      color: var(--dark);
      transform: scale(1.05);
    }
    
    .khan-sync-panel {
      position: fixed;
      top: 100px;
      left: 100px;
      width: 350px;
      background: rgba(5, 5, 13, 0.95);
      border-radius: 16px;
      padding: 25px;
      z-index: 99999;
      color: #fff;
      font-family: 'Orbitron', sans-serif;
      box-shadow: var(--glow);
      cursor: grab;
      display: none;
      border: 1px solid var(--primary);
      overflow: hidden;
    }
    
    .khan-sync-panel::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary);
      box-shadow: var(--glow);
      animation: scanline 8s linear infinite;
    }
    
    .khan-sync-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(0, 255, 204, 0.3);
      padding-bottom: 10px;
    }
    
    .khan-sync-title {
      font-weight: bold;
      font-size: 24px;
      color: var(--primary);
      text-shadow: 0 0 10px var(--primary);
      letter-spacing: 1px;
    }
    
    .khan-sync-version {
      font-size: 12px;
      color: var(--secondary);
      font-weight: normal;
    }
    
    .khan-sync-button {
      display: block;
      width: 100%;
      margin: 12px 0;
      padding: 12px;
      background: rgba(10, 10, 20, 0.7);
      color: white;
      border: 1px solid var(--primary);
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-family: 'Orbitron', sans-serif;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    
    .khan-sync-button:hover {
      background: var(--primary);
      color: var(--dark);
      transform: translateY(-2px);
      box-shadow: var(--glow);
    }
    
    .khan-sync-button::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(0, 255, 204, 0.4),
        transparent
      );
      transition: none;
    }
    
    .khan-sync-button:hover::before {
      left: 100%;
      transition: all 1s ease-in-out;
    }
    
    .khan-sync-button.active {
      background: var(--primary);
      color: var(--dark);
      box-shadow: var(--glow);
    }
    
    .khan-sync-input-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 15px 0;
    }
    
    .khan-sync-input-group label {
      font-size: 13px;
      color: var(--secondary);
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 1px;
    }
    
    .khan-sync-input-group input {
      width: 70px;
      background: rgba(10, 10, 20, 0.7);
      color: var(--primary);
      border: 1px solid var(--primary);
      border-radius: 6px;
      padding: 6px;
      text-align: center;
      font-family: 'Orbitron', sans-serif;
    }
    
    .khan-sync-input-group input:focus {
      outline: none;
      box-shadow: var(--glow);
    }
    
    .khan-sync-toast {
      position: fixed;
      bottom: 25px;
      right: 25px;
      background: rgba(5, 5, 13, 0.95);
      color: var(--primary);
      border: 1px solid var(--primary);
      border-radius: 8px;
      padding: 15px 20px;
      margin-top: 10px;
      box-shadow: var(--glow);
      font-size: 14px;
      font-family: 'Orbitron', sans-serif;
      z-index: 999999;
      animation: fadeIn 0.3s ease-out;
      overflow: hidden;
      width: fit-content;
      max-width: 350px;
      display: flex;
      align-items: center;
      backdrop-filter: blur(5px);
    }
    
    .khan-sync-toast.hide {
      animation: fadeOut 0.5s ease forwards;
    }
    
    .khan-sync-toast-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    
    .khan-sync-toast-progress {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 3px;
      background: var(--primary);
      box-shadow: var(--glow);
      animation: toastProgress linear forwards;
      animation-duration: inherit;
      width: 100%;
    }
    
    .khan-sync-toast-message {
      position: relative;
      z-index: 1;
    }
    
    @keyframes toastProgress {
      from { width: 100% }
      to { width: 0% }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px) }
      to { opacity: 1; transform: translateY(0) }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0) }
      to { opacity: 0; transform: translateY(10px) }
    }
  `;
  document.head.appendChild(style);

  // Código original mantido com todas as funcionalidades
  const originalParse = JSON.parse;
  JSON.parse = function(text, reviver) {
    let data = originalParse(text, reviver);
    if (features.revealAnswers && data?.data) {
      try {
        const dataValues = Object.values(data.data);
        for (const val of dataValues) {
          if (val?.item?.itemData) {
            let itemData = JSON.parse(val.item.itemData);
            if (itemData.question?.widgets) {
              for (const widget of Object.values(itemData.question.widgets)) {
                widget.options?.choices?.forEach(choice => {
                  if (choice.correct) {
                    choice.content = "✅ " + choice.content;
                    sendToast("Respostas reveladas! ★");
                  }
                });
              }
            }
            val.item.itemData = JSON.stringify(itemData);
          }
        }
      } catch (e) {}
    }
    return data;
  };

  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    let [input, init] = args;

    if (features.videoSpoof) {
      let requestBody, modifiedBody;
      if (input instanceof Request) {
        requestBody = await input.clone().text().catch(() => null);
      } else if (init?.body) {
        requestBody = init.body;
      }
      
      if (requestBody && requestBody.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          let bodyObj = JSON.parse(requestBody);
          if (bodyObj.variables?.input) {
            const duration = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = duration;
            bodyObj.variables.input.lastSecondWatched = duration;
            modifiedBody = JSON.stringify(bodyObj);
          }
          if (modifiedBody) {
            if (input instanceof Request) {
              args[0] = new Request(input, { body: modifiedBody, ...init });
            } else {
              if (!args[1]) args[1] = {};
              args[1].body = modifiedBody;
            }
          }
        } catch (e) {}
      }
    }
    
    const originalResponse = await originalFetch.apply(this, args);

    if (features.questionSpoof && originalResponse.ok) {
      const clonedResponse = originalResponse.clone();
      try {
        let responseObj = await clonedResponse.json();
        if (responseObj?.data?.assessmentItem?.item?.itemData) {
          const phrases = ["Hack acionado ⚡", "Solução fornecida ★", "Resposta liberada ✅", "Khan SYNC em ação!"];
          let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
          
          itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
          itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "✅ Solução", correct: true }, { content: "❌ Opção errada", correct: false }] } } };
          responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
          
          sendToast("Questão alterada com sucesso! ★");
          return new Response(JSON.stringify(responseObj), { status: 200, statusText: "OK", headers: originalResponse.headers });
        }
      } catch (e) {}
    }

    return originalResponse;
  };

  (async function autoAnswerLoop() {
    while (true) {
      if (features.autoAnswer) {
        const click = (selector) => document.querySelector(selector)?.click();
        click('[data-testid="choice-icon__library-choice-icon"]');
        await delay(100);
        click('[data-testid="exercise-check-answer"]');
        await delay(100);
        click('[data-testid="exercise-next-question"]');
        await delay(100);
        click('._1udzurba');
        click('._awve9b');
        
        const summaryButton = document.querySelector('._1udzurba[data-test-id="end-of-unit-test-next-button"]');
        if (summaryButton?.innerText.toLowerCase().includes("resumo")) {
          sendToast("★ Conclusão automática ativada! ★");
        }
      }
      await delay(config.autoAnswerDelay * 1000);
    }
  })();

  // Tela de splash futurista
  const splash = document.createElement("div");
  splash.className = "khan-sync-splash";
  splash.innerHTML = `
    <div class="khan-sync-logo">KHAN SYNC</div>
    <div class="khan-sync-loading">Inicializando</div>
  `;
  document.body.appendChild(splash);

  (async function initializeUI() {
    // Adicionando fontes para melhorar o estilo
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    // Iniciar Dark Reader se necessário
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader');
    DarkReader.setFetchMethod(window.fetch);
    if (features.darkMode) {
      DarkReader.enable();
    }
    sendToast("Sistema KHAN SYNC online ★", 3000);

    // Remover splash e mostrar controles
    setTimeout(() => {
      splash.classList.add("fadeout");
      setTimeout(() => {
        splash.remove();

        // Botão de alternância futurista
        const toggleBtn = document.createElement("div");
        toggleBtn.innerHTML = "⚡";
        toggleBtn.className = "khan-sync-toggle";
        toggleBtn.onclick = () => {
          const p = document.getElementById("khan-sync-panel");
          p.style.display = p.style.display === "none" ? "block" : "none";
          sendToast(p.style.display === "none" ? "Painel ocultado" : "Controles ativos", 1000);
        };
        document.body.appendChild(toggleBtn);
        
        // Painel futurista completo
        const panel = document.createElement("div");
        panel.id = "khan-sync-panel";
        panel.className = "khan-sync-panel";
        panel.innerHTML = `
          <div class="khan-sync-header">
            <div>
              <span class="khan-sync-title">KHAN SYNC</span>
              <span class="khan-sync
