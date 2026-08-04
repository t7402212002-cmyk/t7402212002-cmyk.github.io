(function () {
  "use strict";

  const historyKey = "name-tool-history-v3";
  const maxHistory = 40;
  const currency = ["$", "G", "S", "C", "\u00a5", "\u20a9", "\u20ab", "\u0e3f", "R", "p", "\u09f3", "\u20ba", "\u20ac", "\u20bd"];
  const defaultPattern = "{func}_{prefix}_{type}_{font}_{state}_{num}_{name}_{version}{ext}";
  const fontSeries = {
    multiplier: [...numberSuffixes(0, 9, 3), "x"],
    score: [...numberSuffixes(0, 9, 3), ...coreSigns(), ...currency]
  };
  const presetGroups = {
    symbol_image: "main",
    symbol_multiplier: "main",
    symbol_countdown: "main",
    base_bg: "main",
    ways_text: "main",
    ways_nu: "main",
    base_count: "main",
    marquee_mask: "marquee",
    marquee_text: "marquee",
    marquee_nu: "marquee",
    intro_text: "intro",
    intro_nu: "intro",
    totalwin_text: "win",
    totalwin_nu: "win",
    win_nu: "win",
    maxwin_text: "win",
    maxwin_nu: "win",
    buyfeature_lang: "buyfeature",
    buyfeature_img: "buyfeature",
    freetimes_text: "free",
    freetimes_nu: "free",
    retrigger_text: "free",
    retrigger_nu: "free",
    ui_spin: "ui",
    ui_btn_nu: "ui",
    ui_common: "ui",
    info_nu: "ui",
    loading: "online",
    loading_lang: "online",
    backend_symbol: "backend",
    backend_bg_frame: "backend",
    backend_logo: "backend",
    hs_bg: "hs_initial",
    hs_logo: "hs_initial",
    hs_text: "hs_initial",
    hs_times: "hs_initial",
    hs_times_nu: "hs_initial",
    hs_free_stop: "hs_initial",
    hs_spin_buttons: "hs_initial",
    hs_totalwin_text: "hs_launch",
    hs_totalwin_nu_a: "hs_launch",
    hs_spin_bar: "hs_launch",
    hs_base_nu_a: "hs_launch",
    hs_base_nu_b: "hs_launch",
    hs_fg_base: "hs_fg",
    hs_fg_spin_nu_a: "hs_fg",
    hs_fg_free_nu_a: "hs_fg",
    hs_fg_free_nu_b: "hs_fg",
    hs_fg_spin_nu_b: "hs_fg",
    hs_fg_buttons: "hs_fg",
    hs_autostart: "hs_fg",
    hs_balance: "hs_balance",
    hs_replay_base: "hs_replay",
    hs_replay_nu_a: "hs_replay",
    hs_replay_nu_b: "hs_replay",
    hs_replay_buttons: "hs_replay",
    hs_ui_common: "hs_ui"
  };
  let exactMode = true;

  const presets = {
    symbol_image: preset(["symbol_scatter", "symbol_wild", "symbol_dynamic_output"]),
    symbol_multiplier: preset([
      ...numberNames("symbol_multiplier_nu_a_", 0, 9, 3),
      "symbol_multiplier_nu_a_x",
      ...numberNames("symbol_multiplier_nu_b_", 0, 9, 3),
      "symbol_multiplier_nu_b_x"
    ], { fontSeries: "multiplier", state: "2", number: "0" }),
    symbol_countdown: preset(numberNames("symbol_nu_", 1, 3, 3)),
    base_bg: preset(["base_001", "reels_001", "base_reels_bg", "base_reels_frame", "reels_mask"]),
    ways_text: preset(["ways_text_ways"], { fontSeries: "text" }),
    ways_nu: preset([...numberNames("ways_nu_", 0, 9, 3), "base_multiplier_001"]),
    base_count: preset([...numberNames("base_count_nu_", 0, 9, 3), ...suffixNames("base_count_nu_", coreSigns()), ...suffixNames("base_count_nu_", currency)], { fontSeries: "score", number: "0" }),
    marquee_mask: preset(["marquee_mask", "marquee_frame"]),
    marquee_text: preset(numberNames("marquee_text_", 1, 8, 3), { fontSeries: "text" }),
    marquee_nu: preset([...numberNames("marquee_nu_", 0, 9, 3), ...suffixNames("marquee_nu_", coreSigns()), ...suffixNames("marquee_nu_", currency)], { fontSeries: "score", number: "0" }),
    intro_text: preset(["intro_text_001", "intro_text_002", "btn_intro_text_start"], { fontSeries: "text" }),
    intro_nu: preset([...numberNames("intro_nu_", 0, 9, 3), ...numberNames("autostart_nu_", 0, 9, 3)]),
    totalwin_text: preset(["totalwin_text_totalwin"], { fontSeries: "text" }),
    totalwin_nu: preset([...numberNames("totalwin_nu_", 0, 9, 3), ...suffixNames("totalwin_nu_", coreSigns()), ...suffixNames("totalwin_nu_", currency)], { fontSeries: "score", number: "0" }),
    win_nu: preset([...numberNames("win_nu_", 0, 9, 3), ...suffixNames("win_nu_", coreSigns()), ...suffixNames("win_nu_", currency)], { fontSeries: "score", number: "0" }),
    maxwin_text: preset(["maxwin_text_maxwin", "btn_maxwin_text_winning"], { fontSeries: "text" }),
    maxwin_nu: preset([...numberNames("maxwin_nu_", 0, 9, 3), ...suffixNames("maxwin_nu_", coreSigns()), ...suffixNames("maxwin_nu_", currency)], { fontSeries: "score", number: "0" }),
    buyfeature_lang: preset(["btn_buyfeature_text_001", "buyfeature_text_001", "btn_buyfeature_text_002", "btn_buyfeature_text_003"], { fontSeries: "text" }),
    buyfeature_img: preset(["buyfeature_img_sel", "buyfeature_img_sel_002", "buyfeature_img_sel_003", "btn_buyfeature_minus", "btn_buyfeature_plus", "btn_buyfeature_confirm", "btn_buyfeature_cancel"]),
    freetimes_text: preset(["freetimes_text_freegame", "freetimes_text_maxspin"], { fontSeries: "text" }),
    freetimes_nu: preset([...numberNames("freetimes_nu_", 0, 9, 3), "freetimes_nu_of"]),
    retrigger_text: preset(["retrigger_text_freegame"], { fontSeries: "text" }),
    retrigger_nu: preset(numberNames("retrigger_nu_", 0, 10, 3)),
    ui_spin: preset(["btn_001", "btn_img_001"]),
    ui_btn_nu: preset(numberNames("btn_nu_", 0, 9, 3)),
    ui_common: preset(["info_001", ...numberNames("btn_", 2, 18, 3)]),
    info_nu: preset([...numberNames("info_nu_", 0, 9, 3), ...suffixNames("info_nu_", coreSigns()), ...suffixNames("info_nu_", currency)], { fontSeries: "score", number: "0" }),
    loading: preset([
      "pc_img_001.jpg",
      "pc_shadow.png",
      "loading_bar.png",
      "loading_bar_bg.png",
      "loading_btn_001.png",
      "loading_btn_002.png",
      "loading_btn_start.png",
      "loading_dot_001.png",
      "loading_icon.png",
      "loading_img_bg.jpg",
      "loading_carousel_frame.png"
    ], { extension: "" }),
    loading_lang: preset(["loading_img_001", "loading_carousel_img_001", "loading_carousel_img_002", "loading_carousel_img_003", "hyperspeed_text_logo_110XX"]),
    backend_symbol: preset(numberNames("", 0, 14, 0)),
    backend_bg_frame: preset(["0", "1", "2", "0x1", "0x2", "0x3", "1x1", "1x2", "1x3"]),
    backend_logo: preset(["110XX_en", "110XX_340x340_en", "110XX_1024x1024_en", "110XX_platform_en"]),
    hs_bg: preset(["hyperspeed_bg_001"]),
    hs_logo: preset(["hyperspeed_text_logo_110XX"], { fontSeries: "text" }),
    hs_text: preset(["hyperspeed_text_001"], { fontSeries: "text" }),
    hs_times: preset(["btn_hyperspeed_cancel", "times_bg", "btn_times_minus", "btn_times_plus", "times_text_spins"]),
    hs_times_nu: preset([...numberNames("times_nu_", 0, 9, 3), "times_nu_of"]),
    hs_free_stop: preset(["free_stop_text_bg", "btn_free_stop_on", "btn_free_stop_off"], { fontSeries: "text" }),
    hs_spin_buttons: preset(["btn_hyperspeed_001", "btn_hyperspeed_minus", "btn_hyperspeed_plus"]),
    hs_totalwin_text: preset(["hyperspeed_text_totalwin"], { fontSeries: "text" }),
    hs_totalwin_nu_a: preset(scoreNames("totalwin_nu_a_"), { fontSeries: "score", number: "0" }),
    hs_spin_bar: preset([
      "hyperspeed_spin_text_bar",
      ...numberNames("base_spin_nu_a_", 0, 9, 3),
      "base_spin_img_001",
      "base_spin_img_002",
      "btn_base_spin_replay",
      "base_spin_bg_01",
      "base_spin_bg_02"
    ], { fontSeries: "text" }),
    hs_base_nu_a: preset(scoreNames("base_nu_a_"), { fontSeries: "score", number: "0" }),
    hs_base_nu_b: preset(scoreNames("base_nu_b_"), { fontSeries: "score", number: "0" }),
    hs_fg_base: preset(["free_spin_bg_bar", "free_spin_bg", "free_window_bg", "free_spin_img_star", "free_spin_img_open"]),
    hs_fg_spin_nu_a: preset([...numberNames("free_spin_nu_a_", 0, 9, 3), "free_spin_nu_a_plus"]),
    hs_fg_free_nu_a: preset(scoreNames("free_nu_a_"), { fontSeries: "score", number: "0" }),
    hs_fg_free_nu_b: preset([...numberNames("free_nu_b_", 0, 9, 3), "free_nu_b_x"], { fontSeries: "multiplier", number: "0" }),
    hs_fg_spin_nu_b: preset(numberNames("free_spin_nu_b_", 0, 9, 3)),
    hs_fg_buttons: preset(["btn_free_text_continue", "btn_free_text_play_normally"], { fontSeries: "text" }),
    hs_autostart: preset(["autostart_text_autostart", "autostart_text_sec", ...numberNames("autostart_nu_", 0, 9, 3)], { fontSeries: "text" }),
    hs_balance: preset(["info_window_bg"]),
    hs_replay_base: preset(["replay_text_bg", "btn_hyperspeed_cancel", "replay_icon_frame", "replay_icon_mask", "110XX_en"], { fontSeries: "text" }),
    hs_replay_nu_a: preset(scoreNames("replay_nu_a_"), { fontSeries: "score", number: "0" }),
    hs_replay_nu_b: preset(scoreNames("replay_nu_b_"), { fontSeries: "score", number: "0" }),
    hs_replay_buttons: preset(["btn_replay_text_watch_again", "btn_replay_text_copy_link", "replay_text_replay"], { fontSeries: "text" }),
    hs_ui_common: preset(["btn_018"])
  };

  const hsLabel = {
    initial: "\u521d\u59cb\u756b\u9762",
    launch: "\u555f\u52d5\u9801\u9762",
    fg: "FG\u8a62\u554f\u8996\u7a97",
    balance: "\u9918\u984d\u4e0d\u8db3",
    replay: "\u56de\u653e\u9801\u9762",
    ui: "UI \u975c\u614b\u516c\u7248"
  };

  const hyperspeedSpecRows = [
    specRow("hs_bg", "spec-base", hsLabel.initial, "background", "\\assets\\resources\\hyperspeed\\image", "hyperspeed_bg_001.png", "background"),
    specRow("hs_logo", "spec-text", hsLabel.initial, "hyperspeed LOGO", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image", "hyperspeed_text_logo_(project).png", "language"),
    specRow("hs_text", "spec-text", hsLabel.initial, "text", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image", "hyperspeed_text_001.png", "language; text"),
    specRow("hs_times", "spec-base", hsLabel.initial, "times panel / buttons", "\\assets\\resources\\hyperspeed\\image", "btn_hyperspeed_cancel.png\ntimes_bg.png\nbtn_times_minus.png\nbtn_times_plus.png\ntimes_text_spins.png", "times panel"),
    specRow("hs_times_nu", "spec-font", hsLabel.initial, "times numbers", "\\assets\\resources\\hyperspeed\\font", "times_nu_000~009.png\ntimes_nu_of.png", "0~9"),
    specRow("hs_free_stop", "spec-text", hsLabel.initial, "FG stop", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image\n\\assets\\resources\\hyperspeed\\image", "free_stop_text_bg.png\nbtn_free_stop_on.png\nbtn_free_stop_off.png", "language bg; shared switch"),
    specRow("hs_spin_buttons", "spec-base", hsLabel.initial, "spin buttons", "\\assets\\resources\\hyperspeed\\image", "btn_hyperspeed_001.png\nbtn_hyperspeed_minus.png\nbtn_hyperspeed_plus.png", "spin"),
    specRow("hs_totalwin_text", "spec-text", hsLabel.launch, "total win title", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image", "hyperspeed_text_totalwin.png", "title"),
    specRow("hs_totalwin_nu_a", "spec-font", hsLabel.launch, "total win score", "\\assets\\resources\\hyperspeed\\font", "totalwin_nu_a_000~009.png\ntotalwin_nu_a_comma.png\ntotalwin_nu_a_dot.png\ntotalwin_nu_a_plus.png\ntotalwin_nu_a_minus.png\ntotalwin_nu_a_x.png\ntotalwin_nu_a_k.png\ntotalwin_nu_a_m.png", "currency"),
    specRow("hs_spin_bar", "spec-text", hsLabel.launch, "spin title bar", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image\n\\assets\\resources\\hyperspeed\\font\n\\assets\\resources\\hyperspeed\\image", "hyperspeed_spin_text_bar.png\nbase_spin_nu_a_000~009.png\nbase_spin_img_001.png\nbase_spin_img_002.png\nbtn_base_spin_replay.png\nbase_spin_bg_01.png\nbase_spin_bg_02.png", "spin bar"),
    specRow("hs_base_nu_a", "spec-font", hsLabel.launch, "spin score/multiplier 1", "\\assets\\resources\\hyperspeed\\font", "base_nu_a_000~009.png\nbase_nu_a_comma.png\nbase_nu_a_dot.png\nbase_nu_a_plus.png\nbase_nu_a_minus.png\nbase_nu_a_x.png\nbase_nu_a_k.png\nbase_nu_a_m.png", "currency"),
    specRow("hs_base_nu_b", "spec-font", hsLabel.launch, "spin score/multiplier 2", "\\assets\\resources\\hyperspeed\\font", "base_nu_b_000~009.png\nbase_nu_b_comma.png\nbase_nu_b_dot.png\nbase_nu_b_plus.png\nbase_nu_b_minus.png\nbase_nu_b_x.png\nbase_nu_b_k.png\nbase_nu_b_m.png", "big win color"),
    specRow("hs_fg_base", "spec-base", hsLabel.fg, "FG base", "\\assets\\resources\\hyperspeed\\image", "free_spin_bg_bar.png\nfree_spin_bg.png\nfree_window_bg.png\nfree_spin_img_star.png\nfree_spin_img_open.png", "FG base"),
    specRow("hs_fg_spin_nu_a", "spec-font", hsLabel.fg, "FG spin number 1", "\\assets\\resources\\hyperspeed\\font", "free_spin_nu_a_000~009.png\nfree_spin_nu_a_plus.png", "0~9 + plus"),
    specRow("hs_fg_free_nu_a", "spec-font", hsLabel.fg, "FG score number 1", "\\assets\\resources\\hyperspeed\\font", "free_nu_a_000~009.png\nfree_nu_a_comma.png\nfree_nu_a_dot.png\nfree_nu_a_plus.png\nfree_nu_a_minus.png\nfree_nu_a_x.png\nfree_nu_a_k.png\nfree_nu_a_m.png", "currency"),
    specRow("hs_fg_free_nu_b", "spec-font", hsLabel.fg, "FG multiplier number 2", "\\assets\\resources\\hyperspeed\\font", "free_nu_b_000~009.png\nfree_nu_b_x.png", "multiplier"),
    specRow("hs_fg_spin_nu_b", "spec-font", hsLabel.fg, "FG spin number 2", "\\assets\\resources\\hyperspeed\\font", "free_spin_nu_b_000~009.png", "spin count"),
    specRow("hs_fg_buttons", "spec-text", hsLabel.fg, "FG buttons", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image", "btn_free_text_continue.png\nbtn_free_text_play_normally.png", "language"),
    specRow("hs_autostart", "spec-text", hsLabel.fg, "FG autostart", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image\n\\assets\\resources\\hyperspeed\\font", "autostart_text_autostart.png\nautostart_text_sec.png\nautostart_nu_000~009.png", "autostart"),
    specRow("hs_balance", "spec-base", hsLabel.balance, "window background", "\\assets\\resources\\hyperspeed\\image", "info_window_bg.png", "system text"),
    specRow("hs_replay_base", "spec-text", hsLabel.replay, "replay base / icon", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image\n\\assets\\resources\\hyperspeed\\image\n\\Common", "replay_text_bg.png\nbtn_hyperspeed_cancel.png\nreplay_icon_frame.png\nreplay_icon_mask.png\n110XX_en.png", "project language icon"),
    specRow("hs_replay_nu_a", "spec-font", hsLabel.replay, "replay score number 1", "\\assets\\resources\\hyperspeed\\font", "replay_nu_a_000~009.png\nreplay_nu_a_comma.png\nreplay_nu_a_dot.png\nreplay_nu_a_plus.png\nreplay_nu_a_minus.png\nreplay_nu_a_x.png\nreplay_nu_a_k.png\nreplay_nu_a_m.png", "currency"),
    specRow("hs_replay_nu_b", "spec-font", hsLabel.replay, "replay score number 2", "\\assets\\resources\\hyperspeed\\font", "replay_nu_b_000~009.png\nreplay_nu_b_comma.png\nreplay_nu_b_dot.png\nreplay_nu_b_plus.png\nreplay_nu_b_minus.png\nreplay_nu_b_x.png\nreplay_nu_b_k.png\nreplay_nu_b_m.png", "currency"),
    specRow("hs_replay_buttons", "spec-text", hsLabel.replay, "replay buttons / text", "\\assets\\resources\\hyperspeed\\language\\(lang)\\image\n\\Common", "btn_replay_text_watch_again.png\nbtn_replay_text_copy_link.png\nreplay_text_replay.png", "watch again / copy link"),
    specRow("hs_ui_common", "spec-base", hsLabel.ui, "control panel / info / common button", "\\assets\\resources\\basegame\\image\\ui", "btn_018.png", "hyperspeed")
  ];

  const globalNameItems = buildGlobalNameItems();
  const globalPrefixItems = buildGlobalPrefixItems();

  const els = {
    form: document.getElementById("nameForm"),
    functionName: document.getElementById("functionInput"),
    prefix: document.getElementById("prefixInput"),
    prefixList: document.getElementById("prefixList"),
    type: document.getElementById("typeInput"),
    name: document.getElementById("nameInput"),
    namePrefixList: document.getElementById("namePrefixList"),
    font: document.getElementById("fontInput"),
    state: document.getElementById("stateInput"),
    number: document.getElementById("numberInput"),
    version: document.getElementById("versionInput"),
    extension: document.getElementById("extensionInput"),
    caseMode: document.getElementById("caseInput"),
    separator: document.getElementById("separatorInput"),
    pattern: document.getElementById("patternInput"),
    pad: document.getElementById("padInput"),
    ascii: document.getElementById("asciiInput"),
    date: document.getElementById("dateInput"),
    batch: document.getElementById("batchInput"),
    results: document.getElementById("resultList"),
    resultCount: document.getElementById("resultCount"),
    history: document.getElementById("historyList"),
    status: document.getElementById("statusText"),
    copyAll: document.getElementById("copyAllBtn"),
    copyResults: document.getElementById("copyResultsBtn"),
    export: document.getElementById("exportBtn"),
    clear: document.getElementById("clearBtn"),
    clearHistory: document.getElementById("clearHistoryBtn"),
    sample: document.getElementById("sampleBtn"),
    template: document.getElementById("resultRowTemplate"),
    specTitle: document.querySelector(".spec-panel .section-head span")
  };

  let currentResults = [];
  let history = loadHistory();
  let activePresetKey = "symbol_image";
  let applyingTemplate = false;
  let presetMode = true;
  let currentSpecMode = "slot";
  let currentFilterGroup = "all";
  let currentFeature = "hyperspeed";

  init();

  function init() {
    renderHyperspeedSpecRows();

    els.form.addEventListener("submit", onSubmit);
    els.copyAll.addEventListener("click", copyAllResults);
    els.copyResults.addEventListener("click", copyAllResults);
    els.export.addEventListener("click", exportResults);
    els.clear.addEventListener("click", clearResults);
    els.clearHistory.addEventListener("click", clearHistory);
    els.sample.addEventListener("click", () => applyPreset("symbol_image"));
    els.functionName.addEventListener("change", syncFunctionTone);
    els.name.addEventListener("change", applyNamePrefixFromName);
    els.font.addEventListener("change", applyFontSeries);
    els.font.addEventListener("change", syncFontTone);
    els.number.addEventListener("change", syncNumberTone);
    els.state.addEventListener("input", syncFontSeriesCount);
    els.state.addEventListener("change", syncFontSeriesCount);
    [els.functionName, els.prefix, els.type, els.name, els.font, els.state, els.number, els.version, els.extension, els.caseMode, els.separator, els.pattern, els.pad, els.ascii, els.date].forEach((input) => {
      input.addEventListener("input", switchToParameterMode);
      input.addEventListener("change", switchToParameterMode);
    });
    document.querySelectorAll("[data-preset]").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.preset));
    });
    document.querySelectorAll("[data-spec-mode]").forEach((button) => {
      button.addEventListener("click", () => applySpecMode(button.dataset.specMode));
    });
    document.querySelector(".slot-tabs")?.addEventListener("click", onToolbarClick);

    ["input", "change"].forEach((eventName) => {
      els.form.addEventListener(eventName, (event) => {
        currentResults = generateNames();
        renderResults();
      });
    });

    populatePrefixOptions();
    populateNamePrefixOptions();
    applyPreset("symbol_image", false);
    applySpecMode("slot", false);
    renderHistory();
  }

  function specRow(key, tone, module, description, path, names, note) {
    return { key, tone, module, description, path, names, note };
  }

  function renderHyperspeedSpecRows() {
    const table = document.querySelector(".spec-table");

    if (!table || table.querySelector('[data-preset="hs_bg"]')) {
      return;
    }

    hyperspeedSpecRows.forEach((row) => {
      const button = document.createElement("button");
      button.className = `spec-row ${row.tone}`;
      button.type = "button";
      button.dataset.preset = row.key;
      button.setAttribute("role", "row");

      appendSpecCell(button, row.module);
      appendSpecCell(button, row.description);
      appendSpecCell(button, row.path);
      appendSpecCell(button, row.names);
      appendSpecCell(button, row.note);

      table.appendChild(button);
    });
  }

  function appendSpecCell(row, value) {
    const cell = document.createElement("span");
    cell.setAttribute("role", "cell");

    String(value || "").split("\n").forEach((line, index) => {
      if (index > 0) {
        cell.appendChild(document.createElement("br"));
      }

      cell.appendChild(document.createTextNode(line));
    });

    row.appendChild(cell);
  }

  function preset(batch, options = {}) {
    return {
      prefix: "",
      functionName: options.functionName || "",
      type: "",
      state: "",
      number: options.number == null ? "" : String(options.number),
      version: "",
      extension: options.extension == null ? ".png" : options.extension,
      fontSeries: options.fontSeries || "",
      pattern: options.pattern || "{name}{ext}",
      batch,
      exact: options.exact !== false
    };
  }

  function coreSigns() {
    return ["comma", "dot", "plus", "minus", "x", "k", "m"];
  }

  function numberNames(prefix, start, end, pad) {
    const items = [];

    numberSuffixes(start, end, pad).forEach((numberText) => {
      items.push(`${prefix}${numberText}`);
    });

    return items;
  }

  function numberSuffixes(start, end, pad) {
    const items = [];

    for (let value = start; value <= end; value += 1) {
      items.push(pad > 0 ? String(value).padStart(pad, "0") : String(value));
    }

    return items;
  }

  function suffixNames(prefix, suffixes) {
    return suffixes.map((suffix) => `${prefix}${suffix}`);
  }

  function scoreNames(prefix) {
    return [
      ...numberNames(prefix, 0, 9, 3),
      ...suffixNames(prefix, coreSigns()),
      ...suffixNames(prefix, currency)
    ];
  }

  function onSubmit(event) {
    event.preventDefault();
    currentResults = generateNames();
    renderResults();
    addHistory(currentResults);
    flashStatus(`Generated ${currentResults.length} names`, true);
  }

  function onToolbarClick(event) {
    const featureButton = event.target.closest("[data-feature]");
    const filterButton = event.target.closest("[data-filter-group]");

    if (featureButton) {
      applyFeature(featureButton.dataset.feature);
      return;
    }

    if (filterButton) {
      applyCategory(filterButton.dataset.filterGroup);
    }
  }

  function applyPreset(key, announce = true) {
    const selected = presets[key] || presets.symbol_image;
    const firstPrefix = extractNamePrefix(selected.batch[0] || "") || selected.batch[0] || "";
    const firstGroup = selected.batch.filter((name) => extractNamePrefix(name) === firstPrefix);
    const groupNames = firstGroup.length ? firstGroup : selected.batch;
    const serialItems = countSerialItems(groupNames);
    const serialCount = serialItems || groupNames.length || 1;
    const serialStart = findSerialStart(groupNames);
    const parts = splitPrefixParts(firstPrefix);

    applyingTemplate = true;
    activePresetKey = presets[key] ? key : "symbol_image";
    exactMode = false;
    presetMode = true;
    setActivePreset(key);
    els.functionName.value = getPresetFunction(selected, firstPrefix);
    els.prefix.value = parts.prefix || selected.prefix;
    els.type.value = parts.type || selected.type;
    els.font.value = getPresetFontSeries(selected);
    els.state.value = selected.state || parts.state;
    els.number.value = getPresetNumber(selected, serialItems, serialStart);
    els.version.value = selected.version;
    els.extension.value = selected.extension;
    els.pattern.value = defaultPattern;
    els.batch.value = String(Math.max(serialCount, 1));
    els.name.value = getDisplayName(parts.name || (els.font.value ? "" : (parts.functionName ? "" : extractNamePrefix(selected.batch[0] || "") || selected.batch[0] || "")), els.font.value);
    els.caseMode.value = "lower";
    els.separator.value = "_";
    els.pad.checked = shouldPadSerial(groupNames);
    els.ascii.checked = !selected.batch.some((name) => /[^\x00-\x7f]/.test(name));
    els.date.checked = false;
    syncFontSeriesCount();
    syncFontTone();
    syncFunctionTone();
    syncNumberTone();
    applyingTemplate = false;

    currentResults = generateNames();
    renderResults();

    if (announce) {
      flashStatus(`Loaded ${key}`, true);
    }
  }

  function populateNamePrefixOptions() {
    els.namePrefixList.replaceChildren();

    globalNameItems.forEach((item) => {
      els.namePrefixList.appendChild(makeOption(item.name, item.name));
    });
  }

  function populatePrefixOptions() {
    els.prefixList.replaceChildren();

    globalPrefixItems.forEach((item) => {
      els.prefixList.appendChild(makeOption(item.prefix, item.prefix));
    });
  }

  function makeOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function applyNamePrefixFromName() {
    const selectedName = els.name.value.trim();

    if (!findPresetKeyByName(selectedName)) {
      return;
    }

    const ownerKey = selectedName ? findPresetKeyByName(selectedName) : activePresetKey;
    const selected = presets[ownerKey] || presets.symbol_image;
    const filtered = selectedName ? selected.batch.filter((name) => splitPrefixParts(extractNamePrefix(name)).name === selectedName) : selected.batch;
    const nextNames = filtered.length ? filtered : selected.batch;
    const firstPrefix = extractNamePrefix(nextNames[0] || "") || nextNames[0] || selectedName;
    const parts = splitPrefixParts(firstPrefix);
    const serialStart = findSerialStart(nextNames);
    const serialItems = countSerialItems(nextNames);
    const serialCount = serialItems || nextNames.length || 1;

    applyingTemplate = true;
    activePresetKey = ownerKey;
    exactMode = false;
    presetMode = false;
    setActivePreset(ownerKey);
    els.extension.value = selected.extension;
    els.pattern.value = defaultPattern;
    els.functionName.value = getPresetFunction(selected, firstPrefix);
    els.prefix.value = parts.prefix;
    els.type.value = parts.type;
    els.font.value = getPresetFontSeries(selected);
    els.name.value = getDisplayName(parts.name, els.font.value);
    els.state.value = selected.state || parts.state;
    els.number.value = getPresetNumber(selected, serialItems, serialStart);
    els.batch.value = String(Math.max(serialCount, 1));
    els.pad.checked = shouldPadSerial(nextNames);
    syncFontSeriesCount();
    syncFontTone();
    syncFunctionTone();
    syncNumberTone();
    applyingTemplate = false;
    currentResults = generateNames();
    renderResults();
    flashStatus(selectedName ? `Filtered ${selectedName}` : "Showing all", true);
  }

  function applyFontSeries() {
    if (!els.font.value) {
      syncFontTone();
      return;
    }

    if (els.font.value === "text") {
      if (els.name.value.trim().toLowerCase() === "text") {
        els.name.value = "";
      }
      syncFontTone();
      return;
    }

    if (els.name.value.trim().toLowerCase() === "nu") {
      els.name.value = "";
    }

    if (!/\{num\}/i.test(els.pattern.value)) {
      els.pattern.value = defaultPattern;
    }

    els.number.value = "0";

    if (els.font.value === "score") {
      els.ascii.checked = false;
    }

    syncFontSeriesCount();
    syncFontTone();
  }

  function syncFontSeriesCount() {
    const suffixes = getFontSuffixes(els.font.value);

    if (!suffixes.length) {
      return;
    }

    const states = expandStateValues(els.state.value);
    els.batch.value = String(Math.max(states.length, 1) * suffixes.length);
  }

  function switchToParameterMode(event) {
    if (applyingTemplate) {
      return;
    }

    exactMode = false;
    presetMode = false;
  }

  function splitPrefixParts(prefix) {
    const parts = String(prefix || "").split("_").filter(Boolean);
    let functionName = "";

    if (parts[0] === "btn") {
      functionName = parts.shift();
    }

    const fontIndex = parts.findIndex(isFontNamePart);

    if (fontIndex >= 0) {
      const beforeFont = parts.slice(0, fontIndex);
      const afterFont = parts.slice(fontIndex + 1);
      const fontPart = parts[fontIndex];
      const prefixPart = beforeFont[0] || "";
      const typePart = beforeFont.slice(1).join("_");
      let name = "";
      let state = "";

      if (fontPart === "text") {
        name = afterFont.length ? afterFont[afterFont.length - 1] : "";
        state = afterFont.length > 1 ? afterFont.slice(0, -1).join("_") : "";
      } else if (afterFont.length === 1 && /^[a-z]+$/i.test(afterFont[0]) && !coreSigns().includes(afterFont[0].toLowerCase())) {
        state = afterFont[0];
      } else if (afterFont.length > 1) {
        state = /^[a-z]+$/i.test(afterFont[0]) ? afterFont[0] : "";
        name = state ? afterFont.slice(1).join("_") : afterFont.join("_");
      } else {
        name = afterFont[0] || "";
      }

      return { functionName, prefix: prefixPart, type: typePart, name, state };
    }

    if (parts.length >= 4) {
      return { functionName, prefix: parts[0], type: parts[1], name: parts[2], state: parts.slice(3).join("_") };
    }

    if (parts.length === 3) {
      if (parts[1] === "text" || parts[1] === "nu") {
        return { functionName, prefix: parts[0], type: "", name: parts[1], state: parts[2] };
      }

      return { functionName, prefix: parts[0], type: parts[1], name: parts[2], state: "" };
    }

    if (parts.length === 2) {
      return { functionName, prefix: parts[0], type: "", name: parts[1], state: "" };
    }

    if (functionName && /^\d+$/.test(parts[0] || "")) {
      return { functionName, prefix: "", type: "", name: "", state: "" };
    }

    if (functionName && !parts.length) {
      return { functionName, prefix: "", type: "", name: "", state: "" };
    }

    return { functionName, prefix: "", type: "", name: parts[0] || prefix, state: "" };
  }

  function isFontNamePart(part) {
    const text = String(part || "").toLowerCase();
    return text === "text" || text === "nu";
  }

  function findSerialStart(names) {
    const found = names.map(extractSerialNumber).find((number) => number != null);
    return found == null ? 1 : found;
  }

  function countSerialItems(names) {
    return names.filter((name) => extractSerialNumber(name) != null).length;
  }

  function shouldPadSerial(names) {
    return names.some((name) => {
      const baseName = String(name || "").replace(/\.[^.]+$/, "");
      const match = baseName.match(/(?:^|_)(\d+)$/);
      return !!match && match[1].length > 1 && match[1].startsWith("0");
    });
  }

  function extractSerialNumber(name) {
    const baseName = String(name || "").replace(/\.[^.]+$/, "");

    if (/^\d+$/.test(baseName)) {
      return Number.parseInt(baseName, 10);
    }

    const match = baseName.match(/_(\d+)$/);
    return match ? Number.parseInt(match[1], 10) : null;
  }

  function buildGlobalNameItems() {
    const items = [];
    const seen = new Set();

    Object.entries(presets).forEach(([key, selected]) => {
      selected.batch.forEach((name) => {
        const prefix = extractNamePrefix(name);
        const itemName = splitPrefixParts(prefix).name;

        if (!isUsefulNameOption(itemName) || seen.has(itemName)) {
          return;
        }

        seen.add(itemName);
        items.push({ name: itemName, key });
      });
    });

    return items;
  }

  function buildGlobalPrefixItems() {
    const items = [];
    const seen = new Set();

    Object.values(presets).forEach((selected) => {
      selected.batch.forEach((name) => {
        const prefix = splitPrefixParts(extractNamePrefix(name)).prefix;

        if (!isUsefulPrefixOption(prefix) || seen.has(prefix)) {
          return;
        }

        seen.add(prefix);
        items.push({ prefix });
      });
    });

    return items;
  }

  function findPresetKeyByName(name) {
    const found = globalNameItems.find((item) => item.name === name);
    return found ? found.key : "";
  }

  function isUsefulNameOption(name) {
    const text = String(name || "").trim();
    const skipped = new Set(["text", "nu", ...coreSigns(), ...currency]);

    return !!text && !text.includes("_") && !/^\d+$/.test(text) && !skipped.has(text);
  }

  function isUsefulPrefixOption(prefix) {
    const text = String(prefix || "").trim();
    return !!text && !text.includes("_") && !/^\d+$/.test(text);
  }

  function extractNamePrefix(name) {
    const baseName = String(name || "").replace(/\.[^.]+$/, "");

    if (!baseName) {
      return "";
    }

    if (/^\d+$/.test(baseName)) {
      return baseName;
    }

    const rangeMatch = baseName.match(/^(.*?)(?:_?\d+|_?x)$/i);

    if (rangeMatch && rangeMatch[1]) {
      return rangeMatch[1].replace(/_$/, "");
    }

    return baseName;
  }

  function setActivePreset(key) {
    syncSpecModeForPreset(key);

    document.querySelectorAll("[data-preset]").forEach((button) => {
      button.classList.toggle("active", button.dataset.preset === key);
    });
  }

  function getPresetMode(key) {
    return String(presetGroups[key] || "").startsWith("hs_") ? "function" : "slot";
  }

  function applySpecMode(mode, loadFirst = true) {
    currentSpecMode = mode || "slot";
    currentFilterGroup = "all";
    currentFeature = currentSpecMode === "function" ? "hyperspeed" : "slot110xx";
    syncSpecModeUi();
    setFeatureActive(currentFeature);
    applyCategory("all", loadFirst);
  }

  function applyFeature(feature, loadFirst = true) {
    currentFeature = feature || "hyperspeed";
    setFeatureActive(currentFeature);
    applyCategory("all", loadFirst);
  }

  function syncSpecModeForPreset(key) {
    const nextMode = getPresetMode(key);

    if (nextMode !== currentSpecMode) {
      currentSpecMode = nextMode;
      syncSpecModeUi();
    }
  }

  function syncSpecModeUi() {
    const tabRoot = document.querySelector(".slot-tabs");

    if (tabRoot) {
      tabRoot.dataset.activeMode = currentSpecMode;
    }

    document.querySelectorAll("[data-spec-mode]").forEach((button) => {
      const active = button.dataset.specMode === currentSpecMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });


    if (els.specTitle) {
      els.specTitle.textContent = currentSpecMode === "function" ? "TCL-\u8d85\u901f\u6a21\u5f0f-\u975c\u614b\u6e05\u55ae" : "TCL-110XX static template";
    }
  }

  function setFeatureActive(feature) {
    document.querySelectorAll("[data-feature]").forEach((button) => {
      button.classList.toggle("active", button.dataset.feature === feature);
    });
  }

  function applyCategory(group, loadFirst = true) {
    const targetGroup = group || "all";
    currentFilterGroup = targetGroup;

    document.querySelectorAll("[data-filter-group]").forEach((button) => {
      button.classList.toggle("active", button.dataset.filterGroup === targetGroup);
    });

    filterSpecRows(targetGroup);

    if (!loadFirst) {
      return;
    }

    const firstPreset = Object.keys(presetGroups).find((key) => {
      const groupMatches = targetGroup === "all" || presetGroups[key] === targetGroup;
      return getPresetMode(key) === currentSpecMode && groupMatches;
    });

    if (firstPreset) {
      applyPreset(firstPreset);
      filterSpecRows(targetGroup);
    }
  }

  function filterSpecRows(group) {
    const showAll = !group || group === "all";

    document.querySelectorAll(".spec-table .spec-row[data-preset]").forEach((row) => {
      const key = row.dataset.preset;
      const rowGroup = presetGroups[key] || "";
      const rowMode = getPresetMode(key);
      const modeMatches = rowMode === currentSpecMode;
      const groupMatches = showAll || rowGroup === group;
      row.classList.toggle("is-filtered-out", !(modeMatches && groupMatches));
    });

    const table = document.querySelector(".spec-table");

    if (table) {
      table.scrollTop = 0;
    }
  }

  function getFontSuffixes(key) {
    return fontSeries[key] || [];
  }

  function getPresetFontSeries(selected) {
    if (selected.fontSeries) {
      return selected.fontSeries;
    }

    return selected.batch.some((name) => /(^|_)text(_|$)/i.test(name)) ? "text" : "";
  }

  function getPresetFunction(selected, prefix) {
    if (selected.functionName) {
      return selected.functionName;
    }

    return splitPrefixParts(prefix).functionName;
  }

  function getPresetNumber(selected, serialItems, serialStart) {
    if (selected.number !== "") {
      return selected.number;
    }

    if (selected.fontSeries === "multiplier" || selected.fontSeries === "score") {
      return "0";
    }

    return serialItems > 0 ? String(serialStart) : "none";
  }

  function getDisplayName(name, series) {
    const text = String(name || "").trim();
    const defaultName = getFontDefaultName(series);

    if (/^\d+$/.test(text)) {
      return "";
    }

    return defaultName && text.toLowerCase() === defaultName ? "" : text;
  }

  function getFontDefaultName(series) {
    if (series === "text") {
      return "text";
    }

    if (series === "multiplier" || series === "score") {
      return "nu";
    }

    return "";
  }

  function syncFontTone() {
    els.font.classList.toggle("font-tone-none", !els.font.value);
    els.font.classList.toggle("font-tone-nu", els.font.value === "multiplier" || els.font.value === "score");
    els.font.classList.toggle("font-tone-text", els.font.value === "text");
  }

  function syncFunctionTone() {
    els.functionName.classList.toggle("function-tone-none", !els.functionName.value);
  }

  function syncNumberTone() {
    els.number.classList.toggle("number-tone-none", els.number.value === "none");
  }

  function expandStateValues(value) {
    const text = String(value || "").trim();

    if (!text) {
      return [""];
    }

    if (/^\d+$/.test(text)) {
      const count = Number.parseInt(text, 10);

      if (count > 0) {
        return Array.from({ length: count }, (_, index) => stateLabel(index));
      }
    }

    return [text];
  }

  function stateLabel(index) {
    let value = index;
    let label = "";

    do {
      label = String.fromCharCode(97 + (value % 26)) + label;
      value = Math.floor(value / 26) - 1;
    } while (value >= 0);

    return label;
  }

  function generateNames() {
    const config = readConfig();

    if (presetMode) {
      return getPresetResults(config);
    }

    const count = Math.max(config.batchCount, 1);
    const states = expandStateValues(config.state);
    const suffixes = getFontSuffixes(config.fontSeries);

    if (suffixes.length) {
      return unique(states.flatMap((state) => suffixes.map((suffix, index) => {
        const tokenMap = makeTokenMap(config, config.name, index, state, suffix);
        return compilePattern(config.pattern, tokenMap, config);
      })).filter(Boolean));
    }

    return unique(states.flatMap((state) => Array.from({ length: count }, (_, index) => {
      const tokenMap = makeTokenMap(config, config.name, index, state);
      return compilePattern(config.pattern, tokenMap, config);
    })).filter(Boolean));
  }

  function getPresetResults(config) {
    const selected = presets[activePresetKey];

    if (!selected) {
      return [];
    }

    return unique(selected.batch.map((name) => withPresetExtension(name, config.extension)).filter(Boolean));
  }

  function withPresetExtension(name, extension) {
    const text = String(name || "").trim();

    if (!text) {
      return "";
    }

    if (/\.[^.]+$/.test(text)) {
      return text;
    }

    return text + (extension || "");
  }

  function readConfig() {
    const startNumber = Number.parseInt(els.number.value, 10);
    const numberDisabled = els.number.value === "none";

    return {
      prefix: els.prefix.value,
      functionName: els.functionName.value,
      type: els.type.value,
      name: els.name.value,
      fontSeries: els.font.value,
      state: els.state.value,
      number: numberDisabled ? 0 : (Number.isFinite(startNumber) ? startNumber : 1),
      numberDisabled,
      version: els.version.value,
      extension: els.extension.value,
      caseMode: els.caseMode.value,
      separator: els.separator.value,
      pattern: els.pattern.value || "{name}{ext}",
      padNumber: els.pad.checked,
      asciiOnly: els.font.value === "score" ? false : els.ascii.checked,
      includeDate: els.date.checked,
      exact: exactMode,
      batchCount: Number.parseInt(els.batch.value, 10) || 1
    };
  }

  function makeTokenMap(config, rawName, index, stateOverride, numberOverride) {
    const number = config.number + index;
    const numberText = config.numberDisabled ? "" : (numberOverride == null ? (config.padNumber ? String(number).padStart(3, "0") : String(number)) : numberOverride);
    const dateText = config.includeDate ? makeDateText() : "";
    const effectiveName = rawName || config.name || "";
    const fontPatternValue = getFontPatternValue(config.fontSeries);

    return {
      prefix: config.prefix,
      func: config.functionName,
      function: config.functionName,
      type: config.type,
      name: effectiveName,
      font: fontPatternValue,
      fontSeries: config.fontSeries,
      state: stateOverride == null ? config.state : stateOverride,
      num: numberText,
      number: numberText,
      version: config.version,
      date: dateText,
      ext: config.extension
    };
  }

  function getFontPatternValue(series) {
    return getFontDefaultName(series) || series || "";
  }

  function compilePattern(pattern, tokenMap, config) {
    let usedExtensionToken = false;
    const usedDateToken = /\{date\}/i.test(pattern);
    const raw = pattern.replace(/\{([a-zA-Z]+)\}/g, (match, key) => {
      if (key === "ext") {
        usedExtensionToken = true;
      }

      return tokenMap[key] == null ? "" : tokenMap[key];
    });

    if (config.exact) {
      const cleanedRaw = cleanupGeneratedName(raw, tokenMap.ext);
      const datedRaw = config.includeDate && !usedDateToken ? addDateBeforeExtension(cleanedRaw, tokenMap.date) : cleanedRaw;
      return usedExtensionToken ? datedRaw : datedRaw + config.extension;
    }

    const extension = tokenMap.ext || "";
    const ext = usedExtensionToken && extension && raw.endsWith(extension) ? extension : "";
    const body = cleanupName(ext ? raw.slice(0, -ext.length) : raw);
    const datedBody = config.includeDate && !usedDateToken ? `${body}_${tokenMap.date}` : body;
    const formatted = formatBody(datedBody, config);

    return formatted ? formatted + (usedExtensionToken ? ext : extension) : "";
  }

  function cleanupName(value) {
    return String(value || "")
      .replace(/_{2,}/g, "_")
      .replace(/-{2,}/g, "-")
      .replace(/\.{2,}/g, ".")
      .replace(/_+\./g, ".")
      .replace(/(^[_\-.]+|[_\-.]+$)/g, "");
  }

  function cleanupGeneratedName(value, extension) {
    if (extension && value.endsWith(extension)) {
      return cleanupName(value.slice(0, -extension.length)) + extension;
    }

    return cleanupName(value);
  }

  function addDateBeforeExtension(value, dateText) {
    const dot = value.lastIndexOf(".");

    if (dot <= 0) {
      return `${value}_${dateText}`;
    }

    return `${value.slice(0, dot)}_${dateText}${value.slice(dot)}`;
  }

  function formatBody(input, config) {
    const words = toWords(input, config.asciiOnly);

    if (!words.length) {
      return "";
    }

    if (config.caseMode === "camel") {
      return words.map((word, index) => index === 0 ? lowerWord(word) : titleWord(word)).join("");
    }

    if (config.caseMode === "pascal") {
      return words.map(titleWord).join("");
    }

    if (config.caseMode === "upper") {
      return words.map((word) => word.toUpperCase()).join(config.separator);
    }

    if (config.caseMode === "original") {
      return words.join(config.separator);
    }

    return words.map(lowerWord).join(config.separator);
  }

  function toWords(input, asciiOnly) {
    const normalized = String(input || "")
      .normalize("NFKC")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[._\-/\\]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!normalized) {
      return [];
    }

    const allowed = asciiOnly ? /[^a-zA-Z0-9]+/g : /[^\p{L}\p{N}$\u00a5\u20a9\u20ab\u0e3f\u09f3\u20ba\u20ac\u20bd]+/gu;

    return normalized
      .split(" ")
      .flatMap((part) => part.replace(allowed, " ").split(" "))
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function lowerWord(word) {
    return word.toLowerCase();
  }

  function titleWord(word) {
    const lower = lowerWord(word);
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  function unique(items) {
    return Array.from(new Set(items));
  }

  function makeDateText() {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  }

  function renderResults() {
    els.results.replaceChildren();
    els.resultCount.textContent = String(currentResults.length);

    if (!currentResults.length) {
      els.results.appendChild(makeEmpty("No names"));
      return;
    }

    currentResults.forEach((name) => {
      const row = els.template.content.firstElementChild.cloneNode(true);
      row.querySelector("code").textContent = name;
      row.querySelector("button").addEventListener("click", () => copyText(name));
      els.results.appendChild(row);
    });
  }

  function renderHistory() {
    els.history.replaceChildren();

    if (!history.length) {
      els.history.appendChild(makeEmpty("No history"));
      return;
    }

    history.forEach((name) => {
      const button = document.createElement("button");
      button.className = "history-item";
      button.type = "button";
      button.textContent = name;
      button.addEventListener("click", () => copyText(name));
      els.history.appendChild(button);
    });
  }

  function makeEmpty(text) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = text;
    return empty;
  }

  function addHistory(items) {
    if (!items.length) {
      return;
    }

    history = unique([...items, ...history]).slice(0, maxHistory);
    localStorage.setItem(historyKey, JSON.stringify(history));
    renderHistory();
  }

  function loadHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(historyKey) || "[]");
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch (error) {
      return [];
    }
  }

  function clearHistory() {
    history = [];
    localStorage.removeItem(historyKey);
    renderHistory();
    flashStatus("History cleared");
  }

  function clearResults() {
    currentResults = [];
    renderResults();
    flashStatus("Results cleared");
  }

  function copyAllResults() {
    if (!currentResults.length) {
      flashStatus("No results to copy");
      return;
    }

    copyText(currentResults.join("\n"), `Copied ${currentResults.length} names`);
  }

  function exportResults() {
    if (!currentResults.length) {
      flashStatus("No results to export");
      return;
    }

    const blob = new Blob([currentResults.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `names_${makeDateText()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    flashStatus("Exported txt", true);
  }

  function copyText(text, message) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => flashStatus(message || "Copied", true))
        .catch(() => fallbackCopy(text, message));
      return;
    }

    fallbackCopy(text, message);
  }

  function fallbackCopy(text, message) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-999px";
    document.body.appendChild(area);
    area.select();

    try {
      document.execCommand("copy");
      flashStatus(message || "Copied", true);
    } catch (error) {
      flashStatus("Copy failed");
    } finally {
      area.remove();
    }
  }

  function flashStatus(text, good) {
    els.status.textContent = text;
    els.status.classList.toggle("toast", Boolean(good));
    window.clearTimeout(flashStatus.timer);
    flashStatus.timer = window.setTimeout(() => {
      els.status.textContent = currentResults.length ? `${currentResults.length} names ready` : "READY";
      els.status.classList.remove("toast");
    }, 1600);
  }
})();
