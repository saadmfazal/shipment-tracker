(() => {
  'use strict';

  const STORE_KEY = 'apex-puckquest-review-final-v1';
  const TEAM_OPTIONS = [
    'Anaheim','Boston','Buffalo','Calgary','Carolina','Chicago','Colorado','Columbus',
    'Dallas','Detroit','Edmonton','Florida','Los Angeles','Minnesota','Montreal','Nashville',
    'New Jersey','New York Islanders','New York Rangers','Ottawa','Philadelphia','Pittsburgh',
    'San Jose','Seattle','St. Louis','Tampa Bay','Toronto','Utah','Vancouver','Vegas','Washington','Winnipeg'
  ];
  const SEED = [
    {code:'E1-APEX-001',art:'bear',name:'The Roar',guess:'',registered:'2026-09-18T18:42:00Z',purchase:'2026-09-16',edition:'01'},
    {code:'E1-APEX-002',art:'kraken',name:'The Deep',guess:'',registered:'2026-09-19T13:16:00Z',purchase:'2026-09-17',edition:'01'},
    {code:'E1-APEX-003',art:'avalanche',name:'High Country',guess:'',registered:'2026-09-20T09:05:00Z',purchase:'2026-09-18',edition:'01'},
    {code:'E1-APEX-004',art:'knight',name:'The Fortress',guess:'',registered:'2026-09-21T22:11:00Z',purchase:'2026-09-20',edition:'01'},
    {code:'E1-APEX-005',art:'maple',name:'Frozen North',guess:'',registered:'2026-09-22T16:30:00Z',purchase:'2026-09-20',edition:'01'}
  ];

  const readState = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY));
      if (stored && Array.isArray(stored.pucks)) return stored;
    } catch (_) {}
    return {pucks:SEED,claims:[{id:'CLM-1048',collector:'Demo Collector',tier:'Division',status:'EVIDENCE REVIEW',submitted:'2026-09-24'}]};
  };
  const saveState = state => localStorage.setItem(STORE_KEY, JSON.stringify(state));
  const artPath = art => `https://apex-hockey-george-review.vercel.app/puckquest/quest-assets/art/${art}.webp`;
  const teamOptions = selected => `<option value="" ${selected ? '' : 'selected'}>Choose a team</option>` + TEAM_OPTIONS.map(team => `<option ${team === selected ? 'selected' : ''}>${team}</option>`).join('');
  const daysBetween = (a,b) => {
    const civil = value => {
      const date = value instanceof Date ? value.toISOString().slice(0,10) : String(value).slice(0,10);
      return Date.parse(`${date}T00:00:00Z`);
    };
    return Math.floor((civil(b) - civil(a)) / 86400000);
  };

  function menus() {
    const open = document.querySelector('[data-menu-open]');
    const close = document.querySelector('[data-menu-close]');
    const menu = document.querySelector('.pqf-mobile-nav');
    if (!menu || !open || !close) return;
    const set = value => { menu.classList.toggle('open',value); menu.setAttribute('aria-hidden',String(!value)); document.body.style.overflow=value?'hidden':''; };
    open.addEventListener('click',()=>set(true));
    close.addEventListener('click',()=>set(false));
    menu.addEventListener('click',event=>{ if(event.target.closest('a')) set(false); });
  }

  function auth() {
    const form = document.querySelector('[data-auth-form]');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const role = form.dataset.role;
      const email = String(data.get('email') || '').trim().toLowerCase();
      const password = String(data.get('password') || '');
      const ok = role === 'admin'
        ? email === 'admin@apexhockeypucks.com' && password === 'ApexQuest2026!'
        : email === 'collector@puckquest.demo' && password === 'Quest2026!';
      const message = form.querySelector('.pqf-form-message');
      if (!ok) { message.textContent = 'Those review credentials do not match. Use the access shown below.'; return; }
      sessionStorage.setItem(`pq-${role}-review`, '1');
      message.textContent = 'Access confirmed. Opening the review…';
      location.href = role === 'admin' ? '/shipment-tracker/apex/shipment-tracker/apex/puckquest/admin' : '/shipment-tracker/apex/shipment-tracker/apex/puckquest/collector';
    });
  }

  async function lookupCode(code) {
    const reviewInventory = {
      'E1-APEX-006': {code:'E1-APEX-006',art:'wild',name:'North Woods',edition:'01'},
      'E1-APEX-007': {code:'E1-APEX-007',art:'shark',name:'Open Water',edition:'01'},
      'E1-APEX-008': {code:'E1-APEX-008',art:'lightning',name:'Static Charge',edition:'01'},
      'E1-APEX-009': {code:'E1-APEX-009',art:'penguin',name:'Ice Colony',edition:'01'},
      'E1-APEX-010': {code:'E1-APEX-010',art:'flame',name:'Cold Fire',edition:'01'}
    };
    try {
      const response = await fetch('/shipment-tracker/apex/shipment-tracker/apex/api/puckquest', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'lookup',code})});
      if (response.ok) return response.json();
    } catch (_) {}
    if (reviewInventory[code]) return reviewInventory[code];
    throw new Error('Code not found in the Edition 01 review inventory.');
  }

  function collector() {
    const root = document.querySelector('[data-collector-app]');
    if (!root) return;
    let state = readState();
    saveState(state);
    const render = () => {
      const unique = new Set(state.pucks.map(p=>p.art)).size;
      const first = state.pucks.map(p=>new Date(p.registered)).sort((a,b)=>a-b)[0];
      const elapsed = first ? Math.max(0,daysBetween(first,new Date())) : 0;
      root.innerHTML = `
        <section class="pqf-stats" aria-label="Collector summary">
          <article class="pqf-stat"><small>UNIQUE / EDITION 01</small><strong>${unique}<span> / 32</span></strong></article>
          <article class="pqf-stat"><small>PERMANENTLY REGISTERED</small><strong>${state.pucks.length}</strong><span> codes consumed</span></article>
          <article class="pqf-stat"><small>QUEST CLOCK</small><strong>${elapsed}</strong><span> days since first claim</span></article>
          <article class="pqf-stat"><small>NEXT MILESTONE</small><strong>${Math.max(0,8-unique)}</strong><span> unique to division tier</span></article>
        </section>
        <div class="pqf-layout">
          <div>
            <section class="pqf-panel">
              <header class="pqf-panel__head"><h2>Register a puck</h2><span>ONE CODE / ONE ACCOUNT / PERMANENT</span></header>
              <div class="pqf-panel__body">
                <form class="pqf-register-form" data-register-form>
                  <input required name="code" autocomplete="off" placeholder="E1-APEX-006" aria-label="Puck code">
                  <input required name="purchase" type="date" aria-label="Original purchase date" value="${new Date().toISOString().slice(0,10)}">
                  <select required name="guess" aria-label="Initial team guess"><option value="">Initial team guess</option>${teamOptions('')}</select>
                  <button class="pqf-btn" type="submit">Register</button>
                </form>
                <p class="pqf-form-message" data-register-message>Try E1-APEX-006 through E1-APEX-010. Registration and the first guess must be completed within 15 days of purchase.</p>
              </div>
            </section>
            <section class="pqf-panel" style="margin-top:24px">
              <header class="pqf-panel__head"><h2>Edition 01 collection</h2><span>${unique} OF 32 UNIQUE</span></header>
              <div class="pqf-panel__body"><div class="pqf-progress" aria-label="${unique} of 32 designs"><i style="width:${unique/32*100}%"></i></div><div class="pqf-collection">${state.pucks.map(p=>`
                <article class="pqf-owned" data-code="${p.code}">
                  <div class="pqf-mini"><img src="${artPath(p.art)}" alt="${p.name} printed PuckQuest puck"><span>${p.name}</span></div>
                  <small>${p.code}<br>LOCKED ${new Date(p.registered).toLocaleDateString()}</small>
                  <select aria-label="Guess for ${p.name}" data-guess>${teamOptions(p.guess)}</select>
                </article>`).join('')}</div></div>
            </section>
          </div>
          <aside>
            <section class="pqf-panel">
              <header class="pqf-panel__head"><h2>Milestones</h2><span>OFFICIAL TIERS</span></header>
              <div class="pqf-panel__body pqf-milestones">
                <div class="pqf-milestone ${unique>=8?'done':''}"><span><b>8</b><small>DIVISION / $200</small></span><span>${unique>=8?'READY':'LOCKED'}</span></div>
                <div class="pqf-milestone ${unique>=16?'done':''}"><span><b>16</b><small>CONFERENCE / $450</small></span><span>${unique>=16?'READY':'LOCKED'}</span></div>
                <div class="pqf-milestone ${unique>=32?'done':''}"><span><b>32</b><small>FULL QUEST / $1,000</small></span><span>${unique>=32?'READY':'LOCKED'}</span></div>
                <div class="pqf-milestone"><span><b>3×</b><small>SAME TEAM / 3 EDITIONS / $100</small></span><span>FUTURE</span></div>
              </div>
            </section>
            <section class="pqf-panel" style="margin-top:24px">
              <header class="pqf-panel__head"><h2>Submit a claim</h2><span>PASS / FAIL REVIEW</span></header>
              <div class="pqf-panel__body">
                <form class="pqf-claim-form" data-claim-form>
                  <select name="tier" aria-label="Prize tier"><option value="division">Division — 8 unique / $200</option><option value="conference">Conference — 16 unique / $450</option><option value="full">Full Quest — 32 unique / $1,000</option></select>
                  <div class="pqf-checklist">
                    <label><input required type="checkbox"> Clear selfie with claimed pucks ready</label>
                    <label><input required type="checkbox"> Purchase evidence ready</label>
                    <label><input required type="checkbox"> Public #PuckQuestWin post ready</label>
                    <label><input required type="checkbox"> Identity, eligibility, tax and payment details ready</label>
                  </div>
                  <button class="pqf-btn" type="submit">Check claim readiness</button>
                </form>
                <div class="pqf-status" data-claim-status>A submitted set returns one overall PASS or FAIL. Individual team answers are never disclosed. The first FAIL starts one seven-day correction window.</div>
              </div>
            </section>
          </aside>
        </div>`;

      root.querySelector('[data-register-form]').addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const code = String(data.get('code')).trim().toUpperCase();
        const purchase = String(data.get('purchase'));
        const message = root.querySelector('[data-register-message]');
        if (state.pucks.some(p=>p.code===code)) { message.textContent='That puck is already permanently registered in this review locker.'; return; }
        const age = daysBetween(purchase,new Date());
        if (age < 0 || age > 15) { message.textContent='Registration must be within 15 days of the original purchase date.'; return; }
        message.textContent='Verifying one-time code…';
        try {
          const found = await lookupCode(code);
          state.pucks.push({code,art:found.art,name:found.name,guess:String(data.get('guess')),registered:new Date().toISOString(),purchase,edition:'01'});
          saveState(state); render();
        } catch (error) { message.textContent=error.message; }
      });
      root.querySelectorAll('[data-guess]').forEach(select => select.addEventListener('change',event=>{
        const code=event.target.closest('[data-code]').dataset.code;
        state.pucks.find(p=>p.code===code).guess=event.target.value;
        saveState(state);
      }));
      root.querySelector('[data-claim-form]').addEventListener('submit', event=>{
        event.preventDefault();
        const tier=new FormData(event.currentTarget).get('tier');
        const needed={division:8,conference:16,full:32}[tier];
        const unique=new Set(state.pucks.map(p=>p.art)).size;
        const status=root.querySelector('[data-claim-status]');
        if(unique<needed){status.innerHTML=`<b>NOT READY.</b> This locker has ${unique} unique Edition 01 designs; the selected tier requires ${needed}. No claim or correction clock was started.`;return;}
        status.innerHTML='<b>READY IN THIS REVIEW.</b> The collection meets the selected size. No evidence, guess check or prize claim is submitted from this demonstration.';
      });
    };
    render();
  }

  function admin() {
    const root=document.querySelector('[data-admin-app]');
    if(!root) return;
    const render = () => {
      // The collector and admin review screens share one browser inventory.
      // Read it afresh whenever this screen is revisited or another tab changes it.
      const state=readState();
      const codes=['E1-APEX-006','E1-APEX-007','E1-APEX-008','E1-APEX-009','E1-APEX-010'];
      const registeredCodes = new Set(state.pucks.map(puck => puck.code));
      const availableCodes = codes.filter(code => !registeredCodes.has(code));
      root.innerHTML=`
      <section class="pqf-stats">
        <article class="pqf-stat"><small>EDITION 01 CODES</small><strong>${state.pucks.length+availableCodes.length}</strong><span> review inventory</span></article>
        <article class="pqf-stat"><small>REGISTERED</small><strong>${state.pucks.length}</strong><span> permanent records</span></article>
        <article class="pqf-stat"><small>OPEN CLAIMS</small><strong>${state.claims.length}</strong><span> evidence review</span></article>
        <article class="pqf-stat"><small>ANSWER CHECK</small><strong>OFF</strong><span> review build only</span></article>
      </section>
      <div class="pqf-admin-grid">
        <section class="pqf-panel"><header class="pqf-panel__head"><h2>Claim review queue</h2><span>RESERVE → REVIEW → PASS / FAIL</span></header><div class="pqf-panel__body"><table class="pqf-table"><thead><tr><th>CLAIM</th><th>COLLECTOR</th><th>TIER</th><th>EVIDENCE</th><th>STATUS</th><th>CORRECTION</th></tr></thead><tbody><tr><td>CLM-1048</td><td>Demo Collector</td><td>Division / $200</td><td>3 / 4</td><td><span class="pqf-pill">EVIDENCE REVIEW</span></td><td>Not started</td></tr><tr><td>CLM-1044</td><td>Review Account 02</td><td>Full Quest / $1,000</td><td>4 / 4</td><td><span class="pqf-pill warn">FAIL — WINDOW OPEN</span></td><td>4d 12h left</td></tr><tr><td>CLM-1037</td><td>Review Account 03</td><td>Conference / $450</td><td>4 / 4</td><td><span class="pqf-pill">PASS / PAYMENT</span></td><td>Closed</td></tr></tbody></table></div></section>
        <section class="pqf-panel"><header class="pqf-panel__head"><h2>Official prize matrix</h2><span>FINAL 2026 STRUCTURE</span></header><div class="pqf-panel__body pqf-milestones"><div class="pqf-milestone done"><span><b>$1,000</b><small>32 / SAME EDITION</small></span></div><div class="pqf-milestone"><span><b>$450</b><small>CONFERENCE / 16</small></span></div><div class="pqf-milestone"><span><b>$200</b><small>DIVISION / 8</small></span></div><div class="pqf-milestone"><span><b>$100</b><small>SAME TEAM / 3 EDITIONS</small></span></div></div></section>
        <section class="pqf-panel"><header class="pqf-panel__head"><h2>Code inventory</h2><span>ONE-TIME INVENTORY</span></header><div class="pqf-panel__body"><table class="pqf-table"><thead><tr><th>CODE</th><th>STATE</th></tr></thead><tbody>${state.pucks.map(p=>`<tr><td>${p.code}</td><td><span class="pqf-pill">REGISTERED</span></td></tr>`).join('')}${availableCodes.map(c=>`<tr><td>${c}</td><td>Available</td></tr>`).join('')}</tbody></table></div></section>
        <section class="pqf-panel"><header class="pqf-panel__head"><h2>Rules engine</h2><span>GUARDRAILS</span></header><div class="pqf-panel__body"><p class="pqf-note">One code per physical puck. Registration and initial guess within 15 days of original purchase. Registered pucks cannot be transferred. Guesses remain editable until claim submission. First failed full-collection claim starts a single seven-day correction window; retries do not reset it. One approved prize claim retires the included puck records. No household claim limit is applied in the review model.</p></div></section>
        <section class="pqf-panel"><header class="pqf-panel__head"><h2>Launch status</h2><span>PRE-LAUNCH REVIEW</span></header><div class="pqf-panel__body"><p class="pqf-note"><b>No live promotion is enabled.</b> Dates, jurisdiction, sponsor language, mail-in address and final free-entry mechanics remain held for approved Official Rules. This console contains review data only.</p></div></section>
      </div>`;
    };
    render();
    window.addEventListener('storage', event => {
      if (event.key === STORE_KEY) render();
    });
    window.addEventListener('focus', render);
    window.addEventListener('pageshow', render);
  }

  menus(); auth(); collector(); admin();
})();