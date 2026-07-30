/*
 * Zapamiętywanie odznaczonych pozycji na listach zadań.
 *
 * Strona jest statycznym HTML-em na GitHub Pages — nie ma backendu, więc stan
 * checkboxów trzyma localStorage przeglądarki. Znaczy to, że lista jest per
 * urządzenie i per przeglądarka: odznaczenie na laptopie nie przeniesie się na
 * telefon.
 *
 * Klucz pozycji to jej tekst, nie indeks — dzięki temu dopisanie czegoś w środku
 * listy nie przesuwa zaznaczeń na sąsiednie pozycje.
 */

function initChecklist() {
  const items = document.querySelectorAll("li.task-list-item");
  if (!items.length) return;

  const storageKey = "gory:checklist:" + location.pathname;

  let saved;
  try {
    saved = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
  } catch (e) {
    saved = new Set(); // uszkodzony wpis — zaczynamy od zera zamiast wywalać skrypt
  }

  // Tekst pozycji bez treści zagnieżdżonych podlist, żeby klucz był stabilny.
  const labelOf = (item) => {
    const clone = item.cloneNode(true);
    clone.querySelectorAll("ul, ol, label").forEach((el) => el.remove());
    return clone.textContent.trim().slice(0, 100);
  };

  const boxes = [];
  items.forEach((item) => {
    const box = item.querySelector('input[type="checkbox"]');
    if (!box) return;
    const key = labelOf(item);
    box.checked = saved.has(key);
    boxes.push({ box, key });
    box.addEventListener("change", () => {
      box.checked ? saved.add(key) : saved.delete(key);
      localStorage.setItem(storageKey, JSON.stringify([...saved]));
      render();
    });
  });

  if (!boxes.length) return;

  // Pasek postępu wstawiany nad pierwszą listą zadań.
  const firstList = items[0].closest("ul");
  const bar = document.createElement("div");
  bar.className = "checklist-progress";
  bar.innerHTML =
    '<div class="checklist-progress__row">' +
    '<span class="checklist-progress__count"></span>' +
    '<button type="button" class="checklist-progress__reset">Wyczyść</button>' +
    "</div>" +
    '<div class="checklist-progress__track"><div class="checklist-progress__fill"></div></div>';
  firstList.parentNode.insertBefore(bar, firstList);

  const countEl = bar.querySelector(".checklist-progress__count");
  const fillEl = bar.querySelector(".checklist-progress__fill");

  function render() {
    const done = boxes.filter(({ box }) => box.checked).length;
    const pct = Math.round((done / boxes.length) * 100);
    countEl.textContent =
      done === boxes.length
        ? "Spakowane — wszystkie " + boxes.length + " pozycji ✓"
        : "Spakowane: " + done + " z " + boxes.length + " (" + pct + "%)";
    fillEl.style.width = pct + "%";
  }

  bar.querySelector(".checklist-progress__reset").addEventListener("click", () => {
    boxes.forEach(({ box }) => (box.checked = false));
    saved.clear();
    localStorage.removeItem(storageKey);
    render();
  });

  render();
}

// navigation.instant podmienia treść bez przeładowania strony, więc DOMContentLoaded
// odpala się tylko raz. Material udostępnia obserwable document$ na każdą zmianę strony.
if (typeof document$ !== "undefined") {
  document$.subscribe(initChecklist);
} else {
  document.addEventListener("DOMContentLoaded", initChecklist);
}
