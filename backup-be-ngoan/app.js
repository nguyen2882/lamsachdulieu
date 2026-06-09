// === 1. HỆ THỐNG AVATAR SVG ĐÁNG YÊU (OFFLINE) ===
const AVATARS = {
  cat: `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="55" r="35" fill="#f59e0b"/>
    <polygon points="20,30 40,45 20,55" fill="#d97706"/>
    <polygon points="80,30 60,45 80,55" fill="#d97706"/>
    <polygon points="25,35 35,45 25,50" fill="#fca5a5"/>
    <polygon points="75,35 65,45 75,50" fill="#fca5a5"/>
    <circle cx="38" cy="55" r="4" fill="#1e293b"/>
    <circle cx="62" cy="55" r="4" fill="#1e293b"/>
    <circle cx="36" cy="53" r="1.5" fill="#fff"/>
    <circle cx="60" cy="53" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="65" rx="4" ry="3" fill="#f43f5e"/>
    <ellipse cx="32" cy="64" rx="5" ry="3" fill="#fecdd3"/>
    <ellipse cx="68" cy="64" rx="5" ry="3" fill="#fecdd3"/>
    <path d="M50,67 Q47,72 42,70 M50,67 Q53,72 58,70" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M25,60 L12,58 M25,64 L10,64 M25,68 L12,70 M75,60 L88,58 M75,64 L90,64 M75,68 L88,70" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  panda: `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="55" r="35" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="22" cy="30" r="11" fill="#1e293b"/>
    <circle cx="78" cy="30" r="11" fill="#1e293b"/>
    <circle cx="22" cy="30" r="5" fill="#475569"/>
    <circle cx="78" cy="30" r="5" fill="#475569"/>
    <ellipse cx="35" cy="55" rx="8" ry="11" fill="#1e293b" transform="rotate(-15, 35, 55)"/>
    <ellipse cx="65" cy="55" rx="8" ry="11" fill="#1e293b" transform="rotate(15, 65, 55)"/>
    <circle cx="35" cy="52" r="3" fill="#ffffff"/>
    <circle cx="65" cy="52" r="3" fill="#ffffff"/>
    <ellipse cx="50" cy="65" rx="4" ry="2.5" fill="#1e293b"/>
    <path d="M50,67 Q47,71 43,69 M50,67 Q53,71 57,69" stroke="#1e293b" stroke-width="2" stroke-linecap="round" fill="none"/>
    <ellipse cx="23" cy="63" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6"/>
    <ellipse cx="77" cy="63" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6"/>
  </svg>`,
  rabbit: `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <rect x="25" y="10" width="13" height="32" rx="6.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="62" y="10" width="13" height="32" rx="6.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="28" y="15" width="7" height="22" rx="3.5" fill="#fca5a5"/>
    <rect x="65" y="15" width="7" height="22" rx="3.5" fill="#fca5a5"/>
    <circle cx="50" cy="58" r="32" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="38" cy="57" r="4" fill="#1e293b"/>
    <circle cx="62" cy="57" r="4" fill="#1e293b"/>
    <circle cx="36" cy="55" r="1.5" fill="#fff"/>
    <circle cx="60" cy="55" r="1.5" fill="#fff"/>
    <polygon points="46,63 54,63 50,67" fill="#f43f5e"/>
    <path d="M50,67 Q47,71 43,69 M50,67 Q53,71 57,69" stroke="#1e293b" stroke-width="2" stroke-linecap="round" fill="none"/>
    <ellipse cx="24" cy="65" rx="5" ry="3.5" fill="#fca5a5" opacity="0.7"/>
    <ellipse cx="76" cy="65" rx="5" ry="3.5" fill="#fca5a5" opacity="0.7"/>
  </svg>`,
  lion: `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M50,15 L58,23 L68,17 L72,27 L82,27 L82,37 L91,42 L87,51 L92,61 L84,67 L85,77 L75,79 L71,88 L61,86 L53,92 L47,92 L39,86 L29,88 L25,79 L15,77 L16,67 L8,61 L13,51 L9,42 L18,37 L18,27 L28,27 L32,17 L42,23 Z" fill="#d97706"/>
    <circle cx="50" cy="55" r="30" fill="#facc15"/>
    <circle cx="28" cy="38" r="7" fill="#d97706"/>
    <circle cx="72" cy="38" r="7" fill="#d97706"/>
    <circle cx="28" cy="38" r="3" fill="#fef08a"/>
    <circle cx="72" cy="38" r="3" fill="#fef08a"/>
    <circle cx="38" cy="53" r="4" fill="#1e293b"/>
    <circle cx="62" cy="53" r="4" fill="#1e293b"/>
    <circle cx="36" cy="51" r="1.5" fill="#fff"/>
    <circle cx="60" cy="51" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="64" rx="7" ry="5" fill="#fef08a"/>
    <polygon points="47,62 53,62 50,65" fill="#1e293b"/>
    <path d="M50,65 L50,68" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="27" cy="61" rx="4" ry="2.5" fill="#f87171" opacity="0.6"/>
    <ellipse cx="73" cy="61" rx="4" ry="2.5" fill="#f87171" opacity="0.6"/>
  </svg>`,
  penguin: `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="55" r="35" fill="#1e293b"/>
    <path d="M20,58 Q8,48 13,38 Q18,40 20,46" fill="#1e293b"/>
    <path d="M80,58 Q92,48 87,38 Q82,40 80,46" fill="#1e293b"/>
    <ellipse cx="50" cy="58" rx="25" ry="28" fill="#ffffff"/>
    <path d="M50,30 C30,30 28,55 35,62 C40,66 45,55 50,55 C55,55 60,66 65,62 C72,55 70,30 50,30 Z" fill="#1e293b"/>
    <ellipse cx="50" cy="58" rx="19" ry="23" fill="#ffffff"/>
    <circle cx="38" cy="48" r="4" fill="#1e293b"/>
    <circle cx="62" cy="48" r="4" fill="#1e293b"/>
    <circle cx="36" cy="46" r="1.5" fill="#fff"/>
    <circle cx="60" cy="46" r="1.5" fill="#fff"/>
    <polygon points="46,52 54,52 50,59" fill="#ea580c"/>
    <ellipse cx="30" cy="56" rx="4" ry="2.5" fill="#fca5a5" opacity="0.7"/>
    <ellipse cx="70" cy="56" rx="4" ry="2.5" fill="#fca5a5" opacity="0.7"/>
  </svg>`,
  fox: `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <polygon points="18,25 38,40 18,55" fill="#ea580c"/>
    <polygon points="82,25 62,40 82,55" fill="#ea580c"/>
    <polygon points="22,29 33,38 23,48" fill="#fca5a5"/>
    <polygon points="78,29 67,38 77,48" fill="#fca5a5"/>
    <circle cx="50" cy="55" r="35" fill="#f97316"/>
    <path d="M15,55 C15,70 30,85 50,85 C70,85 85,70 85,55 C85,52 82,48 80,48 C70,55 60,50 50,55 C40,50 30,55 20,48 C18,48 15,52 15,55 Z" fill="#ffffff"/>
    <circle cx="36" cy="53" r="4" fill="#1e293b"/>
    <circle cx="64" cy="53" r="4" fill="#1e293b"/>
    <circle cx="34" cy="51" r="1.5" fill="#fff"/>
    <circle cx="62" cy="51" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="62" rx="4.5" ry="3.5" fill="#1e293b"/>
    <ellipse cx="25" cy="62" rx="4.5" ry="3" fill="#fca5a5" opacity="0.7"/>
    <ellipse cx="74" cy="62" rx="4.5" ry="3" fill="#fca5a5" opacity="0.7"/>
  </svg>`,
  bear: `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="55" r="35" fill="#78350f"/>
    <circle cx="22" cy="30" r="11" fill="#78350f"/>
    <circle cx="78" cy="30" r="11" fill="#78350f"/>
    <circle cx="22" cy="30" r="6" fill="#fef08a" opacity="0.6"/>
    <circle cx="78" cy="30" r="6" fill="#fef08a" opacity="0.6"/>
    <circle cx="37" cy="52" r="4" fill="#1e293b"/>
    <circle cx="63" cy="52" r="4" fill="#1e293b"/>
    <circle cx="35" cy="50" r="1.5" fill="#fff"/>
    <circle cx="61" cy="50" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="66" rx="11" ry="8" fill="#fef08a" opacity="0.8"/>
    <ellipse cx="50" cy="63" rx="4.5" ry="3" fill="#1e293b"/>
    <path d="M50,65 Q47,68 44,67 M50,65 Q53,68 56,67" stroke="#1e293b" stroke-width="2" stroke-linecap="round" fill="none"/>
    <ellipse cx="26" cy="62" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6"/>
    <ellipse cx="74" cy="62" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6"/>
  </svg>`,
  pig: `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="55" r="35" fill="#fbcfe8"/>
    <path d="M22,28 Q15,15 28,20 Q32,25 22,28" fill="#f472b6"/>
    <path d="M78,28 Q85,15 72,20 Q68,25 78,28" fill="#f472b6"/>
    <circle cx="37" cy="50" r="4" fill="#1e293b"/>
    <circle cx="63" cy="50" r="4" fill="#1e293b"/>
    <circle cx="35" cy="48" r="1.5" fill="#fff"/>
    <circle cx="61" cy="48" r="1.5" fill="#fff"/>
    <ellipse cx="50" cy="62" rx="10" ry="7" fill="#f472b6"/>
    <circle cx="45" cy="62" r="2" fill="#1e293b"/>
    <circle cx="55" cy="62" r="2" fill="#1e293b"/>
    <ellipse cx="23" cy="60" rx="4" ry="2.5" fill="#f472b6" opacity="0.4"/>
    <ellipse cx="77" cy="60" rx="4" ry="2.5" fill="#f472b6" opacity="0.4"/>
  </svg>`
};

// === 2. DỮ LIỆU MẶC ĐỊNH BAN ĐẦU ===
const DEFAULT_HABITS = [
  { id: "habit_1", name: "Đánh răng sạch sẽ sáng & tối", stars: 10, icon: "🪥", completed: false },
  { id: "habit_2", name: "Tự giác học bài & đọc sách 30 phút", stars: 20, icon: "📚", completed: false },
  { id: "habit_3", name: "Giúp bố mẹ rửa bát đĩa sạch sẽ", stars: 15, icon: "🍽️", completed: false },
  { id: "habit_4", name: "Dọn dẹp đồ chơi sau khi chơi xong", stars: 10, icon: "🧸", completed: false },
  { id: "habit_5", name: "Ăn hết suất và ăn thật nhiều rau", stars: 10, icon: "🥦", completed: false },
  { id: "habit_6", name: "Tự đi ngủ đúng giờ (trước 21h30)", stars: 15, icon: "🛌", completed: false }
];

const DEFAULT_REWARDS = [
  { id: "reward_1", name: "Được cả nhà dắt đi ăn kem", stars: 50, icon: "🍦" },
  { id: "reward_2", name: "Thêm 30 phút xem TV hoặc chơi game", stars: 100, icon: "🎮" },
  { id: "reward_3", name: "Mua một món đồ chơi nhỏ xinh", stars: 300, icon: "🎁" },
  { id: "reward_4", name: "Đi xem phim rạp vào cuối tuần", stars: 500, icon: "🎬" }
];

const HABIT_ICONS = ["🪥", "🍽️", "📚", "🧸", "🥦", "🛌", "🧹", "🎒", "💧", "🚴", "🎨", "⭐"];
const REWARD_ICONS = ["🍦", "🎮", "🎁", "🎬", "🎠", "🍰", "🍭", "⚽", "🚲", "🍕", "📖", "🧸"];

const LEVEL_TITLES = [
  "Bé Ngoan Tập Sự",
  "Chiến Binh Chăm Chỉ",
  "Hiệp Sĩ Thói Quen",
  "Dũng Sĩ Tự Giác",
  "Siêu Nhân Tự Lập",
  "Trưởng Thành Vượt Trội"
];

// === 3. QUẢN LÝ TRẠNG THÁI (STATE) VÀ LOCALSTORAGE ===
let state = {
  kidName: "Bé Ngoan",
  stars: 0,
  level: 1,
  avatar: "cat",
  streak: 0,
  lastOpenDate: "",
  soundEnabled: true,
  habits: [...DEFAULT_HABITS],
  rewards: [...DEFAULT_REWARDS],
  yesterdayHabits: []
};

// Hàm tải trạng thái từ localStorage
function loadState() {
  const saved = localStorage.getItem("be_ngoan_state");
  if (saved) {
    try {
      state = JSON.parse(saved);
      // Đảm bảo không bị thiếu các thuộc tính mới nếu có cập nhật cấu trúc
      if (!state.habits || state.habits.length === 0) state.habits = [...DEFAULT_HABITS];
      if (!state.rewards || state.rewards.length === 0) state.rewards = [...DEFAULT_REWARDS];
      if (state.soundEnabled === undefined) state.soundEnabled = true;
      if (!state.yesterdayHabits) state.yesterdayHabits = [];
    } catch (e) {
      console.error("Lỗi parse LocalStorage:", e);
    }
  }
  
  checkDailyReset();
}

// Hàm lưu trạng thái vào localStorage
function saveState() {
  localStorage.setItem("be_ngoan_state", JSON.stringify(state));
}

// Hàm kiểm tra reset thói quen hàng ngày và cập nhật chuỗi streak
function checkDailyReset() {
  const todayStr = new Date().toDateString();
  
  if (state.lastOpenDate !== todayStr) {
    // Nếu là ngày mới
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    // Lưu thành tích của ngày trước đó (yesterday)
    if (state.lastOpenDate === yesterdayStr) {
      // Đúng là ngày hôm qua
      state.yesterdayHabits = state.habits
        .filter(h => h.completed)
        .map(h => ({ name: h.name, icon: h.icon, stars: h.stars }));
    } else {
      // Đã cách nhiều ngày, ngày hôm qua bé không làm việc tốt nào
      state.yesterdayHabits = [];
    }
    
    // Kiểm tra xem hôm qua bé có hoàn thành thói quen nào không
    const completedYesterday = state.habits.some(h => h.completed);
    
    if (state.lastOpenDate === yesterdayStr && completedYesterday) {
      // Tiếp tục chuỗi streak
      // Giữ nguyên chuỗi
    } else if (state.lastOpenDate !== "") {
      // Đứt chuỗi streak (không mở app hoặc không làm việc tốt hôm qua)
      state.streak = 0;
    }
    
    // Reset trạng thái hoàn thành của các thói quen cho ngày mới
    state.habits.forEach(h => h.completed = false);
    
    state.lastOpenDate = todayStr;
    saveState();
  }
}

// === 4. TRÌNH TỔNG HỢP ÂM THANH (WEB AUDIO API - OFFLINE) ===
function playSynthesizedSound(type) {
  if (!state.soundEnabled) return;
  
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    
    if (type === "chime") {
      // Âm thanh chúc mừng (Chime arpeggio đi lên ngọt ngào)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.07);
        
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.07 + 0.25);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(audioCtx.currentTime + index * 0.07);
        osc.stop(audioCtx.currentTime + index * 0.07 + 0.3);
      });
    } else if (type === "levelup") {
      // Âm thanh thăng cấp hoành tráng (Victory fanfare)
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = index === notes.length - 1 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.1);
        
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.1 + 0.35);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(audioCtx.currentTime + index * 0.1);
        osc.stop(audioCtx.currentTime + index * 0.1 + 0.4);
      });
    } else if (type === "undo") {
      // Âm thanh khi hủy chọn (Downward sweep)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(392.00, audioCtx.currentTime); // G4
      osc.frequency.exponentialRampToValueAtTime(261.63, audioCtx.currentTime + 0.18); // C4
      
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch (e) {
    console.warn("Không phát được âm thanh (có thể do trình duyệt chặn AudioContext trước tương tác đầu tiên):", e);
  }
}

// === 5. HIỆU ỨNG PHÁO GIẤY CANVAS CONFETTI ===
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animFrameId = null;

class ConfettiParticle {
  constructor(x, y, isBig = false) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * (isBig ? 12 : 8) + (isBig ? 8 : 4);
    this.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
    this.speedX = Math.random() * (isBig ? 12 : 6) - (isBig ? 6 : 3);
    this.speedY = Math.random() * (isBig ? -14 : -8) - (isBig ? 6 : 4);
    this.gravity = 0.25;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 12 - 6;
    this.opacity = 1;
    this.type = Math.random() > 0.4 ? "rect" : "circle";
  }
  
  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    if (this.y > canvas.height) {
      this.opacity = 0;
    }
  }
  
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    
    if (this.type === "rect") {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.opacity <= 0) {
      particles.splice(index, 1);
    }
  });
  
  if (particles.length > 0) {
    animFrameId = requestAnimationFrame(animateConfetti);
  } else {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

function triggerConfetti(burstCount = 50, isLevelUp = false) {
  const leftX = 50;
  const rightX = canvas.width - 50;
  const bottomY = canvas.height - 40;
  
  if (isLevelUp) {
    // Pháo giấy lớn rực rỡ từ nhiều vị trí
    for (let i = 0; i < burstCount; i++) {
      particles.push(new ConfettiParticle(canvas.width / 2, canvas.height / 2 + 100, true));
      particles.push(new ConfettiParticle(leftX, bottomY, true));
      particles.push(new ConfettiParticle(rightX, bottomY, true));
    }
  } else {
    // Pháo giấy ăn mừng thói quen
    for (let i = 0; i < burstCount / 2; i++) {
      particles.push(new ConfettiParticle(leftX, bottomY));
      particles.push(new ConfettiParticle(rightX, bottomY));
    }
  }
  
  if (!animFrameId) {
    animateConfetti();
  }
}

// === 6. RENDER GIAO DIỆN CHÍNH ===
function getLevelTitle(level) {
  const index = Math.min(level - 1, LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[index];
}

// Hàm hiển thị thành tích ngày hôm qua
function renderYesterdayAchievements() {
  const yesterdayCard = document.getElementById("yesterdayCard");
  const yesterdayList = document.getElementById("yesterdayList");
  
  if (!yesterdayCard || !yesterdayList) return;
  
  // Chỉ hiện card nếu đã có ngày truy cập trước đó (không phải lần đầu mở app)
  if (!state.lastOpenDate) {
    yesterdayCard.style.display = "none";
    return;
  }
  
  yesterdayCard.style.display = "flex";
  yesterdayList.innerHTML = "";
  
  const habits = state.yesterdayHabits || [];
  
  if (habits.length === 0) {
    yesterdayList.innerHTML = `
      <div class="yesterday-empty">
        Hôm qua bé chưa tích lũy được việc ngoan nào. Hôm nay cố lên nhé! 💪
      </div>
    `;
  } else {
    habits.forEach(h => {
      const item = document.createElement("div");
      item.className = "yesterday-item";
      item.innerHTML = `
        <span class="yesterday-item-icon">${h.icon}</span>
        <span class="yesterday-item-text">${h.name}</span>
        <span class="yesterday-item-stars">+${h.stars} ⭐</span>
      `;
      yesterdayList.appendChild(item);
    });
  }
}

function renderDashboard() {
  // Hiển thị thành tích hôm qua
  renderYesterdayAchievements();

  // Cập nhật Profile
  document.getElementById("kidName").textContent = state.kidName;
  document.getElementById("starCounter").textContent = state.stars;
  document.getElementById("streakCounter").textContent = state.streak;
  document.getElementById("currentAvatar").innerHTML = AVATARS[state.avatar] || AVATARS.cat;
  
  // Hiển thị ngày hôm nay
  const options = { weekday: 'long', day: 'numeric', month: 'numeric' };
  document.getElementById("dateDisplay").textContent = new Date().toLocaleDateString('vi-VN', options);

  // Tính toán cấp độ & tiến độ thăng cấp
  // Cứ 100 sao tăng 1 level. Sao lẻ là tiến độ thanh progress bar.
  const currentLevel = Math.floor(state.stars / 100) + 1;
  const currentLevelStars = state.stars % 100;
  const progressPercent = currentLevelStars; // Vì max 100 sao nên % chính bằng số sao lẻ
  
  document.getElementById("levelNumber").textContent = currentLevel;
  document.getElementById("levelTitle").textContent = getLevelTitle(currentLevel);
  document.getElementById("levelProgressBar").style.width = `${progressPercent}%`;
  document.getElementById("starsNeeded").textContent = 100 - currentLevelStars;
  
  if (currentLevel !== state.level) {
    // Nếu bé lên cấp!
    state.level = currentLevel;
    playSynthesizedSound("levelup");
    triggerConfetti(80, true);
    setTimeout(() => {
      alert(`🎉 CHÚC MỪNG CON! Con đã đạt cấp độ mới: Cấp ${currentLevel} - Danh hiệu "${getLevelTitle(currentLevel)}"! Con giỏi quá! 🥳`);
    }, 500);
    saveState();
  }

  // Render danh sách thói quen tốt
  const habitsGrid = document.getElementById("habitsGrid");
  habitsGrid.innerHTML = "";
  
  state.habits.forEach(habit => {
    const card = document.createElement("div");
    card.className = `habit-card ${habit.completed ? 'completed' : ''}`;
    card.onclick = () => toggleHabit(habit.id);
    
    card.innerHTML = `
      <div class="habit-icon-wrapper">${habit.icon}</div>
      <div class="habit-info">
        <span class="habit-title">${habit.name}</span>
        <span class="habit-reward">+${habit.stars} ⭐</span>
      </div>
      <div class="checkbox-container"></div>
    `;
    
    habitsGrid.appendChild(card);
  });

  // Render danh sách quà tặng đổi sao
  const rewardsGrid = document.getElementById("rewardsGrid");
  rewardsGrid.innerHTML = "";
  
  state.rewards.forEach(reward => {
    const card = document.createElement("div");
    card.className = "reward-card";
    
    const canRedeem = state.stars >= reward.stars;
    const progress = Math.min((state.stars / reward.stars) * 100, 100);
    
    card.innerHTML = `
      <div class="reward-icon-wrapper">${reward.icon}</div>
      <div class="reward-info">
        <span class="reward-title">${reward.name}</span>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
          <span class="reward-cost">${reward.stars} ⭐</span>
          <div class="reward-progress-bg">
            <div class="reward-progress-bar" style="width: ${progress}%"></div>
          </div>
        </div>
      </div>
      <button class="btn-redeem" ${canRedeem ? '' : 'disabled'} onclick="redeemReward('${reward.id}')">
        ${canRedeem ? 'Đổi Quà' : 'Chưa đủ'}
      </button>
    `;
    
    rewardsGrid.appendChild(card);
  });
}

// Hàm hoàn thành/Hủy thói quen
function toggleHabit(id) {
  const habit = state.habits.find(h => h.id === id);
  if (!habit) return;
  
  habit.completed = !habit.completed;
  
  if (habit.completed) {
    state.stars += habit.stars;
    // Tăng streak khi bé làm việc đầu tiên trong ngày
    const activeHabitsToday = state.habits.filter(h => h.completed).length;
    if (activeHabitsToday === 1) {
      state.streak += 1;
    }
    playSynthesizedSound("chime");
    triggerConfetti(35);
  } else {
    state.stars = Math.max(0, state.stars - habit.stars);
    // Giảm streak nếu hủy hết việc trong ngày
    const activeHabitsToday = state.habits.filter(h => h.completed).length;
    if (activeHabitsToday === 0) {
      state.streak = Math.max(0, state.streak - 1);
    }
    playSynthesizedSound("undo");
  }
  
  saveState();
  renderDashboard();
}

// Hàm đổi quà
function redeemReward(id) {
  const reward = state.rewards.find(r => r.id === id);
  if (!reward || state.stars < reward.stars) return;
  
  // Xác nhận đổi quà (đảm bảo trẻ em và cha mẹ cùng xác nhận)
  const confirmRedeem = confirm(`Bé muốn đổi ${reward.stars} sao lấy phần thưởng: "${reward.name}" chứ? Hãy nhờ bố mẹ xác nhận cùng nhé!`);
  
  if (confirmRedeem) {
    state.stars -= reward.stars;
    playSynthesizedSound("levelup");
    triggerConfetti(60, true);
    alert(`🎉 Bé đã đổi quà thành công! Hãy đưa màn hình này cho bố mẹ để nhận phần quà nhé: "${reward.name}"`);
    saveState();
    renderDashboard();
  }
}

// === 7. CHỨC NĂNG THAY ĐỔI AVATAR ===
const modalAvatar = document.getElementById("modalAvatar");

document.getElementById("btnChangeAvatar").onclick = () => {
  const grid = document.getElementById("avatarSelectionGrid");
  grid.innerHTML = "";
  
  Object.keys(AVATARS).forEach(key => {
    const item = document.createElement("div");
    item.className = `avatar-option ${state.avatar === key ? 'selected' : ''}`;
    item.innerHTML = AVATARS[key];
    item.onclick = () => {
      state.avatar = key;
      saveState();
      renderDashboard();
      modalAvatar.style.display = "none";
    };
    grid.appendChild(item);
  });
  
  modalAvatar.style.display = "flex";
};

document.getElementById("btnCloseAvatar").onclick = () => {
  modalAvatar.style.display = "none";
};

// === 8. GÓC CHA MẸ (BẢO MẬT & CÀI ĐẶT) ===
const modalSecurity = document.getElementById("modalSecurity");
const modalParentArea = document.getElementById("modalParentArea");
let currentSecurityAnswer = 0;

// Mở khung giải toán để vào cài đặt
document.getElementById("btnParentArea").onclick = () => {
  // Tạo câu hỏi toán ngẫu nhiên đơn giản
  const num1 = Math.floor(Math.random() * 8) + 2; // 2 -> 9
  const num2 = Math.floor(Math.random() * 8) + 2; // 2 -> 9
  currentSecurityAnswer = num1 + num2;
  
  document.getElementById("mathChallenge").textContent = `${num1} + ${num2} = ?`;
  document.getElementById("securityAnswer").value = "";
  modalSecurity.style.display = "flex";
};

// Đóng khung bảo mật
document.getElementById("btnCloseSecurity").onclick = () => {
  modalSecurity.style.display = "none";
};

// Xác nhận giải toán
document.getElementById("securityForm").onsubmit = () => {
  const ans = parseInt(document.getElementById("securityAnswer").value);
  if (ans === currentSecurityAnswer) {
    modalSecurity.style.display = "none";
    openParentArea();
  } else {
    alert("Sai rồi ạ! Phép tính này chỉ dành cho bố mẹ thôi nha.");
    document.getElementById("securityAnswer").value = "";
  }
};

// Đóng Góc Cha Mẹ
document.getElementById("btnCloseParentArea").onclick = () => {
  modalParentArea.style.display = "none";
};

// Điều hướng Tab trong Góc Cha Mẹ
const tabs = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tabPanes.forEach(p => p.classList.remove("active"));
    
    tab.classList.add("active");
    const paneId = tab.getAttribute("data-tab");
    document.getElementById(paneId).classList.add("active");
  };
});

// Mở Góc Cha Mẹ: Load dữ liệu quản lý
function openParentArea() {
  modalParentArea.style.display = "flex";
  
  // Render bộ chọn Icon thói quen
  const iconSelector = document.getElementById("iconSelector");
  iconSelector.innerHTML = "";
  HABIT_ICONS.forEach(icon => {
    const opt = document.createElement("div");
    opt.className = "icon-option";
    opt.textContent = icon;
    opt.onclick = () => {
      document.querySelectorAll("#iconSelector .icon-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      document.getElementById("habitIconInput").value = icon;
    };
    iconSelector.appendChild(opt);
  });
  // Chọn icon đầu tiên làm mặc định
  iconSelector.children[0].click();

  // Render bộ chọn Icon phần thưởng
  const rewardIconSelector = document.getElementById("rewardIconSelector");
  rewardIconSelector.innerHTML = "";
  REWARD_ICONS.forEach(icon => {
    const opt = document.createElement("div");
    opt.className = "icon-option";
    opt.textContent = icon;
    opt.onclick = () => {
      document.querySelectorAll("#rewardIconSelector .icon-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      document.getElementById("rewardIconInput").value = icon;
    };
    rewardIconSelector.appendChild(opt);
  });
  // Chọn icon đầu tiên làm mặc định
  rewardIconSelector.children[0].click();

  // Tên bé & Âm thanh trong tab Thiết Lập
  document.getElementById("kidNameInput").value = state.kidName;
  document.getElementById("soundToggle").checked = state.soundEnabled;

  renderAdminLists();
}

// Render danh sách quản lý (Thêm/Xóa)
function renderAdminLists() {
  // Danh sách thói quen quản lý
  const adminHabitsList = document.getElementById("adminHabitsList");
  adminHabitsList.innerHTML = "";
  state.habits.forEach(habit => {
    const item = document.createElement("div");
    item.className = "admin-list-item";
    item.innerHTML = `
      <div class="admin-item-info">
        <span>${habit.icon}</span>
        <span>${habit.name} (+${habit.stars}⭐)</span>
      </div>
      <button class="btn-delete-item" onclick="deleteHabit('${habit.id}')" title="Xóa thói quen">🗑️</button>
    `;
    adminHabitsList.appendChild(item);
  });

  // Danh sách quà quản lý
  const adminRewardsList = document.getElementById("adminRewardsList");
  adminRewardsList.innerHTML = "";
  state.rewards.forEach(reward => {
    const item = document.createElement("div");
    item.className = "admin-list-item";
    item.innerHTML = `
      <div class="admin-item-info">
        <span>${reward.icon}</span>
        <span>${reward.name} (-${reward.stars}⭐)</span>
      </div>
      <button class="btn-delete-item" onclick="deleteReward('${reward.id}')" title="Xóa quà tặng">🗑️</button>
    `;
    adminRewardsList.appendChild(item);
  });
}

// Xử lý thêm thói quen mới
document.getElementById("formAddHabit").onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("habitNameInput").value.trim();
  const stars = parseInt(document.getElementById("habitStarsInput").value);
  const icon = document.getElementById("habitIconInput").value;
  
  if (!name) return;
  
  const newHabit = {
    id: "habit_" + Date.now(),
    name: name,
    stars: stars,
    icon: icon,
    completed: false
  };
  
  state.habits.push(newHabit);
  saveState();
  renderDashboard();
  renderAdminLists();
  
  // Reset form
  document.getElementById("habitNameInput").value = "";
  document.getElementById("habitStarsInput").value = "10";
};

// Xóa thói quen
window.deleteHabit = function(id) {
  if (confirm("Cha mẹ chắc chắn muốn xóa thói quen này chứ?")) {
    state.habits = state.habits.filter(h => h.id !== id);
    saveState();
    renderDashboard();
    renderAdminLists();
  }
};

// Xử lý thêm phần thưởng mới
document.getElementById("formAddReward").onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("rewardNameInput").value.trim();
  const stars = parseInt(document.getElementById("rewardStarsInput").value);
  const icon = document.getElementById("rewardIconInput").value;
  
  if (!name) return;
  
  const newReward = {
    id: "reward_" + Date.now(),
    name: name,
    stars: stars,
    icon: icon
  };
  
  state.rewards.push(newReward);
  saveState();
  renderDashboard();
  renderAdminLists();
  
  // Reset form
  document.getElementById("rewardNameInput").value = "";
  document.getElementById("rewardStarsInput").value = "100";
};

// Xóa quà
window.deleteReward = function(id) {
  if (confirm("Cha mẹ chắc chắn muốn xóa phần thưởng này chứ?")) {
    state.rewards = state.rewards.filter(r => r.id !== id);
    saveState();
    renderDashboard();
    renderAdminLists();
  }
};

// Thiết lập: Đổi tên bé
document.getElementById("kidNameInput").oninput = (e) => {
  state.kidName = e.target.value.trim() || "Bé Ngoan";
  saveState();
  renderDashboard();
};

// Thiết lập: Bật/Tắt âm thanh
document.getElementById("soundToggle").onchange = (e) => {
  state.soundEnabled = e.target.checked;
  saveState();
};

// Thiết lập: Đặt lại Sao về 0
document.getElementById("btnResetStars").onclick = () => {
  if (confirm("⚠️ Cha mẹ có chắc chắn muốn ĐẶT LẠI số sao tích lũy và cấp độ của bé về 0? Tất cả nỗ lực sẽ làm lại từ đầu.")) {
    state.stars = 0;
    state.level = 1;
    state.streak = 0;
    state.habits.forEach(h => h.completed = false);
    saveState();
    renderDashboard();
    alert("Đã đặt lại dữ liệu tiến độ về 0!");
  }
};

// Thiết lập: Cài đặt lại mặc định (Reset All)
document.getElementById("btnResetAll").onclick = () => {
  if (confirm("🚨 CHÚ Ý NGUY HIỂM! Hành động này sẽ xóa hoàn toàn tất cả thói quen tự tạo, phần thưởng tự tạo, và đưa toàn bộ ứng dụng về trạng thái mới ban đầu. Cha mẹ chắc chắn chứ?")) {
    localStorage.removeItem("be_ngoan_state");
    state = {
      kidName: "Bé Ngoan",
      stars: 0,
      level: 1,
      avatar: "cat",
      streak: 0,
      lastOpenDate: "",
      soundEnabled: true,
      habits: [...DEFAULT_HABITS],
      rewards: [...DEFAULT_REWARDS]
    };
    saveState();
    renderDashboard();
    modalParentArea.style.display = "none";
    alert("Đã cài đặt lại toàn bộ ứng dụng về mặc định!");
  }
};

// === 9. LIÊN KẾT ĐÓNG MODAL KHI CLICK RA NGOÀI ===
window.onclick = (event) => {
  if (event.target === modalSecurity) {
    modalSecurity.style.display = "none";
  } else if (event.target === modalParentArea) {
    modalParentArea.style.display = "none";
  } else if (event.target === modalAvatar) {
    modalAvatar.style.display = "none";
  }
};

// Cài đặt sự kiện click mở rộng/thu gọn card thành tích hôm qua
const yesterdayCard = document.getElementById("yesterdayCard");
if (yesterdayCard) {
  yesterdayCard.onclick = () => {
    yesterdayCard.classList.toggle("expanded");
  };
}

// === 10. HỖ TRỢ CÀI ĐẶT PWA OFFLINE (ADD TO HOME SCREEN) ===
let deferredPrompt;
const installBanner = document.getElementById("installBanner");
const btnInstallApp = document.getElementById("btnInstallApp");
const installInstructions = document.getElementById("installInstructions");

// Bắt sự kiện đề xuất cài đặt của Chrome/Android/Windows
window.addEventListener("beforeinstallprompt", (e) => {
  // Ngăn chặn trình duyệt tự động hiển thị hộp thoại
  e.preventDefault();
  // Lưu sự kiện để kích hoạt sau
  deferredPrompt = e;
  
  // Hiển thị banner cài đặt tùy chỉnh
  installBanner.style.display = "flex";
  btnInstallApp.style.style = "block";
  btnInstallApp.style.display = "block";
  installInstructions.innerHTML = "Nhấn nút <strong>'Cài Đặt Ngay'</strong> bên dưới để ghim biểu tượng trò chơi ra màn hình chính, khởi chạy mượt mà giống như một ứng dụng tải từ App Store.";
});

btnInstallApp.onclick = () => {
  if (!deferredPrompt) return;
  
  // Hiển thị hộp thoại cài đặt của trình duyệt
  deferredPrompt.prompt();
  
  // Chờ người dùng phản hồi
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("Người dùng chấp nhận cài đặt ứng dụng PWA");
      installBanner.style.display = "none";
    } else {
      console.log("Người dùng từ chối cài đặt ứng dụng PWA");
    }
    deferredPrompt = null;
  });
};

// Phát hiện hệ điều hành iOS (Safari không có beforeinstallprompt)
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

// Xử lý hiển thị hướng dẫn cài đặt trên iOS Safari
if (isIOS() && !isStandalone()) {
  installBanner.style.display = "flex";
  btnInstallApp.style.display = "none";
  installInstructions.innerHTML = "Bé hoặc cha mẹ hãy nhấn nút <strong>Chia sẻ 📤</strong> ở thanh công cụ Safari của iPhone/iPad, sau đó kéo xuống chọn <strong>'Thêm vào MH chính' ➕</strong> (Add to Home Screen) để cài biểu tượng trò chơi nhé!";
}

// Nút đóng banner
document.getElementById("btnCloseBanner").onclick = () => {
  installBanner.style.display = "none";
};

// Đăng ký Service Worker để chạy offline
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(reg => {
        console.log("Service Worker đăng ký thành công với scope: ", reg.scope);
      })
      .catch(err => {
        console.error("Service Worker đăng ký thất bại: ", err);
      });
  });
}

// === 11. KHỞI CHẠY LẦN ĐẦU TIÊN ===
loadState();
renderDashboard();
