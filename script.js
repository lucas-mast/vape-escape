(() => {
  "use strict";

  const app = document.getElementById("app");
  const soundButton = document.getElementById("geluid-knop");
  const brandButton = document.getElementById("merk-knop");
  const DASHBOARD_TOEGANGSCODE = "VE-DASH-8f4a2c7d9e31-5d62b90c4a71-2026";
  const paginaParameters = new URLSearchParams(window.location.search);
  const dashboardMode = paginaParameters.get("beheer") === DASHBOARD_TOEGANGSCODE;

  document.body.classList.add("spel-toegankelijk");
  if (dashboardMode) document.body.classList.add("dashboard-actief");

  const STORAGE_KEY = "vape-escape-voortgang-v1";
  const SUPABASE_URL = "https://xhlvttahazjgnxolnlxk.supabase.co";
  const SUPABASE_KEY = "sb_publishable_HrmLgS3ADp7A_B2zWYWgZQ_5G8bY68R";
  const ADMIN_FUNCTION_URL = SUPABASE_URL + "/functions/v1/vape-escape-admin";
  let remoteSpelers = null;
  let remoteAdminKey = "";
  const TOTAL_QUESTIONS = 17;
  const MAX_SCORE = 200;
  const RUNNER_GOAL_COINS = 10;
  const SPELERS_STORAGE_KEY = "vape-escape-spelers-v1";
  const INACTIEF_NA_MS = 2 * 60 * 60 * 1000;
  const KARAKTER_KLEUREN = ["#39ff14", "#00f5ff", "#ff00e5", "#a020f0", "#faff00"];
  const KARAKTER_ACCESSOIRES = ["geen", "pet", "kroon", "koptelefoon", "bril", "cape", "vleugels", "antenne"];
  const KARAKTER_EFFECTEN = ["neon", "vonken", "sterren", "wolken"];
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
    return { completed: [false, false, false, false, false], answers: {}, runnerBest: 0, coins: 0, character: { naam: "Bink", kleur: "#39ff14", accessoire: "pet", effect: "neon" } };
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
      if (Number.isFinite(parsed.runnerBest)) clean.runnerBest = Math.max(0, Math.min(RUNNER_GOAL_COINS, Math.floor(parsed.runnerBest)));
      if (Number.isFinite(parsed.coins)) clean.coins = Math.max(0, Math.floor(parsed.coins));
      if (parsed.character && typeof parsed.character === "object") {
        if (typeof parsed.character.naam === "string") clean.character.naam = parsed.character.naam === "Vapo" ? "Bink" : parsed.character.naam.slice(0, 16);
        if (KARAKTER_KLEUREN.includes(parsed.character.kleur)) clean.character.kleur = parsed.character.kleur;
        if (KARAKTER_ACCESSOIRES.includes(parsed.character.accessoire)) clean.character.accessoire = parsed.character.accessoire;
        if (KARAKTER_EFFECTEN.includes(parsed.character.effect)) clean.character.effect = parsed.character.effect;
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
  const BEWAARDE_PAGINAS = new Set(["start", "hoe", "kaart", "spel", "level-klaar", "runner-aanpassen", "runner-spel", "runner-mislukt", "eind", "profiel"]);
  let opgeslagenPagina = null;
  try { opgeslagenPagina = sessionStorage.getItem("vape-escape-huidige-pagina"); } catch (error) {}
  let pagina = dashboardMode ? "dashboard" : (BEWAARDE_PAGINAS.has(opgeslagenPagina) ? (opgeslagenPagina === "runner-spel" ? "runner-aanpassen" : opgeslagenPagina) : "start");
  let huidigLevel = 0;
  let huidigeVraag = 0;
  try {
    const opgeslagenLevel = Number(sessionStorage.getItem("vape-escape-huidig-level"));
    const opgeslagenVraag = Number(sessionStorage.getItem("vape-escape-huidige-vraag"));
    if (Number.isInteger(opgeslagenLevel) && opgeslagenLevel >= 0 && opgeslagenLevel <= 3) huidigLevel = opgeslagenLevel;
    if (Number.isInteger(opgeslagenVraag) && opgeslagenVraag >= 0 && opgeslagenVraag <= 6) huidigeVraag = opgeslagenVraag;
  } catch (error) {}
  let feedback = null;
  let codeMelding = "";
  let codePogingen = 0;
  let runner = { actief: false, frame: null, vorigeTijd: 0, verstreken: 0, spawnTijd: 0, muntSpawnTijd: 0, volgendeMunt: 3.2, baan: 1, doelBaan: 1, levens: 5, obstakels: [], munten: [], deeltjes: [], muntenVerzameld: 0, onkwetsbaarTot: 0, spring: 0, teller: 0, laatsteBaan: -1 };
  let geluidAan = false;
  let audioContext = null;


  let huidigeSpelerId = null;
  try {
    huidigeSpelerId = sessionStorage.getItem("vape-escape-sessie-speler") || localStorage.getItem("vape-escape-huidige-speler") || null;
    if (huidigeSpelerId && !spelerMetId(huidigeSpelerId)) huidigeSpelerId = null;
  } catch (error) { huidigeSpelerId = null; }
  let laatsteActiviteitBijgewerkt = 0;

  function leesSpelers() {
    try {
      const gegevens = JSON.parse(localStorage.getItem(SPELERS_STORAGE_KEY) || "[]");
      return Array.isArray(gegevens) ? gegevens.filter(speler => speler && typeof speler.id === "string") : [];
    } catch (error) { return []; }
  }

  function bewaarSpelers(spelers) {
    try { localStorage.setItem(SPELERS_STORAGE_KEY, JSON.stringify(spelers)); } catch (error) {}
  }

  function spelerMetId(id) {
    return id ? leesSpelers().find(speler => speler.id === id) || null : null;
  }

  function maakSpelerId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "speler-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }

  function werkSpelersStatusBij() {
    if(remoteSpelers)return remoteSpelers.map(speler=>({
      ...speler,
      id:speler.id||speler.player_id||"",
      naam:String(speler.name||speler.naam||speler.player_name||"Onbekende speler"),
      score:Number(speler.score)||0,
      coins:Number(speler.coins)||0,
      character:speler.character&&typeof speler.character==="object"?speler.character:{},
      vrijgespeeldeNiveaus:Array.isArray(speler.unlocked_levels)?speler.unlocked_levels.map(Number).filter(Number.isInteger):[1],
      voltooideNiveaus:Array.isArray(speler.completed_levels)?speler.completed_levels.length:0,
      status:speler.last_seen_at&&Date.now()-new Date(speler.last_seen_at).getTime()<INACTIEF_NA_MS?"actief":"offline"
    }));
    const nu = Date.now();
    let aangepast = false;
    const spelers = leesSpelers();
    spelers.forEach(speler => {
      const laatste = Number(speler.laatsteActiviteit || speler.aangemaaktOp || nu);
      if (speler.status === "actief" && nu - laatste >= INACTIEF_NA_MS) {
        speler.status = "offline";
        speler.afgemeldOp = nu;
        aangepast = true;
        if (speler.id === huidigeSpelerId) huidigeSpelerId = null;
      }
    });
    if (aangepast) bewaarSpelers(spelers);
    if (!huidigeSpelerId) {
      try { localStorage.removeItem("vape-escape-huidige-speler"); } catch (error) {}
    }
    return spelers;
  }

  function spelersCode() {
    try { return localStorage.getItem("vape-escape-spelerscode") || ""; } catch (error) { return ""; }
  }
  async function supabaseRpc(name, body) {
    const response = await fetch(SUPABASE_URL + "/rest/v1/rpc/" + name,{method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify(body)});
    const data=await response.json().catch(()=>null);
    if(!response.ok) throw new Error(data&&data.message||"Databaseverbinding mislukt");
    return data;
  }
  function remoteSpelerPayload() {
    const vrij=new Set([1]);
    voortgang.completed.forEach((klaar,index)=>{if(klaar&&index<4)vrij.add(index+2);});
    const speler=spelerMetId(huidigeSpelerId);
    (speler&&speler.vrijgespeeldeNiveaus||[]).forEach(level=>vrij.add(level));
    return {p_code:spelersCode(),p_progress:voortgang,p_score:score(),p_coins:voortgang.coins,p_completed_levels:voortgang.completed.map((klaar,index)=>klaar?index+1:null).filter(Boolean),p_unlocked_levels:Array.from(vrij),p_character:voortgang.character};
  }
  async function synchroniseerSpeler() {
    if(!huidigeSpelerId||!spelersCode())return;
    const nu=Date.now(), spelers=leesSpelers(), speler=spelers.find(item=>item.id===huidigeSpelerId);
    if(speler){speler.score=score();speler.coins=voortgang.coins;speler.voltooideNiveaus=voortgang.completed.filter(Boolean).length;speler.character=voortgang.character;speler.laatsteActiviteit=nu;speler.status="actief";bewaarSpelers(spelers);}
    laatsteActiviteitBijgewerkt=nu;
    try{await supabaseRpc("ve_save_player",remoteSpelerPayload());}catch(error){console.warn("Vape Escape cloud save:",error.message);}
  }
  function normaliseerRemoteSpeler(data){
    if(Array.isArray(data))return data[0]||null;
    if(data&&typeof data==="object"){
      if(data.player&&typeof data.player==="object")return normaliseerRemoteSpeler(data.player);
      if(data.data&&typeof data.data==="object")return normaliseerRemoteSpeler(data.data);
    }
    return data&&typeof data==="object"?data:null;
  }
  async function laadRemoteSpeler(code){return normaliseerRemoteSpeler(await supabaseRpc("ve_load_player",{p_code:code}));}
  function herstelRemoteVoortgang(data){
    const saved=data.progress&&typeof data.progress==="object"?data.progress:{};
    voortgang=legeVoortgang();
    if(Array.isArray(saved.completed))voortgang.completed=voortgang.completed.map((_,i)=>saved.completed[i]===true);
    if(saved.answers&&typeof saved.answers==="object")voortgang.answers=Object.fromEntries(Object.entries(saved.answers).filter(([k,v])=>validIdSet.has(k)&&typeof v==="boolean"));
    if(Number.isFinite(saved.coins))voortgang.coins=Math.max(0,saved.coins);
    if(saved.character&&typeof saved.character==="object")voortgang.character={...voortgang.character,...saved.character};
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(voortgang));}catch(error){}
  }
  async function controleerVerwijderd(){
    const code=spelersCode();if(!code||!huidigeSpelerId||dashboardMode)return;
    try{
      const data=await laadRemoteSpeler(code);
      if(!data){
        huidigeSpelerId=null;
        ["vape-escape-spelerscode","vape-escape-huidige-speler"].forEach(key=>localStorage.removeItem(key));
        sessionStorage.removeItem("vape-escape-sessie-speler");voortgang=legeVoortgang();gaNaar("start");
        window.alert("Je spelersaccount is verwijderd. Je bent teruggezet naar het hoofdmenu.");return;
      }
      const lijst=leesSpelers();
      let local=lijst.find(speler=>speler.id===huidigeSpelerId);
      if(!local){
        local={id:data.id||huidigeSpelerId,naam:data.name||data.naam||"Speler",character:data.character||{},score:Number(data.score)||0,coins:Number(data.coins)||0,voltooideNiveaus:Array.isArray(data.completed_levels)?data.completed_levels.length:0,vrijgespeeldeNiveaus:[1],status:"actief",laatsteActiviteit:Date.now()};
        lijst.push(local);
      }
      const remoteLevels=Array.isArray(data.unlocked_levels)?data.unlocked_levels.map(Number).filter(level=>Number.isInteger(level)&&level>=1&&level<=5):[1];
      const mergedLevels=Array.from(new Set([1,...(local.vrijgespeeldeNiveaus||[]),...remoteLevels])).sort((a,b)=>a-b);
      const changed=mergedLevels.length!==(local.vrijgespeeldeNiveaus||[]).length||mergedLevels.some((level,index)=>level!==(local.vrijgespeeldeNiveaus||[])[index]);
      local.vrijgespeeldeNiveaus=mergedLevels;
      local.naam=data.name||data.naam||local.naam||"Speler";
      local.score=Number(data.score)||0;
      local.coins=Number(data.coins)||0;
      local.character=data.character&&typeof data.character==="object"?data.character:local.character||{};
      local.voltooideNiveaus=Array.isArray(data.completed_levels)?data.completed_levels.length:local.voltooideNiveaus||0;
      bewaarSpelers(lijst);
      if(changed&&pagina==="kaart")render();
    }catch(error){console.warn("Vape Escape accountcontrole:",error.message);}
  }

  function registreerActiviteit() {
    const nu = Date.now();
    if (huidigeSpelerId && nu - laatsteActiviteitBijgewerkt >= 15000) synchroniseerSpeler();
  }

  async function startSpelerSessie(){
    const invoer=document.getElementById("speler-naam"),codeInvoer=document.getElementById("speler-code"),fout=document.getElementById("speler-naam-fout");
    const naam=invoer?invoer.value.trim().replace(/\\s+/g," ").slice(0,20):"",code=codeInvoer?codeInvoer.value.trim().toUpperCase():"";
    try{
      if(code){
        const data=await laadRemoteSpeler(code);if(!data)throw new Error("Deze spelerscode bestaat niet meer of is verwijderd.");
        localStorage.setItem("vape-escape-spelerscode",code);huidigeSpelerId=data.id;
        localStorage.setItem("vape-escape-huidige-speler",huidigeSpelerId);sessionStorage.setItem("vape-escape-sessie-speler",huidigeSpelerId);
        herstelRemoteVoortgang(data);const lijst=leesSpelers().filter(p=>p.id!==data.id);
        lijst.push({id:data.id,naam:data.name,score:data.score,coins:data.coins,voltooideNiveaus:(data.completed_levels||[]).length,vrijgespeeldeNiveaus:data.unlocked_levels||[1],character:data.character||{},status:"actief",laatsteActiviteit:Date.now()});
        bewaarSpelers(lijst);gaNaar("kaart");return;
      }
      if(naam.length<2)throw new Error("Vul een naam in of gebruik je bestaande spelerscode.");
      const nieuweCode="VE-"+Array.from(crypto.getRandomValues(new Uint8Array(12))).map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
      const data=await supabaseRpc("ve_create_player",{p_name:naam,p_code:nieuweCode});huidigeSpelerId=data.id;
      localStorage.setItem("vape-escape-spelerscode",nieuweCode);localStorage.setItem("vape-escape-laatste-naam",naam);
      localStorage.setItem("vape-escape-huidige-speler",huidigeSpelerId);sessionStorage.setItem("vape-escape-sessie-speler",huidigeSpelerId);
      voortgang=legeVoortgang();const lijst=leesSpelers();
      lijst.push({id:data.id,naam,character:voortgang.character,score:0,coins:0,voltooideNiveaus:0,vrijgespeeldeNiveaus:[1],status:"actief",aangemaaktOp:Date.now(),laatsteActiviteit:Date.now()});
      bewaarSpelers(lijst);await synchroniseerSpeler();
      window.alert("Je persoonlijke spelerscode is: "+nieuweCode+"\\nBewaar deze code goed. Je hebt hem nodig om op een ander apparaat verder te spelen.");
      gaNaar("kaart");
    }catch(error){if(fout)fout.textContent=error.message;}
  }

  function sluitSpelerSessie() {
    if (!huidigeSpelerId) return;
    const spelers = leesSpelers();
    const speler = spelers.find(item => item.id === huidigeSpelerId);
    if (speler) { speler.status = "offline"; speler.afgemeldOp = Date.now(); }
    bewaarSpelers(spelers);
    huidigeSpelerId = null;
    try { localStorage.removeItem("vape-escape-huidige-speler"); } catch (error) {}
  }

  function miniBink(speler) {
    const character = speler.character || {};
    const kleur = KARAKTER_KLEUREN.includes(character.kleur) ? character.kleur : "#39ff14";
    const accessoire = KARAKTER_ACCESSOIRES.includes(character.accessoire) ? character.accessoire : "geen";
    const effect = KARAKTER_EFFECTEN.includes(character.effect) ? character.effect : "neon";
    const karakterSvg = '<svg class="dashboard-bink" viewBox="0 0 160 170" role="img" aria-label="Bink van ' + escapeHtml(speler.naam) + '">' +
      '<ellipse cx="80" cy="157" rx="42" ry="7" fill="rgba(57,255,20,.16)"/>' +
      '<path d="M49 127 Q41 148 31 151 Q21 160 44 162 Q65 160 69 139Z" fill="' + kleur + '"/>' +
      '<path d="M93 139 Q99 160 122 162 Q143 158 129 151 Q115 149 111 126Z" fill="' + kleur + '"/>' +
      '<path d="M80 39 C111 39 131 60 131 101 C131 137 111 151 80 151 C49 151 29 137 29 101 C29 60 49 39 80 39Z" fill="' + kleur + '" stroke="#000" stroke-width="4"/>' +
      tekenAccessoireSvg(accessoire, kleur) +
      '<ellipse cx="63" cy="91" rx="5" ry="7" fill="#000"/><ellipse cx="98" cy="91" rx="5" ry="7" fill="#000"/>' +
      '<path d="M64 111 Q80 126 96 111" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M48 69 Q55 59 65 63" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="5" stroke-linecap="round"/>' +
      '</svg>';
    return '<span class="dashboard-bink-wrap" style="--bink-kleur:' + kleur + '">' + karakterSvg + '</span>' +
      '<span class="dashboard-bink-info"><strong>' + escapeHtml(character.naam || "Bink") + '</strong><small>' + escapeHtml(accessoire) + ' · ' + escapeHtml(effect) + '</small></span>';
  }

  function renderSpelerRij(speler, actief) {
    const levels = [1, 2, 3, 4, 5].map(level =>
      '<button class="dashboard-levelknop' + ((speler.vrijgespeeldeNiveaus || []).includes(level) ? ' vrij' : '') + '" type="button" data-action="dashboard-unlock" data-speler="' + escapeHtml(speler.id) + '" data-level="' + level + '" title="Niveau ' + level + ' vrijspelen">N' + level + '</button>'
    ).join("");
    return '<tr><td><strong>' + escapeHtml(speler.naam) + '</strong><small class="dashboard-subregel">' + (actief ? "ACTIEF" : "OFFLINE") + '</small></td>' +
      '<td><div class="dashboard-bink-rij">' + miniBink(speler) + '</div></td>' +
      '<td class="getal">' + Math.max(0, Number(speler.coins) || 0) + '</td><td class="getal">' + Math.max(0, Number(speler.score) || 0) + '</td>' +
      '<td><div class="dashboard-levels">' + levels + '</div></td>' +
      '<td><button class="knop knop-klein knop-secundair" type="button" data-action="dashboard-all" data-speler="' + escapeHtml(speler.id) + '">ALLES VRIJ</button> ' +
      '<button class="knop knop-klein knop-secundair" type="button" data-action="dashboard-remove" data-speler="' + escapeHtml(speler.id) + '">VERWIJDER</button></td></tr>';
  }

  function renderDashboardTabel(spelers, actief) {
    if (!spelers.length) return '<p class="dashboard-leeg">' + (actief ? "Er zijn op dit apparaat geen actieve spelers." : "Er staan nog geen offline spelers in het archief.") + '</p>';
    return '<div class="dashboard-tabel-scroll"><table class="dashboard-tabel"><thead><tr><th>Speler</th><th>Bink-karakter</th><th>Munten</th><th>Score</th><th>Niveaus vrijspelen</th><th>Beheer</th></tr></thead><tbody>' +
      spelers.map(speler => renderSpelerRij(speler, actief)).join("") + '</tbody></table></div>';
  }

  function renderScorebord(spelers) {
    if (!spelers.length) return '<p class="dashboard-leeg">De ranglijst is nog leeg. Zodra iemand begint, verschijnt die hier.</p>';
    return '<div class="dashboard-tabel-scroll"><table class="dashboard-tabel"><thead><tr><th>#</th><th>Speler</th><th>Bink</th><th>Munten</th><th>Score</th><th>Status</th></tr></thead><tbody>' +
      spelers.map((speler, index) => '<tr><td class="getal">' + (index + 1) + '</td>' +
        '<td><strong>' + escapeHtml(speler.naam) + '</strong></td>' +
        '<td><div class="dashboard-bink-rij">' + miniBink(speler) + '</div></td>' +
        '<td class="getal">' + Math.max(0, Number(speler.coins) || 0) + '</td>' +
        '<td class="getal">' + Math.max(0, Number(speler.score) || 0) + '</td>' +
        '<td><span class="dashboard-status">' + (speler.status === "actief" ? "ACTIEF" : "OFFLINE") + '</span></td></tr>'
      ).join("") + '</tbody></table></div>';
  }

  function renderScoreGrafiek(spelers) {
    const topSpelers = spelers.slice(0, 5).map(speler => ({
      naam: typeof speler.naam === "string" ? speler.naam : "Speler",
      score: Math.max(0, Number(speler.score) || 0)
    }));
    if (!topSpelers.length) {
      return '<div class="dashboard-grafiek-leeg">Zodra spelers punten verzamelen, verschijnt hier de scoreverdeling.</div>';
    }

    const maximum = Math.max(100, ...topSpelers.map(speler => speler.score));
    const punten = topSpelers.map((speler, index) => ({
      x: topSpelers.length === 1 ? 360 : 58 + (index / (topSpelers.length - 1)) * 620,
      y: 164 - (speler.score / maximum) * 116,
      score: speler.score,
      positie: index + 1
    }));
    const lijn = punten.map((punt, index) => (index ? "L " : "M ") + punt.x.toFixed(1) + " " + punt.y.toFixed(1)).join(" ");
    const vlak = "M " + punten[0].x.toFixed(1) + " 164 " +
      punten.map(punt => "L " + punt.x.toFixed(1) + " " + punt.y.toFixed(1)).join(" ") +
      " L " + punten[punten.length - 1].x.toFixed(1) + " 164 Z";
    const raster = [48, 86, 125, 164].map((y, index) => {
      const waarde = Math.round(maximum * (3 - index) / 3);
      return '<line x1="58" y1="' + y + '" x2="678" y2="' + y + '" class="dashboard-grafiek-raster"/>' +
        '<text x="48" y="' + (y + 4) + '" text-anchor="end" class="dashboard-grafiek-as">' + waarde + '</text>';
    }).join("");
    const puntenSvg = punten.map(punt =>
      '<circle cx="' + punt.x.toFixed(1) + '" cy="' + punt.y.toFixed(1) + '" r="5" class="dashboard-grafiek-punt">' +
      '<title>Positie ' + punt.positie + ': ' + punt.score + ' punten</title></circle>' +
      '<text x="' + punt.x.toFixed(1) + '" y="195" text-anchor="middle" class="dashboard-grafiek-as">#' + punt.positie + '</text>'
    ).join("");

    return '<div class="dashboard-grafiek-wrap">' +
      '<svg class="dashboard-grafiek-svg" viewBox="0 0 700 212" role="img" aria-label="Scoreverdeling van de vijf hoogst scorende spelers; horizontaal de rangpositie en verticaal het aantal punten.">' +
      '<defs><linearGradient id="dashboard-score-vulling" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0%" stop-color="#30D158" stop-opacity=".42"/><stop offset="100%" stop-color="#00E5FF" stop-opacity=".025"/>' +
      '</linearGradient></defs>' + raster +
      '<path d="' + vlak + '" fill="url(#dashboard-score-vulling)"/>' +
      '<path d="' + lijn + '" class="dashboard-grafiek-lijn"/>' +
      puntenSvg + '</svg>' +
      '<div class="dashboard-grafiek-legenda"><span><i></i> Score per rangpositie</span><span>Hoogste scores eerst</span></div>' +
      '</div>';
  }

  function renderDashboard() {
    if (!remoteSpelers) {
      return '<section class="pagina dashboard-pagina"><div class="dashboard-kop"><div><p class="bovenlabel">BEHEEROMGEVING</p><h1 class="titel-middel">Spelmonitor</h1><p class="subtitel">Voer de beheersleutel in om de centrale spelersgegevens te bekijken.</p></div></div><section class="paneel dashboard-sectie"><h2>Toegang vereist</h2><p>Er worden geen spelersgegevens getoond voordat de beheersleutel is gecontroleerd.</p><button class="knop knop-primair" type="button" data-action="dashboard-auth">BEHEERSLEUTEL INVOEREN</button></section></section>';
    }
    const spelers = werkSpelersStatusBij().filter(speler=>!speler.deleted_at).sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    const actief = spelers.filter(speler => speler.status === "actief");
    const offline = spelers.filter(speler => speler.status !== "actief");
    const munten = spelers.reduce((totaal, speler) => totaal + (Number(speler.coins) || 0), 0);
    const hoogsteScore = spelers.length ? Math.max(0, Number(spelers[0].score) || 0) : 0;
    return '<section class="pagina dashboard-pagina">' +
      '<div class="dashboard-kop"><div><p class="bovenlabel">BEHEEROMGEVING</p><h1 class="titel-middel">Spelmonitor</h1>' +
      '<p class="subtitel">Een duidelijk overzicht van spelers, prestaties en voortgang in Vape Escape.</p></div>' +
      '<div class="dashboard-header-acties"><span class="dashboard-archief-chip">' + offline.length + ' OFFLINE IN ARCHIEF</span>' +
      '<button class="knop knop-secundair" type="button" data-action="dashboard-auth">BEHEERSLEUTEL</button>' +
      '<button class="knop knop-secundair" type="button" data-action="dashboard-refresh">VERVERSEN</button></div></div>' +
      '<div class="dashboard-statistieken">' +
      '<div><span>ACTIEVE SPELERS</span><strong>' + actief.length + '</strong><small>Actief op alle apparaten</small></div>' +
      '<div><span>HOOGSTE SCORE</span><strong>' + hoogsteScore + '</strong><small>Punten op het scorebord</small></div>' +
      '<div><span>VERZAMELDE MUNTEN</span><strong>' + munten + '</strong><small>Over alle bewaarde entries</small></div>' +
      '</div>' +
      '<div class="dashboard-overzicht-grid">' +
      '<section class="paneel dashboard-grafiek-paneel"><div class="dashboard-sectie-kop"><div><span class="mini-label">SPELPRESTATIES</span><h2>Scoreoverzicht</h2><p>De vijf hoogste actuele scores, gerangschikt per positie.</p></div>' +
      '<span class="dashboard-status">TOP ' + Math.min(5, spelers.length) + ' SCORES</span></div>' +
      renderScoreGrafiek(spelers) + '</section>' +
      '<aside class="dashboard-zijpaneel" aria-label="Dashboardmeldingen">' +
      '<section class="dashboard-alert-card" role="note"><span class="dashboard-alert-label">BELANGRIJKE WAARSCHUWING</span>' +
      '<h2>Beveiliging</h2><p>De beheerlink is geen sterke beveiliging: de toegangscode staat in openbare websitecode. Deel de link niet als je het dashboard privé wilt houden.</p></section>' +
      '<section class="dashboard-zijkaart"><span class="mini-label">OFFLINE ARCHIEF</span><strong>' + offline.length + '</strong>' +
      '<p>Spelers die de website hebben verlaten of langer dan twee uur inactief zijn.</p></section>' +
      '<section class="dashboard-zijkaart dashboard-opslagkaart"><span class="mini-label">OPSLAGSTATUS</span><strong>Clouddatabase</strong>' +
      '<p>Spelersgegevens worden centraal opgeslagen en zijn beschikbaar op andere apparaten.</p></section>' +
      '</aside></div>' +
      '<section class="paneel dashboard-sectie"><div class="dashboard-sectie-kop"><div><span class="mini-label">RANGLIJST</span><h2>Scorebord</h2></div><span class="dashboard-status">HOOGSTE SCORE BOVENAAN</span></div>' + renderScorebord(spelers) + '</section>' +
      '<section class="paneel dashboard-sectie"><div class="dashboard-sectie-kop"><div><span class="mini-label">LIVE OVERZICHT</span><h2>Actieve spelers</h2></div><span class="dashboard-status">WORDT BIJGEWERKT</span></div>' + renderDashboardTabel(actief, true) + '</section>' +
      '<section class="paneel dashboard-sectie"><div class="dashboard-sectie-kop"><div><span class="mini-label">BEWAARDE GEGEVENS</span><h2>Offline spelers</h2></div><span class="mini-label">NA VERTREK OF 2 UUR INACTIEF</span></div>' + renderDashboardTabel(offline, false) + '</section>' +
      '<div class="rij-knoppen"><button class="knop knop-secundair" type="button" data-action="dashboard-game">TERUG NAAR DE GAME</button><button class="knop knop-secundair" type="button" data-action="dashboard-clear">VERWIJDER ALLE ENTRIES</button></div></section>';
  }
  async function laadDashboardCloud(){
    if(!remoteAdminKey)return;
    try{
      const response=await fetch(ADMIN_FUNCTION_URL,{headers:{"x-admin-key":remoteAdminKey,apikey:SUPABASE_KEY}});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||data.message||"Dashboard laden mislukt");
      const rows=Array.isArray(data.players)?data.players:(Array.isArray(data.data)?data.data:[]);
      remoteSpelers=rows.map(speler=>({
        ...speler,
        id:speler.id||speler.player_id||"",
        name:String(speler.name||speler.naam||speler.player_name||"Onbekende speler"),
        score:Number(speler.score)||0,
        coins:Number(speler.coins)||0,
        unlocked_levels:Array.isArray(speler.unlocked_levels)?speler.unlocked_levels.map(Number).filter(level=>Number.isInteger(level)&&level>=1&&level<=5):[1],
        completed_levels:Array.isArray(speler.completed_levels)?speler.completed_levels:[],
        character:speler.character&&typeof speler.character==="object"?speler.character:{}
      }));
    }catch(error){
      remoteSpelers=null;
      window.alert("Dashboardfout: "+error.message);
    }
    if(pagina==="dashboard")render();
  }
  async function verwerkDashboardActie(knop){
    const actie=knop.dataset.action;
    if(actie==="dashboard-auth"){const entered=window.prompt("Voer de Vape Escape dashboard-beheersleutel in:");if(!entered)return;remoteAdminKey=entered.trim();try{sessionStorage.setItem("ve-dashboard-key",remoteAdminKey);}catch(error){}await laadDashboardCloud();return;}
    if(actie==="dashboard-refresh"){await laadDashboardCloud();return;}
    if(actie==="dashboard-game"){window.location.href=window.location.pathname;return;}
    if(["dashboard-remove","dashboard-all","dashboard-unlock"].includes(actie)){
      if(!remoteAdminKey){window.alert("Voer eerst de beheersleutel in.");return;}
      const body={id:knop.dataset.speler,action:actie==="dashboard-remove"?"delete":actie==="dashboard-all"?"all":"unlock",level:Number(knop.dataset.level)};
      if(actie==="dashboard-remove"&&!window.confirm("Deze speler verwijderen? Alle apparaten worden bij de volgende controle naar het hoofdmenu gestuurd."))return;
      try{
        const response=await fetch(ADMIN_FUNCTION_URL,{method:"POST",headers:{"x-admin-key":remoteAdminKey,apikey:SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify(body)});
        const data=await response.json().catch(()=>({}));
        if(!response.ok||data.ok===false)throw new Error(data.error||data.message||"Actie mislukt");
        await laadDashboardCloud();
        if(remoteSpelers&&pagina==="dashboard")render();
      }catch(error){window.alert(error.message);}
    }
  }

  function renderProfiel() {
    const speler = spelerMetId(huidigeSpelerId);
    if (!speler) return '<section class="pagina"><div class="paneel afrond-kaart"><h1 class="titel-middel">Geen actieve speler</h1><p>Ga terug naar het hoofdmenu en vul je naam in om een nieuwe missie te starten.</p><button class="knop knop-primair" type="button" data-action="naar-start">NAAR START</button></div></section>';
    return '<section class="pagina profiel-pagina"><div class="terugrij"><button class="tekstknop" type="button" data-action="naar-kaart">← Missiekaart</button><span class="mini-label">JOUW SPELERSPROFIEL</span></div>' +
      '<div class="paneel profiel-paneel"><div class="profiel-karakter">' + miniBink(speler) + '</div><p class="bovenlabel">DIT BEN JIJ</p><h1 class="titel-middel">' + escapeHtml(speler.naam) + '</h1>' +
      '<div class="dashboard-statistieken"><div><strong>' + speler.coins + '</strong><span>MUNTEN</span></div><div><strong>' + speler.score + '</strong><span>PUNTEN</span></div><div><strong>' + speler.voltooideNiveaus + ' / 5</strong><span>NIVEAUS KLAAR</span></div><div><strong>' + (speler.vrijgespeeldeNiveaus || [1]).length + ' / 5</strong><span>NIVEAUS VRIJ</span></div></div>' +
      '<p class="dashboard-waarschuwing">Je spelerscode: <strong>' + escapeHtml(spelersCode()) + '</strong>. Bewaar deze code om op andere apparaten verder te spelen. Je voortgang wordt automatisch online opgeslagen.</p></div></section>';
  }

  function bewaarVoortgang() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(voortgang)); } catch (error) {}
    synchroniseerSpeler();
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
    const speler = spelerMetId(huidigeSpelerId);
    const handmatigVrij = speler && Array.isArray(speler.vrijgespeeldeNiveaus) && speler.vrijgespeeldeNiveaus.includes(index + 1);
    return index === 0 || voortgang.completed[index - 1] === true || handmatigVrij;
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
    try { sessionStorage.setItem("vape-escape-huidige-pagina", nieuwePagina); } catch (error) {}
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
      '<form class="speler-start-form" id="start-form">',
      '<label for="speler-naam">VUL EERST JE NAAM IN</label>',
      '<input id="speler-naam" name="naam" maxlength="20" minlength="2" autocomplete="nickname" placeholder="Jouw naam">',
      '<label for="speler-code">BESTAANDE SPELERSCODE (OPTIONEEL)</label>',
      '<input id="speler-code" name="code" maxlength="40" autocomplete="off" placeholder="VE-... om verder te spelen">',
      '<p id="speler-naam-fout" class="form-fout" aria-live="polite"></p>',
      '<button class="knop knop-primair" type="submit" id="start-knop">START DE MISSIE <span class="knop-pijl">→</span></button>',
      '</form>',
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
      '<div class="rij-knoppen" style="margin-top:22px"><button class="knop knop-primair" type="button" data-action="naar-start">TERUG — VUL JE NAAM IN <span class="knop-pijl">→</span></button></div></div>' +
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
      '<div class="terugrij">' + terugKnop("Hoofdmenu", "naar-start") + '<div class="rij-knoppen"><button class="tekstknop" type="button" data-action="profiel">MIJN PROFIEL</button><button class="tekstknop" type="button" data-action="reset">↻ Opnieuw beginnen</button></div></div>' +
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
    if (accessoire === "kroon") return '<path d="M49 50 L43 27 L67 42 L80 19 L94 42 L117 27 L111 52Z" fill="#faff00" stroke="#423d38" stroke-width="3"/><path d="M49 52 H111" stroke="#423d38" stroke-width="3"/>';
    if (accessoire === "koptelefoon") return '<path d="M43 76 V64 Q43 24 80 24 Q117 24 117 64 V76" fill="none" stroke="#efffed" stroke-width="8"/><rect x="35" y="68" width="16" height="27" rx="7" fill="#00f5ff" stroke="#000" stroke-width="2"/><rect x="109" y="68" width="16" height="27" rx="7" fill="#00f5ff" stroke="#000" stroke-width="2"/>';
    if (accessoire === "bril") return '<g fill="none" stroke="#000" stroke-width="5"><circle cx="62" cy="91" r="13"/><circle cx="98" cy="91" r="13"/><path d="M75 91 H85"/></g>';
    if (accessoire === "cape") return '<path d="M48 80 L19 143 Q80 164 141 143 L112 80Z" fill="#ff00e5" opacity=".9" stroke="#000" stroke-width="3"/>';
    if (accessoire === "vleugels") return '<path d="M42 95 Q3 50 11 112 Q20 138 48 119 M118 95 Q157 50 149 112 Q140 138 112 119" fill="#00f5ff" stroke="#000" stroke-width="3"/>';
    if (accessoire === "antenne") return '<path d="M80 42 L80 11" stroke="#faff00" stroke-width="5"/><circle cx="80" cy="9" r="9" fill="#faff00" stroke="#000" stroke-width="2"/>';
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
      (voortgang.character.effect === "neon" ? '<circle cx="80" cy="96" r="66" fill="none" stroke="' + kleur + '" stroke-width="3" stroke-dasharray="8 6"/>' : voortgang.character.effect === "sterren" ? '<g fill="#faff00"><path d="M23 47l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/><path d="M135 52l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M126 132l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></g>' : voortgang.character.effect === "vonken" ? '<g stroke="' + kleur + '" stroke-width="4" stroke-linecap="round"><path d="M15 82l12 0m-6-6v12M133 82h12m-6-6v12M80 8v12m-6-6h12"/></g>' : '<g fill="#d8eaff"><circle cx="17" cy="117" r="7"/><circle cx="27" cy="109" r="9"/><circle cx="39" cy="117" r="7"/><circle cx="121" cy="117" r="7"/><circle cx="133" cy="109" r="9"/><circle cx="143" cy="117" r="7"/></g>') +
      '</svg>';
  }

  function renderRunnerAanpassen() {
    const kleuren = [
      { kleur: "#39ff14", naam: "Neon groen" },
      { kleur: "#00f5ff", naam: "Neon blauw" },
      { kleur: "#ff00e5", naam: "Neon roze" },
      { kleur: "#a020f0", naam: "Neon paars" },
      { kleur: "#faff00", naam: "Neon geel" }
    ];
    const accessoires = [
      { id: "geen", naam: "Geen" },
      { id: "pet", naam: "Pet" },
      { id: "kroon", naam: "Kroon" },
      { id: "koptelefoon", naam: "Koptelefoon" },
      { id: "bril", naam: "Neonbril" },
      { id: "cape", naam: "Cape" },
      { id: "vleugels", naam: "Vleugels" },
      { id: "antenne", naam: "Antenne" }
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
      '<div class="runner-preview"><div id="runner-preview-beeld" class="runner-preview-beeld">' + karakterVoorbeeldSvg() + '</div><strong id="runner-preview-naam">' + escapeHtml(voortgang.character.naam) + '</strong><span>Deelnemer aan de hindernisbaan</span></div>' +
      '<label class="runner-label" for="runner-naam">Naam van je karakter</label>' +
      '<input class="runner-invoer" id="runner-naam" maxlength="16" value="' + escapeHtml(voortgang.character.naam) + '" placeholder="Vul een naam in">' +
      '<span class="runner-label">Kies een kleur</span><div class="runner-kleuren">' + kleurKnoppen + '</div>' +
      '<span class="runner-label">Kies een accessoire</span><div class="runner-accessoires">' + accessoireKnoppen + '</div>' +
      '<span class="runner-label">Kies een effect</span><div class="runner-accessoires">' +
      KARAKTER_EFFECTEN.map(effect => '<button type="button" class="runner-accessoire runner-effect' + ((voortgang.character.effect || "neon") === effect ? ' gekozen' : '') + '" data-action="runner-effect" data-effect="' + effect + '" aria-pressed="' + ((voortgang.character.effect || "neon") === effect) + '">' + ({ neon: "Neongloed", vonken: "Vonken", sterren: "Sterren", wolken: "Wolken" }[effect]) + '</button>').join("") +
      '</div>' +
      '</div>' +
      '<div class="runner-uitleg-kolom">' +
      '<div class="paneel runner-uitleg"><span class="mini-label">DE OPDRACHT</span><h2>Verzamel 10 munten</h2><p>Ontwijk de snelle vape-obstakels en verzamel de zeldzame munten. Je hebt vijf levens. Verzamel alle tien om te winnen.</p><div class="runner-statistieken"><div><strong>5</strong><span>LEVENS</span></div><div><strong>10</strong><span>MUNTEN NODIG</span></div><div><strong>+30</strong><span>BONUSPUNTEN</span></div></div></div>' +
      '<div class="paneel runner-uitleg"><span class="mini-label">BESTURING</span><div class="runner-besturing-regel"><kbd>←</kbd><kbd>→</kbd><span>Wissel van baan met de pijltjestoetsen</span></div><div class="runner-besturing-regel"><kbd>A</kbd><kbd>D</kbd><span>Of gebruik de A- en D-toets</span></div><div class="runner-besturing-regel"><span class="runner-aanraak">LINKS / RECHTS</span><span>Op een telefoon gebruik je de knoppen op het scherm</span></div></div>' +
      '<button class="knop knop-primair runner-startknop" type="button" data-action="runner-start">START DE HINDERNISBAAN →</button>' +
      '<p class="runner-record">Beste resultaat: <strong>' + Math.floor(voortgang.runnerBest) + ' van 10 munten</strong></p>' +
      '</div></div></section>';
  }

  function renderRunnerSpel() {
    return '<section class="pagina runner-pagina">' +
      '<div class="runner-hud"><button class="tekstknop" type="button" data-action="runner-stop">← Stop en terug</button>' +
      '<div class="runner-hud-stat"><span>LEVENS</span><strong id="runner-levens">● ● ● ● ●</strong></div>' +
      '<div class="runner-hud-stat"><span>MUNTEN</span><strong id="runner-tijd">0 / 10</strong></div>' +
      '<div class="runner-hud-stat"><span>TIJD</span><strong id="runner-klok">00:00</strong></div></div>' +
      '<div class="paneel runner-speelveld"><div class="runner-canvas-omhulsel"><canvas id="runner-canvas" width="960" height="520" aria-label="Hindernisbaan met drie banen. Ontwijk vape-obstakels en verzamel tien zeldzame munten."></canvas><div class="runner-canvas-ondertekst">ONTWIJK DE VAPES · VERZAMEL 10 ZELDZAME MUNTEN</div></div>' +
      '<div class="runner-aanraakbediening"><button type="button" data-action="runner-links" aria-label="Beweeg naar links">← LINKS</button><button type="button" data-action="runner-rechts" aria-label="Beweeg naar rechts">RECHTS →</button></div></div>' +
      '<p class="runner-spelhint">Tip: wissel soepel van baan en let goed op de munten. Vapes komen steeds sneller.</p>' +
      '</section>';
  }

  function renderRunnerMislukt() {
    return '<section class="pagina"><div class="paneel afrond-kaart runner-resultaat">' +
      '<div class="afrond-embleem runner-verlies">!</div><p class="bovenlabel" style="justify-content:center">POGING VOORBIJ</p>' +
      '<h1 class="titel-middel">Je levens zijn op</h1>' +
      '<p>Je hebt ' + runner.muntenVerzameld + ' van de 10 munten gevonden. Pas je route aan en probeer het opnieuw.</p>' +
      '<div class="afrond-statistieken"><div class="statistiek"><strong>0</strong><span>Levens over</span></div><div class="statistiek"><strong>' + runner.muntenVerzameld + ' / 10</strong><span>Munten verzameld</span></div><div class="statistiek"><strong>' + Math.floor(voortgang.runnerBest) + ' / 10</strong><span>Beste record</span></div></div>' +
      '<div class="rij-knoppen"><button class="knop knop-secundair" type="button" data-action="naar-kaart">MISSIEKAART</button><button class="knop knop-primair" type="button" data-action="runner-start">OPNIEUW PROBEREN ↻</button></div>' +
      '</div></section>';
  }

  function beginRunner() {
    stopRunnerLoop();
    runner = {
      actief: true, frame: null, vorigeTijd: 0, verstreken: 0, spawnTijd: 0,
      muntSpawnTijd: 0, volgendeMunt: 3.1 + Math.random() * 2.1,
      baan: 1, doelBaan: 1, levens: 5, obstakels: [], munten: [], deeltjes: [],
      muntenVerzameld: 0, onkwetsbaarTot: 0, spring: 0, teller: 0, laatsteBaan: -1
    };
    gaNaar("runner-spel");
  }

  function stopRunnerLoop() {
    runner.actief = false;
    if (runner.frame !== null && window.cancelAnimationFrame) window.cancelAnimationFrame(runner.frame);
    runner.frame = null;
  }

  function runnerBaanX(baan, y) {
    const verhouding = Math.max(0, Math.min(1, y / 520));
    const boven = [403, 480, 557], onder = [245, 480, 715];
    const positie = Math.max(0, Math.min(2, baan));
    const links = Math.floor(positie), rechts = Math.min(2, links + 1), fractie = positie - links;
    const x1 = boven[links] + (onder[links] - boven[links]) * verhouding;
    const x2 = boven[rechts] + (onder[rechts] - boven[rechts]) * verhouding;
    return x1 + (x2 - x1) * fractie;
  }

  function maakRunnerWolk(x, y, hoeveelheid) {
    for (let i = 0; i < hoeveelheid; i++) {
      runner.deeltjes.push({
        x: x + (Math.random() - .5) * 20, y: y + (Math.random() - .5) * 10,
        dx: (Math.random() - .5) * 48, dy: -18 - Math.random() * 38,
        leven: .42 + Math.random() * .32, maxLeven: .75, grootte: 4 + Math.random() * 7
      });
    }
  }

  function tekenRunnerWolkjes(ctx, delta) {
    runner.deeltjes = runner.deeltjes.filter(deeltje => deeltje.leven > 0);
    runner.deeltjes.forEach(deeltje => {
      deeltje.x += deeltje.dx * delta;
      deeltje.y += deeltje.dy * delta;
      deeltje.leven -= delta;
      ctx.save();
      ctx.globalAlpha = Math.max(0, deeltje.leven / deeltje.maxLeven) * .68;
      ctx.fillStyle = "#d8ffd0"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(deeltje.x, deeltje.y, deeltje.grootte, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  }

  function tekenRunnerVape(ctx, obstakel) {
    const x = runnerBaanX(obstakel.baan, obstakel.y);
    const schaal = .72 + Math.max(0, obstakel.y / 520) * .5;
    const breedte = 31 * schaal, hoogte = 67 * schaal;
    ctx.save();
    ctx.translate(x, obstakel.y);
    ctx.rotate(Math.sin(obstakel.teller || 0) * .07);
    ctx.fillStyle = "rgba(57,255,20,.10)";
    ctx.beginPath(); ctx.ellipse(0, hoogte * .48, breedte * .85, 6 * schaal, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#020702"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.roundRect(-breedte / 2, -hoogte / 2, breedte, hoogte, 8 * schaal); ctx.fill();
    ctx.shadowBlur = 0; ctx.strokeStyle = "#39ff14"; ctx.lineWidth = 2 * schaal; ctx.stroke();
    ctx.fillStyle = "#39ff14";
    ctx.beginPath(); ctx.roundRect(-breedte / 2 + 4 * schaal, -hoogte / 2 - 5 * schaal, breedte - 8 * schaal, 8 * schaal, 3 * schaal); ctx.fill();
    ctx.beginPath(); ctx.roundRect(-breedte / 2 + 3 * schaal, -4 * schaal, breedte - 6 * schaal, 19 * schaal, 3 * schaal); ctx.fill();
    ctx.strokeStyle = "#020502"; ctx.lineWidth = 3 * schaal; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-7 * schaal, 0); ctx.lineTo(7 * schaal, 11 * schaal); ctx.moveTo(7 * schaal, 0); ctx.lineTo(-7 * schaal, 11 * schaal); ctx.stroke();
    ctx.fillStyle = "#ff1744";
    ctx.beginPath(); ctx.moveTo(0, -hoogte / 2 - 10 * schaal); ctx.lineTo(-9 * schaal, -hoogte / 2 + 3 * schaal); ctx.lineTo(9 * schaal, -hoogte / 2 + 3 * schaal); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function tekenRunnerMunt(ctx, munt) {
    const x = runnerBaanX(munt.baan, munt.y), y = munt.y + Math.sin(munt.teller * 3) * 4;
    const schaal = .72 + Math.max(0, munt.y / 520) * .35;
    ctx.save(); ctx.translate(x, y); ctx.scale(schaal, schaal);
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.fillStyle = "#faff00";
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.strokeStyle = "#fffca8"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#000"; ctx.font = "900 17px ui-sans-serif, system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("V", 0, 1); ctx.restore();
  }

  function tekenRunnerKarakter(ctx, tijd) {
    const x = runnerBaanX(runner.baan, 440);
    const voortgangSprong = runner.spring > 0 ? 1 - runner.spring / .72 : 0;
    const springHoogte = runner.spring > 0 ? Math.sin(voortgangSprong * Math.PI) * 40 : 0;
    const y = 423 - springHoogte + Math.sin(tijd * 8) * 2;
    const kleur = voortgang.character.kleur;
    const knipper = runner.verstreken < runner.onkwetsbaarTot && Math.floor(tijd * 15) % 2 === 0;
    if (knipper) return;
    ctx.save(); ctx.translate(x, y);
    if (runner.spring > 0) ctx.rotate(voortgangSprong * Math.PI * 2);
    ctx.fillStyle = "rgba(57,255,20,.14)";
    ctx.beginPath(); ctx.ellipse(0, 31 + springHoogte * .18, 28, 7, 0, 0, Math.PI * 2); ctx.fill();
    const accessoire = voortgang.character.accessoire;
    if (accessoire === "cape") {
      ctx.fillStyle = "#ff00e5"; ctx.beginPath(); ctx.moveTo(-14,-15); ctx.quadraticCurveTo(-40,22,-27,30); ctx.lineTo(0,22); ctx.lineTo(27,30); ctx.quadraticCurveTo(40,22,14,-15); ctx.closePath(); ctx.fill();
    }
    if (accessoire === "vleugels") {
      ctx.fillStyle = "#00f5ff"; ctx.beginPath(); ctx.moveTo(-18,-5); ctx.quadraticCurveTo(-55,-30,-45,17); ctx.quadraticCurveTo(-30,35,-15,15); ctx.fill();
      ctx.beginPath(); ctx.moveTo(18,-5); ctx.quadraticCurveTo(55,-30,45,17); ctx.quadraticCurveTo(30,35,15,15); ctx.fill();
    }
    ctx.fillStyle = kleur; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.ellipse(0, 0, 23, 28, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = "#000"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(-8,-4,3,0,Math.PI*2); ctx.arc(8,-4,3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = "#000"; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-7,8); ctx.quadraticCurveTo(0,15,7,8); ctx.stroke();
    if (accessoire === "pet") {
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(0,-20,17,Math.PI,0); ctx.fill(); ctx.fillRect(-18,-22,36,5);
    } else if (accessoire === "kroon") {
      ctx.fillStyle = "#faff00"; ctx.beginPath(); ctx.moveTo(-15,-20); ctx.lineTo(-19,-37); ctx.lineTo(-7,-28); ctx.lineTo(0,-43); ctx.lineTo(7,-28); ctx.lineTo(19,-37); ctx.lineTo(15,-20); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#000"; ctx.stroke();
    } else if (accessoire === "koptelefoon") {
      ctx.strokeStyle = "#000"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0,-4,23,Math.PI,0); ctx.stroke();
      ctx.fillStyle = "#00f5ff"; ctx.fillRect(-25,-7,7,18); ctx.fillRect(18,-7,7,18);
    } else if (accessoire === "bril") {
      ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-8,-3,8,0,Math.PI*2); ctx.arc(8,-3,8,0,Math.PI*2); ctx.stroke();
    } else if (accessoire === "antenne") {
      ctx.strokeStyle = "#faff00"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0,-25); ctx.lineTo(0,-39); ctx.stroke();
      ctx.fillStyle = "#faff00"; ctx.beginPath(); ctx.arc(0,-42,4,0,Math.PI*2); ctx.fill();
    }
    if (voortgang.character.effect === "neon") {
      ctx.strokeStyle = kleur; ctx.lineWidth = 3; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.ellipse(0, 0, 36, 43, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = kleur; for (let i = 0; i < 4; i++) { const hoek = tijd * 1.8 + i * Math.PI / 2; ctx.beginPath(); ctx.arc(Math.cos(hoek) * 43, Math.sin(hoek) * 49, 3.5, 0, Math.PI * 2); ctx.fill(); }
    } else if (voortgang.character.effect === "sterren") {
      ctx.fillStyle = "#faff00";
      for (let i=0;i<3;i++){const hoek=tijd*2+i*Math.PI*2/3;ctx.beginPath();ctx.arc(Math.cos(hoek)*32,Math.sin(hoek)*30,2.5,0,Math.PI*2);ctx.fill();}
    } else if (voortgang.character.effect === "vonken") {
      ctx.strokeStyle = kleur; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-27,17); ctx.lineTo(-36,24); ctx.moveTo(27,17); ctx.lineTo(36,24); ctx.stroke();
    } else if (voortgang.character.effect === "wolken") {
      ctx.fillStyle = "#d8ffd0"; ctx.beginPath(); ctx.arc(-29,25,5,0,Math.PI*2); ctx.arc(29,25,5,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  function tekenRunnerWereld(ctx, delta) {
    const breedte = 960, hoogte = 520;
    ctx.clearRect(0,0,breedte,hoogte); ctx.fillStyle = "#000"; ctx.fillRect(0,0,breedte,hoogte);
    const lucht = ctx.createLinearGradient(0,0,0,hoogte);
    lucht.addColorStop(0,"#020502"); lucht.addColorStop(1,"#061006"); ctx.fillStyle = lucht; ctx.fillRect(0,0,breedte,hoogte);
    ctx.fillStyle = "rgba(57,255,20,.12)"; ctx.beginPath(); ctx.arc(480,85,94,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = "#071407"; ctx.beginPath(); ctx.moveTo(365,0);ctx.lineTo(595,0);ctx.lineTo(870,520);ctx.lineTo(90,520);ctx.closePath();ctx.fill();
    ctx.fillStyle = "#020502"; ctx.beginPath(); ctx.moveTo(380,0);ctx.lineTo(580,0);ctx.lineTo(820,520);ctx.lineTo(140,520);ctx.closePath();ctx.fill();
    ctx.strokeStyle = "rgba(57,255,20,.95)"; ctx.lineWidth = 4;ctx.beginPath();ctx.moveTo(365,0);ctx.lineTo(90,520);ctx.moveTo(595,0);ctx.lineTo(870,520);ctx.stroke();
    ctx.strokeStyle = "rgba(57,255,20,.2)";ctx.lineWidth=2;ctx.setLineDash([13,13]);ctx.beginPath();ctx.moveTo(440,0);ctx.lineTo(360,520);ctx.moveTo(520,0);ctx.lineTo(600,520);ctx.stroke();ctx.setLineDash([]);
    for(let i=0;i<9;i++){const y=(i*83+runner.verstreken*235)%520;const alpha=.08+y/520*.18;ctx.fillStyle="rgba(57,255,20,"+alpha+")";ctx.fillRect(102+y*.5,y,7,3);ctx.fillRect(851-y*.5,y,7,3);}
    runner.munten.forEach(munt=>tekenRunnerMunt(ctx,munt));
    runner.obstakels.forEach(obstakel=>tekenRunnerVape(ctx,obstakel));
    tekenRunnerWolkjes(ctx,delta||0);
    tekenRunnerKarakter(ctx,runner.verstreken);
    if(runner.verstreken<runner.onkwetsbaarTot){ctx.strokeStyle="rgba(57,255,20,.65)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(runnerBaanX(runner.baan,440),423,38+Math.sin(runner.verstreken*18)*4,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle="#d7ffd1";ctx.font="700 14px ui-sans-serif, system-ui";ctx.textAlign="center";ctx.shadowColor="transparent";ctx.shadowBlur=0;
    ctx.fillText("WISSEL VAN BAAN · VIND DE 10 MUNTEN",480,28);ctx.shadowBlur=0;
  }

  function werkRunnerHudBij() {
    const levens=document.getElementById("runner-levens"), munten=document.getElementById("runner-tijd"), klok=document.getElementById("runner-klok");
    if(levens){levens.innerHTML=[0,1,2,3,4].map(i=>'<span class="runner-leven '+(i<runner.levens?'actief':'verloren')+'">●</span>').join("");levens.setAttribute("aria-label",runner.levens+" van de 5 levens over");}
    if(munten)munten.textContent=runner.muntenVerzameld+" / "+RUNNER_GOAL_COINS;
    if(klok){const min=Math.floor(runner.verstreken/60),sec=Math.floor(runner.verstreken%60);klok.textContent=String(min).padStart(2,"0")+":"+String(sec).padStart(2,"0");}
  }

  function beweegRunner(richting) {
    if(pagina!=="runner-spel"||!runner.actief)return;
    const oud=runner.doelBaan;runner.doelBaan=Math.max(0,Math.min(2,runner.doelBaan+richting));
    if(runner.doelBaan!==oud){runner.spring=.72;maakRunnerWolk(runnerBaanX(runner.baan,440),450,7);}
    registreerActiviteit();
  }

  function beeindigRunner(gewonnen) {
    if(!runner.actief)return;
    runner.actief=false;
    if(runner.frame!==null&&window.cancelAnimationFrame)window.cancelAnimationFrame(runner.frame);
    runner.frame=null;
    voortgang.runnerBest=Math.max(voortgang.runnerBest,runner.muntenVerzameld);
    if(gewonnen){voortgang.answers["runner-clear"]=true;voortgang.completed[4]=true;bewaarVoortgang();speelGeluid(true);gaNaar("eind");}
    else{bewaarVoortgang();speelGeluid(false);gaNaar("runner-mislukt");}
  }

  function stapRunner(tijdstip) {
    if(!runner.actief||pagina!=="runner-spel")return;
    if(!runner.vorigeTijd)runner.vorigeTijd=tijdstip;
    const delta=Math.min(.05,Math.max(0,(tijdstip-runner.vorigeTijd)/1000));
    runner.vorigeTijd=tijdstip;runner.verstreken+=delta;runner.spawnTijd+=delta;runner.muntSpawnTijd+=delta;
    const versnelling=runner.verstreken*2.4,spawnInterval=Math.max(.48,.78-runner.verstreken*.0035);
    if(runner.spawnTijd>=spawnInterval){
      runner.spawnTijd=0;let baan=Math.floor(Math.random()*3);
      if(baan===runner.laatsteBaan)baan=(baan+1+Math.floor(Math.random()*2))%3;
      runner.laatsteBaan=baan;
      runner.obstakels.push({baan,y:-60,snelheid:265+versnelling+Math.random()*24,teller:Math.random()*6,geraakt:false});
    }
    if(runner.muntSpawnTijd>=runner.volgendeMunt){
      runner.muntSpawnTijd=0;runner.volgendeMunt=3.1+Math.random()*2.1;
      const vrij=[0,1,2].filter(baan=>!runner.obstakels.some(o=>o.baan===baan&&o.y>-100&&o.y<120));
      if(vrij.length)runner.munten.push({baan:vrij[Math.floor(Math.random()*vrij.length)],y:-28,snelheid:210+versnelling*.35,teller:Math.random()*5});
    }
    runner.baan+=(runner.doelBaan-runner.baan)*(1-Math.exp(-delta*14));
    if(Math.abs(runner.doelBaan-runner.baan)<.006)runner.baan=runner.doelBaan;
    if(runner.spring>0)runner.spring=Math.max(0,runner.spring-delta);
    runner.obstakels.forEach(obstakel=>{
      obstakel.y+=obstakel.snelheid*delta;obstakel.teller+=delta*6;
      if(!obstakel.geraakt&&obstakel.y>345&&obstakel.y<380&&Math.abs(obstakel.baan-runner.baan)<.34){
        obstakel.geraakt=true;
        if(runner.verstreken>=runner.onkwetsbaarTot){runner.levens-=1;runner.onkwetsbaarTot=runner.verstreken+1.1;maakRunnerWolk(runnerBaanX(runner.baan,440),425,5);}
      }
    });
    // Remove vape obstacles before their sprite can overlap Bink.
    runner.obstakels=runner.obstakels.filter(o=>o.y<380&&!o.geraakt);
    runner.munten.forEach(munt=>{
      munt.y+=munt.snelheid*delta;munt.teller+=delta;
      if(!munt.verzameld&&munt.y>370&&munt.y<400&&Math.abs(munt.baan-runner.baan)<.40){
        munt.verzameld=true;runner.muntenVerzameld+=1;voortgang.coins+=1;
        maakRunnerWolk(runnerBaanX(runner.baan,440),410,10);bewaarVoortgang();speelGeluid(true);
      }
    });
    runner.munten=runner.munten.filter(m=>m.y<402&&!m.verzameld);
    const canvas=document.getElementById("runner-canvas");
    if(canvas){const ctx=canvas.getContext("2d");if(ctx)tekenRunnerWereld(ctx,delta);}
    werkRunnerHudBij();
    if(runner.levens<=0){beeindigRunner(false);return;}
    if(runner.muntenVerzameld>=RUNNER_GOAL_COINS){beeindigRunner(true);return;}
    runner.frame=window.requestAnimationFrame(stapRunner);
  }

  function startRunnerLoop() {
    if(!runner.actief||runner.frame!==null)return;
    runner.vorigeTijd=0;werkRunnerHudBij();runner.frame=window.requestAnimationFrame(stapRunner);
  }

  function render() {
    let inhoud = "";
    if (pagina === "dashboard") inhoud = renderDashboard();
    else if (pagina === "profiel") inhoud = renderProfiel();
    else if (pagina === "start") inhoud = renderStart();
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
    try {
      sessionStorage.setItem("vape-escape-huidig-level", String(index));
      sessionStorage.setItem("vape-escape-huidige-vraag", "0");
    } catch (error) {}
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
      try { sessionStorage.setItem("vape-escape-huidige-vraag", String(huidigeVraag)); } catch (error) {}
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
    if (knopElement.id === "hoe-knop") {
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
        werkKarakterVoorbeeldBij();
      }
    } else if (knopElement.dataset.action === "runner-accessoire") {
      const accessoire = knopElement.dataset.accessoire;
      if (KARAKTER_ACCESSOIRES.includes(accessoire)) {
        voortgang.character.accessoire = accessoire;
        bewaarVoortgang();
        werkKarakterVoorbeeldBij();
      }
    } else if (knopElement.dataset.action === "runner-effect") {
      const effect = knopElement.dataset.effect;
      if (KARAKTER_EFFECTEN.includes(effect)) {
        voortgang.character.effect = effect;
        bewaarVoortgang();
        werkKarakterVoorbeeldBij();
      }
    } else if (knopElement.dataset.action === "profiel") {
      gaNaar("profiel");
    } else if ((knopElement.dataset.action || "").startsWith("dashboard-")) {
      verwerkDashboardActie(knopElement);
    } else if (knopElement.dataset.action === "runner-stop") {
      stopRunnerLoop();
      gaNaar("runner-aanpassen");
    }
  });

  app.addEventListener("submit", event => {
    if (event.target && event.target.id === "start-form") {
      event.preventDefault();
      startSpelerSessie();
    } else if (event.target && event.target.id === "code-formulier") {
      event.preventDefault();
      controleerCode();
    }
  });

  app.addEventListener("input", event => {
    if (event.target && event.target.id === "runner-naam") {
      voortgang.character.naam = event.target.value.trim().slice(0, 16) || "Bink";
      const previewName = document.getElementById("runner-preview-naam");
      if (previewName) previewName.textContent = voortgang.character.naam;
      bewaarVoortgang();
    }
  });

  app.addEventListener("click",()=>registreerActiviteit());
  window.addEventListener("pointerdown",()=>registreerActiviteit(),{passive:true});
  window.addEventListener("keydown",()=>registreerActiviteit());
  window.addEventListener("storage",event=>{if(event.key===SPELERS_STORAGE_KEY&&pagina==="dashboard")render();});
  try{remoteAdminKey=sessionStorage.getItem("ve-dashboard-key")||"";}catch(error){}
  window.setInterval(()=>{
    if(pagina==="dashboard"){if(remoteAdminKey)laadDashboardCloud();}
    else{werkSpelersStatusBij();controleerVerwijderd();if(huidigeSpelerId&&Date.now()-laatsteActiviteitBijgewerkt>15000)synchroniseerSpeler();}
  },5000);
  if(!dashboardMode&&spelersCode()){
    laadRemoteSpeler(spelersCode()).then(data=>{
      if(!data){
        ["vape-escape-spelerscode","vape-escape-huidige-speler"].forEach(key=>localStorage.removeItem(key));
        sessionStorage.removeItem("vape-escape-sessie-speler");huidigeSpelerId=null;voortgang=legeVoortgang();gaNaar("start");return;
      }
      huidigeSpelerId=data.id;herstelRemoteVoortgang(data);
      const lijst=leesSpelers().filter(p=>p.id!==data.id);
      lijst.push({id:data.id,naam:data.name,score:data.score,coins:data.coins,vrijgespeeldeNiveaus:data.unlocked_levels||[1],voltooideNiveaus:(data.completed_levels||[]).length,character:data.character||{},status:"actief",laatsteActiviteit:Date.now()});
      bewaarSpelers(lijst);if(pagina==="start")gaNaar("kaart");
    }).catch(error=>console.warn("Account herstellen mislukt:",error.message));
  }
  if(dashboardMode&&remoteAdminKey)laadDashboardCloud();

  function speelBinkTransitie() {
    const voorbeeld = document.getElementById("runner-preview-beeld");
    const paneel = document.querySelector(".runner-preview");
    if (!voorbeeld || !paneel) return;
    voorbeeld.classList.remove("bink-spring");
    void voorbeeld.offsetWidth;
    voorbeeld.classList.add("bink-spring");
    for (let i = 0; i < 5; i++) {
      const wolk = document.createElement("span");
      wolk.className = "bink-wolk";
      wolk.style.left = (18 + Math.random() * 64) + "%";
      wolk.style.setProperty("--wolk-verticaal", (48 + Math.random() * 28) + "%");
      wolk.style.animationDelay = (Math.random() * .12) + "s";
      paneel.appendChild(wolk);
      window.setTimeout(() => wolk.remove(), 900);
    }
  }

  function werkKarakterVoorbeeldBij() {
    const beeld = document.getElementById("runner-preview-beeld");
    const naam = document.getElementById("runner-preview-naam");
    if (beeld) beeld.innerHTML = karakterVoorbeeldSvg();
    if (naam) naam.textContent = voortgang.character.naam;
    document.querySelectorAll("[data-action='runner-kleur']").forEach(knop => {
      const geselecteerd = knop.dataset.kleur === voortgang.character.kleur;
      knop.classList.toggle("gekozen", geselecteerd);
      knop.setAttribute("aria-pressed", String(geselecteerd));
    });
    document.querySelectorAll("[data-action='runner-accessoire']").forEach(knop => {
      const geselecteerd = knop.dataset.accessoire === voortgang.character.accessoire;
      knop.classList.toggle("gekozen", geselecteerd);
      knop.setAttribute("aria-pressed", String(geselecteerd));
    });
    document.querySelectorAll("[data-action='runner-effect']").forEach(knop => {
      const geselecteerd = knop.dataset.effect === (voortgang.character.effect || "neon");
      knop.classList.toggle("gekozen", geselecteerd);
      knop.setAttribute("aria-pressed", String(geselecteerd));
    });
    speelBinkTransitie();
  }

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


  const developerTools = Object.freeze({
    help() {
      console.info(
        "Vape Escape — ontwikkelaarscommando's\n" +
        "vapeEscape.level(1) t/m vapeEscape.level(5)  Open direct een niveau\n" +
        "vapeEscape.map()                            Open de missiekaart\n" +
        "vapeEscape.home()                           Ga naar het hoofdmenu"
      );
      return "Gebruik vapeEscape.level(1) t/m vapeEscape.level(5).";
    },
    level(levelNumber) {
      const number = Number(levelNumber);
      if (!Number.isInteger(number) || number < 1 || number > 5) {
        console.warn("Kies een niveau van 1 t/m 5. Gebruik vapeEscape.help() voor uitleg.");
        return false;
      }
      stopRunnerLoop();
      feedback = null;
      huidigeVraag = 0;
      codeMelding = "";
      codePogingen = 0;
      if (number === 5) {
        gaNaar("runner-aanpassen");
      } else {
        huidigLevel = number - 1;
        gaNaar("spel");
      }
      console.info("Niveau " + String(number).padStart(2, "0") + " geopend.");
      return true;
    },
    map() {
      stopRunnerLoop();
      gaNaar("kaart");
      return true;
    },
    home() {
      stopRunnerLoop();
      gaNaar("start");
      return true;
    }
  });

  Object.defineProperty(window, "vapeEscape", {
    value: developerTools,
    configurable: true,
    enumerable: false,
    writable: false
  });
  console.info("Vape Escape developer tools actief. Typ vapeEscape.help() voor commando's.");

  if (dashboardMode) pagina = "dashboard";
  render();
})();