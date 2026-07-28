/* ============================================================
   FRUTEX — Natural Juice Creator
   Game Logic — state, drag-drop, blending, ratings, shop,
   recipes, achievements, daily challenges, localStorage
   ============================================================ */

// ============================================================
// DATA DEFINITIONS
// ============================================================

/** All fruits in the game. Each has an emoji, name, category, flavor
 *  profile, and an unlock level (1 = always available). */
const ALL_FRUITS = [
  { id: 'apple',      emoji: '🍎', name: 'Apple',      cat: 'basic',    sweet: 7, tart: 3, fresh: 6, unlock: 1 },
  { id: 'orange',     emoji: '🍊', name: 'Orange',     cat: 'citrus',   sweet: 6, tart: 5, fresh: 8, unlock: 1 },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry', cat: 'berry',    sweet: 8, tart: 2, fresh: 7, unlock: 1 },
  { id: 'peach',      emoji: '🍑', name: 'Peach',      cat: 'basic',    sweet: 9, tart: 1, fresh: 5, unlock: 1 },
  { id: 'grape',      emoji: '🍇', name: 'Grape',      cat: 'berry',    sweet: 7, tart: 4, fresh: 6, unlock: 1 },
  { id: 'pineapple',  emoji: '🍍', name: 'Pineapple',  cat: 'tropical', sweet: 7, tart: 6, fresh: 9, unlock: 1 },
  { id: 'mango',      emoji: '🥭', name: 'Mango',      cat: 'tropical', sweet: 9, tart: 2, fresh: 8, unlock: 1 },
  { id: 'blueberry',  emoji: '🫐', svg: '<svg viewBox="0 0 32 32" width="28" height="28" style="display:inline-block;vertical-align:middle"><circle cx="16" cy="16" r="15" fill="#4a6fd4" stroke="#294090" stroke-width="2"/><circle cx="16" cy="16" r="11" fill="#6b90f0"/><ellipse cx="12" cy="11" rx="5" ry="3" fill="rgba(255,255,255,0.25)"/></svg>', name: 'Blueberry',  cat: 'berry',    sweet: 6, tart: 5, fresh: 6, unlock: 3 },
  { id: 'cherry',     emoji: '🍒', name: 'Cherry',     cat: 'berry',    sweet: 8, tart: 4, fresh: 6, unlock: 4 },
  { id: 'lemon',      emoji: '🍋', name: 'Lemon',      cat: 'citrus',   sweet: 2, tart: 8, fresh: 9, unlock: 3 },
  { id: 'watermelon', emoji: '🍉', name: 'Watermelon', cat: 'basic',    sweet: 8, tart: 1, fresh: 10, unlock: 5 },
  { id: 'kiwi',       emoji: '🥝', name: 'Kiwi',       cat: 'tropical', sweet: 5, tart: 6, fresh: 8, unlock: 4 },
  { id: 'banana',     emoji: '🍌', name: 'Banana',     cat: 'basic',    sweet: 8, tart: 1, fresh: 4, unlock: 2 },
  { id: 'lime',       emoji: '🍋', name: 'Lime',       cat: 'citrus',   sweet: 2, tart: 9, fresh: 10, unlock: 5 },
  { id: 'dragonfruit',emoji: '🌸', name: 'Dragonfruit',cat: 'tropical', sweet: 6, tart: 3, fresh: 9, unlock: 6 },
  { id: 'raspberry',  emoji: '🫐', name: 'Raspberry',  cat: 'berry',    sweet: 7, tart: 5, fresh: 7, unlock: 3 },
  { id: 'coconut',    emoji: '🥥', name: 'Coconut',    cat: 'tropical', sweet: 5, tart: 1, fresh: 8, unlock: 4 },
  { id: 'plum',       emoji: '🫐', name: 'Plum',       cat: 'berry',    sweet: 6, tart: 4, fresh: 5, unlock: 4 },
  { id: 'pear',       emoji: '🍐', name: 'Pear',       cat: 'basic',    sweet: 7, tart: 1, fresh: 7, unlock: 3 },
  { id: 'papaya',     emoji: '🫐', name: 'Papaya',     cat: 'tropical', sweet: 8, tart: 2, fresh: 8, unlock: 5 },
  { id: 'pomegranate',emoji: '🫐', name: 'Pomegranate',cat: 'berry',    sweet: 5, tart: 7, fresh: 8, unlock: 5 },
];

/** Fruit → color mapping for blender layers */
const FRUIT_COLORS = {
  apple:      '#ff4757',
  orange:     '#ff6b35',
  strawberry: '#ff6b9d',
  peach:      '#ffcc80',
  grape:      '#a855f7',
  pineapple:  '#ffd93d',
  mango:      '#ff9f43',
  blueberry:  '#5b7fff',
  cherry:     '#dc143c',
  lemon:      '#fff44f',
  watermelon: '#ff6b6b',
  kiwi:       '#7bed9f',
  banana:     '#ffe135',
  lime:       '#32cd32',
  dragonfruit:'#ff69b4',
  raspberry:  '#e0314f',
  coconut:    '#f5e6d3',
  plum:       '#8e4585',
  pear:       '#c9d681',
  papaya:     '#ff8c42',
  pomegranate:'#c0392b',
};

/** Bottle shapes available in the game */
const ALL_BOTTLES = [
  { id: 'glass',   name: 'Glass Bottle',    shape: 'shape-glass',    unlock: 1, cost: 0, icon: '🍾' },
  { id: 'hex',     name: 'Hexagon Jar',     shape: 'shape-hex',      unlock: 1, cost: 0, icon: '🔷' },
  { id: 'vintage', name: 'Vintage Vial',    shape: 'shape-vintage',  unlock: 1, cost: 0, icon: '⚗️' },
  { id: 'carafe',  name: 'Curved Carafe',   shape: 'shape-carafe',   unlock: 1, cost: 0, icon: '🏺' },
  { id: 'bamboo',  name: 'Bamboo Flask',    shape: 'shape-bamboo',   unlock: 1, cost: 0, icon: '🎋' },
];

/** Cap colors */
const ALL_CAPS = [
  { id: 'silver', color: '#c0c0c0', name: 'Silver', unlock: 1, cost: 0 },
  { id: 'gold',   color: '#ffd700', name: 'Gold',   unlock: 1, cost: 0 },
  { id: 'green',  color: '#2ed573', name: 'Green',  unlock: 1, cost: 0 },
  { id: 'blue',   color: '#3742fa', name: 'Blue',   unlock: 1, cost: 0 },
  { id: 'red',    color: '#ff4757', name: 'Red',    unlock: 1, cost: 0 },
  { id: 'purple', color: '#a855f7', name: 'Purple', unlock: 2, cost: 80 },
  { id: 'pink',   color: '#ff6b9d', name: 'Pink',   unlock: 2, cost: 80 },
  { id: 'orange', color: '#ff6b35', name: 'Orange', unlock: 2, cost: 80 },
];

/** Label designs */
const ALL_LABELS = [
  { id: 'fresh',    name: 'Fresh & Natural', style: '🌿 Fresh',        unlock: 1, cost: 0,   bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
  { id: 'tropical', name: 'Tropical Vibes',  style: '🌴 Tropical',     unlock: 1, cost: 0,   bg: '#fff3e0', text: '#e65100', border: '#ffcc80' },
  { id: 'berry',    name: 'Berry Bliss',     style: '🍓 Berry Bliss',  unlock: 2, cost: 100, bg: '#fce4ec', text: '#c62828', border: '#f48fb1' },
  { id: 'citrus',   name: 'Golden Citrus',   style: '🍋 Citrus Burst', unlock: 2, cost: 100, bg: '#fffde7', text: '#f9a825', border: '#fff176' },
  { id: 'rainbow',  name: 'Rainbow Burst',   style: '🌈 Rainbow',      unlock: 4, cost: 200, bg: 'linear-gradient(135deg,#fce4ec,#f3e5f5,#e3f2fd,#e0f7fa,#e8f5e9,#fffde7)', text: '#6a1b9a', border: '#ce93d8' },
  { id: 'sunset',   name: 'Sunset Glow',     style: '🌅 Sunset',       unlock: 4, cost: 200, bg: 'linear-gradient(135deg,#ffccbc,#ffab91,#ff8a65)', text: '#bf360c', border: '#ff7043' },
];

/** Pastel background gradients for bottle glow */
const BG_GRADIENTS = [
  { id: 'none',    name: 'No Glow',     gradient: 'none' },
  { id: 'cotton',  name: 'Cotton Candy', gradient: 'linear-gradient(135deg, #fce4ec, #e8eaf6)' },
  { id: 'peach',   name: 'Peach Cream',  gradient: 'linear-gradient(135deg, #fff3e0, #fce4ec)' },
  { id: 'mint',    name: 'Mint Fresh',   gradient: 'linear-gradient(135deg, #e8f5e9, #e0f7fa)' },
  { id: 'lavender',name: 'Lavender Dream',gradient: 'linear-gradient(135deg, #f3e5f5, #e8eaf6)' },
  { id: 'ocean',   name: 'Ocean Breeze', gradient: 'linear-gradient(135deg, #e3f2fd, #e0f7fa)' },
  { id: 'sunset',  name: 'Soft Sunset',  gradient: 'linear-gradient(135deg, #fff8e1, #fce4ec)' },
];

/** Bottle glass tint colors */
const BOTTLE_COLORS = [
  { id: 'clear',    name: 'Clear',       color: 'rgba(255,255,255,0.25)' },
  { id: 'pink',     name: 'Soft Pink',   color: 'rgba(255,182,193,0.40)' },
  { id: 'mint',     name: 'Mint Green',  color: 'rgba(152,251,152,0.35)' },
  { id: 'teal',     name: 'Teal',        color: 'rgba(64,224,208,0.35)' },
  { id: 'blue',     name: 'Light Blue',  color: 'rgba(173,216,230,0.40)' },
  { id: 'lavender', name: 'Lavender',    color: 'rgba(221,160,221,0.35)' },
  { id: 'peach',    name: 'Soft Peach',  color: 'rgba(255,218,185,0.40)' },
  { id: 'yellow',   name: 'Butter Yellow',color:'rgba(255,255,200,0.40)' },
];

/** Frutex educational facts */
const FRUTEX_FACTS = [
  { fact: 'Frutex Natural 100% drinks contain NO added sugar — just pure fruit goodness! 🍎', icon: '🍎' },
  { fact: 'Strawberries are packed with Vitamin C — one serving has more than an orange! 🍓', icon: '🍓' },
  { fact: 'Frutex sources fruits from local farms to ensure the freshest taste possible. 🌍', icon: '🌍' },
  { fact: 'Drinking natural fruit juice helps keep your body hydrated and energized! ⚡', icon: '⚡' },
  { fact: 'Oranges contain flavonoids that support a healthy immune system. 🍊', icon: '🍊' },
  { fact: 'Frutex Natural 100% comes in 11 delicious flavors — from Apple to Multivitamin! 🧃', icon: '🧃' },
  { fact: 'Peaches are rich in Vitamin A, which is great for your skin and eyesight. 🍑', icon: '🍑' },
  { fact: 'Blueberries are tiny superheroes — full of antioxidants that protect your cells! 🫐', icon: '🫐' },
  { fact: 'Frutex bottles are recyclable — good for you AND the planet! ♻️', icon: '♻️' },
  { fact: 'Mangoes contain enzymes that help with healthy digestion. 🥭', icon: '🥭' },
  { fact: 'A glass of Frutex Natural 100% counts as 1 of your 5-a-day fruit portions! 📊', icon: '📊' },
  { fact: 'Pineapples contain bromelain, a natural enzyme with anti-inflammatory benefits. 🍍', icon: '🍍' },
  { fact: 'Frutex has been bringing natural fruit drinks to families since 1996! 🏭', icon: '🏭' },
  { fact: 'Carrots in juice form are a delicious way to get your daily Vitamin A boost! 🥕', icon: '🥕' },
  { fact: 'Natural 100% means exactly that — 100% fruit, 0% compromise. 💯', icon: '💯' },
];

/** Customers with specific juice orders */
const CUSTOMERS = [
  { id: 'kid',    emoji: '👧', name: 'Lily',  quote: 'Can you make me a delicious berry juice? I love strawberries!',
    order: { type: 'category', cat: 'berry' }, bonusText: 'Uses berry fruits' },
  { id: 'athlete',emoji: '🏃', name: 'Coach Max', quote: 'I need something tropical and energizing for after my run!',
    order: { type: 'category', cat: 'tropical' }, bonusText: 'Uses tropical fruits' },
  { id: 'critic', emoji: '👨‍🍳', name: 'Chef Antoine', quote: 'I want an apple and orange blend — classic and balanced.',
    order: { type: 'specific', fruits: ['apple','orange'] }, bonusText: 'Includes apple & orange' },
  { id: 'grandma',emoji: '👵', name: 'Grandma Rose', quote: 'Make me the sweetest juice you can, dear — extra sweet!',
    order: { type: 'flavor', minSweet: 7 }, bonusText: 'Sweetness 7+' },
  { id: 'artist', emoji: '🎨', name: 'Artist Mia', quote: 'Surprise me! Use at least 3 different fruits in your blend.',
    order: { type: 'count', minFruits: 3 }, bonusText: '3+ different fruits' },
  { id: 'boss',   emoji: '👔', name: 'Mr. Sterling', quote: 'I expect a citrus-forward drink. Make it sharp and refined.',
    order: { type: 'category', cat: 'citrus' }, bonusText: 'Uses citrus fruits' },
  { id: 'surfer', emoji: '🏄', name: 'Surfer Kai', quote: 'Tropical vibes only dude! Mango MUST be in there! 🤙',
    order: { type: 'specific', fruits: ['mango'] }, bonusText: 'Includes mango' },
  { id: 'yogi',   emoji: '🧘', name: 'Yogi Priya', quote: 'Something pure and fresh — use only green or citrus fruits.',
    order: { type: 'categories', cats: ['tropical','citrus'] }, bonusText: 'Uses tropical or citrus' },
];

/** Animated customer reactions by star rating */
const REACTIONS = {
  5: { emoji: '😍', phrases: ['PERFECT! This is exactly what I wanted!','Absolutely divine! You\'re a juice genius!','WOW! The best drink I\'ve ever had!'] },
  4: { emoji: '😊', phrases: ['Delicious! You really know your fruits!','Mmm, so good! Almost perfect!','I love this — great job!'] },
  3: { emoji: '🙂', phrases: ['Pretty good! I enjoyed it.','Not bad at all — nice work!','Tasty! Could use a little something extra.'] },
  2: { emoji: '😐', phrases: ['It\'s okay... not quite my taste.','Hmm, maybe try different fruits?','Average — but keep experimenting!'] },
  1: { emoji: '😕', phrases: ['Sorry, this isn\'t working for me...','That combination didn\'t quite work.','Better luck next time — keep trying!'] },
};

/** Achievements the player can unlock */
const ACHIEVEMENTS = [
  { id: 'first_juice',    icon: '🧃', name: 'First Creation',   desc: 'Create your first juice',                    goal: 1,  reward: '50 coins' },
  { id: 'juice_5',        icon: '🏅', name: 'Juice Apprentice',  desc: 'Create 5 juices',                            goal: 5,  reward: '100 coins' },
  { id: 'juice_20',       icon: '🎖️', name: 'Juice Master',     desc: 'Create 20 juices',                           goal: 20, reward: '250 coins' },
  { id: 'perfect_rating', icon: '⭐', name: 'Perfect Score',    desc: 'Get a 5-star rating',                        goal: 1,  reward: '200 coins' },
  { id: 'all_basic',      icon: '🍎', name: 'Fruit Explorer',   desc: 'Use every basic fruit at least once',         goal: 4,  reward: '150 coins' },
  { id: 'all_berries',    icon: '🍓', name: 'Berry Lover',      desc: 'Use every berry fruit at least once',         goal: 4,  reward: '150 coins' },
  { id: 'three_bottles',  icon: '🍾', name: 'Bottle Collector',  desc: 'Unlock 3 bottle shapes',                      goal: 3,  reward: '300 coins' },
  { id: 'three_labels',   icon: '🏷️', name: 'Label Designer',   desc: 'Unlock 3 label designs',                      goal: 3,  reward: '200 coins' },
  { id: 'level_5',        icon: '⬆️', name: 'Rising Star',      desc: 'Reach level 5',                               goal: 5,  reward: '500 coins' },
  { id: 'daily_5',        icon: '📋', name: 'Challenge Seeker',  desc: 'Complete 5 daily challenges',                 goal: 5,  reward: '300 coins' },
];

/** Daily challenge pool */
const DAILY_CHALLENGE_POOL = [
  { icon: '🍓',  desc: 'Use strawberries in 2 juices',          target: 2,  reward: 80,  type: 'use_fruit',    fruit: 'strawberry' },
  { icon: '🍍',  desc: 'Use pineapple in 2 juices',             target: 2,  reward: 80,  type: 'use_fruit',    fruit: 'pineapple' },
  { icon: '🥭',  desc: 'Use mango in 2 juices',                 target: 2,  reward: 80,  type: 'use_fruit',    fruit: 'mango' },
  { icon: '🧃',  desc: 'Create 3 juices today',                  target: 3,  reward: 100, type: 'create_juices' },
  { icon: '⭐',  desc: 'Get a 4+ star rating',                   target: 1,  reward: 120, type: 'high_rating',   minRating: 4 },
  { icon: '🎨',  desc: 'Use 3 different bottles',                target: 3,  reward: 90,  type: 'use_bottles' },
  { icon: '🍎',  desc: 'Use 4 different fruits in one day',      target: 4,  reward: 100, type: 'unique_fruits' },
  { icon: '🍾',  desc: 'Buy an item from the shop',              target: 1,  reward: 60,  type: 'shop_purchase' },
];

/** Level thresholds: XP needed for each level */
const LEVEL_XP = [0, 100, 250, 500, 850, 1300, 1900, 2700, 3700, 5000, 7000];

/** Render a fruit's icon — image if available, SVG, otherwise emoji */
function fruitIcon(fruit) {
  if (fruit.img) return '<img src="' + fruit.img + '" alt="' + fruit.name + '" class="fruit-img-icon">';
  return fruit.svg || fruit.emoji;
}

/** Animate coin counter counting up from old to new value */
function animateCoins(newTotal, duration) {
  var oldTotal = state.coins;
  if (oldTotal >= newTotal) { updateCoinDisplays(newTotal); return; }
  var steps = 20;
  var stepTime = (duration || 600) / steps;
  var increment = (newTotal - oldTotal) / steps;
  var current = oldTotal;
  var step = 0;
  var interval = setInterval(function() {
    step++;
    current = Math.round(oldTotal + increment * step);
    if (step >= steps) { current = newTotal; clearInterval(interval); }
    updateCoinDisplays(current);
  }, stepTime);
}

function updateCoinDisplays(val) {
  var menuEl = document.getElementById('menu-coins');
  var gameEl = document.getElementById('game-coins');
  var shopEl = document.getElementById('shop-coins');
  if (menuEl) menuEl.textContent = val;
  if (gameEl) gameEl.textContent = val;
  if (shopEl) shopEl.textContent = val;
}
function getTitle(level) {
  if (level >= 8) return 'Frutex Champion';
  if (level >= 5) return 'Master Blender';
  if (level >= 3) return 'Juice Expert';
  return 'Junior Juice Maker';
}

/** Frutex Signature Drinks — one unlocked per level */
const SIGNATURE_DRINKS = [
  { level: 1,  name: 'Sunrise Fresh',   emoji: '🌅', fruits: ['orange','peach'],                        desc: 'A bright morning blend of citrus & stone fruit.', color: '#ff9f43' },
  { level: 2,  name: 'Berry Blast',     emoji: '💥', fruits: ['strawberry','blueberry','grape'],          desc: 'Triple-berry explosion of flavour.',              color: '#a855f7' },
  { level: 3,  name: 'Tropical Storm',  emoji: '🌴', fruits: ['pineapple','mango','banana'],              desc: 'A whirlwind of tropical paradise.',               color: '#ffd93d' },
  { level: 4,  name: 'Green Power',     emoji: '🌿', fruits: ['kiwi','lime','apple'],                     desc: 'Zesty green fuel for the day ahead.',            color: '#7bed9f' },
  { level: 5,  name: 'Ruby Kiss',       emoji: '💋', fruits: ['cherry','watermelon','strawberry'],         desc: 'Sweet ruby-red romance in a bottle.',             color: '#ff4757' },
  { level: 6,  name: 'Citrus Zing',     emoji: '⚡', fruits: ['lemon','orange','lime'],                    desc: 'Triple-citrus lightning strike.',                 color: '#fff44f' },
  { level: 7,  name: 'Dragon Fire',     emoji: '🔥', fruits: ['dragonfruit','mango','pineapple'],          desc: 'Exotic fire from the dragon\'s lair.',            color: '#ff69b4' },
  { level: 8,  name: 'Berry Melody',    emoji: '🎵', fruits: ['blueberry','cherry','grape','strawberry'],   desc: 'A symphony of four fine berries.',                color: '#7c3aed' },
  { level: 9,  name: 'Island Breeze',   emoji: '🏝️', fruits: ['pineapple','mango','peach','banana'],       desc: 'Four-fruit island getaway in a glass.',           color: '#ffcc80' },
  { level: 10, name: 'Frutex Supreme',  emoji: '👑', fruits: ['apple','orange','strawberry','mango','pineapple'], desc: 'The ultimate 5-fruit masterpiece.',        color: '#ff6b35' },
];

// ============================================================
// GAME STATE
// ============================================================

let state = {
  screen: 'menu',

  // Wallet
  coins: 0,
  xp: 0,
  level: 1,

  // Unlocks (arrays of IDs)
  unlockedFruits: ['apple', 'orange', 'strawberry', 'peach', 'grape', 'pineapple', 'mango', 'banana'],
  unlockedBottles: ['glass','hex','vintage','carafe','bamboo'],
  unlockedCaps: ['silver','gold','green','blue','red','purple','pink','orange'],
  unlockedLabels: ['fresh','tropical','berry','citrus','rainbow','sunset'],

  // Current juice session
  blenderFruits: [],         // fruits currently in blender slots
  currentJuice: null,        // { fruits[], sweetness, tartness, freshness, color }
  currentDesign: {
    bottle: 'glass',
    cap: 'silver',
    label: 'fresh',
    bgGradient: 'none',
    bottleColor: 'clear',
    name: '',
  },

  // Recipes saved
  recipes: [],

  // Signature drinks unlocked by level
  unlockedSignatureDrinks: [1],   // level 1 drink always available

  // Stats
  totalJuicesCreated: 0,
  perfectRatings: 0,
  fruitUsage: {},            // { fruitId: count }
  bottleUsage: {},
  labelUsage: {},

  // Achievements progress
  achievementProgress: {},

  // Daily challenges
  dailyChallenges: [],
  dailyChallengeProgress: {},
  dailyDate: '',

  // Unlocks from shop (separate from level unlocks)
  shopUnlockedFruits: [],
  shopUnlockedBottles: [],
  shopUnlockedLabels: [],
};

// ============================================================
// AUDIO — SYNTHETIC SOUNDS (no external files needed)
// ============================================================

let audioCtx = null;
let audioStarted = false;

function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { /* no audio */ }
  }
  return audioCtx;
}

function startAudio() {
  if (audioStarted) return;
  audioStarted = true;
  const ctx = getAudioCtx();
  if (ctx && ctx.state === 'suspended') ctx.resume();
  // Play a silent buffer to unlock audio on iOS
  if (ctx) {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  }
}

function playTone(freq, duration, type, vol) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol || 0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function sfxDrop() {
  playTone(400, 0.12, 'sine', 0.1);
  setTimeout(function() { playTone(600, 0.1, 'sine', 0.08); }, 60);
}

function sfxBlend() {
  playTone(200, 1.5, 'sawtooth', 0.06);  // low rumble
  // wobble
  for (var i = 0; i < 5; i++) {
    (function(idx) {
      setTimeout(function() {
        playTone(150 + idx * 30, 0.15, 'triangle', 0.05);
      }, idx * 150);
    })(i);
  }
}

function sfxClick() {
  playTone(800, 0.08, 'sine', 0.08);
}

function sfxSuccess() {
  var notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach(function(f, i) {
    setTimeout(function() { playTone(f, 0.3, 'sine', 0.12); }, i * 100);
  });
}

function sfxCoins() {
  for (var i = 0; i < 3; i++) {
    setTimeout(function() { playTone(1200 + Math.random() * 400, 0.1, 'sine', 0.08); }, i * 60);
  }
}

function sfxLevelUp() {
  var melody = [523, 659, 784, 1047, 784, 1047];
  melody.forEach(function(f, i) {
    setTimeout(function() { playTone(f, 0.25, 'sine', 0.12); }, i * 120);
  });
}

// ============================================================
// SCREEN NAVIGATION
// ============================================================

var screens = {};
var screenEls = document.querySelectorAll('.screen');
screenEls.forEach(function(el) { screens[el.id] = el; });

function showScreen(name) {
  sfxClick();
  var screenId = name + '-screen';
  if (!screens[screenId]) { console.warn('Screen not found:', screenId); return; }
  Object.values(screens).forEach(function(s) { s.classList.remove('active'); });
  screens[screenId].classList.add('active');
  state.screen = name;

  // Refresh necessary panels
  if (name === 'menu') refreshMenu();
  if (name === 'game') renderGameScreen();
  if (name === 'design') renderDesignScreen();
  if (name === 'shop') renderShop();
  if (name === 'recipes') renderRecipes();
  if (name === 'achievements') renderAchievements();
  if (name === 'challenges') renderChallenges();

  // Re-scroll to top
  window.scrollTo(0, 0);
}

// ============================================================
// BACKGROUND ANIMATION
// ============================================================

function initBackground() {
  var container = document.getElementById('bg-leaves');
  var leaves = ['🍃', '🌿', '🍂', '🍁', '🍀', '☘️', '🫧'];
  for (var i = 0; i < 12; i++) {
    var leaf = document.createElement('div');
    leaf.className = 'bg-leaf';
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.fontSize = (1.2 + Math.random() * 2.5) + 'rem';
    leaf.style.animationDuration = (8 + Math.random() * 15) + 's';
    leaf.style.animationDelay = Math.random() * 10 + 's';
    container.appendChild(leaf);
  }
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================

function toast(msg) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'toastIn 0.4s ease';
  clearTimeout(el._timeout);
  el._timeout = setTimeout(function() { el.style.display = 'none'; }, 2000);
}

// ============================================================
// PARTICLES & CONFETTI
// ============================================================

function spawnParticles(x, y, container, colors) {
  if (!colors) colors = ['#ff6b35', '#ffd93d', '#2ed573', '#ff4757', '#a855f7', '#0abde3', '#ff6b9d', '#fff'];
  for (var i = 0; i < 16; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    var angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
    var dist = 25 + Math.random() * 50;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.width = (3 + Math.random() * 5) + 'px';
    p.style.height = p.style.width;
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
    setTimeout(function() { p.remove(); }, 800);
  }
}

function spawnConfetti() {
  var colors = ['#ff6b35', '#ffd93d', '#2ed573', '#ff4757', '#a855f7', '#0abde3', '#ff6b9d', '#ff9f43'];
  for (var i = 0; i < 50; i++) {
    var c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.top = -(10 + Math.random() * 30) + 'px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.width = (6 + Math.random() * 10) + 'px';
    c.style.height = (6 + Math.random() * 10) + 'px';
    c.style.animationDuration = (2 + Math.random() * 3) + 's';
    c.style.animationDelay = Math.random() * 1.2 + 's';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(c);
    setTimeout(function() { c.remove(); }, 4500);
  }
}

// ============================================================
// MENU REFRESH
// ============================================================

function refreshMenu() {
  document.getElementById('menu-level').textContent = 'Level ' + state.level;
  document.getElementById('menu-coins').textContent = state.coins;
  document.getElementById('menu-xp').textContent = state.xp + ' XP';
  document.getElementById('menu-title').textContent = getTitle(state.level);
}

// ============================================================
// FRUIT GRID & GAME SCREEN
// ============================================================

var currentFruitCat = 'basic';

function getAvailableFruits() {
  var unlocked = state.unlockedFruits.concat(state.shopUnlockedFruits);
  return ALL_FRUITS.filter(function(f) { return unlocked.indexOf(f.id) !== -1; });
}

function renderGameScreen() {
  renderDrinkGrid();
  renderBlenderSlots();
  updateMixInfo();
  document.getElementById('game-coins').textContent = state.coins;
  document.getElementById('game-level').textContent = state.level;
  document.getElementById('game-xp').textContent = state.xp + ' XP';
}

/** Render Frutex product drink grid with + buttons */
function renderDrinkGrid() {
  var grid = document.getElementById('drink-grid');
  // Use the 8 Frutex products we have images for
  var products = [
    { id: 'strawberry', name: 'Strawberry', img: 'Natural-Strawberry-200ml.webp' },
    { id: 'apple', name: 'Apple', img: 'Natural-Apple-750ml.webp' },
    { id: 'orange', name: 'Orange', img: 'Natural-Orange-200ml.webp' },
    { id: 'peach', name: 'Peach', img: 'Natural-Peach-200ml.webp' },
    { id: 'carrot', name: 'Carrot', img: 'Natural-Carrot-200ml.webp' },
    { id: 'grape', name: 'Grape', img: 'Natural-Grape-250ml.webp' },
    { id: 'blueberry', name: 'Blueberry', img: 'Natural-Blueberry-200ml.webp' },
    { id: 'sourcherry', name: 'Sour Cherry', img: 'Natural-Sourcherry-200ml.webp' },
  ];

  var html = '';
  products.forEach(function(p) {
    var count = state.blenderFruits.filter(function(f) { return f === p.id; }).length;
    html += '<div class="drink-card">' +
      '<img src="' + p.img + '" alt="' + p.name + '" class="drink-card-img">' +
      '<span class="drink-card-name">Natural 100%<br>' + p.name + '</span>' +
      '<div class="drink-qty">' +
        (count > 0 ? '<button class="qty-btn" onclick="removeDrink(\'' + p.id + '\')">−</button>' : '') +
        '<span class="qty-num">' + (count > 0 ? count : '') + '</span>' +
        '<button class="qty-btn qty-plus" onclick="addDrink(\'' + p.id + '\')">+</button>' +
      '</div>' +
    '</div>';
  });
  grid.innerHTML = html;
}

function addDrink(id) {
  // Clean sparse entries first, then count
  state.blenderFruits = state.blenderFruits.filter(Boolean);
  if (state.blenderFruits.length >= 4) { toast('Blender is full! (max 4)'); return; }
  state.blenderFruits.push(id);
  sfxDrop();
  renderDrinkGrid();
  renderBlenderSlots();
  updateMixInfo();
}

function removeDrink(id) {
  var idx = state.blenderFruits.lastIndexOf(id);
  if (idx !== -1) { state.blenderFruits.splice(idx, 1); }
  sfxClick();
  renderDrinkGrid();
  renderBlenderSlots();
  updateMixInfo();
}

var extraFruitsOpen = false;
function toggleExtraFruits() {
  extraFruitsOpen = !extraFruitsOpen;
  var panel = document.getElementById('extra-fruits-panel');
  var arrow = document.getElementById('toggle-arrow');
  panel.style.display = extraFruitsOpen ? '' : 'none';
  arrow.textContent = extraFruitsOpen ? '▲' : '▼';
  if (extraFruitsOpen) renderFruitGrid();
}

/** Render extra fruits grid (fruits without Frutex product images) */
function renderFruitGrid() {
  var grid = document.getElementById('fruit-grid');
  var allUnlocked = state.unlockedFruits.concat(state.shopUnlockedFruits);
  var fruits = ALL_FRUITS.filter(function(f) {
    return f.cat === currentFruitCat && allUnlocked.indexOf(f.id) !== -1;
  });

  // Also show locked fruits so player knows what's coming
  var lockedFruits = ALL_FRUITS.filter(function(f) {
    return f.cat === currentFruitCat && allUnlocked.indexOf(f.id) === -1;
  });

  var html = '';
  fruits.forEach(function(f) {
    html += '<div class="fruit-card" draggable="true" data-fruit="' + f.id + '"' +
            ' ondragstart="dragStart(event)" ondragend="dragEnd(event)"' +
            ' ontouchstart="touchStart(event)" ontouchmove="touchMove(event)" ontouchend="touchEnd(event)">' +
            '<span class="fruit-emoji">' + fruitIcon(f) + '</span>' +
            '<span class="fruit-name">' + f.name + '</span>' +
            '</div>';
  });
  lockedFruits.forEach(function(f) {
    html += '<div class="fruit-card locked">' +
            '<span class="fruit-emoji">' + fruitIcon(f) + '</span>' +
            '<span class="fruit-name">' + f.name + '</span>' +
            '<span class="fruit-unlock">Lv.' + f.unlock + '</span>' +
            '</div>';
  });

  grid.innerHTML = html;
}

// ============================================================
// DRAG & DROP
// ============================================================

var draggedFruit = null;

function dragStart(e) {
  if (state.blenderFruits.filter(Boolean).length >= 4) {
    e.preventDefault();
    toast('Blender is full! (max 4 fruits)');
    return;
  }
  draggedFruit = e.currentTarget.dataset.fruit;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedFruit);
  startAudio();
}

function dragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedFruit = null;
}

function allowDrop(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function dropFruit(e, slotIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  var fruitId = e.dataTransfer.getData('text/plain') || draggedFruit;
  if (!fruitId) return;

  addFruitToBlender(fruitId, slotIdx);
  draggedFruit = null;
}

// Touch support
var touchFruit = null;
var touchClone = null;

function touchStart(e) {
  if (state.blenderFruits.filter(Boolean).length >= 4) {
    toast('Blender is full! (max 4 fruits)');
    return;
  }
  touchFruit = e.currentTarget.dataset.fruit;
  startAudio();
}

function touchMove(e) {
  e.preventDefault();
}

function touchEnd(e) {
  if (!touchFruit) return;
  // Find what's under the touch point
  var touch = e.changedTouches[0];
  var el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (el) {
    var slot = el.closest('.blender-slot');
    if (slot) {
      var slotIdx = parseInt(slot.dataset.slot);
      addFruitToBlender(touchFruit, slotIdx);
    }
  }
  touchFruit = null;
}

// ============================================================
// BLENDER LOGIC
// ============================================================

function addFruitToBlender(fruitId, slotIdx) {
  // If slot already filled, put at next available slot
  if (state.blenderFruits[slotIdx]) {
    var emptySlot = -1;
    for (var i = 0; i < 4; i++) {
      if (!state.blenderFruits[i]) { emptySlot = i; break; }
    }
    if (emptySlot === -1) { toast('Blender is full!'); return; }
    slotIdx = emptySlot;
  }

  if (state.blenderFruits.filter(Boolean).length >= 4 && !state.blenderFruits[slotIdx]) {
    // Count filled slots
    var filled = state.blenderFruits.filter(Boolean).length;
    if (filled >= 4) { toast('Blender is full! (max 4 fruits)'); return; }
  }

  // Spawn falling fruit animation BEFORE updating state
  var fruit = ALL_FRUITS.find(function(f) { return f.id === fruitId; });
  if (fruit) spawnFallingFruit(fruit.emoji, slotIdx);

  state.blenderFruits[slotIdx] = fruitId;
  sfxDrop();
  renderBlenderSlots();
  updateMixInfo();
}

function removeFruitFromBlender(slotIdx) {
  state.blenderFruits[slotIdx] = null;
  sfxClick();
  renderBlenderSlots();
  updateMixInfo();
}

function clearBlender() {
  state.blenderFruits = [];
  renderBlenderSlots();
  updateMixInfo();
  sfxClick();
}

/** Animate a fruit emoji falling into the blender jar */
function spawnFallingFruit(emoji, slotIdx) {
  var jar = document.getElementById('blender-jar');
  var jarRect = jar.getBoundingClientRect();

  // Slot positions within the jar (2x2 grid)
  var col = slotIdx % 2;
  var row = Math.floor(slotIdx / 2);
  var startX = jarRect.left + jarRect.width / 2;
  var startY = jarRect.top - 10;
  var targetX = jarRect.left + jarRect.width * (0.25 + col * 0.5);
  var targetY = jarRect.top  + jarRect.height * (0.25 + row * 0.5);

  var fruit = document.createElement('div');
  fruit.className = 'falling-fruit';
  fruit.textContent = emoji;
  fruit.style.left = startX + 'px';
  fruit.style.top  = startY + 'px';
  fruit.style.setProperty('--dx', (targetX - startX) + 'px');
  fruit.style.setProperty('--dy', (targetY - startY) + 'px');
  document.body.appendChild(fruit);

  setTimeout(function() { fruit.remove(); }, 500);
}

function renderBlenderSlots() {
  var slotsContainer = document.getElementById('blender-slots');
  var juiceDisplay = document.getElementById('blender-juice');
  juiceDisplay.style.display = 'none';

  // Keep blender jar background normal
  var jar = document.getElementById('blender-jar');
  jar.classList.remove('blending');
  document.getElementById('blender-lid').classList.remove('blending');

  // Colorful fruit layers behind slots
  var fruits = state.blenderFruits.filter(Boolean);
  var layersHtml = '';
  if (fruits.length >= 2) {
    var layerH = 100 / fruits.length;
    layersHtml = '<div class="blender-layers">';
    fruits.forEach(function(fid) {
      var color = FRUIT_COLORS[fid] || '#ff8c42';
      layersHtml += '<div class="blender-layer" style="height:' + layerH + '%; background:' + color + ';"></div>';
    });
    layersHtml += '</div>';
  }

  var html = layersHtml;
  for (var i = 0; i < 4; i++) {
    var fruitId = state.blenderFruits[i];
    var fruit = fruitId ? ALL_FRUITS.find(function(f) { return f.id === fruitId; }) : null;
    var cls = 'blender-slot';
    if (fruit) cls += ' filled';
    html += '<div class="' + cls + '" data-slot="' + i + '" ' +
            'ondrop="dropFruit(event,' + i + ')" ondragover="allowDrop(event)" ondragleave="dragLeave(event)" ' +
            (fruit ? 'onclick="removeFruitFromBlender(' + i + ')"' : '') +
            '>' +
            (fruit ? fruitIcon(fruit) : '+') +
            '</div>';
  }
  slotsContainer.innerHTML = html;
}

function updateMixInfo() {
  var info = document.getElementById('mix-info');
  var bars = document.getElementById('flavor-bars');
  var fruits = state.blenderFruits.filter(Boolean);

  if (fruits.length === 0) {
    info.innerHTML = '<p class="mix-empty">Add fruits to the blender to see your mix!</p>';
    bars.innerHTML = '';
    return;
  }

  var fruitObjs = fruits.map(function(id) {
    return ALL_FRUITS.find(function(f) { return f.id === id; });
  }).filter(Boolean);

  // Fruit tags
  var tagsHtml = '<div class="mix-fruit-list">';
  fruitObjs.forEach(function(f) {
    tagsHtml += '<span class="mix-fruit-tag">' + fruitIcon(f) + ' ' + f.name + '</span>';
  });
  tagsHtml += '</div>';
  info.innerHTML = tagsHtml;

  // Flavor bars
  var avgSweet = fruitObjs.reduce(function(s, f) { return s + f.sweet; }, 0) / fruitObjs.length;
  var avgTart = fruitObjs.reduce(function(s, f) { return s + f.tart; }, 0) / fruitObjs.length;
  var avgFresh = fruitObjs.reduce(function(s, f) { return s + f.fresh; }, 0) / fruitObjs.length;

  bars.innerHTML =
    '<div class="flavor-bar-row">' +
      '<span class="flavor-bar-label">🍯 Sweet</span>' +
      '<div class="flavor-bar-track"><div class="flavor-bar-fill sweet" style="width:' + (avgSweet * 10) + '%"></div></div>' +
    '</div>' +
    '<div class="flavor-bar-row">' +
      '<span class="flavor-bar-label">🍋 Tart</span>' +
      '<div class="flavor-bar-track"><div class="flavor-bar-fill tart" style="width:' + (avgTart * 10) + '%"></div></div>' +
    '</div>' +
    '<div class="flavor-bar-row">' +
      '<span class="flavor-bar-label">🌿 Fresh</span>' +
      '<div class="flavor-bar-track"><div class="flavor-bar-fill fresh" style="width:' + (avgFresh * 10) + '%"></div></div>' +
    '</div>';
}

// ============================================================
// BLENDING ANIMATION & JUICE CREATION
// ============================================================

function startBlend() {
  var fruits = state.blenderFruits.filter(Boolean);
  if (fruits.length < 2) {
    toast('Add at least 2 fruits to blend!');
    return;
  }
  if (fruits.length > 4) {
    toast('Max 4 fruits in the blender!');
    return;
  }

  sfxBlend();
  startAudio();

  // Animate blender
  var jar = document.getElementById('blender-jar');
  var lid = document.getElementById('blender-lid');
  jar.classList.add('blending');
  lid.classList.add('blending');

  // Animate juice color
  var juiceDisplay = document.getElementById('blender-juice');
  var fruitObjs = fruits.map(function(id) {
    return ALL_FRUITS.find(function(f) { return f.id === id; });
  }).filter(Boolean);

  var avgSweet = fruitObjs.reduce(function(s, f) { return s + f.sweet; }, 0) / fruitObjs.length;
  var avgTart = fruitObjs.reduce(function(s, f) { return s + f.tart; }, 0) / fruitObjs.length;
  var avgFresh = fruitObjs.reduce(function(s, f) { return s + f.fresh; }, 0) / fruitObjs.length;

  // Choose a juice color based on the main fruit category
  var catCounts = {};
  fruitObjs.forEach(function(f) { catCounts[f.cat] = (catCounts[f.cat] || 0) + 1; });
  var dominantCat = Object.keys(catCounts).sort(function(a, b) { return catCounts[b] - catCounts[a]; })[0];

  var colorMap = {
    basic:    '#ff8c42',
    citrus:   '#ffd93d',
    berry:    '#ff4757',
    tropical: '#ff6b35',
  };
  var juiceColor = colorMap[dominantCat] || '#ff8c42';

  document.documentElement.style.setProperty('--juice-color', juiceColor);
  juiceDisplay.style.backgroundColor = juiceColor;
  juiceDisplay.style.display = 'block';
  juiceDisplay.style.animation = 'none';
  juiceDisplay.offsetHeight;
  juiceDisplay.style.animation = 'juiceFill 0.8s ease forwards';

  // Blend particles
  var blenderArea = document.getElementById('blender-area');
  var rect = blenderArea.getBoundingClientRect();
  spawnParticles(rect.width / 2, rect.height / 2, blenderArea);

  // After animation, create the juice and go to design
  setTimeout(function() {
    jar.classList.remove('blending');
    lid.classList.remove('blending');

    state.currentJuice = {
      fruits: fruits.slice(),
      sweetness: avgSweet,
      tartness: avgTart,
      freshness: avgFresh,
      color: juiceColor,
      dominantCat: dominantCat,
    };

    state.currentDesign = {
      bottle: 'glass',
      cap: 'silver',
      label: 'fresh',
      name: '',
    };

    sfxSuccess();
    toast('Juice created! Match the Frutex drinks for bonus coins.');
    startMinigame();
  }, 1500);
}

// ============================================================
// MINIGAME — Memory Match (Frutex Natural 100% Drinks)
// ============================================================

/** Frutex Natural 100% drink pool for memory game (4 random pairs picked each round = 8 cards) */
const MEMORY_DRINKS = [
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', color: '#ff6b9d', img: 'Natural-Strawberry-200ml.webp' },
  { id: 'apple',      name: 'Apple',      emoji: '🍎', color: '#ff4757', img: 'Natural-Apple-750ml.webp' },
  { id: 'orange',     name: 'Orange',     emoji: '🍊', color: '#ff9f43', img: 'Natural-Orange-200ml.webp' },
  { id: 'peach',      name: 'Peach',      emoji: '🍑', color: '#ffcc80', img: 'Natural-Peach-200ml.webp' },
  { id: 'carrot',     name: 'Carrot',     emoji: '🥕', color: '#ff8c42', img: 'Natural-Carrot-200ml.webp' },
  { id: 'grape',      name: 'Grape',      emoji: '🍇', color: '#a855f7', img: 'Natural-Grape-250ml.webp' },
  { id: 'blueberry',  name: 'Blueberry',  emoji: '🫐', color: '#5b7fff', img: 'Natural-Blueberry-200ml.webp' },
  { id: 'sourcherry', name: 'Sourcherry', emoji: '🍒', color: '#dc143c', img: 'Natural-Sourcherry-200ml.webp' },
];

var memoryCards = [];       // shuffled card objects
var memoryFlipped = [];     // indices of currently flipped cards
var memoryMatched = [];     // indices of matched cards
var memoryMoves = 0;
var memoryTimer = 0;        // elapsed seconds
var memoryTimeLeft = 20;    // countdown
var memoryInterval = null;

function startMinigame() {
  // Randomly pick 4 drinks from the pool each round (8 cards)
  var pool = MEMORY_DRINKS.slice();
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  var chosen = pool.slice(0, 4);

  // Build deck: 2 of each chosen drink
  memoryCards = [];
  chosen.forEach(function(d) {
    memoryCards.push({ drink: d, pairId: d.id });
    memoryCards.push({ drink: d, pairId: d.id });
  });
  // Shuffle
  for (var i = memoryCards.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = memoryCards[i];
    memoryCards[i] = memoryCards[j];
    memoryCards[j] = tmp;
  }

  memoryFlipped = [];
  memoryMatched = [];
  memoryMoves = 0;
  memoryTimer = 0;
  memoryTimeLeft = 20;

  document.getElementById('mg-moves').textContent = '0';
  document.getElementById('mg-time').textContent = '20s';
  document.getElementById('mg-time').style.color = '';
  document.getElementById('mg-complete-btn').style.display = 'none';

  renderMemoryGrid();
  showScreen('minigame');

  // Start countdown timer (20s)
  clearInterval(memoryInterval);
  memoryInterval = setInterval(function() {
    memoryTimer++;
    memoryTimeLeft--;
    document.getElementById('mg-time').textContent = memoryTimeLeft + 's';
    if (memoryTimeLeft <= 5) {
      document.getElementById('mg-time').style.color = 'var(--fruit-red)';
    }
    if (memoryTimeLeft <= 0) {
      clearInterval(memoryInterval);
      timeUpMinigame();
    }
  }, 1000);
}

function renderMemoryGrid() {
  var grid = document.getElementById('memory-grid');
  grid.innerHTML = memoryCards.map(function(card, idx) {
    var flipped = memoryFlipped.indexOf(idx) !== -1 || memoryMatched.indexOf(idx) !== -1;
    var matched = memoryMatched.indexOf(idx) !== -1;
    return '<div class="memory-card' + (flipped ? ' flipped' : '') + (matched ? ' matched' : '') + '" ' +
           'onclick="flipCard(' + idx + ')" style="--card-color:' + card.drink.color + '">' +
           '<div class="memory-card-inner">' +
             '<div class="memory-card-front">' +
               '<span class="memory-card-logo">🍹 Frutex</span>' +
             '</div>' +
             '<div class="memory-card-back">' +
               '<img class="memory-card-img" src="' + card.drink.img + '" alt="' + card.drink.name + '">' +
               '<span class="memory-card-label">Natural 100%<br>' + card.drink.name + '</span>' +
             '</div>' +
           '</div>' +
           '</div>';
  }).join('');
}

function flipCard(idx) {
  if (memoryFlipped.length >= 2) return;           // two already flipped
  if (memoryFlipped.indexOf(idx) !== -1) return;   // already flipped
  if (memoryMatched.indexOf(idx) !== -1) return;   // already matched

  memoryFlipped.push(idx);
  sfxClick();
  renderMemoryGrid();

  if (memoryFlipped.length === 2) {
    memoryMoves++;
    document.getElementById('mg-moves').textContent = memoryMoves;

    var a = memoryFlipped[0];
    var b = memoryFlipped[1];

    if (memoryCards[a].pairId === memoryCards[b].pairId) {
      // Match!
      memoryMatched.push(a, b);
      memoryFlipped = [];
      sfxSuccess();
      renderMemoryGrid();

      // Check win
      if (memoryMatched.length === memoryCards.length) {
        clearInterval(memoryInterval);
        // Bonus coins based on performance
        var bonus = Math.max(20, 80 - memoryMoves * 5 - memoryTimer * 2);
        animateCoins(state.coins + bonus);
        state.coins += bonus;
        sfxCoins();
        spawnConfetti();
        document.getElementById('mg-complete-btn').style.display = '';
        document.getElementById('mg-complete-btn').textContent =
          '🎉 +' + bonus + ' coins — Continue →';
        toast('All matched! +' + bonus + ' bonus coins!');
      }
    } else {
      // No match — flip back after delay
      setTimeout(function() {
        memoryFlipped = [];
        renderMemoryGrid();
      }, 800);
    }
  }
}

function timeUpMinigame() {
  // Auto-reveal all unmatched cards, small consolation bonus
  var matchedCount = memoryMatched.length;
  var totalCards = memoryCards.length;
  if (matchedCount < totalCards) {
    toast('⏰ Time\'s up! ' + (matchedCount / 2) + ' pairs found.');
    // Small bonus for partial completion
    var bonus = Math.floor(matchedCount / 2) * 10;
    if (bonus > 0) { animateCoins(state.coins + bonus); state.coins += bonus; toast('+' + bonus + ' coins for ' + (matchedCount / 2) + ' pairs!'); }
  }
  spawnConfetti();
  document.getElementById('mg-time').textContent = '0s';
  document.getElementById('mg-time').style.color = '';
  document.getElementById('mg-complete-btn').style.display = '';
  document.getElementById('mg-complete-btn').textContent = 'Continue →';
}

function finishMinigame() {
  clearInterval(memoryInterval);
  document.querySelectorAll('.confetti').forEach(function(c) { c.remove(); });
  saveState();
  showScreen('design');
}

function skipMinigame() {
  clearInterval(memoryInterval);
  document.querySelectorAll('.confetti').forEach(function(c) { c.remove(); });
  toast('Minigame skipped.');
  showScreen('design');
}

// ============================================================
// BOTTLE DESIGN SCREEN
// ============================================================

var currentDesignStep = 1;

function designNext(step) {
  currentDesignStep = step;

  // Update step panels
  document.querySelectorAll('.design-step').forEach(function(el) { el.classList.remove('active'); });
  var panel = document.getElementById('design-step-' + step);
  if (panel) panel.classList.add('active');

  // Refresh content for the current step
  if (step === 1) { renderBottleShapes(); renderBottleColors(); }
  if (step === 2) renderCapColors();
  if (step === 3) { renderLabelDesigns(); renderBgGradients(); }

  // Update step dots
  document.querySelectorAll('.step-dot').forEach(function(dot) {
    var s = parseInt(dot.dataset.step);
    dot.classList.remove('active', 'done');
    if (s === step) dot.classList.add('active');
    else if (s < step) dot.classList.add('done');
  });

  // Update label
  document.getElementById('design-step-label').textContent = 'Step ' + step + '/4';
}

function renderDesignScreen() {
  renderBottleShapes();
  renderBottleColors();
  renderCapColors();
  renderLabelDesigns();
  renderBgGradients();
  updateDesignPreview();
  document.getElementById('juice-name-input').value = state.currentDesign.name || '';
  designNext(1);
}

function renderBottleShapes() {
  var grid = document.getElementById('bottle-shapes');
  var unlocked = state.unlockedBottles.concat(state.shopUnlockedBottles);

  var html = '';
  ALL_BOTTLES.forEach(function(b) {
    var isUnlocked = unlocked.indexOf(b.id) !== -1;
    var isSelected = state.currentDesign.bottle === b.id;
    if (isUnlocked) {
      html += '<div class="design-option' + (isSelected ? ' selected' : '') + '" ' +
              'onclick="selectBottle(\'' + b.id + '\')" title="' + b.name + '">' +
              b.icon + '</div>';
    } else {
      html += '<div class="design-option locked" title="Unlock at Level ' + b.unlock + '">' +
              b.icon + '</div>';
    }
  });
  grid.innerHTML = html;
}

function renderCapColors() {
  var grid = document.getElementById('cap-colors');
  var unlocked = state.unlockedCaps.concat([]);
  // caps don't have shop unlocks currently, but struct supports it

  var html = '';
  ALL_CAPS.forEach(function(c) {
    var isUnlocked = unlocked.indexOf(c.id) !== -1;
    var isSelected = state.currentDesign.cap === c.id;
    if (isUnlocked) {
      html += '<div class="cap-swatch' + (isSelected ? ' selected' : '') + '" ' +
              'style="background:' + c.color + '" ' +
              'onclick="selectCap(\'' + c.id + '\')" title="' + c.name + '"></div>';
    } else {
      html += '<div class="cap-swatch" style="background:' + c.color + '; opacity:0.3; filter:grayscale(0.6);" ' +
              'title="Unlock at Level ' + c.unlock + '"></div>';
    }
  });
  grid.innerHTML = html;
}

function renderLabelDesigns() {
  var grid = document.getElementById('label-designs');
  var unlocked = state.unlockedLabels.concat(state.shopUnlockedLabels);

  var html = '';
  ALL_LABELS.forEach(function(l) {
    var isUnlocked = unlocked.indexOf(l.id) !== -1;
    var isSelected = state.currentDesign.label === l.id;
    if (isUnlocked) {
      html += '<div class="design-option label-swatch' + (isSelected ? ' selected' : '') + '" ' +
              'onclick="selectLabel(\'' + l.id + '\')" title="' + l.name + '"' +
              ' style="background:' + l.bg + ';color:' + l.text + ';font-size:0.65rem;font-weight:700;font-style:italic;">' +
              l.name.split(' ')[0] + '</div>';
    } else {
      html += '<div class="design-option locked" title="Unlock at Level ' + l.unlock + '">' +
              l.style.split(' ')[0] + '</div>';
    }
  });
  grid.innerHTML = html;
}

function selectBottle(id) {
  state.currentDesign.bottle = id;
  sfxClick();
  updateDesignPreview();
  renderBottleShapes();
}

function selectCap(id) {
  state.currentDesign.cap = id;
  sfxClick();
  updateDesignPreview();
  renderCapColors();
}

function selectLabel(id) {
  state.currentDesign.label = id;
  sfxClick();
  updateDesignPreview();
  renderLabelDesigns();
}

function renderBgGradients() {
  var grid = document.getElementById('bg-gradient-options');
  if (!grid) return;
  var html = '';
  BG_GRADIENTS.forEach(function(g) {
    var isSelected = state.currentDesign.bgGradient === g.id;
    var bgStyle = g.id === 'none' ? 'background:#f5f5f5;color:#999' : 'background:' + g.gradient;
    html += '<div class="design-option gradient-swatch' + (isSelected ? ' selected' : '') + '" ' +
            'data-gradient="' + g.id + '" title="' + g.name + '"' +
            ' style="' + bgStyle + ';font-size:0.6rem;font-weight:700;">' +
            (g.id === 'none' ? '✖' : g.name.split(' ')[0]) + '</div>';
  });
  grid.innerHTML = html;
  grid.onclick = function(e) {
    var el = e.target.closest('[data-gradient]');
    if (el) selectBgGradient(el.dataset.gradient);
  };
}

function selectBgGradient(id) {
  state.currentDesign.bgGradient = id;
  sfxClick();
  updateDesignPreview();
  renderBgGradients();
}

function renderBottleColors() {
  var grid = document.getElementById('bottle-colors');
  if (!grid) return;
  var html = '';
  BOTTLE_COLORS.forEach(function(c) {
    var isSelected = state.currentDesign.bottleColor === c.id;
    html += '<div class="design-option' + (isSelected ? ' selected' : '') + '" ' +
            'data-bcolor="' + c.id + '" title="' + c.name + '"' +
            ' style="background:' + c.color + ';border:2px solid ' + (c.id==='clear'?'#ddd':'transparent') + ';">' +
            (c.id === 'clear' ? '◯' : '') + '</div>';
  });
  grid.innerHTML = html;
  grid.onclick = function(e) {
    var el = e.target.closest('[data-bcolor]');
    if (el) selectBottleColor(el.dataset.bcolor);
  };
}

function selectBottleColor(id) {
  state.currentDesign.bottleColor = id;
  sfxClick();
  updateDesignPreview();
  renderBottleColors();
}

function updateJuiceName() {
  state.currentDesign.name = document.getElementById('juice-name-input').value.trim();
}

function updateDesignPreview() {
  var body = document.getElementById('preview-body');
  var cap = document.getElementById('preview-cap');
  var label = document.getElementById('preview-label');
  var nameEl = document.getElementById('preview-name');

  var bottle = ALL_BOTTLES.find(function(b) { return b.id === state.currentDesign.bottle; });
  var capData = ALL_CAPS.find(function(c) { return c.id === state.currentDesign.cap; });
  var labelData = ALL_LABELS.find(function(l) { return l.id === state.currentDesign.label; });

  // Update body shape
  body.className = 'preview-body ' + (bottle ? bottle.shape : 'shape-round');

  // Apply bottle glass tint
  var bottleColorData = BOTTLE_COLORS.find(function(c) { return c.id === state.currentDesign.bottleColor; });
  body.style.boxShadow = bottleColorData ? 'inset 0 0 40px ' + bottleColorData.color + ', 0 0 0 2px rgba(0,0,0,0.12)' : '';

  // Bottle stays clear glass — no juice fill

  // Update cap
  cap.style.background = capData ? capData.color : '#c0c0c0';
  document.documentElement.style.setProperty('--cap-color', capData ? capData.color : '#c0c0c0');

  // Update label
  label.textContent = labelData ? labelData.name : 'FRUTEX';
  if (labelData) {
    label.style.background = labelData.bg || 'rgba(255,255,255,0.92)';
    label.style.color = labelData.text || 'var(--text)';
    label.style.border = '2px solid ' + (labelData.border || 'transparent');
    label.style.fontWeight = '800';
    label.style.fontStyle = 'italic';
  } else {
    label.style.background = 'rgba(255,255,255,0.92)';
    label.style.color = 'var(--text)';
    label.style.border = 'none';
    label.style.fontWeight = '800';
    label.style.fontStyle = 'normal';
  }

  // Update name
  nameEl.textContent = state.currentDesign.name || bottle ? bottle.name : 'Classic Round';

  // Apply background gradient glow
  var gradData = BG_GRADIENTS.find(function(g) { return g.id === state.currentDesign.bgGradient; });
  var bottleEl = document.getElementById('preview-bottle');
  if (gradData && gradData.id !== 'none') {
    bottleEl.style.background = gradData.gradient;
    bottleEl.style.padding = '12px';
    bottleEl.style.borderRadius = '20px';
    bottleEl.style.boxShadow = '0 0 25px rgba(0,0,0,0.06)';
  } else {
    bottleEl.style.background = '';
    bottleEl.style.padding = '';
    bottleEl.style.borderRadius = '';
    bottleEl.style.boxShadow = '';
  }
}

// ============================================================
// CUSTOMER PRESENTATION & RATING
// ============================================================

var currentCustomer = null;

function presentToCustomer() {
  if (!state.currentJuice) {
    toast('Create a juice first!');
    return;
  }

  updateJuiceName();

  // Pick random customer
  currentCustomer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];

  // Render customer
  var area = document.getElementById('customer-area');
  area.innerHTML =
    '<div class="customer-avatar">' + currentCustomer.emoji + '</div>' +
    '<div class="customer-name">' + currentCustomer.name + '</div>' +
    '<div class="customer-quote">"' + currentCustomer.quote + '"</div>';

  // Show order
  var orderEl = document.getElementById('customer-order');
  orderEl.style.display = '';
  orderEl.innerHTML = '📋 <b>Order:</b> ' + currentCustomer.bonusText + ' — earn bonus coins!';

  // Juice preview with pouring animation
  var juiceEl = document.getElementById('present-juice');
  juiceEl.innerHTML = '🧃';
  juiceEl.className = 'present-juice pouring';
  juiceEl.style.display = '';

  document.getElementById('reaction-display').style.display = 'none';
  document.getElementById('rating-display').style.display = 'none';
  document.getElementById('continue-btn').style.display = 'none';
  document.getElementById('present-btn').style.display = '';

  showScreen('present');
}

function checkOrderFulfilled(customer, juice) {
  var order = customer.order;
  if (!order) return false;

  var fruits = juice.fruits;
  var fruitObjs = fruits.map(function(id) { return ALL_FRUITS.find(function(f) { return f.id === id; }); }).filter(Boolean);

  switch (order.type) {
    case 'category':
      return fruitObjs.some(function(f) { return f.cat === order.cat; });
    case 'specific':
      return order.fruits.every(function(fid) { return fruits.indexOf(fid) !== -1; });
    case 'flavor':
      return juice.sweetness >= order.minSweet;
    case 'count':
      return fruits.length >= order.minFruits;
    case 'categories':
      return fruitObjs.some(function(f) { return order.cats.indexOf(f.cat) !== -1; });
  }
  return false;
}

function getRating() {
  if (!currentCustomer || !state.currentJuice) return;

  startAudio();
  sfxBlend();

  var juice = state.currentJuice;
  var design = state.currentDesign;
  var customer = currentCustomer;

  // Check order
  var orderFulfilled = checkOrderFulfilled(customer, juice);

  // Taste score
  var tasteScore = 40 + juice.fruits.length * 10 + juice.freshness * 3;
  tasteScore = Math.min(100, tasteScore);

  // Creativity
  var uniqueCats = {};
  juice.fruits.forEach(function(id) {
    var f = ALL_FRUITS.find(function(ff) { return ff.id === id; });
    if (f) uniqueCats[f.cat] = true;
  });
  var catCount = Object.keys(uniqueCats).length;
  var creativityScore = Math.min(100, juice.fruits.length * 15 + catCount * 12);

  // Appearance
  var appearanceScore = 50 + (design.bgGradient !== 'none' ? 15 : 0) + (design.name ? 10 : 0);
  appearanceScore = Math.min(100, appearanceScore);

  // Order bonus
  if (orderFulfilled) {
    tasteScore = Math.min(100, tasteScore + 15);
  }

  var overallScore = Math.round(tasteScore * 0.45 + creativityScore * 0.3 + appearanceScore * 0.25);
  overallScore = Math.max(10, Math.min(100, overallScore));

  var stars = 1;
  if (overallScore >= 85) stars = 5;
  else if (overallScore >= 70) stars = 4;
  else if (overallScore >= 50) stars = 3;
  else if (overallScore >= 30) stars = 2;

  // Rewards — bonus for order
  var coinsEarned = stars * 20 + Math.floor(overallScore * 0.3);
  var xpEarned = stars * 15 + Math.floor(overallScore * 0.2);
  if (orderFulfilled) { coinsEarned += 30; xpEarned += 10; }

  // --- Animated Reaction ---
  var reaction = REACTIONS[stars];
  var phrase = reaction.phrases[Math.floor(Math.random() * reaction.phrases.length)];
  var reactEl = document.getElementById('reaction-display');
  reactEl.innerHTML =
    '<div class="reaction-emoji">' + reaction.emoji + '</div>' +
    '<div class="reaction-comment">' + phrase + '</div>';
  reactEl.style.display = 'flex';

  // --- Rating Breakdown ---
  var ratingEl = document.getElementById('rating-display');
  var starStr = '';
  for (var i = 0; i < 5; i++) starStr += i < stars ? '⭐' : '☆';

  ratingEl.innerHTML =
    '<div class="rating-stars">' + starStr + '</div>' +
    (orderFulfilled ? '<div style="color:var(--accent-gold);font-weight:700;font-size:0.85rem">✅ Order fulfilled! +30 bonus coins!</div>' : '') +
    '<div class="rating-breakdown">' +
      '<div class="rating-row"><span>🍯 Taste</span><div class="rating-row-bar"><div class="rating-row-bar-fill" style="width:' + tasteScore + '%"></div></div><span>' + Math.round(tasteScore) + '%</span></div>' +
      '<div class="rating-row"><span>🎨 Creativity</span><div class="rating-row-bar"><div class="rating-row-bar-fill" style="width:' + creativityScore + '%"></div></div><span>' + Math.round(creativityScore) + '%</span></div>' +
      '<div class="rating-row"><span>✨ Appearance</span><div class="rating-row-bar"><div class="rating-row-bar-fill" style="width:' + appearanceScore + '%"></div></div><span>' + Math.round(appearanceScore) + '%</span></div>' +
    '</div>' +
    '<div class="rewards-display"><span>🪙 +' + coinsEarned + '</span><span>✨ +' + xpEarned + ' XP</span></div>';

  ratingEl.style.display = 'flex';
  document.getElementById('present-btn').style.display = 'none';
  document.getElementById('continue-btn').style.display = '';

  // Apply rewards
  animateCoins(state.coins + coinsEarned);
  state.coins += coinsEarned;
  var oldLevel = state.level;
  state.xp += xpEarned;
  updateLevel();
  state.totalJuicesCreated++;
  juice.fruits.forEach(function(id) { state.fruitUsage[id] = (state.fruitUsage[id] || 0) + 1; });
  state.bottleUsage[design.bottle] = (state.bottleUsage[design.bottle] || 0) + 1;
  state.labelUsage[design.label] = (state.labelUsage[design.label] || 0) + 1;
  if (stars === 5) state.perfectRatings++;
  if (stars >= 3) saveRecipe(juice, design, stars, overallScore);
  checkAchievements();
  updateDailyChallengeProgress(juice, design, stars);

  sfxCoins();
  if (stars >= 4) sfxSuccess();
  spawnConfetti();

  if (state.level > oldLevel) {
    setTimeout(function() { showLevelUp(oldLevel + 1); }, 1500);
  }
  saveState();
}

function finishRound() {
  // Clean up
  document.querySelectorAll('.confetti').forEach(function(c) { c.remove(); });

  state.blenderFruits = [];
  state.currentJuice = null;
  state.currentDesign = { bottle: 'glass', cap: 'silver', label: 'fresh', bgGradient: 'none', name: '' };
  currentCustomer = null;

  saveState();

  // Show Frutex fact occasionally (50% chance)
  if (Math.random() < 0.5) {
    showFacts();
  } else {
    showScreen('menu');
  }
}

// ============================================================
// FRUTEX FACTS
// ============================================================

var factsUsed = [];

function showFacts() {
  if (factsUsed.length >= FRUTEX_FACTS.length) factsUsed = [];
  var available = [];
  FRUTEX_FACTS.forEach(function(f, i) {
    if (factsUsed.indexOf(i) === -1) available.push(f);
  });
  if (available.length === 0) { showScreen('menu'); return; }
  var fact = available[Math.floor(Math.random() * available.length)];
  factsUsed.push(FRUTEX_FACTS.indexOf(fact));

  document.getElementById('facts-icon').textContent = fact.icon;
  document.getElementById('facts-text').textContent = fact.fact;
  showScreen('facts');
}

function dismissFacts() {
  showScreen('menu');
  saveState();
}

// ============================================================
// RECIPE BOOK
// ============================================================

function saveRecipe(juice, design, stars, score) {
  var fruitObjs = juice.fruits.map(function(id) {
    return ALL_FRUITS.find(function(f) { return f.id === id; });
  }).filter(Boolean);

  var recipe = {
    id: Date.now(),
    name: design.name || 'Unnamed Juice',
    fruitIds: juice.fruits.slice(),
    fruitEmojis: fruitObjs.map(function(f) { return fruitIcon(f); }).join(''),
    bottle: design.bottle,
    cap: design.cap,
    label: design.label,
    stars: stars,
    score: score,
    date: new Date().toLocaleDateString(),
    juiceColor: juice.color,
  };

  // Don't save duplicates
  var isDup = state.recipes.some(function(r) {
    return r.fruitIds.sort().join(',') === recipe.fruitIds.sort().join(',');
  });

  if (!isDup) {
    state.recipes.unshift(recipe);
    if (state.recipes.length > 50) state.recipes.pop(); // Keep max 50
    toast('📖 Recipe saved!');
  }
}

var recipeTab = 'my';

function renderRecipes() {
  var grid = document.getElementById('recipes-grid');
  var sigGrid = document.getElementById('signature-grid');
  var empty = document.getElementById('recipes-empty');

  if (recipeTab === 'my') {
    grid.style.display = '';
    sigGrid.style.display = 'none';
    if (state.recipes.length === 0) {
      grid.innerHTML = '';
      empty.style.display = '';
      return;
    }
    empty.style.display = 'none';
    grid.innerHTML = state.recipes.map(function(r) {
      var starStr = '';
      for (var i = 0; i < 5; i++) starStr += i < r.stars ? '⭐' : '☆';
      return '<div class="recipe-card">' +
        '<div class="recipe-card-header">' +
          '<span class="recipe-card-name">' + escapeHtml(r.name) + '</span>' +
          '<span class="recipe-card-stars">' + starStr + '</span>' +
        '</div>' +
        '<div class="recipe-card-fruits">' + r.fruitEmojis + '</div>' +
        '<div class="recipe-card-meta">' + r.date + ' · Score: ' + r.score + '%</div>' +
        '<button class="recipe-card-load" onclick="loadRecipe(' + r.id + ')">🔄 Reload</button>' +
      '</div>';
    }).join('');
  } else {
    grid.style.display = 'none';
    sigGrid.style.display = '';
    renderSignatureDrinks();
  }
}

function renderSignatureDrinks() {
  var sigGrid = document.getElementById('signature-grid');
  var empty = document.getElementById('recipes-empty');
  empty.style.display = 'none';

  sigGrid.innerHTML = SIGNATURE_DRINKS.map(function(d) {
    var unlocked = state.unlockedSignatureDrinks.indexOf(d.level) !== -1;
    var fruitEmojis = d.fruits.map(function(fid) {
      var f = ALL_FRUITS.find(function(ff) { return ff.id === fid; });
      return f ? fruitIcon(f) : '❓';
    }).join('');

    if (unlocked) {
      return '<div class="signature-card" style="--sig-color:' + d.color + '">' +
        '<div class="signature-card-badge">Lv.' + d.level + '</div>' +
        '<div class="signature-card-icon">' + d.emoji + '</div>' +
        '<div class="signature-card-name">Frutex ' + d.name + '</div>' +
        '<div class="signature-card-fruits">' + fruitEmojis + '</div>' +
        '<div class="signature-card-desc">' + d.desc + '</div>' +
        '<button class="recipe-card-load" onclick="loadSignatureDrink(' + d.level + ')">🧃 Load Recipe</button>' +
      '</div>';
    } else {
      return '<div class="signature-card locked">' +
        '<div class="signature-card-badge">Lv.' + d.level + '</div>' +
        '<div class="signature-card-icon">🔒</div>' +
        '<div class="signature-card-name">???</div>' +
        '<div class="signature-card-fruits">❓❓❓</div>' +
        '<div class="signature-card-desc">Reach level ' + d.level + ' to unlock this Frutex Signature Drink!</div>' +
      '</div>';
    }
  }).join('');
}

function loadSignatureDrink(level) {
  var drink = SIGNATURE_DRINKS.find(function(d) { return d.level === level; });
  if (!drink) return;

  state.blenderFruits = drink.fruits.slice();
  state.currentJuice = {
    fruits: drink.fruits.slice(),
    sweetness: ALL_FRUITS.filter(function(f) { return drink.fruits.indexOf(f.id) !== -1; })
      .reduce(function(s, f) { return s + f.sweet; }, 0) / drink.fruits.length,
    tartness: ALL_FRUITS.filter(function(f) { return drink.fruits.indexOf(f.id) !== -1; })
      .reduce(function(s, f) { return s + f.tart; }, 0) / drink.fruits.length,
    freshness: ALL_FRUITS.filter(function(f) { return drink.fruits.indexOf(f.id) !== -1; })
      .reduce(function(s, f) { return s + f.fresh; }, 0) / drink.fruits.length,
    color: drink.color,
    dominantCat: 'basic',
  };
  state.currentDesign = { bottle: 'glass', cap: 'gold', label: 'fresh', name: 'Frutex ' + drink.name };
  document.documentElement.style.setProperty('--juice-color', drink.color);
  toast(drink.emoji + ' ' + drink.name + ' loaded! Present it to a customer.');
  showScreen('menu');
}

function loadRecipe(id) {
  var recipe = state.recipes.find(function(r) { return r.id === id; });
  if (!recipe) return;

  state.blenderFruits = recipe.fruitIds.slice();
  state.currentJuice = {
    fruits: recipe.fruitIds.slice(),
    sweetness: ALL_FRUITS.filter(function(f) { return recipe.fruitIds.indexOf(f.id) !== -1; })
      .reduce(function(s, f) { return s + f.sweet; }, 0) / recipe.fruitIds.length,
    tartness: ALL_FRUITS.filter(function(f) { return recipe.fruitIds.indexOf(f.id) !== -1; })
      .reduce(function(s, f) { return s + f.tart; }, 0) / recipe.fruitIds.length,
    freshness: ALL_FRUITS.filter(function(f) { return recipe.fruitIds.indexOf(f.id) !== -1; })
      .reduce(function(s, f) { return s + f.fresh; }, 0) / recipe.fruitIds.length,
    color: recipe.juiceColor,
    dominantCat: 'basic',
  };
  state.currentDesign = {
    bottle: recipe.bottle,
    cap: recipe.cap,
    label: recipe.label,
    name: recipe.name,
  };
  document.documentElement.style.setProperty('--juice-color', recipe.juiceColor);
  toast('Recipe loaded! Go to "Create New Juice" to present it.');
  showScreen('menu');
}

// ============================================================
// SHOP
// ============================================================

var shopCategory = 'fruits';

function renderShop() {
  document.getElementById('shop-coins').textContent = state.coins;
  renderShopGrid();
}

function renderShopGrid() {
  var grid = document.getElementById('shop-grid');
  var unlockedFruits = state.unlockedFruits.concat(state.shopUnlockedFruits);
  var unlockedBottles = state.unlockedBottles.concat(state.shopUnlockedBottles);
  var unlockedLabels = state.unlockedLabels.concat(state.shopUnlockedLabels);

  var html = '';

  if (shopCategory === 'fruits') {
    // Show fruits not yet unlocked
    ALL_FRUITS.filter(function(f) { return unlockedFruits.indexOf(f.id) === -1; })
      .forEach(function(f) {
        var canAfford = state.coins >= 200 && state.level >= f.unlock;
        html += '<div class="shop-card' + (state.level < f.unlock ? ' locked' : '') + '">' +
          '<span class="shop-card-icon">' + fruitIcon(f) + '</span>' +
          '<span class="shop-card-name">' + f.name + '</span>' +
          '<span class="shop-card-desc">' + f.name + ' fruit — sweet ' + f.sweet + '/10</span>' +
          (state.level >= f.unlock
            ? '<span class="shop-card-status">🪙 200</span><button class="btn-shop" ' +
              (!canAfford ? 'disabled' : '') + ' onclick="buyFruit(\'' + f.id + '\')">Buy</button>'
            : '<span class="shop-card-status">Requires Level ' + f.unlock + '</span>') +
          '</div>';
      });
  }

  if (shopCategory === 'bottles') {
    ALL_BOTTLES.filter(function(b) { return unlockedBottles.indexOf(b.id) === -1 && b.cost > 0; })
      .forEach(function(b) {
        var canAfford = state.coins >= b.cost && state.level >= b.unlock;
        html += '<div class="shop-card' + (state.level < b.unlock ? ' locked' : '') + '">' +
          '<span class="shop-card-icon">' + b.icon + '</span>' +
          '<span class="shop-card-name">' + b.name + '</span>' +
          '<span class="shop-card-desc">Unique bottle shape</span>' +
          (state.level >= b.unlock
            ? '<span class="shop-card-status">🪙 ' + b.cost + '</span><button class="btn-shop" ' +
              (!canAfford ? 'disabled' : '') + ' onclick="buyBottle(\'' + b.id + '\')">Buy</button>'
            : '<span class="shop-card-status">Requires Level ' + b.unlock + '</span>') +
          '</div>';
      });
  }

  if (shopCategory === 'labels') {
    ALL_LABELS.filter(function(l) { return unlockedLabels.indexOf(l.id) === -1 && l.cost > 0; })
      .forEach(function(l) {
        var canAfford = state.coins >= l.cost && state.level >= l.unlock;
        html += '<div class="shop-card' + (state.level < l.unlock ? ' locked' : '') + '">' +
          '<span class="shop-card-icon">' + l.style.split(' ')[0] + '</span>' +
          '<span class="shop-card-name">' + l.name + '</span>' +
          '<span class="shop-card-desc">Beautiful label design</span>' +
          (state.level >= l.unlock
            ? '<span class="shop-card-status">🪙 ' + l.cost + '</span><button class="btn-shop" ' +
              (!canAfford ? 'disabled' : '') + ' onclick="buyLabel(\'' + l.id + '\')">Buy</button>'
            : '<span class="shop-card-status">Requires Level ' + l.unlock + '</span>') +
          '</div>';
      });
  }

  if (shopCategory === 'boosters') {
    // XP Booster, Coin Booster
    html += '<div class="shop-card">' +
      '<span class="shop-card-icon">⚡</span>' +
      '<span class="shop-card-name">XP Booster</span>' +
      '<span class="shop-card-desc">Double XP for 3 juices</span>' +
      '<span class="shop-card-status">🪙 150</span>' +
      '<button class="btn-shop" onclick="toast(\'Coming soon!\')">Buy</button>' +
      '</div>';
    html += '<div class="shop-card">' +
      '<span class="shop-card-icon">💎</span>' +
      '<span class="shop-card-name">Coin Doubler</span>' +
      '<span class="shop-card-desc">Double coins for 3 juices</span>' +
      '<span class="shop-card-status">🪙 200</span>' +
      '<button class="btn-shop" onclick="toast(\'Coming soon!\')">Buy</button>' +
      '</div>';
  }

  if (!html) {
    html = '<p class="empty-state" style="grid-column:1/-1">Nothing available here right now. Level up to unlock more!</p>';
  }

  grid.innerHTML = html;
}

function buyFruit(id) {
  if (state.coins < 200) { toast('Not enough coins!'); return; }
  state.coins -= 200;
  state.shopUnlockedFruits.push(id);
  sfxCoins();
  toast('🍎 ' + (ALL_FRUITS.find(function(f) { return f.id === id; }) || {}).name + ' unlocked!');
  saveState();
  renderShop();
  document.getElementById('shop-coins').textContent = state.coins;
}

function buyBottle(id) {
  var bottle = ALL_BOTTLES.find(function(b) { return b.id === id; });
  if (!bottle) return;
  if (state.coins < bottle.cost) { toast('Not enough coins!'); return; }
  state.coins -= bottle.cost;
  state.shopUnlockedBottles.push(id);
  sfxCoins();
  toast('🍾 ' + bottle.name + ' unlocked!');
  saveState();
  renderShop();
  document.getElementById('shop-coins').textContent = state.coins;
}

function buyLabel(id) {
  var label = ALL_LABELS.find(function(l) { return l.id === id; });
  if (!label) return;
  if (state.coins < label.cost) { toast('Not enough coins!'); return; }
  state.coins -= label.cost;
  state.shopUnlockedLabels.push(id);
  sfxCoins();
  toast('🏷️ ' + label.name + ' unlocked!');
  saveState();
  renderShop();
  document.getElementById('shop-coins').textContent = state.coins;
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

function checkAchievements() {
  var progress = state.achievementProgress;

  // Track progress
  progress.first_juice = state.totalJuicesCreated;
  progress.juice_5 = state.totalJuicesCreated;
  progress.juice_20 = state.totalJuicesCreated;
  progress.perfect_rating = state.perfectRatings;

  // All basic fruits used
  var basicFruits = ALL_FRUITS.filter(function(f) { return f.cat === 'basic' && f.unlock === 1; }).map(function(f) { return f.id; });
  progress.all_basic = basicFruits.filter(function(id) { return state.fruitUsage[id]; }).length;

  // All berries used
  var berryFruits = ALL_FRUITS.filter(function(f) { return f.cat === 'berry'; }).map(function(f) { return f.id; });
  progress.all_berries = berryFruits.filter(function(id) { return state.fruitUsage[id]; }).length;

  // Bottles
  progress.three_bottles = (state.unlockedBottles.concat(state.shopUnlockedBottles)).length;
  progress.three_labels = (state.unlockedLabels.concat(state.shopUnlockedLabels)).length;
  progress.level_5 = state.level;
  progress.daily_5 = (progress.daily_5 || 0);

  // Check unlocks
  ACHIEVEMENTS.forEach(function(ach) {
    var prog = progress[ach.id] || 0;
    if (prog >= ach.goal && !state.achievementProgress[ach.id + '_done']) {
      state.achievementProgress[ach.id + '_done'] = true;
      // Grant reward
      var coinReward = parseInt(ach.reward) || 0;
      if (coinReward) {
        state.coins += coinReward;
        toast('🏆 Achievement: ' + ach.name + '! +' + coinReward + ' coins');
      }
      sfxSuccess();
    }
  });
}

function renderAchievements() {
  var grid = document.getElementById('achievements-grid');
  var html = '';

  ACHIEVEMENTS.forEach(function(ach) {
    var prog = state.achievementProgress[ach.id] || 0;
    var done = state.achievementProgress[ach.id + '_done'];
    var pct = Math.min(100, (prog / ach.goal) * 100);

    html += '<div class="achievement-card' + (done ? ' unlocked' : '') + '">' +
      '<div class="achievement-icon">' + ach.icon + '</div>' +
      '<div class="achievement-info">' +
        '<div class="achievement-name">' + ach.name + '</div>' +
        '<div class="achievement-desc">' + ach.desc + '</div>' +
        (done
          ? '<div class="achievement-done">✅ Completed! (' + ach.reward + ')</div>'
          : '<div class="achievement-progress">' +
              '<div class="achievement-progress-fill" style="width:' + pct + '%"></div>' +
            '</div>' +
            '<div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px">' + prog + ' / ' + ach.goal + '</div>') +
      '</div>' +
    '</div>';
  });

  grid.innerHTML = html;
}

// ============================================================
// DAILY CHALLENGES
// ============================================================

function generateDailyChallenges() {
  var today = new Date().toDateString();
  if (state.dailyDate === today && state.dailyChallenges.length > 0) return;

  // Pick 3 random challenges
  var pool = DAILY_CHALLENGE_POOL.slice();
  var challenges = [];
  for (var i = 0; i < 3 && pool.length > 0; i++) {
    var idx = Math.floor(Math.random() * pool.length);
    challenges.push(pool.splice(idx, 1)[0]);
  }

  state.dailyChallenges = challenges;
  state.dailyChallengeProgress = {};
  state.dailyDate = today;
  saveState();
}

function updateDailyChallengeProgress(juice, design, stars) {
  var progress = state.dailyChallengeProgress;

  state.dailyChallenges.forEach(function(ch, idx) {
    var key = 'ch_' + idx;
    progress[key] = progress[key] || 0;

    switch (ch.type) {
      case 'use_fruit':
        if (juice.fruits.indexOf(ch.fruit) !== -1) progress[key]++;
        break;
      case 'create_juices':
        progress[key]++;
        break;
      case 'high_rating':
        if (stars >= ch.minRating) progress[key] = 1;
        break;
      case 'use_bottles':
        // Track unique bottles used today
        var usedBottles = progress._usedBottles || [];
        if (usedBottles.indexOf(design.bottle) === -1) {
          usedBottles.push(design.bottle);
          progress._usedBottles = usedBottles;
          progress[key] = usedBottles.length;
        }
        break;
      case 'unique_fruits':
        var usedFruits = progress._usedFruits || [];
        juice.fruits.forEach(function(id) {
          if (usedFruits.indexOf(id) === -1) usedFruits.push(id);
        });
        progress._usedFruits = usedFruits;
        progress[key] = usedFruits.length;
        break;
    }

    // Check completion
    if (progress[key] >= ch.target && !progress[key + '_done']) {
      progress[key + '_done'] = true;
      state.coins += ch.reward;
      toast('✅ Challenge complete! +' + ch.reward + ' coins');
      sfxCoins();
      state.daily_5 = (state.achievementProgress.daily_5 || 0) + 1;
      state.achievementProgress.daily_5 = state.daily_5;
    }
  });

  saveState();
}

function renderChallenges() {
  generateDailyChallenges();
  var list = document.getElementById('challenges-list');
  var progress = state.dailyChallengeProgress;
  var html = '';

  state.dailyChallenges.forEach(function(ch, idx) {
    var key = 'ch_' + idx;
    var prog = progress[key] || 0;
    var done = progress[key + '_done'];

    html += '<div class="challenge-card' + (done ? ' completed' : '') + '">' +
      '<span class="challenge-icon">' + ch.icon + '</span>' +
      '<div class="challenge-info">' +
        '<div class="challenge-name">' + ch.desc + '</div>' +
        '<div class="challenge-progress">' + prog + ' / ' + ch.target + '</div>' +
      '</div>' +
      '<span class="challenge-reward">🪙 ' + ch.reward + '</span>' +
    '</div>';
  });

  list.innerHTML = html || '<p class="empty-state">No challenges today. Come back tomorrow!</p>';
}

// ============================================================
// LEVELING
// ============================================================

function updateLevel() {
  var newLevel = 1;
  for (var i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (state.xp >= LEVEL_XP[i]) { newLevel = i + 1; break; }
  }
  var oldLevel = state.level;
  state.level = newLevel;

  // Level-up unlocks
  if (newLevel > oldLevel) {
    // Unlock signature drinks for all levels up to newLevel
    for (var lv = oldLevel + 1; lv <= newLevel; lv++) {
      if (state.unlockedSignatureDrinks.indexOf(lv) === -1) {
        state.unlockedSignatureDrinks.push(lv);
      }
    }

    // Unlock items by level
    ALL_FRUITS.forEach(function(f) {
      if (f.unlock <= newLevel && f.unlock > 1 &&
          state.unlockedFruits.indexOf(f.id) === -1 &&
          state.shopUnlockedFruits.indexOf(f.id) === -1) {
        state.unlockedFruits.push(f.id);
      }
    });
    ALL_BOTTLES.forEach(function(b) {
      if (b.unlock <= newLevel && b.unlock > 1 &&
          state.unlockedBottles.indexOf(b.id) === -1 &&
          state.shopUnlockedBottles.indexOf(b.id) === -1) {
        state.unlockedBottles.push(b.id);
      }
    });
    ALL_CAPS.forEach(function(c) {
      if (c.unlock <= newLevel && c.unlock > 1 &&
          state.unlockedCaps.indexOf(c.id) === -1) {
        state.unlockedCaps.push(c.id);
      }
    });
    ALL_LABELS.forEach(function(l) {
      if (l.unlock <= newLevel && l.unlock > 1 &&
          state.unlockedLabels.indexOf(l.id) === -1 &&
          state.shopUnlockedLabels.indexOf(l.id) === -1) {
        state.unlockedLabels.push(l.id);
      }
    });
  }

  return newLevel;
}

function showLevelUp(fromLevel) {
  var level = state.level;
  document.getElementById('levelup-level').textContent = 'Level ' + level;

  var newTitle = getTitle(level);
  var oldTitle = getTitle(fromLevel);

  // Show unlocked signature drink first
  var unlocks = [];
  if (newTitle !== oldTitle) {
    unlocks.push('⭐ <b>New Title: ' + newTitle + '</b>');
  }
  var sigDrink = SIGNATURE_DRINKS.find(function(d) { return d.level === level; });
  if (sigDrink) {
    unlocks.push(sigDrink.emoji + ' <b>Frutex ' + sigDrink.name + '</b> — ' + sigDrink.desc);
  }

  // Show other unlocks
  ALL_FRUITS.forEach(function(f) {
    if (f.unlock === level) unlocks.push(fruitIcon(f) + ' ' + f.name);
  });
  ALL_BOTTLES.forEach(function(b) {
    if (b.unlock === level) unlocks.push(b.icon + ' ' + b.name);
  });
  ALL_LABELS.forEach(function(l) {
    if (l.unlock === level) unlocks.push('🏷️ ' + l.name);
  });

  var unlocksEl = document.getElementById('levelup-unlocks');
  if (unlocks.length > 0) {
    unlocksEl.innerHTML = unlocks.map(function(u) {
      return '<span class="levelup-unlock-item">🔓 ' + u + '</span>';
    }).join('');
  } else {
    unlocksEl.innerHTML = '<span class="levelup-unlock-item">🔓 New items in shop!</span>';
  }

  sfxLevelUp();
  spawnConfetti();
  showScreen('levelup');
}

function dismissLevelUp() {
  document.querySelectorAll('.confetti').forEach(function(c) { c.remove(); });
  showScreen('menu');
  saveState();
}

// ============================================================
// LOCAL STORAGE
// ============================================================

function saveState() {
  var data = {
    coins: state.coins,
    xp: state.xp,
    level: state.level,
    unlockedFruits: state.unlockedFruits,
    unlockedBottles: state.unlockedBottles,
    unlockedCaps: state.unlockedCaps,
    unlockedLabels: state.unlockedLabels,
    recipes: state.recipes,
    totalJuicesCreated: state.totalJuicesCreated,
    perfectRatings: state.perfectRatings,
    fruitUsage: state.fruitUsage,
    bottleUsage: state.bottleUsage,
    labelUsage: state.labelUsage,
    achievementProgress: state.achievementProgress,
    dailyChallenges: state.dailyChallenges,
    dailyChallengeProgress: state.dailyChallengeProgress,
    dailyDate: state.dailyDate,
    shopUnlockedFruits: state.shopUnlockedFruits,
    shopUnlockedBottles: state.shopUnlockedBottles,
    shopUnlockedLabels: state.shopUnlockedLabels,
    unlockedSignatureDrinks: state.unlockedSignatureDrinks,
  };
  try {
    localStorage.setItem('frutex_save', JSON.stringify(data));
  } catch(e) {
    // localStorage full
    console.warn('Could not save game:', e);
  }
}

function loadState() {
  try {
    var raw = localStorage.getItem('frutex_save');
    if (!raw) return;
    var data = JSON.parse(raw);

    state.coins = data.coins || 0;
    state.xp = data.xp || 0;
    state.level = data.level || 1;
    state.unlockedFruits = data.unlockedFruits || ['apple', 'orange', 'strawberry', 'peach', 'grape', 'pineapple', 'mango', 'banana'];
    state.unlockedBottles = data.unlockedBottles || ['glass','hex','vintage','carafe','bamboo'];
    state.unlockedCaps = data.unlockedCaps || ['silver','gold','green','blue','red','purple','pink','orange'];
    state.unlockedLabels = data.unlockedLabels || ['fresh','tropical','berry','citrus','rainbow','sunset'];
    state.recipes = data.recipes || [];
    state.totalJuicesCreated = data.totalJuicesCreated || 0;
    state.perfectRatings = data.perfectRatings || 0;
    state.fruitUsage = data.fruitUsage || {};
    state.bottleUsage = data.bottleUsage || {};
    state.labelUsage = data.labelUsage || {};
    state.achievementProgress = data.achievementProgress || {};
    state.dailyChallenges = data.dailyChallenges || [];
    state.dailyChallengeProgress = data.dailyChallengeProgress || {};
    state.dailyDate = data.dailyDate || '';
    state.shopUnlockedFruits = data.shopUnlockedFruits || [];
    state.shopUnlockedBottles = data.shopUnlockedBottles || [];
    state.shopUnlockedLabels = data.shopUnlockedLabels || [];
    state.unlockedSignatureDrinks = data.unlockedSignatureDrinks || [1];
  } catch(e) {
    console.warn('Could not load save:', e);
  }
}

function resetGame() {
  if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
    localStorage.removeItem('frutex_save');
    location.reload();
  }
}

// ============================================================
// MUTE TOGGLE
// ============================================================

var isMuted = false;
function toggleMute() {
  isMuted = !isMuted;
  var btn = document.getElementById('mute-btn');
  if (isMuted) {
    btn.textContent = '🔇';
    btn.classList.add('muted');
  } else {
    btn.textContent = '🔊';
    btn.classList.remove('muted');
  }
}

// Wrap sound functions with mute check
var _sfxDrop = sfxDrop, _sfxBlend = sfxBlend, _sfxClick = sfxClick;
var _sfxSuccess = sfxSuccess, _sfxCoins = sfxCoins, _sfxLevelUp = sfxLevelUp;
sfxDrop = function() { if (!isMuted) _sfxDrop(); };
sfxBlend = function() { if (!isMuted) _sfxBlend(); };
sfxClick = function() { if (!isMuted) _sfxClick(); };
sfxSuccess = function() { if (!isMuted) _sfxSuccess(); };
sfxCoins = function() { if (!isMuted) _sfxCoins(); };
sfxLevelUp = function() { if (!isMuted) _sfxLevelUp(); };

// ============================================================
// SHOP TAB SWITCHING
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // Shop tabs
  var shopTabs = document.querySelectorAll('#shop-screen .shop-tab');
  shopTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      shopTabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      shopCategory = tab.dataset.cat;
      renderShopGrid();
    });
  });

  // Fruit category tabs
  var fruitTabs = document.querySelectorAll('#fruit-tabs .fruit-tab');
  fruitTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      fruitTabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentFruitCat = tab.dataset.cat;
      renderFruitGrid();
    });
  });

  // Recipe book tabs
  var recipeTabs = document.querySelectorAll('#recipe-tabs .shop-tab');
  recipeTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      recipeTabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      recipeTab = tab.dataset.cat;
      renderRecipes();
    });
  });

  // Start audio on any user interaction
  document.addEventListener('click', startAudio, { once: true });
  document.addEventListener('touchstart', startAudio, { once: true });
});

// ============================================================
// HELPERS
// ============================================================

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// INIT
// ============================================================

function init() {
  loadState();
  updateLevel(); // Recalculate level from XP
  generateDailyChallenges();
  initBackground();
  refreshMenu();
}

init();
