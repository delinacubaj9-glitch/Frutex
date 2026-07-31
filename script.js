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
  { id: 'blueberry',  emoji: '🫐', svg: '<svg viewBox="0 0 32 32" width="28" height="28" style="display:inline-block;vertical-align:middle"><circle cx="16" cy="16" r="15" fill="#4a6fd4" stroke="#294090" stroke-width="2"/><circle cx="16" cy="16" r="11" fill="#6b90f0"/><ellipse cx="12" cy="11" rx="5" ry="3" fill="rgba(255,255,255,0.25)"/></svg>', name: 'Blueberry',  cat: 'berry',    sweet: 6, tart: 5, fresh: 6, unlock: 1 },
  { id: 'cherry',     emoji: '🍒', name: 'Cherry',     cat: 'berry',    sweet: 8, tart: 4, fresh: 6, unlock: 1 },
  { id: 'lemon',      emoji: '🍋', name: 'Lemon',      cat: 'citrus',   sweet: 2, tart: 8, fresh: 9, unlock: 1 },
  { id: 'watermelon', emoji: '🍉', name: 'Watermelon', cat: 'basic',    sweet: 8, tart: 1, fresh: 10, unlock: 1 },
  { id: 'kiwi',       emoji: '🥝', name: 'Kiwi',       cat: 'tropical', sweet: 5, tart: 6, fresh: 8, unlock: 1 },
  { id: 'banana',     emoji: '🍌', name: 'Banana',     cat: 'basic',    sweet: 8, tart: 1, fresh: 4, unlock: 1 },
  { id: 'lime',       emoji: '🍋', name: 'Lime',       cat: 'citrus',   sweet: 2, tart: 9, fresh: 10, unlock: 1 },
  { id: 'dragonfruit',emoji: '🌸', name: 'Dragonfruit',cat: 'tropical', sweet: 6, tart: 3, fresh: 9, unlock: 1 },
  { id: 'raspberry',  emoji: '🫐', name: 'Raspberry',  cat: 'berry',    sweet: 7, tart: 5, fresh: 7, unlock: 1 },
  { id: 'coconut',    emoji: '🥥', name: 'Coconut',    cat: 'tropical', sweet: 5, tart: 1, fresh: 8, unlock: 1 },
  { id: 'plum',       emoji: '🫐', name: 'Plum',       cat: 'berry',    sweet: 6, tart: 4, fresh: 5, unlock: 1 },
  { id: 'pear',       emoji: '🍐', name: 'Pear',       cat: 'basic',    sweet: 7, tart: 1, fresh: 7, unlock: 1 },
  { id: 'papaya',     emoji: '🫐', name: 'Papaya',     cat: 'tropical', sweet: 8, tart: 2, fresh: 8, unlock: 1 },
  { id: 'pomegranate',emoji: '🫐', name: 'Pomegranate',cat: 'berry',    sweet: 5, tart: 7, fresh: 8, unlock: 1 },
  { id: 'carrot',     emoji: '🥕', name: 'Carrot',     cat: 'basic',    sweet: 5, tart: 2, fresh: 9, unlock: 1 },
  { id: 'sourcherry', emoji: '🍒', name: 'Sourcherry', cat: 'berry',    sweet: 4, tart: 8, fresh: 7, unlock: 1 },
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
  carrot:     '#ff8c42',
  sourcherry: '#dc143c',
  banana:     '#ffe135',
  cherry:     '#dc143c',
  lemon:      '#fff44f',
  kiwi:       '#7bed9f',
  mango:      '#ff9f43',
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
  { id: 'purple', color: '#a855f7', name: 'Purple', unlock: 1, cost: 80 },
  { id: 'pink',   color: '#ff6b9d', name: 'Pink',   unlock: 1, cost: 80 },
  { id: 'orange', color: '#ff6b35', name: 'Orange', unlock: 1, cost: 80 },
];

/** Label designs */
const ALL_LABELS = [
  { id: 'fresh',    name: 'Fresh & Natural', style: '🌿 Fresh',        unlock: 1, cost: 0,   bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
  { id: 'tropical', name: 'Tropical Vibes',  style: '🌴 Tropical',     unlock: 1, cost: 0,   bg: '#fff3e0', text: '#e65100', border: '#ffcc80' },
  { id: 'berry',    name: 'Berry Bliss',     style: '🍓 Berry Bliss',  unlock: 1, cost: 100, bg: '#fce4ec', text: '#c62828', border: '#f48fb1' },
  { id: 'citrus',   name: 'Golden Citrus',   style: '🍋 Citrus Burst', unlock: 1, cost: 100, bg: '#fffde7', text: '#f9a825', border: '#fff176' },
  { id: 'rainbow',  name: 'Rainbow Burst',   style: '🌈 Rainbow',      unlock: 1, cost: 200, bg: 'linear-gradient(135deg,#fce4ec,#f3e5f5,#e3f2fd,#e0f7fa,#e8f5e9,#fffde7)', text: '#6a1b9a', border: '#ce93d8' },
  { id: 'sunset',   name: 'Sunset Glow',     style: '🌅 Sunset',       unlock: 1, cost: 200, bg: 'linear-gradient(135deg,#ffccbc,#ffab91,#ff8a65)', text: '#bf360c', border: '#ff7043' },
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
/** Animated customer reactions by star rating (kept for compat) */
const REACTIONS = {
  5: { emoji: '😍', phrases: ['PERFECT! This is exactly what I wanted!','Absolutely divine! You\'re a juice genius!','WOW! The best drink I\'ve ever had!'] },
  4: { emoji: '😊', phrases: ['Delicious! You really know your fruits!','Mmm, so good! Almost perfect!','I love this — great job!'] },
  3: { emoji: '🙂', phrases: ['Pretty good! I enjoyed it.','Not bad at all — nice work!','Tasty! Could use a little something extra.'] },
  2: { emoji: '😐', phrases: ['It\'s okay... not quite my taste.','Hmm, maybe try different fruits?','Average — but keep experimenting!'] },
  1: { emoji: '😕', phrases: ['Sorry, this isn\'t working for me...','That combination didn\'t quite work.','Better luck next time — keep trying!'] },
};

/** Queue NPC customers with unique personalities */
const NPC_CUSTOMERS = [
  { id:'marco', emoji:'🧔', name:'Marco', personality:'Friendly regular who loves fruit blends',
    img: 'lucid-origin_make_a_cartoon_style_character_that_just_got_back_from_the_pool_he_has_blue_eyes-0-removebg-preview.png',
    quote:'I\'d love something fresh — surprise me with a tasty blend!',
    order: { type:'category', cat:'basic' }, tip: 10 },
  { id:'sophia', emoji:'👩‍🦰', name:'Sophia', personality:'Health-conscious yoga instructor',
    img: 'lucid-origin_make_a_cartoon_style_charachter_with_hazel_big_eyes_and_long_light_brown_hair_we-0-removebg-preview.png',
    quote:'Only 3+ fruits please — I need my vitamins!',
    order: { type:'count', minFruits:3 }, tip: 15 },
  { id:'luca', emoji:'👦', name:'Luca', personality:'Excited kid who loves sweet drinks',
    quote:'Make it super sweet and colourful! Extra fruity!',
    order: { type:'flavor', minSweet:7 }, tip: 8 },
  { id:'elena', emoji:'👩', name:'Elena', personality:'Busy professional who wants efficiency',
    img: 'lucid-origin_make_a_cartoon_style_charachter_with_brown_eyes_and_long_brown_hair_with_a_hint_-0-removebg-preview.png',
    quote:'Quick and crisp — citrus only. I\'m in a hurry!',
    order: { type:'category', cat:'citrus' }, tip: 12 },
  { id:'giovanni', emoji:'👨‍🦳', name:'Giovanni', personality:'Retired chef with refined taste',
    img: 'lucid-origin_create_a_cartoon_style_character_fullbody_standing_pose_with_haazel_eyes_and_sho-0-removebg-preview.png',
    quote:'I know good juice. Blend strawberry with something unexpected.',
    order: { type:'specific', fruits:['strawberry'] }, tip: 20 },
];

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
  if (level >= 4) return 'Frutex Champion';
  if (level >= 3) return 'Master Blender';
  if (level >= 2) return 'Juice Expert';
  return 'Junior Juice Maker';
}

/** Check and update level progress after completing a drink */
function checkLevelProgress(stars, fruitCount) {
  var goal = LEVEL_GOALS[state.level];
  if (!goal || state.level > 4) return;

  var made = false;
  switch (goal.type) {
    case 'good_drinks':
      if (stars >= goal.minStars) made = true;
      break;
    case 'customer_orders':
      if (stars >= 3) made = true; // any decent drink counts
      break;
    case 'perfect_ratings':
      if (stars >= goal.minStars) made = true;
      break;
    case 'complex_drinks':
      if (fruitCount >= goal.minFruits && stars >= 3) made = true;
      break;
  }

  if (made) {
    state.levelProgress++;
    if (state.levelProgress >= goal.target) {
      state.level++;
      state.levelProgress = 0;
      var newGoal = LEVEL_GOALS[state.level];
      if (newGoal) {
        showLevelUp(state.level - 1);
        toast('🎉 Level ' + state.level + '! ' + newGoal.desc);
      } else {
        toast('🏆 You beat all levels! You are a Frutex Champion!');
      }
    } else {
      toast('📋 Progress: ' + state.levelProgress + '/' + goal.target + ' — ' + goal.desc);
    }
  }
  saveState();
}

/** Frutex Signature Drinks — one unlocked per level */
const SIGNATURE_DRINKS = [
  { level: 1,  name: 'Sunrise Fresh',   emoji: '🌅', fruits: ['orange','peach'],                        desc: 'A bright morning blend of citrus & stone fruit.', color: '#ff9f43' },
  { level: 2,  name: 'Berry Blast',     emoji: '💥', fruits: ['strawberry','blueberry','grape'],          desc: 'Triple-berry explosion of flavour.',              color: '#a855f7' },
  { level: 3,  name: 'Tropical Storm',  emoji: '🌴', fruits: ['pineapple','mango','banana'],              desc: 'A whirlwind of tropical paradise.',               color: '#ffd93d' },
  { level: 4,  name: 'Green Power',     emoji: '🌿', fruits: ['kiwi','lime','apple'],                     desc: 'Zesty green fuel for the day ahead.',            color: '#7bed9f' },
];

/** Level objectives — mission-based progression */
const LEVEL_GOALS = [
  null, // index 0 unused
  { level: 1, desc: 'Create 2 great drinks', target: 2, type: 'good_drinks', minStars: 4 },
  { level: 2, desc: 'Serve Marco 3 tasty blends', target: 3, type: 'customer_orders', customer: { name: 'Marco', emoji: '🧔', quote: 'Surprise me with something fresh and fruity!' } },
  { level: 3, desc: 'Serve all 3 customers', target: 3, type: 'customers_served' },
  { level: 4, desc: 'Make the customers happy!', target: 3, type: 'happy_customers', minStars: 3 },
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
  levelProgress: 0,         // progress towards current level goal

  // Customer queue system
  customerQueue: [],        // queued NPC customers for current level
  currentCustomerIdx: 0,    // which customer is being served
  lastQueueLevel: 0,        // track which level the queue was generated for

  // Unlocks (arrays of IDs)
  unlockedFruits: ['apple','orange','strawberry','peach','grape','pineapple','mango','banana','blueberry','cherry','lemon','watermelon','kiwi','lime','dragonfruit','raspberry','coconut','plum','pear','papaya','pomegranate','carrot','sourcherry'],
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
  // Coin sound removed per user request
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

  // Keep music playing across all screens
  var music = document.getElementById('bg-music');
  if (music && !isMuted && music.paused) music.play().catch(function(){});

  // Refresh necessary panels
  if (name === 'menu') refreshMenu();
  if (name === 'game') {
    // Generate queue if empty or level changed
    if (state.customerQueue.length === 0 || state.lastQueueLevel !== state.level) {
      state.lastQueueLevel = state.level;
      generateCustomerQueue();
    }
    // Show NPC intro if level >= 2 and there are customers
    if (state.level >= 2 && state.customerQueue.length > 0) {
      showNpcIntro();
    }
    renderGameScreen();
  }
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
  // Only spawn bubbles, no fruit particles — just smooth juice blending
  for (var i = 0; i < 12; i++) {
    var b = document.createElement('div');
    b.className = 'blend-bubble';
    var size = 4 + Math.random() * 10;
    b.style.left = (x - 30 + Math.random() * 60) + 'px';
    b.style.top = (y + 20 + Math.random() * 40) + 'px';
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.animationDelay = (Math.random() * 0.6) + 's';
    b.style.animationDuration = (1 + Math.random() * 1.5) + 's';
    container.appendChild(b);
    setTimeout(function() { b.remove(); }, 2500);
  }
}

function spawnConfetti() {
  var colors = ['#ff6b35', '#ffd93d', '#2ed573', '#ff4757', '#a855f7', '#0abde3', '#ff6b9d', '#ff9f43'];
  for (var i = 0; i < 30; i++) {
    var c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.top = -(Math.random() * 20) + 'px';
    c.style.width = (6 + Math.random() * 8) + 'px';
    c.style.height = c.style.width;
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = Math.random() * 0.5 + 's';
    c.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    document.body.appendChild(c);
    setTimeout(function(el) { el.remove(); }, 3500, c);
  }
}

/** Glowing sparkles for rewards */
function spawnSparkles(el) {
  var rect = el.getBoundingClientRect();
  if (!rect) return;
  for (var i = 0; i < 15; i++) {
    var s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = (rect.left + rect.width * 0.3 + Math.random() * rect.width * 0.4) + 'px';
    s.style.top = (rect.top + rect.height * 0.3) + 'px';
    s.style.animationDelay = (Math.random() * 0.4) + 's';
    document.body.appendChild(s);
    setTimeout(function(el) { el.remove(); }, 1600, s);
  }
}

/** Juice splash droplets during blending */
function spawnSplash(container) {
  for (var i = 0; i < 8; i++) {
    var s = document.createElement('div');
    s.className = 'splash-particle';
    s.style.left = '50%';
    s.style.top = '60%';
    var angle = Math.random() * Math.PI * 2;
    var dist = 20 + Math.random() * 50;
    s.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--sy', Math.sin(angle) * dist - 20 + 'px');
    s.style.width = (2 + Math.random() * 5) + 'px';
    s.style.height = s.style.width;
    s.style.background = 'var(--juice-color, #ff6b35)';
    container.appendChild(s);
    setTimeout(function(el) { el.remove(); }, 800, s);
  }
}

// ============================================================
// MENU REFRESH
// ============================================================

function refreshMenu() {
  document.getElementById('menu-level').textContent = 'Level ' + state.level;
  document.getElementById('menu-coins').textContent = state.coins;
  document.getElementById('menu-title').textContent = getTitle(state.level);

  // Update level tab progress
  for (var i = 1; i <= 4; i++) {
    var progEl = document.getElementById('lvl-prog-' + i);
    var tabEl = document.querySelector('.level-tab[data-level="' + i + '"]');
    if (!progEl || !tabEl) continue;
    var goal = LEVEL_GOALS[i];
    tabEl.classList.remove('locked', 'active');
    if (i < state.level) {
      progEl.textContent = '✓ DONE';
      tabEl.classList.add('done');
    } else if (i === state.level) {
      progEl.textContent = state.levelProgress + '/' + goal.target;
      tabEl.classList.add('active');
    } else {
      progEl.textContent = '0/' + goal.target;
      tabEl.classList.add('locked');
    }
  }
}

function setLevelTab(level) {
  if (level > state.level) return; // locked
  // Navigate to game
  showScreen('game');
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
  updateQueueDisplay();
  showNpcPortrait();
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
    var thumb = p.img ? '<img src="' + p.img + '" alt="' + p.name + '" class="drink-card-img">' :
                         '<span class="drink-card-emoji">' + (p.emoji || '🧃') + '</span>';
    html += '<div class="drink-card">' +
      thumb +
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
  spawnFallingFruit(id);
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
  // Show ALL fruits — everything unlocked
  var fruits = ALL_FRUITS.filter(function(f) {
    return f.cat === currentFruitCat;
  });

  var html = '';
  fruits.forEach(function(f) {
    html += '<div class="fruit-card" draggable="true" data-fruit="' + f.id + '"' +
            ' ondragstart="dragStart(event)" ondragend="dragEnd(event)"' +
            ' onclick="addDrink(\'' + f.id + '\')"' +
            ' ontouchstart="touchStart(event)" ontouchmove="touchMove(event)" ontouchend="touchEnd(event)">' +
            '<span class="fruit-emoji">' + fruitIcon(f) + '</span>' +
            '<span class="fruit-name">' + f.name + '</span>' +
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
function spawnFallingFruit(fruitId) {
  var jar = document.getElementById('blender-jar');
  if (!jar) return;
  var jarRect = jar.getBoundingClientRect();

  // Find product image for this drink
  var imgSrc = '';
  var products = [
    {id:'strawberry',img:'Natural-Strawberry-200ml.webp'},{id:'apple',img:'Natural-Apple-750ml.webp'},
    {id:'orange',img:'Natural-Orange-200ml.webp'},{id:'peach',img:'Natural-Peach-200ml.webp'},
    {id:'carrot',img:'Natural-Carrot-200ml.webp'},{id:'grape',img:'Natural-Grape-250ml.webp'},
    {id:'blueberry',img:'Natural-Blueberry-200ml.webp'},{id:'sourcherry',img:'Natural-Sourcherry-200ml.webp'},
  ];
  var found = products.find(function(p){return p.id===fruitId;});
  if (found) imgSrc = found.img;

  var startX = jarRect.left + jarRect.width * 0.15 + Math.random() * jarRect.width * 0.7;
  var targetX = jarRect.left + jarRect.width / 2;
  var targetY = jarRect.bottom - 30;

  var el = document.createElement('div');
  el.className = 'falling-fruit';
  el.style.left = startX + 'px';
  el.style.top  = '0px';
  el.style.setProperty('--dx', (targetX - startX) + 'px');
  el.style.setProperty('--dy', targetY + 'px');

  if (imgSrc) {
    el.innerHTML = '<img src="' + imgSrc + '" style="width:40px;height:60px;object-fit:contain;">';
  } else {
    el.textContent = '🧃';
  }
  document.body.appendChild(el);

  setTimeout(function() { el.remove(); }, 1200);
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
  spawnSplash(blenderArea);

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
    if (state.level === 1) {
      toast('Juice created! Match the Frutex drinks for bonus coins.');
      startMinigame();
    } else if (state.level === 2) {
      toast('Juice created! Can you identify the customer\'s order?');
      startDetective();
    } else if (state.level === 3) {
      toast('Juice created! Can you identify the mystery drink by taste?');
      startBlindTaste();
    } else {
      toast('Juice created! Sort fresh fruits for the best quality!');
      startFruitSort();
    }
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
  presentToCustomer();
}

function skipMinigame() {
  clearInterval(memoryInterval);
  document.querySelectorAll('.confetti').forEach(function(c) { c.remove(); });
  toast('Minigame skipped.');
  presentToCustomer();
}

// ============================================================
// MINIGAME — Fruit Detective
// ============================================================

/** Customer descriptions that match Frutex drinks */
const DETECTIVE_CLUES = [
  { text: 'I want something sweet and refreshing — classic and crisp!',        answer: 'apple',      hints:['sweet','refreshing','crisp'] },
  { text: 'Give me something tropical and juicy, full of sunshine!',            answer: 'orange',     hints:['tropical','juicy','sunshine'] },
  { text: 'I\'m craving a bold berry flavor — sweet and a little tangy!',       answer: 'strawberry', hints:['berry','sweet','tangy'] },
  { text: 'Something smooth and mellow — a soft, sweet fruit please!',          answer: 'peach',      hints:['smooth','mellow','soft'] },
  { text: 'I need a rich, deep purple drink — bold and intense!',               answer: 'grape',      hints:['purple','bold','intense'] },
  { text: 'A vibrant blue-red antioxidant boost — healthy and delicious!',      answer: 'blueberry',  hints:['blue-red','antioxidant','healthy'] },
  { text: 'Something dark and tart with a cherry kick!',                        answer: 'sourcherry', hints:['dark','tart','cherry'] },
  { text: 'A crisp, clean apple taste — nothing beats the original!',            answer: 'apple',      hints:['crisp','clean','original'] },
];

var detectiveScore = 0;
var detectiveTimer = null;
var detectiveTimeLeft = 0;
var detectiveClueIdx = -1;

function startDetective() {
  detectiveScore = 0;
  detectiveTimeLeft = 20;
  detectiveClueIdx = -1;
  showScreen('detective');
  updateDetectiveHUD();
  nextDetectiveClue();
  detectiveTimer = setInterval(function() {
    detectiveTimeLeft--;
    updateDetectiveHUD();
    if (detectiveTimeLeft <= 0) {
      clearInterval(detectiveTimer);
      finishDetective();
    }
  }, 1000);
}

function updateDetectiveHUD() {
  document.getElementById('detective-score').textContent = detectiveScore;
  document.getElementById('detective-time').textContent = detectiveTimeLeft + 's';
  var bar = document.getElementById('detective-timer-bar');
  if (bar) bar.style.width = (detectiveTimeLeft / 20 * 100) + '%';
}

function nextDetectiveClue() {
  var pool = DETECTIVE_CLUES.slice();
  // Don't repeat last clue
  var available = pool.filter(function(_, i) { return i !== detectiveClueIdx; });
  detectiveClueIdx = pool.indexOf(available[Math.floor(Math.random() * available.length)]);

  var clue = DETECTIVE_CLUES[detectiveClueIdx];
  document.getElementById('clue-text').textContent = '"' + clue.text + '"';

  // Render 4 drink options (one correct, 3 random distractors)
  var options = [clue.answer];
  var distractors = MEMORY_DRINKS.filter(function(d) { return d.id !== clue.answer; });
  distractors = distractors.sort(function() { return Math.random() - 0.5; }).slice(0, 3);
  var allOptions = options.concat(distractors.map(function(d) { return d.id; })).sort(function() { return Math.random() - 0.5; });

  var container = document.getElementById('detective-options');
  var html = '';
  allOptions.forEach(function(id) {
    var drink = MEMORY_DRINKS.find(function(d) { return d.id === id; });
    if (!drink) return;
    html += '<div class="detective-card" onclick="detectiveGuess(\'' + id + '\')">' +
      '<img src="' + drink.img + '" class="detective-card-img" alt="' + drink.name + '">' +
      '<span class="detective-card-name">' + drink.name + '</span>' +
    '</div>';
  });
  container.innerHTML = html;
}

function detectiveGuess(guessId) {
  var clue = DETECTIVE_CLUES[detectiveClueIdx];
  var correct = clue.answer === guessId;

  // Flash card
  var cards = document.querySelectorAll('.detective-card');
  cards.forEach(function(c) {
    var img = c.querySelector('img');
    var id = MEMORY_DRINKS.find(function(d) { return d.img === img.getAttribute('src'); });
    if (id && id.id === clue.answer) c.classList.add('detective-correct');
  });

  if (correct) {
    detectiveScore += 10;
    detectiveTimeLeft = Math.min(20, detectiveTimeLeft + 2); // bonus time
    sfxSuccess();
    spawnSparkles(document.getElementById('detective-clue'));
    toast('+10 Correct!');
  } else {
    detectiveTimeLeft = Math.max(0, detectiveTimeLeft - 3); // penalty
    sfxClick();
    toast('Wrong! The answer is ' + (MEMORY_DRINKS.find(function(d){return d.id===clue.answer;})||{}).name || clue.answer);
  }

  updateDetectiveHUD();
  setTimeout(nextDetectiveClue, 1200);
}

function finishDetective() {
  clearInterval(detectiveTimer);
  var bonus = detectiveScore * 2;
  animateCoins(state.coins + bonus);
  state.coins += bonus;
  saveState();

  // Show detective result on a simple screen with continue button
  var screen = document.getElementById('detective-screen');
  var html = '<div style="text-align:center;animation:screenIn 0.4s ease">' +
    '<h2>🔍 Detective Complete!</h2>' +
    '<p style="font-size:1.2rem;margin:1rem 0">Score: <b>' + detectiveScore + '</b></p>' +
    '<p style="color:var(--accent-gold)">+<b>' + bonus + '</b> coins earned!</p>' +
    '<button class="btn-big btn-primary" onclick="presentToCustomer()" style="margin-top:1.5rem">Continue →</button>' +
    '</div>';
  document.querySelector('.detective-container').innerHTML = html;
}

// ============================================================
// MINIGAME — Blind Taste Challenge (Level 3)
// ============================================================

const BLIND_TASTE_CLUES = [
  { clues: ['Very fruity','Rich aroma','Vibrant red'],               answer: 'strawberry' },
  { clues: ['Crisp bite','Light and clean','Classic orchard'],        answer: 'apple' },
  { clues: ['Zesty tang','Sun-ripened','Citrus burst'],               answer: 'orange' },
  { clues: ['Velvety smooth','Mellow sweetness','Golden hue'],         answer: 'peach' },
  { clues: ['Deep purple','Bold grape punch','Intense richness'],     answer: 'grape' },
  { clues: ['Berry tart','Antioxidant kick','Blue-violet notes'],      answer: 'blueberry' },
  { clues: ['Sharp cherry','Tangy deep red','Bold tart finish'],      answer: 'sourcherry' },
  { clues: ['Earthy sweetness','Vibrant orange','Root-to-glass'],      answer: 'carrot' },
];

var blindScore = 0, blindTimer = null, blindTimeLeft = 0, blindIdx = -1;

function startBlindTaste() {
  blindScore = 0; blindTimeLeft = 20; blindIdx = -1;
  showScreen('blind');

  // Show Frutex worker NPC (separate from customer Giovanni)
  var workerImg = 'gpt-image-2_create_a_full_body_standing_pose_cartoon_style_character_._wearing_a_green_hat_t-0-removebg-preview.png';
  document.getElementById('blind-npc-img').src = workerImg;
  document.getElementById('blind-npc-name').textContent = 'Frutex Taster';
  document.getElementById('blind-npc-sub').textContent = 'Tasting your drink...';

  updateBlindHUD();
  nextBlindClue();
  blindTimer = setInterval(function() {
    blindTimeLeft--;
    updateBlindHUD();
    if (blindTimeLeft <= 0) { clearInterval(blindTimer); finishBlind(); }
  }, 1000);
}

function updateBlindHUD() {
  document.getElementById('blind-score').textContent = blindScore;
  document.getElementById('blind-time').textContent = blindTimeLeft + 's';
  var fill = document.getElementById('blind-timer-fill');
  if (fill) fill.style.width = (blindTimeLeft / 20 * 100) + '%';
  if (blindTimeLeft <= 5) fill.style.background = '#e74c3c';
  else fill.style.background = 'var(--accent-primary)';
}

function nextBlindClue() {
  var pool = BLIND_TASTE_CLUES.slice();
  var avail = pool.filter(function(_,i){return i!==blindIdx;});
  blindIdx = pool.indexOf(avail[Math.floor(Math.random()*avail.length)]);
  var clue = BLIND_TASTE_CLUES[blindIdx];

  // Show 3 taste clues
  var html = '';
  for (var i=0;i<clue.clues.length;i++) {
    html += '<p style="animation:screenIn 0.3s ease ' + (i*0.15) + 's both;font-size:0.9rem;margin:0.2rem 0">🗣️ "' + clue.clues[i] + '"</p>';
  }
  document.getElementById('blind-clue-text').innerHTML = html;

  // Render 3 options (one correct, two distractors)
  var dists = MEMORY_DRINKS.filter(function(d){return d.id!==clue.answer;}).sort(function(){return Math.random()-0.5;}).slice(0,2);
  var all = [clue.answer].concat(dists.map(function(d){return d.id;})).sort(function(){return Math.random()-0.5;});

  var cont = document.getElementById('blind-options');
  var h = '';
  all.forEach(function(id){
    var d = MEMORY_DRINKS.find(function(x){return x.id===id;});
    if(!d)return;
    h+='<div class="blind-card" onclick="blindGuess(\''+id+'\')"><img src="'+d.img+'" class="blind-card-img" alt="'+d.name+'"><span>'+d.name+'</span></div>';
  });
  cont.innerHTML = h;
}

function blindGuess(id) {
  var c=BLIND_TASTE_CLUES[blindIdx], correct=c.answer===id;
  document.querySelectorAll('.blind-card').forEach(function(card){
    var img=card.querySelector('img');
    var found=MEMORY_DRINKS.find(function(d){return d.img===img.getAttribute('src');});
    if(found&&found.id===c.answer)card.style.borderColor='var(--accent-gold)';
    else if(found&&found.id===id&&!correct)card.style.borderColor='#e74c3c';
  });
  if(correct){
    blindScore+=10;blindTimeLeft=Math.min(20,blindTimeLeft+3);sfxSuccess();spawnSparkles(document.getElementById('blind-clue-box'));
    document.getElementById('blind-npc-sub').textContent = 'Excellent!';
    toast('+10 Correct!');
  }else{
    blindTimeLeft=Math.max(0,blindTimeLeft-3);sfxClick();
    document.getElementById('blind-npc-sub').textContent = 'Not quite...';
    toast('Wrong! It was '+(MEMORY_DRINKS.find(function(d){return d.id===c.answer;})||{}).name||c.answer);
  }
  updateBlindHUD();
  setTimeout(function(){ document.getElementById('blind-npc-sub').textContent = 'Tasting...'; nextBlindClue(); }, 1500);
}

function finishBlind() {
  clearInterval(blindTimer);
  var bonus=blindScore*2;
  animateCoins(state.coins+bonus);state.coins+=bonus;saveState();
  document.querySelector('.blind-layout').innerHTML='<div style="text-align:center;padding:2rem;animation:screenIn 0.4s ease"><h2>👅 Taste Complete!</h2><p style="font-size:1.2rem;margin:1rem 0">Score: <b>'+blindScore+'</b></p><p style="color:var(--accent-gold)">+<b>'+bonus+'</b> coins earned!</p><button class="btn-big btn-primary" onclick="presentToCustomer()" style="margin-top:1.5rem">Continue →</button></div>';
}

// ============================================================
// MINIGAME — Fruit Freshness Sort (Level 4)
// ============================================================

const SORT_FRUITS = [
  { img: 'Natural-Strawberry-200ml.webp', name: 'Strawberry', fresh: true },
  { img: 'Natural-Apple-750ml.webp', name: 'Apple', fresh: true },
  { img: 'Natural-Orange-200ml.webp', name: 'Orange', fresh: true },
  { img: 'Natural-Peach-200ml.webp', name: 'Peach', fresh: true },
  { img: 'Natural-Grape-250ml.webp', name: 'Grape', fresh: true },
  { img: 'Natural-Blueberry-200ml.webp', name: 'Blueberry', fresh: true },
  { img: 'Natural-Carrot-200ml.webp', name: 'Carrot', fresh: true },
  { img: 'Natural-Sourcherry-200ml.webp', name: 'Sourcherry', fresh: true },
];

var sortScore = 0, sortTimer = null, sortTimeLeft = 0, sortCombo = 0, sortFreshCount = 0, sortWasteCount = 0;

function startFruitSort() {
  sortScore = 0; sortTimeLeft = 30; sortCombo = 0; sortFreshCount = 0; sortWasteCount = 0;
  showScreen('sort');
  updateSortHUD();
  spawnSortFruit();
  sortTimer = setInterval(function() {
    sortTimeLeft--;
    updateSortHUD();
    if (sortTimeLeft <= 0) { clearInterval(sortTimer); finishSort(); }
  }, 1000);
}

function updateSortHUD() {
  document.getElementById('sort-score').textContent = sortScore;
  document.getElementById('sort-time').textContent = sortTimeLeft + 's';
  document.getElementById('bin-fresh-count').textContent = sortFreshCount;
  document.getElementById('bin-waste-count').textContent = sortWasteCount;
  var fill = document.getElementById('sort-timer-fill');
  if (fill) fill.style.width = (sortTimeLeft / 30 * 100) + '%';
}

function spawnSortFruit() {
  var conveyor = document.getElementById('sort-conveyor');
  var pool = SORT_FRUITS.slice().sort(function(){return Math.random()-0.5;});

  // Spawn just 1 fruit at a time, slower pace
  for (var i = 0; i < 1; i++) {
    var fruit = pool[i % pool.length];
    var isFresh = Math.random() > 0.35; // 65% chance fresh
    var el = document.createElement('div');
    el.className = 'sort-fruit';
    el.draggable = true;
    el.dataset.fresh = isFresh ? '1' : '0';
    el.dataset.name = fruit.name;
    el.style.animationDelay = (i * 0.3) + 's';

    var img = document.createElement('img');
    img.src = fruit.img;
    img.draggable = false;
    if (!isFresh) img.style.filter = 'grayscale(0.7) sepia(0.5) hue-rotate(-30deg) brightness(0.7)';
    el.appendChild(img);

    var label = document.createElement('span');
    label.textContent = fruit.name;
    label.style.cssText = 'font-size:0.6rem;font-weight:700;margin-top:2px';
    if (!isFresh) label.textContent += ' ⚠️';
    el.appendChild(label);

    el.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', e.target.closest('.sort-fruit').dataset.fresh);
      e.target.closest('.sort-fruit').classList.add('dragging');
    });
    el.addEventListener('dragend', function(e) {
      e.target.closest('.sort-fruit').classList.remove('dragging');
    });

    conveyor.appendChild(el);
    setTimeout(function(){ el.remove(); }, 5000);
  }

  // Next wave
  if (sortTimeLeft > 0) setTimeout(spawnSortFruit, 2000);
}

function dropSort(e, bin) {
  e.preventDefault();
  var isFresh = e.dataTransfer.getData('text/plain') === '1';
  var correct = (bin === 'fresh' && isFresh) || (bin === 'waste' && !isFresh);

  var binEl = document.getElementById('bin-' + bin);
  binEl.classList.add('bin-flash');
  setTimeout(function(){ binEl.classList.remove('bin-flash'); }, 300);

  // Remove the dragged fruit element immediately
  var draggingEl = document.querySelector('.sort-fruit.dragging');
  if (draggingEl) draggingEl.remove();

  if (correct) {
    sortCombo++;
    var bonus = sortCombo >= 5 ? 10 : 5;
    sortScore += 5 + bonus;
    if (bin === 'fresh') sortFreshCount++; else sortWasteCount++;
    sfxSuccess();
    spawnSparkles(binEl);
    if (sortCombo >= 3) document.getElementById('sort-combo').style.display = '';
    document.getElementById('sort-combo').textContent = sortCombo + 'x COMBO!';
  } else {
    sortCombo = 0;
    sortScore = Math.max(0, sortScore - 3);
    document.getElementById('sort-combo').style.display = 'none';
    sfxClick();
  }
  updateSortHUD();
}

function finishSort() {
  clearInterval(sortTimer);
  var quality = sortFreshCount > 0 ? Math.min(100, Math.round(sortScore / (sortFreshCount + sortWasteCount + 1) * 20)) : 50;
  var bonus = sortScore * 3;
  animateCoins(state.coins + bonus); state.coins += bonus; saveState();
  if (state.currentJuice) state.currentJuice.freshness = Math.round(quality / 10);
  document.querySelector('#sort-screen').innerHTML =
    '<div style="text-align:center;padding:2rem;animation:screenIn 0.4s ease">' +
    '<h2>🧺 Sorting Complete!</h2>' +
    '<p style="font-size:1.2rem;margin:1rem 0">Quality Score: <b>' + quality + '%</b></p>' +
    '<p style="font-size:0.85rem">Fresh: ' + sortFreshCount + ' | Waste: ' + sortWasteCount + '</p>' +
    '<p style="color:var(--accent-gold)">+<b>' + bonus + '</b> coins earned!</p>' +
    '<button class="btn-big btn-primary" onclick="presentToCustomer()" style="margin-top:1.5rem">Continue →</button>' +
    '</div>';
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

/** Generate customer queue based on level */
function generateCustomerQueue() {
  var marco  = NPC_CUSTOMERS.find(function(c) { return c.id === 'marco'; });
  var sophia = NPC_CUSTOMERS.find(function(c) { return c.id === 'sophia'; });
  var elena  = NPC_CUSTOMERS.find(function(c) { return c.id === 'elena'; });
  var giovanni = NPC_CUSTOMERS.find(function(c) { return c.id === 'giovanni'; });

  if (state.level === 2) {
    state.customerQueue = [marco];
  } else if (state.level === 3) {
    state.customerQueue = [sophia, elena, giovanni];
  } else if (state.level === 4) {
    state.customerQueue = [marco, sophia, elena, giovanni];
  } else {
    var shuffled = NPC_CUSTOMERS.slice().sort(function() { return Math.random() - 0.5; });
    var count = 5;
    state.customerQueue = shuffled.slice(0, Math.min(count, shuffled.length));
  }
  state.currentCustomerIdx = 0;
}

/** Get next customer from queue, or show queue-complete message */
function nextCustomer() {
  state.currentCustomerIdx++;
  if (state.currentCustomerIdx >= state.customerQueue.length) {
    state.customerQueue = [];
    state.currentCustomerIdx = 0;
    checkLevelProgress(4, state.blenderFruits.length || 3);
    toast('All customers served! ✅');
    setTimeout(function() { showScreen('menu'); }, 1500);
    return null;
  }
  // Clear blender and go to game screen for next customer
  state.blenderFruits = [];
  state.currentJuice = null;
  renderBlenderSlots();
  showScreen('game');
  toast('Next customer: ' + state.customerQueue[state.currentCustomerIdx].name + '!');
  return state.customerQueue[state.currentCustomerIdx];
}

/** Show queue status on game HUD */
function updateQueueDisplay() {
  var el = document.getElementById('queue-display');
  if (!el) return;
  if (state.customerQueue.length === 0) { el.innerHTML = ''; return; }
  var html = '<span style="font-size:0.75rem;color:var(--text-muted)">Queue: </span>';
  for (var i = state.currentCustomerIdx; i < state.customerQueue.length; i++) {
    var c = state.customerQueue[i];
    html += '<span style="' + (i === state.currentCustomerIdx ? 'font-size:1.2rem' : 'opacity:0.4') + '">' + c.emoji + '</span>';
  }
  el.innerHTML = html;
}

/** Show NPC intro — customer tells you what they want */
function showNpcIntro() {
  var customer = state.customerQueue[state.currentCustomerIdx];
  if (!customer) return;

  document.getElementById('npc-intro').style.display = 'flex';

  // Show customer image if available, otherwise hide
  if (customer.img) {
    document.getElementById('npc-intro-img').src = customer.img;
    document.getElementById('npc-intro-img').style.display = '';
  } else {
    document.getElementById('npc-intro-img').style.display = 'none';
  }

  document.getElementById('npc-intro-quote').textContent = '"' + customer.quote + '"';
  document.getElementById('npc-intro-order').textContent = '— ' + customer.name;
  if (customer.order) {
    var orderText = customer.order.type === 'category' ? 'Wants ' + customer.order.cat + ' fruits' :
                    customer.order.type === 'specific' ? 'Must include ' + customer.order.fruits.join(' & ') :
                    customer.order.type === 'count' ? 'Wants ' + customer.order.minFruits + '+ fruits' :
                    customer.order.type === 'flavor' ? 'Sweetness level ' + customer.order.minSweet + '+' : '';
    document.getElementById('npc-intro-order').textContent += ' • ' + orderText;
  }
}

function dismissNpcIntro() {
  document.getElementById('npc-intro').style.display = 'none';
}

/** Show NPC portrait on the right panel while blending */
function showNpcPortrait() {
  var portrait = document.getElementById('npc-portrait');
  if (!portrait) return;
  var q = state.customerQueue;
  if (q.length === 0 || state.currentCustomerIdx >= q.length) { portrait.style.display = 'none'; return; }
  var c = q[state.currentCustomerIdx];
  portrait.style.display = 'flex';
  document.getElementById('npc-portrait-name').textContent = c.name;
  var ot = c.order.type === 'category' ? 'Wants ' + c.order.cat + ' fruits' :
           c.order.type === 'specific' ? 'Must include ' + c.order.fruits.join(' & ') :
           c.order.type === 'count' ? 'Wants ' + c.order.minFruits + '+ fruits' :
           c.order.type === 'flavor' ? 'Sweetness ' + c.order.minSweet + '+' : '';
  document.getElementById('npc-portrait-order').textContent = ot;
  if (c.img) {
    document.getElementById('npc-portrait-img').src = c.img;
    document.getElementById('npc-portrait-img').style.display = '';
  } else {
    document.getElementById('npc-portrait-img').style.display = 'none';
  }
}

function presentToCustomer() {
  if (!state.currentJuice) {
    toast('Create a juice first!');
    return;
  }

  updateJuiceName();

  // Level 2+: pull customer from queue
  if (state.customerQueue.length > 0 && state.currentCustomerIdx < state.customerQueue.length) {
    var qc = state.customerQueue[state.currentCustomerIdx];
    // Marco in level 2 gets random order each time
    if (qc.id === 'marco' && state.level === 2) {
      var marcoOrders = [
        { type:'category', cat:'basic' },
        { type:'count', minFruits: 3 }
      ];
      qc.order = marcoOrders[Math.floor(Math.random() * marcoOrders.length)];
    }
    currentCustomer = {
      name: qc.name, emoji: qc.emoji, quote: qc.quote,
      isNPC: true, order: qc.order, tip: qc.tip,
    };

    // NPC: show cup + rating immediately
    showScreen('present');
    getRating();
    return;
  }

  // Fallback: use first queue customer or a generic one
  if (state.customerQueue.length > 0) {
    var qc = state.customerQueue[state.currentCustomerIdx || 0];
    currentCustomer = { name: qc.name, emoji: qc.emoji, quote: qc.quote, isNPC: true, order: qc.order, tip: qc.tip };
  } else {
    currentCustomer = { name: 'Guest', emoji: '🧃', quote: 'Surprise me!', isNPC: false };
  }

  // Render customer
  var area = document.getElementById('customer-area');
  area.innerHTML =
    '<div class="customer-avatar">' + currentCustomer.emoji + '</div>' +
    '<div class="customer-name">' + currentCustomer.name + '</div>' +
    '<div class="customer-quote">"' + currentCustomer.quote + '"</div>';

  // Show order
  var orderEl = document.getElementById('customer-order');
  orderEl.style.display = '';
  if (currentCustomer.order) {
    var orderText = '';
    var o = currentCustomer.order;
    if (o.type === 'category') orderText = 'Wants ' + o.cat + ' fruits';
    else if (o.type === 'specific') orderText = 'Must include ' + o.fruits.join(' & ');
    else if (o.type === 'count') orderText = 'Wants ' + o.minFruits + '+ fruits';
    else if (o.type === 'flavor') orderText = 'Sweetness level ' + o.minSweet + '+';
    orderEl.innerHTML = '📋 <b>' + currentCustomer.name + ' wants:</b> ' + orderText;
  } else {
    orderEl.innerHTML = '📋 <b>Make something tasty!</b>';
  }

  // Juice cup color
  var juiceEl = document.getElementById('present-juice');
  juiceEl.style.display = '';
  var cupBody = document.getElementById('cup-body');
  if (cupBody && state.currentJuice) {
    cupBody.style.background = state.currentJuice.color;
  }

  // NPC: skip presentation screen, rate immediately then show reaction
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

/** Generate a nutrition-style card for the created juice */
function generateNutritionPanel(juice) {
  var fruitNames = juice.fruits.map(function(id) {
    var f = ALL_FRUITS.find(function(fr) { return fr.id === id; });
    return f ? f.name : id;
  });
  var vitamins = [];
  if (juice.fruits.some(function(f){return ['orange','lemon','strawberry','kiwi'].indexOf(f)!==-1;})) vitamins.push('Vitamin C');
  if (juice.fruits.some(function(f){return ['mango','peach','papaya'].indexOf(f)!==-1;})) vitamins.push('Vitamin A');
  if (juice.fruits.some(function(f){return ['banana','coconut'].indexOf(f)!==-1;})) vitamins.push('Potassium');
  if (juice.fruits.some(function(f){return ['grape','blueberry','raspberry','pomegranate'].indexOf(f)!==-1;})) vitamins.push('Antioxidants');
  if (vitamins.length === 0) vitamins.push('Vitamins B & E');

  return '<div class="nutrition-panel">' +
    '<div class="nutrition-header">🥤 Nutrition Info</div>' +
    '<div class="nutrition-grid">' +
      '<div class="nutrition-item"><span class="nut-label">Fruits</span><span class="nut-val">' + fruitNames.join(', ') + '</span></div>' +
      '<div class="nutrition-item"><span class="nut-label">Key Vitamins</span><span class="nut-val">' + vitamins.join(' · ') + '</span></div>' +
      '<div class="nutrition-item"><span class="nut-label">Sweetness</span><span class="nut-val">' + Math.round(juice.sweetness) + '/10</span></div>' +
      '<div class="nutrition-item"><span class="nut-label">Freshness</span><span class="nut-val">' + Math.round(juice.freshness) + '/10</span></div>' +
    '</div>' +
    '<div class="nutrition-tags">' +
      '<span class="nut-tag">100% Fruit</span>' +
      '<span class="nut-tag">Natural Ingredients</span>' +
      '<span class="nut-tag">No Added Sugar</span>' +
    '</div>' +
  '</div>';
}

/** Get a random Frutex fact */
function getRandomFact() {
  var pool = FRUTEX_FACTS.slice();
  var available = pool.filter(function(f) { return factsUsed.indexOf(f.fact) === -1; });
  if (available.length === 0) { factsUsed = []; available = pool; }
  var fact = available[Math.floor(Math.random() * available.length)];
  factsUsed.push(fact.fact);
  return '<div class="fact-card"><span class="fact-icon">' + fact.icon + '</span><div class="fact-text">' + fact.fact + '</div></div>';
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

  // --- Simplified end screen: just nutrition + fact ---
  var ratingEl = document.getElementById('rating-display');
  ratingEl.innerHTML =
    generateNutritionPanel(juice) +
    getRandomFact() +
    '<div class="rewards-display"><span>🪙 +' + coinsEarned + '</span><span>✨ +' + xpEarned + ' XP</span></div>';

  ratingEl.style.display = 'flex';
  document.getElementById('present-btn').style.display = 'none';

  // Show Continue button immediately
  var continueBtn = document.getElementById('continue-btn');
  continueBtn.style.display = '';
  continueBtn.disabled = false;
  var nextLabel = (state.customerQueue.length > 0 && state.currentCustomerIdx < state.customerQueue.length - 1) ? 'Next Customer →' : 'Continue →';
  continueBtn.textContent = nextLabel;

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
  checkLevelProgress(stars, juice.fruits.length);

  sfxCoins();
  if (stars >= 4) sfxSuccess();
  spawnConfetti();
  spawnSparkles(document.getElementById('rating-display'));

  if (state.level > oldLevel) {
    setTimeout(function() { showLevelUp(oldLevel + 1); }, 1500);
  }
  saveState();
}

function finishRound() {
  document.querySelectorAll('.confetti').forEach(function(c) { c.remove(); });

  state.blenderFruits = [];
  state.currentJuice = null;
  state.currentDesign = { bottle: 'glass', cap: 'silver', label: 'fresh', bgGradient: 'none', name: '' };
  currentCustomer = null;

  saveState();

  // If more customers in queue, go to next customer
  if (state.customerQueue.length > 0 && state.currentCustomerIdx < state.customerQueue.length - 1) {
    nextCustomer();
    return;
  }

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
  var music = document.getElementById('bg-music');
  var btn = document.getElementById('mute-btn');
  if (isMuted) {
    if (music) music.pause();
    btn.innerHTML = '<svg class="icon"><use href="#i-mute"/></svg>';
    btn.classList.add('muted');
  } else {
    if (music) music.play().catch(function(){});
    btn.innerHTML = '<svg class="icon"><use href="#i-sound"/></svg>';
    btn.classList.remove('muted');
  }
}

// Start music on first interaction
document.addEventListener('click', function startMusic() {
  var music = document.getElementById('bg-music');
  if (music && !isMuted) music.play().catch(function(){});
}, { once: true });

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
