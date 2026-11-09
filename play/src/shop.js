/* Shop rules, pure. Items are hats (owl), bags (hedgehog) and block skins. Buying keeps the item for good; the quick pass only lends them (ownsItem reads passActive). */

if (typeof module !== 'undefined' && module.exports && typeof SHOP_ITEMS === 'undefined') Object.assign(global, require('./data.js'));
if (typeof module !== 'undefined' && module.exports && typeof passActive === 'undefined') Object.assign(global, require('./save.js'));

const itemOf = (kind, id) => (SHOP_ITEMS[kind] || []).find(i => i.id === id) || null;

/** Owned for good (bought or default). */
const holdsItem = (save, kind, id) => Boolean(itemOf(kind, id)) && save.owned[kind].includes(id);

/** Usable right now: owned, or lent by the quick pass. */
const ownsItem = (save, kind, id, now) => Boolean(itemOf(kind, id)) && (holdsItem(save, kind, id) || passActive(save, now));

function canBuy(save, kind, id) {
  const item = itemOf(kind, id);
  if (!item) return { ok: false, reason: 'unknown' };
  if (holdsItem(save, kind, id)) return { ok: false, reason: 'owned' };
  if (save.coins < item.price) return { ok: false, reason: 'coins' };
  return { ok: true };
}

/** Buy an item. Wears it at once. Returns { ok, save }. Achievements for the first purchase are paid by the caller via bumpStats. */
function buyItem(save, kind, id, now = 0) {
  const c = canBuy(save, kind, id);
  if (!c.ok) return { ok: false, reason: c.reason, save };
  const item = itemOf(kind, id);
  return {
    ok: true,
    save: { ...save, coins: save.coins - item.price, owned: { ...save.owned, [kind]: [...save.owned[kind], id] }, worn: { ...save.worn, [kind]: id }, updatedAt: now }
  };
}

/** Wear an item you own (or that the pass lends). */
function wearItem(save, kind, id, now) {
  if (!ownsItem(save, kind, id, now) || save.worn[kind] === id) return save;
  return { ...save, worn: { ...save.worn, [kind]: id } };
}

/** What is worn, falling back to the default when it is no longer usable. */
function wornOf(save, kind, now) {
  const id = save.worn[kind];
  return ownsItem(save, kind, id, now) ? id : DEFAULTS[kind];
}

const skinOf = (save, now) => itemOf('skin', wornOf(save, 'skin', now));

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { itemOf, holdsItem, ownsItem, canBuy, buyItem, wearItem, wornOf, skinOf };
}
