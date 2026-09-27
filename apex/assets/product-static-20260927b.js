const __APEX_BASE='/shipment-tracker/apex'; const __APEX_PATH=location.pathname.startsWith(__APEX_BASE)?(location.pathname.slice(__APEX_BASE.length)||'/'):location.pathname;
(() => {
  'use strict';

  const PRODUCTS = {
    '40496445849734': { name: 'APEX GAME', pack: '12 pucks', price: 20, available: true },
    '40496445882502': { name: 'APEX GAME', pack: '50 pucks', price: 48, available: true },
    '40496445915270': { name: 'APEX GAME', pack: '100 pucks', price: 93, available: true },
    '42084570497158': { name: 'APEX PRO', pack: '50 pucks', price: 65, available: false },
    '42084570529926': { name: 'APEX PRO', pack: '100 pucks', price: 125, available: false },
    '42365760340102': { name: 'PUCKQUEST E1', pack: 'League Pack', price: 5, available: true },
    '42365760372870': { name: 'PUCKQUEST E1', pack: 'Eastern Conference Pack', price: 10, available: true },
    '42365760405638': { name: 'PUCKQUEST E1', pack: 'Western Conference Pack', price: 10, available: true },
    '42365760438406': { name: 'PUCKQUEST E1', pack: 'Atlantic Division Pack', price: 15, available: true },
    '42365760471174': { name: 'PUCKQUEST E1', pack: 'Metro Division Pack', price: 15, available: true },
    '42365760503942': { name: 'PUCKQUEST E1', pack: 'Pacific Division Pack', price: 15, available: true },
    '42365760536710': { name: 'PUCKQUEST E1', pack: 'Central Division Pack', price: 15, available: true }
  };

  const money = value => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD'
  }).format(value);

  const readCart = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem('apex-cart-v1') || '[]');
      return Array.isArray(parsed) ? parsed.filter(item => PRODUCTS[String(item.variantId)] && item.quantity > 0) : [];
    } catch { return []; }
  };

  const writeCart = cart => {
    localStorage.setItem('apex-cart-v1', JSON.stringify(cart));
    refreshCartCount();
  };

  const refreshCartCount = () => {
    const count = readCart().reduce((total, item) => total + Number(item.quantity || 0), 0);
    document.querySelectorAll('.cart-trigger').forEach(button => {
      const label = button.querySelector('span');
      if (label) label.textContent = String(count);
      button.setAttribute('aria-label', `Open cart, ${count} pack${count === 1 ? '' : 's'}`);
    });
  };

  function openCart() {
    document.querySelector('.static-cart')?.remove();
    const cart = readCart();
    const shell = document.createElement('div');
    shell.className = 'static-cart';
    shell.innerHTML = `
      <button class="static-cart__scrim" aria-label="Close cart"></button>
      <aside class="static-cart__panel" aria-label="Shopping cart">
        <div class="static-cart__head"><div><small>YOUR KIT</small><h2>READY FOR THE ICE.</h2></div><button class="static-cart__close" aria-label="Close cart">×</button></div>
        <div class="static-cart__lines"></div>
        <div class="static-cart__foot"></div>
      </aside>`;
    document.body.appendChild(shell);
    document.body.classList.add('cart-open');
    const close = () => { shell.remove(); document.body.classList.remove('cart-open'); };
    shell.querySelector('.static-cart__scrim').addEventListener('click', close);
    shell.querySelector('.static-cart__close').addEventListener('click', close);

    const lines = shell.querySelector('.static-cart__lines');
    const foot = shell.querySelector('.static-cart__foot');
    const render = () => {
      const current = readCart();
      if (!current.length) {
        lines.innerHTML = '<div class="static-cart__empty"><strong>YOUR BAG IS EMPTY.</strong><p>Build your next order from the Apex lineup.</p><a href="/shop" class="btn">Explore pucks ↗</a></div>';
        foot.innerHTML = '';
        return;
      }
      lines.innerHTML = current.map(item => {
        const product = PRODUCTS[String(item.variantId)];
        return `<article class="static-cart__line" data-variant="${item.variantId}"><div><small>${product.name}</small><strong>${product.pack}</strong><span>${money(product.price)} / pack</span></div><div class="static-cart__qty"><button data-step="-1" aria-label="Decrease ${product.name}">−</button><span>${item.quantity}</span><button data-step="1" aria-label="Increase ${product.name}">+</button></div><button class="static-cart__remove" aria-label="Remove ${product.name}">Remove</button></article>`;
      }).join('');
      const subtotal = current.reduce((total, item) => total + PRODUCTS[String(item.variantId)].price * item.quantity, 0);
      const checkout = current.every(item => PRODUCTS[String(item.variantId)].available)
        ? `https://apexhockeypucks.com/cart/${current.map(item => `${item.variantId}:${item.quantity}`).join(',')}` : '#';
      foot.innerHTML = `<div><span>Subtotal</span><strong>${money(subtotal)}</strong></div><p>USD. Tax and delivery confirmed at Apex checkout.</p><a class="btn full${checkout === '#' ? ' disabled' : ''}" href="${checkout}">Secure checkout ↗</a>`;

      lines.querySelectorAll('.static-cart__line').forEach(line => {
        const id = line.dataset.variant;
        line.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
          const next = readCart().map(item => String(item.variantId) === id ? { ...item, quantity: Math.max(1, Math.min(99, item.quantity + Number(button.dataset.step))) } : item);
          writeCart(next); render();
        }));
        line.querySelector('.static-cart__remove').addEventListener('click', () => {
          writeCart(readCart().filter(item => String(item.variantId) !== id)); render();
        });
      });
    };
    render();
  }

  function installHeader() {
    refreshCartCount();
    document.querySelectorAll('.cart-trigger').forEach(button => button.addEventListener('click', openCart));
    document.querySelectorAll('.mobile-menu').forEach(button => button.addEventListener('click', () => {
      document.querySelector('.static-menu')?.remove();
      const menu = document.createElement('div');
      menu.className = 'static-menu';
      menu.innerHTML = `<div class="static-menu__head"><img src="https://apex-hockey-george-review.vercel.app/assets/logo.svg" alt="Apex Hockey Pucks"><button aria-label="Close navigation">×</button></div><nav><a href="/shop">Shop pucks</a><a href="/custom-pucks">Custom pucks</a><a href="/team-orders">Team & bulk</a><a href="/puckquest">PuckQuest</a><a href="/manufacturing">Our craft</a><a href="/contact">Contact Apex</a></nav>`;
      document.body.appendChild(menu);
      menu.querySelector('button').addEventListener('click', () => menu.remove());
    }));
  }

  function installGallery() {
    const stage = document.querySelector('.equipment-stage');
    const main = stage?.querySelector('.physical-object img');
    const thumbs = [...document.querySelectorAll('.gallery-thumbs button')];
    if (!stage || !main || !thumbs.length) return;
    let active = Math.max(0, thumbs.findIndex(button => button.getAttribute('aria-pressed') === 'true'));
    const show = index => {
      active = (index + thumbs.length) % thumbs.length;
      const image = thumbs[active].querySelector('img');
      main.src = image.src;
      thumbs.forEach((button, i) => {
        button.setAttribute('aria-pressed', String(i === active));
        button.classList.toggle('active', i === active);
      });
    };
    thumbs.forEach((button, index) => button.addEventListener('click', () => show(index)));
    const arrows = document.querySelectorAll('.gallery-control-bar > button');
    arrows[0]?.addEventListener('click', () => show(active - 1));
    arrows[arrows.length - 1]?.addEventListener('click', () => show(active + 1));
    document.querySelector('.macro-toggle')?.addEventListener('click', event => {
      const pressed = event.currentTarget.getAttribute('aria-pressed') === 'true';
      event.currentTarget.setAttribute('aria-pressed', String(!pressed));
      stage.classList.toggle('static-macro', !pressed);
    });
  }

  function installPurchase() {
    const questPacks = [
      ['42365760340102', 'League Pack — 2 random from all 32', '$5.00'],
      ['42365760372870', 'Eastern Conference — 2 random from 16', '$10.00'],
      ['42365760405638', 'Western Conference — 2 random from 16', '$10.00'],
      ['42365760438406', 'Atlantic Division — 2 random from 8', '$15.00'],
      ['42365760471174', 'Metro Division — 2 random from 8', '$15.00'],
      ['42365760503942', 'Pacific Division — 2 random from 8', '$15.00'],
      ['42365760536710', 'Central Division — 2 random from 8', '$15.00']
    ];
    const isQuest = __APEX_PATH.includes('/products/apex-puckquest-e1');
    const questField = isQuest ? document.querySelector('.product-purchase .field') : null;
    if (questField && !questField.querySelector('.pack-options label')) {
      questField.innerHTML = `
        <label for="puckquest-pack">Choose your mystery pack</label>
        <select id="puckquest-pack" class="apex-select apex-native-select">
          ${questPacks.map(([id, label, price]) => `<option value="${id}">${label} — ${price}</option>`).join('')}
        </select>`;
    }

    const options = [...document.querySelectorAll('.pack-options label')];
    const nativeSelect = document.querySelector('.apex-native-select');
    const quantity = document.querySelector('.quantity input');
    const add = document.querySelector('.purchase-actions .btn');
    if ((!options.length && !nativeSelect) || !quantity || !add) return;
    let selected = options.find(label => label.querySelector('[role="radio"][aria-checked="true"]')) || options[0];
    const select = label => {
      const radio = label.querySelector('[role="radio"]');
      if (!radio) return;
      selected = label;
      options.forEach(option => {
        const on = option === label;
        option.classList.toggle('selected', on);
        option.querySelector('[role="radio"]')?.setAttribute('aria-checked', String(on));
      });
      update();
    };
    const update = () => {
      const id = nativeSelect?.value || selected?.querySelector('[role="radio"]')?.value || selected?.querySelector('input')?.value;
      const product = PRODUCTS[String(id)];
      const qty = Math.max(1, Math.min(99, Number(quantity.value) || 1));
      quantity.value = String(qty);
      if (!product) return;
      const price = document.querySelector('.price-row strong');
      const packName = document.querySelector('.price-row strong + span');
      if (price) price.textContent = money(product.price);
      if (packName) packName.textContent = product.pack;
      if (add.tagName === 'BUTTON') add.disabled = !product.available;
      if (add.tagName === 'A' && !product.available) {
        add.href = `/contact?type=Stock%20inquiry&product=${encodeURIComponent(product.name)}`;
      }
      add.dataset.variant = id;
      add.innerHTML = product.available
        ? `Add to bag — ${money(product.price * qty)} <span aria-hidden="true">↗</span>`
        : 'Ask about availability <span aria-hidden="true">↗</span>';
    };
    options.forEach(label => label.addEventListener('click', () => select(label)));
    nativeSelect?.addEventListener('change', update);
    const qtyButtons = document.querySelectorAll('.quantity button');
    qtyButtons[0]?.addEventListener('click', () => { quantity.value = String(Math.max(1, Number(quantity.value) - 1)); update(); });
    qtyButtons[qtyButtons.length - 1]?.addEventListener('click', () => { quantity.value = String(Math.min(99, Number(quantity.value) + 1)); update(); });
    quantity.addEventListener('input', update);
    add.addEventListener('click', () => {
      const id = String(add.dataset.variant || '');
      const product = PRODUCTS[id];
      if (!product?.available) return;
      const qty = Number(quantity.value) || 1;
      const cart = readCart();
      const existing = cart.find(item => String(item.variantId) === id);
      if (existing) existing.quantity = Math.min(99, existing.quantity + qty);
      else cart.push({ variantId: id, quantity: qty });
      writeCart(cart); openCart();
    });
    if (nativeSelect) update();
    else select(selected);
  }

  function installQuestGallery() {
    const gallery = document.querySelector('.quest-product-gallery');
    const face = gallery?.querySelector('.pq-puck-face img');
    const captionTitle = gallery?.querySelector('.quest-product-caption small');
    const caption = gallery?.querySelector('.quest-product-caption p');
    const controls = [...(gallery?.querySelectorAll('.quest-product-controls button') || [])];
    if (!gallery || !face || controls.length < 3) return;
    const views = [
      ['https://apex-hockey-george-review.vercel.app/assets/puckquest/art/edition-01-mystery-03.webp', 'PHYSICAL MINI PUCK', 'A compact printed collectible made specifically for the PuckQuest series.'],
      ['https://apex-hockey-george-review.vercel.app/assets/puckquest/art/edition-01-mystery-11.webp', 'PRINTED EDITION 01', 'Artwork is cropped exactly to the circular puck face—clean, edge-to-edge and never outside the surface.'],
      ['https://apex-hockey-george-review.vercel.app/assets/puckquest/art/edition-01-mystery-06.webp', '32-DESIGN COLLECTION', 'Build the Edition 01 lineup one permanently registered puck at a time.']
    ];
    let active = 0;
    const show = index => {
      active = (index + views.length) % views.length;
      face.src = views[active][0];
      if (captionTitle) captionTitle.textContent = views[active][1];
      if (caption) caption.textContent = views[active][2];
      controls.forEach(button => button.classList.remove('active'));
      const direct = controls.filter(button => /^0[1-3]/.test(button.textContent.trim()));
      direct[active]?.classList.add('active');
    };
    const direct = controls.filter(button => /^0[1-3]/.test(button.textContent.trim()));
    direct.forEach((button, index) => button.addEventListener('click', () => show(index)));
    controls[0]?.addEventListener('click', () => show(active - 1));
    controls[controls.length - 1]?.addEventListener('click', () => show(active + 1));
    show(0);
  }

  function installAccordions() {
    const answers = {
      'Which Apex puck should I choose?': 'Choose APEX GAME for traditional game and practice use. Choose APEX PRO when reducing black marks on boards and glass is the priority; current availability is shown on the product page.',
      'Where are Apex pucks made?': 'Apex is an American-based company. Its hockey pucks are manufactured in Sri Lanka at its dedicated puck facility.',
      'Is US shipping free?': 'Free US shipping is advertised for APEX GAME and APEX PRO puck orders. Final delivery details are confirmed at checkout.',
      'How does the money-back guarantee work?': 'Review the current Returns & Guarantee page before sending anything back, or contact Apex with the order details for approval and instructions.',
      'How do PuckQuest mystery packs work?': 'Every sealed pack contains two random printed PuckQuest mini pucks: League draws from all 32 designs, Conference from the selected 16, and Division from the selected eight.',
      'When does the PuckQuest speed clock begin?': 'The achievement clock begins with the original purchase. Register the code and submit the first team guess within 15 days; speed bonuses apply at 30, 60 and 90 days under the final public rules.',
      'Can a registered PuckQuest puck be traded or sold?': 'No. Once its code is claimed, that puck is permanently registered to the collector account. Only an unregistered puck may change hands before its code is claimed.'
    };
    document.querySelectorAll('.faq-list [data-slot="accordion-item"]').forEach(item => {
      const trigger = item.querySelector('[data-slot="accordion-trigger"]');
      const panel = item.querySelector('[data-slot="accordion-content"]');
      const answer = answers[trigger?.textContent.trim()];
      if (!trigger || !panel || !answer || trigger.dataset.staticReady) return;
      trigger.dataset.staticReady = 'true';
      panel.innerHTML = `<div class="faq-answer"><p>${answer}</p></div>`;
      const setOpen = open => {
        trigger.setAttribute('aria-expanded', String(open));
        trigger.dataset.state = open ? 'open' : 'closed';
        item.dataset.state = open ? 'open' : 'closed';
        panel.dataset.state = open ? 'open' : 'closed';
        panel.hidden = !open;
      };
      trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
      setOpen(false);
    });
  }

  function init() {
    installHeader();
    installGallery();
    installPurchase();
    installQuestGallery();
    installAccordions();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();