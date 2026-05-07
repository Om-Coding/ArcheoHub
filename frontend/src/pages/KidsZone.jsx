import { useState, useEffect, useRef, useCallback } from 'react';
import { Pickaxe, Timer, Coins, Store, CircleAlert, Trophy, ShieldAlert, BadgeInfo, Backpack, HelpCircle, X, Sparkles } from 'lucide-react';

/* ============================================================
   LEVEL DATA — 15 Unique Historical Artifacts
   ============================================================ */
const LEVEL_DATA = [
  { name:"Obsidian Arrowhead", icon:"💎", frag:4, dirt:[1,2], shape:[[2,2],[2,3],[3,2],[3,3]],
    desc:"A sharp volcanic glass point used for hunting.",
    flavor:"The narrow passageway opens into a shallow alcove. Sunlight still filters through. You spot a dark gleam in packed earth…",
    period:"~10,000 BCE", culture:"Various Indigenous Peoples", location:"The Americas, Africa & Mesoamerica", material:"Volcanic glass (obsidian)",
    facts:["Obsidian is up to 500× sharper than surgical steel — surgeons still use obsidian blades today!","Ancient peoples traded obsidian over thousands of miles, making it one of the first long-distance trade goods.","No two obsidian arrowheads are identical; each was carefully hand-knapped into shape by a skilled flint-knapper."],
    q:"What material is this arrowhead primarily made of?", opts:["Limestone","Volcanic Glass","Wood","Bronze"], ans:"Volcanic Glass" },
  { name:"Roman Denarius", icon:"🪙", frag:4, dirt:[2,3], shape:[[2,2],[2,3],[3,2]],
    desc:"A silver coin bearing the profile of an emperor.",
    flavor:"Deeper now. The air grows cooler. Your lantern catches a metallic flash embedded in crumbling sandstone…",
    period:"211 BCE – 244 CE", culture:"Ancient Rome", location:"Throughout the Roman Empire", material:"Silver (later debased with copper)",
    facts:["The word 'money' comes from the Roman goddess Juno Moneta, in whose temple coins were minted.","A Roman soldier's annual pay was 225 denarii — that's how important this coin was to everyday life.","By the 3rd century CE, emperors reduced the silver content to fund wars, causing one of history's first inflations!"],
    q:"What was a common silver coin of Ancient Rome called?", opts:["Drachma","Denarius","Shekel","Florin"], ans:"Denarius" },
  { name:"Egyptian Amulet", icon:"🧿", frag:3, dirt:[3,4], shape:[[2,2],[3,2],[4,2]],
    desc:"A small blue faience amulet shaped like an Eye of Horus.",
    flavor:"Strange markings appear on the walls — hieroglyphs? A blue glow pulses from beneath calcified clay…",
    period:"3000 BCE – 300 CE", culture:"Ancient Egypt", location:"Nile Valley, Egypt", material:"Faience (glazed quartz paste)",
    facts:["Ancient Egyptians wore amulets from birth to the grave — and placed them inside mummies for protection in the afterlife!","The Eye of Horus was also used as a mathematical fraction system, where each part of the eye represented a different fraction.","Faience production was one of Egypt's first industrial crafts, made by grinding quartz crystals into a glassy paste."],
    q:"What did the Eye of Horus symbolize?", opts:["Protection","Farming","War","Death"], ans:"Protection" },
  { name:"Viking Brooch", icon:"🛡️", frag:3, dirt:[3,5], shape:[[2,2],[2,3],[3,2],[3,3]],
    desc:"An intricately carved bronze oval brooch.",
    flavor:"A frigid underground draft carries the scent of iron. Frost clings to the rock face…",
    period:"793 – 1066 CE", culture:"Norse / Viking", location:"Scandinavia & Northern Europe", material:"Cast bronze (sometimes silver or gold)",
    facts:["Vikings used brooches to fasten their cloaks — the more elaborate the brooch, the higher your social rank!","Oval brooches were worn in pairs on women's dresses, connected by chains holding small tools like scissors and needles.","Viking jewelry has been found from Iceland all the way to Constantinople, showing how far these explorers ranged."],
    q:"What material were Viking brooches typically cast in?", opts:["Gold","Bronze","Iron","Tin"], ans:"Bronze" },
  { name:"Mayan Jade Mask", icon:"🗿", frag:3, dirt:[4,6], shape:[[2,2],[2,3],[3,2]],
    desc:"A burial mask crafted from tessellated jade tiles.",
    flavor:"The passage widens into a ceremonial chamber. Serpent carvings line the walls. A jade glimmer beckons…",
    period:"250 – 900 CE", culture:"Classic Maya", location:"Mesoamerica (Mexico & Guatemala)", material:"Jade tiles & stucco",
    facts:["The Maya valued jade more than gold — it symbolized water, life, and the maize god who fed the world.","Burial masks like this were placed over the face of kings so their spirit could be recognised in the afterlife.","The most famous jade mask belongs to Pakal the Great, a Mayan king buried in 683 CE — it is made of 340 individual jade pieces!"],
    q:"Why did the Maya highly value jade?", opts:["It was cheap","Soft to carve","Green symbolized life","It was magnetic"], ans:"Green symbolized life" },
  { name:"Greek Amphora", icon:"🏺", frag:2, dirt:[5,7], shape:[[1,2],[2,2],[3,2],[4,2]],
    desc:"A large terracotta jug with two handles.",
    flavor:"Water seeps through limestone. The ground here is soft and silty. A curved rim peeks out like a buried smile…",
    period:"900 – 31 BCE", culture:"Ancient Greece", location:"Mediterranean region", material:"Terracotta (fired clay)",
    facts:["Amphorae were the shipping containers of the ancient world — used to transport wine, olive oil, fish sauce, and grain across the sea.","Archaeologists have found thousands of amphorae on the seabed of the Mediterranean, still containing ancient food!","Each Greek city-state had a unique amphora shape, so traders instantly knew where goods had come from."],
    q:"What was a Greek Amphora primarily used to store?", opts:["Wine and Oil","Gold","Swords","Scrolls"], ans:"Wine and Oil" },
  { name:"Sumerian Tablet", icon:"📜", frag:2, dirt:[6,8], shape:[[2,2],[2,3],[2,4]],
    desc:"A clay tablet covered in wedge-shaped cuneiform script.",
    flavor:"You squeeze through a fissure into a sealed chamber. The air is stale — untouched for millennia…",
    period:"3400 – 2000 BCE", culture:"Ancient Sumer (Mesopotamia)", location:"Modern-day Iraq & Syria", material:"Baked clay",
    facts:["Cuneiform is the world's oldest known writing system, invented over 5,000 years ago to track grain and livestock.","The world's oldest story — the Epic of Gilgamesh — was written on tablets just like this one!","Scribal schools existed where children spent years learning the hundreds of cuneiform signs — it was as hard as learning Chinese characters."],
    q:"What is Sumerian writing called?", opts:["Hieroglyphics","Cuneiform","Runes","Kanji"], ans:"Cuneiform" },
  { name:"Samurai Kabuto", icon:"🪖", frag:2, dirt:[7,9], shape:[[2,2],[2,3],[3,2],[3,3]],
    desc:"An ornate iron and leather helmet worn by Japanese warriors.",
    flavor:"The cave narrows. You feel the mountain's weight above. A metallic dome protrudes from the wall…",
    period:"900 – 1600 CE", culture:"Feudal Japan", location:"Japan", material:"Iron plates, leather & silk cords",
    facts:["A master armourer could spend an entire year crafting a single kabuto from hundreds of tiny iron scales laced together.","The dramatic crest on top (called a 'maedate') identified the warrior's clan in battle — some were shaped like antlers, dragons, or moons!","Kabuto helmets were so well-made that some Japanese families still own — and wear — 400-year-old examples today."],
    q:"What class of warrior wore the Kabuto?", opts:["Ninja","Samurai","Monk","Emperor"], ans:"Samurai" },
  { name:"Celtic Torc", icon:"📿", frag:2, dirt:[8,10], shape:[[2,2],[2,3],[2,4]],
    desc:"A rigid neck ring twisted from pure gold.",
    flavor:"A quartz vein glitters like stars. Among the crystals, something man-made coils within the stone…",
    period:"800 BCE – 100 CE", culture:"Celtic Europe", location:"Britain, France & Ireland", material:"Twisted gold, silver or bronze",
    facts:["Only kings, queens, and gods were depicted wearing torcs — putting one on was a declaration of royalty!","The twisting technique requires incredible skill: craftsmen had to twist thick ropes of metal without snapping them.","The largest torcs found weigh over 1 kg of solid gold — worth tens of thousands of pounds today."],
    q:"Where was a Torc traditionally worn?", opts:["Wrist","Ankle","Neck","Waist"], ans:"Neck" },
  { name:"Terracotta Soldier", icon:"🧍", frag:1, dirt:[9,11], shape:[[1,2],[2,2],[3,2],[4,2],[5,2]],
    desc:"A life-sized sculpted clay warrior.",
    flavor:"An impossibly vast subterranean hall. Rows of half-buried figures stand at attention. One face stares back…",
    period:"210 BCE", culture:"Qin Dynasty, China", location:"Xi'an, Shaanxi Province, China", material:"Fired terracotta clay",
    facts:["Emperor Qin Shi Huang's army contains over 8,000 soldiers, 130 chariots, and 670 horses — and no two faces are exactly alike!","The army was discovered in 1974 by local farmers digging a well — one of the greatest archaeological discoveries of the 20th century.","The soldiers were originally painted in vivid colours — red, green, black, and pink. Exposure to air caused the paint to vanish within minutes of being uncovered."],
    q:"What was the purpose of the Terracotta Army?", opts:["Art exhibit","Protect Emperor in afterlife","Scare birds","Hold up roof"], ans:"Protect Emperor in afterlife" },
  { name:"Aztec Macuahuitl", icon:"🏏", frag:1, dirt:[10,12], shape:[[1,2],[2,2],[3,2],[4,2]],
    desc:"A wooden club embedded with obsidian blades.",
    flavor:"Volcanic stone, black and glassy. Scratch marks line the walls. A long shape lies entombed in ash…",
    period:"1300 – 1521 CE", culture:"Aztec Empire", location:"Central Mexico (Tenochtitlán)", material:"Oak wood & obsidian blades",
    facts:["Spanish conquistadors wrote that the macuahuitl was so powerful it could slice off a horse's head in a single blow!","The obsidian blades slotted into grooves along the sides were replaced after they broke, just like modern razor blade cartridges.","No original macuahuitl has survived to the present day — every museum replica is built from historical illustrations and accounts."],
    q:"What was the Macuahuitl primarily?", opts:["Farming tool","Building tool","Weapon","Instrument"], ans:"Weapon" },
  { name:"Incan Quipu", icon:"🧶", frag:1, dirt:[11,14], shape:[[2,2],[3,2],[4,2]],
    desc:"Colored, knotted strings for record-keeping.",
    flavor:"The altitude is punishing. This high-altitude cave is bone-dry. Fragile threads dangle from a calcified overhang…",
    period:"1400 – 1532 CE", culture:"Inca Empire", location:"Andes Mountains, South America", material:"Spun llama & alpaca wool",
    facts:["The Inca had no written language — quipus were their 'books', capable of recording census data, tax records, and histories.","A professional quipu-keeper was called a 'quipucamayoc' and served directly under the emperor as a trusted record-keeper.","Archaeologists are still trying to fully decode quipus — some researchers believe they may record stories and songs, not just numbers!"],
    q:"What did the Inca use the Quipu for?", opts:["Fishing","Record keeping","Clothing","Weapons"], ans:"Record keeping" },
  { name:"Persian Rhyton", icon:"🍷", frag:1, dirt:[12,16], shape:[[2,2],[2,3],[3,3]],
    desc:"An ornate conical drinking vessel shaped like a ram's head.",
    flavor:"Lapis lazuli deposits cast an otherworldly blue glow. In a niche, the remnant of a royal feast awaits…",
    period:"550 – 330 BCE", culture:"Achaemenid Persian Empire", location:"Modern-day Iran", material:"Gilded silver or gold",
    facts:["Liquid poured from a hole at the animal's mouth at the bottom — you had to drain the whole cup without putting it down!","Rhytons were displayed at royal Persian banquets to show off wealth; the more elaborate, the more powerful the host.","Persian rhytons have been found from Greece to Afghanistan, showing how far the empire's trade and influence extended."],
    q:"What is a Persian Rhyton?", opts:["Drinking horn","Musical instrument","Dagger","Crown"], ans:"Drinking horn" },
  { name:"Neanderthal Flute", icon:"🎺", frag:1, dirt:[14,18], shape:[[2,2],[2,3],[3,2]],
    desc:"A cave bear femur hollowed out with precise finger holes.",
    flavor:"So deep that silence becomes a sound. Your fingers brush something impossibly old — bone, shaped with care…",
    period:"~60,000 BCE", culture:"Neanderthals", location:"Divje Babe Cave, Slovenia", material:"Cave bear femur (leg bone)",
    facts:["If confirmed as man-made, this is the world's oldest musical instrument — older than modern humans in Europe!","Its existence suggests Neanderthals may have been capable of music, language, and complex thought, just like us.","Some scientists debate whether the holes are natural (made by animal teeth) or deliberate — the mystery makes it one of archaeology's greatest puzzles."],
    q:"What is this paleolithic flute made from?", opts:["Wood","Bone","Clay","Stone"], ans:"Bone" },
  { name:"Antikythera Mechanism", icon:"⚙️", frag:1, dirt:[15,20], shape:[[2,2]],
    desc:"A heavily encrusted bronze geared device — the world's first analog computer.",
    flavor:"The deepest point. No living thing has reached this depth. A single bronze gear, green with patina, juts from the rock…",
    period:"~100 BCE", culture:"Ancient Greece", location:"Antikythera shipwreck, Greece", material:"Bronze gears & wooden casing",
    facts:["It could predict solar and lunar eclipses, track the positions of planets, and even calculate the schedule of the Olympic Games!","Nothing as mechanically complex was built again until European clock-makers reinvented geared mechanisms in the 14th century CE.","Modern X-ray imaging has revealed over 30 interlocking bronze gears — scientists are still discovering new functions it performed."],
    q:"The Antikythera Mechanism is considered the first what?", opts:["Clock","Analog Computer","Compass","Engine"], ans:"Analog Computer" }
];

/* ============================================================
   GAME ENGINE CLASSES
   ============================================================ */

class Particle {
  constructor(x, y, color, size, velocity) {
    this.x = x; this.y = y; this.color = color; this.size = size; this.velocity = velocity;
    this.life = 1.0; this.decay = 0.02 + Math.random() * 0.05;
  }
  update() {
    this.x += this.velocity.x; this.y += this.velocity.y; this.velocity.y += 0.15; // Gravity
    this.life -= this.decay;
  }
  draw(ctx) {
    ctx.globalAlpha = this.life; ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1.0;
  }
}

export default function KidsZone() {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('HUB');
  const [levelIdx, setLevelIdx] = useState(0);
  const [money, setMoney] = useState(0);
  const [showHelp, setShowHelp] = useState(true);
  const [showFacts, setShowFacts] = useState(false);

  // Economy & Upgrades
  const [toolLevel, setToolLevel] = useState(1);
  const [invUpgradeLevel, setInvUpgradeLevel] = useState(1);
  const toolPower = toolLevel;
  const toolSens = Math.max(0, 0.12 - ((toolLevel - 1) * 0.04));
  const toolCost = Math.floor(30 * Math.pow(1.35, toolLevel - 1));
  const maxArtifactSlots = 1 + invUpgradeLevel;
  const invUpgradeCost = Math.floor(30 * Math.pow(1.10, invUpgradeLevel - 1));

  // Game State
  const [inventory, setInventory] = useState([]);
  const [quizQueue, setQuizQueue] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [lastQuizCorrect, setLastQuizCorrect] = useState(null);
  const [grid, setGrid] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [artifactHP, setArtifactHP] = useState(3);
  const [combo, setCombo] = useState(0);
  const [showIntroText, setShowIntroText] = useState(false);

  // Refs for Game Loop (Prevents stale closures)
  const stateRef = useRef({ 
    phase, 
    playerPos: { x: 450, y: 220 }, 
    grid: [], 
    particles: [], 
    frame: 0, 
    swinging: false, 
    facing: 'right',
    shake: 0
  });
  const currentDef = LEVEL_DATA[levelIdx] || LEVEL_DATA[14];

  // Sync state to ref
  useEffect(() => { stateRef.current.phase = phase; }, [phase]);
  useEffect(() => { stateRef.current.grid = grid; }, [grid]);

  /* ------------------------------------------------------------
     INITIALIZE LEVEL
     ------------------------------------------------------------ */
  const startLevel = useCallback(() => {
    if (inventory.length >= maxArtifactSlots) return;
    setArtifactHP(currentDef.frag); setTimeLeft(45); setCombo(0);
    let g = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
      const isA = currentDef.shape.some(([ar, ac]) => ar === r && ac === c);
      const hp = isA ? 0 : Math.floor(Math.random() * (currentDef.dirt[1] - currentDef.dirt[0] + 1)) + currentDef.dirt[0];
      g.push({ id: r * 6 + c, r, c, isArtifact: isA, hp, maxHp: hp });
    }
    setGrid(g); stateRef.current.grid = g;
    setShowIntroText(true);
    setTimeout(() => { setShowIntroText(false); setPhase('CARVING'); }, 3000);
  }, [inventory.length, maxArtifactSlots, currentDef]);

  // Timer Countdown
  useEffect(() => {
    if (phase !== 'CARVING') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setPhase('FAILED');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  /* ------------------------------------------------------------
     THE GAME LOOP (Canvas Engine)
     ------------------------------------------------------------ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const { phase, playerPos, grid, particles, swinging, facing } = stateRef.current;
      stateRef.current.frame++;
      
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (phase === 'HUB') {
        drawHub(ctx, playerPos, facing, stateRef.current.frame);
      } else if (phase === 'CARVING') {
        drawCarving(ctx, grid, playerPos, swinging, facing, particles, stateRef.current.frame);
      }

      // Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  /* ------------------------------------------------------------
     RENDERERS
     ------------------------------------------------------------ */
  const drawHub = (ctx, pos, facing, frame) => {
    // Screen Shake
    if (stateRef.current.shake > 0) {
      ctx.save();
      ctx.translate((Math.random()-0.5)*stateRef.current.shake, (Math.random()-0.5)*stateRef.current.shake);
      stateRef.current.shake *= 0.9;
      if (stateRef.current.shake < 0.1) stateRef.current.shake = 0;
    }

    // Sky & Parallax Clouds
    const skyGrd = ctx.createLinearGradient(0, 0, 0, 340);
    skyGrd.addColorStop(0, '#7ec0ee'); skyGrd.addColorStop(1, '#4a8aae');
    ctx.fillStyle = skyGrd; ctx.fillRect(0, 0, 900, 340);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for(let i=0; i<6; i++) {
      const cx = (i * 180 + frame * 0.5) % 1000 - 100;
      ctx.beginPath(); ctx.ellipse(cx, 40 + i*15, 50, 15, 0, 0, Math.PI*2); ctx.fill();
    }

    // Sun
    ctx.beginPath(); ctx.arc(780, 50, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fdd835'; ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(253,218,72,0.5)';
    ctx.fill(); ctx.shadowBlur = 0;

    // Ground
    ctx.fillStyle = '#2e7d32'; ctx.fillRect(0, 250, 900, 90);

    // Cavern (Right Side)
    ctx.fillStyle = '#57534e'; ctx.beginPath();
    ctx.moveTo(780, 250); ctx.lineTo(820, 180); ctx.quadraticCurveTo(850, 150, 880, 180); ctx.lineTo(920, 250); ctx.fill();
    ctx.fillStyle = '#0a0a0a'; ctx.beginPath();
    ctx.moveTo(830, 250); ctx.lineTo(840, 200); ctx.quadraticCurveTo(850, 180, 860, 200); ctx.lineTo(870, 250); ctx.fill();

    // Shop (Left Side)
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(20, 160, 130, 90);
    ctx.fillStyle = '#3b82f6'; ctx.strokeRect(20, 160, 130, 90);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(70, 205, 30, 45); // Door

    drawMiner(ctx, pos, facing, frame, false);

    if (stateRef.current.shake > 0) ctx.restore();
  };

  const drawCarving = (ctx, grid, pos, swinging, facing, particles, frame) => {
    // Screen Shake
    if (stateRef.current.shake > 0) {
      ctx.save();
      ctx.translate((Math.random()-0.5)*stateRef.current.shake, (Math.random()-0.5)*stateRef.current.shake);
      stateRef.current.shake *= 0.9;
      if (stateRef.current.shake < 0.1) stateRef.current.shake = 0;
    }

    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, 900, 500);

    // Draw Grid
    const size = 60; const offset = { x: 250, y: 60 };
    grid.forEach((b, i) => {
      const bx = offset.x + b.c * (size + 5);
      const by = offset.y + b.r * (size + 5);
      
      if (b.hp > 0) {
        ctx.fillStyle = b.hp > 6 ? '#291102' : b.hp > 3 ? '#56270b' : '#78350f';
        ctx.fillRect(bx, by, size, size);
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, size, size);
      } else if (b.isArtifact) {
        ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(currentDef.icon, bx + size/2, by + size/2);
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(bx, by, size, size);
      }
    });

    // Dynamic Light Effect
    const mouseX = stateRef.current.mouseX || 450;
    const mouseY = stateRef.current.mouseY || 250;
    const lightGrd = ctx.createRadialGradient(mouseX, mouseY, 50, mouseX, mouseY, 300);
    lightGrd.addColorStop(0, 'rgba(0,0,0,0)');
    lightGrd.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = lightGrd; ctx.fillRect(0, 0, 900, 500);

    drawMiner(ctx, { x: 100, y: 350 }, 'right', frame, swinging);

    if (stateRef.current.shake > 0) ctx.restore();
  };

  const drawMiner = (ctx, pos, facing, frame, swinging) => {
    ctx.save();
    ctx.translate(pos.x, pos.y);
    if (facing === 'left') ctx.scale(-1, 1);
    
    const bob = Math.sin(frame * 0.1) * 3;
    
    // Body
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(-10, -35 + bob, 20, 16);
    // Head
    ctx.fillStyle = '#fcd34d'; ctx.fillRect(-8, -50 + bob, 16, 14);
    // Hat
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(0, -50 + bob, 10, Math.PI, 0); ctx.fill();
    // Pickaxe
    ctx.save();
    if (swinging) ctx.rotate(Math.sin(frame * 0.3) * 0.5);
    ctx.fillStyle = '#92400e'; ctx.fillRect(10, -40 + bob, 3, 20);
    ctx.fillStyle = '#6b7280'; ctx.fillRect(5, -45 + bob, 12, 5);
    ctx.restore();

    ctx.restore();
  };

  /* ------------------------------------------------------------
     INPUT HANDLING
     ------------------------------------------------------------ */
  useEffect(() => {
    const handleKeydown = (e) => {
      const pos = stateRef.current.playerPos;
      const speed = 5;
      if (e.key === 'ArrowLeft' || e.key === 'a') { pos.x -= speed; stateRef.current.facing = 'left'; }
      if (e.key === 'ArrowRight' || e.key === 'd') { pos.x += speed; stateRef.current.facing = 'right'; }
      if (e.key === 'ArrowUp' || e.key === 'w') pos.y -= speed;
      if (e.key === 'ArrowDown' || e.key === 's') pos.y += speed;
      
      // Bounds
      pos.x = Math.max(20, Math.min(880, pos.x));
      pos.y = Math.max(160, Math.min(320, pos.y));

      // Interaction
      if (e.key === 'e' || e.key === ' ') {
        if (stateRef.current.phase === 'HUB') {
          if (pos.x > 800) startLevel();
          if (pos.x < 150) setPhase('SHOP');
        }
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [startLevel]);

  const handleCanvasClick = (e) => {
    if (phase !== 'CARVING') return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    
    // Find clicked block
    const size = 60; const offset = { x: 250, y: 60 };
    const col = Math.floor((x - offset.x) / (size + 5));
    const row = Math.floor((y - offset.y) / (size + 5));
    
    if (row >= 0 && row < 6 && col >= 0 && col < 6) {
      const idx = row * 6 + col;
      handleBlockAction(idx, x, y);
    }
  };

  const handleBlockAction = (idx, clickX, clickY) => {
    const b = grid[idx];
    if (b.hp <= 0 && !b.isArtifact) return;
    
    stateRef.current.swinging = true;
    stateRef.current.shake = 10;
    setTimeout(() => stateRef.current.swinging = false, 200);

    // Particles
    for(let i=0; i<8; i++) {
      stateRef.current.particles.push(new Particle(clickX, clickY, b.isArtifact ? '#f59e0b' : '#78350f', 3+Math.random()*4, { x: (Math.random()-0.5)*6, y: -2-Math.random()*4 }));
    }

    let ng = [...grid]; let dmg = 0;
    if (b.isArtifact) { dmg = 1; }
    else {
      ng[idx] = { ...ng[idx], hp: Math.max(0, ng[idx].hp - toolPower) };
      if (ng[idx].hp <= 0 && ng.some(bl => bl.isArtifact && Math.abs(bl.r-b.r)<=1 && Math.abs(bl.c-b.c)<=1) && Math.random() < toolSens) dmg = 1;
    }
    setGrid(ng);
    if (dmg) {
      const nh = artifactHP - 1; setArtifactHP(nh);
      if (nh <= 0) setPhase('FAILED');
    }
    if (ng.filter(bl => !bl.isArtifact).every(bl => bl.hp <= 0)) setPhase('DISCOVERED');
  };

  /* ------------------------------------------------------------
     UI ACTIONS
     ------------------------------------------------------------ */
  const handleCollect = () => {
    setInventory(prev => [...prev, { name: currentDef.name, icon: currentDef.icon, desc: currentDef.desc, q: currentDef.q, opts: currentDef.opts, ans: currentDef.ans, baseValue: 50 + levelIdx * 20 }]);
    if (levelIdx >= 14) setPhase('WON_GAME');
    else { setLevelIdx(i => i + 1); setPhase('HUB'); }
  };

  const handleSellAll = () => {
    if (!inventory.length) return;
    setQuizQueue([...inventory]); setInventory([]); setCurrentQuiz(inventory[0]); setPhase('QUIZ');
  };

  const handleQuizAnswer = (a) => {
    const correct = a === currentQuiz.ans; setLastQuizCorrect(correct);
    setMoney(m => m + Math.floor(currentQuiz.baseValue * (correct ? 1.2 : 0.5)));
    setTimeout(() => {
      setLastQuizCorrect(null);
      const nq = quizQueue.slice(1); setQuizQueue(nq);
      if (nq.length > 0) setCurrentQuiz(nq[0]); else setPhase('SHOP');
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 text-white bg-slate-950 font-sans selection:bg-amber-500/30">
      
      {/* HUD Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 glass-panel p-4 rounded-2xl border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20"><Pickaxe className="text-amber-500" size={28}/></div>
          <div>
            <h1 className="text-xl font-black text-amber-500 tracking-tighter uppercase">Depths of Antiquity</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Level {levelIdx+1}/15 • {(levelIdx+1)*50}m Depth</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Funding</span>
            <div className="flex items-center gap-2 text-xl font-black text-emerald-400 font-mono tracking-tighter"><Coins size={18}/>${money}</div>
          </div>
          <div className="w-[1px] h-10 bg-white/10 mx-2" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Inventory</span>
            <div className="flex items-center gap-2 text-xl font-black text-blue-400 font-mono tracking-tighter"><Backpack size={18}/>{inventory.length}/{maxArtifactSlots}</div>
          </div>
        </div>
      </div>

      {/* Main Game Surface */}
      <div className="relative group">
        <canvas 
          ref={canvasRef} 
          width={900} height={500} 
          onClick={handleCanvasClick}
          onMouseMove={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            stateRef.current.mouseX = e.clientX - rect.left;
            stateRef.current.mouseY = e.clientY - rect.top;
          }}
          className="rounded-3xl border-4 border-slate-900 shadow-2xl cursor-crosshair bg-black"
        />
        
        {/* Carving HUD */}
        {phase === 'CARVING' && (
          <div className="absolute inset-x-0 top-6 px-8 flex justify-between pointer-events-none anim-in">
            <div className="glass-panel px-6 py-3 rounded-2xl border-white/10 flex items-center gap-4">
              <div className={`p-2 rounded-lg ${timeLeft <= 10 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-slate-300'}`}>
                <Timer size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Time Remaining</p>
                <p className={`text-2xl font-black font-mono ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</p>
              </div>
            </div>

            <div className="glass-panel px-6 py-3 rounded-2xl border-white/10 flex items-center gap-4">
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Artifact Integrity</p>
                <div className="flex gap-1.5 mt-1">
                  {Array.from({ length: currentDef.frag }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-2 rounded-full transition-all duration-300 ${i < artifactHP ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-red-950/50'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className={`p-2 rounded-lg ${artifactHP <= 1 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-slate-300'}`}>
                <ShieldAlert size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Hub UI Overlays */}
        {phase === 'HUB' && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-xs font-bold text-slate-400 animate-pulse">
              Use WASD to Walk • Head to the right to Dig
            </div>
          </div>
        )}

        {/* Phase Overlays */}
        {phase === 'SHOP' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl rounded-3xl flex items-center justify-center p-12 anim-in">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-blue-400 flex items-center gap-3"><Store size={32}/> Basecamp Shop</h2>
                <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
                   <div className="flex justify-between items-center"><span className="font-bold">Inventory</span><span className="text-sm bg-blue-500/20 px-2 py-1 rounded">{inventory.length}/{maxArtifactSlots}</span></div>
                   {inventory.length === 0 ? <p className="text-slate-500 text-sm italic">Nothing to sell. Go dig!</p> : 
                    <div className="space-y-2">{inventory.map((it,i) => <div key={i} className="flex justify-between bg-black/40 p-2 rounded-lg text-sm border border-white/5"><span>{it.icon} {it.name}</span><span className="text-emerald-400 font-mono">${it.baseValue}</span></div>)}</div>
                   }
                   <button onClick={handleSellAll} disabled={!inventory.length} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black shadow-lg shadow-emerald-600/20 disabled:opacity-30">SELL & APPRAISE</button>
                </div>
              </div>
              <div className="space-y-6">
                 <h2 className="text-3xl font-black text-amber-500 flex items-center gap-3"><Sparkles size={32}/> Gear Upgrades</h2>
                 <div className="space-y-4">
                    <div className="glass-panel p-5 rounded-2xl border-white/5 flex justify-between items-center">
                       <div><h4 className="font-bold">Excavator Lv.{toolLevel}</h4><p className="text-[10px] text-slate-500">More power, less risk</p></div>
                       <button onClick={()=>{setMoney(m=>m-toolCost);setToolLevel(l=>l+1)}} disabled={money<toolCost} className="px-6 py-2 bg-amber-500 text-black font-black rounded-lg disabled:opacity-20">${toolCost}</button>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl border-white/5 flex justify-between items-center">
                       <div><h4 className="font-bold">Backpack Lv.{invUpgradeLevel}</h4><p className="text-[10px] text-slate-500">Carry more treasures</p></div>
                       <button onClick={()=>{setMoney(m=>m-invUpgradeCost);setInvUpgradeLevel(l=>l+1)}} disabled={money<invUpgradeCost} className="px-6 py-2 bg-blue-500 text-white font-black rounded-lg disabled:opacity-20">${invUpgradeCost}</button>
                    </div>
                 </div>
              </div>
              <button onClick={() => setPhase('HUB')} className="md:col-span-2 text-slate-500 hover:text-white font-bold text-sm">← Back to World</button>
            </div>
          </div>
        )}

        {/* Quiz, Failed, etc. */}
        {phase === 'QUIZ' && currentQuiz && (
          <div className="absolute inset-0 bg-slate-950/95 flex items-center justify-center rounded-3xl anim-in">
             <div className="max-w-md w-full glass-panel p-8 rounded-3xl border-blue-500/20 text-center relative overflow-hidden">
                {lastQuizCorrect !== null && <div className={`absolute inset-0 flex items-center justify-center z-10 ${lastQuizCorrect?'bg-emerald-500/90':'bg-red-500/90'}`}><h2 className="text-4xl font-black text-white">{lastQuizCorrect?'BRILLIANT!':'INCORRECT'}</h2></div>}
                <div className="text-6xl mb-4 drop-shadow-lg">{currentQuiz.icon}</div>
                <h2 className="text-2xl font-black mb-2">Appraisal: {currentQuiz.name}</h2>
                <p className="text-sm text-slate-400 italic mb-6">"{currentQuiz.desc}"</p>
                <p className="font-bold text-lg mb-6">{currentQuiz.q}</p>
                <div className="grid gap-3">
                   {currentQuiz.opts.map((o,i) => <button key={i} onClick={() => handleQuizAnswer(o)} className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold">{o}</button>)}
                </div>
             </div>
          </div>
        )}

        {phase === 'DISCOVERED' && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-3xl anim-in p-8 text-center">
             <div className="max-w-lg w-full space-y-6">
                <div className="text-8xl mb-4 animate-bounce">{currentDef.icon}</div>
                <h2 className="text-5xl font-black text-emerald-400 uppercase tracking-tighter">Artifact Unearthed!</h2>
                <h3 className="text-2xl font-bold text-slate-200">{currentDef.name}</h3>
                <p className="text-slate-400 leading-relaxed italic">"{currentDef.desc}"</p>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-200/70">
                   Real archaeologists spend months carefully excavating objects like this using tiny brushes and dental picks!
                </div>
                <button onClick={handleCollect} className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all active:scale-95">PACK TO INVENTORY →</button>
             </div>
          </div>
        )}

        {phase === 'FAILED' && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex items-center justify-center rounded-3xl anim-in text-center p-8">
             <div className="max-w-md w-full space-y-6">
                {timeLeft <= 0 ? <Timer size={80} className="mx-auto text-red-500 animate-pulse" /> : <ShieldAlert size={80} className="mx-auto text-red-500 animate-pulse" />}
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter">{timeLeft <= 0 ? "TIME'S UP" : "ARTIFACT SHATTERED"}</h2>
                <p className="text-red-200/60 leading-relaxed">{timeLeft <= 0 ? "The clock ran out before you could safely extract the artifact." : "Too much pressure or a slip of the pickaxe caused the ancient relic to crumble to dust. Be more careful next time!"}</p>
                <button onClick={() => { setTimeLeft(45); setPhase('HUB'); }} className="w-full py-4 bg-white text-black font-black text-xl rounded-2xl hover:bg-red-100 transition-all">TRY AGAIN</button>
             </div>
          </div>
        )}

        {phase === 'WON_GAME' && (
          <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-2xl flex items-center justify-center rounded-3xl anim-in text-center p-12">
             <div className="space-y-8">
                <Trophy size={120} className="mx-auto text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,1)]" />
                <h2 className="text-7xl font-black text-white uppercase tracking-tighter">LEGENDARY</h2>
                <p className="text-2xl font-bold text-amber-200/80">You have unearthed all 15 historical artifacts!</p>
                <div className="text-4xl font-black text-emerald-400 font-mono tracking-tighter">Total Funding: ${money}</div>
                <button onClick={() => window.location.reload()} className="px-12 py-5 bg-amber-500 text-black font-black text-2xl rounded-2xl shadow-2xl shadow-amber-500/50">NEW EXPEDITION</button>
             </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex gap-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> 60 FPS ENGINE</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> DYNAMIC LIGHTING</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> PARTICLE PHYSICS</div>
      </div>
    </div>
  );
}
