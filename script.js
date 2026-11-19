(() => {
  "use strict";

  const app = document.getElementById("app");
  const soundButton = document.getElementById("geluid-knop");
  const brandButton = document.getElementById("merk-knop");
  const TOEGANGSCODE = "9Xq0qTdHoi8IMPgIkro_rlVhA_Ce-T_V";
  const heeftToegang = new URLSearchParams(window.location.search).get("toegang") === TOEGANGSCODE;

  if (!heeftToegang) {
    document.body.classList.add("onderhoud-actief");
    document.title = "Vape Escape — We zijn even aan het klussen";
    app.innerHTML = `
      <section class="onderhoud-scherm pagina">
        <div class="onderhoud-badge"><span class="status-punt"></span> TIJDELIJK ONDERHOUD</div>
        <div class="onderhoud-paneel">
          <div class="onderhoud-tekst">
            <p class="bovenlabel">EVEN GEDULD...</p>
            <h1 class="titel-groot">WE ZIJN<br><span class="accent">AAN HET KLUSSEN.</span></h1>
            <p class="subtitel">Vape Escape krijgt een opknapbeurt! Onze mascotte werkt hard aan de volgende update. We zijn zo terug.</p>
            <div class="onderhoud-status"><span class="status-punt"></span> DE WEBSITE IS TIJDELIJK GESLOTEN</div>
          </div>
          <div class="onderhoud-figuur">
            <div class="onderhoud-licht"></div>
            <svg class="mascotte-svg mascotte-werk" viewBox="0 0 180 190" role="img" aria-label="Bink de mascotte draagt een gele bouwhelm en houdt een hamer vast">
              <ellipse class="mascotte-schaduw" cx="88" cy="174" rx="54" ry="9"></ellipse>
              <path class="mascotte-arm" d="M47 107 Q22 119 30 142 Q34 153 45 142 L63 124Z"></path>
              <path class="mascotte-arm" d="M126 107 Q148 103 151 124 L143 146 Q135 151 129 139 L118 122Z"></path>
              <path class="mascotte-lichaam" d="M89 43 C120 43 141 67 141 104 C141 143 119 164 88 164 C54 164 35 142 35 106 C35 69 56 43 89 43Z"></path>
              <path class="mascotte-buik" d="M60 124 Q88 143 117 124 Q112 157 88 157 Q65 157 60 124Z"></path>
              <ellipse class="mascotte-oog" cx="70" cy="100" rx="5" ry="7"></ellipse>
              <ellipse class="mascotte-oog" cx="106" cy="100" rx="5" ry="7"></ellipse>
              <path class="mond-blij" d="M76 117 Q88 130 101 117"></path>
              <path class="mascotte-helm" d="M47 62 Q49 20 89 18 Q130 20 132 62 L47 62Z"></path>
              <path class="mascotte-helm-rand" d="M39 62 Q89 52 140 62 L137 72 Q89 79 42 71Z"></path>
              <path class="mascotte-helm-streep" d="M89 23 L89 53"></path>
              <g class="mascotte-hamer">
                <path class="hamer-steel" d="M143 132 L163 91"></path>
                <path class="hamer-kop" d="M149 91 L158 72 L177 81 L169 98Z"></path>
                <path class="hamer-detail" d="M157 78 L169 84"></path>
              </g>
              <path class="mascotte-voet" d="M57 155 Q54 169 43 171 Q34 173 39 180 Q60 186 76 174 L79 161Z"></path>
              <path class="mascotte-voet" d="M104 160 L108 174 Q124 185 141 179 Q147 173 135 170 L120 154Z"></path>
              <circle class="mascotte-glans" cx="52" cy="79" r="4"></circle>
            </svg>
            <div class="onderhoud-grond"><span></span><span></span><span></span></div>
            <div class="onderhoud-bubbel"><strong>Bink zegt:</strong><br>Ik ben bijna klaar! Nog even geduld.</div>
          </div>
        </div>
        <p class="onderhoud-voet">Bedankt voor je geduld. Tot snel bij Vape Escape!</p>
      </section>`;
    return;
  }
  document.body.classList.add("spel-toegankelijk");

  const STORAGE_KEY = "vape-escape-voortgang-v1";
  const TOTAL_QUESTIONS = 17;
  const MAX_SCORE = 200;
  const RUNNER_GOAL_SECONDS = 45;
  const KARAKTER_KLEUREN = ["#fe6e00", "#3080ff", "#00c758", "#8200da", "#4a423a"];
  const KARAKTER_ACCESSOIRES = ["geen", "pet", "kroon", "koptelefoon"];
  const levelNames = ["Vape-feiten", "Feit of fabel", "Groepsdruk", "De laatste ontsnapping", "De vapehindernisbaan"];
  const levelDescriptions = [
    "Ontdek wat er in een vape zit en wat nicotine met je lichaam doet.",
    "Prik door misleidende beweringen heen en leer hoe regels per land verschillen.",
    "Oefen met lastige situaties en kies hoe jij bij jouw eigen grens blijft.",
    "Gebruik alles wat je hebt geleerd om het digitale slot te openen.",
    "Ren, wissel van baan en ontwijk de vapes. Houd je drie levens en haal de finish."
  ];

  const factsQuestions = [
    {
      id: "f1",
      prompt: "Wat zit er meestal in een vape?",
      context: "Een vape verbrandt geen tabak zoals een sigaret. Wat gebeurt er dan wel?",
      options: [
        "Alleen water met een beetje suiker",
        "Een vloeistof die wordt verhit; die bevat vaak nicotine en andere stoffen",
        "Alleen schone zuurstof",
        "Kruiden die vanzelf in rook veranderen"
      ],
      correctIndex: 1,
      explanation: "Een vape verhit een vloeistof. Die bevat vaak nicotine, propyleenglycol, glycerol en andere stoffen. De ingeademde aerosol is dus geen gewone waterdamp. Bij verhitting kunnen ook schadelijke stoffen ontstaan."
    },
    {
      id: "f2",
      prompt: "Wat is nicotine?",
      context: "Nicotine is een van de belangrijkste redenen waarom vapen moeilijk kan zijn om mee te stoppen.",
      options: [
        "Een vitamine die je energie geeft",
        "Een onschuldige smaakstof",
        "Een sterk verslavende stof die invloed heeft op je hersenen",
        "Een stof die alleen in fruit zit"
      ],
      correctIndex: 2,
      explanation: "Nicotine is een sterk verslavende stof. Het beïnvloedt het beloningssysteem in je hersenen. Daardoor kun je steeds opnieuw zin krijgen in nicotine en ontwenningsklachten ervaren als je stopt."
    },
    {
      id: "f3",
      prompt: "Waarom kan nicotine verslavend zijn?",
      context: "Denk aan wat er in je hersenen gebeurt na het inhaleren van nicotine.",
      options: [
        "Nicotine beïnvloedt het beloningssysteem, waardoor je hersenen er opnieuw om kunnen vragen",
        "Nicotine maakt je immuunsysteem sterker",
        "Nicotine verdwijnt altijd meteen zonder effect",
        "Nicotine zorgt ervoor dat je nooit meer stress voelt"
      ],
      correctIndex: 0,
      explanation: "Nicotine activeert het beloningssysteem. Je hersenen kunnen dat gevoel opnieuw willen. Zo kan afhankelijkheid ontstaan. Zonder nicotine kun je bijvoorbeeld onrustig, prikkelbaar of minder geconcentreerd zijn."
    },
    {
      id: "f4",
      prompt: "Waarom zijn jongeren extra kwetsbaar voor nicotine?",
      context: "Je hersenen zijn tijdens je tienerjaren nog volop in ontwikkeling.",
      options: [
        "Omdat jongeren geen hersenen hebben die nicotine kunnen afbreken",
        "Omdat het jonge brein nog in ontwikkeling is en gevoeliger kan zijn voor nicotine",
        "Omdat nicotine bij jongeren alleen in de longen blijft",
        "Omdat jongeren nooit verslaafd kunnen raken"
      ],
      correctIndex: 1,
      explanation: "De hersenen ontwikkelen zich nog tot in de jongvolwassenheid. Nicotine kan die ontwikkeling verstoren en invloed hebben op aandacht, geheugen en stemming. Jongeren kunnen bovendien sneller afhankelijk worden."
    },
    {
      id: "f5",
      prompt: "Wat kan de aerosol van een vape met je luchtwegen doen?",
      context: "Aerosol is het mengsel dat je inademt wanneer de vloeistof wordt verhit.",
      options: [
        "De luchtwegen altijd schoonmaken",
        "Geen enkel effect hebben op je lichaam",
        "De luchtwegen irriteren of beschadigen en hoestklachten veroorzaken",
        "Je longen extra zuurstof geven"
      ],
      correctIndex: 2,
      explanation: "De aerosol kan stoffen bevatten die de luchtwegen irriteren of beschadigen. Gebruikers melden bijvoorbeeld hoestklachten. Over sommige gevolgen van langdurig en regelmatig vapen is nog niet alles bekend."
    },
    {
      id: "f6",
      prompt: "Een vape zonder nicotine is automatisch onschadelijk. Klopt dat?",
      context: "Let op: nicotine is niet de enige stof waar je rekening mee moet houden.",
      options: [
        "Ja, zonder nicotine is het alleen maar waterdamp",
        "Nee, ook zonder nicotine kunnen schadelijke stoffen in de aerosol zitten",
        "Ja, zolang de vape een smaakje heeft",
        "Nee, maar alleen als je ouder bent dan 18"
      ],
      correctIndex: 1,
      explanation: "Een vape zonder nicotine is niet automatisch veilig. Ook de vloeistof en de aerosol kunnen stoffen bevatten die je luchtwegen irriteren of op een andere manier schadelijk kunnen zijn. Niet beginnen is de veiligste keuze."
    }
  ];

  const truthQuestions = [
    {
      id: "t1",
      prompt: "Kunnen mensen in de buurt ook stoffen uit uitgeademde vape-aerosol inademen?",
      correctIndex: 0,
      explanation: "Waar. Het RIVM beschrijft dat gebruikers stoffen uitademen die ook bij omstanders terecht kunnen komen. Dat kan bijvoorbeeld irritatie aan keel, neus en ogen veroorzaken."
    },
    {
      id: "t2",
      prompt: "Een lege vape mag gewoon bij het restafval, omdat hij klein is.",
      correctIndex: 1,
      explanation: "Niet waar. Een vape is een elektrisch apparaat, vaak met een ingebouwde batterij. Lever hem in bij een inzamelpunt voor kleine elektrische apparaten, niet bij het restafval."
    },
    {
      id: "t3",
      prompt: "Webwinkels mogen vapes in Nederland rechtstreeks aan consumenten verkopen.",
      correctIndex: 1,
      explanation: "Niet waar. Online verkoop aan consumenten is in Nederland verboden. Dit verbod geldt sinds 1 juli 2023."
    },
    {
      id: "t4",
      prompt: "Sinds 2026 mogen e-sigaretten in Nederland alleen nog in speciaalzaken worden verkocht.",
      correctIndex: 0,
      explanation: "Waar. De Rijksoverheid vermeldt dat e-sigaretten vanaf 2026 alleen nog in speciaalzaken mogen worden verkocht."
    },
    {
      id: "t5",
      prompt: "Een winkel mag reclame maken voor vapes op sociale media, zolang er maar bij staat dat nicotine verslavend is.",
      correctIndex: 1,
      explanation: "Niet waar. Voor tabaksproducten en aanverwante producten, waaronder e-sigaretten, geldt in Nederland een reclameverbod. Een waarschuwing maakt reclame niet toegestaan."
    },
    {
      id: "t6",
      prompt: "In het Verenigd Koninkrijk is de verkoop van wegwerpvapes sinds 1 juni 2025 verboden.",
      correctIndex: 0,
      explanation: "Waar. Het verbod geldt voor wegwerpvapes, zowel met als zonder nicotine, en voor verkoop in winkels en online. Herbruikbare vapes vallen niet onder dit specifieke verbod."
    }
  ];

  const scenarios = [
    {
      id: "p1",
      prompt: "Je bent op een feestje. Een paar vrienden bieden je een vape aan en zeggen: \"Kom op, één keer kan toch geen kwaad?\"",
      context: "Je wilt erbij horen, maar je wilt niet vapen. Wat doe je?",
      options: [
        {
          text: "Je zegt rustig: \"Nee, ik vape niet\" en loopt naar iemand bij wie je je prettig voelt.",
          best: true,
          outcome: "Sterke keuze. Je geeft duidelijk je grens aan en zoekt een plek waar je je prettig voelt. Je hoeft niemand iets uit te leggen."
        },
        {
          text: "Je neemt de vape aan zodat je vrienden niet teleurgesteld zijn.",
          best: false,
          outcome: "Je laat de druk van anderen bepalen wat je doet. Je mag nee zeggen, ook als anderen dat jammer vinden."
        },
        {
          text: "Je zegt dat je alleen meedoet als iedereen het doet.",
          best: false,
          outcome: "Je maakt je keuze afhankelijk van de groep. Je eigen grens is genoeg reden om niet mee te doen."
        }
      ],
      bestReason: "Een korte, duidelijke nee is genoeg. Verander van onderwerp of loop weg als de druk doorgaat."
    },
    {
      id: "p2",
      prompt: "In de groepschat deelt iemand een filmpje van een vape-uitdaging en tagt jou. Je vrienden zeggen dat je mee moet doen om erbij te horen.",
      context: "Je wilt niet meedoen aan de uitdaging, maar je wilt ook geen ruzie in de groepschat. Wat doe je?",
      options: [
        {
          text: "Je zegt dat je niet meedoet en deelt het filmpje niet verder.",
          best: true,
          outcome: "Sterke keuze. Je bepaalt zelf waar je aan meedoet en helpt niet om de uitdaging verder te verspreiden."
        },
        {
          text: "Je doet mee, omdat je bang bent dat de groep je anders buitensluit.",
          best: false,
          outcome: "De druk van een groepschat bepaalt dan jouw keuze. Je mag ook online nee zeggen en hoeft niets te bewijzen."
        },
        {
          text: "Je stuurt het filmpje door naar andere groepen zodat iedereen kan kijken.",
          best: false,
          outcome: "Door het filmpje verder te verspreiden, wordt de uitdaging groter. Je kunt beter niet meedoen en het niet doorsturen."
        }
      ],
      bestReason: "Je kunt kort reageren, het filmpje niet doorsturen en de chat verlaten als de druk doorgaat."
    },
    {
      id: "p3",
      prompt: "Een groepje vraagt je om een vape voor hen vast te houden. Ze zeggen dat je niet moeilijk moet doen.",
      context: "Je voelt je ongemakkelijk en wilt er niet bij betrokken raken.",
      options: [
        {
          text: "Je weigert, geeft het niet door en loopt zo nodig weg.",
          best: true,
          outcome: "Goede grens. Je hoeft niets vast te houden of te bewaren. Je kunt ook hulp vragen aan een volwassene als je je onder druk gezet voelt."
        },
        {
          text: "Je houdt hem even vast, want je gebruikt hem zelf toch niet.",
          best: false,
          outcome: "Je raakt alsnog betrokken bij iets waar je niet achter staat. Je mag ook nee zeggen tegen alleen vasthouden of doorgeven."
        },
        {
          text: "Je verstopt hem zodat niemand hem ziet.",
          best: false,
          outcome: "Je neemt verantwoordelijkheid voor iets dat niet van jou is. Het is beter om duidelijk te weigeren en afstand te nemen."
        }
      ],
      bestReason: "Je bent niet verplicht om mee te doen of iets voor iemand te bewaren."
    },
    {
      id: "p4",
      prompt: "Een vriend(in) vertelt dat stoppen met vapen moeilijk is geworden. Diegene schaamt zich en vraagt jou om hulp.",
      context: "Je wilt helpen, zonder te oordelen of alles zelf te moeten oplossen.",
      options: [
        {
          text: "Je luistert, neemt het serieus en stelt voor samen een vertrouwde volwassene of hulpverlener te zoeken.",
          best: true,
          outcome: "Dat is steunend. Luisteren zonder oordeel helpt. Een huisarts, jeugdarts of andere vertrouwde volwassene kan helpen met een plan om te stoppen."
        },
        {
          text: "Je maakt grapjes, zodat je vriend(in) zich er minder druk om maakt.",
          best: false,
          outcome: "Je vriend(in) deelt iets moeilijks. Grapjes kunnen ervoor zorgen dat diegene zich niet serieus genomen voelt. Luisteren is beter."
        },
        {
          text: "Je zegt dat diegene het gewoon zelf moet oplossen.",
          best: false,
          outcome: "Stoppen kan lastig zijn door nicotineverslaving. Steun vragen is juist verstandig. Je hoeft het probleem niet alleen op te lossen."
        }
      ],
      bestReason: "Je kunt helpen door te luisteren en samen betrouwbare hulp te zoeken. Je hoeft geen hulpverlener te zijn."
    }
  ];

  const questionIds = factsQuestions.map(q => q.id)
    .concat(truthQuestions.map(q => q.id))
    .concat(scenarios.map(q => q.id))
    .concat(["escape-code"]);
  const allQuestionIds = questionIds.concat(["runner-clear"]);
  const validIdSet = new Set(allQuestionIds);

  function legeVoortgang() {
    return { completed: [false, false, false, false, false], answers: {}, runnerBest: 0, character: { naam: "Bink", kleur: "#fe6e00", accessoire: "pet" } };
  }

  function laadVoortgang() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return legeVoortgang();
      const parsed = JSON.parse(raw);
      const clean = legeVoortgang();
      if (Array.isArray(parsed.completed)) {
        clean.completed = clean.completed.map((_, index) => parsed.completed[index] === true);
      }
      if (parsed.answers && typeof parsed.answers === "object") {
        Object.keys(parsed.answers).forEach(id => {
          if (validIdSet.has(id) && typeof parsed.answers[id] === "boolean") {
            clean.answers[id] = parsed.answers[id];
          }
        });
      }
      if (Number.isFinite(parsed.runnerBest)) clean.runnerBest = Math.max(0, Math.min(RUNNER_GOAL_SECONDS, parsed.runnerBest));
      if (parsed.character && typeof parsed.character === "object") {
        if (typeof parsed.character.naam === "string") clean.character.naam = parsed.character.naam === "Vapo" ? "Bink" : parsed.character.naam.slice(0, 16);
        if (KARAKTER_KLEUREN.includes(parsed.character.kleur)) clean.character.kleur = parsed.character.kleur;
        if (KARAKTER_ACCESSOIRES.includes(parsed.character.accessoire)) clean.character.accessoire = parsed.character.accessoire;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      } catch (opslagFout) {
        // Het spel blijft speelbaar als lokale opslag niet beschikbaar is.
      }
      return clean;
    } catch (error) {
      return legeVoortgang();
    }
  }

  let voortgang = laadVoortgang();
  let pagina = "start";
  let huidigLevel = 0;
  let huidigeVraag = 0;
  let feedback = null;
  let codeMelding = "";
  let codePogingen = 0;
  let runner = { actief: false, frame: null, vorigeTijd: 0, verstreken: 0, spawnTijd: 0, baan: 1, levens: 3, obstakels: [], onkwetsbaarTot: 0, raakkans: 0, teller: 0 };
  let geluidAan = false;
  let audioContext = null;

  function bewaarVoortgang() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voortgang));
    } catch (error) {
      // Het spel blijft speelbaar wanneer lokale opslag niet beschikbaar is.
    }
  }

  function aantalGoed() {
    return questionIds.filter(id => voortgang.answers[id] === true).length;
  }

  function score() {
    return aantalGoed() * 10 + (voortgang.answers["runner-clear"] === true ? 30 : 0);
  }

  function afgerondeLevels() {
    return voortgang.completed.filter(Boolean).length;
  }

  function isLevelVrij(index) {
    return index === 0 || voortgang.completed[index - 1] === true;
  }

  function levelPunten(index) {
    const ids = [
      factsQuestions.map(q => q.id),
      truthQuestions.map(q => q.id),
      scenarios.map(q => q.id),
      ["escape-code"],
      ["runner-clear"]
    ][index];
    if (index === 4) return voortgang.answers["runner-clear"] === true ? 30 : 0;
    return ids.filter(id => voortgang.answers[id] === true).length * 10;
  }

  function speelGeluid(goed) {
    if (!geluidAan) return;
    try {
      const AudioConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioConstructor) return;
      if (!audioContext) audioContext = new AudioConstructor();
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const volume = audioContext.createGain();
      const nu = audioContext.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(goed ? 640 : 210, nu);
      oscillator.frequency.exponentialRampToValueAtTime(goed ? 880 : 155, nu + 0.12);
      volume.gain.setValueAtTime(0.0001, nu);
      volume.gain.exponentialRampToValueAtTime(0.11, nu + 0.018);
      volume.gain.exponentialRampToValueAtTime(0.0001, nu + 0.19);
      oscillator.connect(volume);
      volume.connect(audioContext.destination);
      oscillator.start(nu);
      oscillator.stop(nu + 0.2);
    } catch (error) {
      // Geluid is optioneel en blokkeert het spel nooit.
    }
  }

  function werkGeluidBij() {
    soundButton.classList.toggle("gedempt", !geluidAan);
    soundButton.setAttribute("aria-label", geluidAan ? "Geluid uitschakelen" : "Geluid inschakelen");
    soundButton.setAttribute("title", geluidAan ? "Geluid uitschakelen" : "Geluid inschakelen");
  }

  function gaNaar(nieuwePagina) {
    pagina = nieuwePagina;
    render();
    app.focus({ preventScroll: true });
  }

  function terugKnop(label, action) {
    return '<button class="tekstknop" type="button" data-action="' + (action || "naar-kaart") + '">← ' + (label || "Terug naar het overzicht") + '</button>';
  }


  function mascotteWeergave(uiting, bericht, compact) {
    const expressie = uiting === "verdrietig" ? "mascotte--verdrietig" : (uiting === "blij" ? "mascotte--blij" : "mascotte--normaal");
    const extraClass = compact ? " mascotte-compact" : " mascotte-feedback";
    return '<div class="mascotte-wrap' + extraClass + '">' +
      '<div class="mascotte-beeld ' + expressie + '">' +
      '<svg class="mascotte-svg" viewBox="0 0 160 160" role="img" aria-label="' + (uiting === "verdrietig" ? "Bink kijkt bezorgd" : (uiting === "blij" ? "Bink is blij" : "Bink de mascotte")) + '">' +
      '<ellipse class="mascotte-schaduw" cx="80" cy="148" rx="43" ry="7"></ellipse>' +
      '<path class="mascotte-arm" d="M43 93 Q19 100 27 124 Q31 134 41 126 L56 109Z"></path>' +
      '<path class="mascotte-arm" d="M117 92 Q140 98 133 122 Q129 133 119 125 L104 108Z"></path>' +
      '<path class="mascotte-lichaam" d="M80 25 C111 25 133 49 133 91 C133 128 112 145 80 145 C48 145 27 126 27 91 C27 50 49 25 80 25Z"></path>' +
      '<path class="mascotte-buik" d="M49 111 Q80 130 111 111 Q105 138 80 138 Q55 138 49 111Z"></path>' +
      '<ellipse class="mascotte-oog" cx="62" cy="82" rx="5" ry="7"></ellipse><ellipse class="mascotte-oog" cx="98" cy="82" rx="5" ry="7"></ellipse>' +
      '<path class="wenkbrauw" d="M53 70 Q62 65 70 70 M90 70 Q98 65 107 70"></path>' +
      '<path class="mond-blij" d="M65 99 Q80 116 95 99"></path>' +
      '<path class="mond-verdrietig" d="M65 108 Q80 91 95 108"></path>' +
      '<path class="mascotte-voetje" d="M49 136 Q46 151 34 151 Q27 157 42 160 Q59 160 65 146Z"></path>' +
      '<path class="mascotte-voetje" d="M95 146 Q103 160 120 159 Q132 155 123 151 Q110 151 109 136Z"></path>' +
      '<circle class="mascotte-glans" cx="46" cy="56" r="4"></circle>' +
      '</svg></div>' +
      '<div class="mascotte-bubbel"><strong>Bink</strong><span>' + bericht + '</span></div>' +
      '</div>';
  }

  function renderStart() {
    return [
      '<section class="startpagina pagina">',
      '<div class="starttekst">',
      '<p class="bovenlabel">DE OVERLEVINGSGAME</p>',
      '<h1 class="titel-groot">VAPE<br><span class="accent">ESCAPE</span></h1>',
      '<p class="subtitel">Kun jij ontsnappen aan de vapeval? Ontdek wat vapen met je lichaam doet, herken groepsdruk en kraak het slot. Vijf niveaus. Eén missie: kies voor jezelf.</p>',
      '<div class="startknoppen">',
      '<button class="knop knop-primair" type="button" id="start-knop">START DE MISSIE <span class="knop-pijl">→</span></button>',
      '<button class="knop knop-secundair" type="button" id="hoe-knop">HOE SPEEL JE?</button>',
      '</div>',
      '<div class="missie-meta">',
      '<div class="meta-item"><strong>05</strong><span>Niveaus</span></div>',
      '<div class="meta-item"><strong>17</strong><span>Kennischecks</span></div>',
      '<div class="meta-item"><strong>200</strong><span>Te verdienen punten</span></div>',
      '</div>',
      mascotteWeergave("normaal", "Hoi! Ik ben Bink! Vapen is geen gezonde keuze. Samen kiezen we voor een vapevrije toekomst!", true),
      '</div>',
      '<aside class="missie-kaart" aria-label="Missie: open het digitale slot">',
      '<div class="kaart-kop"><span>MISSIE 001 / GEZONDHEID</span><span class="kaart-code">TOEGANG GEBLOKKEERD</span></div>',
      '<div class="sluitsymbool" aria-hidden="true"><div class="ring"></div>',
      '<svg viewBox="0 0 100 100"><path d="M29 44V31a21 21 0 0 1 42 0v13"></path><rect x="20" y="43" width="60" height="43" rx="9"></rect><circle cx="50" cy="62" r="5"></circle><path d="M50 67v8"></path><path d="M35 20c3-5 8-8 15-8"></path></svg>',
      '</div>',
      '<div class="kaart-onder"><strong>JOUW KEUZES. JOUW TOEKOMST.</strong><span>Verzamel kennis. Blijf scherp. Vind de uitgang.</span><div class="kaart-stippen"><i></i><i></i><i></i><i></i></div></div>',
      '</aside>',
      '</section>'
    ].join("");
  }

  function renderHoe() {
    return '<section class="pagina">' +
      '<div class="terugrij">' + terugKnop("Naar het hoofdmenu", "naar-start") + '<span class="mini-label">SPELREGELS</span></div>' +
      '<p class="bovenlabel">VOORBEREIDING</p><h1 class="titel-middel">Hoe speel je Vape Escape?</h1>' +
      '<p class="subtitel">Lees de regels en begin daarna aan je missie. Je hoeft niets te installeren en je kunt op je eigen tempo spelen.</p>' +
      '<div class="uitleg-grid">' +
      '<article class="uitleg-kaart"><span class="uitleg-nummer">01</span><div><h3>Speel vijf niveaus</h3><p>Leer over vapen, herken groepsdruk, kraak het slot en ontwijk daarna de obstakels in de hindernisbaan.</p></div></article>' +
      '<article class="uitleg-kaart"><span class="uitleg-nummer">02</span><div><h3>Verdien punten</h3><p>Elk goed antwoord is 10 punten waard. Na ieder antwoord krijg je uitleg, ook als je het fout hebt.</p></div></article>' +
      '<article class="uitleg-kaart"><span class="uitleg-nummer">03</span><div><h3>Bewaar je voortgang</h3><p>Je score en vrijgespeelde niveaus worden automatisch op dit apparaat opgeslagen.</p></div></article>' +
      '</div>' +
      '<div class="paneel paneel-padding"><div class="level-tips"><span>◎</span><p><strong>Goed om te weten:</strong> je hoeft niet alles meteen goed te hebben. Gebruik de uitleg om te leren. Je kunt niveaus opnieuw spelen en je score verbeteren.</p></div>' +
      '<div class="rij-knoppen" style="margin-top:22px"><button class="knop knop-primair" type="button" id="start-knop">BEGREPEN — START! <span class="knop-pijl">→</span></button></div></div>' +
      '</section>';
  }

  function renderLevelKaart(index) {
    const beschikbaar = isLevelVrij(index);
    const klaar = voortgang.completed[index] === true;
    const status = klaar ? "AFGEROND" : (beschikbaar ? "VRIJGESPEELD" : "VERGRENDELD");
    const actie = klaar ? "OPNIEUW SPELEN ↗" : (beschikbaar ? "START NIVEAU ↗" : "SPEEL EERST NIVEAU " + index);
    const className = klaar ? "afgerond" : (beschikbaar ? "beschikbaar" : "vergrendeld");
    return '<article class="level-kaart ' + className + '">' +
      '<div class="level-kop"><span class="level-nummer">NIVEAU 0' + (index + 1) + '</span><span class="level-status">' + status + '</span></div>' +
      '<h3>' + levelNames[index] + '</h3><p>' + levelDescriptions[index] + '</p>' +
      '<div class="level-actie"><span>' + actie + '</span><span>' + (klaar ? "✓" : (beschikbaar ? "→" : "×")) + '</span></div>' +
      '<button type="button" data-action="start-level" data-level="' + index + '"' + (beschikbaar ? "" : " disabled") + ' aria-label="' + (beschikbaar ? "Speel " + levelNames[index] : levelNames[index] + " is vergrendeld") + '"></button>' +
      '</article>';
  }

  function renderKaart() {
    const klaar = afgerondeLevels();
    const voortgangPercentage = Math.round((klaar / 5) * 100);
    const eindKnop = voortgang.completed[4] ? '<div class="rij-knoppen" style="margin-top:22px"><button class="knop knop-primair" type="button" data-action="eindscherm">BEKIJK JE EINDRESULTAAT →</button></div>' : "";
    return '<section class="pagina">' +
      '<div class="terugrij">' + terugKnop("Hoofdmenu", "naar-start") + '<button class="tekstknop" type="button" data-action="reset">↻ Opnieuw beginnen</button></div>' +
      '<p class="bovenlabel">KIES JE VOLGENDE STAP</p><h1 class="titel-middel">De missiekaart</h1>' +
      '<p class="subtitel">Vijf niveaus brengen je dichter bij de uitgang. Voltooi een niveau om het volgende vrij te spelen.</p>' +
      '<div class="voortgang-paneel"><div class="voortgang-tekst"><div class="voortgang-boven"><span>MISSIEVOORTGANG</span><strong>' + klaar + ' / 5 NIVEAUS</strong></div>' +
      '<div class="voortgang-balk"><div class="voortgang-vulling" style="width:' + voortgangPercentage + '%"></div></div></div>' +
      '<div class="score-chip"><strong>' + score() + '</strong><span>VAN ' + MAX_SCORE + ' PUNTEN</span></div></div>' +
      '<div class="level-grid">' + [0, 1, 2, 3, 4].map(renderLevelKaart).join("") + '</div>' +
      '<div class="land-regels">' +
      '<article class="land-kaart"><span class="land-naam">Nederland</span><strong>Leeftijdsgrens en smaakverbod</strong><p>Verkoop aan jongeren onder 18 is verboden. Sinds 2024 mogen vapes met andere smaken dan tabak niet worden verkocht. Sinds 2026 mogen vapes alleen nog in speciaalzaken worden verkocht.</p></article>' +
      '<article class="land-kaart"><span class="land-naam">Verenigd Koninkrijk</span><strong>Wegwerpvapes verboden</strong><p>Sinds 1 juni 2025 is de verkoop en levering van wegwerpvapes verboden. Herbruikbare vapes vallen niet onder dit specifieke verbod.</p></article>' +
      '<article class="land-kaart"><span class="land-naam">Australië</span><strong>Alleen verkoop via apotheken</strong><p>Vapes mogen daar alleen via apotheken worden verkocht voor therapeutisch gebruik. Wegwerpvapes worden niet via apotheken verkocht. Voorwaarden verschillen per staat en territorium.</p></article>' +
      '</div><p class="wet-notitie">Regels verschillen per land en kunnen veranderen. Dit is een korte selectie, geen volledig juridisch overzicht. Raadpleeg de officiële bronnen onderaan de pagina.</p>' +
      eindKnop + '</section>';
  }

  function renderSpelBalk(index, stap, totaal) {
    const percentage = Math.round(((stap + 1) / totaal) * 100);
    return '<div class="spel-voortgang"><strong>NIVEAU 0' + (index + 1) + ' · ' + levelNames[index].toUpperCase() + '</strong><span>VRAAG ' + (stap + 1) + ' / ' + totaal + '</span></div>' +
      '<div class="voortgang-balk" style="margin-bottom:19px"><div class="voortgang-vulling" style="width:' + percentage + '%"></div></div>';
  }

  function renderZijbalk(index) {
    const tips = [
      "Let op het verschil tussen vloeistof, aerosol en nicotine. Een vape maakt geen gewone waterdamp.",
      "Lees elke zin goed. Eén woord kan een bewering helemaal veranderen.",
      "Kies wat veilig is en bij jouw grens past. Je hoeft niemand te overtuigen.",
      "Gebruik de feiten uit de vorige niveaus. De aanwijzingen zijn genoeg om de code te vinden."
    ];
    return '<aside class="spel-zijbalk">' +
      '<div class="paneel zij-kaart"><span class="mini-label">JOUW SCORE</span><div class="zij-score"><span>Totaal</span><strong>' + score() + ' / ' + MAX_SCORE + '</strong></div><div class="zij-score"><span>Goed beantwoord</span><strong>' + aantalGoed() + ' / 17</strong></div></div>' +
      '<div class="paneel zij-kaart"><span class="mini-label">MISSIEHINT</span><h3 style="margin-top:12px">Blijf scherp</h3><p>' + tips[index] + '</p></div>' +
      '<div class="paneel zij-kaart"><div class="level-tips"><span>✓</span><p>Na je keuze verschijnt meteen een uitleg. Lees die goed: je hebt de informatie nodig voor de laatste code.</p></div></div>' +
      '</aside>';
  }

  function renderFeedback(q, goed, gekozenUitleg, extra) {
    const className = goed ? "goed-feedback" : "fout-feedback";
    const kop = goed ? "Goed gedaan! +10 punten" : "Niet helemaal — lees de uitleg";
    const icoon = goed ? "✓" : "!";
    const aantal = huidigLevel === 0 ? factsQuestions.length : (huidigLevel === 1 ? truthQuestions.length : scenarios.length);
    return '<div class="feedback ' + className + '">' +
      '<span class="feedback-icoon">' + icoon + '</span>' +
      '<div><strong>' + kop + '</strong><p>' + (gekozenUitleg || q.explanation || "") + '</p>' +
      (extra ? '<p class="feedback-extra">' + extra + '</p>' : '') +
      '</div></div>' +
      mascotteWeergave(goed ? "blij" : "verdrietig", goed ? "Goed gedaan! Jij kiest voor een gezonde toekomst. Laat je niet overhalen om te vapen!" : "Oei, dat antwoord klopt niet. Geen zorgen: je kunt dit leren! Vapen is geen gezonde keuze.") +
      '<div class="feedback-acties"><button class="knop knop-primair knop-klein" type="button" data-action="volgende">' + (huidigeVraag + 1 >= aantal ? "NIVEAU AFRONDEN" : "VOLGENDE VRAAG") + ' →</button></div>';
  }

  function renderMeerkeuzeVraag(q, vraagIndex, totaal, isFeit) {
    const isBeantwoord = feedback && feedback.id === q.id;
    const opties = isFeit ? ["WAAR", "NIET WAAR"] : q.options;
    const letters = isFeit ? ["W", "N"] : ["A", "B", "C", "D"];
    const optiesHtml = opties.map((tekst, index) => {
      let klasse = "";
      if (isBeantwoord && index === q.correctIndex) klasse = " goed";
      else if (isBeantwoord && index === feedback.gekozen && !feedback.goed) klasse = " fout";
      return '<button class="antwoord-knop' + klasse + '" type="button" data-action="antwoord" data-index="' + index + '"' + (isBeantwoord ? " disabled" : "") + '><span class="antwoord-letter">' + letters[index] + '</span><span>' + tekst + '</span></button>';
    }).join("");
    const intro = isFeit ? '<p class="vraag-context">Beslis of de bewering waar of niet waar is.</p>' : '<p class="vraag-context">' + q.context + '</p>';
    const titel = isFeit ? "FEIT OF FABEL" : "KENNISVRAAG";
    let feedbackHtml = "";
    if (isBeantwoord) {
      const correctText = isFeit ? (q.correctIndex === 0 ? "Waar" : "Niet waar") : q.options[q.correctIndex];
      const extra = feedback.goed ? "" : (feedback.eerderGoed ? "Je had deze vraag eerder al goed beantwoord; dat punt blijft staan." : "Het juiste antwoord: " + correctText + ".");
      feedbackHtml = renderFeedback(q, feedback.goed, q.explanation, extra);
    }
    return '<div class="paneel vraag-paneel"><span class="vraag-label">' + titel + '</span><h2 class="vraag-titel">' + q.prompt + '</h2>' + intro +
      '<div class="antwoord-opties">' + optiesHtml + '</div>' + feedbackHtml + '</div>';
  }

  function renderScenarioVraag(q) {
    const isBeantwoord = feedback && feedback.id === q.id;
    const optiesHtml = q.options.map((optie, index) => {
      let klasse = "";
      if (isBeantwoord && optie.best) klasse = " goed";
      else if (isBeantwoord && index === feedback.gekozen && !feedback.goed) klasse = " fout";
      return '<button class="antwoord-knop' + klasse + '" type="button" data-action="antwoord" data-index="' + index + '"' + (isBeantwoord ? " disabled" : "") + '><span class="antwoord-letter">' + String.fromCharCode(65 + index) + '</span><span>' + optie.text + '</span></button>';
    }).join("");
    let feedbackHtml = "";
    if (isBeantwoord) {
      const gekozen = q.options[feedback.gekozen];
      const extra = feedback.goed ? q.bestReason : (feedback.eerderGoed ? "Je had deze situatie eerder al goed opgelost; dat punt blijft staan." : "Een handigere aanpak: " + q.bestReason);
      feedbackHtml = renderFeedback(q, feedback.goed, gekozen.outcome, extra);
    }
    return '<div class="paneel vraag-paneel"><span class="vraag-label">SITUATIE · JOUW KEUZE</span><h2 class="vraag-titel">' + q.prompt + '</h2><p class="vraag-context">' + q.context + '</p><div class="antwoord-opties scenario-opties">' + optiesHtml + '</div>' + feedbackHtml + '</div>';
  }

  function renderCodeVraag() {
    return '<div class="paneel vraag-paneel code-paneel">' +
      '<span class="vraag-label">LAATSTE NIVEAU · DIGITAAL SLOT</span>' +
      '<h2 class="vraag-titel">Kraak de viercijferige code</h2>' +
      '<p class="vraag-context">De uitgang is bijna open. Combineer de regels en feiten uit de vorige niveaus om de code te vinden.</p>' +
      '<div class="code-cijfers" aria-label="Vier cijfers nodig"><span>?</span><span>?</span><span>?</span><span>?</span></div>' +
      '<div class="code-aanwijzingen"><div class="code-aanwijzing"><b>1–2</b><span>In Nederland mag een vape pas vanaf welke leeftijd worden verkocht? Gebruik beide cijfers.</span></div><div class="code-aanwijzing"><b>3</b><span>Hoeveel milliliter mag het reservoir van een vape maximaal bevatten volgens de Nederlandse regels?</span></div><div class="code-aanwijzing"><b>4</b><span>In welk jaar ging het verbod op de verkoop van wegwerpvapes in het Verenigd Koninkrijk in? Gebruik alleen het laatste cijfer.</span></div></div>' +
      '<form class="code-formulier" id="code-formulier"><label class="mini-label" for="code-invoer" style="position:absolute;left:-9999px">Voer de viercijferige code in</label><input class="code-invoer" id="code-invoer" name="code" type="text" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="0000" aria-describedby="code-melding"><button class="knop knop-primair" type="submit">OPEN HET SLOT →</button></form>' +
      '<p class="code-melding" id="code-melding" role="status">' + (codeMelding || "Tip: bekijk de uitleg en de landenregels nog eens als je twijfelt.") + '</p>' +
      '</div>';
  }

  function renderLevel() {
    const total = huidigLevel === 0 ? factsQuestions.length : (huidigLevel === 1 ? truthQuestions.length : (huidigLevel === 2 ? scenarios.length : 1));
    const inhoud = '<div class="spel-hoofd">' + terugKnop("Naar de missiekaart") + renderSpelBalk(huidigLevel, huidigeVraag, total) +
      (huidigLevel === 0 ? renderMeerkeuzeVraag(factsQuestions[huidigeVraag], huidigeVraag, total, false) :
      (huidigLevel === 1 ? renderMeerkeuzeVraag(truthQuestions[huidigeVraag], huidigeVraag, total, true) :
      (huidigLevel === 2 ? renderScenarioVraag(scenarios[huidigeVraag]) : renderCodeVraag()))) +
      '</div>';
    return '<section class="pagina"><div class="spel-layout">' + inhoud + renderZijbalk(huidigLevel) + '</div></section>';
  }

  function renderLevelKlaar() {
    const next = huidigLevel + 1;
    return '<section class="pagina"><div class="paneel afrond-kaart">' +
      '<div class="afrond-embleem">✓</div><p class="bovenlabel" style="justify-content:center">NIVEAU VOLTOOID</p>' +
      '<h1 class="titel-middel">' + levelNames[huidigLevel] + '</h1>' +
      '<p>Je hebt dit niveau afgerond. Het volgende onderdeel is nu vrijgespeeld.</p>' +
      '<div class="afrond-statistieken"><div class="statistiek"><strong>' + levelPunten(huidigLevel) + '</strong><span>Punten in dit niveau</span></div><div class="statistiek"><strong>' + score() + '</strong><span>Totaal aantal punten</span></div><div class="statistiek"><strong>' + afgerondeLevels() + ' / 5</strong><span>Niveaus afgerond</span></div></div>' +
      '<div class="eindboodschap">Je voortgang is opgeslagen. Je kunt door naar de volgende uitdaging.</div>' +
      '<div class="rij-knoppen"><button class="knop knop-secundair" type="button" data-action="naar-kaart">MISSIEKAART</button>' +
      (next < 4 ? '<button class="knop knop-primair" type="button" data-action="volgend-level">VOLGEND NIVEAU →</button>' : (next === 4 ? '<button class="knop knop-primair" type="button" data-action="naar-kaart">NIVEAU 05 VRIJGESPEELD →</button>' : '<button class="knop knop-primair" type="button" data-action="eindscherm">BEKIJK RESULTAAT →</button>')) +
      '</div></div></section>';
  }

  function renderEindscherm() {
    const goed = aantalGoed();
    const percentage = Math.round((goed / TOTAL_QUESTIONS) * 100);
    const spelBonus = voortgang.answers["runner-clear"] === true ? 30 : 0;
    return '<section class="pagina"><div class="paneel afrond-kaart">' +
      '<div class="afrond-embleem">✦</div><p class="bovenlabel" style="justify-content:center">MISSIE GESLAAGD</p>' +
      '<h1 class="titel-middel">JE BENT ONTSNAPT<br><span class="accent">AAN DE VAPEVAL!</span></h1>' +
      '<p>Je hebt alle vijf de niveaus voltooid en de finish gehaald. Dit is jouw resultaat.</p>' +
      '<div class="afrond-statistieken"><div class="statistiek"><strong>' + score() + '</strong><span>Van ' + MAX_SCORE + ' punten</span></div><div class="statistiek"><strong>' + percentage + '%</strong><span>Kennisvragen goed</span></div><div class="statistiek"><strong>' + goed + ' / 17</strong><span>Goede antwoorden</span></div></div>' +
      '<div class="eindboodschap"><strong>JE BENT ONTSNAPT AAN DE VAPEVAL!</strong><br>Onthoud: jouw toekomst is meer waard dan een vape. Je hoeft niet mee te doen met groepsdruk. Hulp vragen of nee zeggen is juist sterk.</div>' +
      '<p class="runner-bonus-regel">Bonus hindernisbaan: <strong>' + spelBonus + ' / 30 punten</strong></p>' +
      '<div class="rij-knoppen"><button class="knop knop-secundair" type="button" data-action="naar-kaart">BEKIJK NIVEAUS</button><button class="knop knop-primair" type="button" data-action="reset">SPEEL OPNIEUW ↻</button></div>' +
      '</div></section>';
  }

  function escapeHtml(waarde) {
    return String(waarde).replace(/[&<>"']/g, teken => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[teken]);
  }

  function tekenAccessoireSvg(accessoire, kleur) {
    if (accessoire === "pet") return '<path d="M43 51 Q47 23 80 22 Q112 23 117 51Z" fill="' + kleur + '" stroke="#423d38" stroke-width="3"/><path d="M38 51 Q80 43 124 54 Q116 66 83 63 Q55 62 38 59Z" fill="#edebe9" stroke="#423d38" stroke-width="2"/>';
    if (accessoire === "kroon") return '<path d="M49 50 L43 27 L67 42 L80 19 L94 42 L117 27 L111 52Z" fill="#ffb74d" stroke="#423d38" stroke-width="3"/><path d="M49 52 H111" stroke="#423d38" stroke-width="3"/>';
    if (accessoire === "koptelefoon") return '<path d="M43 76 V64 Q43 24 80 24 Q117 24 117 64 V76" fill="none" stroke="#423d38" stroke-width="8"/><rect x="35" y="68" width="16" height="27" rx="7" fill="#3080ff" stroke="#423d38" stroke-width="2"/><rect x="109" y="68" width="16" height="27" rx="7" fill="#3080ff" stroke="#423d38" stroke-width="2"/>';
    return "";
  }

  function karakterVoorbeeldSvg() {
    const kleur = voortgang.character.kleur;
    return '<svg viewBox="0 0 160 170" role="img" aria-label="Voorbeeld van jouw eigen karakter">' +
      '<ellipse cx="80" cy="157" rx="42" ry="7" fill="rgba(66,61,56,.12)"/>' +
      '<path d="M49 127 Q41 148 31 151 Q21 160 44 162 Q65 160 69 139Z" fill="' + kleur + '"/>' +
      '<path d="M93 139 Q99 160 122 162 Q143 158 129 151 Q115 149 111 126Z" fill="' + kleur + '"/>' +
      '<path d="M80 39 C111 39 131 60 131 101 C131 137 111 151 80 151 C49 151 29 137 29 101 C29 60 49 39 80 39Z" fill="' + kleur + '" stroke="#423d38" stroke-width="3"/>' +
      tekenAccessoireSvg(voortgang.character.accessoire, kleur) +
      '<ellipse cx="63" cy="91" rx="5" ry="7" fill="#423d38"/><ellipse cx="98" cy="91" rx="5" ry="7" fill="#423d38"/>' +
      '<path d="M64 111 Q80 126 96 111" fill="none" stroke="#423d38" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M48 69 Q55 59 65 63" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="5" stroke-linecap="round"/>' +
      '</svg>';
  }

  function renderRunnerAanpassen() {
    const kleuren = [
      { kleur: "#fe6e00", naam: "Oranje" },
      { kleur: "#3080ff", naam: "Blauw" },
      { kleur: "#00c758", naam: "Groen" },
      { kleur: "#8200da", naam: "Paars" },
      { kleur: "#4a423a", naam: "Bruin" }
    ];
    const accessoires = [
      { id: "geen", naam: "Geen" },
      { id: "pet", naam: "Pet" },
      { id: "kroon", naam: "Kroon" },
      { id: "koptelefoon", naam: "Koptelefoon" }
    ];
    const kleurKnoppen = kleuren.map(item =>
      '<button type="button" class="runner-kleur' + (voortgang.character.kleur === item.kleur ? ' gekozen' : '') + '" style="--karakterkleur:' + item.kleur + '" data-action="runner-kleur" data-kleur="' + item.kleur + '" aria-label="Kies ' + item.naam + '" aria-pressed="' + (voortgang.character.kleur === item.kleur) + '"></button>'
    ).join("");
    const accessoireKnoppen = accessoires.map(item =>
      '<button type="button" class="runner-accessoire' + (voortgang.character.accessoire === item.id ? ' gekozen' : '') + '" data-action="runner-accessoire" data-accessoire="' + item.id + '" aria-pressed="' + (voortgang.character.accessoire === item.id) + '">' + item.naam + '</button>'
    ).join("");
    return '<section class="pagina runner-pagina">' +
      '<div class="terugrij">' + terugKnop("Terug naar de missiekaart") + '<span class="mini-label">NIVEAU 05 / KARAKTERKEUZE</span></div>' +
      '<p class="bovenlabel">KLAAR VOOR DE UITDAGING?</p><h1 class="titel-middel">Maak jouw renner</h1>' +
      '<p class="subtitel">Geef je karakter een eigen naam, kleur en accessoire. Daarna begint de hindernisbaan.</p>' +
      '<div class="runner-aanpas-grid">' +
      '<div class="paneel runner-personalisatie">' +
      '<span class="mini-label">JOUW KARAKTER</span>' +
      '<div class="runner-preview">' + karakterVoorbeeldSvg() + '<strong>' + escapeHtml(voortgang.character.naam) + '</strong><span>Deelnemer aan de hindernisbaan</span></div>' +
      '<label class="runner-label" for="runner-naam">Naam van je karakter</label>' +
      '<input class="runner-invoer" id="runner-naam" maxlength="16" value="' + escapeHtml(voortgang.character.naam) + '" placeholder="Vul een naam in">' +
      '<span class="runner-label">Kies een kleur</span><div class="runner-kleuren">' + kleurKnoppen + '</div>' +
      '<span class="runner-label">Kies een accessoire</span><div class="runner-accessoires">' + accessoireKnoppen + '</div>' +
      '</div>' +
      '<div class="runner-uitleg-kolom">' +
      '<div class="paneel runner-uitleg"><span class="mini-label">DE OPDRACHT</span><h2>Ontwijk de obstakels</h2><p>Ren over drie banen en ontwijk de vape-obstakels. Je hebt drie levens. Houd het 45 seconden vol om de finish te halen.</p><div class="runner-statistieken"><div><strong>3</strong><span>LEVENS</span></div><div><strong>45</strong><span>SECONDEN</span></div><div><strong>+30</strong><span>BONUSPUNTEN</span></div></div></div>' +
      '<div class="paneel runner-uitleg"><span class="mini-label">BESTURING</span><div class="runner-besturing-regel"><kbd>←</kbd><kbd>→</kbd><span>Wissel van baan met de pijltjestoetsen</span></div><div class="runner-besturing-regel"><kbd>A</kbd><kbd>D</kbd><span>Of gebruik de A- en D-toets</span></div><div class="runner-besturing-regel"><span class="runner-aanraak">LINKS / RECHTS</span><span>Op een telefoon gebruik je de knoppen op het scherm</span></div></div>' +
      '<button class="knop knop-primair runner-startknop" type="button" data-action="runner-start">START DE HINDERNISBAAN →</button>' +
      '<p class="runner-record">Beste resultaat: <strong>' + Math.floor(voortgang.runnerBest) + ' van 45 seconden</strong></p>' +
      '</div></div></section>';
  }

  function renderRunnerSpel() {
    return '<section class="pagina runner-pagina">' +
      '<div class="runner-hud"><button class="tekstknop" type="button" data-action="runner-stop">← Stop en terug</button>' +
      '<div class="runner-hud-stat"><span>LEVENS</span><strong id="runner-levens">● ● ●</strong></div>' +
      '<div class="runner-hud-stat"><span>TIJD</span><strong id="runner-tijd">00:45</strong></div>' +
      '<div class="runner-hud-stat"><span>BAAN</span><strong id="runner-karakter">' + escapeHtml(voortgang.character.naam) + '</strong></div></div>' +
      '<div class="paneel runner-speelveld"><div class="runner-canvas-omhulsel"><canvas id="runner-canvas" width="960" height="520" aria-label="Hindernisbaan met drie banen. Ontwijk de vape-obstakels door naar links en rechts te bewegen."></canvas><div class="runner-canvas-ondertekst">ONTWIJK DE OBSTAKELS · HOUD HET 45 SECONDEN VOL</div></div>' +
      '<div class="runner-aanraakbediening"><button type="button" data-action="runner-links" aria-label="Beweeg naar links">← LINKS</button><button type="button" data-action="runner-rechts" aria-label="Beweeg naar rechts">RECHTS →</button></div></div>' +
      '<p class="runner-spelhint">Tip: kijk vooruit en wissel op tijd van baan. Je hebt drie levens.</p>' +
      '</section>';
  }

  function renderRunnerMislukt() {
    return '<section class="pagina"><div class="paneel afrond-kaart runner-resultaat">' +
      '<div class="afrond-embleem runner-verlies">!</div><p class="bovenlabel" style="justify-content:center">POGING VOORBIJ</p>' +
      '<h1 class="titel-middel">Je bent geraakt</h1>' +
      '<p>Je drie levens zijn op. Geen probleem: pas je route aan en probeer de hindernisbaan opnieuw.</p>' +
      '<div class="afrond-statistieken"><div class="statistiek"><strong>0</strong><span>Levens over</span></div><div class="statistiek"><strong>' + Math.floor(runner.verstreken) + ' s</strong><span>Volgehouden</span></div><div class="statistiek"><strong>' + Math.floor(voortgang.runnerBest) + ' s</strong><span>Beste tijd</span></div></div>' +
      '<div class="rij-knoppen"><button class="knop knop-secundair" type="button" data-action="naar-kaart">MISSIEKAART</button><button class="knop knop-primair" type="button" data-action="runner-start">OPNIEUW PROBEREN ↻</button></div>' +
      '</div></section>';
  }

  function beginRunner() {
    stopRunnerLoop();
    runner = { actief: true, frame: null, vorigeTijd: 0, verstreken: 0, spawnTijd: 0, baan: 1, levens: 3, obstakels: [], onkwetsbaarTot: 0, raakkans: 0, teller: 0, laatsteBaan: -1 };
    gaNaar("runner-spel");
  }

  function stopRunnerLoop() {
    runner.actief = false;
    if (runner.frame !== null && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(runner.frame);
    }
    runner.frame = null;
  }

  function runnerBaanX(baan, y) {
    const verhouding = Math.max(0, Math.min(1, y / 520));
    const boven = [403, 480, 557];
    const onder = [245, 480, 715];
    return boven[baan] + (onder[baan] - boven[baan]) * verhouding;
  }

  function tekenRunnerVape(ctx, obstakel) {
    const x = runnerBaanX(obstakel.baan, obstakel.y);
    const schaal = .72 + Math.max(0, obstakel.y / 520) * .5;
    const breedte = 31 * schaal;
    const hoogte = 67 * schaal;
    ctx.save();
    ctx.translate(x, obstakel.y);
    ctx.rotate(Math.sin(obstakel.teller || 0) * .04);
    ctx.fillStyle = "rgba(66,61,56,.15)";
    ctx.beginPath(); ctx.ellipse(0, hoogte * .48, breedte * .85, 6 * schaal, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#4a423a";
    ctx.beginPath(); ctx.roundRect(-breedte / 2, -hoogte / 2, breedte, hoogte, 8 * schaal); ctx.fill();
    ctx.fillStyle = "#797067";
    ctx.beginPath(); ctx.roundRect(-breedte / 2 + 4 * schaal, -hoogte / 2 - 5 * schaal, breedte - 8 * schaal, 8 * schaal, 3 * schaal); ctx.fill();
    ctx.fillStyle = "#fe6e00";
    ctx.beginPath(); ctx.roundRect(-breedte / 2 + 3 * schaal, -4 * schaal, breedte - 6 * schaal, 19 * schaal, 3 * schaal); ctx.fill();
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3 * schaal; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-7 * schaal, 0); ctx.lineTo(7 * schaal, 11 * schaal); ctx.moveTo(7 * schaal, 0); ctx.lineTo(-7 * schaal, 11 * schaal); ctx.stroke();
    ctx.fillStyle = "#fb2c36";
    ctx.beginPath(); ctx.moveTo(0, -hoogte / 2 - 10 * schaal); ctx.lineTo(-9 * schaal, -hoogte / 2 + 3 * schaal); ctx.lineTo(9 * schaal, -hoogte / 2 + 3 * schaal); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function tekenRunnerKarakter(ctx, tijd) {
    const x = runnerBaanX(runner.baan, 440);
    const y = 423 + Math.sin(tijd * 13) * 4;
    const kleur = voortgang.character.kleur;
    const knipper = runner.verstreken < runner.onkwetsbaarTot && Math.floor(tijd * 12) % 2 === 0;
    if (knipper) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(66,61,56,.16)";
    ctx.beginPath(); ctx.ellipse(0, 31, 28, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = kleur;
    ctx.beginPath(); ctx.ellipse(0, 0, 23, 28, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#423d38"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = "#423d38";
    ctx.beginPath(); ctx.arc(-8, -4, 3, 0, Math.PI * 2); ctx.arc(8, -4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#423d38"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-7, 8); ctx.quadraticCurveTo(0, 15, 7, 8); ctx.stroke();
    if (voortgang.character.accessoire === "pet") {
      ctx.fillStyle = "#423d38"; ctx.beginPath(); ctx.arc(0, -20, 17, Math.PI, 0); ctx.fill();
      ctx.fillRect(-18, -22, 36, 5);
    } else if (voortgang.character.accessoire === "kroon") {
      ctx.fillStyle = "#ffb74d"; ctx.beginPath(); ctx.moveTo(-15, -20); ctx.lineTo(-19, -37); ctx.lineTo(-7, -28); ctx.lineTo(0, -43); ctx.lineTo(7, -28); ctx.lineTo(19, -37); ctx.lineTo(15, -20); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#423d38"; ctx.stroke();
    } else if (voortgang.character.accessoire === "koptelefoon") {
      ctx.strokeStyle = "#423d38"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -4, 23, Math.PI, 0); ctx.stroke();
      ctx.fillStyle = "#3080ff"; ctx.fillRect(-25, -7, 7, 18); ctx.fillRect(18, -7, 7, 18);
    }
    ctx.restore();
  }

  function tekenRunnerWereld(ctx) {
    const breedte = 960, hoogte = 520;
    ctx.clearRect(0, 0, breedte, hoogte);
    ctx.fillStyle = "#fcfaf7"; ctx.fillRect(0, 0, breedte, hoogte);
    const lucht = ctx.createLinearGradient(0, 0, 0, hoogte);
    lucht.addColorStop(0, "#ffffff"); lucht.addColorStop(1, "#edebe9");
    ctx.fillStyle = lucht; ctx.fillRect(0, 0, breedte, hoogte);
    ctx.fillStyle = "rgba(254,110,0,.08)";
    ctx.beginPath(); ctx.arc(480, 85, 94, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e3e0dd";
    ctx.beginPath(); ctx.moveTo(365, 0); ctx.lineTo(595, 0); ctx.lineTo(870, 520); ctx.lineTo(90, 520); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.moveTo(380, 0); ctx.lineTo(580, 0); ctx.lineTo(820, 520); ctx.lineTo(140, 520); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(254,110,0,.28)"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(365, 0); ctx.lineTo(90, 520); ctx.moveTo(595, 0); ctx.lineTo(870, 520); ctx.stroke();
    ctx.strokeStyle = "#e3e0dd"; ctx.lineWidth = 2; ctx.setLineDash([13, 13]);
    ctx.beginPath(); ctx.moveTo(440, 0); ctx.lineTo(360, 520); ctx.moveTo(520, 0); ctx.lineTo(600, 520); ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < 9; i++) {
      const y = (i * 83 + runner.verstreken * 165) % 520;
      const alpha = .08 + y / 520 * .16;
      ctx.fillStyle = "rgba(254,110,0," + alpha + ")";
      ctx.fillRect(102 + y * .5, y, 7, 3);
      ctx.fillRect(851 - y * .5, y, 7, 3);
    }
    runner.obstakels.forEach(obstakel => tekenRunnerVape(ctx, obstakel));
    tekenRunnerKarakter(ctx, runner.verstreken);
    if (runner.verstreken < runner.onkwetsbaarTot) {
      ctx.strokeStyle = "rgba(254,110,0,.65)"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(runnerBaanX(runner.baan, 440), 423, 38 + Math.sin(runner.verstreken * 18) * 4, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = "#423d38"; ctx.font = "700 14px ui-sans-serif, system-ui"; ctx.textAlign = "center";
    ctx.fillText("WISSEL VAN BAAN OM DE OBSTAKELS TE ONTWIJKEN", 480, 28);
  }

  function werkRunnerHudBij() {
    const levens = document.getElementById("runner-levens");
    const tijd = document.getElementById("runner-tijd");
    if (levens) {
      levens.innerHTML = [0, 1, 2].map(i => '<span class="runner-leven ' + (i < runner.levens ? 'actief' : 'verloren') + '">●</span>').join("");
      levens.setAttribute("aria-label", runner.levens + " van de 3 levens over");
    }
    if (tijd) {
      const resterend = Math.max(0, RUNNER_GOAL_SECONDS - runner.verstreken);
      tijd.textContent = "00:" + String(Math.ceil(resterend)).padStart(2, "0");
    }
  }

  function beweegRunner(richting) {
    if (pagina !== "runner-spel" || !runner.actief) return;
    runner.baan = Math.max(0, Math.min(2, runner.baan + richting));
  }

  function beeindigRunner(gewonnen) {
    if (!runner.actief) return;
    runner.actief = false;
    if (runner.frame !== null && window.cancelAnimationFrame) window.cancelAnimationFrame(runner.frame);
    runner.frame = null;
    voortgang.runnerBest = Math.max(voortgang.runnerBest, Math.floor(runner.verstreken));
    if (gewonnen) {
      voortgang.answers["runner-clear"] = true;
      voortgang.completed[4] = true;
      voortgang.runnerBest = RUNNER_GOAL_SECONDS;
      bewaarVoortgang();
      speelGeluid(true);
      gaNaar("eind");
    } else {
      bewaarVoortgang();
      speelGeluid(false);
      gaNaar("runner-mislukt");
    }
  }

  function stapRunner(tijdstip) {
    if (!runner.actief || pagina !== "runner-spel") return;
    if (!runner.vorigeTijd) runner.vorigeTijd = tijdstip;
    const delta = Math.min(.05, Math.max(0, (tijdstip - runner.vorigeTijd) / 1000));
    runner.vorigeTijd = tijdstip;
    runner.verstreken += delta;
    runner.spawnTijd += delta;
    const spawnInterval = Math.max(.72, 1.12 - runner.verstreken * .006);
    if (runner.spawnTijd >= spawnInterval) {
      runner.spawnTijd = 0;
      let baan = Math.floor(Math.random() * 3);
      if (baan === runner.laatsteBaan) baan = (baan + 1 + Math.floor(Math.random() * 2)) % 3;
      runner.laatsteBaan = baan;
      runner.obstakels.push({ baan: baan, y: -55, snelheid: 190 + runner.verstreken * 2.8, teller: Math.random() * 6, geraakt: false });
    }
    runner.obstakels.forEach(obstakel => {
      obstakel.y += obstakel.snelheid * delta;
      obstakel.teller += delta * 4;
      if (!obstakel.geraakt && obstakel.baan === runner.baan &&
          obstakel.y > 385 && obstakel.y < 455 && runner.verstreken >= runner.onkwetsbaarTot) {
        obstakel.geraakt = true;
        runner.levens -= 1;
        runner.onkwetsbaarTot = runner.verstreken + 1.15;
        runner.raakkans += 1;
      }
    });
    runner.obstakels = runner.obstakels.filter(obstakel => obstakel.y < 570 && !obstakel.geraakt);
    const canvas = document.getElementById("runner-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) tekenRunnerWereld(ctx);
    }
    werkRunnerHudBij();
    if (runner.levens <= 0) {
      beeindigRunner(false);
      return;
    }
    if (runner.verstreken >= RUNNER_GOAL_SECONDS) {
      beeindigRunner(true);
      return;
    }
    runner.frame = window.requestAnimationFrame(stapRunner);
  }

  function startRunnerLoop() {
    if (!runner.actief || runner.frame !== null) return;
    runner.vorigeTijd = 0;
    werkRunnerHudBij();
    runner.frame = window.requestAnimationFrame(stapRunner);
  }

  function render() {
    let inhoud = "";
    if (pagina === "start") inhoud = renderStart();
    else if (pagina === "hoe") inhoud = renderHoe();
    else if (pagina === "kaart") inhoud = renderKaart();
    else if (pagina === "spel") inhoud = renderLevel();
    else if (pagina === "level-klaar") inhoud = renderLevelKlaar();
    else if (pagina === "runner-aanpassen") inhoud = renderRunnerAanpassen();
    else if (pagina === "runner-spel") inhoud = renderRunnerSpel();
    else if (pagina === "runner-mislukt") inhoud = renderRunnerMislukt();
    else if (pagina === "eind") inhoud = renderEindscherm();
    app.innerHTML = inhoud;
    werkGeluidBij();
    if (pagina === "runner-spel") startRunnerLoop();
    else if (runner.actief) stopRunnerLoop();
  }

  function startLevel(index) {
    if (!isLevelVrij(index)) return;
    if (index === 4) {
      gaNaar("runner-aanpassen");
      return;
    }
    huidigLevel = index;
    huidigeVraag = 0;
    feedback = null;
    codeMelding = "";
    codePogingen = 0;
    gaNaar("spel");
  }

  function registreerAntwoord(id, goed) {
    if (voortgang.answers[id] !== true) {
      voortgang.answers[id] = goed;
    }
    bewaarVoortgang();
  }

  function antwoordOpVraag(index) {
    if (feedback) return;
    let vraag;
    if (huidigLevel === 0) vraag = factsQuestions[huidigeVraag];
    else if (huidigLevel === 1) vraag = truthQuestions[huidigeVraag];
    else if (huidigLevel === 2) vraag = scenarios[huidigeVraag];
    if (!vraag) return;
    const goed = huidigLevel === 2 ? vraag.options[index].best : index === vraag.correctIndex;
    const eerderGoed = voortgang.answers[vraag.id] === true;
    registreerAntwoord(vraag.id, goed);
    feedback = { id: vraag.id, gekozen: index, goed: goed, eerderGoed: eerderGoed };
    speelGeluid(goed);
    render();
  }

  function volgendeVraag() {
    feedback = null;
    const totaal = huidigLevel === 0 ? factsQuestions.length : (huidigLevel === 1 ? truthQuestions.length : scenarios.length);
    if (huidigeVraag + 1 < totaal) {
      huidigeVraag += 1;
      render();
    } else {
      rondLevelAf();
    }
  }

  function rondLevelAf() {
    voortgang.completed[huidigLevel] = true;
    bewaarVoortgang();
    if (huidigLevel === 4) {
      voortgang.answers["runner-clear"] = true;
      gaNaar("eind");
    } else {
      gaNaar("level-klaar");
    }
    speelGeluid(true);
  }

  function controleerCode() {
    const invoer = document.getElementById("code-invoer");
    if (!invoer) return;
    const waarde = invoer.value.trim();
    if (!/^[0-9]{4}$/.test(waarde)) {
      codeMelding = "Vul precies vier cijfers in.";
      render();
      document.getElementById("code-invoer").focus();
      return;
    }
    codePogingen += 1;
    if (waarde === "1825") {
      registreerAntwoord("escape-code", true);
      voortgang.completed[3] = true;
      bewaarVoortgang();
      rondLevelAf();
    } else {
      speelGeluid(false);
      const hints = [
        "Controleer de Nederlandse minimumleeftijd en de maximale inhoud van het reservoir.",
        "Denk aan de leeftijd van 18 jaar, het reservoir van 2 ml en het Britse verbodsjaar 2025.",
        "Je bent er bijna. De cijfers vormen samen: leeftijd (2 cijfers), reservoir (1 cijfer), laatste cijfer van het jaartal (1 cijfer)."
      ];
      codeMelding = "Dat is niet de juiste code. " + hints[Math.min(codePogingen - 1, hints.length - 1)];
      render();
      document.getElementById("code-invoer").focus();
    }
  }

  function resetSpel() {
    const bevestiging = window.confirm("Weet je zeker dat je opnieuw wilt beginnen? Je score en vrijgespeelde niveaus worden op dit apparaat gewist.");
    if (!bevestiging) return;
    voortgang = legeVoortgang();
    bewaarVoortgang();
    huidigeVraag = 0;
    feedback = null;
    codeMelding = "";
    codePogingen = 0;
    gaNaar("start");
  }

  app.addEventListener("click", event => {
    const knopElement = event.target.closest("button");
    if (!knopElement || knopElement.disabled) return;
    if (knopElement.id === "start-knop") {
      gaNaar("kaart");
    } else if (knopElement.id === "hoe-knop") {
      gaNaar("hoe");
    } else if (knopElement.dataset.action === "naar-kaart") {
      gaNaar("kaart");
    } else if (knopElement.dataset.action === "naar-start") {
      gaNaar("start");
    } else if (knopElement.dataset.action === "start-level") {
      startLevel(Number(knopElement.dataset.level));
    } else if (knopElement.dataset.action === "antwoord") {
      antwoordOpVraag(Number(knopElement.dataset.index));
    } else if (knopElement.dataset.action === "volgende") {
      volgendeVraag();
    } else if (knopElement.dataset.action === "volgend-level") {
      startLevel(huidigLevel + 1);
    } else if (knopElement.dataset.action === "eindscherm") {
      gaNaar("eind");
    } else if (knopElement.dataset.action === "reset") {
      resetSpel();
    } else if (knopElement.dataset.action === "runner-start") {
      beginRunner();
    } else if (knopElement.dataset.action === "runner-links") {
      beweegRunner(-1);
    } else if (knopElement.dataset.action === "runner-rechts") {
      beweegRunner(1);
    } else if (knopElement.dataset.action === "runner-kleur") {
      const kleur = knopElement.dataset.kleur;
      if (KARAKTER_KLEUREN.includes(kleur)) {
        voortgang.character.kleur = kleur;
        bewaarVoortgang();
        render();
      }
    } else if (knopElement.dataset.action === "runner-accessoire") {
      const accessoire = knopElement.dataset.accessoire;
      if (KARAKTER_ACCESSOIRES.includes(accessoire)) {
        voortgang.character.accessoire = accessoire;
        bewaarVoortgang();
        render();
      }
    } else if (knopElement.dataset.action === "runner-stop") {
      stopRunnerLoop();
      gaNaar("runner-aanpassen");
    }
  });

  app.addEventListener("submit", event => {
    if (event.target && event.target.id === "code-formulier") {
      event.preventDefault();
      controleerCode();
    }
  });

  app.addEventListener("change", event => {
    if (event.target && event.target.id === "runner-naam") {
      const naam = event.target.value.trim().slice(0, 16);
      voortgang.character.naam = naam || "Bink";
      bewaarVoortgang();
      render();
    }
  });

  window.addEventListener("keydown", event => {
    if (pagina !== "runner-spel" || !runner.actief) return;
    const toets = event.key.toLowerCase();
    if (toets === "arrowleft" || toets === "a") {
      event.preventDefault();
      beweegRunner(-1);
    } else if (toets === "arrowright" || toets === "d") {
      event.preventDefault();
      beweegRunner(1);
    }
  });

  soundButton.addEventListener("click", () => {
    geluidAan = !geluidAan;
    werkGeluidBij();
    if (geluidAan) speelGeluid(true);
  });

  brandButton.addEventListener("click", event => {
    event.preventDefault();
    gaNaar("start");
  });

  render();
})();