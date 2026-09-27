const __APEX_BASE='/shipment-tracker/apex'; const __APEX_PATH=location.pathname.startsWith(__APEX_BASE)?(location.pathname.slice(__APEX_BASE.length)||'/'):location.pathname;
(() => {
  'use strict';

  const money = value => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD'
  }).format(value);

  function replaceText(root = document.body) {
    if (!root) return;
    const replacements = new Map([
      ['THE PHYSICAL MINI PUCK PUCK', 'THE PHYSICAL QUEST PUCK'],
      ['Mini mini-puck collectibles', 'Collectible mini-pucks'],
      ['MINI MINI PUCKS.', 'MINI ACCESSORIES.'],
      ['follow its ownership history.', 'keep it permanently in your collection.'],
      ['Own it until you trade or transfer it.', 'Register it once and keep it permanently in your collector account.'],
      ['The collectible can change hands; its original code can never be reused.', 'Before registration, the collectible may change hands. Once claimed, it stays permanently locked to that collector account.'],
      ['TRANSFERABLE OWNERSHIP', 'PERMANENT REGISTRATION'],
      ['OWNERSHIP HISTORY', 'PERMANENT CLAIM'],
      ['SWAP', 'ACHIEVE'],
      ['KEEP OR MOVE', 'LOCK THE CLAIM'],
      ['Hold it, list a duplicate, swap it or transfer it after a sale.', 'Register it once. That puck is permanently locked to the collector account that claimed it.'],
      ['Duplicates become trade power.', 'Every unique design moves the board closer to a completed set.'],
      ['First owner recorded.', 'Collector account locked to this puck.'],
      ['LISTED', 'VERIFIED'],
      ['Duplicate offered to the collector network.', 'Series, edition and claim time secured.'],
      ['TRANSFERRED', 'LOCKED'],
      ['New owner accepted. Full history preserved.', 'Registration remains with the original collector account.'],
      ['OWNERSHIP, NOT SCREENSHOTS', 'PROOF, NOT SCREENSHOTS'],
      ['Swaps and sales move the registered puck itself to the next collector. That keeps the series scarce, understandable and auditable.', 'Registered pucks stay in the original collector account. Only an unregistered puck may change hands before its code is claimed.'],
      ['Complete one same-edition set inside 30, 60 or 90 calendar days for a $1,000, $500 or $250 bonus.', 'Complete the same-edition goal within 30, 60 or 90 calendar days for an extra $250, $150 or $50.'],
      ['$300', '$200'],
      ['$750', '$450'],
      ['$1.5K', '$1K'],
      ['$2K', '$100'],
      ['E1 CONFERENCE', '3 EDITIONS'],
      ['$5K', '+$250'],
      ['E1 FULL SET', '30-DAY SPEED'],
      ['Claim codes, view your collection, trade duplicates and track every milestone.', 'Claim codes, view your collection and track every permanent milestone.'],
      ['MEDIUM PRIZE', 'DIVISION REWARD'],
      ['Transfers move an existing serial', 'Registered serials stay locked to their collector account']
      ,['01 / FIND YOUR EDGE', '01 / APEX PRO PUCKS']
      ,['ONE GAME.', 'EVERY SHOT.']
      ,['YOUR PUCK.', 'STARTS HERE.']
      ,['Game night. Practice. The next piece in your collection.', 'For the game. For your team. For your collection.']
      ,['There’s an Apex for that.', 'Find your puck with APEX.']
      ,['Explore all pucks', 'Shop All Pucks']
      ,['FEEL IT BEFORE YOU COMMIT', 'SEE IT BEFORE YOU COMMIT']
      ,['START WITH A SAMPLE.', 'FREE PROOFS. BUY A SINGLE SAMPLE.']
      ,['Put a dedicated puck manufacturer in your corner.', 'Put a dedicated puck manufacturer on your bench.']
      ,['HOW DEEP', 'WHO’S ON']
      ,['IS YOUR BENCH?', 'YOUR BENCH?']
      ,['Let’s talk pucks', 'Explore Pucks']
    ]);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let value = node.nodeValue;
      replacements.forEach((to, from) => { value = value.split(from).join(to); });
      if (value !== node.nodeValue) node.nodeValue = value;
    });
  }

  function addQuestRules() {
    if (!/^\/puckquest\/?$/.test(__APEX_PATH) || document.querySelector('.quest-final-rules')) return;
    const main = document.querySelector('main');
    if (!main) return;
    const section = document.createElement('section');
    section.className = 'quest-final-rules';
    section.setAttribute('aria-labelledby', 'quest-final-rules-title');
    section.innerHTML = `
      <div class="quest-final-rules__head">
        <div><p class="eyebrow">EDITION 01 / THE REAL RULES</p><h2 id="quest-final-rules-title">BUY. REVEAL.<br>REGISTER. OWN.</h2></div>
        <p class="quest-final-rules__lead">Every sealed pack contains two random printed mini pucks. Each code gets one account, one permanent registration and one path through the Quest.</p>
      </div>
      <div class="quest-rule-grid">
        <article class="quest-rule"><small>01 / CHOOSE THE FIELD</small><strong>$5 LEAGUE</strong><p>Two random designs drawn from all 32 Edition 01 teams.</p></article>
        <article class="quest-rule"><small>02 / NARROW THE ICE</small><strong>$10 CONFERENCE</strong><p>Two random designs from the selected 16-team conference.</p></article>
        <article class="quest-rule"><small>03 / HUNT THE SET</small><strong>$15 DIVISION</strong><p>Two random designs from the selected eight-team division.</p></article>
        <article class="quest-rule"><small>04 / START THE CLOCK</small><strong>15 DAYS</strong><p>Register the purchased puck code and submit the first team guess within 15 days of original purchase.</p></article>
        <article class="quest-rule"><small>05 / MAKE THE CALL</small><strong>PASS OR FAIL</strong><p>Guesses can change until the claim is submitted. Individual answers are never revealed.</p></article>
        <article class="quest-rule"><small>06 / ONE LAST SHIFT</small><strong>7 DAYS</strong><p>The first failed claim starts one correction window. Further attempts never reset it.</p></article>
      </div>
      <div class="quest-prize-grid" aria-label="PuckQuest achievement rewards">
        <article class="quest-prize"><small>COMPLETE QUEST</small><strong>$1,000</strong><p>All 32 teams from the same edition.</p></article>
        <article class="quest-prize"><small>CONFERENCE</small><strong>$450</strong><p>All 16 teams in one conference, same edition.</p></article>
        <article class="quest-prize"><small>DIVISION</small><strong>$200</strong><p>All eight teams in one division, same edition.</p></article>
        <article class="quest-prize"><small>THREE EDITIONS</small><strong>$100</strong><p>The same team collected across three editions.</p></article>
      </div>
      <p class="quest-launch-note">Speed bonuses: +$250 within 30 days · +$150 within 60 days · +$50 within 90 days. One speed bonus per collector per edition. Final public rules govern.</p>`;
    main.appendChild(section);
  }

  function lockRegisteredTransfers() {
    if (!__APEX_PATH.startsWith('/puckquest')) return;
    const blocked = ['TRANSFER', 'TRANSFERS', 'GIFT', 'GIFTS & SWAPS', 'MARKET'];
    document.querySelectorAll('button, a').forEach(el => {
      const label = el.textContent.trim().toUpperCase();
      if (blocked.includes(label) || label.includes('TRANSFER') || label.startsWith('SWAP')) {
        el.hidden = true;
        el.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function installBulkPlanner() {
    const old = document.querySelector('.bulk-planner');
    if (!old || old.dataset.finalized) return;
    old.dataset.finalized = 'true';
    old.className = 'bulk-planner apex-bulk-final';
    old.innerHTML = `
      <div>
        <p class="eyebrow">TEAM & BULK / ORDER PLANNER</p>
        <h2>WHO'S ON<br>YOUR BENCH?</h2>
        <p>Team pricing begins at 300 pucks and moves in 100-puck increments. The discount grows one point per additional 100, capped at 10% from 1,200 pucks onward.</p>
        <div class="field"><label for="apex-bulk-qty">Pucks needed</label><input id="apex-bulk-qty" type="number" min="300" step="100" value="300" inputmode="numeric"></div>
        <input id="apex-bulk-range" aria-label="Pucks needed" type="range" min="300" max="2000" step="100" value="300">
      </div>
      <div class="apex-bulk-result">
        <p class="eyebrow">ESTIMATED STANDARD GAME-PUCK PLAN</p>
        <strong class="apex-bulk-result__number"><span data-qty>300</span><small>PUCKS / NO MAXIMUM</small></strong>
        <div class="apex-calc-row"><span>Published 100-pack basis</span><b data-base>$279.00</b></div>
        <div class="apex-calc-row"><span>Team discount</span><b data-discount>1%</b></div>
        <div class="apex-calc-row"><span>Estimated puck total</span><b data-total>$276.21</b></div>
        <p>Estimate uses the published $93 game-puck 100-pack. Taxes, shipping, custom print work and delivery dates are confirmed by Apex.</p>
        <a class="btn full" data-quote href="/contact?type=Team+%26+bulk&quantity=300">Request this team quote ↗</a>
      </div>`;
    const number = old.querySelector('#apex-bulk-qty');
    const range = old.querySelector('#apex-bulk-range');
    const update = raw => {
      let qty = Math.max(300, Math.round((Number(raw) || 300) / 100) * 100);
      number.value = String(qty);
      range.value = String(Math.min(2000, qty));
      const packs = Math.ceil(qty / 100);
      const finalQty = packs * 100;
      const base = packs * 93;
      const discount = Math.min(10, 1 + Math.floor((finalQty - 300) / 100));
      const total = base * (1 - discount / 100);
      old.querySelector('[data-qty]').textContent = finalQty.toLocaleString();
      old.querySelector('[data-base]').textContent = money(base);
      old.querySelector('[data-discount]').textContent = `${discount}%`;
      old.querySelector('[data-total]').textContent = money(total);
      old.querySelector('[data-quote]').href = `/contact?type=Team+%26+bulk&quantity=${finalQty}&details=${encodeURIComponent(`Estimated ${discount}% team discount · ${money(total)} puck total before tax, shipping and customization`)}`;
    };
    number.addEventListener('input', event => update(event.target.value));
    number.addEventListener('blur', event => update(event.target.value));
    range.addEventListener('input', event => update(event.target.value));
    update(300);
  }

  function annotateCustomizer() {
    const face = document.querySelector('.print-face');
    if (!face || face.dataset.finalized) return;
    face.dataset.finalized = 'true';
    face.setAttribute('aria-label', 'Circular puck top-face canvas. Drag artwork to position it; artwork outside the circle is clipped.');
    const note = document.createElement('p');
    note.className = 'fine-print apex-face-note';
    note.textContent = 'Exact top-face crop · artwork may extend past the circle, but only the printable puck surface is shown.';
    const controls = document.querySelector('.placement-readout');
    if (controls) controls.after(note);
  }

  function fixPuckQuestPricing() {
    if (__APEX_PATH === '/shop') {
      const price = document.querySelector('.shop-puckquest > div > span');
      if (price) {
        if (/\$15\.00/.test(price.textContent)) price.textContent = 'FROM $5.00';
        price.setAttribute('aria-label', 'From $5.00');
      }
    }
    if (__APEX_PATH === '/') {
      const price = document.querySelector('a.product-card-info[href="/products/apex-puckquest-e1"] > span');
      const amount = price && [...price.childNodes].find(node => node.nodeType === Node.TEXT_NODE && /\$/.test(node.nodeValue));
      if (amount) amount.nodeValue = '$5.00';
      if (price) price.setAttribute('aria-label', 'From $5.00');
    }
  }

  function fixGeorgeHomepage() {
    if (__APEX_PATH !== '/') return;
    const title = document.querySelector('.impact-title');
    if (title) {
      title.classList.add('brand-final');
      const eyebrow = title.querySelector('.eyebrow');
      const heading = title.querySelector('h1');
      if (eyebrow) {
        eyebrow.textContent = '';
        eyebrow.setAttribute('aria-label', 'AN AMERICAN-BASED COMPANY.');
      }
      if (heading) {
        heading.innerHTML = '<span aria-hidden="true"></span><strong aria-hidden="true"></strong>';
        heading.setAttribute('aria-label', 'PRECISION-MADE HOCKEY PUCKS.');
      }
    }
    const buttons = document.querySelectorAll('.impact-copy .hero-buttons a');
    const setLabel = (link, label) => {
      if (!link) return;
      const text = [...link.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
      if (text) text.nodeValue = '';
      link.setAttribute('aria-label', label);
    };
    setLabel(buttons[0], 'Buy Direct');
    setLabel(buttons[1], 'Customize');
  }

  function finalizeHomepageSections() {
    if (__APEX_PATH !== '/') return;
    const bridge = document.querySelector('.quest-home, .home-puckquest, .puckquest-bridge, [class*="puckquest-home"]');
    if (bridge) {
      const eyebrow = bridge.querySelector('.eyebrow, small');
      const heading = bridge.querySelector('h2, h3');
      const copy = bridge.querySelector('p:not(.eyebrow)');
      if (eyebrow) eyebrow.textContent = 'APEX PUCKQUEST / EDITION 01';
      if (heading) heading.innerHTML = 'COLLECT THEM.<br>GUESS THEM.<br>CLAIM PRIZES.';
      if (copy) copy.textContent = 'Thirty-two printed themes. One code per puck. Permanent registration. Start the Quest.';
      const links = bridge.querySelectorAll('a');
      if (links[0]) { const text=[...links[0].childNodes].find(n=>n.nodeType===Node.TEXT_NODE); if(text) text.nodeValue='LOGIN TO PUCKQUEST '; links[0].href='/puckquest/login'; }
      if (links[1]) { const text=[...links[1].childNodes].find(n=>n.nodeType===Node.TEXT_NODE); if(text) text.nodeValue='BUY PUCKQUEST MINIS '; links[1].href='/products/apex-puckquest-e1'; }
    }

    const detail = document.querySelector('.macro-break');
    if (detail) {
      const eyebrow = detail.querySelector('.eyebrow');
      const heading = detail.querySelector('h2');
      const copy = detail.querySelector('p:not(.eyebrow)');
      const link = detail.querySelector('a');
      if (eyebrow) eyebrow.textContent = 'THE APEX DIFFERENCE.';
      if (heading) heading.innerHTML = 'EVERY<br>DETAIL<br><em>COUNTS.</em>';
      if (copy) copy.textContent = 'From rubber to textured edge, every element is engineered for a distinct feel in the hand.';
      if (link) {
        const text = [...link.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
        if (text) text.nodeValue = 'Explore the Details ';
      }
    }
  }

  function finalizeShop() {
    if (__APEX_PATH !== '/shop') return;
    const intro = document.querySelector('.shop-intro');
    if (intro) {
      const h1 = intro.querySelector('h1');
      const p = intro.querySelector('p:last-child');
      if (h1) h1.innerHTML = 'FIND YOUR<br><em>PUCK.</em>';
      if (p) p.innerHTML = 'Hit the ice. Challenge a friend. Build your collection.';
    }
    const quest = document.querySelector('.shop-puckquest');
    if (quest) {
      const title = quest.querySelector('h3');
      const copy = quest.querySelector('p');
      if (title) title.innerHTML = 'COLLECT THEM.<br>GUESS THEM. CLAIM PRIZES.';
      if (copy) copy.textContent = 'Edition 01 is a separate collectible game using printed keytag mini pucks—two pucks per League, Conference or Division pack.';
    }
    const mini = document.querySelector('.mini-collection');
    if (mini && !mini.dataset.georgeFinal) {
      mini.dataset.georgeFinal = 'true';
      mini.innerHTML = `
        <div class="mini-collection-heading"><div><p class="eyebrow">03 / MINI PUCKS</p><h2 id="mini-collection-title">SMALL FORMAT.<br>THREE PRODUCTS.</h2></div><p>Standalone Apex mini products. They are sold independently and are not part of the PuckQuest collectible game.</p></div>
        <div class="gf-mini-grid">
          <a class="gf-mini-product" href="/products/mini-keychain-puck"><span class="gf-mini-visual gf-mini-keychain"><i></i><b>APEX</b></span><small>01 / EVERYDAY CARRY</small><h3>MINI KEYCHAIN PUCK</h3><p>A compact Apex puck with a key ring for bags, keys, gifts and branded programs.</p><strong>View product →</strong></a>
          <a class="gf-mini-product" href="/products/mini-magnet-puck"><span class="gf-mini-visual gf-mini-magnet"><b>APEX</b></span><small>02 / DISPLAY</small><h3>MINI MAGNET PUCK</h3><p>A compact magnetic puck for lockers, fridges, team boards and everyday display.</p><strong>View product →</strong></a>
          <a class="gf-mini-product" href="/products/knuckle-puck"><span class="gf-mini-visual gf-mini-photo"><img src="https://apex-hockey-george-review.vercel.app/assets/knuckle-puck-play-diagram.svg" alt="Top-down Knuckle Puck finger-flick setup with an index-and-pinky goal"></span><small>03 / TABLETOP GAME</small><h3>KNUCKLE PUCK</h3><p>The mini puck built for Apex’s two-player finger-flick tabletop game.</p><strong>Rules &amp; product →</strong></a>
        </div>`;
    }
  }

  function finalizeFooter() {
    document.querySelectorAll('.footer-top').forEach(footer => {
      const p = footer.querySelector('p');
      const link = footer.querySelector('a.text-link');
      if (p) p.textContent = 'THE GAME STARTS HERE.';
      if (link) {
        const text = [...link.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
        if (text) text.nodeValue = 'Explore Pucks ';
        link.href = '/shop';
      }
    });
  }

  function addTermsRules() {
    if (__APEX_PATH !== '/support/terms' || document.querySelector('.gf-rules-summary')) return;
    const target = document.querySelector('main');
    if (!target) return;
    const section = document.createElement('section');
    section.className = 'gf-rules-summary';
    section.innerHTML = `<p class="eyebrow">PUCKQUEST / PRE-LAUNCH RULES REVIEW</p><h2>NO PURCHASE NECESSARY ROUTE.</h2><p>PuckQuest is not represented as an active cash promotion on this review site. A mail-in free-entry method and complete Official Rules will be published before launch. The current review framework is for adults age 21 or older.</p><p>Launch dates, sponsor language, eligibility jurisdictions, mailing address, request quantities and all final claim requirements remain subject to official legal approval. No placeholder in a draft document should be treated as a live term.</p><a class="text-link" href="/puckquest">Review the PuckQuest flow →</a>`;
    target.appendChild(section);
  }

  function finalizeCustomPage() {
    if (__APEX_PATH !== '/custom-pucks' || document.querySelector('.gf-custom-proof')) return;
    const studio = document.querySelector('.custom-studio, .print-lab');
    if (!studio) return;
    const note = document.createElement('div');
    note.className = 'gf-custom-proof';
    note.innerHTML = '<b>FREE DIGITAL PROOF</b><span>See the circular top-face crop before committing. Ask Apex about purchasing one printed custom sample before a production order.</span><small>Custom printed orders are nonreturnable and nonrefundable after approval, except where required by applicable law or confirmed by Apex.</small>';
    studio.before(note);
  }

  function finalizePuckQuestProduct() {
    if (__APEX_PATH !== '/products/apex-puckquest-e1') return;
    const purchase = document.querySelector('.product-purchase');
    if (!purchase) return;
    const eyebrow = purchase.querySelector('.eyebrow');
    const sub = purchase.querySelector('h2');
    const description = sub && sub.nextElementSibling;
    if (eyebrow) eyebrow.textContent = 'OPEN. GUESS. COLLECT.';
    if (sub) sub.textContent = 'MINI PUCK. BIG MYSTERY.';
    if (description && description.tagName === 'P') description.textContent = 'Each pack contains two printed PuckQuest keytag mini pucks. Reveal the artwork, register one code per puck within 15 days of purchase, make your guesses and build a permanent Edition 01 collection.';
    const addButton = purchase.querySelector('button[aria-label*="Add to bag"], button[class*="add-to-cart"], button[class*="add-to-bag"]') || [...purchase.querySelectorAll('button')].find(button => /Add to bag/i.test(button.textContent));
    if (addButton) {
      addButton.disabled = true;
      addButton.textContent = 'PuckQuest packs / pre-launch review';
      addButton.setAttribute('aria-label', 'PuckQuest packs are not available for purchase during pre-launch review');
    }
    purchase.querySelectorAll('*').forEach(element => {
      if (element.children.length) return;
      if (element.textContent.trim() === 'Available') element.textContent = 'Pre-launch review';
      if (element.textContent.trim() === 'Secure checkout with Apex') element.textContent = 'Purchases open after final Official Rules approval';
    });
    const bridge = purchase.querySelector('.puckquest-product-bridge');
    if (bridge) {
      const title = bridge.querySelector('b');
      const small = bridge.querySelector('small');
      const link = bridge.querySelector('a');
      if (title) title.textContent = 'ALREADY HAVE A PUCK?';
      if (small) small.textContent = 'Register its one-time code and make your initial team guess.';
      if (link) { link.href = '/puckquest/login'; const text=[...link.childNodes].find(n=>n.nodeType===Node.TEXT_NODE); if(text) text.nodeValue='Register & Guess '; }
    }
  }

  function finalizeTeamPage() {
    if (__APEX_PATH !== '/team-orders') return;
    const buyers = document.querySelector('.buyers');
    if (!buyers) return;
    const title = buyers.querySelector('.section-heading h2');
    if (title) title.innerHTML = 'WHO’S ON<br>YOUR BENCH?';
    buyers.querySelectorAll('article').forEach(article => {
      const name = article.querySelector('h3')?.textContent.trim();
      const link = article.querySelector('a');
      if (!name || !link) return;
      link.href = `/contact?type=${encodeURIComponent('Team & bulk')}&details=${encodeURIComponent(`${name} inquiry`)}`;
    });
  }

  function removeGeorgeFlaggedSections() {
    if (__APEX_PATH === '/team-orders') {
      document.querySelector('.sample-banner')?.remove();
    }
    if (__APEX_PATH === '/faq' || __APEX_PATH === '/custom-pucks') {
      document.querySelectorAll('.faq-list button').forEach(button => {
        if (button.textContent.trim() !== 'Will a printed logo wear on the ice?') return;
        const item = button.closest('.border-b');
        if (item) item.remove();
      });
      if (__APEX_PATH === '/faq') {
        document.querySelectorAll('*').forEach(node => {
          if (node.childElementCount === 0 && node.textContent.trim() === '15 QUESTIONS') node.textContent = '14 QUESTIONS';
        });
      }
    }
  }

  function forceDocumentNavigation() {
    if (document.documentElement.dataset.apexDocumentNav) return;
    document.documentElement.dataset.apexDocumentNav = 'true';
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === __APEX_PATH && url.search === location.search && url.hash) return;
      event.preventDefault();
      location.assign(url.href);
    }, true);
  }

  function finalize() {
    replaceText();
    addQuestRules();
    lockRegisteredTransfers();
    installBulkPlanner();
    annotateCustomizer();
    fixPuckQuestPricing();
    fixGeorgeHomepage();
    finalizeHomepageSections();
    finalizeShop();
    finalizeFooter();
    addTermsRules();
    finalizeCustomPage();
    finalizePuckQuestProduct();
    finalizeTeamPage();
    removeGeorgeFlaggedSections();
    forceDocumentNavigation();
  }

  const scheduleFinalize = () => {
    setTimeout(finalize, 500);
    setTimeout(finalize, 1500);
  };
  if (document.readyState === 'complete') scheduleFinalize();
  else window.addEventListener('load', scheduleFinalize, { once: true });
})();