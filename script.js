function revealSurprise() {
  const message = document.getElementById("secretMessage");
  const button = document.getElementById("revealBtn");
  message.classList.add("show");
  button.textContent = "Surprise Opened! 💖";
  button.disabled = true;
  createFloatingHearts(24);
}

let micStream = null;
let audioContext = null;
let micAnimation = null;
let candleOff = false;

async function startBlowDetection() {
  if (candleOff) return;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    document.getElementById("cakeStatus").textContent =
      "Mic unavailable here. Use the button below! 💗";
    return;
  }

  try {
    document.getElementById("cakeStatus").textContent =
      "Allow microphone access, then blow gently! 💨";

    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();

    const source = audioContext.createMediaStreamSource(micStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    const samples = new Uint8Array(analyser.fftSize);
    const threshold = 0.055;

    document.getElementById("cakeStatus").textContent =
      "Blow gently towards your phone microphone! 🎂💨";

    function listenForBlow() {
      if (candleOff) return;
      analyser.getByteTimeDomainData(samples);
      let total = 0;

      for (let i = 0; i < samples.length; i++) {
        const value = (samples[i] - 128) / 128;
        total += value * value;
      }

      const volume = Math.sqrt(total / samples.length);
      if (volume > threshold) {
        extinguishCandle();
        return;
      }
      micAnimation = requestAnimationFrame(listenForBlow);
    }

    listenForBlow();
  } catch (error) {
    document.getElementById("cakeStatus").textContent =
      "Mic permission nahi mili. Manual button tap karo! 💗";
  }
}

function extinguishCandle() {
  if (candleOff) return;
  candleOff = true;

  if (micAnimation) cancelAnimationFrame(micAnimation);
  if (micStream) micStream.getTracks().forEach(track => track.stop());
  if (audioContext && audioContext.state !== "closed") audioContext.close();

  document.getElementById("flame").classList.add("off");
  document.getElementById("smoke").classList.add("show");
  document.getElementById("cakeStatus").textContent =
    "Yayyy! Candle bujh gayi! Happy Birthday Vishuuu! 🥹❤️";
  document.getElementById("cakeWish").classList.add("show");

  const micButton = document.getElementById("micButton");
  micButton.textContent = "Candle Blown! ❤️";
  micButton.disabled = true;

  createFloatingHearts(25);
}

function createFloatingHearts(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      const emojis = ["💗", "💖", "💕", "✨", "🎉"];
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.fontSize = (18 + Math.random() * 20) + "px";
      heart.style.animationDuration = (3 + Math.random() * 3) + "s";
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 6500);
    }, i * 100);
  }
}
