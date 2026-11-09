/* The shop (المحل): owl hats, Toto bags and block skins, bought with coins. A pinned preview shows the owl, Toto and three blocks wearing whatever
   is tried on. Rules are in shop.js; every purchase goes through askConfirm, which names the item in the title and on the button. */

const SHOP = { tab: 'hat', prev: {} };

const KIND_TAB = { hat: 'tab_hat', bag: 'tab_bag', skin: 'tab_skin' };

function tryOf(kind) { return SHOP.prev[kind] || wornOf(UI.save, kind); }

function renderShopPreview() {
  const box = $('#shopPrev'), skin = tryOf('skin');
  box.innerHTML = '';
  const owl = el('div', 'prev-owl'), hog = el('div', 'prev-hog'), blocks = el('div', 'prev-blocks');
  owl.innerHTML = owlSVG('cheer', tryOf('hat'));
  hog.innerHTML = hogSVG('cheer', tryOf('bag'));
  [[0, 7], [2, 25], [3, 36]].forEach(([i, v]) => { const b = el('div', 'prev-block'); b.innerHTML = blockSVG(skin, i, '', v); blocks.append(b); });
  box.append(owl, blocks, hog);
}

function thumb(kind, item) {
  const d = el('div', 'thumb ' + kind);
  d.innerHTML = kind === 'hat' ? owlSVG('idle', item.id) : kind === 'bag' ? hogSVG('idle', item.id) : blockSVG(item.id, 0, '', 12) + blockSVG(item.id, 2, '', 25);
  return d;
}

function buyWithConfirm(kind, item) {
  const name = nameOf(item);
  askConfirm(t('buyTitle', name), t('buyBody', nf(item.price)), t('buyBtn', name, nf(item.price)), () => {
    const r = buyItem(UI.save, kind, item.id, Date.now());
    if (!r.ok) return;
    let save = r.save;
    const b = bumpStats(save, { bought: 1 }, Date.now());
    save = b.save;
    setSave(save);
    SHOP.prev[kind] = null;
    sfx('win');
    toast(t('bought', name));
    b.unlocked.forEach(a => toast(t('ach_new') + ' ' + nameOf(a)));
    renderShop();
  });
}

function itemCard(kind, item) {
  const s = UI.save, now = Date.now();
  const held = holdsItem(s, kind, item.id), usable = ownsItem(s, kind, item.id, now), worn = wornOf(s, kind, now) === item.id;
  const card = el('div', 'item' + (worn ? ' worn' : '') + (SHOP.prev[kind] === item.id ? ' tried' : ''));
  card.dataset.item = kind + ':' + item.id;
  const art = el('button', 'item-art');
  art.type = 'button';
  art.setAttribute('aria-label', nameOf(item));
  art.append(thumb(kind, item));
  art.onclick = () => { SHOP.prev[kind] = item.id; renderShop(); };
  card.append(art, el('b', 'item-name', nameOf(item)));
  const act = el('div', 'item-act');
  if (usable) {
    const w = el('button', 'btn small' + (worn ? '' : ' gold'), worn ? t('equipped') : t('wear'));
    w.type = 'button'; w.disabled = worn;
    w.onclick = () => { setSave(wearItem(UI.save, kind, item.id, Date.now())); SHOP.prev[kind] = null; sfx('click'); renderShop(); };
    act.append(w);
    if (!held) {
      const buy = el('button', 'btn small', nf(item.price));
      buy.type = 'button'; buy.title = t('buy');
      buy.prepend(Object.assign(el('i', 'coin-i'), { innerHTML: icon('coin') }));
      buy.onclick = () => buyWithConfirm(kind, item);
      act.append(buy, el('span', 'tag', t('lent')));
    }
  } else {
    const can = canBuy(s, kind, item.id).ok;
    const buy = el('button', 'btn small' + (can ? ' gold' : ''), can ? t('buy') + ' ' + nf(item.price) : t('needCoins', nf(item.price - s.coins)));
    buy.type = 'button'; buy.disabled = !can;
    if (can) buy.prepend(Object.assign(el('i', 'coin-i'), { innerHTML: icon('coin') }));
    buy.onclick = () => buyWithConfirm(kind, item);
    act.append(buy);
  }
  card.append(act);
  return card;
}

function renderShop() {
  $('#shopCoins').textContent = nf(UI.save.coins);
  const pass = $('#shopPass');
  pass.classList.toggle('hide', !passActive(UI.save));
  pass.textContent = passActive(UI.save) ? passLeftText() : '';
  renderShopPreview();
  const tabs = $('#shopTabs');
  tabs.innerHTML = '';
  SHOP_KINDS.forEach(kind => {
    const b = el('button', 'tab', t(KIND_TAB[kind]));
    b.type = 'button'; b.dataset.tab = kind;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(SHOP.tab === kind));
    b.onclick = () => { SHOP.tab = kind; sfx('click'); renderShop(); };
    tabs.append(b);
  });
  const grid = $('#shopGrid');
  grid.innerHTML = '';
  SHOP_ITEMS[SHOP.tab].forEach(item => grid.append(itemCard(SHOP.tab, item)));
}

function openShop() {
  SHOP.prev = {};
  openScreen('shop');
  renderShop();
}
