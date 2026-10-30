(() => {
  const root = document.documentElement;

  /* ---------- Language ---------- */

  const en = {
    skip: "Skip to the sweets",
    homeLabel: "Sukkarah, back to top",
    navLabel: "Sections",
    navInside: "Inside the box",
    navGifts: "Gifts",
    navCoffee: "With coffee",
    navVisit: "Find us",
    greeting: "Bon appétit",
    trayAlt: "A layered tray cut into squares, caramelised on top with pistachio, one piece lifted on a knife",
    heroTitle: "Sweetness that<br>brings us together.",
    heroLede: "From the Sukkarah kitchen in Qatar: kunafa, basbousa with almonds, and layered cream trays.",
    contentsLabel: "In the box",
    itemKunafa: "Kunafa",
    itemBasbousa: "Basbousa with almonds",
    itemLayered: "Layered tray",
    itemGift: "Gift trays",
    heroAction: "See what's inside",
    insideTitle: "Inside the box",
    insideNote: "Four sweets from our kitchen. Sizes and prices go on each label at launch.",
    kunafaAlt: "A round kunafa in a metal tray, golden on top with crushed pistachio in the centre",
    kunafaDesc: "Baked in a round tray, pistachio at the centre.",
    fieldWeight: "Size",
    fieldPrice: "Price",
    tbd: "Not set yet",
    basbousaAlt: "A round basbousa on a glass plate, covered in chopped almonds",
    basbousaDesc: "Semolina baked as one whole round, topped with almonds.",
    almondsAlt: "Close-up of the basbousa top: chopped almonds on golden semolina",
    almondsCaption: "Almonds, up close",
    layeredAlt: "A piece lifted on a knife showing the layers: semolina base, white cream, caramelised top",
    tempName: "working name",
    layeredDesc: "A semolina base, a layer of cream, and a caramelised top dusted with pistachio.",
    giftAlt: "A cut layered tray wrapped in cellophane on a marble table beside a brass vase",
    giftsTitle: "A gift to carry by hand",
    giftsText: "A cut, wrapped tray, made ready to carry to a visit or an occasion. Sizes and wrapping options are announced at launch.",
    coffeeAlt: "A piece of layered sweet on a gold-rimmed plate beside a cup of coffee",
    coffeeTitle: "With a cup of coffee",
    coffeeText: "One piece on a plate, a cup beside it. That is how we like Sukkarah served to a guest.",
    visitAlt: "Basbousa with almonds on a glass plate beside a brass vase of tulips",
    visitTitle: "From the Sukkarah kitchen",
    fieldCity: "Country",
    cityValue: "Qatar",
    fieldAddress: "Address",
    fieldHours: "Hours",
    fieldPhone: "WhatsApp",
    fieldInsta: "Instagram",
    visitNote: "These details go on the label at launch.",
    footerLine: "Arabic sweets · Qatar",
    footerNote: "Pre-launch preview. Prices and details to follow.",
  };

  const titles = {
    ar: document.title,
    en: "Sukkarah · Arabic sweets in Qatar",
  };

  const ar = {};
  const textNodes = document.querySelectorAll("[data-i18n]");
  const altNodes = document.querySelectorAll("[data-i18n-alt]");
  const ariaNodes = document.querySelectorAll("[data-i18n-aria]");
  textNodes.forEach((el) => { ar[el.dataset.i18n] = el.innerHTML; });
  altNodes.forEach((el) => { ar[el.dataset.i18nAlt] = el.alt; });
  ariaNodes.forEach((el) => { ar[el.dataset.i18nAria] = el.getAttribute("aria-label"); });

  const toggle = document.getElementById("lang-toggle");

  function setLang(lang) {
    const dict = lang === "en" ? en : ar;
    textNodes.forEach((el) => { el.innerHTML = dict[el.dataset.i18n]; });
    altNodes.forEach((el) => { el.alt = dict[el.dataset.i18nAlt]; });
    ariaNodes.forEach((el) => { el.setAttribute("aria-label", dict[el.dataset.i18nAria]); });
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";
    document.title = titles[lang];
    if (lang === "en") {
      toggle.textContent = "ع";
      toggle.lang = "ar";
      toggle.setAttribute("aria-label", "التبديل إلى العربية");
    } else {
      toggle.textContent = "EN";
      toggle.lang = "en";
      toggle.setAttribute("aria-label", "Switch to English");
    }
    try { localStorage.setItem("sukkarah-lang", lang); } catch (e) { /* storage unavailable */ }
  }

  toggle.addEventListener("click", () => setLang(root.lang === "en" ? "ar" : "en"));

  let saved = null;
  try { saved = localStorage.getItem("sukkarah-lang"); } catch (e) { /* storage unavailable */ }
  if (saved === "en") setLang("en");

  /* ---------- Opening the box: the lid lifts as the visitor scrolls ---------- */

  const lid = document.querySelector(".lid");
  const stage = document.querySelector(".lid__stage");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tall = window.matchMedia("(min-height: 560px)");

  let frame = 0;

  function update() {
    frame = 0;
    const travel = lid.offsetHeight - stage.offsetHeight;
    const progress = travel > 0 ? Math.min(Math.max(-lid.getBoundingClientRect().top / travel, 0), 1) : 0;
    const eased = 1 - Math.pow(1 - progress, 3);
    stage.style.setProperty("--open", eased.toFixed(4));
  }

  function request() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function configure() {
    const enabled = !calm.matches && tall.matches;
    root.classList.toggle("js-open", enabled);
    if (enabled) {
      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", request);
      update();
    } else {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      stage.style.setProperty("--open", "0");
    }
  }

  calm.addEventListener("change", configure);
  tall.addEventListener("change", configure);
  configure();
})();
