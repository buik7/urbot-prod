"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertChampionNameToCapital = exports.getChampionById = void 0;
const champions = {
    1: { name: "ANNIE", discordIcon: "<:ANNIE:1062425586108207154>" },
    2: { name: "OLAF", discordIcon: "<:OLAF:1062425588381528114>" },
    3: { name: "GALIO", discordIcon: "<:GALIO:1062425591208476692>" },
    4: {
        name: "TWISTED_FATE",
        discordIcon: "<:TWISTED_FATE:1062425592663920771>",
    },
    5: { name: "XIN_ZHAO", discordIcon: "<:XIN_ZHAO:1062425594748481576>" },
    6: { name: "URGOT", discordIcon: "<:URGOT:1062425597088894976>" },
    7: { name: "LEBLANC", discordIcon: "<:LEBLANC:1062425599097970718>" },
    8: { name: "VLADIMIR", discordIcon: "<:VLADIMIR:1062425600838611014>" },
    9: {
        name: "FIDDLESTICKS",
        discordIcon: "<:FIDDLE_STICKS:1062425602944155760>",
    },
    10: { name: "KAYLE", discordIcon: "<:KAYLE:1062425605037101117>" },
    11: { name: "MASTER_YI", discordIcon: "<:MASTER_YI:1062425607041990656>" },
    12: { name: "ALISTAR", discordIcon: "<:ALISTAR:1062425608933609603>" },
    13: { name: "RYZE", discordIcon: "<:RYZE:1062425610703605790>" },
    14: { name: "SION", discordIcon: "<:SION:1062425612045787287>" },
    15: { name: "SIVIR", discordIcon: "<:SIVIR:1062425614331687012>" },
    16: { name: "SORAKA", discordIcon: "<:SORAKA:1062425615736770641>" },
    17: { name: "TEEMO", discordIcon: "<:TEEMO:1062425617414500453>" },
    18: { name: "TRISTANA", discordIcon: "<:TRISTANA:1062425620040134656>" },
    19: { name: "WARWICK", discordIcon: "<:WARWICK:1062425624083435561>" },
    20: { name: "NUNU", discordIcon: "<:NUNU:1062425625832464465>" },
    21: {
        name: "MISS_FORTUNE",
        discordIcon: "<:MISS_FORTUNE:1062425628030283797>",
    },
    22: { name: "ASHE", discordIcon: "<:ASHE:1062425630215512114>" },
    23: { name: "TRYNDAMERE", discordIcon: "<:TRYNDAMERE:1062425632425902160>" },
    24: { name: "JAX", discordIcon: "<:JAX:1062425634556620830>" },
    25: { name: "MORGANA", discordIcon: "<:MORGANA:1062425637043838996>" },
    26: { name: "ZILEAN", discordIcon: "<:ZILEAN:1062425639161970840>" },
    27: { name: "SINGED", discordIcon: "<:SINGED:1062425641183613030>" },
    28: { name: "EVELYNN", discordIcon: "<:EVELYNN:1062425643108810793>" },
    29: { name: "TWITCH", discordIcon: "<:TWITCH:1062425645654757378>" },
    30: { name: "KARTHUS", discordIcon: "<:KARTHUS:1062425648389423214>" },
    31: { name: "CHOGATH", discordIcon: "<:CHOGATH:1062425649731612752>" },
    32: { name: "AMUMU", discordIcon: "<:AMUMU:1062425651694555146>" },
    33: { name: "RAMMUS", discordIcon: "<:RAMMUS:1062425654450196533>" },
    34: { name: "ANIVIA", discordIcon: "<:ANIVIA:1062425657084215317>" },
    35: { name: "SHACO", discordIcon: "<:SHACO:1062425659462402108>" },
    36: { name: "DR_MUNDO", discordIcon: "<:DR_MUNDO:1062425660590665819>" },
    37: { name: "SONA", discordIcon: "<:SONA:1062425662977228840>" },
    38: { name: "KASSADIN", discordIcon: "<:KASSADIN:1062425664210350081>" },
    39: { name: "IRELIA", discordIcon: "<:IRELIA:1062425666236199012>" },
    40: { name: "JANNA", discordIcon: "<:JANNA:1062425668144611399>" },
    41: { name: "GANGPLANK", discordIcon: "<:GANGPLANK:1062425671416168572>" },
    42: { name: "CORKI", discordIcon: "<:CORKI:1062425673962102805>" },
    43: { name: "KARMA", discordIcon: "<:KARMA:1062425676759703612>" },
    44: { name: "TARIC", discordIcon: "<:TARIC:1062425679129493584>" },
    45: { name: "VEIGAR", discordIcon: "<:VEIGAR:1062425681604132965>" },
    48: { name: "TRUNDLE", discordIcon: "<:TRUNDLE:1062425683596427295>" },
    50: { name: "SWAIN", discordIcon: "<:SWAIN:1062425685521608827>" },
    51: { name: "CAITLYN", discordIcon: "<:CAITLYN:1062425689992740994>" },
    53: { name: "BLITZCRANK", discordIcon: "<:BLITZCRANK:1062425693054578760>" },
    54: { name: "MALPHITE", discordIcon: "<:MALPHITE:1062437590420168784>" },
    55: { name: "KATARINA", discordIcon: "<:KATARINA:1062437591707832360>" },
    56: { name: "NOCTURNE", discordIcon: "<:NOCTURNE:1062437592815112302>" },
    57: { name: "MAOKAI", discordIcon: "<:MAOKAI:1062437594320875600>" },
    58: { name: "RENEKTON", discordIcon: "<:RENEKTON:1062437596296400916>" },
    59: { name: "JARVAN_IV", discordIcon: "<:JARVAN_IV:1062437599563763844>" },
    60: { name: "ELISE", discordIcon: "<:ELISE:1062437600838811740>" },
    61: { name: "ORIANNA", discordIcon: "<:ORIANNA:1062437602696908830>" },
    62: {
        name: "MONKEY_KING",
        discordIcon: "<:MONKEY_KING:1062437603959382087>",
    },
    63: { name: "BRAND", discordIcon: "<:BRAND:1062437605318340649>" },
    64: { name: "LEE_SIN", discordIcon: "<:LEE_SIN:1062437607021215785>" },
    67: { name: "VAYNE", discordIcon: "<:VAYNE:1062437608111751288>" },
    68: { name: "RUMBLE", discordIcon: "<:RUMBLE:1062437609151942666>" },
    69: { name: "CASSIOPEIA", discordIcon: "<:CASSIOPEIA:1062437609948856341>" },
    72: { name: "SKARNER", discordIcon: "<:SKARNER:1062437611479760938>" },
    74: {
        name: "HEIMERDINGER",
        discordIcon: "<:HEIMERDINGER:1062437612566093825>",
    },
    75: { name: "NASUS", discordIcon: "<:NASUS:1062437613916659762>" },
    76: { name: "NIDALEE", discordIcon: "<:NIDALEE:1062437615200124978>" },
    77: { name: "UDYR", discordIcon: "<:UDYR:1062437616072523838>" },
    78: { name: "POPPY", discordIcon: "<:POPPY:1062437617695723552>" },
    79: { name: "GRAGAS", discordIcon: "<:GRAGAS:1062437619092422757>" },
    80: { name: "PANTHEON", discordIcon: "<:PANTHEON:1062437620493332540>" },
    81: { name: "EZREAL", discordIcon: "<:EZREAL:1062437622082965524>" },
    82: {
        name: "MORDEKAISER",
        discordIcon: "<:MORDEKAISER:1062437623341260810>",
    },
    83: { name: "YORICK", discordIcon: "<:YORICK:1062437624515678228>" },
    84: { name: "AKALI", discordIcon: "<:AKALI:1062438222157840506>" },
    85: { name: "KENNEN", discordIcon: "<:KENNEN:1062438223873331251>" },
    86: { name: "GAREN", discordIcon: "<:GAREN:1062438225911742556>" },
    89: { name: "LEONA", discordIcon: "<:LEONA:1062438228432535685>" },
    90: { name: "MALZAHAR", discordIcon: "<:MALZAHAR:1062438230584197271>" },
    91: { name: "TALON", discordIcon: "<:TALON:1062438232794607726>" },
    92: { name: "RIVEN", discordIcon: "<:RIVEN:1062438234539434094>" },
    96: { name: "KOG_MAW", discordIcon: "<:KOG_MAW:1062438236800159764>" },
    98: { name: "SHEN", discordIcon: "<:SHEN:1062438239358685235>" },
    99: { name: "LUX", discordIcon: "<:LUX:1062438241258717374>" },
    101: { name: "XERATH", discordIcon: "<:XERATH:1062438243204870204>" },
    102: { name: "SHYVANA", discordIcon: "<:SHYVANA:1062438244609961994>" },
    103: { name: "AHRI", discordIcon: "<:AHRI:1062438247575326821>" },
    104: { name: "GRAVES", discordIcon: "<:GRAVES:1062438249324363857>" },
    105: { name: "FIZZ", discordIcon: "<:FIZZ:1062438251861909624>" },
    106: { name: "VOLIBEAR", discordIcon: "<:VOLIBEAR:1062438254550466681>" },
    107: { name: "RENGAR", discordIcon: "<:RENGAR:1062438256827973633>" },
    110: { name: "VARUS", discordIcon: "<:VARUS:1062438259369721906>" },
    111: { name: "NAUTILUS", discordIcon: "<:NAUTILUS:1062438262536405012>" },
    112: { name: "VIKTOR", discordIcon: "<:VIKTOR:1062438265384337448>" },
    113: { name: "SEJUANI", discordIcon: "<:SEJUANI:1062438267993194616>" },
    114: { name: "FIORA", discordIcon: "<:FIORA:1062438269603823697>" },
    115: { name: "ZIGGS", discordIcon: "<:ZIGGS:1062438271877124127>" },
    117: { name: "LULU", discordIcon: "<:LULU:1062438273940738181>" },
    119: { name: "DRAVEN", discordIcon: "<:DRAVEN:1062438276146933770>" },
    120: { name: "HECARIM", discordIcon: "<:HECARIM:1062442312501842040>" },
    121: { name: "KHAZIX", discordIcon: "<:KHAZIX:1062442314024366090>" },
    122: { name: "DARIUS", discordIcon: "<:DARIUS:1062442316394143834>" },
    126: { name: "JAYCE", discordIcon: "<:JAYCE:1062442317811814410>" },
    127: { name: "LISSANDRA", discordIcon: "<:LISSANDRA:1062442319992860792>" },
    131: { name: "DIANA", discordIcon: "<:DIANA:1062442322169696367>" },
    133: { name: "QUINN", discordIcon: "<:QUINN:1062442324422054038>" },
    134: { name: "SYNDRA", discordIcon: "<:SYNDRA:1062442325546127441>" },
    136: {
        name: "AURELION_SOL",
        discordIcon: "<:AURELION_SOL:1062442327647469692>",
    },
    141: { name: "KAYN", discordIcon: "<:KAYN:1062442329606213724>" },
    142: { name: "ZOE", discordIcon: "<:ZOE:1062442332047286383>" },
    143: { name: "ZYRA", discordIcon: "<:ZYRA:1062442333569822830>" },
    145: { name: "KAISA", discordIcon: "<:KAISA:1062442335897665626>" },
    147: { name: "SERAPHINE", discordIcon: "<:SERAPHINE:1062442337269186571>" },
    150: { name: "GNAR", discordIcon: "<:GNAR:1062442340385562676>" },
    154: { name: "ZAC", discordIcon: "<:ZAC:1062442342109413456>" },
    157: { name: "YASUO", discordIcon: "<:YASUO:1062442344424681613>" },
    161: { name: "VELKOZ", discordIcon: "<:VELKOZ:1062442346890928218>" },
    163: { name: "TALIYAH", discordIcon: "<:TALIYAH:1062442349562708039>" },
    164: { name: "CAMILLE", discordIcon: "<:CAMILLE:1062442352054128711>" },
    166: { name: "AKSHAN", discordIcon: "<:AKSHAN:1062442354298069072>" },
    200: { name: "BELVETH", discordIcon: "<:BELVETH:1062442357112447046>" },
    201: { name: "BRAUM", discordIcon: "<:BRAUM:1062442358530117662>" },
    202: { name: "JHIN", discordIcon: "<:JHIN:1062442360501452890>" },
    203: { name: "KINDRED", discordIcon: "<:KINDRED:1062442362707656805>" },
    221: { name: "ZERI", discordIcon: "<:ZERI:1062443188142493766>" },
    222: { name: "JINX", discordIcon: "<:JINX:1062443189484658688>" },
    223: { name: "TAHM_KENCH", discordIcon: "<:TAHM_KENCH:1062443190730371122>" },
    234: { name: "VIEGO", discordIcon: "<:VIEGO:1062443193133703288>" },
    235: { name: "SENNA", discordIcon: "<:SENNA:1062443195125989446>" },
    236: { name: "LUCIAN", discordIcon: "<:LUCIAN:1062443197441261598>" },
    238: { name: "ZED", discordIcon: "<:ZED:1062443199664226394>" },
    240: { name: "KLED", discordIcon: "<:KLED:1062443202117902427>" },
    245: { name: "EKKO", discordIcon: "<:EKKO:1062443204227641345>" },
    246: { name: "QIYANA", discordIcon: "<:QIYANA:1062443207453069322>" },
    254: { name: "VI", discordIcon: "<:VI:1062443209730555975>" },
    266: { name: "AATROX", discordIcon: "<:AATROX:1062443210871410818>" },
    267: { name: "NAMI", discordIcon: "<:NAMI:1062443213480271932>" },
    268: { name: "AZIR", discordIcon: "<:AZIR:1062443215812317355>" },
    350: { name: "YUUMI", discordIcon: "<:YUUMI:1062443217393561620>" },
    360: { name: "SAMIRA", discordIcon: "<:SAMIRA:1062443219230658590>" },
    412: { name: "THRESH", discordIcon: "<:THRESH:1062443221113913466>" },
    420: { name: "ILLAOI", discordIcon: "<:ILLAOI:1062443224129601628>" },
    421: { name: "REK_SAI", discordIcon: "<:REK_SAI:1062443227959013376>" },
    427: { name: "IVERN", discordIcon: "<:IVERN:1062443229552853112>" },
    429: { name: "KALISTA", discordIcon: "<:KALISTA:1062443232920875098>" },
    432: { name: "BARD", discordIcon: "<:BARD:1062443236469256323>" },
    497: { name: "RAKAN", discordIcon: "<:RAKAN:1062443238574796970>" },
    498: { name: "XAYAH", discordIcon: "<:XAYAH:1062443240466419712>" },
    516: { name: "ORNN", discordIcon: "<:ORNN:1062443242899128410>" },
    517: { name: "SYLAS", discordIcon: "<:SYLAS:1062445079891017830>" },
    518: { name: "NEEKO", discordIcon: "<:NEEKO:1062445082491486209>" },
    523: { name: "APHELIOS", discordIcon: "<:APHELIOS:1062445084550910084>" },
    526: { name: "RELL", discordIcon: "<:RELL:1062445086505451591>" },
    555: { name: "PYKE", discordIcon: "<:PYKE:1062445088950726766>" },
    711: { name: "VEX", discordIcon: "<:VEX:1062445091047874661>" },
    777: { name: "YONE", discordIcon: "<:YONE:1062445094797582388>" },
    875: { name: "SETT", discordIcon: "<:SETT:1062445097741979769>" },
    876: { name: "LILLIA", discordIcon: "<:LILLIA:1062445099239362610>" },
    887: { name: "GWEN", discordIcon: "<:GWEN:1062445101533630504>" },
    888: { name: "RENATA", discordIcon: "<:RENATA:1062445103085522954>" },
    895: { name: "NILAH", discordIcon: "<:NILAH:1062445104796794950>" },
    897: { name: "KSANTE", discordIcon: "<:KSANTE:1062445106126409749>" },
};
const defaultChampion = {
    name: "Unknown champion",
    discordIcon: "<:NONE:1062425584187224187>",
};
const getChampionById = (id, capitalName = false) => {
    const champion = champions[id];
    if (!champion) {
        console.error("Invalid champion id: " + id);
        return defaultChampion;
    }
    if (capitalName) {
        champion.name = (0, exports.convertChampionNameToCapital)(champion.name);
    }
    return champion;
};
exports.getChampionById = getChampionById;
const convertChampionNameToCapital = (championName) => {
    if (championName.length === 0)
        return "";
    let finalName = championName[0].toUpperCase();
    for (let i = 1; i < championName.length; i++) {
        if (championName[i] === "_") {
            finalName += " ";
        }
        else if (championName[i - 1] === "_") {
            finalName += championName[i].toUpperCase();
        }
        else {
            finalName += championName[i].toLowerCase();
        }
    }
    return finalName;
};
exports.convertChampionNameToCapital = convertChampionNameToCapital;
