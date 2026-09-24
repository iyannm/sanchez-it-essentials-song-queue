// School-safe content filter.
// A word ending in "*" matches anything that starts with it (e.g. "kill*" matches "killing").
(function () {
  const LISTS = {
    profanity: [
      "fuck*", "fck*", "fuk*", "fcuk*", "phuck*", "shit*", "sh1t*", "bitch*", "biatch*", "bastard*",
      "damn*", "goddamn*", "dammit", "dick", "dicks", "dickhead*", "pussy", "pussies", "cock", "cocks",
      "cunt*", "whore*", "slut*", "hoe", "hoes", "thot*", "nigga*", "nigger*", "ass", "asses",
      "asshole*", "badass*", "jackass*", "dumbass*", "motherf*", "mf", "piss*", "hell", "wap",
      "sex", "sexy", "sexual*", "naked", "nude*", "stripper*", "twerk*", "booty", "horny", "porn*",
      "bj", "milf*", "boobs", "tits", "titties", "retard*", "fag*",
    ],
    drugs: [
      "drug*", "weed", "marijuana", "cannabis", "kush", "blunt*", "cocaine", "coke", "meth",
      "heroin", "xan", "xans", "xanax", "percocet*", "perc", "percs", "molly", "codeine",
      "oxy", "oxycontin", "opioid*", "fentanyl", "stoned", "dope", "pill", "pills", "ecstasy",
      "sippin lean", "purple drank", "sizzurp", "dirty sprite",
      "lsd", "shrooms", "420", "high af", "drunk*", "alcohol*", "whiskey", "vodka", "tequila",
      "liquor", "beer*", "wine", "gin", "rum", "champagne", "hennessy", "henny", "bong*", "vape*",
      "trap house", "overdose*",
    ],
    violence: [
      "kill*", "murder*", "gun", "guns", "gunshot*", "shootout*", "shooter*", "shoot him", "shoot you",
      "shoot em", "shot him", "shot her", "shot you",
      "glock*", "pistol*", "rifle*", "ak-47", "ak47", "draco", "bullet*", "stab", "stabbed", "stabbing",
      "suicide*",
      "homicide*", "slaughter*", "shank*", "choppa*", "opps",
      "body bag*", "bodies",
    ],
    // Songs whose titles look harmless but whose lyrics are about violence, drugs, or alcohol.
    knownSongs: [
      "pumped up kicks", "i took a pill in ibiza", "the next episode", "can.t feel my face",
      "because i got high", "white lines", "hotel room service", "tipsy", "shots", "blurred lines",
      "stan", "gangsta.s paradise", "smells like teen spirit", "bad things", "animals", "pills n potions",
      "no role modelz", "rockstar", "psycho", "mask off", "xo tour llif3", "lucid dreams",
    ],
  };

  function toRegex(word) {
    const esc = word.replace(/[.*+?^${}()|[\]\\]/g, (c) => (c === "*" ? c : "\\" + c));
    const body = esc.endsWith("*") ? esc.slice(0, -1) + "[a-z]*" : esc;
    return new RegExp("(^|[^a-z0-9])" + body.replace(/ /g, "\\s+") + "(?=$|[^a-z0-9])", "i");
  }

  const COMPILED = Object.fromEntries(
    Object.entries(LISTS).filter(([k]) => k !== "knownSongs").map(([k, words]) => [k, words.map((w) => ({ w, re: toRegex(w) }))])
  );

  // Undo common tricks like "sh!t", "f*ck", "k1ll".
  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .normalize("NFKD").replace(/[̀-ͯ]/g, "")
      .replace(/(\w)[*#]+(\w)/g, "$1u$2") // f*ck -> fuck, sh*t -> shut (harmless miss)
      .replace(/@/g, "a").replace(/\$/g, "s").replace(/!/g, "i")
      .replace(/(?<=[a-z])0|0(?=[a-z])/g, "o")
      .replace(/(?<=[a-z])1|1(?=[a-z])/g, "i")
      .replace(/(?<=[a-z])3|3(?=[a-z])/g, "e");
  }

  function scan(text, categories) {
    const t = normalize(text);
    const hits = [];
    for (const cat of categories) {
      for (const { w, re } of COMPILED[cat]) {
        if (re.test(t)) hits.push({ category: cat, word: w.replace("*", "") });
      }
    }
    return hits;
  }

  // Checks song metadata. Artist names only get the profanity check so bands like
  // "The Killers" aren't blocked for their name alone.
  function checkMetadata(song) {
    const hits = [
      ...scan(song.title, ["profanity", "drugs", "violence"]),
      ...knownSong(song.title),
      ...scan(song.artist, ["profanity"]),
      ...scan(song.album, ["profanity", "drugs", "violence"]),
    ];
    return dedupe(hits);
  }

  // Whole-title match, ignoring "(feat. ...)" and " - Remastered" style suffixes.
  function knownSong(title) {
    const t = normalize(title).replace(/s*[([].*$/, "").replace(/s+-s+.*$/, "").trim();
    return LISTS.knownSongs.some((k) => new RegExp("^" + k + "$").test(t))
      ? [{ category: "known", word: t }] : [];
  }

  function checkLyrics(lyrics) {
    return dedupe(scan(lyrics, ["profanity", "drugs", "violence"]));
  }

  function dedupe(hits) {
    const seen = new Set();
    return hits.filter((h) => !seen.has(h.category + h.word) && seen.add(h.category + h.word));
  }

  function describe(hits) {
    const names = { profanity: "language", drugs: "drugs/alcohol", violence: "violence", known: "song content" };
    return [...new Set(hits.map((h) => names[h.category]))].join(", ");
  }

  window.SongFilter = { checkMetadata, checkLyrics, describe };
})();
