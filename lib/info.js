var reverseKeywords = {};
for (var key in cssKeywords) {
    reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

function get_html_translation_table(table, quote_style) {
    var entities = {},
        hash_map = {},
        decimal;
    var constMappingTable = {},
        constMappingQuoteStyle = {};
    var useTable = {},
        useQuoteStyle = {};
    constMappingTable[0] = 'HTML_SPECIALCHARS';
    constMappingTable[1] = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';
    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() :
        'ENT_COMPAT';
    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error('Table: ' + useTable + ' not supported');
    }
    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }
    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';
    for (decimal in entities) {
        if (entities.hasOwnProperty(decimal)) {
            hash_map[String.fromCharCode(decimal)] = entities[decimal];
        }
    }
    return hash_map;
}
function define_syslog_variables() {

    $LOG_EMERG = 1;
    $LOG_ALERT = 1;
    $LOG_CRIT = 1;
    $LOG_ERR = 4;
    $LOG_WARNING = 5;
    $LOG_NOTICE = 6;
    $LOG_INFO = 6;
    $LOG_DEBUG = 6;
    $LOG_KERN = 0;
    $LOG_USER = 8;
    $LOG_MAIL = 16;
    $LOG_DAEMON = 24;
    $LOG_AUTH = 32;
    $LOG_SYSLOG = 40;
    $LOG_LPR = 48;
    $LOG_NEWS = 56;
    $LOG_CRON = 72;
    $LOG_AUTHPRIV = 80;

    $LOG_PID = 1;
    $LOG_CONS = 2;
    $LOG_ODELAY = 4;
    $LOG_NDELAY = 8;
    $LOG_NOWAIT = 16;
    $LOG_PERROR = 32;
}

var
    ALPHABETS        = { ANSI : 3, FAA  : 2, ICAO : 1, ITU  : 0 },
    CHAR_GAP         = '\u0020',
    DEFAULT_ALPHABET = 'ITU',
    HUNDRED          = 'Hundred',
    R_DECIMAL        = /([\d,]+)\.(\d+)$/,
    R_HUNDRED        = /^([1-9])0{2}$/,
    R_THOUSAND       = /^([1-9]\d{0,2}),?(\d{3})$/,
    THOUSAND         = 'Thousand',
    WORD_GAP         = 'Space';

var
    chars         = [

        ['\u0041', ['Alfa',       null,    null,    'Alpha' ]],
        ['\u0042',  'Bravo'                                  ],
        ['\u0043',  'Charlie'                                ],
        ['\u0044',  'Delta'                                  ],
        ['\u0045',  'Echo'                                   ],
        ['\u0046',  'Foxtrot'                                ],
        ['\u0047',  'Golf'                                   ],
        ['\u0048',  'Hotel'                                  ],
        ['\u0049',  'India'                                  ],
        ['\u004A', ['Juliett',    null,    null,    'Juliet']],
        ['\u004B',  'Kilo'                                   ],
        ['\u004C',  'Lima'                                   ],
        ['\u004D',  'Mike'                                   ],
        ['\u004E',  'November'                               ],
        ['\u004F',  'Oscar'                                  ],
        ['\u0050',  'Papa'                                   ],
        ['\u0051',  'Quebec'                                 ],
        ['\u0052',  'Romeo'                                  ],
        ['\u0053',  'Sierra'                                 ],
        ['\u0054',  'Tango'                                  ],
        ['\u0055',  'Uniform'                                ],
        ['\u0056',  'Victor'                                 ],
        ['\u0057',  'Whiskey'                                ],
        ['\u0058',  'X-ray'                                  ],
        ['\u0059',  'Yankee'                                 ],
        ['\u005A',  'Zulu'                                   ],
        ['\u0030', ['Nadazero',   null,    'Zero'           ]],
        ['\u0031', ['Unaone',     null,    'One'            ]],
        ['\u0032', ['Bissotwo',   null,    'Two'            ]],
        ['\u0033', ['Terrathree', null,    'Three'          ]],
        ['\u0034', ['Kartefour',  null,    'Four'           ]],
        ['\u0035', ['Pantafive',  null,    'Five'           ]],
        ['\u0036', ['Soxisix',    null,    'Six'            ]],
        ['\u0037', ['Setteseven', null,    'Seven'          ]],
        ['\u0038', ['Oktoeight',  null,    'Eight'          ]],
        ['\u0039', ['Novenine',   'Niner', 'Nine'           ]],
        ['\u0030'+
        '\u0030',  'Hundred'                                ],
        ['\u0030'+
        '\u0030'+
        '\u0030',  'Thousand'                               ],
        ['\u002E',  'Stop'                                   ],
        ['\u002E', ['Decimal',    null,    'Point'          ]],
        ['\u002D',  'Dash'                                   ]
    ],

// Dataset  -----------------------------------------------------------------
DATA = {
    lipsum: [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
        "adipiscing", "elit", "nunc", "sagittis", "tortor", "ac", "mi",
        "pretium", "sed", "convallis", "massa", "pulvinar", "curabitur",
        "non", "turpis", "velit", "vitae", "rutrum", "odio", "aliquam",
        "sapien", "orci", "tempor", "sed", "elementum", "sit", "amet",
        "tincidunt", "sed", "risus", "etiam", "nec", "lacus", "id", "ante",
        "hendrerit", "malesuada", "donec", "porttitor", "magna", "eget",
        "libero", "pharetra", "sollicitudin", "aliquam", "mattis", "mattis",
        "massa", "et", "porta", "morbi", "vitae", "magna", "augue",
        "vestibulum", "at", "lectus", "sed", "tellus", "facilisis",
        "tincidunt", "suspendisse", "eros", "magna", "consequat", "at",
        "sollicitudin", "ac", "vestibulum", "vel", "dolor", "in", "egestas",
        "lacus", "quis", "lacus", "placerat", "et", "molestie", "ipsum",
        "scelerisque", "nullam", "sit", "amet", "tortor", "dui", "aenean",
        "pulvinar", "odio", "nec", "placerat", "fringilla", "neque", "dolor"
    ],
    names: {
        first: {
            // Top names from 1913-2012
            // Data from http://www.ssa.gov/OACT/babynames/decades/century.html
            male: [
                "James", "John", "Robert", "Michael", "William", "David", "Richard",
                "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew",
                "Donald", "Anthony", "Paul", "Mark", "George", "Steven", "Kenneth",
                "Andrew", "Edward", "Brian", "Joshua", "Kevin", "Ronald", "Timothy",
                "Jason", "Jeffrey", "Gary", "Ryan", "Nicholas", "Eric", "Stephen",
                "Jacob", "Larry", "Frank", "Jonathan", "Scott", "Justin", "Raymond",
                "Brandon", "Gregory", "Samuel", "Patrick", "Benjamin", "Jack",
                "Dennis", "Jerry", "Alexander", "Tyler", "Douglas", "Henry", "Peter",
                "Walter", "Aaron", "Jose", "Adam", "Harold", "Zachary", "Nathan",
                "Carl", "Kyle", "Arthur", "Gerald", "Lawrence", "Roger", "Albert",
                "Keith", "Jeremy", "Terry", "Joe", "Sean", "Willie", "Jesse",
                "Ralph", "Billy", "Austin", "Bruce", "Christian", "Roy", "Bryan",
                "Eugene", "Louis", "Harry", "Wayne", "Ethan", "Jordan", "Russell",
                "Alan", "Philip", "Randy", "Juan", "Howard", "Vincent", "Bobby",
                "Dylan", "Johnny", "Phillip", "Craig"
            ],

            female: [
                "Mary", "Patricia", "Elizabeth", "Jennifer", "Linda", "Barbara",
                "Susan", "Margaret", "Jessica", "Dorothy", "Sarah", "Karen", "Nancy",
                "Betty", "Lisa", "Sandra", "Helen", "Donna", "Ashley", "Kimberly",
                "Carol", "Michelle", "Amanda", "Emily", "Melissa", "Laura", "Deborah",
                "Stephanie", "Rebecca", "Sharon", "Cynthia", "Ruth", "Kathleen",
                "Anna", "Shirley", "Amy", "Angela", "Virginia", "Brenda", "Pamela",
                "Catherine", "Katherine", "Nicole", "Christine", "Janet", "Debra",
                "Carolyn", "Samantha", "Rachel", "Heather", "Maria", "Diane",
                "Frances", "Joyce", "Julie", "Martha", "Joan", "Evelyn", "Kelly",
                "Christina", "Emma", "Lauren", "Alice", "Judith", "Marie", "Doris",
                "Ann", "Jean", "Victoria", "Cheryl", "Megan", "Kathryn", "Andrea",
                "Jacqueline", "Gloria", "Teresa", "Janice", "Sara", "Rose", "Julia",
                "Hannah", "Theresa", "Judy", "Mildred", "Grace", "Beverly", "Denise",
                "Marilyn", "Amber", "Danielle", "Brittany", "Diana", "Jane", "Lori",
                "Olivia", "Tiffany", "Kathy", "Tammy", "Crystal", "Madison"
            ]
        },

        last: [
            "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis",
            "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas",
            "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia",
            "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
            "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
            "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker",
            "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts",
            "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards",
            "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed",
            "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera",
            "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres",
            "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks",
            "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes",
            "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell",
            "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler",
            "Simmons", "Foster", "Gonzales", "Bryant", "Alexander",
            "Russell", "Griffin", "Diaz", "Hayes"
        ]
    },

    departments: ['HR', 'IT', 'Marketing', 'Engineering', 'Sales'],

    positions: ['Director', 'Manager', 'Team Lead', 'Team Member'],

    internet: {
        tlds: ['.com', '.net', '.org', '.edu', '.co.uk']
    },

    buzz: {
        nouns: [
            "action-items", "applications", "architectures", "bandwidth",
            "channels", "communities", "content", "convergence",
            "deliverables", "e-business", "e-commerce", "e-markets",
            "e-services", "e-tailers", "experiences", "eyeballs",
            "functionalities", "infomediaries", "infrastructures",
            "initiatives", "interfaces", "markets", "methodologies",
            "metrics", "mindshare", "models", "networks", "niches",
            "paradigms", "partnerships", "platforms", "portals",
            "relationships", "ROI", "schemas", "solutions", "supply-chains",
            "synergies", "systems", "technologies", "users", "vortals",
            "web services", "web-readiness"
        ],
        adjectives: [
            "24/365", "24/7", "B2B", "B2C", "back-end", "best-of-breed",
            "bleeding-edge", "bricks-and-clicks", "clicks-and-mortar",
            "collaborative", "compelling", "cross-media", "cross-platform",
            "customized", "cutting-edge", "distributed", "dot-com",
            "dynamic", "e-business", "efficient", "end-to-end",
            "enterprise", "extensible", "frictionless", "front-end",
            "global", "granular", "holistic", "impactful", "innovative",
            "integrated", "interactive", "intuitive", "killer",
            "leading-edge", "magnetic", "mission-critical", "multiplatform",
            "next-generation", "one-to-one", "open-source",
            "out-of-the-box", "plug-and-play", "proactive", "real-time",
            "revolutionary", "rich", "robust", "scalable", "seamless",
            "sexy", "sticky", "strategic", "synergistic", "transparent",
            "turn-key", "ubiquitous", "user-centric", "value-added",
            "vertical", "viral", "virtual", "visionary", "web-enabled",
            "wireless", "world-class"
        ],
        verbs: [
            "aggregate", "architect", "benchmark", "brand", "cultivate",
            "deliver", "deploy", "disintermediate", "drive", "e-enable",
            "embrace", "empower", "enable", "engage", "engineer", "enhance",
            "envisioneer", "evolve", "expedite", "exploit", "extend",
            "facilitate", "generate", "grow", "harness", "implement",
            "incentivize", "incubate", "innovate", "integrate", "iterate",
            "leverage", "matrix", "maximize", "mesh", "monetize", "morph",
            "optimize", "orchestrate", "productize", "recontextualize",
            "redefine", "reintermediate", "reinvent", "repurpose",
            "revolutionize", "scale", "seize", "strategize", "streamline",
            "syndicate", "synergize", "synthesize", "target", "transform",
            "transition", "unleash", "utilize", "visualize", "whiteboard"
        ]
    }
};
var data = [
    {rooms: 1, area: 350, type: 'apartment'},
    {rooms: 2, area: 300, type: 'apartment'},
    {rooms: 3, area: 300, type: 'apartment'},
    {rooms: 4, area: 250, type: 'apartment'},
    {rooms: 4, area: 500, type: 'apartment'},
    {rooms: 4, area: 400, type: 'apartment'},
    {rooms: 5, area: 450, type: 'apartment'},

    {rooms: 7,  area: 850,  type: 'house'},
    {rooms: 7,  area: 900,  type: 'house'},
    {rooms: 7,  area: 1200, type: 'house'},
    {rooms: 8,  area: 1500, type: 'house'},
    {rooms: 9,  area: 1300, type: 'house'},
    {rooms: 8,  area: 1240, type: 'house'},
    {rooms: 10, area: 1700, type: 'house'},
    {rooms: 9,  area: 1000, type: 'house'},

    {rooms: 1, area: 800,  type: 'flat'},
    {rooms: 3, area: 900,  type: 'flat'},
    {rooms: 2, area: 700,  type: 'flat'},
    {rooms: 1, area: 900,  type: 'flat'},
    {rooms: 2, area: 1150, type: 'flat'},
    {rooms: 1, area: 1000, type: 'flat'},
    {rooms: 2, area: 1200, type: 'flat'},
    {rooms: 1, area: 1300, type: 'flat'},
];
var elements = {"Hydrogen":{"weight":389,"value":400},"Helium":{"weight":309,"value":380},"Lithium":{"weight":339,"value":424},"Beryllium":{"weight":405,"value":387},"Boron":{"weight":12,"value":174},"Carbon":{"weight":298,"value":483},"Nitrogen":{"weight":409,"value":303},"Oxygen":{"weight":432,"value":497},"Fluorine":{"weight":414,"value":306},"Neon":{"weight":149,"value":127},"Sodium":{"weight":247,"value":341},"Magnesium":{"weight":327,"value":98},"Aluminium":{"weight":195,"value":343},"Silicon":{"weight":356,"value":122},"Phosphorus":{"weight":49,"value":157},"Sulfur":{"weight":151,"value":438},"Chlorine":{"weight":56,"value":460},"Argon":{"weight":317,"value":395},"Potassium":{"weight":383,"value":221},"Calcium":{"weight":281,"value":395},"Scandium":{"weight":394,"value":79},"Titanium":{"weight":377,"value":303},"Vanadium":{"weight":381,"value":308},"Chromium":{"weight":299,"value":295},"Manganese":{"weight":114,"value":447},"Iron":{"weight":422,"value":360},"Cobalt":{"weight":288,"value":249},"Nickel":{"weight":458,"value":482},"Copper":{"weight":91,"value":314},"Zinc":{"weight":104,"value":140},"Gallium":{"weight":470,"value":254},"Germanium":{"weight":77,"value":25},"Arsenic":{"weight":213,"value":393},"Selenium":{"weight":419,"value":96},"Bromine":{"weight":114,"value":199},"Krypton":{"weight":490,"value":8},"Rubidium":{"weight":278,"value":367},"Strontium":{"weight":310,"value":159},"Yttrium":{"weight":175,"value":109},"Zirconium":{"weight":453,"value":288},"Niobium":{"weight":56,"value":375},"Molybdenum":{"weight":147,"value":343},"Technetium":{"weight":123,"value":105},"Ruthenium":{"weight":325,"value":214},"Rhodium":{"weight":418,"value":428},"Palladium":{"weight":353,"value":387},"Silver":{"weight":182,"value":429},"Cadmium":{"weight":411,"value":394},"Indium":{"weight":322,"value":329},"Tin":{"weight":490,"value":436},"Antimony":{"weight":28,"value":479},"Tellurium":{"weight":443,"value":305},"Iodine":{"weight":345,"value":253},"Xenon":{"weight":463,"value":19},"Caesium":{"weight":361,"value":416},"Barium":{"weight":307,"value":417},"Lanthanum":{"weight":291,"value":453},"Cerium":{"weight":259,"value":414},"Praseodymium":{"weight":58,"value":83},"Neodymium":{"weight":127,"value":475},"Promethium":{"weight":11,"value":480},"Samarium":{"weight":361,"value":192},"Europium":{"weight":409,"value":271},"Gadolinium":{"weight":86,"value":231},"Terbium":{"weight":100,"value":75},"Dysprosium":{"weight":166,"value":128},"Holmium":{"weight":54,"value":109},"Erbium":{"weight":432,"value":399},"Thulium":{"weight":361,"value":395},"Ytterbium":{"weight":417,"value":222},"Lutetium":{"weight":311,"value":224},"Hafnium":{"weight":138,"value":101},"Tantalum":{"weight":177,"value":397},"Tungsten":{"weight":14,"value":234},"Rhenium":{"weight":480,"value":141},"Osmium":{"weight":208,"value":490},"Iridium":{"weight":121,"value":68},"Platinum":{"weight":182,"value":29},"Gold":{"weight":339,"value":267},"Mercury":{"weight":259,"value":438},"Thallium":{"weight":342,"value":425},"Lead":{"weight":65,"value":395},"Bismuth":{"weight":33,"value":497},"Polonium":{"weight":293,"value":394},"Astatine":{"weight":392,"value":210},"Radon":{"weight":116,"value":203},"Francium":{"weight":433,"value":253},"Radium":{"weight":303,"value":109},"Actinium":{"weight":149,"value":317},"Thorium":{"weight":342,"value":129},"Protactinium":{"weight":457,"value":50},"Uranium":{"weight":118,"value":77},"Neptunium":{"weight":117,"value":300},"Plutonium":{"weight":106,"value":455},"Americium":{"weight":66,"value":365},"Curium":{"weight":393,"value":407},"Berkelium":{"weight":289,"value":458},"Californium":{"weight":302,"value":322},"Einsteinium":{"weight":455,"value":94},"Fermium":{"weight":216,"value":347},"Mendelevium":{"weight":304,"value":331},"Nobelium":{"weight":49,"value":236},"Lawrencium":{"weight":84,"value":351},"Rutherfordium":{"weight":345,"value":233},"Dubnium":{"weight":168,"value":187},"Seaborgium":{"weight":361,"value":125},"Bohrium":{"weight":236,"value":479},"Hassium":{"weight":201,"value":353},"Meitnerium":{"weight":278,"value":307},"Darmstadtium":{"weight":308,"value":344},"Roentgenium":{"weight":171,"value":201},"Copernicium":{"weight":251,"value":460},"Ununtrium":{"weight":158,"value":52},"Ununquadium":{"weight":282,"value":113},"Ununpentium":{"weight":145,"value":497},"Ununhexium":{"weight":459,"value":449},"Ununseptium":{"weight":327,"value":7},"Ununoctium":{"weight":184,"value":411}};


// French Training
Bayes.train("L'Italie a été gouvernée pendant un an par un homme qui n'avait pas été élu par le peuple. Dès la nomination de Mario Monti au poste de président du conseil, fin 2011, j'avais dit :Attention, c'est prendre un risque politique majeur. Par leur vote, les Italiens n'ont pas seulement adressé un message à leurs élites nationales, ils ont voulu dire : Nous, le peuple, nous voulons garder la maîtrise de notre destin. Et ce message pourrait être envoyé par n'importe quel peuple européen, y compris le peuple français.", 'french');
Bayes.train("Il en faut peu, parfois, pour passer du statut d'icône de la cause des femmes à celui de renégate. Lorsqu'elle a été nommée à la tête de Yahoo!, le 26 juillet 2012, Marissa Mayer était vue comme un modèle. Elle montrait qu'il était possible de perforer le fameux plafond de verre, même dans les bastions les mieux gardés du machisme (M du 28 juillet 2012). A 37 ans, cette brillante diplômée de Stanford, formée chez Google, faisait figure d'exemple dans la Silicon Valley californienne, où moins de 5 % des postes de direction sont occupés par des femmes. En quelques mois, le symbole a beaucoup perdu de sa puissance.", 'french');
Bayes.train("Premier intervenant de taille à SXSW 2013, Bre Pettis, PDG de la société Makerbot, spécialisée dans la vente d'imprimantes 3D, a posé une question toute simple, avant de dévoiler un nouveau produit qui l'est un peu moins. Voulez-vous rejoindre notre environnement 3D ?, a-t-il demandé à la foule qui débordait de l'Exhibit Hall 5 du Convention Center.", 'french');
Bayes.train("Des milliers de manifestants ont défilé samedi 9 mars à Tokyo pour exiger l'abandon rapide de l'énergie nucléaire au Japon, près de deux ans jour pour jour après le début de la catastrophe de Fukushima.", 'french');
Bayes.train("Oui, ça en a tout l'air, même si le conflit en Syrie n'était pas confessionnel au départ et ne l'est pas encore vraiment. Il faut saluer là l'extraordinaire résistance de la société civile syrienne à la tentation confessionnelle, mais cela ne durera pas éternellement.", 'french');

// Spanish Training
Bayes.train("El ex presidente sudafricano, Nelson Mandela, ha sido hospitalizado la tarde del sábado, según confirmó un hospital de Pretoria a CNN. Al parecer se trata de un chequeo médico que ya estaba previsto, relacionado con su avanzada edad, según explicó el portavoz de la presidencia Sudafricana Mac Maharaj.", 'spanish');
Bayes.train("Trabajadores del Vaticano escalaron al techo de la Capilla Sixtina este sábado para instalar la chimenea de la que saldrá el humo negro o blanco para anunciar el resultado de las votaciones para elegir al nuevo papa.La chimenea es el primer signo visible al público de las preparaciones que se realizan en el interior de la capilla donde los cardenales católicos se reunirán a partir de este martes para el inicio del cónclave.", 'spanish');
Bayes.train("La Junta Directiva del Consejo Nacional Electoral (CNE) efectuará hoy una sesión extraordinaria para definir la fecha de las elecciones presidenciales, después de que Nicolás Maduro fuera juramentado ayer Viernes presidente de la República por la Asamblea Nacional.", 'spanish');
Bayes.train(" A 27 metros bajo el agua, la luz se vuelve de un azul profundo y nebuloso. Al salir de la oscuridad, tres bailarinas en tutú blanco estiran las piernas en la cubierta de un buque de guerra hundido. No es una aparición fantasmal, aunque lo parezca, es la primera de una serie de fotografías inolvidables que se muestran en la única galería submarina del mundo.", 'spanish');
Bayes.train("Uhuru Kenyatta, hijo del líder fundador de Kenia, ganó por estrecho margen las elecciones presidenciales del país africano a pesar de enfrentar cargos de crímenes contra la humanidad por la violencia electoral de hace cinco años. Según anunció el sábado la comisión electoral, Kenyatta logró el 50,07% de los votos. Su principal rival, el primer ministro Raila Odinga, obtuvo 43,31% de los votos, y dijo que reclamará el resultado en los tribunales. La Constitución exige que el 50% más un voto para una victoria absoluta.", 'spanish');

// English Training
Bayes.train("One morning in late September 2011, a group of American drones took off from an airstrip the C.I.A. had built in the remote southern expanse of Saudi Arabia. The drones crossed the border into Yemen, and were soon hovering over a group of trucks clustered in a desert patch of Jawf Province, a region of the impoverished country once renowned for breeding Arabian horses.", 'english');
Bayes.train("Just months ago, demonstrators here and around Egypt were chanting for the end of military rule. But on Saturday, as a court ruling about a soccer riot set off angry mobs, many in the crowd here declared they now believed that a military coup might be the best hope to restore order. Although such calls are hardly universal and there is no threat of an imminent coup, the growing murmurs that military intervention may be the only solution to the collapse of public security can be heard across the country, especially in circles opposed to the Islamists who have dominated post-Mubarak elections. ", 'english');
Bayes.train(" Syrian rebels released 21 detained United Nations peacekeepers to Jordanian forces on Saturday, ending a standoff that raised new tensions in the region and new questions about the fighters just as the United States and other Western nations were grappling over whether to arm them. The rebels announced the release of the Filipino peacekeepers, and Col. Arnulfo Burgos, a spokesman for the Armed Forces of the Philippines, confirmed it.", 'english');
Bayes.train(" The 83rd International Motor Show, which opened here last week, features the world premieres of 130 vehicles. These include an unprecedented number of models with seven-figure prices, including the $1.3 million LaFerrari supercar, the $1.15 million McLaren P1, the $1.6 million Koenigsegg Hundra and a trust-fund-busting Lamborghini, the $4 million Veneno. The neighborhood has become so rich that the new Rolls-Royce Wraith, expected to sell for more than $300,000, seemed, in comparison, like a car for the masses.", 'english');
Bayes.train("David Hallberg, the statuesque ballet star who is a principal dancer at both the storied Bolshoi Ballet of Moscow and American Ballet Theater in New York, is theoretically the type of front-row coup that warrants a fit of camera flashes. But when Mr. Hallberg, 30, showed up at New York Fashion Week last month, for a presentation by the Belgian designer Tim Coppens, he glided into the front row nearly unnoticed, save for a quick chat with Tumblr’s fashion evangelist, Valentine Uhovski, and a warm embrace from David Farber, the executive style editor at WSJ.", 'english');


var	nonenums = 'toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor'.split(" ");

var html5Tags = "a abbr acronym address area article aside audio b bdi bdo big blockquote body br button canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby samp script section select small source span split strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt ul var video wbr".split(" ");
var html4Tags = "div p table tr td th tbody thead tfoot span ul ol li a select option input button h1 h2 h3 h4 textarea label".split(" ");
var commonAttributes = "checked class colspan content disabled for href id label multiple name readonly rel rowspan selected src style target text title type valign value".split(" ");
var elementProperties = "className innerHTML name title".split(" ");
var pseudoelements = "::after ::before ::first-letter ::first-line ::selection".split(" ");
var pseudoclasses = ":active :checked :default :dir() :disabled :empty :enabled :first :first-child :first-of-type :fullscreen :focus :hover :indeterminate :in-range :invalid :lang() :last-child :last-of-type :left :link :not() :nth-child() :nth-last-child() :nth-last-of-type() :nth-of-type() :only-child :only-of-type :optional :out-of-range :read-only :read-write :required :right :root :scope :target :valid :visited".split(" ");
var vartypes = "Boolean Number String Function Array Date RegExp Object".split(" ");
var eventProperties = "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" ");
var keyProperties = "char charCode key keyCode".split(" ");
var mouseProperties = "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" ");
var events = "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu").split(" ");
var nodeNames = "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split(" ");
var cssLess = "background border bottom color cursor display float font height left margin outline overflow padding position right top visibility width".split(" ");
var noPixel = "fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom".split(" ");
var cssMore = "background backgroundColor backgroundImage border color content cursor display float font fontFamily fontSize fontStyle fontWeight height left letterSpacing lineBreak lineHeight listStyle listStyleImage listStylePosition listStyleType margin marginBottom marginLeft marginRight marginTop maxHeight maxWidth minHeight minWidth orphans outline outlineColor outlineStyle outlineWidth overflow overflowX overflowY padding paddingBottom paddingLeft paddingRight paddingTop position right size tableLayout textAlign textAlignLast textAutospace textDecoration textIndent textJustify textKashidaSpace textOverflow textShadow textTransform textUnderlinePosition top verticalAlign visibility whiteSpace width wordBreak wordSpacing wordWrap zIndex".split(" ");

var nativeMethods = "addEventListener removeEventListener dispatchEvent".split(" ");
var nativeSelectorMethods = "getElementById getElementsByClassName getElementsByTagName getElementsByName querySelector querySelectorAll".split(" ");
var elementProperties = "innerHTML outerHTML textContent innerText outerText value".split(" ");
var elementQueryProperties = "firstElementChild lastElementChild previousElementSibling nextElementSibling previousSibling nextSibling children childNodes parentNode".split(" ");

var keywords = {html: html5ags, css: cssLess, js: vartypes};
var eventKeywords = {events: events, props: eventProperties, key: keyProperties, mouse: mouseProperties};

var whitespace = [
	' ', '\n', '\r', '\t', '\f', '\v', '\u00A0', '\u1680', '\u180E',
	'\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005', '\u2006',
	'\u2007', '\u2008', '\u2009', '\u200A', '\u2028', '\u2029', '\u202F',
	'\u205F', '\u3000'
];

var word_list = ['abbreviation', 'abbreviations', 'abettor', 'abettors', 'abilities', 'ability', 'abrasion', 'abrasions', 'abrasive', 'abrasives', 'absence', 'absences', 'abuse', 'abuser', 'abusers', 'abuses', 'acceleration', 'accelerations', 'acceptance', 'acceptances', 'acceptor', 'acceptors', 'access', 'accesses', 'accessories', 'accessory', 'accident', 'accidents', 'accommodation', 'accomplishment', 'accomplishments', 'accord', 'accordance', 'account', 'accountabilities', 'accountability', 'accounts', 'accrual', 'accruals', 'accruement', 'accumulation', 'accumulations', 'accuracy', 'accusation', 'accusations', 'acid', 'acids', 'acquisition', 'acquisitions', 'acquittal', 'acquittals', 'acre', 'acres', 'acronym', 'acronyms', 'act', 'action', 'actions', 'activities', 'activity', 'acts', 'adaption', 'adaptions', 'addition', 'additions', 'additive', 'additives', 'address', 'addressee', 'addressees', 'addresses', 'adherence', 'adherences', 'adhesive', 'adhesives', 'adjective', 'adjectives', 'adjustment', 'adjustments', 'administration', 'administrations', 'administrator', 'administrators', 'admiral', 'admirals', 'admiralties', 'admiralty', 'admission', 'admissions', 'advance', 'advancement', 'advancements', 'advances', 'advantage', 'advantages', 'adverb', 'adverbs', 'advertisement', 'advertisements', 'adviser', 'advisers', 'affair', 'affairs', 'affiant', 'affiants', 'afternoon', 'afternoons', 'age', 'agent', 'agents', 'ages', 'aggravation', 'aggravations', 'agreement', 'agreements', 'aid', 'aids', 'aim', 'aims', 'air', 'aircraft', 'airfield', 'airfields', 'airplane', 'airplanes', 'airport', 'airports', 'airs', 'airship', 'airships', 'airspeed', 'airspeeds', 'alarm', 'alarms', 'alcohol', 'alcoholic', 'alcoholics', 'alcoholism', 'alcohols', 'alert', 'alerts', 'algebra', 'algorithm', 'algorithms', 'alias', 'aliases', 'alibi', 'alibis', 'alignment', 'alignments', 'alkalinity', 'allegation', 'allegations', 'alley', 'alleys', 'allies', 'allocation', 'allocations', 'allotment', 'allotments', 'allowance', 'allowances', 'alloy', 'alloys', 'ally', 'alphabet', 'alphabets', 'alternate', 'alternates', 'alternation', 'alternations', 'alternative', 'alternatives', 'altimeter', 'altimeters', 'altitude', 'altitudes', 'aluminum', 'aluminums', 'ambiguity', 'americans', 'ammonia', 'ammunition', 'amount', 'amounts', 'amperage', 'amperages', 'ampere', 'amperes', 'amplifier', 'amplifiers', 'amplitude', 'amplitudes', 'amusement', 'amusements', 'analog', 'analogs', 'analyses', 'analysis', 'analyst', 'analysts', 'analyzer', 'analyzers', 'anchor', 'anchors', 'angle', 'angles', 'animal', 'animals', 'annex', 'annexs', 'answer', 'answers', 'antenna', 'antennas', 'anthem', 'anthems', 'anticipation', 'apostrophe', 'apostrophes', 'apparatus', 'apparatuses', 'appeal', 'appeals', 'appearance', 'appearances', 'appellate', 'apple', 'apples', 'applicant', 'applicants', 'application', 'applications', 'apportionment', 'apportionments', 'appraisal', 'appraisals', 'apprehension', 'apprehensions', 'apprenticeship', 'apprenticeships', 'approach', 'approaches', 'appropriation', 'appropriations', 'approval', 'approvals', 'april', 'apron', 'aprons', 'aptitude', 'aptitudes', 'arc', 'arch', 'arches', 'architecture', 'arcs', 'area', 'areas', 'argument', 'arguments', 'arithmetic', 'arm', 'armament', 'armaments', 'armful', 'armfuls', 'armies', 'armor', 'armories', 'armors', 'armory', 'arms', 'army', 'arraignment', 'arraignments', 'arrangement', 'arrangements', 'array', 'arrays', 'arrest', 'arrests', 'arrival', 'arrivals', 'arrow', 'arrows', 'art', 'article', 'articles', 'artilleries', 'artillery', 'arts', 'assault', 'assaults', 'assemblies', 'assembly', 'assignment', 'assignments', 'assistance', 'assistant', 'assistants', 'associate', 'associates', 'asterisk', 'asterisks', 'athwartship', 'atmosphere', 'atmospheres', 'atom', 'atoms', 'attachment', 'attachments', 'attack', 'attacker', 'attackers', 'attempt', 'attempts', 'attention', 'attesting', 'attitude', 'attitudes', 'attorney', 'attorneys', 'attraction', 'attractions', 'attribute', 'attributes', 'audit', 'auditor', 'auditors', 'audits', 'augmentation', 'augmentations', 'august', 'authorities', 'authority', 'authorization', 'authorizations', 'auto', 'automation', 'automobile', 'automobiles', 'autos', 'auxiliaries', 'average', 'averages', 'aviation', 'award', 'awards', 'ax', 'axes', 'axis', 'azimuth', 'azimuths', 'babies', 'baby', 'back', 'background', 'backgrounds', 'backs', 'backup', 'backups', 'badge', 'badges', 'bag', 'bags', 'bail', 'bailing', 'bails', 'balance', 'balances', 'ball', 'ballast', 'balloon', 'balloons', 'balls', 'band', 'bandage', 'bandages', 'bands', 'bang', 'bangs', 'bank', 'banks', 'bar', 'barge', 'barges', 'barometer', 'barometers', 'barrel', 'barrels', 'barrier', 'barriers', 'bars', 'base', 'baseline', 'basement', 'basements', 'bases', 'basics', 'basin', 'basins', 'basis', 'basket', 'baskets', 'bat', 'batch', 'batches', 'bath', 'bather', 'baths', 'bats', 'batteries', 'battery', 'battle', 'battles', 'battleship', 'battleships', 'baud', 'bauds', 'bay', 'bays', 'beach', 'beaches', 'beacon', 'beacons', 'bead', 'beads', 'beam', 'beams', 'bean', 'beans', 'bear', 'bearings', 'bears', 'beat', 'beats', 'bed', 'beds', 'beginner', 'beginners', 'behavior', 'behaviors', 'being', 'beings', 'belief', 'beliefs', 'bell', 'bells', 'belt', 'belts', 'bench', 'benches', 'bend', 'bends', 'benefit', 'benefits', 'berries', 'berry', 'berth', 'berthings', 'berths', 'bet', 'bets', 'bias', 'biases', 'bigamies', 'bigamy', 'bilge', 'bill', 'billet', 'billets', 'bills', 'bin', 'binder', 'binders', 'binoculars', 'bins', 'birth', 'births', 'bit', 'bite', 'bites', 'bits', 'blackboard', 'blackboards', 'blade', 'blades', 'blank', 'blanket', 'blankets', 'blanks', 'blast', 'blasts', 'blaze', 'blazes', 'blindfold', 'blindfolds', 'blink', 'blinks', 'block', 'blocks', 'blood', 'blot', 'blots', 'blow', 'blower', 'blowers', 'blows', 'blueprint', 'blueprints', 'blur', 'blurs', 'board', 'boards', 'boat', 'boats', 'boatswain', 'boatswains', 'bodies', 'body', 'boil', 'boiler', 'boilers', 'boils', 'bolt', 'bolts', 'bomb', 'bombs', 'bond', 'bonds', 'bone', 'bones', 'book', 'books', 'boom', 'booms', 'boost', 'boosts', 'boot', 'boots', 'bore', 'boresight', 'boresights', 'bottle', 'bottles', 'bottom', 'bottoms', 'bow', 'bowl', 'bowls', 'bows', 'box', 'boxcar', 'boxcars', 'boxes', 'boy', 'boys', 'brace', 'braces', 'bracket', 'brackets', 'braid', 'braids', 'brain', 'brains', 'brake', 'brakes', 'branch', 'branches', 'brass', 'breach', 'breaches', 'bread', 'breads', 'break', 'breakdown', 'breakdowns', 'breaks', 'breast', 'breasts', 'breath', 'breaths', 'breeze', 'breezes', 'brick', 'bricks', 'bridge', 'bridges', 'briefings', 'brightness', 'bristle', 'bristles', 'broadcasts', 'bronze', 'brook', 'brooks', 'broom', 'brooms', 'brother', 'brothers', 'brush', 'brushes', 'bubble', 'bubbles', 'bucket', 'buckets', 'buckle', 'buckles', 'bud', 'budget', 'budgets', 'buds', 'buffer', 'buffers', 'builder', 'builders', 'building', 'buildings', 'bulb', 'bulbs', 'bulk', 'bulkhead', 'bulkheads', 'bullet', 'bullets', 'bump', 'bumps', 'bunch', 'bunches', 'bundle', 'bundles', 'bunk', 'bunks', 'buoy', 'buoys', 'bureau', 'bureaus', 'burglaries', 'burglary', 'burn', 'burns', 'bus', 'buses', 'bush', 'bushel', 'bushels', 'bushes', 'bushing', 'bushings', 'business', 'businesses', 'butt', 'butter', 'butters', 'button', 'buttons', 'butts', 'buy', 'buys', 'buzz', 'buzzer', 'buzzers', 'buzzes', 'bypass', 'bypasses', 'byte', 'bytes', 'cab', 'cabinet', 'cabinets', 'cable', 'cables', 'cabs', 'cage', 'cages', 'cake', 'cakes', 'calculation', 'calculations', 'calculator', 'calculators', 'calendar', 'calendars', 'caliber', 'calibers', 'calibration', 'calibrations', 'call', 'calls', 'calorie', 'calories', 'cam', 'camera', 'cameras', 'camp', 'camps', 'cams', 'canal', 'canals', 'candidate', 'candidates', 'candle', 'candles', 'cane', 'canister', 'canisters', 'cannon', 'cannons', 'cans', 'canvas', 'canvases', 'canyon', 'canyons', 'cap', 'capabilities', 'capability', 'capacitance', 'capacitances', 'capacities', 'capacitor', 'capacitors', 'capacity', 'cape', 'capes', 'capital', 'capitals', 'caps', 'capstan', 'capstans', 'captain', 'captains', 'capture', 'captures', 'car', 'carbon', 'carbons', 'carburetor', 'carburetors', 'card', 'cardboard', 'cards', 'care', 'career', 'careers', 'carelessness', 'cares', 'cargo', 'cargoes', 'carload', 'carloads', 'carpet', 'carpets', 'carriage', 'carriages', 'carrier', 'carriers', 'cars', 'cart', 'cartridge', 'cartridges', 'carts', 'case', 'cases', 'cash', 'cashier', 'cashiers', 'casts', 'casualties', 'casualty', 'catalog', 'catalogs', 'catch', 'catcher', 'catchers', 'catches', 'categories', 'category', 'cathode', 'cathodes', 'cause', 'causes', 'caution', 'cautions', 'cave', 'caves', 'cavities', 'cavity', 'ceiling', 'ceilings', 'cell', 'cellar', 'cellars', 'cells', 'cement', 'cements', 'cent', 'center', 'centerline', 'centerlines', 'centers', 'centimeter', 'centimeters', 'cents', 'ceramics', 'ceremonies', 'ceremony', 'certificate', 'certificates', 'certification', 'certifications', 'chain', 'chains', 'chair', 'chairman', 'chairmen', 'chairperson', 'chairpersons', 'chairs', 'chairwoman', 'chairwomen', 'chalk', 'chalks', 'challenge', 'challenges', 'chamber', 'chambers', 'chance', 'chances', 'change', 'changes', 'channel', 'channels', 'chaplain', 'chaplains', 'chapter', 'chapters', 'character', 'characteristic', 'characteristics', 'characters', 'charge', 'charges', 'chart', 'charts', 'chase', 'chases', 'chattel', 'chattels', 'chatter', 'cheat', 'cheater', 'cheaters', 'cheats', 'check', 'checker', 'checkers', 'checkout', 'checkouts', 'checkpoint', 'checkpoints', 'checks', 'cheek', 'cheeks', 'cheese', 'cheeses', 'chemical', 'chemicals', 'chemistry', 'chest', 'chests', 'chief', 'chiefs', 'child', 'children', 'chill', 'chills', 'chimney', 'chimneys', 'chin', 'chins', 'chip', 'chips', 'chit', 'chits', 'chock', 'chocks', 'choice', 'choices', 'choke', 'chokes', 'church', 'churches', 'churn', 'churns', 'circle', 'circles', 'circuit', 'circuitries', 'circuitry', 'circuits', 'circulation', 'circulations', 'circumference', 'circumferences', 'circumstance', 'circumstances', 'cities', 'citizen', 'citizens', 'city', 'civilian', 'civilians', 'claim', 'claims', 'clamp', 'clamps', 'clang', 'clangs', 'clap', 'claps', 'class', 'classes', 'classification', 'classifications', 'classroom', 'classrooms', 'claw', 'claws', 'clay', 'cleanliness', 'cleanser', 'cleansers', 'clearance', 'clearances', 'cleat', 'cleats', 'clericals', 'clerk', 'clerks', 'click', 'clicks', 'cliff', 'cliffs', 'clip', 'clips', 'clock', 'clocks', 'closure', 'closures', 'cloth', 'clothes', 'clothing', 'cloths', 'cloud', 'cloudiness', 'clouds', 'club', 'clubs', 'clump', 'clumps', 'coal', 'coals', 'coast', 'coasts', 'coat', 'coating', 'coats', 'cockpit', 'cockpits', 'code', 'coder', 'coders', 'codes', 'coil', 'coils', 'coin', 'coins', 'colds', 'collar', 'collars', 'collection', 'collections', 'collector', 'collectors', 'college', 'colleges', 'collision', 'collisions', 'colon', 'colons', 'color', 'colors', 'column', 'columns', 'comb', 'combat', 'combatant', 'combatants', 'combination', 'combinations', 'combs', 'combustion', 'comfort', 'comforts', 'comma', 'command', 'commander', 'commanders', 'commands', 'commas', 'commendation', 'commendations', 'comment', 'comments', 'commission', 'commissions', 'commitment', 'commitments', 'committee', 'committees', 'communication', 'communications', 'communities', 'community', 'companies', 'company', 'comparison', 'comparisons', 'compartment', 'compartments', 'compass', 'compasses', 'compensation', 'compensations', 'competition', 'competitions', 'compiler', 'compilers', 'complaint', 'complaints', 'complement', 'complements', 'completion', 'completions', 'complexes', 'compliance', 'compliances', 'component', 'components', 'composites', 'composition', 'compositions', 'compounds', 'compress', 'compresses', 'compression', 'compressions', 'compressor', 'compressors', 'compromise', 'compromises', 'computation', 'computations', 'computer', 'computers', 'concentration', 'concentrations', 'concept', 'concepts', 'concern', 'concerns', 'concurrence', 'condensation', 'condensations', 'condenser', 'condensers', 'condition', 'conditions', 'conduct', 'conductor', 'conductors', 'conducts', 'cone', 'cones', 'conference', 'conferences', 'confession', 'confessions', 'confidence', 'confidences', 'configuration', 'configurations', 'confinement', 'confinements', 'conflict', 'conflicts', 'confusion', 'confusions', 'congress', 'conjecture', 'conjectures', 'conjunction', 'conjunctions', 'conn', 'connection', 'connections', 'consequence', 'consequences', 'consideration', 'console', 'consoles', 'consolidation', 'conspiracies', 'conspiracy', 'constitution', 'construction', 'contact', 'contacts', 'container', 'containers', 'contamination', 'contempt', 'content', 'contention', 'contents', 'continuity', 'contraband', 'contract', 'contracts', 'contrast', 'contrasts', 'contribution', 'contributions', 'control', 'controls', 'convenience', 'conveniences', 'convention', 'conventions', 'conversion', 'conversions', 'convulsion', 'convulsions', 'coordinate', 'coordinates', 'coordination', 'coordinations', 'coordinator', 'coordinators', 'copies', 'copper', 'copy', 'cord', 'cords', 'core', 'cores', 'cork', 'corks', 'corner', 'corners', 'corps', 'correction', 'corrections', 'correlation', 'correlations', 'correspondence', 'corrosion', 'cosal', 'cosals', 'costs', 'cot', 'cots', 'cotton', 'cottons', 'cough', 'coughs', 'counsel', 'counselor', 'counselors', 'counsels', 'count', 'counter', 'countermeasure', 'countermeasures', 'counters', 'countries', 'country', 'counts', 'couple', 'couples', 'couplings', 'course', 'courses', 'court', 'courtesies', 'courtesy', 'courts', 'cover', 'coxswain', 'coxswains', 'crack', 'cracks', 'cradle', 'cradles', 'craft', 'crafts', 'cramp', 'cramps', 'crank', 'cranks', 'crash', 'crashes', 'crawl', 'credibility', 'credit', 'credits', 'creek', 'creeks', 'crew', 'crewmember', 'crewmembers', 'crews', 'cries', 'crime', 'crimes', 'crop', 'crops', 'cross', 'crosses', 'crowd', 'crowds', 'crown', 'crowns', 'cruise', 'cruiser', 'cruisers', 'cruises', 'crust', 'crusts', 'cry', 'crystal', 'crystals', 'cube', 'cubes', 'cuff', 'cuffs', 'cup', 'cupful', 'cupfuls', 'cups', 'cure', 'cures', 'curl', 'curls', 'currencies', 'currency', 'currents', 'curtain', 'curtains', 'curvature', 'curvatures', 'curve', 'curves', 'cushion', 'cushions', 'custodian', 'custodians', 'custody', 'custom', 'customer', 'customers', 'customs', 'cuts', 'cycle', 'cycles', 'cylinder', 'cylinders', 'dab', 'dabs', 'dam', 'damage', 'damages', 'dams', 'danger', 'dangers', 'dare', 'dares', 'dart', 'darts', 'dash', 'data', 'date', 'dates', 'daughter', 'daughters', 'davit', 'davits', 'dawn', 'dawns', 'day', 'daybreak', 'days', 'daytime', 'deal', 'dealer', 'dealers', 'deals', 'dears', 'death', 'deaths', 'debit', 'debits', 'debris', 'debt', 'debts', 'decay', 'december', 'decibel', 'decibels', 'decimals', 'decision', 'decisions', 'deck', 'decks', 'decoder', 'decoders', 'decontamination', 'decoration', 'decorations', 'decrease', 'decreases', 'decrement', 'decrements', 'dedication', 'dedications', 'deduction', 'deductions', 'deed', 'deeds', 'default', 'defaults', 'defeat', 'defeats', 'defect', 'defection', 'defections', 'defects', 'defense', 'defenses', 'deficiencies', 'definition', 'definitions', 'deflector', 'deflectors', 'degree', 'degrees', 'delay', 'delays', 'delegate', 'delegates', 'deletion', 'deletions', 'delight', 'delights', 'delimiter', 'delimiters', 'deliveries', 'delivery', 'democracies', 'democracy', 'demonstration', 'demonstrations', 'densities', 'density', 'dent', 'dents', 'department', 'departments', 'departure', 'departures', 'dependence', 'dependencies', 'dependents', 'depletion', 'depletions', 'deployment', 'deployments', 'deposit', 'deposition', 'depositions', 'deposits', 'depot', 'depots', 'depth', 'depths', 'deputies', 'deputy', 'dereliction', 'description', 'descriptions', 'desert', 'deserter', 'deserters', 'desertion', 'desertions', 'deserts', 'designation', 'designations', 'designator', 'designators', 'desire', 'desires', 'desk', 'desks', 'destination', 'destinations', 'destroyer', 'destroyers', 'destruction', 'detachment', 'detachments', 'detail', 'details', 'detection', 'detent', 'detention', 'detentions', 'detents', 'detonation', 'detonations', 'development', 'developments', 'deviation', 'deviations', 'device', 'devices', 'dew', 'diagnoses', 'diagnosis', 'diagnostics', 'diagonals', 'diagram', 'diagrams', 'dial', 'dials', 'diameter', 'diameters', 'diamond', 'diamonds', 'diaphragm', 'diaphragms', 'diaries', 'diary', 'dictionaries', 'dictionary', 'diesel', 'diesels', 'difference', 'differences', 'difficulties', 'difficulty', 'digestion', 'digit', 'digits', 'dimension', 'dimensions', 'diode', 'diodes', 'dioxide', 'dioxides', 'dip', 'dips', 'direction', 'directions', 'directive', 'directives', 'directories', 'directory', 'dirt', 'disabilities', 'disability', 'disadvantage', 'disadvantages', 'disassemblies', 'disassembly', 'disaster', 'disasters', 'discard', 'discards', 'discharge', 'discharges', 'discipline', 'disciplines', 'discontinuance', 'discontinuances', 'discontinuation', 'discontinuations', 'discount', 'discounts', 'discoveries', 'discovery', 'discrepancies', 'discrepancy', 'discretion', 'discrimination', 'discriminations', 'discussion', 'discussions', 'disease', 'diseases', 'disgust', 'dish', 'dishes', 'disk', 'disks', 'dispatch', 'dispatcher', 'dispatchers', 'dispatches', 'displacement', 'displacements', 'display', 'displays', 'disposal', 'dissemination', 'dissipation', 'distance', 'distances', 'distortion', 'distortions', 'distress', 'distresses', 'distribution', 'distributions', 'distributor', 'distributors', 'district', 'districts', 'ditch', 'ditches', 'ditto', 'dittos', 'dive', 'diver', 'divers', 'dives', 'divider', 'dividers', 'division', 'divisions', 'dock', 'dockings', 'docks', 'document', 'documentation', 'documentations', 'documents', 'dollar', 'dollars', 'dollies', 'dolly', 'dominion', 'dominions', 'donor', 'donors', 'door', 'doorknob', 'doorknobs', 'doors', 'doorstep', 'doorsteps', 'dope', 'dopes', 'dose', 'doses', 'dot', 'dots', 'doubt', 'downgrade', 'downgrades', 'dozen', 'dozens', 'draft', 'drafts', 'drag', 'drags', 'drain', 'drainage', 'drainer', 'drainers', 'drains', 'drawer', 'drawers', 'drawings', 'dress', 'dresses', 'drift', 'drifts', 'drill', 'driller', 'drillers', 'drills', 'drink', 'drinks', 'drip', 'drips', 'drive', 'driver', 'drivers', 'drives', 'drop', 'drops', 'drug', 'drugs', 'drum', 'drums', 'drunkeness', 'drunks', 'drydock', 'drydocks', 'dump', 'duplicate', 'duplicates', 'durability', 'duration', 'duress', 'dust', 'dusts', 'duties', 'duty', 'dwell', 'dye', 'dyes', 'dynamics', 'dynamometer', 'dynamometers', 'ear', 'ears', 'earth', 'ease', 'eases', 'east', 'echelon', 'echelons', 'echo', 'echoes', 'economies', 'economy', 'eddies', 'eddy', 'edge', 'edges', 'editor', 'editors', 'education', 'educator', 'educators', 'effect', 'effectiveness', 'effects', 'efficiencies', 'efficiency', 'effort', 'efforts', 'egg', 'eggs', 'eighths', 'eighties', 'eights', 'ejection', 'elapse', 'elapses', 'elbow', 'elbows', 'election', 'elections', 'electrician', 'electricians', 'electricity', 'electrode', 'electrodes', 'electrolyte', 'electrolytes', 'electron', 'electronics', 'electrons', 'element', 'elements', 'elevation', 'eleven', 'eligibility', 'elimination', 'eliminator', 'eliminators', 'embosses', 'emergencies', 'emergency', 'emitter', 'emitters', 'employee', 'employees', 'enclosure', 'enclosures', 'encounter', 'encounters', 'end', 'endeavor', 'endeavors', 'endings', 'ends', 'enemies', 'enemy', 'energies', 'energizer', 'energizers', 'energy', 'engine', 'engineer', 'engineers', 'engines', 'enlistment', 'enlistments', 'ensign', 'ensigns', 'entrance', 'entrances', 'entrapment', 'entrapments', 'entries', 'entry', 'envelope', 'envelopes', 'environment', 'environments', 'equation', 'equations', 'equator', 'equipment', 'equivalent', 'equivalents', 'eraser', 'erasers', 'error', 'errors', 'escape', 'escapes', 'escort', 'escorts', 'establishment', 'establishments', 'evacuation', 'evacuations', 'evaluation', 'evaluations', 'evaporation', 'eve', 'evening', 'evenings', 'event', 'events', 'eves', 'evidence', 'examination', 'examinations', 'example', 'examples', 'exception', 'exceptions', 'excess', 'excesses', 'exchange', 'exchanger', 'exchangers', 'exchanges', 'excuse', 'excuses', 'execution', 'executions', 'executive', 'executives', 'exercise', 'exercises', 'exhaust', 'exhausts', 'exhibit', 'exhibits', 'existence', 'exit', 'exits', 'expansion', 'expansions', 'expenditure', 'expenditures', 'expense', 'expenses', 'experience', 'experiences', 'expert', 'experts', 'expiration', 'explanation', 'explanations', 'explosion', 'explosions', 'explosives', 'exposure', 'exposures', 'extension', 'extensions', 'extent', 'extenuation', 'extenuations', 'exterior', 'exteriors', 'extras', 'eye', 'eyes', 'fabrication', 'fabrications', 'face', 'facepiece', 'facepieces', 'faces', 'facilitation', 'facilities', 'facility', 'fact', 'factor', 'factories', 'factors', 'factory', 'facts', 'failure', 'failures', 'fake', 'fakes', 'fall', 'fallout', 'falls', 'families', 'family', 'fan', 'fans', 'fantail', 'fantails', 'farad', 'farads', 'fare', 'fares', 'farm', 'farms', 'fashion', 'fashions', 'fastener', 'fasteners', 'father', 'fathers', 'fathom', 'fathoms', 'fatigue', 'fatigues', 'fats', 'fault', 'faults', 'fear', 'fears', 'feather', 'feathers', 'feature', 'features', 'february', 'fee', 'feed', 'feedback', 'feeder', 'feeders', 'feeds', 'feelings', 'fees', 'feet', 'fellow', 'fellows', 'fence', 'fences', 'fetch', 'fetches', 'fiber', 'fibers', 'fiction', 'field', 'fields', 'fifteen', 'fifths', 'fifties', 'fifty', 'fight', 'fighter', 'fighters', 'fighting', 'fights', 'figure', 'figures', 'file', 'files', 'filler', 'fillers', 'film', 'films', 'filter', 'filters', 'fines', 'finger', 'fingers', 'finish', 'finishes', 'fire', 'firearm', 'firearms', 'fireball', 'fireballs', 'firefighting', 'fireplug', 'fireplugs', 'firer', 'firers', 'fires', 'firings', 'firmware', 'fish', 'fishes', 'fist', 'fists', 'fits', 'fittings', 'fives', 'fixture', 'flag', 'flags', 'flake', 'flakes', 'flame', 'flames', 'flange', 'flanges', 'flap', 'flaps', 'flare', 'flares', 'flash', 'flashes', 'flashlight', 'flashlights', 'fleet', 'fleets', 'flesh', 'flicker', 'flickers', 'flight', 'flights', 'float', 'floats', 'flood', 'floods', 'floor', 'floors', 'flow', 'flowchart', 'flower', 'flowers', 'fluid', 'fluids', 'flush', 'foam', 'focus', 'focuses', 'fog', 'fogs', 'fold', 'folder', 'folders', 'folds', 'food', 'foods', 'foot', 'footing', 'footings', 'force', 'forces', 'forearm', 'forearms', 'forecastle', 'forecastles', 'forecasts', 'foreground', 'forehead', 'foreheads', 'forest', 'forests', 'fork', 'forks', 'form', 'format', 'formation', 'formations', 'formats', 'forms', 'formula', 'formulas', 'fort', 'forties', 'forts', 'forty', 'fountain', 'fountains', 'fours', 'fourths', 'fraction', 'fractions', 'fracture', 'fractures', 'frame', 'frames', 'freedom', 'freeze', 'freezes', 'freight', 'freights', 'frequencies', 'frequency', 'freshwater', 'friction', 'friday', 'fridays', 'friend', 'friends', 'frigate', 'frigates', 'front', 'fronts', 'frost', 'frosts', 'fruit', 'fruits', 'fuel', 'fuels', 'fumes', 'function', 'functions', 'fund', 'funding', 'funds', 'fur', 'furnace', 'furnaces', 'furs', 'fuse', 'fuses', 'future', 'futures', 'gage', 'gages', 'galley', 'galleys', 'gallon', 'gallons', 'gallows', 'game', 'games', 'gang', 'gangs', 'gangway', 'gangways', 'gap', 'gaps', 'garage', 'garages', 'garden', 'gardens', 'gas', 'gases', 'gasket', 'gaskets', 'gasoline', 'gasolines', 'gate', 'gates', 'gear', 'gears', 'generals', 'generation', 'generations', 'generator', 'generators', 'geography', 'giant', 'giants', 'girl', 'girls', 'glance', 'glances', 'gland', 'glands', 'glass', 'glasses', 'glaze', 'glazes', 'gleam', 'gleams', 'glide', 'glides', 'glossaries', 'glossary', 'glove', 'gloves', 'glow', 'glows', 'glue', 'glues', 'goal', 'goals', 'goggles', 'gold', 'goods', 'government', 'governments', 'governor', 'governors', 'grade', 'grades', 'grain', 'grains', 'gram', 'grams', 'grant', 'grants', 'graph', 'graphs', 'grasp', 'grasps', 'grass', 'grasses', 'gravel', 'gravity', 'grease', 'greases', 'greenwich', 'grid', 'grids', 'grinder', 'grinders', 'grip', 'grips', 'groan', 'groans', 'groceries', 'groom', 'grooms', 'groove', 'grooves', 'gross', 'grounds', 'group', 'groups', 'grove', 'groves', 'growth', 'growths', 'guard', 'guards', 'guess', 'guesses', 'guest', 'guests', 'guidance', 'guide', 'guideline', 'guidelines', 'guides', 'guilt', 'gulf', 'gulfs', 'gum', 'gums', 'gun', 'gunfire', 'gunnery', 'gunpowder', 'guns', 'guy', 'guys', 'gyro', 'gyros', 'gyroscope', 'gyroscopes', 'habit', 'habits', 'hail', 'hair', 'hairpin', 'hairpins', 'hairs', 'half', 'hall', 'halls', 'halt', 'halts', 'halves', 'halyard', 'halyards', 'hammer', 'hammers', 'hand', 'handful', 'handfuls', 'handle', 'handler', 'handlers', 'handles', 'hands', 'handwriting', 'hangar', 'hangars', 'harbor', 'harbors', 'hardcopies', 'hardcopy', 'hardness', 'hardship', 'hardships', 'hardware', 'harm', 'harmonies', 'harmony', 'harness', 'harnesses', 'harpoon', 'harpoons', 'hashmark', 'hashmarks', 'haste', 'hat', 'hatch', 'hatches', 'hatchet', 'hatchets', 'hate', 'hats', 'haul', 'hauls', 'hazard', 'hazards', 'head', 'header', 'headers', 'headings', 'headquarters', 'heads', 'headset', 'headsets', 'health', 'heap', 'heaps', 'heart', 'hearts', 'heat', 'heater', 'heaters', 'heats', 'heel', 'heels', 'height', 'heights', 'helicopter', 'helicopters', 'hello', 'helm', 'helmet', 'helmets', 'helms', 'helmsman', 'helmsmen', 'help', 'hem', 'hems', 'henry', 'henrys', 'here', 'hertz', 'hickories', 'hickory', 'hierarchies', 'hierarchy', 'highline', 'highlines', 'highway', 'highways', 'hill', 'hills', 'hillside', 'hillsides', 'hilltop', 'hilltops', 'hinge', 'hinges', 'hint', 'hints', 'hip', 'hips', 'hiss', 'hisses', 'histories', 'history', 'hitch', 'hitches', 'hits', 'hoist', 'hoists', 'hold', 'holddown', 'holddowns', 'holder', 'holders', 'holds', 'hole', 'holes', 'home', 'homes', 'honk', 'honks', 'honor', 'honors', 'hood', 'hoods', 'hoof', 'hoofs', 'hook', 'hooks', 'hoop', 'hoops', 'hope', 'hopes', 'horizon', 'horizons', 'horn', 'horns', 'horsepower', 'hose', 'hoses', 'hospital', 'hospitals', 'hotel', 'hotels', 'hour', 'hours', 'house', 'housefall', 'housefalls', 'houses', 'housing', 'housings', 'howl', 'howls', 'hub', 'hubs', 'hug', 'hugs', 'hull', 'hulls', 'hum', 'human', 'humans', 'humidity', 'humor', 'hump', 'humps', 'hums', 'hundred', 'hundreds', 'hunk', 'hunks', 'hunt', 'hunts', 'hush', 'hushes', 'hut', 'huts', 'hydraulics', 'hydrometer', 'hydrometers', 'hygiene', 'hyphen', 'hyphens', 'ice', 'ices', 'icing', 'idea', 'ideal', 'ideals', 'ideas', 'identification', 'ignition', 'ignitions', 'illustration', 'illustrations', 'image', 'images', 'impact', 'impedance', 'implantation', 'implantations', 'implement', 'implementation', 'implementations', 'implements', 'importance', 'improvement', 'improvements', 'impulse', 'impulses', 'incentive', 'incentives', 'inception', 'inceptions', 'inch', 'inches', 'inclination', 'inclinations', 'incline', 'inclines', 'income', 'incomes', 'increase', 'increases', 'increment', 'increments', 'independence', 'index', 'indexes', 'indicate', 'indication', 'indications', 'indicator', 'indicators', 'individuals', 'inductance', 'industries', 'industry', 'infection', 'infections', 'inference', 'inferences', 'influence', 'influences', 'information', 'ingredient', 'ingredients', 'initial', 'initials', 'initiator', 'initiators', 'injection', 'injections', 'injector', 'injectors', 'injuries', 'injury', 'ink', 'inlet', 'inlets', 'input', 'inquiries', 'inquiry', 'insanities', 'insanity', 'insertion', 'insertions', 'insignia', 'insignias', 'inspection', 'inspections', 'installation', 'installations', 'instance', 'instances', 'instruction', 'instructions', 'instructor', 'instructors', 'instrument', 'instrumentation', 'instruments', 'insulation', 'insurance', 'intake', 'intakes', 'integer', 'integers', 'integrity', 'intelligence', 'intelligences', 'intensities', 'intensity', 'intent', 'intents', 'interaction', 'interactions', 'interchange', 'interchanges', 'intercom', 'intercoms', 'interest', 'interests', 'interface', 'interfaces', 'interference', 'interior', 'interiors', 'interpreter', 'interpreters', 'interrelation', 'interruption', 'interruptions', 'interval', 'intervals', 'interview', 'interviewer', 'interviewers', 'interviews', 'introduction', 'introductions', 'invention', 'inventions', 'inventories', 'inventory', 'investigation', 'investigations', 'investigator', 'investigators', 'investment', 'investments', 'invoice', 'invoices', 'iron', 'irons', 'island', 'islands', 'isolation', 'issue', 'issues', 'item', 'items', 'itineraries', 'itinerary', 'ivory', 'jack', 'jackbox', 'jackboxes', 'jacket', 'jackets', 'jacks', 'jail', 'jails', 'jam', 'jams', 'january', 'jar', 'jars', 'jaw', 'jaws', 'jellies', 'jelly', 'jeopardies', 'jeopardy', 'jets', 'jewel', 'jewels', 'jig', 'jigs', 'job', 'jobs', 'joint', 'joints', 'journal', 'journals', 'journey', 'journeys', 'judge', 'judges', 'judgment', 'jug', 'jugs', 'july', 'jump', 'jumper', 'jumpers', 'jumps', 'junction', 'junctions', 'june', 'junk', 'juries', 'jurisdiction', 'jurisdictions', 'jury', 'justice', 'keel', 'keels', 'kettle', 'kettles', 'key', 'keyboard', 'keyboards', 'keys', 'keyword', 'keywords', 'kick', 'kicks', 'kill', 'kills', 'kilogram', 'kilograms', 'kiloliter', 'kiloliters', 'kilometer', 'kilometers', 'kinds', 'kiss', 'kisses', 'kit', 'kite', 'kites', 'kits', 'knee', 'knees', 'knife', 'knives', 'knob', 'knobs', 'knock', 'knocks', 'knot', 'knots', 'knowledge', 'label', 'labels', 'labor', 'laboratories', 'laboratory', 'labors', 'lace', 'laces', 'lack', 'ladder', 'ladders', 'lake', 'lakes', 'lamp', 'lamps', 'land', 'landings', 'lands', 'lane', 'lanes', 'language', 'languages', 'lantern', 'lanterns', 'lap', 'laps', 'lapse', 'lapses', 'lard', 'laser', 'lasers', 'lash', 'lashes', 'latch', 'latches', 'latitude', 'latitudes', 'laugh', 'laughs', 'launch', 'launcher', 'launchers', 'launches', 'laundries', 'laundry', 'law', 'laws', 'layer', 'layers', 'lead', 'leader', 'leaders', 'leadership', 'leads', 'leaf', 'leak', 'leakage', 'leakages', 'leaks', 'leap', 'leaper', 'leapers', 'leaps', 'learning', 'leather', 'leathers', 'leave', 'leaves', 'leaving', 'lee', 'lees', 'leg', 'legend', 'legends', 'legging', 'leggings', 'legislation', 'legs', 'lender', 'lenders', 'length', 'lengths', 'lens', 'lenses', 'lesson', 'lessons', 'letter', 'letterhead', 'letterheads', 'lettering', 'letters', 'levels', 'lever', 'levers', 'liberties', 'liberty', 'libraries', 'library', 'license', 'licenses', 'lick', 'licks', 'lid', 'lids', 'lieutenant', 'lieutenants', 'life', 'lifeboat', 'lifeboats', 'lifetime', 'lifetimes', 'lift', 'lifts', 'light', 'lighter', 'lighters', 'lightning', 'lights', 'limb', 'limbs', 'lime', 'limes', 'limit', 'limitation', 'limitations', 'limits', 'limp', 'limps', 'line', 'linen', 'linens', 'lines', 'lining', 'link', 'linkage', 'linkages', 'links', 'lint', 'lints', 'lip', 'lips', 'liquor', 'liquors', 'list', 'listing', 'listings', 'lists', 'liter', 'liters', 'litre', 'litres', 'liver', 'livers', 'lives', 'load', 'loads', 'loaf', 'loan', 'loans', 'loaves', 'location', 'locations', 'lock', 'locker', 'lockers', 'locks', 'locomotive', 'locomotives', 'log', 'logic', 'logistics', 'logs', 'longitude', 'longitudes', 'look', 'lookout', 'lookouts', 'looks', 'loop', 'loops', 'loran', 'loss', 'losses', 'lot', 'lots', 'loudspeaker', 'loudspeakers', 'love', 'lubricant', 'lubricants', 'lubrication', 'lumber', 'lump', 'lumps', 'lung', 'lungs', 'machine', 'machinery', 'machines', 'macro', 'macros', 'magazine', 'magazines', 'magnesium', 'magnet', 'magneto', 'magnetos', 'magnets', 'magnitude', 'mail', 'mailbox', 'mailboxes', 'maintainability', 'maintenance', 'major', 'majorities', 'majority', 'majors', 'make', 'makes', 'makeup', 'male', 'males', 'malfunction', 'malfunctions', 'man', 'management', 'managements', 'manager', 'managers', 'maneuver', 'maneuvers', 'manifest', 'manifests', 'manner', 'manners', 'manpower', 'manual', 'manuals', 'manufacturer', 'manufacturers', 'map', 'maples', 'maps', 'marble', 'marbles', 'march', 'marches', 'margin', 'margins', 'marines', 'mark', 'market', 'markets', 'marks', 'mask', 'masks', 'mass', 'massed', 'masses', 'mast', 'master', 'masters', 'masts', 'mat', 'match', 'matches', 'mate', 'material', 'materials', 'mates', 'math', 'mathematics', 'mats', 'matter', 'matters', 'mattress', 'mattresses', 'maximum', 'maximums', 'meal', 'meals', 'meanings', 'means', 'measure', 'measurement', 'measurements', 'measures', 'meat', 'meats', 'mechanic', 'mechanics', 'mechanism', 'mechanisms', 'medal', 'medals', 'medicine', 'medicines', 'medium', 'mediums', 'meet', 'meeting', 'meetings', 'meets', 'member', 'members', 'membrane', 'membranes', 'memorandum', 'memorandums', 'memories', 'memory', 'men', 'mention', 'mentions', 'menu', 'menus', 'merchandise', 'merchant', 'merchants', 'mercury', 'meridian', 'meridians', 'mess', 'message', 'messages', 'messenger', 'messengers', 'messes', 'metal', 'metals', 'meter', 'meters', 'method', 'methodology', 'methods', 'metrics', 'microphone', 'microphones', 'midnight', 'midwatch', 'midwatches', 'mile', 'miles', 'milestone', 'milestones', 'military', 'milk', 'milks', 'mill', 'milligram', 'milligrams', 'milliliter', 'milliliters', 'millimeter', 'millimeters', 'million', 'millions', 'mills', 'mind', 'minds', 'mine', 'miner', 'mineral', 'minerals', 'miners', 'mines', 'minimum', 'minimums', 'minority', 'mint', 'mints', 'minuses', 'minute', 'minutes', 'mirror', 'mirrors', 'misalignment', 'misalignments', 'misalinement', 'misalinements', 'misconduct', 'misfit', 'misfits', 'misleads', 'miss', 'misses', 'missile', 'missiles', 'mission', 'missions', 'mist', 'mistake', 'mistakes', 'mistrial', 'mistrials', 'mists', 'mitt', 'mitten', 'mittens', 'mitts', 'mix', 'mixes', 'mixture', 'mixtures', 'mode', 'model', 'models', 'modem', 'modes', 'modification', 'modifications', 'module', 'modules', 'moisture', 'moistures', 'molecule', 'molecules', 'moment', 'moments', 'monday', 'mondays', 'money', 'moneys', 'monitor', 'monitors', 'monolith', 'monoliths', 'month', 'months', 'moon', 'moonlight', 'moons', 'mop', 'mops', 'morale', 'morals', 'morning', 'mornings', 'morphine', 'moss', 'mosses', 'motel', 'motels', 'mother', 'mothers', 'motion', 'motions', 'motor', 'motors', 'mount', 'mountain', 'mountains', 'mounts', 'mouth', 'mouths', 'move', 'movement', 'movements', 'mover', 'movers', 'moves', 'much', 'mud', 'mug', 'mugs', 'mule', 'mules', 'multimeter', 'multimeters', 'multiplex', 'multiplication', 'multiplications', 'multisystem', 'multisystems', 'multitask', 'multitasks', 'muscle', 'muscles', 'music', 'mustard', 'nail', 'nails', 'name', 'nameplate', 'nameplates', 'names', 'narcotics', 'nation', 'nations', 'nature', 'nausea', 'navies', 'navigation', 'navigations', 'navigator', 'navigators', 'navy', 'neck', 'necks', 'need', 'needle', 'needles', 'needs', 'neglect', 'negligence', 'nerve', 'nerves', 'nest', 'nests', 'net', 'nets', 'network', 'networks', 'neutron', 'neutrons', 'news', 'nickel', 'nickels', 'night', 'nights', 'nines', 'nineties', 'nod', 'nods', 'noise', 'noises', 'nomenclature', 'nomenclatures', 'nonavailabilities', 'noon', 'north', 'nose', 'noses', 'notation', 'note', 'notes', 'notice', 'notices', 'noun', 'nouns', 'november', 'nozzle', 'nozzles', 'null', 'nulls', 'number', 'numbers', 'numeral', 'numerals', 'nurse', 'nurses', 'nut', 'nuts', 'nylon', 'nylons', 'oak', 'oaks', 'oar', 'oars', 'object', 'objective', 'objectives', 'objects', 'obligation', 'obligations', 'observation', 'observations', 'observer', 'observers', 'occasion', 'occasions', 'occurrence', 'occurrences', 'ocean', 'oceans', 'october', 'octobers', 'odds', 'odor', 'odors', 'offender', 'offenders', 'offense', 'offenses', 'offer', 'offering', 'offers', 'office', 'officer', 'officers', 'offices', 'official', 'officials', 'offsets', 'ohm', 'ohms', 'oil', 'oils', 'okays', 'ones', 'openings', 'operabilities', 'operability', 'operand', 'operands', 'operation', 'operations', 'operator', 'operators', 'opinion', 'opinions', 'opportunities', 'opportunity', 'opposites', 'option', 'options', 'orange', 'oranges', 'order', 'orders', 'ordnance', 'ore', 'ores', 'organ', 'organization', 'organizations', 'organs', 'orifice', 'orifices', 'origin', 'originals', 'originator', 'originators', 'origins', 'ornament', 'ornaments', 'oscillation', 'oscillations', 'oscillator', 'oscillators', 'others', 'ounce', 'ounces', 'outboards', 'outfit', 'outfits', 'outing', 'outlet', 'outlets', 'outline', 'outlines', 'output', 'oven', 'ovens', 'overalls', 'overcoat', 'overcoats', 'overcurrent', 'overcurrents', 'overflow', 'overlay', 'overlays', 'overload', 'overloads', 'overtime', 'overvoltage', 'overvoltages', 'owner', 'owners', 'oxide', 'oxides', 'oxygen', 'oxygens', 'pace', 'paces', 'pacific', 'pack', 'package', 'packages', 'packs', 'pad', 'pads', 'page', 'pages', 'pail', 'pails', 'pain', 'paint', 'painter', 'painters', 'painting', 'paintings', 'paints', 'pair', 'pairs', 'pan', 'pane', 'panel', 'paneling', 'panels', 'panes', 'pans', 'paper', 'papers', 'parachute', 'parachutes', 'paragraph', 'paragraphs', 'parallels', 'parameter', 'parameters', 'parcel', 'parcels', 'parentheses', 'parenthesis', 'parities', 'parity', 'park', 'parks', 'part', 'participation', 'participations', 'particle', 'particles', 'parties', 'partition', 'partitions', 'partner', 'partners', 'parts', 'party', 'pascal', 'pass', 'passage', 'passages', 'passbook', 'passbooks', 'passenger', 'passengers', 'passes', 'passivation', 'passivations', 'password', 'passwords', 'paste', 'pastes', 'pat', 'patch', 'patches', 'path', 'paths', 'patient', 'patients', 'patrol', 'patrols', 'pats', 'patter', 'pattern', 'patterns', 'pavement', 'paw', 'paws', 'pay', 'paygrade', 'paygrades', 'payment', 'payments', 'payroll', 'pea', 'peace', 'peacetime', 'peak', 'peaks', 'pear', 'pears', 'peas', 'peck', 'pecks', 'pedal', 'pedals', 'peg', 'pegs', 'pen', 'pencil', 'pencils', 'pennant', 'pennants', 'pens', 'people', 'percent', 'percentage', 'percentages', 'percents', 'perfect', 'perforation', 'perforations', 'perforator', 'perforators', 'performance', 'performances', 'period', 'periods', 'permission', 'permit', 'permits', 'person', 'personalities', 'personality', 'personnel', 'persons', 'petition', 'petitions', 'petroleum', 'phase', 'phases', 'photo', 'photodiode', 'photodiodes', 'photograph', 'photographs', 'photos', 'physics', 'pick', 'picks', 'picture', 'pictures', 'piece', 'pieces', 'pier', 'piers', 'pile', 'piles', 'pilot', 'pilots', 'pin', 'pine', 'pines', 'pink', 'pins', 'pint', 'pints', 'pipe', 'pipes', 'pistol', 'pistols', 'piston', 'pistons', 'pit', 'pitch', 'pitches', 'pits', 'place', 'places', 'plan', 'plane', 'planes', 'plans', 'plant', 'plants', 'plastic', 'plastics', 'plate', 'plates', 'platform', 'platforms', 'plating', 'platter', 'platters', 'play', 'plays', 'plead', 'pleads', 'pleasure', 'plexiglass', 'plot', 'plots', 'plow', 'plug', 'plugs', 'pocket', 'pockets', 'point', 'pointer', 'pointers', 'points', 'poison', 'poisons', 'poke', 'pokes', 'polarities', 'polarity', 'pole', 'poles', 'police', 'polices', 'policies', 'policy', 'polish', 'polisher', 'polishers', 'polishes', 'poll', 'polls', 'pond', 'ponds', 'pool', 'pools', 'pop', 'pops', 'population', 'port', 'porter', 'porters', 'portion', 'portions', 'ports', 'position', 'positions', 'possession', 'possessions', 'possibilities', 'possibility', 'post', 'posts', 'pot', 'potato', 'potatos', 'pots', 'pound', 'pounds', 'powder', 'powders', 'power', 'powers', 'practice', 'practices', 'precaution', 'precautions', 'precedence', 'precision', 'preference', 'preferences', 'prefix', 'prefixes', 'preliminaries', 'preparation', 'preparations', 'preposition', 'prepositions', 'prerequisite', 'presence', 'presences', 'present', 'presentation', 'presentations', 'presents', 'preservation', 'preserver', 'preservers', 'president', 'presidents', 'press', 'presses', 'pressure', 'pressures', 'presumption', 'presumptions', 'prevention', 'preventions', 'price', 'prices', 'prime', 'primes', 'primitives', 'principal', 'principals', 'principle', 'principles', 'print', 'printout', 'printouts', 'prints', 'priorities', 'priority', 'prism', 'prisms', 'prison', 'prisoner', 'prisoners', 'prisons', 'privates', 'privilege', 'privileges', 'probabilities', 'probability', 'probe', 'probes', 'problem', 'problems', 'procedure', 'procedures', 'process', 'processes', 'processor', 'processors', 'procurement', 'procurements', 'produce', 'product', 'products', 'profession', 'professionalism', 'professionals', 'professions', 'proficiencies', 'proficiency', 'profile', 'profiles', 'profit', 'profits', 'program', 'programmer', 'programmers', 'programs', 'progress', 'project', 'projectile', 'projectiles', 'projects', 'promotion', 'promotions', 'prompts', 'pronoun', 'pronouns', 'proof', 'proofs', 'prop', 'propeller', 'propellers', 'properties', 'property', 'proportion', 'proportions', 'propose', 'proposes', 'props', 'propulsion', 'propulsions', 'protection', 'protest', 'protests', 'provision', 'provisions', 'public', 'publication', 'publications', 'puddle', 'puddles', 'puff', 'puffs', 'pull', 'pulls', 'pulse', 'pulses', 'pump', 'pumps', 'punch', 'punches', 'puncture', 'punctures', 'punishment', 'punishments', 'pupil', 'pupils', 'purchase', 'purchaser', 'purchasers', 'purchases', 'purge', 'purges', 'purpose', 'purposes', 'push', 'pushdown', 'pushdowns', 'pushes', 'pushup', 'pushups', 'pyramid', 'pyramids', 'qualification', 'qualifications', 'qualifier', 'qualifiers', 'qualities', 'quality', 'quantities', 'quantity', 'quart', 'quarter', 'quarterdeck', 'quarterdecks', 'quartermaster', 'quartermasters', 'quarters', 'quarts', 'question', 'questions', 'quiet', 'quiets', 'quota', 'quotas', 'race', 'races', 'rack', 'racks', 'radar', 'radars', 'radian', 'radians', 'radiation', 'radiator', 'radiators', 'radio', 'radios', 'radius', 'radiuses', 'rag', 'rags', 'rail', 'railroad', 'railroads', 'rails', 'railway', 'railways', 'rain', 'rainbow', 'rainbows', 'raincoat', 'raincoats', 'rains', 'raise', 'raises', 'rake', 'rakes', 'ram', 'ramp', 'ramps', 'rams', 'range', 'ranges', 'rank', 'ranks', 'rap', 'raps', 'rate', 'rates', 'ratings', 'ratio', 'ration', 'rations', 'ratios', 'rattle', 'rattles', 'ray', 'rays', 'reach', 'reaches', 'reactance', 'reaction', 'reactions', 'reactor', 'reactors', 'reader', 'readers', 'readiness', 'reading', 'readings', 'realignment', 'realignments', 'realinement', 'realinements', 'ream', 'reams', 'rear', 'reason', 'reasons', 'rebound', 'rebounds', 'recapitulation', 'recapitulations', 'receipt', 'receipts', 'receiver', 'receivers', 'receptacle', 'receptacles', 'recess', 'recesses', 'recipient', 'recipients', 'recognition', 'recognitions', 'recombination', 'recombinations', 'recommendation', 'recommendations', 'reconfiguration', 'reconfigurations', 'record', 'recording', 'recordkeeping', 'records', 'recoveries', 'recovery', 'recruit', 'recruiter', 'recruiters', 'recruits', 'reduction', 'reductions', 'reel', 'reels', 'reenlistment', 'reenlistments', 'reference', 'references', 'refrigerator', 'refrigerators', 'refund', 'refunds', 'refurbishment', 'refuse', 'region', 'regions', 'register', 'registers', 'regret', 'regrets', 'regulation', 'regulations', 'regulator', 'regulators', 'rehabilitation', 'reinforcement', 'reinforcements', 'rejection', 'rejections', 'relation', 'relations', 'relationship', 'relationships', 'relay', 'relays', 'release', 'releases', 'reliabilities', 'reliability', 'relief', 'religion', 'religions', 'relocation', 'relocations', 'reluctance', 'remainder', 'remainders', 'remains', 'remedies', 'remedy', 'removal', 'removals', 'repair', 'repairs', 'replacement', 'replacements', 'replenishment', 'replenishments', 'report', 'reports', 'representative', 'representatives', 'reproduction', 'reproductions', 'request', 'requests', 'requirement', 'requirements', 'requisition', 'requisitions', 'rescue', 'rescuer', 'rescuers', 'rescues', 'research', 'researcher', 'researchers', 'reserve', 'reserves', 'reservist', 'reservists', 'reservoir', 'reservoirs', 'resident', 'residents', 'residue', 'residues', 'resistance', 'resistances', 'resistor', 'resistors', 'resolution', 'resource', 'resources', 'respect', 'respects', 'respiration', 'respirations', 'response', 'responses', 'responsibilities', 'responsibility', 'rest', 'restaurant', 'restaurants', 'restraint', 'restraints', 'restriction', 'restrictions', 'result', 'results', 'retailer', 'retailers', 'retention', 'retirement', 'retractor', 'retractors', 'retrieval', 'retrievals', 'return', 'returns', 'reveille', 'reverse', 'review', 'reviews', 'revision', 'revisions', 'revolution', 'revolutions', 'reward', 'rewards', 'rheostat', 'rheostats', 'rhythm', 'rhythms', 'rib', 'ribbon', 'ribbons', 'ribs', 'rice', 'riddle', 'riddles', 'ride', 'rides', 'riding', 'rifle', 'rifles', 'rifling', 'rig', 'rights', 'rigs', 'rim', 'rims', 'ringing', 'rings', 'rinse', 'rinses', 'river', 'rivers', 'road', 'roads', 'roadside', 'roar', 'roars', 'rock', 'rocket', 'rockets', 'rocks', 'rod', 'rods', 'roll', 'roller', 'rollers', 'rollout', 'rollouts', 'rolls', 'roof', 'roofs', 'room', 'rooms', 'root', 'roots', 'rope', 'ropes', 'rose', 'rotation', 'rotations', 'rotor', 'rotors', 'round', 'rounds', 'route', 'routes', 'routine', 'routines', 'rowboat', 'rowboats', 'rower', 'rowers', 'rubber', 'rubbish', 'rudder', 'rudders', 'rug', 'rugs', 'rule', 'rules', 'rumble', 'rumbles', 'run', 'runaway', 'runaways', 'runner', 'runners', 'runoff', 'runoffs', 'runout', 'runouts', 'runs', 'runway', 'runways', 'rush', 'rushes', 'rust', 'sabotage', 'sack', 'sacks', 'saddle', 'saddles', 'safeguard', 'safeguards', 'safety', 'sail', 'sailor', 'sailors', 'sails', 'sale', 'sales', 'salt', 'salts', 'salute', 'salutes', 'salvage', 'salvages', 'sample', 'samples', 'sand', 'sanitation', 'sap', 'saps', 'sash', 'sashes', 'satellite', 'satellites', 'saturday', 'saturdays', 'saving', 'savings', 'saying', 'scab', 'scabs', 'scale', 'scales', 'scene', 'scenes', 'schedule', 'scheduler', 'schedulers', 'schedules', 'schematics', 'school', 'schoolhouse', 'schoolhouses', 'schoolroom', 'schoolrooms', 'schools', 'science', 'sciences', 'scissors', 'scope', 'scopes', 'score', 'scores', 'scrap', 'scraps', 'scratch', 'scratches', 'scratchpad', 'scratchpads', 'scream', 'screams', 'screen', 'screens', 'screw', 'screwdriver', 'screwdrivers', 'screws', 'sea', 'seal', 'seals', 'seam', 'seaman', 'seamanship', 'seamen', 'seams', 'search', 'searches', 'searchlight', 'searchlights', 'seas', 'season', 'seasoning', 'seasons', 'seat', 'seats', 'seawater', 'second', 'seconds', 'secret', 'secretaries', 'secretary', 'secrets', 'section', 'sections', 'sector', 'sectors', 'securities', 'security', 'sediment', 'sediments', 'seed', 'seeds', 'seesaw', 'seesaws', 'segment', 'segments', 'selection', 'selections', 'selector', 'selectors', 'self', 'selves', 'semaphore', 'semaphores', 'semicolon', 'semicolons', 'semiconductor', 'semiconductors', 'sense', 'senses', 'sentence', 'sentences', 'sentries', 'sentry', 'separation', 'separations', 'september', 'sequence', 'sequences', 'serial', 'serials', 'series', 'servant', 'servants', 'service', 'services', 'servo', 'servos', 'session', 'sessions', 'sets', 'setting', 'settings', 'settlement', 'settlements', 'setup', 'setups', 'sevens', 'sevenths', 'seventies', 'sewage', 'sewer', 'sewers', 'sex', 'sexes', 'shade', 'shades', 'shadow', 'shadows', 'shaft', 'shafts', 'shame', 'shape', 'shapes', 'share', 'shares', 'sharpener', 'sharpeners', 'shave', 'shaves', 'shears', 'sheds', 'sheet', 'sheeting', 'sheets', 'shelf', 'shell', 'shells', 'shelter', 'shelters', 'shelves', 'shield', 'shields', 'shift', 'shifts', 'ship', 'shipmate', 'shipmates', 'shipment', 'shipments', 'shipping', 'ships', 'shirt', 'shirts', 'shock', 'shocks', 'shoe', 'shoes', 'shop', 'shops', 'shore', 'shores', 'shortage', 'shortages', 'shotline', 'shotlines', 'shots', 'shoulder', 'shoulders', 'shout', 'shouts', 'shovel', 'shovels', 'show', 'shower', 'showers', 'shows', 'side', 'sides', 'sidewalk', 'sidewalks', 'sight', 'sights', 'sign', 'signal', 'signaler', 'signalers', 'signalman', 'signalmen', 'signals', 'signature', 'signatures', 'significance', 'signs', 'silence', 'silences', 'silicon', 'silk', 'silks', 'sill', 'sills', 'silver', 'similarities', 'similarity', 'sink', 'sinks', 'sip', 'sips', 'sir', 'siren', 'sirens', 'sirs', 'sister', 'sisters', 'site', 'sites', 'situation', 'situations', 'sixes', 'sixths', 'sixties', 'size', 'sizes', 'skew', 'skies', 'skill', 'skills', 'skin', 'skins', 'skip', 'skips', 'skirt', 'skirts', 'sky', 'slap', 'slaps', 'slash', 'slashes', 'slate', 'slates', 'slave', 'slaves', 'sled', 'sleds', 'sleep', 'sleeve', 'sleeves', 'slice', 'slices', 'slide', 'slides', 'slinging', 'slings', 'slits', 'slope', 'slopes', 'slot', 'slots', 'smash', 'smashes', 'smell', 'smells', 'smile', 'smiles', 'smoke', 'smokes', 'snap', 'snaps', 'sneeze', 'sneezes', 'snow', 'snows', 'soap', 'soaps', 'societies', 'society', 'sock', 'socket', 'sockets', 'socks', 'sod', 'software', 'soil', 'soils', 'solder', 'solders', 'soldier', 'soldiers', 'sole', 'solenoid', 'solenoids', 'soles', 'solids', 'solution', 'solutions', 'solvent', 'solvents', 'son', 'sonar', 'sonars', 'song', 'songs', 'sons', 'sort', 'sorts', 'sound', 'sounds', 'soup', 'soups', 'source', 'sources', 'south', 'space', 'spacer', 'spacers', 'spaces', 'spade', 'spades', 'span', 'spans', 'spar', 'spare', 'spares', 'spark', 'sparks', 'spars', 'speaker', 'speakers', 'spear', 'spears', 'specialist', 'specialists', 'specialization', 'specializations', 'specialties', 'specialty', 'specification', 'specifications', 'speech', 'speeches', 'speed', 'speeder', 'speeders', 'speeds', 'spike', 'spikes', 'spill', 'spills', 'spindle', 'spindles', 'spins', 'spiral', 'spirals', 'splash', 'splashes', 'splice', 'splicer', 'splicers', 'splices', 'splint', 'splints', 'splitter', 'splitters', 'spoke', 'spokes', 'sponge', 'sponges', 'sponsor', 'sponsors', 'spool', 'spools', 'spoon', 'spoons', 'sport', 'sports', 'spot', 'spots', 'spray', 'sprayer', 'sprayers', 'sprays', 'spring', 'springs', 'squadron', 'squadrons', 'square', 'squares', 'squeak', 'squeaks', 'stability', 'stabilization', 'stack', 'stacks', 'staff', 'staffs', 'stage', 'stages', 'stair', 'stairs', 'stake', 'stakes', 'stall', 'stalls', 'stamp', 'stamps', 'stand', 'standard', 'standardization', 'standardizations', 'standards', 'standing', 'stands', 'staple', 'stapler', 'staplers', 'staples', 'star', 'starboard', 'stare', 'stares', 'stars', 'start', 'starts', 'state', 'statement', 'statements', 'states', 'station', 'stationery', 'stations', 'stator', 'stators', 'status', 'steam', 'steamer', 'steamers', 'steams', 'steel', 'steels', 'steeple', 'steeples', 'stem', 'stems', 'stencil', 'stencils', 'step', 'steps', 'sterilizer', 'sterilizers', 'stern', 'stick', 'sticks', 'sting', 'stings', 'stitch', 'stitches', 'stock', 'stocking', 'stocks', 'stomach', 'stomachs', 'stone', 'stones', 'stool', 'stools', 'stop', 'stopper', 'stoppered', 'stoppering', 'stoppers', 'storage', 'store', 'stores', 'stories', 'storm', 'storms', 'story', 'stove', 'stoves', 'stowage', 'straightener', 'straighteners', 'strain', 'strains', 'strand', 'strands', 'strap', 'straps', 'straw', 'straws', 'streak', 'streaks', 'stream', 'streams', 'street', 'streets', 'strength', 'strengths', 'stress', 'stresses', 'stretch', 'stretcher', 'stretchers', 'stretches', 'strike', 'striker', 'strikers', 'strikes', 'string', 'strings', 'strip', 'stripe', 'stripes', 'strips', 'strobe', 'strobes', 'stroke', 'strokes', 'structure', 'structures', 'strut', 'struts', 'stub', 'stubs', 'student', 'students', 'studies', 'study', 'stuff', 'stuffing', 'stump', 'stumps', 'subdivision', 'subdivisions', 'subfunction', 'subfunctions', 'subject', 'subjects', 'submarine', 'submarined', 'submarines', 'submarining', 'submission', 'submissions', 'subordinate', 'subordinates', 'subprogram', 'subprograms', 'subroutine', 'subroutines', 'substance', 'substances', 'substitute', 'substitutes', 'subsystem', 'subsystems', 'subtask', 'subtasks', 'subtotal', 'subtotals', 'success', 'successes', 'suction', 'sugar', 'suggestion', 'suggestions', 'suit', 'suits', 'sum', 'summaries', 'summary', 'summer', 'summers', 'sums', 'sun', 'sunday', 'sundays', 'sunlight', 'sunrise', 'suns', 'sunset', 'sunshine', 'superintendent', 'superlatives', 'supermarket', 'supermarkets', 'superstructure', 'superstructures', 'supervision', 'supervisor', 'supervisors', 'supplies', 'supply', 'suppression', 'suppressions', 'surface', 'surfaces', 'surge', 'surges', 'surplus', 'surpluses', 'surprise', 'surprises', 'surrender', 'surrenders', 'surveillance', 'survey', 'surveyor', 'surveyors', 'surveys', 'survival', 'survivals', 'suspect', 'suspects', 'swab', 'swabs', 'swallow', 'swallows', 'swamp', 'swamps', 'swap', 'swaps', 'sweep', 'sweeper', 'sweepers', 'sweeps', 'swell', 'swells', 'swim', 'swimmer', 'swimmers', 'swims', 'swing', 'swings', 'switch', 'switches', 'swivel', 'swivels', 'sword', 'swords', 'symbol', 'symbols', 'symptom', 'symptoms', 'syntax', 'synthetics', 'system', 'systems', 'tab', 'table', 'tables', 'tablespoon', 'tablespoons', 'tablet', 'tablets', 'tabs', 'tabulation', 'tabulations', 'tachometer', 'tachometers', 'tack', 'tackle', 'tackles', 'tacks', 'tactic', 'tactics', 'tag', 'tags', 'tail', 'tailor', 'tailors', 'tails', 'takeoff', 'takeoffs', 'talk', 'talker', 'talkers', 'talks', 'tan', 'tank', 'tanks', 'tap', 'tape', 'taper', 'tapers', 'tapes', 'taps', 'tar', 'target', 'targets', 'tars', 'task', 'tasks', 'taste', 'tastes', 'tax', 'taxes', 'taxi', 'taxis', 'teaching', 'teachings', 'team', 'teams', 'tear', 'tears', 'teaspoon', 'teaspoons', 'technician', 'technicians', 'technique', 'techniques', 'technology', 'teeth', 'telecommunication', 'telecommunications', 'telephone', 'telephones', 'television', 'televisions', 'teller', 'tellers', 'temper', 'temperature', 'temperatures', 'tempers', 'tendencies', 'tendency', 'tender', 'tenders', 'tens', 'tension', 'tensions', 'tent', 'tenth', 'tenths', 'tents', 'term', 'terminals', 'termination', 'terminations', 'terminator', 'terminators', 'terminologies', 'terminology', 'terms', 'terrain', 'terrains', 'test', 'tests', 'text', 'texts', 'thanks', 'theories', 'theory', 'thermals', 'thermocouple', 'thermocouples', 'thermometer', 'thermometers', 'thickness', 'thicknesses', 'thimble', 'thimbles', 'thin', 'thing', 'things', 'thins', 'thirds', 'thirteen', 'thirteens', 'thirties', 'thirty', 'thoughts', 'thousand', 'thousands', 'thread', 'threader', 'threaders', 'threads', 'threat', 'threats', 'threes', 'threshold', 'thresholds', 'throat', 'throats', 'throttle', 'throttles', 'thumb', 'thumbs', 'thunder', 'thursday', 'thursdays', 'thyristor', 'thyristors', 'tick', 'ticket', 'tickets', 'ticks', 'tide', 'tides', 'tie', 'till', 'tilling', 'tills', 'time', 'timer', 'timers', 'times', 'tin', 'tip', 'tips', 'tire', 'tires', 'tissue', 'tissues', 'title', 'titles', 'today', 'toe', 'toes', 'tolerance', 'tolerances', 'tomorrow', 'tomorrows', 'ton', 'tone', 'tones', 'tongue', 'tongues', 'tons', 'tool', 'toolbox', 'toolboxes', 'tools', 'tooth', 'toothpick', 'toothpicks', 'top', 'topic', 'topping', 'tops', 'topside', 'torpedo', 'torpedoes', 'torque', 'torques', 'toss', 'tosses', 'total', 'totals', 'touch', 'touches', 'tour', 'tourniquet', 'tourniquets', 'tours', 'towel', 'towels', 'tower', 'towers', 'town', 'towns', 'trace', 'traces', 'track', 'tracker', 'trackers', 'tracks', 'tractor', 'tractors', 'trade', 'trades', 'traffic', 'trail', 'trailer', 'trailers', 'trails', 'train', 'trainer', 'trainers', 'training', 'trains', 'transaction', 'transactions', 'transfer', 'transfers', 'transformer', 'transformers', 'transistor', 'transistors', 'transit', 'transiting', 'transits', 'translator', 'translators', 'transmission', 'transmissions', 'transmittal', 'transmittals', 'transmitter', 'transmitters', 'transport', 'transportation', 'trap', 'traps', 'trash', 'travel', 'travels', 'tray', 'trays', 'treatment', 'treatments', 'tree', 'trees', 'trial', 'trials', 'triangle', 'triangles', 'trick', 'tricks', 'tries', 'trigger', 'triggers', 'trim', 'trims', 'trip', 'trips', 'troop', 'troops', 'trouble', 'troubles', 'troubleshooter', 'troubleshooters', 'trousers', 'truck', 'trucks', 'trunk', 'trunks', 'trust', 'trusts', 'truth', 'truths', 'try', 'tub', 'tube', 'tubes', 'tubing', 'tubs', 'tuesday', 'tuesdays', 'tug', 'tugs', 'tuition', 'tumble', 'tumbles', 'tune', 'tunes', 'tunnel', 'tunnels', 'turbine', 'turbines', 'turbulence', 'turn', 'turnaround', 'turnarounds', 'turns', 'turpitude', 'twenties', 'twig', 'twigs', 'twin', 'twine', 'twins', 'twirl', 'twirls', 'twist', 'twists', 'twos', 'type', 'types', 'typewriter', 'typewriters', 'typist', 'typists', 'umbrella', 'umbrellas', 'uncertainties', 'uncertainty', 'uniform', 'uniforms', 'union', 'unions', 'unit', 'units', 'universe', 'update', 'updates', 'upside', 'usage', 'usages', 'use', 'user', 'users', 'uses', 'utilities', 'utility', 'utilization', 'utilizations', 'vacuum', 'vacuums', 'validation', 'validations', 'valley', 'valleys', 'value', 'values', 'valve', 'valves', 'vapor', 'vapors', 'varactor', 'varactors', 'variables', 'variation', 'variations', 'varieties', 'variety', 'vector', 'vectors', 'vehicle', 'vehicles', 'velocities', 'velocity', 'vendor', 'vendors', 'vent', 'ventilation', 'ventilations', 'ventilators', 'vents', 'verb', 'verbs', 'verification', 'verse', 'verses', 'version', 'versions', 'vessel', 'vessels', 'veteran', 'veterans', 'vibration', 'vibrations', 'vice', 'vices', 'vicinities', 'vicinity', 'victim', 'victims', 'video', 'videos', 'view', 'views', 'village', 'villages', 'vine', 'vines', 'violation', 'violations', 'violet', 'visibilities', 'visibility', 'vision', 'visions', 'visit', 'visitor', 'visitors', 'visits', 'voice', 'voices', 'voids', 'vol.', 'volt', 'voltage', 'voltages', 'volts', 'volume', 'volumes', 'vomit', 'voucher', 'vouchers', 'wafer', 'wafers', 'wage', 'wages', 'wagon', 'wagons', 'waist', 'waists', 'wait', 'wake', 'walk', 'walks', 'wall', 'walls', 'want', 'war', 'wardroom', 'wardrooms', 'warehouse', 'warehouses', 'warfare', 'warning', 'warnings', 'warranties', 'warranty', 'wars', 'warship', 'warships', 'wartime', 'wash', 'washer', 'washers', 'washes', 'washing', 'washtub', 'washtubs', 'waste', 'wastes', 'watch', 'watches', 'watchstanding', 'water', 'waterline', 'waterlines', 'waters', 'watt', 'watts', 'wave', 'waves', 'wax', 'waxes', 'way', 'ways', 'wayside', 'weapon', 'weapons', 'wear', 'weather', 'weathers', 'weave', 'weaves', 'web', 'webs', 'wedding', 'weddings', 'weed', 'weeds', 'week', 'weeks', 'weight', 'weights', 'weld', 'welder', 'welders', 'weldings', 'welds', 'wells', 'west', 'wheel', 'wheels', 'whip', 'whips', 'whirl', 'whirls', 'whisper', 'whispers', 'whistle', 'whistles', 'wholesale', 'wholesales', 'width', 'widths', 'wiggle', 'wiggles', 'wills', 'win', 'winch', 'winches', 'wind', 'windings', 'windlass', 'windlasses', 'window', 'windows', 'winds', 'wine', 'wines', 'wing', 'wingnut', 'wingnuts', 'wings', 'wins', 'winter', 'winters', 'wire', 'wires', 'wish', 'wishes', 'withdrawal', 'withdrawals', 'witness', 'witnesses', 'woman', 'women', 'wonder', 'wonders', 'wood', 'woods', 'wool', 'wools', 'word', 'words', 'work', 'workbook', 'workbooks', 'workings', 'workload', 'workloads', 'workman', 'workmen', 'works', 'worksheet', 'worksheets', 'world', 'worlds', 'worm', 'worms', 'worries', 'worry', 'worth', 'wounds', 'wrap', 'wraps', 'wreck', 'wrecks', 'wrench', 'wrenches', 'wrist', 'wrists', 'writer', 'writers', 'writing', 'writings', 'yard', 'yards', 'yarn', 'yarns', 'yaw', 'yaws', 'year', 'years', 'yell', 'yells', 'yield', 'yields', 'yolk', 'yolks', 'zero', 'zeros', 'zip', 'zips', 'zone', 'zones', 'can', 'may', 'accounting', 'bearing', 'bracing', 'briefing', 'coupling', 'damping', 'ending', 'engineering', 'feeling', 'heading', 'meaning', 'rating', 'rigging', 'ring', 'schooling', 'sizing', 'sling', 'winding', 'inaction', 'nonavailability', 'nothing', 'broadcast', 'cast', 'cost', 'cut', 'drunk', 'felt', 'forecast', 'ground', 'hit', 'lent', 'offset', 'set', 'shed', 'shot', 'slit', 'thought', 'wound']

var consolemethods = [
	'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
	'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
	'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
	'timeStamp', 'trace', 'warn'
];

var data = {

	firstNames: {
		"male": ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", "George", "Donald", "Anthony", "Paul", "Mark", "Edward", "Steven", "Kenneth", "Andrew", "Brian", "Joshua", "Kevin", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Jonathan", "Scott", "Raymond", "Justin", "Brandon", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Jerry", "Alexander", "Peter", "Tyler", "Douglas", "Harold", "Aaron", "Jose", "Adam", "Arthur", "Zachary", "Carl", "Nathan", "Albert", "Kyle", "Lawrence", "Joe", "Willie", "Gerald", "Roger", "Keith", "Jeremy", "Terry", "Harry", "Ralph", "Sean", "Jesse", "Roy", "Louis", "Billy", "Austin", "Bruce", "Eugene", "Christian", "Bryan", "Wayne", "Russell", "Howard", "Fred", "Ethan", "Jordan", "Philip", "Alan", "Juan", "Randy", "Vincent", "Bobby", "Dylan", "Johnny", "Phillip", "Victor", "Clarence", "Ernest", "Martin", "Craig", "Stanley", "Shawn", "Travis", "Bradley", "Leonard", "Earl", "Gabriel", "Jimmy", "Francis", "Todd", "Noah", "Danny", "Dale", "Cody", "Carlos", "Allen", "Frederick", "Logan", "Curtis", "Alex", "Joel", "Luis", "Norman", "Marvin", "Glenn", "Tony", "Nathaniel", "Rodney", "Melvin", "Alfred", "Steve", "Cameron", "Chad", "Edwin", "Caleb", "Evan", "Antonio", "Lee", "Herbert", "Jeffery", "Isaac", "Derek", "Ricky", "Marcus", "Theodore", "Elijah", "Luke", "Jesus", "Eddie", "Troy", "Mike", "Dustin", "Ray", "Adrian", "Bernard", "Leroy", "Angel", "Randall", "Wesley", "Ian", "Jared", "Mason", "Hunter", "Calvin", "Oscar", "Clifford", "Jay", "Shane", "Ronnie", "Barry", "Lucas", "Corey", "Manuel", "Leo", "Tommy", "Warren", "Jackson", "Isaiah", "Connor", "Don", "Dean", "Jon", "Julian", "Miguel", "Bill", "Lloyd", "Charlie", "Mitchell", "Leon", "Jerome", "Darrell", "Jeremiah", "Alvin", "Brett", "Seth", "Floyd", "Jim", "Blake", "Micheal", "Gordon", "Trevor", "Lewis", "Erik", "Edgar", "Vernon", "Devin", "Gavin", "Jayden", "Chris", "Clyde", "Tom", "Derrick", "Mario", "Brent", "Marc", "Herman", "Chase", "Dominic", "Ricardo", "Franklin", "Maurice", "Max", "Aiden", "Owen", "Lester", "Gilbert", "Elmer", "Gene", "Francisco", "Glen", "Cory", "Garrett", "Clayton", "Sam", "Jorge", "Chester", "Alejandro", "Jeff", "Harvey", "Milton", "Cole", "Ivan", "Andre", "Duane", "Landon"],
		"female": ["Mary", "Emma", "Elizabeth", "Minnie", "Margaret", "Ida", "Alice", "Bertha", "Sarah", "Annie", "Clara", "Ella", "Florence", "Cora", "Martha", "Laura", "Nellie", "Grace", "Carrie", "Maude", "Mabel", "Bessie", "Jennie", "Gertrude", "Julia", "Hattie", "Edith", "Mattie", "Rose", "Catherine", "Lillian", "Ada", "Lillie", "Helen", "Jessie", "Louise", "Ethel", "Lula", "Myrtle", "Eva", "Frances", "Lena", "Lucy", "Edna", "Maggie", "Pearl", "Daisy", "Fannie", "Josephine", "Dora", "Rosa", "Katherine", "Agnes", "Marie", "Nora", "May", "Mamie", "Blanche", "Stella", "Ellen", "Nancy", "Effie", "Sallie", "Nettie", "Della", "Lizzie", "Flora", "Susie", "Maud", "Mae", "Etta", "Harriet", "Sadie", "Caroline", "Katie", "Lydia", "Elsie", "Kate", "Susan", "Mollie", "Alma", "Addie", "Georgia", "Eliza", "Lulu", "Nannie", "Lottie", "Amanda", "Belle", "Charlotte", "Rebecca", "Ruth", "Viola", "Olive", "Amelia", "Hannah", "Jane", "Virginia", "Emily", "Matilda", "Irene", "Kathryn", "Esther", "Willie", "Henrietta", "Ollie", "Amy", "Rachel", "Sara", "Estella", "Theresa", "Augusta", "Ora", "Pauline", "Josie", "Lola", "Sophia", "Leona", "Anne", "Mildred", "Ann", "Beulah", "Callie", "Lou", "Delia", "Eleanor", "Barbara", "Iva", "Louisa", "Maria", "Mayme", "Evelyn", "Estelle", "Nina", "Betty", "Marion", "Bettie", "Dorothy", "Luella", "Inez", "Lela", "Rosie", "Allie", "Millie", "Janie", "Cornelia", "Victoria", "Ruby", "Winifred", "Alta", "Celia", "Christine", "Beatrice", "Birdie", "Harriett", "Mable", "Myra", "Sophie", "Tillie", "Isabel", "Sylvia", "Carolyn", "Isabelle", "Leila", "Sally", "Ina", "Essie", "Bertie", "Nell", "Alberta", "Katharine", "Lora", "Rena", "Mina", "Rhoda", "Mathilda", "Abbie", "Eula", "Dollie", "Hettie", "Eunice", "Fanny", "Ola", "Lenora", "Adelaide", "Christina", "Lelia", "Nelle", "Sue", "Johanna", "Lilly", "Lucinda", "Minerva", "Lettie", "Roxie", "Cynthia", "Helena", "Hilda", "Hulda", "Bernice", "Genevieve", "Jean", "Cordelia", "Marian", "Francis", "Jeanette", "Adeline", "Gussie", "Leah", "Lois", "Lura", "Mittie", "Hallie", "Isabella", "Olga", "Phoebe", "Teresa", "Hester", "Lida", "Lina", "Winnie", "Claudia", "Marguerite", "Vera", "Cecelia", "Bess", "Emilie", "John", "Rosetta", "Verna", "Myrtie", "Cecilia", "Elva", "Olivia", "Ophelia", "Georgie", "Elnora", "Violet", "Adele", "Lily", "Linnie", "Loretta", "Madge", "Polly", "Virgie", "Eugenia", "Lucile", "Lucille", "Mabelle", "Rosalie"]
	},
	lastNames: ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison', 'Gibson', 'McDonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson', 'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd', 'Mason', 'Morales', 'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes', 'Burns', 'Gordon', 'Shaw', 'Holmes', 'Rice', 'Robertson', 'Hunt', 'Black', 'Daniels', 'Palmer', 'Mills', 'Nichols', 'Grant', 'Knight', 'Ferguson', 'Rose', 'Stone', 'Hawkins', 'Dunn', 'Perkins', 'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne', 'Pierce', 'Berry', 'Matthews', 'Arnold', 'Wagner', 'Willis', 'Ray', 'Watkins', 'Olson', 'Carroll', 'Duncan', 'Snyder', 'Hart', 'Cunningham', 'Bradley', 'Lane', 'Andrews', 'Ruiz', 'Harper', 'Fox', 'Riley', 'Armstrong', 'Carpenter', 'Weaver', 'Greene', 'Lawrence', 'Elliott', 'Chavez', 'Sims', 'Austin', 'Peters', 'Kelley', 'Franklin', 'Lawson', 'Fields', 'Gutierrez', 'Ryan', 'Schmidt', 'Carr', 'Vasquez', 'Castillo', 'Wheeler', 'Chapman', 'Oliver', 'Montgomery', 'Richards', 'Williamson', 'Johnston', 'Banks', 'Meyer', 'Bishop', 'McCoy', 'Howell', 'Alvarez', 'Morrison', 'Hansen', 'Fernandez', 'Garza', 'Harvey', 'Little', 'Burton', 'Stanley', 'Nguyen', 'George', 'Jacobs', 'Reid', 'Kim', 'Fuller', 'Lynch', 'Dean', 'Gilbert', 'Garrett', 'Romero', 'Welch', 'Larson', 'Frazier', 'Burke', 'Hanson', 'Day', 'Mendoza', 'Moreno', 'Bowman', 'Medina', 'Fowler', 'Brewer', 'Hoffman', 'Carlson', 'Silva', 'Pearson', 'Holland', 'Douglas', 'Fleming', 'Jensen', 'Vargas', 'Byrd', 'Davidson', 'Hopkins', 'May', 'Terry', 'Herrera', 'Wade', 'Soto', 'Walters', 'Curtis', 'Neal', 'Caldwell', 'Lowe', 'Jennings', 'Barnett', 'Graves', 'Jimenez', 'Horton', 'Shelton', 'Barrett', 'Obrien', 'Castro', 'Sutton', 'Gregory', 'McKinney', 'Lucas', 'Miles', 'Craig', 'Rodriquez', 'Chambers', 'Holt', 'Lambert', 'Fletcher', 'Watts', 'Bates', 'Hale', 'Rhodes', 'Pena', 'Beck', 'Newman', 'Haynes', 'McDaniel', 'Mendez', 'Bush', 'Vaughn', 'Parks', 'Dawson', 'Santiago', 'Norris', 'Hardy', 'Love', 'Steele', 'Curry', 'Powers', 'Schultz', 'Barker', 'Guzman', 'Page', 'Munoz', 'Ball', 'Keller', 'Chandler', 'Weber', 'Leonard', 'Walsh', 'Lyons', 'Ramsey', 'Wolfe', 'Schneider', 'Mullins', 'Benson', 'Sharp', 'Bowen', 'Daniel', 'Barber', 'Cummings', 'Hines', 'Baldwin', 'Griffith', 'Valdez', 'Hubbard', 'Salazar', 'Reeves', 'Warner', 'Stevenson', 'Burgess', 'Santos', 'Tate', 'Cross', 'Garner', 'Mann', 'Mack', 'Moss', 'Thornton', 'Dennis', 'McGee', 'Farmer', 'Delgado', 'Aguilar', 'Vega', 'Glover', 'Manning', 'Cohen', 'Harmon', 'Rodgers', 'Robbins', 'Newton', 'Todd', 'Blair', 'Higgins', 'Ingram', 'Reese', 'Cannon', 'Strickland', 'Townsend', 'Potter', 'Goodwin', 'Walton', 'Rowe', 'Hampton', 'Ortega', 'Patton', 'Swanson', 'Joseph', 'Francis', 'Goodman', 'Maldonado', 'Yates', 'Becker', 'Erickson', 'Hodges', 'Rios', 'Conner', 'Adkins', 'Webster', 'Norman', 'Malone', 'Hammond', 'Flowers', 'Cobb', 'Moody', 'Quinn', 'Blake', 'Maxwell', 'Pope', 'Floyd', 'Osborne', 'Paul', 'McCarthy', 'Guerrero', 'Lindsey', 'Estrada', 'Sandoval', 'Gibbs', 'Tyler', 'Gross', 'Fitzgerald', 'Stokes', 'Doyle', 'Sherman', 'Saunders', 'Wise', 'Colon', 'Gill', 'Alvarado', 'Greer', 'Padilla', 'Simon', 'Waters', 'Nunez', 'Ballard', 'Schwartz', 'McBride', 'Houston', 'Christensen', 'Klein', 'Pratt', 'Briggs', 'Parsons', 'McLaughlin', 'Zimmerman', 'French', 'Buchanan', 'Moran', 'Copeland', 'Roy', 'Pittman', 'Brady', 'McCormick', 'Holloway', 'Brock', 'Poole', 'Frank', 'Logan', 'Owen', 'Bass', 'Marsh', 'Drake', 'Wong', 'Jefferson', 'Park', 'Morton', 'Abbott', 'Sparks', 'Patrick', 'Norton', 'Huff', 'Clayton', 'Massey', 'Lloyd', 'Figueroa', 'Carson', 'Bowers', 'Roberson', 'Barton', 'Tran', 'Lamb', 'Harrington', 'Casey', 'Boone', 'Cortez', 'Clarke', 'Mathis', 'Singleton', 'Wilkins', 'Cain', 'Bryan', 'Underwood', 'Hogan', 'McKenzie', 'Collier', 'Luna', 'Phelps', 'McGuire', 'Allison', 'Bridges', 'Wilkerson', 'Nash', 'Summers', 'Atkins'],
	provinces: [
		{name: 'Alberta', abbreviation: 'AB'},
		{name: 'British Columbia', abbreviation: 'BC'},
		{name: 'Manitoba', abbreviation: 'MB'},
		{name: 'New Brunswick', abbreviation: 'NB'},
		{name: 'Newfoundland and Labrador', abbreviation: 'NL'},
		{name: 'Nova Scotia', abbreviation: 'NS'},
		{name: 'Ontario', abbreviation: 'ON'},
		{name: 'Prince Edward Island', abbreviation: 'PE'},
		{name: 'Quebec', abbreviation: 'QC'},
		{name: 'Saskatchewan', abbreviation: 'SK'},
		{name: 'Northwest Territories', abbreviation: 'NT'},
		{name: 'Nunavut', abbreviation: 'NU'},
		{name: 'Yukon', abbreviation: 'YT'}
	],
	us_states_and_dc: [
		{name: 'Alabama', abbreviation: 'AL'},
		{name: 'Alaska', abbreviation: 'AK'},
		{name: 'Arizona', abbreviation: 'AZ'},
		{name: 'Arkansas', abbreviation: 'AR'},
		{name: 'California', abbreviation: 'CA'},
		{name: 'Colorado', abbreviation: 'CO'},
		{name: 'Connecticut', abbreviation: 'CT'},
		{name: 'Delaware', abbreviation: 'DE'},
		{name: 'District of Columbia', abbreviation: 'DC'},
		{name: 'Florida', abbreviation: 'FL'},
		{name: 'Georgia', abbreviation: 'GA'},
		{name: 'Hawaii', abbreviation: 'HI'},
		{name: 'Idaho', abbreviation: 'ID'},
		{name: 'Illinois', abbreviation: 'IL'},
		{name: 'Indiana', abbreviation: 'IN'},
		{name: 'Iowa', abbreviation: 'IA'},
		{name: 'Kansas', abbreviation: 'KS'},
		{name: 'Kentucky', abbreviation: 'KY'},
		{name: 'Louisiana', abbreviation: 'LA'},
		{name: 'Maine', abbreviation: 'ME'},
		{name: 'Maryland', abbreviation: 'MD'},
		{name: 'Massachusetts', abbreviation: 'MA'},
		{name: 'Michigan', abbreviation: 'MI'},
		{name: 'Minnesota', abbreviation: 'MN'},
		{name: 'Mississippi', abbreviation: 'MS'},
		{name: 'Missouri', abbreviation: 'MO'},
		{name: 'Montana', abbreviation: 'MT'},
		{name: 'Nebraska', abbreviation: 'NE'},
		{name: 'Nevada', abbreviation: 'NV'},
		{name: 'New Hampshire', abbreviation: 'NH'},
		{name: 'New Jersey', abbreviation: 'NJ'},
		{name: 'New Mexico', abbreviation: 'NM'},
		{name: 'New York', abbreviation: 'NY'},
		{name: 'North Carolina', abbreviation: 'NC'},
		{name: 'North Dakota', abbreviation: 'ND'},
		{name: 'Ohio', abbreviation: 'OH'},
		{name: 'Oklahoma', abbreviation: 'OK'},
		{name: 'Oregon', abbreviation: 'OR'},
		{name: 'Pennsylvania', abbreviation: 'PA'},
		{name: 'Rhode Island', abbreviation: 'RI'},
		{name: 'South Carolina', abbreviation: 'SC'},
		{name: 'South Dakota', abbreviation: 'SD'},
		{name: 'Tennessee', abbreviation: 'TN'},
		{name: 'Texas', abbreviation: 'TX'},
		{name: 'Utah', abbreviation: 'UT'},
		{name: 'Vermont', abbreviation: 'VT'},
		{name: 'Virginia', abbreviation: 'VA'},
		{name: 'Washington', abbreviation: 'WA'},
		{name: 'West Virginia', abbreviation: 'WV'},
		{name: 'Wisconsin', abbreviation: 'WI'},
		{name: 'Wyoming', abbreviation: 'WY'}
	],
	territories: [
		{name: 'American Samoa', abbreviation: 'AS'},
		{name: 'Federated States of Micronesia', abbreviation: 'FM'},
		{name: 'Guam', abbreviation: 'GU'},
		{name: 'Marshall Islands', abbreviation: 'MH'},
		{name: 'Northern Mariana Islands', abbreviation: 'MP'},
		{name: 'Puerto Rico', abbreviation: 'PR'},
		{name: 'Virgin Islands, U.S.', abbreviation: 'VI'}
	],
	armed_forces: [
		{name: 'Armed Forces Europe', abbreviation: 'AE'},
		{name: 'Armed Forces Pacific', abbreviation: 'AP'},
		{name: 'Armed Forces the Americas', abbreviation: 'AA'}
	],
	street_suffixes: [
		{name: 'Avenue', abbreviation: 'Ave'},
		{name: 'Boulevard', abbreviation: 'Blvd'},
		{name: 'Center', abbreviation: 'Ctr'},
		{name: 'Circle', abbreviation: 'Cir'},
		{name: 'Court', abbreviation: 'Ct'},
		{name: 'Drive', abbreviation: 'Dr'},
		{name: 'Extension', abbreviation: 'Ext'},
		{name: 'Glen', abbreviation: 'Gln'},
		{name: 'Grove', abbreviation: 'Grv'},
		{name: 'Heights', abbreviation: 'Hts'},
		{name: 'Highway', abbreviation: 'Hwy'},
		{name: 'Junction', abbreviation: 'Jct'},
		{name: 'Key', abbreviation: 'Key'},
		{name: 'Lane', abbreviation: 'Ln'},
		{name: 'Loop', abbreviation: 'Loop'},
		{name: 'Manor', abbreviation: 'Mnr'},
		{name: 'Mill', abbreviation: 'Mill'},
		{name: 'Park', abbreviation: 'Park'},
		{name: 'Parkway', abbreviation: 'Pkwy'},
		{name: 'Pass', abbreviation: 'Pass'},
		{name: 'Path', abbreviation: 'Path'},
		{name: 'Pike', abbreviation: 'Pike'},
		{name: 'Place', abbreviation: 'Pl'},
		{name: 'Plaza', abbreviation: 'Plz'},
		{name: 'Point', abbreviation: 'Pt'},
		{name: 'Ridge', abbreviation: 'Rdg'},
		{name: 'River', abbreviation: 'Riv'},
		{name: 'Road', abbreviation: 'Rd'},
		{name: 'Square', abbreviation: 'Sq'},
		{name: 'Street', abbreviation: 'St'},
		{name: 'Terrace', abbreviation: 'Ter'},
		{name: 'Trail', abbreviation: 'Trl'},
		{name: 'Turnpike', abbreviation: 'Tpke'},
		{name: 'View', abbreviation: 'Vw'},
		{name: 'Way', abbreviation: 'Way'}
	],
	months: [
		{name: 'January', short_name: 'Jan', numeric: '01', days: 31},
		{name: 'February', short_name: 'Feb', numeric: '02', days: 28},
		{name: 'March', short_name: 'Mar', numeric: '03', days: 31},
		{name: 'April', short_name: 'Apr', numeric: '04', days: 30},
		{name: 'May', short_name: 'May', numeric: '05', days: 31},
		{name: 'June', short_name: 'Jun', numeric: '06', days: 30},
		{name: 'July', short_name: 'Jul', numeric: '07', days: 31},
		{name: 'August', short_name: 'Aug', numeric: '08', days: 31},
		{name: 'September', short_name: 'Sep', numeric: '09', days: 30},
		{name: 'October', short_name: 'Oct', numeric: '10', days: 31},
		{name: 'November', short_name: 'Nov', numeric: '11', days: 30},
		{name: 'December', short_name: 'Dec', numeric: '12', days: 31}
	],
	cc_types: [
		{name: "American Express", short_name: 'amex', prefix: '34', length: 15},
		{name: "Bankcard", short_name: 'bankcard', prefix: '5610', length: 16},
		{name: "China UnionPay", short_name: 'chinaunion', prefix: '62', length: 16},
		{name: "Diners Club Carte Blanche", short_name: 'dccarte', prefix: '300', length: 14},
		{name: "Diners Club enRoute", short_name: 'dcenroute', prefix: '2014', length: 15},
		{name: "Diners Club International", short_name: 'dcintl', prefix: '36', length: 14},
		{name: "Diners Club United States & Canada", short_name: 'dcusc', prefix: '54', length: 16},
		{name: "Discover Card", short_name: 'discover', prefix: '6011', length: 16},
		{name: "InstaPayment", short_name: 'instapay', prefix: '637', length: 16},
		{name: "JCB", short_name: 'jcb', prefix: '3528', length: 16},
		{name: "Laser", short_name: 'laser', prefix: '6304', length: 16},
		{name: "Maestro", short_name: 'maestro', prefix: '5018', length: 16},
		{name: "Mastercard", short_name: 'mc', prefix: '51', length: 16},
		{name: "Solo", short_name: 'solo', prefix: '6334', length: 16},
		{name: "Switch", short_name: 'switch', prefix: '4903', length: 16},
		{name: "Visa", short_name: 'visa', prefix: '4', length: 16},
		{name: "Visa Electron", short_name: 'electron', prefix: '4026', length: 16}
	],
	currency_types: [
		{'code' : 'AED', 'name' : 'United Arab Emirates Dirham'},
		{'code' : 'AFN', 'name' : 'Afghanistan Afghani'},
		{'code' : 'ALL', 'name' : 'Albania Lek'},
		{'code' : 'AMD', 'name' : 'Armenia Dram'},
		{'code' : 'ANG', 'name' : 'Netherlands Antilles Guilder'},
		{'code' : 'AOA', 'name' : 'Angola Kwanza'},
		{'code' : 'ARS', 'name' : 'Argentina Peso'},
		{'code' : 'AUD', 'name' : 'Australia Dollar'},
		{'code' : 'AWG', 'name' : 'Aruba Guilder'},
		{'code' : 'AZN', 'name' : 'Azerbaijan New Manat'},
		{'code' : 'BAM', 'name' : 'Bosnia and Herzegovina Convertible Marka'},
		{'code' : 'BBD', 'name' : 'Barbados Dollar'},
		{'code' : 'BDT', 'name' : 'Bangladesh Taka'},
		{'code' : 'BGN', 'name' : 'Bulgaria Lev'},
		{'code' : 'BHD', 'name' : 'Bahrain Dinar'},
		{'code' : 'BIF', 'name' : 'Burundi Franc'},
		{'code' : 'BMD', 'name' : 'Bermuda Dollar'},
		{'code' : 'BND', 'name' : 'Brunei Darussalam Dollar'},
		{'code' : 'BOB', 'name' : 'Bolivia Boliviano'},
		{'code' : 'BRL', 'name' : 'Brazil Real'},
		{'code' : 'BSD', 'name' : 'Bahamas Dollar'},
		{'code' : 'BTN', 'name' : 'Bhutan Ngultrum'},
		{'code' : 'BWP', 'name' : 'Botswana Pula'},
		{'code' : 'BYR', 'name' : 'Belarus Ruble'},
		{'code' : 'BZD', 'name' : 'Belize Dollar'},
		{'code' : 'CAD', 'name' : 'Canada Dollar'},
		{'code' : 'CDF', 'name' : 'Congo/Kinshasa Franc'},
		{'code' : 'CHF', 'name' : 'Switzerland Franc'},
		{'code' : 'CLP', 'name' : 'Chile Peso'},
		{'code' : 'CNY', 'name' : 'China Yuan Renminbi'},
		{'code' : 'COP', 'name' : 'Colombia Peso'},
		{'code' : 'CRC', 'name' : 'Costa Rica Colon'},
		{'code' : 'CUC', 'name' : 'Cuba Convertible Peso'},
		{'code' : 'CUP', 'name' : 'Cuba Peso'},
		{'code' : 'CVE', 'name' : 'Cape Verde Escudo'},
		{'code' : 'CZK', 'name' : 'Czech Republic Koruna'},
		{'code' : 'DJF', 'name' : 'Djibouti Franc'},
		{'code' : 'DKK', 'name' : 'Denmark Krone'},
		{'code' : 'DOP', 'name' : 'Dominican Republic Peso'},
		{'code' : 'DZD', 'name' : 'Algeria Dinar'},
		{'code' : 'EGP', 'name' : 'Egypt Pound'},
		{'code' : 'ERN', 'name' : 'Eritrea Nakfa'},
		{'code' : 'ETB', 'name' : 'Ethiopia Birr'},
		{'code' : 'EUR', 'name' : 'Euro Member Countries'},
		{'code' : 'FJD', 'name' : 'Fiji Dollar'},
		{'code' : 'FKP', 'name' : 'Falkland Islands (Malvinas) Pound'},
		{'code' : 'GBP', 'name' : 'United Kingdom Pound'},
		{'code' : 'GEL', 'name' : 'Georgia Lari'},
		{'code' : 'GGP', 'name' : 'Guernsey Pound'},
		{'code' : 'GHS', 'name' : 'Ghana Cedi'},
		{'code' : 'GIP', 'name' : 'Gibraltar Pound'},
		{'code' : 'GMD', 'name' : 'Gambia Dalasi'},
		{'code' : 'GNF', 'name' : 'Guinea Franc'},
		{'code' : 'GTQ', 'name' : 'Guatemala Quetzal'},
		{'code' : 'GYD', 'name' : 'Guyana Dollar'},
		{'code' : 'HKD', 'name' : 'Hong Kong Dollar'},
		{'code' : 'HNL', 'name' : 'Honduras Lempira'},
		{'code' : 'HRK', 'name' : 'Croatia Kuna'},
		{'code' : 'HTG', 'name' : 'Haiti Gourde'},
		{'code' : 'HUF', 'name' : 'Hungary Forint'},
		{'code' : 'IDR', 'name' : 'Indonesia Rupiah'},
		{'code' : 'ILS', 'name' : 'Israel Shekel'},
		{'code' : 'IMP', 'name' : 'Isle of Man Pound'},
		{'code' : 'INR', 'name' : 'India Rupee'},
		{'code' : 'IQD', 'name' : 'Iraq Dinar'},
		{'code' : 'IRR', 'name' : 'Iran Rial'},
		{'code' : 'ISK', 'name' : 'Iceland Krona'},
		{'code' : 'JEP', 'name' : 'Jersey Pound'},
		{'code' : 'JMD', 'name' : 'Jamaica Dollar'},
		{'code' : 'JOD', 'name' : 'Jordan Dinar'},
		{'code' : 'JPY', 'name' : 'Japan Yen'},
		{'code' : 'KES', 'name' : 'Kenya Shilling'},
		{'code' : 'KGS', 'name' : 'Kyrgyzstan Som'},
		{'code' : 'KHR', 'name' : 'Cambodia Riel'},
		{'code' : 'KMF', 'name' : 'Comoros Franc'},
		{'code' : 'KPW', 'name' : 'Korea (North) Won'},
		{'code' : 'KRW', 'name' : 'Korea (South) Won'},
		{'code' : 'KWD', 'name' : 'Kuwait Dinar'},
		{'code' : 'KYD', 'name' : 'Cayman Islands Dollar'},
		{'code' : 'KZT', 'name' : 'Kazakhstan Tenge'},
		{'code' : 'LAK', 'name' : 'Laos Kip'},
		{'code' : 'LBP', 'name' : 'Lebanon Pound'},
		{'code' : 'LKR', 'name' : 'Sri Lanka Rupee'},
		{'code' : 'LRD', 'name' : 'Liberia Dollar'},
		{'code' : 'LSL', 'name' : 'Lesotho Loti'},
		{'code' : 'LTL', 'name' : 'Lithuania Litas'},
		{'code' : 'LYD', 'name' : 'Libya Dinar'},
		{'code' : 'MAD', 'name' : 'Morocco Dirham'},
		{'code' : 'MDL', 'name' : 'Moldova Leu'},
		{'code' : 'MGA', 'name' : 'Madagascar Ariary'},
		{'code' : 'MKD', 'name' : 'Macedonia Denar'},
		{'code' : 'MMK', 'name' : 'Myanmar (Burma) Kyat'},
		{'code' : 'MNT', 'name' : 'Mongolia Tughrik'},
		{'code' : 'MOP', 'name' : 'Macau Pataca'},
		{'code' : 'MRO', 'name' : 'Mauritania Ouguiya'},
		{'code' : 'MUR', 'name' : 'Mauritius Rupee'},
		{'code' : 'MVR', 'name' : 'Maldives (Maldive Islands) Rufiyaa'},
		{'code' : 'MWK', 'name' : 'Malawi Kwacha'},
		{'code' : 'MXN', 'name' : 'Mexico Peso'},
		{'code' : 'MYR', 'name' : 'Malaysia Ringgit'},
		{'code' : 'MZN', 'name' : 'Mozambique Metical'},
		{'code' : 'NAD', 'name' : 'Namibia Dollar'},
		{'code' : 'NGN', 'name' : 'Nigeria Naira'},
		{'code' : 'NIO', 'name' : 'Nicaragua Cordoba'},
		{'code' : 'NOK', 'name' : 'Norway Krone'},
		{'code' : 'NPR', 'name' : 'Nepal Rupee'},
		{'code' : 'NZD', 'name' : 'New Zealand Dollar'},
		{'code' : 'OMR', 'name' : 'Oman Rial'},
		{'code' : 'PAB', 'name' : 'Panama Balboa'},
		{'code' : 'PEN', 'name' : 'Peru Nuevo Sol'},
		{'code' : 'PGK', 'name' : 'Papua New Guinea Kina'},
		{'code' : 'PHP', 'name' : 'Philippines Peso'},
		{'code' : 'PKR', 'name' : 'Pakistan Rupee'},
		{'code' : 'PLN', 'name' : 'Poland Zloty'},
		{'code' : 'PYG', 'name' : 'Paraguay Guarani'},
		{'code' : 'QAR', 'name' : 'Qatar Riyal'},
		{'code' : 'RON', 'name' : 'Romania New Leu'},
		{'code' : 'RSD', 'name' : 'Serbia Dinar'},
		{'code' : 'RUB', 'name' : 'Russia Ruble'},
		{'code' : 'RWF', 'name' : 'Rwanda Franc'},
		{'code' : 'SAR', 'name' : 'Saudi Arabia Riyal'},
		{'code' : 'SBD', 'name' : 'Solomon Islands Dollar'},
		{'code' : 'SCR', 'name' : 'Seychelles Rupee'},
		{'code' : 'SDG', 'name' : 'Sudan Pound'},
		{'code' : 'SEK', 'name' : 'Sweden Krona'},
		{'code' : 'SGD', 'name' : 'Singapore Dollar'},
		{'code' : 'SHP', 'name' : 'Saint Helena Pound'},
		{'code' : 'SLL', 'name' : 'Sierra Leone Leone'},
		{'code' : 'SOS', 'name' : 'Somalia Shilling'},
		{'code' : 'SPL', 'name' : 'Seborga Luigino'},
		{'code' : 'SRD', 'name' : 'Suriname Dollar'},
		{'code' : 'STD', 'name' : 'São Tomé and Príncipe Dobra'},
		{'code' : 'SVC', 'name' : 'El Salvador Colon'},
		{'code' : 'SYP', 'name' : 'Syria Pound'},
		{'code' : 'SZL', 'name' : 'Swaziland Lilangeni'},
		{'code' : 'THB', 'name' : 'Thailand Baht'},
		{'code' : 'TJS', 'name' : 'Tajikistan Somoni'},
		{'code' : 'TMT', 'name' : 'Turkmenistan Manat'},
		{'code' : 'TND', 'name' : 'Tunisia Dinar'},
		{'code' : 'TOP', 'name' : 'Tonga Pa\'anga'},
		{'code' : 'TRY', 'name' : 'Turkey Lira'},
		{'code' : 'TTD', 'name' : 'Trinidad and Tobago Dollar'},
		{'code' : 'TVD', 'name' : 'Tuvalu Dollar'},
		{'code' : 'TWD', 'name' : 'Taiwan New Dollar'},
		{'code' : 'TZS', 'name' : 'Tanzania Shilling'},
		{'code' : 'UAH', 'name' : 'Ukraine Hryvnia'},
		{'code' : 'UGX', 'name' : 'Uganda Shilling'},
		{'code' : 'USD', 'name' : 'United States Dollar'},
		{'code' : 'UYU', 'name' : 'Uruguay Peso'},
		{'code' : 'UZS', 'name' : 'Uzbekistan Som'},
		{'code' : 'VEF', 'name' : 'Venezuela Bolivar'},
		{'code' : 'VND', 'name' : 'Viet Nam Dong'},
		{'code' : 'VUV', 'name' : 'Vanuatu Vatu'},
		{'code' : 'WST', 'name' : 'Samoa Tala'},
		{'code' : 'XAF', 'name' : 'Communauté Financière Africaine (BEAC) CFA Franc BEAC'},
		{'code' : 'XCD', 'name' : 'East Caribbean Dollar'},
		{'code' : 'XDR', 'name' : 'International Monetary Fund (IMF) Special Drawing Rights'},
		{'code' : 'XOF', 'name' : 'Communauté Financière Africaine (BCEAO) Franc'},
		{'code' : 'XPF', 'name' : 'Comptoirs Français du Pacifique (CFP) Franc'},
		{'code' : 'YER', 'name' : 'Yemen Rial'},
		{'code' : 'ZAR', 'name' : 'South Africa Rand'},
		{'code' : 'ZMW', 'name' : 'Zambia Kwacha'},
		{'code' : 'ZWD', 'name' : 'Zimbabwe Dollar'}
	]
};


function get_defined_constants(categorize) {

	var ext = '',
			cnst = '',
			constObj = {},
			flatConstObj = {},
			win, thisExt = false;

	constObj = {
		'internal': {
			'E_ERROR': 1,
			'E_RECOVERABLE_ERROR': 4096,
			'E_WARNING': 2,
			'E_PARSE': 4,
			'E_NOTICE': 8,
			'E_STRICT': 2048,
			'E_CORE_ERROR': 16,
			'E_CORE_WARNING': 32,
			'E_COMPILE_ERROR': 64,
			'E_COMPILE_WARNING': 128,
			'E_USER_ERROR': 256,
			'E_USER_WARNING': 512,
			'E_USER_NOTICE': 1024,
			'E_ALL': 6143,
			'ZEND_THREAD_SAFE': true,
			'PHP_VERSION': '5.2.6',
			'PHP_OS': 'WINNT',
			'PHP_SAPI': 'apache2handler',
			'DEFAULT_INCLUDE_PATH': '.;C:\\php5\\pear',
			'PEAR_INSTALL_DIR': 'C:\\php5\\pear',
			'PEAR_EXTENSION_DIR': 'C:\\php5',
			'PHP_EXTENSION_DIR': 'C:\\php5',
			'PHP_PREFIX': 'C:\\php5',
			'PHP_BINDIR': 'C:\\php5',
			'PHP_LIBDIR': 'C:\\php5',
			'PHP_DATADIR': 'C:\\php5',
			'PHP_SYSCONFDIR': 'C:\\php5',
			'PHP_LOCALSTATEDIR': 'C:\\php5',
			'PHP_CONFIG_FILE_PATH': 'C:\\Windows',
			'PHP_CONFIG_FILE_SCAN_DIR': '',
			'PHP_SHLIB_SUFFIX': 'dll',
			'PHP_EOL': '\n',
			'PHP_INT_MAX': 2147483647,
			'PHP_INT_SIZE': 4,
			'PHP_OUTPUT_HANDLER_START': 1,
			'PHP_OUTPUT_HANDLER_CONT': 2,
			'PHP_OUTPUT_HANDLER_END': 4,
			'UPLOAD_ERR_OK': 0,
			'UPLOAD_ERR_INI_SIZE': 1,
			'UPLOAD_ERR_FORM_SIZE': 2,
			'UPLOAD_ERR_PARTIAL': 3,
			'UPLOAD_ERR_NO_FILE': 4,
			'UPLOAD_ERR_NO_TMP_DIR': 6,
			'UPLOAD_ERR_CANT_WRITE': 7,
			'UPLOAD_ERR_EXTENSION': 8
		},
		'pcre': {
			'PREG_PATTERN_ORDER': 1,
			'PREG_SET_ORDER': 2,
			'PREG_OFFSET_CAPTURE': 256,
			'PREG_SPLIT_NO_EMPTY': 1,
			'PREG_SPLIT_DELIM_CAPTURE': 2,
			'PREG_SPLIT_OFFSET_CAPTURE': 4,
			'PREG_GREP_INVERT': 1,
			'PREG_NO_ERROR': 0,
			'PREG_INTERNAL_ERROR': 1,
			'PREG_BACKTRACK_LIMIT_ERROR': 2,
			'PREG_RECURSION_LIMIT_ERROR': 3,
			'PREG_BAD_UTF8_ERROR': 4,
			'PCRE_VERSION': '7.6 2008-01-28'
		},
		'session': {
			'DATE_ATOM': 'Y-m-d\\TH:i:sP',
			'DATE_COOKIE': 'l, d-M-y H:i:s T',
			'DATE_ISO8601': 'Y-m-d\\TH:i:sO',
			'DATE_RFC822': 'D, d M y H:i:s O',
			'DATE_RFC850': 'l, d-M-y H:i:s T',
			'DATE_RFC1036': 'D, d M y H:i:s O',
			'DATE_RFC1123': 'D, d M Y H:i:s O',
			'DATE_RFC2822': 'D, d M Y H:i:s O',
			'DATE_RFC3339': 'Y-m-d\\TH:i:sP',
			'DATE_RSS': 'D, d M Y H:i:s O',
			'DATE_W3C': 'Y-m-d\\TH:i:sP',
			'SUNFUNCS_RET_TIMESTAMP': 0,
			'SUNFUNCS_RET_STRING': 1,
			'SUNFUNCS_RET_DOUBLE': 2
		},
		'standard': {
			'CONNECTION_ABORTED': 1,
			'CONNECTION_NORMAL': 0,
			'CONNECTION_TIMEOUT': 2,
			'INI_USER': 1,
			'INI_PERDIR': 2,
			'INI_SYSTEM': 4,
			'INI_ALL': 7,
			'PHP_URL_SCHEME': 0,
			'PHP_URL_HOST': 1,
			'PHP_URL_PORT': 2,
			'PHP_URL_USER': 3,
			'PHP_URL_PASS': 4,
			'PHP_URL_PATH': 5,
			'PHP_URL_QUERY': 6,
			'PHP_URL_FRAGMENT': 7,
			'M_E': 2.718281828459,
			'M_LOG2E': 1.442695040889,
			'M_LOG10E': 0.43429448190325,
			'M_LN2': 0.69314718055995,
			'M_LN10': 2.302585092994,
			'M_PI': 3.1415926535898,
			'M_PI_2': 1.5707963267949,
			'M_PI_4': 0.78539816339745,
			'M_1_PI': 0.31830988618379,
			'M_2_PI': 0.63661977236758,
			'M_SQRTPI': 1.7724538509055,
			'M_2_SQRTPI': 1.1283791670955,
			'M_LNPI': 1.1447298858494,
			'M_EULER': 0.57721566490153,
			'M_SQRT2': 1.4142135623731,
			'M_SQRT1_2': 0.70710678118655,
			'M_SQRT3': 1.7320508075689,
			'INF': Number.POSITIVE_INFINITY,
			'NAN': 0,
			'INFO_GENERAL': 1,
			'INFO_CREDITS': 2,
			'INFO_CONFIGURATION': 4,
			'INFO_MODULES': 8,
			'INFO_ENVIRONMENT': 16,
			'INFO_VARIABLES': 32,
			'INFO_LICENSE': 64,
			'INFO_ALL': -1,
			'CREDITS_GROUP': 1,
			'CREDITS_GENERAL': 2,
			'CREDITS_SAPI': 4,
			'CREDITS_MODULES': 8,
			'CREDITS_DOCS': 16,
			'CREDITS_FULLPAGE': 32,
			'CREDITS_QA': 64,
			'CREDITS_ALL': -1,
			'HTML_SPECIALCHARS': 0,
			'HTML_ENTITIES': 1,
			'ENT_COMPAT': 2,
			'ENT_QUOTES': 3,
			'ENT_NOQUOTES': 0,
			'STR_PAD_LEFT': 0,
			'STR_PAD_RIGHT': 1,
			'STR_PAD_BOTH': 2,
			'PATHINFO_DIRNAME': 1,
			'PATHINFO_BASENAME': 2,
			'PATHINFO_EXTENSION': 4,
			'PATHINFO_FILENAME': 8,
			'CHAR_MAX': 127,
			'LC_CTYPE': 2,
			'LC_NUMERIC': 4,
			'LC_TIME': 5,
			'LC_COLLATE': 1,
			'LC_MONETARY': 3,
			'LC_ALL': 0,
			'SEEK_SET': 0,
			'SEEK_CUR': 1,
			'SEEK_END': 2,
			'LOCK_SH': 1,
			'LOCK_EX': 2,
			'LOCK_UN': 3,
			'LOCK_NB': 4,
			'STREAM_NOTIFY_CONNECT': 2,
			'STREAM_NOTIFY_AUTH_REQUIRED': 3,
			'STREAM_NOTIFY_AUTH_RESULT': 10,
			'STREAM_NOTIFY_MIME_TYPE_IS': 4,
			'STREAM_NOTIFY_FILE_SIZE_IS': 5,
			'STREAM_NOTIFY_REDIRECTED': 6,
			'STREAM_NOTIFY_PROGRESS': 7,
			'STREAM_NOTIFY_FAILURE': 9,
			'STREAM_NOTIFY_COMPLETED': 8,
			'STREAM_NOTIFY_RESOLVE': 1,
			'STREAM_NOTIFY_SEVERITY_INFO': 0,
			'STREAM_NOTIFY_SEVERITY_WARN': 1,
			'STREAM_NOTIFY_SEVERITY_ERR': 2,
			'STREAM_FILTER_READ': 1,
			'STREAM_FILTER_WRITE': 2,
			'STREAM_FILTER_ALL': 3,
			'STREAM_CLIENT_PERSISTENT': 1,
			'STREAM_CLIENT_ASYNC_CONNECT': 2,
			'STREAM_CLIENT_CONNECT': 4,
			'STREAM_CRYPTO_METHOD_SSLv2_CLIENT': 0,
			'STREAM_CRYPTO_METHOD_SSLv3_CLIENT': 1,
			'STREAM_CRYPTO_METHOD_SSLv23_CLIENT': 2,
			'STREAM_CRYPTO_METHOD_TLS_CLIENT': 3,
			'STREAM_CRYPTO_METHOD_SSLv2_SERVER': 4,
			'STREAM_CRYPTO_METHOD_SSLv3_SERVER': 5,
			'STREAM_CRYPTO_METHOD_SSLv23_SERVER': 6,
			'STREAM_CRYPTO_METHOD_TLS_SERVER': 7,
			'STREAM_SHUT_RD': 0,
			'STREAM_SHUT_WR': 1,
			'STREAM_SHUT_RDWR': 2,
			'STREAM_PF_INET': 2,
			'STREAM_PF_INET6': 23,
			'STREAM_PF_UNIX': 1,
			'STREAM_IPPROTO_IP': 0,
			'STREAM_IPPROTO_TCP': 6,
			'STREAM_IPPROTO_UDP': 17,
			'STREAM_IPPROTO_ICMP': 1,
			'STREAM_IPPROTO_RAW': 255,
			'STREAM_SOCK_STREAM': 1,
			'STREAM_SOCK_DGRAM': 2,
			'STREAM_SOCK_RAW': 3,
			'STREAM_SOCK_SEQPACKET': 5,
			'STREAM_SOCK_RDM': 4,
			'STREAM_PEEK': 2,
			'STREAM_OOB': 1,
			'STREAM_SERVER_BIND': 4,
			'STREAM_SERVER_LISTEN': 8,
			'FILE_USE_INCLUDE_PATH': 1,
			'FILE_IGNORE_NEW_LINES': 2,
			'FILE_SKIP_EMPTY_LINES': 4,
			'FILE_APPEND': 8,
			'FILE_NO_DEFAULT_CONTEXT': 16,
			'PSFS_PASS_ON': 2,
			'PSFS_FEED_ME': 1,
			'PSFS_ERR_FATAL': 0,
			'PSFS_FLAG_NORMAL': 0,
			'PSFS_FLAG_FLUSH_INC': 1,
			'PSFS_FLAG_FLUSH_CLOSE': 2,
			'CRYPT_SALT_LENGTH': 12,
			'CRYPT_STD_DES': 1,
			'CRYPT_EXT_DES': 0,
			'CRYPT_MD5': 1,
			'CRYPT_BLOWFISH': 0,
			'DIRECTORY_SEPARATOR': '\\',
			'PATH_SEPARATOR': ';',
			'GLOB_BRACE': 128,
			'GLOB_MARK': 8,
			'GLOB_NOSORT': 32,
			'GLOB_NOCHECK': 16,
			'GLOB_NOESCAPE': 4096,
			'GLOB_ERR': 4,
			'GLOB_ONLYDIR': 1073741824,
			'GLOB_AVAILABLE_FLAGS': 1073746108,
			'LOG_EMERG': 1,
			'LOG_ALERT': 1,
			'LOG_CRIT': 1,
			'LOG_ERR': 4,
			'LOG_WARNING': 5,
			'LOG_NOTICE': 6,
			'LOG_INFO': 6,
			'LOG_DEBUG': 6,
			'LOG_KERN': 0,
			'LOG_USER': 8,
			'LOG_MAIL': 16,
			'LOG_DAEMON': 24,
			'LOG_AUTH': 32,
			'LOG_SYSLOG': 40,
			'LOG_LPR': 48,
			'LOG_NEWS': 56,
			'LOG_UUCP': 64,
			'LOG_CRON': 72,
			'LOG_AUTHPRIV': 80,
			'LOG_PID': 1,
			'LOG_CONS': 2,
			'LOG_ODELAY': 4,
			'LOG_NDELAY': 8,
			'LOG_NOWAIT': 16,
			'LOG_PERROR': 32,
			'EXTR_OVERWRITE': 0,
			'EXTR_SKIP': 1,
			'EXTR_PREFIX_SAME': 2,
			'EXTR_PREFIX_ALL': 3,
			'EXTR_PREFIX_INVALID': 4,
			'EXTR_PREFIX_IF_EXISTS': 5,
			'EXTR_IF_EXISTS': 6,
			'EXTR_REFS': 256,
			'SORT_ASC': 4,
			'SORT_DESC': 3,
			'SORT_REGULAR': 0,
			'SORT_NUMERIC': 1,
			'SORT_STRING': 2,
			'SORT_LOCALE_STRING': 5,
			'CASE_LOWER': 0,
			'CASE_UPPER': 1,
			'COUNT_NORMAL': 0,
			'COUNT_RECURSIVE': 1,
			'ASSERT_ACTIVE': 1,
			'ASSERT_CALLBACK': 2,
			'ASSERT_BAIL': 3,
			'ASSERT_WARNING': 4,
			'ASSERT_QUIET_EVAL': 5,
			'STREAM_USE_PATH': 1,
			'STREAM_IGNORE_URL': 2,
			'STREAM_ENFORCE_SAFE_MODE': 4,
			'STREAM_REPORT_ERRORS': 8,
			'STREAM_MUST_SEEK': 16,
			'STREAM_URL_STAT_LINK': 1,
			'STREAM_URL_STAT_QUIET': 2,
			'STREAM_MKDIR_RECURSIVE': 1,
			'STREAM_IS_URL': 1,
			'IMAGETYPE_GIF': 1,
			'IMAGETYPE_JPEG': 2,
			'IMAGETYPE_PNG': 3,
			'IMAGETYPE_SWF': 4,
			'IMAGETYPE_PSD': 5,
			'IMAGETYPE_BMP': 6,
			'IMAGETYPE_TIFF_II': 7,
			'IMAGETYPE_TIFF_MM': 8,
			'IMAGETYPE_JPC': 9,
			'IMAGETYPE_JP2': 10,
			'IMAGETYPE_JPX': 11,
			'IMAGETYPE_JB2': 12,
			'IMAGETYPE_SWC': 13,
			'IMAGETYPE_IFF': 14,
			'IMAGETYPE_WBMP': 15,
			'IMAGETYPE_JPEG2000': 9,
			'IMAGETYPE_XBM': 16
		}
	};

	if (this.php_js && this.php_js.ini && this.php_js.ini['phpjs.get_defined_constants.setConstants'] && this.php_js.ini['phpjs.get_defined_constants.setConstants'].local_value) {
		if (this.php_js.ini['phpjs.get_defined_constants.setConstants'].local_value === 'this') {
			win = this;
		} else if (this.php_js.ini['phpjs.get_defined_constants.setConstants'].local_value === 'thisExt') {
			win = this;
			thisExt = true;
		} else {
			win = this.window;
		}

		for (ext in constObj) {
			if (thisExt) {
				for (cnst in constObj[ext]) {
					if (!win[ext]) {
						win[ext] = {};
					}
					win[ext][cnst] = constObj[ext][cnst];
				}
			} else {
				for (cnst in constObj[ext]) {
					if (this === this.window) {
						this.define(cnst, constObj[ext][cnst]);
					} else {
						win[cnst] = constObj[ext][cnst];
					}
				}
			}
		}
	}

	if (typeof categorize !== 'undefined') {
		return constObj;
	}

	for (ext in constObj) {
		for (cnst in constObj[ext]) {
			flatConstObj[cnst] = constObj[ext][cnst];
		}
	}
	return flatConstObj;
}
function get_extension_funcs(module_name) {

	this.php_js = this.php_js || {};
	this.php_js.exts = this.php_js.exts || {
		array: ['array_change_key_case', 'array_chunk', 'array_combine', 'array_count_values', 'array_diff_assoc', 'array_diff_key', 'array_diff_uassoc', 'array_diff_ukey', 'array_diff', 'array_fill_keys', 'array_fill', 'array_filter', 'array_flip', 'array_intersect_assoc', 'array_intersect_key', 'array_intersect_uassoc', 'array_intersect_ukey', 'array_intersect', 'array_key_exists', 'array_keys', 'array_map', 'array_merge_recursive', 'array_merge', 'array_multisort', 'array_pad', 'array_pop', 'array_product', 'array_push', 'array_rand', 'array_reduce', 'array_replace_recursive', 'array_replace', 'array_reverse', 'array_search', 'array_shift', 'array_slice', 'array_splice', 'array_sum', 'array_udiff_assoc', 'array_udiff_uassoc', 'array_udiff', 'array_uintersect_assoc', 'array_uintersect_uassoc', 'array_uintersect', 'array_unique', 'array_unshift', 'array_values', 'array_walk_recursive', 'array_walk', 'array', 'arsort', 'asort', 'compact', 'count', 'current', 'each', 'end', 'extract', 'in_array', 'key', 'krsort', 'ksort', 'list', 'natcasesort', 'natsort', 'next', 'pos', 'prev', 'range', 'reset', 'rsort', 'shuffle', 'sizeof', 'sort', 'uasort', 'uksort', 'usort'],
		bc: ['bcadd', 'bccomp', 'bcdiv', 'bcmod', 'bcmul', 'bcpow', 'bcpowmod', 'bcscale', 'bcsqrt', 'bcsub'],
		classkit: ['classkit_import', 'classkit_method_add', 'classkit_method_copy', 'classkit_method_redefine', 'classkit_method_remove', 'classkit_method_rename'],
		classobj: ['call_user_method_array', 'call_user_method', 'class_alias', 'class_exists', 'get_called_class', 'get_class_methods', 'get_class_vars', 'get_class', 'get_declared_classes', 'get_declared_interfaces', 'get_object_vars', 'get_parent_class', 'interface_exists', 'is_a', 'is_subclass_of', 'method_exists', 'property_exists'],
		ctype: ['ctype_alnum', 'ctype_alpha', 'ctype_cntrl', 'ctype_digit', 'ctype_graph', 'ctype_lower', 'ctype_print', 'ctype_punct', 'ctype_space', 'ctype_upper', 'ctype_xdigit'],
		datetime: ['checkdate', 'date_add', 'date_create_from_format', 'date_create', 'date_date_set', 'date_default_timezone_get', 'date_default_timezone_set', 'date_diff', 'date_format', 'date_get_last_errors', 'date_interval_create_from_date_string', 'date_interval_format', 'date_isodate_set', 'date_modify', 'date_offset_get', 'date_parse_from_format', 'date_parse', 'date_sub', 'date_sun_info', 'date_sunrise', 'date_sunset', 'date_time_set', 'date_timestamp_get', 'date_timestamp_set', 'date_timezone_get', 'date_timezone_set', 'date', 'getdate', 'gettimeofday', 'gmdate', 'gmmktime', 'gmstrftime', 'idate', 'localtime', 'microtime', 'mktime', 'strftime', 'strptime', 'strtotime', 'time', 'timezone_abbreviations_list', 'timezone_identifiers_list', 'timezone_location_get', 'timezone_name_from_abbr', 'timezone_name_get', 'timezone_offset_get', 'timezone_open', 'timezone_transitions_get', 'timezone_version_get'],
		dir: ['chdir', 'chroot', 'dir', 'closedir', 'getcwd', 'opendir', 'readdir', 'rewinddir', 'scandir'],
		errorfunc: ['debug_backtrace', 'debug_print_backtrace', 'error_get_last', 'error_log', 'error_reporting', 'restore_error_handler', 'restore_exception_handler', 'set_error_handler', 'set_exception_handler', 'trigger_error', 'user_error'],
		exec: ['escapeshellarg', 'escapeshellcmd', 'exec', 'passthru', 'proc_close', 'proc_get_status', 'proc_nice', 'proc_open', 'proc_terminate', 'shell_exec', 'system'],
		filesystem: ['basename', 'chgrp', 'chmod', 'chown', 'clearstatcache', 'copy', 'delete', 'dirname', 'disk_free_space', 'disk_total_space', 'diskfreespace', 'fclose', 'feof', 'fflush', 'fgetc', 'fgetcsv', 'fgets', 'fgetss', 'file_exists', 'file_get_contents', 'file_put_contents', 'file', 'fileatime', 'filectime', 'filegroup', 'fileinode', 'filemtime', 'fileowner', 'fileperms', 'filesize', 'filetype', 'flock', 'fnmatch', 'fopen', 'fpassthru', 'fputcsv', 'fputs', 'fread', 'fscanf', 'fseek', 'fstat', 'ftell', 'ftruncate', 'fwrite', 'glob', 'is_dir', 'is_executable', 'is_file', 'is_link', 'is_readable', 'is_uploaded_file', 'is_writable', 'is_writeable', 'lchgrp', 'lchown', 'link', 'linkinfo', 'lstat', 'mkdir', 'move_uploaded_file', 'parse_ini_file', 'parse_ini_string', 'pathinfo', 'pclose', 'popen', 'readfile', 'readlink', 'realpath', 'rename', 'rewind', 'rmdir', 'set_file_buffer', 'stat', 'symlink', 'tempnam', 'tmpfile', 'touch', 'umask', 'unlink'],
		funchand: ['call_user_func_array', 'call_user_func', 'create_function', 'forward_static_call_array', 'forward_static_call', 'func_get_arg', 'func_get_args', 'func_num_args', 'function_exists', 'get_defined_functions', 'register_shutdown_function', 'register_tick_function', 'unregister_tick_function'],
		i18n: ['locale_get_default', 'locale_set_default'],
		inclued: ['inclued_get_data'],
		info: ['assert_options', 'assert', 'dl', 'extension_loaded', 'gc_collect_cycles', 'gc_disable', 'gc_enable', 'gc_enabled', 'get_cfg_var', 'get_current_user', 'get_defined_constants', 'get_extension_funcs', 'get_include_path', 'get_included_files', 'get_loaded_extensions', 'get_magic_quotes_gpc', 'get_magic_quotes_runtime', 'get_required_files', 'getenv', 'getlastmod', 'getmygid', 'getmyinode', 'getmypid', 'getmyuid', 'getopt', 'getrusage', 'ini_alter', 'ini_get_all', 'ini_get', 'ini_restore', 'ini_set', 'magic_quotes_runtime', 'main', 'memory_get_peak_usage', 'memory_get_usage', 'php_ini_loaded_file', 'php_ini_scanned_files', 'php_logo_guid', 'php_sapi_name', 'php_uname', 'phpcredits', 'phpinfo', 'phpversion', 'putenv', 'restore_include_path', 'set_include_path', 'set_magic_quotes_runtime', 'set_time_limit', 'sys_get_temp_dir', 'version_compare', 'zend_logo_guid', 'zend_thread_id', 'zend_version'],
		json: ['json_decode', 'json_encode', 'json_last_error'],
		language: ['at', 'clone', 'declare', 'foreach', 'goto', 'include', 'include_once', 'php_user_filter', 'require', 'require_once', 'stdClass', 'ErrorException', 'Exception', 'HEREDOC', '$_SESSION', '__CLASS__', '__DIR__', '__FILE__', '__FUNCTION__', '__LINE__', '__METHOD__'],
		math: ['abs', 'acos', 'acosh', 'asin', 'asinh', 'atan2', 'atan', 'atanh', 'base_convert', 'bindec', 'ceil', 'cos', 'cosh', 'decbin', 'dechex', 'decoct', 'deg2rad', 'exp', 'expm1', 'floor', 'fmod', 'getrandmax', 'hexdec', 'hypot', 'is_finite', 'is_infinite', 'is_nan', 'lcg_value', 'log10', 'log1p', 'log', 'max', 'min', 'mt_getrandmax', 'mt_rand', 'mt_srand', 'octdec', 'pi', 'pow', 'rad2deg', 'rand', 'round', 'sin', 'sinh', 'sqrt', 'srand', 'tan', 'tanh'],
		misc: ['connection_aborted', 'connection_status', 'connection_timeout', 'constant', 'define', 'defined', 'die', 'eval', 'exit', 'get_browser', '__halt_compiler', 'highlight_file', 'highlight_string', 'ignore_user_abort', 'pack', 'php_check_syntax', 'php_strip_whitespace', 'show_source', 'sleep', 'sys_getloadavg', 'time_nanosleep', 'time_sleep_until', 'uniqid', 'unpack', 'usleep'],
		'net-gopher': ['gopher_parsedir'],
		network: ['checkdnsrr', 'closelog', 'define_syslog_variables', 'dns_check_record', 'dns_get_mx', 'dns_get_record', 'fsockopen', 'gethostbyaddr', 'gethostbyname', 'gethostbynamel', 'gethostname', 'getmxrr', 'getprotobyname', 'getprotobynumber', 'getservbyname', 'getservbyport', 'header_remove', 'header', 'headers_list', 'headers_sent', 'inet_ntop', 'inet_pton', 'ip2long', 'long2ip', 'openlog', 'pfsockopen', 'setcookie', 'setrawcookie', 'socket_get_status', 'socket_set_blocking', 'socket_set_timeout', 'syslog'],
		objaggregation: ['aggregate_info', 'aggregate_methods_by_list', 'aggregate_methods_by_regexp', 'aggregate_methods', 'aggregate_properties_by_list', 'aggregate_properties_by_regexp', 'aggregate_properties', 'aggregate', 'aggregation_info', 'deaggregate'],
		outcontrol: ['flush', 'ob_clean', 'ob_end_clean', 'ob_end_flush', 'ob_flush', 'ob_get_clean', 'ob_get_contents', 'ob_get_flush', 'ob_get_length', 'ob_get_level', 'ob_get_status', 'ob_gzhandler', 'ob_implicit_flush', 'ob_list_handlers', 'ob_start', 'output_add_rewrite_var', 'output_reset_rewrite_vars'],
		overload: ['overload'],
		pcre: ['preg_filter', 'preg_grep', 'preg_last_error', 'preg_match_all', 'preg_match', 'preg_quote', 'preg_replace_callback', 'preg_replace', 'preg_split'],
		runkit: ['Runkit_Sandbox', 'Runkit_Sandbox_Parent', 'runkit_class_adopt', 'runkit_class_emancipate', 'runkit_constant_add', 'runkit_constant_redefine', 'runkit_constant_remove', 'runkit_function_add', 'runkit_function_copy', 'runkit_function_redefine', 'runkit_function_remove', 'runkit_function_rename', 'runkit_import', 'runkit_lint_file', 'runkit_lint', 'runkit_method_add', 'runkit_method_copy', 'runkit_method_redefine', 'runkit_method_remove', 'runkit_method_rename', 'runkit_return_value_used', 'runkit_sandbox_output_handler', 'runkit_superglobals'],
		session: ['session_cache_expire', 'session_cache_limiter', 'session_commit', 'session_decode', 'session_destroy', 'session_encode', 'session_get_cookie_params', 'session_id', 'session_is_registered', 'session_module_name', 'session_name', 'session_regenerate_id', 'session_register', 'session_save_path', 'session_set_cookie_params', 'session_set_save_handler', 'session_start', 'session_unregister', 'session_unset', 'session_write_close'],
		stream: ['set_socket_blocking', 'stream_bucket_append', 'stream_bucket_make_writeable', 'stream_bucket_new', 'stream_bucket_prepend', 'stream_context_create', 'stream_context_get_default', 'stream_context_get_options', 'stream_context_get_params', 'stream_context_set_default', 'stream_context_set_option', 'stream_context_set_params', 'stream_copy_to_stream', 'stream_encoding', 'stream_filter_append', 'stream_filter_prepend', 'stream_filter_register', 'stream_filter_remove', 'stream_get_contents', 'stream_get_filters', 'stream_get_line', 'stream_get_meta_data', 'stream_get_transports', 'stream_get_wrappers', 'stream_is_local', 'stream_notification_callback', 'stream_register_wrapper', 'stream_resolve_include_path', 'stream_select', 'stream_set_blocking', 'stream_set_timeout', 'stream_set_write_buffer', 'stream_socket_accept', 'stream_socket_client', 'stream_socket_enable_crypto', 'stream_socket_get_name', 'stream_socket_pair', 'stream_socket_recvfrom', 'stream_socket_sendto', 'stream_socket_server', 'stream_socket_shutdown', 'stream_supports_lock', 'stream_wrapper_register', 'stream_wrapper_restore', 'stream_wrapper_unregister'],
		strings: ['addcslashes', 'addslashes', 'bin2hex', 'chop', 'chr', 'chunk_split', 'convert_cyr_string', 'convert_uudecode', 'convert_uuencode', 'count_chars', 'crc32', 'crypt', 'echo', 'explode', 'fprintf', 'get_html_translation_table', 'hebrev', 'hebrevc', 'html_entity_decode', 'htmlentities', 'htmlspecialchars_decode', 'htmlspecialchars', 'implode', 'join', 'lcfirst', 'levenshtein', 'localeconv', 'ltrim', 'md5_file', 'md5', 'metaphone', 'money_format', 'nl_langinfo', 'nl2br', 'number_format', 'ord', 'parse_str', 'print', 'printf', 'quoted_printable_decode', 'quoted_printable_encode', 'quotemeta', 'rtrim', 'setlocale', 'sha1_file', 'sha1', 'similar_text', 'soundex', 'sprintf', 'sscanf', 'str_getcsv', 'str_ireplace', 'str_pad', 'str_repeat', 'str_replace', 'str_rot13', 'str_shuffle', 'str_split', 'str_word_count', 'strcasecmp', 'strchr', 'strcmp', 'strcoll', 'strcspn', 'strip_tags', 'stripcslashes', 'stripos', 'stripslashes', 'stristr', 'strlen', 'strnatcasecmp', 'strnatcmp', 'strncasecmp', 'strncmp', 'strpbrk', 'strpos', 'strrchr', 'strrev', 'strripos', 'strrpos', 'strspn', 'strstr', 'strtok', 'strtolower', 'strtoupper', 'strtr', 'substr_compare', 'substr_count', 'substr_replace', 'substr', 'trim', 'ucfirst', 'ucwords', 'vfprintf', 'vprintf', 'vsprintf', 'wordwrap'],
		tokenizer: ['token_get_all', 'token_name'],
		url: ['base64_decode', 'base64_encode', 'get_headers', 'get_meta_tags', 'http_build_query', 'parse_url', 'rawurldecode', 'rawurlencode', 'urldecode', 'urlencode'],
		'var': ['debug_zval_dump', 'doubleval', 'empty', 'floatval', 'get_defined_vars', 'get_resource_type', 'gettype', 'import_request_variables', 'intval', 'is_array', 'is_binary', 'is_bool', 'is_buffer', 'is_callable', 'is_double', 'is_float', 'is_int', 'is_integer', 'is_long', 'is_null', 'is_numeric', 'is_object', 'is_real', 'is_resource', 'is_scalar', 'is_string', 'is_unicode', 'isset', 'print_r', 'serialize', 'settype', 'strval', 'unserialize', 'unset', 'var_dump', 'var_export'],
		xml: ['utf8_decode', 'utf8_encode', 'xml_error_string', 'xml_get_current_byte_index', 'xml_get_current_column_number', 'xml_get_current_line_number', 'xml_get_error_code', 'xml_parse_into_struct', 'xml_parse', 'xml_parser_create_ns', 'xml_parser_create', 'xml_parser_free', 'xml_parser_get_option', 'xml_parser_set_option', 'xml_set_character_data_handler', 'xml_set_default_handler', 'xml_set_element_handler', 'xml_set_end_namespace_decl_handler', 'xml_set_external_entity_ref_handler', 'xml_set_notation_decl_handler', 'xml_set_object', 'xml_set_processing_instruction_handler', 'xml_set_start_namespace_decl_handler', 'xml_set_unparsed_entity_decl_handler'],
		xmlreader: ['XMLReader'],
		xmlwriter: ['xmlwriter_end_attribute', 'xmlwriter_end_cdata', 'xmlwriter_end_comment', 'xmlwriter_end_document', 'xmlwriter_end_dtd_attlist', 'xmlwriter_end_dtd_element', 'xmlwriter_end_dtd_entity', 'xmlwriter_end_dtd', 'xmlwriter_end_element', 'xmlwriter_end_pi', 'xmlwriter_flush', 'xmlwriter_full_end_element', 'xmlwriter_open_memory', 'xmlwriter_open_uri', 'xmlwriter_output_memory', 'xmlwriter_set_indent_string', 'xmlwriter_set_indent', 'xmlwriter_start_attribute_ns', 'xmlwriter_start_attribute', 'xmlwriter_start_cdata', 'xmlwriter_start_comment', 'xmlwriter_start_document', 'xmlwriter_start_dtd_attlist', 'xmlwriter_start_dtd_element', 'xmlwriter_start_dtd_entity', 'xmlwriter_start_dtd', 'xmlwriter_start_element_ns', 'xmlwriter_start_element', 'xmlwriter_start_pi', 'xmlwriter_text', 'xmlwriter_write_attribute_ns', 'xmlwriter_write_attribute', 'xmlwriter_write_cdata', 'xmlwriter_write_comment', 'xmlwriter_write_dtd_attlist', 'xmlwriter_write_dtd_element', 'xmlwriter_write_dtd_entity', 'xmlwriter_write_dtd', 'xmlwriter_write_element_ns', 'xmlwriter_write_element', 'xmlwriter_write_pi', 'xmlwriter_write_raw']
	};
	return this.php_js.exts[module_name] || false;
}

var sexes = ['female', 'male'];
var maleFirstNames = ['Aaron', 'Aiden', 'Alexander', 'Andrew', 'Anthony', 'Benjamin', 'Brandon', 'Brayden', 'Caleb', 'Carter', 'Christian', 'Christopher', 'Daniel', 'David', 'Dylan', 'Elijah', 'Ethan', 'Evan', 'Gabriel', 'Gavin', 'Isaac', 'Isaiah', 'Jack', 'Jackson', 'Jacob', 'James', 'Jayden', 'John', 'Jonathan', 'Jordan', 'Joseph', 'Joshua', 'Julian', 'Landon', 'Liam', 'Logan', 'Lucas', 'Luke', 'Mason', 'Matthew', 'Michael', 'Nathan', 'Nicholas', 'Noah', 'Owen', 'Ryan', 'Samuel', 'Tyler', 'William', 'Wyatt'];
var femaleFirstNames = ['Aaliyah', 'Abigail', 'Addison', 'Alexis', 'Allison', 'Alyssa', 'Amelia', 'Anna', 'Ashley', 'Aubrey', 'Audrey', 'Ava', 'Avery', 'Brianna', 'Brooklyn', 'Camila', 'Charlotte', 'Chloe', 'Claire', 'Elizabeth', 'Ella', 'Emily', 'Emma', 'Evelyn', 'Gabriella', 'Grace', 'Hailey', 'Hannah', 'Isabella', 'Kaylee', 'Khloe', 'Layla', 'Leah', 'Lillian', 'Lily', 'Madison', 'Mia', 'Natalie', 'Nevaeh', 'Olivia', 'Riley', 'Samantha', 'Sarah', 'Savannah', 'Sofia', 'Sophia', 'Taylor', 'Victoria', 'Zoe', 'Zoey'];
var lastNames = ['Adams', 'Alexander', 'Allen', 'Anderson', 'Bailey', 'Baker', 'Barnes', 'Bell', 'Bennett', 'Brooks', 'Brown', 'Bryant', 'Butler', 'Campbell', 'Carter', 'Clark', 'Coleman', 'Collins', 'Cook', 'Cooper', 'Cox', 'Davis', 'Diaz', 'Edwards', 'Evans', 'Flores', 'Foster', 'Garcia', 'Gonzales', 'Gonzalez', 'Gray', 'Green', 'Griffin', 'Hall', 'Harris', 'Hayes', 'Henderson', 'Hernandez', 'Hill', 'Howard', 'Hughes', 'Jackson', 'James', 'Jenkins', 'Johnson', 'Jones', 'Kelly', 'King', 'Lee', 'Lewis', 'Long', 'Lopez', 'Martin', 'Martinez', 'Miller', 'Mitchell', 'Moore', 'Morgan', 'Morris', 'Murphy', 'Nelson', 'Parker', 'Patterson', 'Perez', 'Perry', 'Peterson', 'Phillips', 'Powell', 'Price', 'Ramirez', 'Reed', 'Richardson', 'Rivera', 'Roberts', 'Robinson', 'Rodriguez', 'Rogers', 'Ross', 'Russell', 'Sanchez', 'Sanders', 'Scott', 'Simmons', 'Smith', 'Stewart', 'Taylor', 'Thomas', 'Thompson', 'Torres', 'Turner', 'Walker', 'Ward', 'Washington', 'Watson', 'White', 'Williams', 'Wilson', 'Wood', 'Wright', 'Young'];
var streets = ['11th Street', '12th Street', '1st Avenue', '1st Street', '2nd Avenue', '2nd Street', '2nd Street West', '3rd Avenue', '3rd Street', '3rd Street West', '4th Street', '4th Street West', '5th Avenue', '5th Street', 'Academy Street', 'Adams Street', 'Beech Street', 'Bridge Street', 'Broad Street', 'Broadway', 'Cedar Street', 'Center Street', 'Central Avenue', 'Cherry Lane', 'Cherry Street', 'Chestnut Street', 'Church Road', 'Church Street', 'Court Street', 'Dogwood Drive', 'East Street', 'Elizabeth Street', 'Elm Street', 'Franklin Street', 'Front Street', 'Green Street', 'Grove Street', 'Hickory Lane', 'High Street', 'Highland Avenue', 'Hill Street', 'Hillside Avenue', 'Holly Drive', 'Jackson Street', 'Jefferson Avenue', 'Jefferson Street', 'Liberty Street', 'Lincoln Avenue', 'Lincoln Street', 'Locust Street', 'Madison Avenue', 'Madison Street', 'Main Street', 'Main Street East', 'Main Street North', 'Main Street South', 'Main Street West', 'Maple Avenue', 'Maple Street', 'Market Street', 'Meadow Lane', 'Mill Street', 'Monroe Street', 'New Street', 'North Street', 'Oak Lane', 'Oak Street', 'Park Avenue', 'Park Place', 'Park Street', 'Pearl Street', 'Pennsylvania Avenue', 'Pine Street', 'Pleasant Street', 'Prospect Street', 'Railroad Street', 'Ridge Road', 'River Road', 'River Street', 'Route 1', 'Route 30', 'Route 32', 'Route 6', 'School Street', 'South Street', 'Spring Street', 'Spruce Street', 'State Street', 'Sunset Drive', 'Union Street', 'Valley Road', 'Vine Street', 'Walnut Street', 'Washington Avenue', 'Washington Street', 'Water Street', 'West Street', 'Winding Way', 'Woodland Drive'];
var cities = ['Arlington', 'Ashland', 'Auburn', 'Bethel', 'Burlington', 'Cedar Grove', 'Centerville', 'Clayton', 'Cleveland', 'Clinton', 'Concord', 'Dayton', 'Dover', 'Fairfield', 'Fairview', 'Five Points', 'Forest Hills', 'Franklin', 'Georgetown', 'Glendale', 'Greenville', 'Greenwood', 'Highland Park', 'Hudson', 'Jackson', 'Kingston', 'Lakeview', 'Lakewood', 'Lexington', 'Liberty', 'Madison', 'Manchester', 'Marion', 'Midway', 'Milford', 'Milton', 'Mount Pleasant', 'Mount Vernon', 'New Hope', 'Newport', 'Oak Grove', 'Oak Hill', 'Oakland', 'Oxford', 'Pine Grove', 'Pleasant Grove', 'Pleasant Hill', 'Pleasant Valley', 'Riverside', 'Salem', 'Shady Grove', 'Shiloh', 'Springfield', 'Troy', 'Union', 'Washington', 'Winchester'];
var states =  ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
var popPercent = [0.2,  1.5,  0.9,  2.1,  12.1, 1.6,  1.2,  0.3,  6.1,  3.2, 0.4,  1.0,  0.5,  4.1,  2.1,  0.9,  1.4,  1.5,  2.1,  1.9, 0.4,  3.2,  1.7,  1.9,  1.0,  0.3,  3.1,  0.2,  0.6,  0.4, 2.8,  0.7,  0.9,  6.3,  3.7,  1.2,  1.2,  4.1,  0.3,  1.5, 0.3,  2.1,  8.3,  0.9,  2.6,  0.2,  2.2,  1.8,  0.6,  0.2];
var zipStartsWith = {'AL': ['35', '36'], 'AK': ['995', '996', '997', '998', '999'], 'AZ': ['85', '86'], 'AR': ['71', '72'], 'CA': ['90', '91', '92', '93', '94', '95', '96'], 'CO': ['80', '81'], 'CT': ['06'], 'DE': ['197', '198', '199'], 'FL': ['32', '33', '34'], 'GA': ['30', '31'], 'HI': ['967', '968'], 'ID': ['83'], 'IL': ['60', '61', '62'], 'IN': ['46', '47'], 'IA': ['50', '51', '52'], 'KS': ['66', '67'], 'KY': ['40', '41', '42'], 'LA': ['70', '71'], 'ME': ['039', '04'], 'MD': ['206', '207', '208', '209', '21'], 'MA': ['01', '02'], 'MI': ['48', '49'], 'MN': ['55', '56'], 'MS': ['38', '39'], 'MO': ['63', '64', '65'], 'MT': ['59'], 'NE': ['68', '690', '691', '692', '693'], 'NV': ['889', '89'], 'NH': ['00', '03'], 'NJ': ['07', '08'], 'NM': ['87', '88'], 'NY': ['10', '11', '12', '13', '14'], 'NC': ['27', '28'], 'ND': ['58'], 'OH': ['43', '44', '45'], 'OK': ['73', '74'], 'OR': ['97'], 'PA': ['15', '16', '17', '18', '19'], 'RI': ['028', '029'], 'SC': ['29'], 'SD': ['57'], 'TN': ['37', '38'], 'TX': ['75', '76', '77', '78', '79'], 'UT': ['84'], 'VT': ['05'], 'VA': ['201', '22', '23', '24'], 'VI': ['008'], 'WA': ['98', '99'], 'WV': ['247', '248', '249', '25', '26'], 'WI': ['53', '54'], 'WY': ['82', '831'] };
var departments = ['Accounting', 'Accounts Payable', 'Customer Service', 'Engineering', 'Finance', 'Food Service', 'Human Resources', 'Information Systems', 'Janitorial', 'Legal', 'Mail Center', 'Manufacturing', 'Marketing', 'Operations', 'Payroll', 'Product Management', 'Purchasing', 'Quality Assurance', 'Records', 'Research and Development', 'Sales', 'Security', 'Technology', 'Training'];
var companies = ['A. Datum Corporation', 'AdventureWorks Cycles', 'Alpine Ski House', 'Awesome Computers', 'Baldwin Museum of Science', 'Blue Yonder Airlines', 'City Power & Light', 'Coho Vineyard', 'Coho Winery', 'Coho Vineyard & Winery', 'Consolidated Messenger', 'Contoso Ltd.', 'Contoso Bank', 'Contoso Pharmaceuticals', 'Electronic, Inc.', 'Fabrikam, Inc.', 'Fourth Coffee', 'Graphic Design Institute', 'Humongous Insurance', 'Itexamworld', 'LitWare Inc.', 'Lucerne Publishing', 'Margie\'s Travel', 'Northridge Video', 'Northwind Traders', 'Parnell Aerospace', 'ProseWare, Inc.', 'School of Fine Art', 'Southbridge Video', 'StrikeStrike', 'TailSpin Toys', 'Tasmanian Traders', 'The Phone Company', 'Trey Research Inc.', 'WingTip Toys', 'Wide World Importers', 'Woodgrove Bank'];

Time.LOCALE = {
	'DAYS': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	'DAYS_SHORT': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	'MONTHS': [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	'MONTHS_SHORT': [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	'AM': 'AM',
	'PM': 'PM',
	'AM_LOW': 'am',
	'PM_LOW': 'pm'
};

Time.TIME_ZONES = {
	'UTC': 0,
	'UT': 0,
	'GMT': 0,
	'EST': -5,
	'EDT': -4,
	'CST': -6,
	'CDT': -5,
	'MST': -7,
	'MDT': -6,
	'PST': -8,
	'PDT': -7
};

var keycodes = {
	modifiers: {
		224: 'command',
		91: 'command',
		93: 'command',
		16: 'shift',
		17: 'ctrl',
		18: 'alt'
	},
	super: function() {return 'mac' == os ? 'command': 'ctrl';},
	backspace: 8,
	command: 91,
	tab: 9,
	clear: 12,
	enter: 13,
	shift: 16,
	ctrl: 17,
	alt: 18,
	capslock: 20,
	escape: 27,
	esc: 27,
	space: 32,
	pageup: 33,
	pagedown: 34,
	end: 35,
	home: 36,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	del: 46,
	comma: 188,
	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
	',': 188,
	'.': 190,
	'/': 191,
	'`': 192,
	'-': 189,
	'=': 187,
	';': 186,
	'[': 219,
	'\\': 220,
	']': 221,
	'\'': 222
};

var pattern =[
	{all:/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g},
	{id:/id=["'](.*?)["']/g},
	{class:/class=["'](.*?)["']/g},
	{src:/src=["'](.*?)["']/g},
	{href:/href=["'](.*?)["']/g},
	{title:/title=["'](.*?)["']/g}
];


var creditCards = {
	'any': /^[0-9]{15,16}$/,
	'AmericanExpress': /^(34)|(37)\d{14}$/,
	'Discover': /^6011\d{12}$/,
	'MasterCard': /^5[1-5]\d{14}$/,
	'Visa': /^4\d{15}$/
}
var datetime = /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/
var email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var isbn = /^(?:(?=.{17}$)97[89][ -](?:[0-9]+[ -]){2}[0-9]+[ -][0-9]|97[89][0-9]{10}|(?=.{13}$)(?:[0-9]+[ -]){2}[0-9]+[ -][0-9Xx]|[0-9]{9}[0-9Xx])$/
var latlong = /-?\d{1,3}\.\d+/
var phone = {
	'ar': /^(?:\+|[0]{2})?(54)?(:?[\s-])*\d{4}(:?[\s-])*\d{4}$/,
	'au': /^(?:\+|0)?(?:61)?\s?[2-478](?:[ -]?[0-9]){8}$/,
	'fr': /^(?:0|\(?\+33\)?\s?|0033\s?)[1-79](?:[\.\-\s]?\d\d){4}$/,
	'is': /^(?:\+|[0]{2})?(354)?(:?[\s-])*\d{3}(:?[\s-])*\d{4}$/,
	'uk': /^(?:\+|044)?(?:\s+)?\(?(\d{1,5}|\d{4}\s*\d{1,2})\)?\s+|-(\d{1,4}(\s+|-)?\d{1,4}|(\d{6}))\d{6}$/,
	'us': /^(\d{3})(:?[\s\-])*(\d{3})(:?[\s\-])*(\d{4})$/
}
var zipcode = {
	'ar': /^\d{4}$/,
	'au': /^\d{4}$/,
	'at': /^\d{4}$/,
	'be': /^\d{4}$/,
	'br': /^\d{5}[\-]?\d{3}$/,
	'ca': /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
	'dk': /^\d{3,4}$/,
	'de': /^\d{5}$/,
	'es': /^((0[1-9]|5[0-2])|[1-4]\d)\d{3}$/,
	'gb': /^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? \d[ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}$/,
	'hu': /^\d{4}$/,
	'is': /^\d{3}$/,
	'it': /^\d{5}$/,
	'jp': /^\d{3}-\d{4}$/,
	'lu': /^(L\s*(-|—|–))\s*?[\d]{4}$/,
	'nl': /^[1-9]\d{3}\s?[a-zA-Z]{2}$/,
	'pl': /^\d{2}\-\d{3}$/,
	'se': /^\d{3}\s?\d{2}$/,
	'us': /^(\d{5}([\-]\d{4})?)$/
}

var htmlEntityMapEscape = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;'};
var escapeChars = {lt: '<', gt: '>', quot: '"', apos: "'", amp: '&'};
var reversedEscapeChars = {};
for(var key in escapeChars){ reversedEscapeChars[escapeChars[key]] = key; }

var entities = {"amp" : "&", "gt" : ">", "lt" : "<", "quot" : "\"", "apos" : "'", "AElig" : 198, "Aacute" : 193, "Acirc" : 194, "Agrave" : 192, "Aring" : 197, "Atilde" : 195, "Auml" : 196, "Ccedil" : 199, "ETH" : 208, "Eacute" : 201, "Ecirc" : 202, "Egrave" : 200, "Euml" : 203, "Iacute" : 205, "Icirc" : 206, "Igrave" : 204, "Iuml" : 207, "Ntilde" : 209, "Oacute" : 211, "Ocirc" : 212, "Ograve" : 210, "Oslash" : 216, "Otilde" : 213, "Ouml" : 214, "THORN" : 222, "Uacute" : 218, "Ucirc" : 219, "Ugrave" : 217, "Uuml" : 220, "Yacute" : 221, "aacute" : 225, "acirc" : 226, "aelig" : 230, "agrave" : 224, "aring" : 229, "atilde" : 227, "auml" : 228, "ccedil" : 231, "eacute" : 233, "ecirc" : 234, "egrave" : 232, "eth" : 240, "euml" : 235, "iacute" : 237, "icirc" : 238, "igrave" : 236, "iuml" : 239, "ntilde" : 241, "oacute" : 243, "ocirc" : 244, "ograve" : 242, "oslash" : 248, "otilde" : 245, "ouml" : 246, "szlig" : 223, "thorn" : 254, "uacute" : 250, "ucirc" : 251, "ugrave" : 249, "uuml" : 252, "yacute" : 253, "yuml" : 255, "copy" : 169, "reg" : 174, "nbsp" : 160, "iexcl" : 161, "cent" : 162, "pound" : 163, "curren" : 164, "yen" : 165, "brvbar" : 166, "sect" : 167, "uml" : 168, "ordf" : 170, "laquo" : 171, "not" : 172, "shy" : 173, "macr" : 175, "deg" : 176, "plusmn" : 177, "sup1" : 185, "sup2" : 178, "sup3" : 179, "acute" : 180, "micro" : 181, "para" : 182, "middot" : 183, "cedil" : 184, "ordm" : 186, "raquo" : 187, "frac14" : 188, "frac12" : 189, "frac34" : 190, "iquest" : 191, "times" : 215, "divide" : 247, "OElig;" : 338, "oelig;" : 339, "Scaron;" : 352, "scaron;" : 353, "Yuml;" : 376, "fnof;" : 402, "circ;" : 710, "tilde;" : 732, "Alpha;" : 913, "Beta;" : 914, "Gamma;" : 915, "Delta;" : 916, "Epsilon;" : 917, "Zeta;" : 918, "Eta;" : 919, "Theta;" : 920, "Iota;" : 921, "Kappa;" : 922, "Lambda;" : 923, "Mu;" : 924, "Nu;" : 925, "Xi;" : 926, "Omicron;" : 927, "Pi;" : 928, "Rho;" : 929, "Sigma;" : 931, "Tau;" : 932, "Upsilon;" : 933, "Phi;" : 934, "Chi;" : 935, "Psi;" : 936, "Omega;" : 937, "alpha;" : 945, "beta;" : 946, "gamma;" : 947, "delta;" : 948, "epsilon;" : 949, "zeta;" : 950, "eta;" : 951, "theta;" : 952, "iota;" : 953, "kappa;" : 954, "lambda;" : 955, "mu;" : 956, "nu;" : 957, "xi;" : 958, "omicron;" : 959, "pi;" : 960, "rho;" : 961, "sigmaf;" : 962, "sigma;" : 963, "tau;" : 964, "upsilon;" : 965, "phi;" : 966, "chi;" : 967, "psi;" : 968, "omega;" : 969, "thetasym;" : 977, "upsih;" : 978, "piv;" : 982, "ensp;" : 8194, "emsp;" : 8195, "thinsp;" : 8201, "zwnj;" : 8204, "zwj;" : 8205, "lrm;" : 8206, "rlm;" : 8207, "ndash;" : 8211, "mdash;" : 8212, "lsquo;" : 8216, "rsquo;" : 8217, "sbquo;" : 8218, "ldquo;" : 8220, "rdquo;" : 8221, "bdquo;" : 8222, "dagger;" : 8224, "Dagger;" : 8225, "bull;" : 8226, "hellip;" : 8230, "permil;" : 8240, "prime;" : 8242, "Prime;" : 8243, "lsaquo;" : 8249, "rsaquo;" : 8250, "oline;" : 8254, "frasl;" : 8260, "euro;" : 8364, "image;" : 8465, "weierp;" : 8472, "real;" : 8476, "trade;" : 8482, "alefsym;" : 8501, "larr;" : 8592, "uarr;" : 8593, "rarr;" : 8594, "darr;" : 8595, "harr;" : 8596, "crarr;" : 8629, "lArr;" : 8656, "uArr;" : 8657, "rArr;" : 8658, "dArr;" : 8659, "hArr;" : 8660, "forall;" : 8704, "part;" : 8706, "exist;" : 8707, "empty;" : 8709, "nabla;" : 8711, "isin;" : 8712, "notin;" : 8713, "ni;" : 8715, "prod;" : 8719, "sum;" : 8721, "minus;" : 8722, "lowast;" : 8727, "radic;" : 8730, "prop;" : 8733, "infin;" : 8734, "ang;" : 8736, "and;" : 8743, "or;" : 8744, "cap;" : 8745, "cup;" : 8746, "int;" : 8747, "there4;" : 8756, "sim;" : 8764, "cong;" : 8773, "asymp;" : 8776, "ne;" : 8800, "equiv;" : 8801, "le;" : 8804, "ge;" : 8805, "sub;" : 8834, "sup;" : 8835, "nsub;" : 8836, "sube;" : 8838, "supe;" : 8839, "oplus;" : 8853, "otimes;" : 8855, "perp;" : 8869, "sdot;" : 8901, "lceil;" : 8968, "rceil;" : 8969, "lfloor;" : 8970, "rfloor;" : 8971, "lang;" : 9001, "rang;" : 9002, "loz;" : 9674, "spades;" : 9824, "clubs;" : 9827, "hearts;" : 9829, "diams;" : 9830}
var entityToCode = {
	__proto__: null,
	apos:0x0027,quot:0x0022,amp:0x0026,lt:0x003C,gt:0x003E,nbsp:0x00A0,iexcl:0x00A1,cent:0x00A2,pound:0x00A3,
	curren:0x00A4,yen:0x00A5,brvbar:0x00A6,sect:0x00A7,uml:0x00A8,copy:0x00A9,ordf:0x00AA,laquo:0x00AB,
	not:0x00AC,shy:0x00AD,reg:0x00AE,macr:0x00AF,deg:0x00B0,plusmn:0x00B1,sup2:0x00B2,sup3:0x00B3,
	acute:0x00B4,micro:0x00B5,para:0x00B6,middot:0x00B7,cedil:0x00B8,sup1:0x00B9,ordm:0x00BA,raquo:0x00BB,
	frac14:0x00BC,frac12:0x00BD,frac34:0x00BE,iquest:0x00BF,Agrave:0x00C0,Aacute:0x00C1,Acirc:0x00C2,Atilde:0x00C3,
	Auml:0x00C4,Aring:0x00C5,AElig:0x00C6,Ccedil:0x00C7,Egrave:0x00C8,Eacute:0x00C9,Ecirc:0x00CA,Euml:0x00CB,
	Igrave:0x00CC,Iacute:0x00CD,Icirc:0x00CE,Iuml:0x00CF,ETH:0x00D0,Ntilde:0x00D1,Ograve:0x00D2,Oacute:0x00D3,
	Ocirc:0x00D4,Otilde:0x00D5,Ouml:0x00D6,times:0x00D7,Oslash:0x00D8,Ugrave:0x00D9,Uacute:0x00DA,Ucirc:0x00DB,
	Uuml:0x00DC,Yacute:0x00DD,THORN:0x00DE,szlig:0x00DF,agrave:0x00E0,aacute:0x00E1,acirc:0x00E2,atilde:0x00E3,
	auml:0x00E4,aring:0x00E5,aelig:0x00E6,ccedil:0x00E7,egrave:0x00E8,eacute:0x00E9,ecirc:0x00EA,euml:0x00EB,
	igrave:0x00EC,iacute:0x00ED,icirc:0x00EE,iuml:0x00EF,eth:0x00F0,ntilde:0x00F1,ograve:0x00F2,oacute:0x00F3,
	ocirc:0x00F4,otilde:0x00F5,ouml:0x00F6,divide:0x00F7,oslash:0x00F8,ugrave:0x00F9,uacute:0x00FA,ucirc:0x00FB,
	uuml:0x00FC,yacute:0x00FD,thorn:0x00FE,yuml:0x00FF,OElig:0x0152,oelig:0x0153,Scaron:0x0160,scaron:0x0161,
	Yuml:0x0178,fnof:0x0192,circ:0x02C6,tilde:0x02DC,Alpha:0x0391,Beta:0x0392,Gamma:0x0393,Delta:0x0394,
	Epsilon:0x0395,Zeta:0x0396,Eta:0x0397,Theta:0x0398,Iota:0x0399,Kappa:0x039A,Lambda:0x039B,Mu:0x039C,
	Nu:0x039D,Xi:0x039E,Omicron:0x039F,Pi:0x03A0,Rho:0x03A1,Sigma:0x03A3,Tau:0x03A4,Upsilon:0x03A5,
	Phi:0x03A6,Chi:0x03A7,Psi:0x03A8,Omega:0x03A9,alpha:0x03B1,beta:0x03B2,gamma:0x03B3,delta:0x03B4,
	epsilon:0x03B5,zeta:0x03B6,eta:0x03B7,theta:0x03B8,iota:0x03B9,kappa:0x03BA,lambda:0x03BB,mu:0x03BC,
	nu:0x03BD,xi:0x03BE,omicron:0x03BF,pi:0x03C0,rho:0x03C1,sigmaf:0x03C2,sigma:0x03C3,tau:0x03C4,
	upsilon:0x03C5,phi:0x03C6,chi:0x03C7,psi:0x03C8,omega:0x03C9,thetasym:0x03D1,upsih:0x03D2,piv:0x03D6,
	ensp:0x2002,emsp:0x2003,thinsp:0x2009,zwnj:0x200C,zwj:0x200D,lrm:0x200E,rlm:0x200F,ndash:0x2013,
	mdash:0x2014,lsquo:0x2018,rsquo:0x2019,sbquo:0x201A,ldquo:0x201C,rdquo:0x201D,bdquo:0x201E,dagger:0x2020,
	Dagger:0x2021,bull:0x2022,hellip:0x2026,permil:0x2030,prime:0x2032,Prime:0x2033,lsaquo:0x2039,rsaquo:0x203A,
	oline:0x203E,frasl:0x2044,euro:0x20AC,image:0x2111,weierp:0x2118,real:0x211C,trade:0x2122,alefsym:0x2135,
	larr:0x2190,uarr:0x2191,rarr:0x2192,darr:0x2193,harr:0x2194,crarr:0x21B5,lArr:0x21D0,uArr:0x21D1,
	rArr:0x21D2,dArr:0x21D3,hArr:0x21D4,forall:0x2200,part:0x2202,exist:0x2203,empty:0x2205,nabla:0x2207,
	isin:0x2208,notin:0x2209,ni:0x220B,prod:0x220F,sum:0x2211,minus:0x2212,lowast:0x2217,radic:0x221A,
	prop:0x221D,infin:0x221E,ang:0x2220,and:0x2227,or:0x2228,cap:0x2229,cup:0x222A,int:0x222B,
	there4:0x2234,sim:0x223C,cong:0x2245,asymp:0x2248,ne:0x2260,equiv:0x2261,le:0x2264,ge:0x2265,
	sub:0x2282,sup:0x2283,nsub:0x2284,sube:0x2286,supe:0x2287,oplus:0x2295,otimes:0x2297,perp:0x22A5,
	sdot:0x22C5,lceil:0x2308,rceil:0x2309,lfloor:0x230A,rfloor:0x230B,lang:0x2329,rang:0x232A,loz:0x25CA,
	spades:0x2660,clubs:0x2663,hearts:0x2665,diams:0x2666
};
var charToEntity = {};
var entityToChar = {};
for (var entityName in entityToCode)
{
	charToEntity[String.fromCharCode(entityToCode[entityName])] = entityName;
	entityToChar[entityName] = String.fromCharCode(entityToCode[entityName]);
}

var latin_map = {
	"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A",
	"Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A",
	"Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A",
	"Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A",
	"À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A",
	"Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A",
	"Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO",
	"Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B",
	"Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B",
	"Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C",
	"Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D",
	"Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D",
	"ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ",
	"Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E",
	"Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E",
	"Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E",
	"Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E",
	"Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E",
	"Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F",
	"Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G",
	"Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H",
	"Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H",
	"Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I",
	"Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I",
	"Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I",
	"Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I",
	"Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S",
	"Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K",
	"Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K",
	"Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L",
	"Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L",
	"Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L",
	"Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M",
	"Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N",
	"Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N",
	"Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N",
	"Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O",
	"Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O",
	"Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O",
	"Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O",
	"Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O",
	"Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O",
	"Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O",
	"Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O",
	"Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU",
	"Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P",
	"Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R",
	"Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R",
	"Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R",
	"Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S",
	"Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S",
	"Ṣ":"S","Ṩ":"S","ẞ":"SS","Ť":"T","Ţ":"T",
	"Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T",
	"Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A",
	"Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U",
	"Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U",
	"Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U",
	"Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U",
	"Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U",
	"Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U",
	"Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V",
	"Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W",
	"Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W",
	"Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y",
	"Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y",
	"Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y",
	"Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z",
	"Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ",
	"Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B",
	"ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G",
	"ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J",
	"ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N",
	"ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P",
	"ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T",
	"ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W",
	"ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a",
	"ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a",
	"â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a",
	"ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a",
	"ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a",
	"ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a",
	"ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa",
	"æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au",
	"ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b",
	"ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b",
	"ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c",
	"ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c",
	"ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d",
	"ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d",
	"ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d",
	"ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz",
	"ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e",
	"ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e",
	"ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e",
	"ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e",
	"ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e",
	"ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et",
	"ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g",
	"ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g",
	"ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h",
	"ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h",
	"ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h",
	"ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i",
	"ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i",
	"ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i",
	"ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f",
	"ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is",
	"ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k",
	"ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k",
	"ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k",
	"ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l",
	"ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l",
	"ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l",
	"ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s",
	"ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m",
	"ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n",
	"ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n",
	"ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n",
	"ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o",
	"ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o",
	"ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o",
	"ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o",
	"ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o",
	"ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o",
	"ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o",
	"ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o",
	"ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo",
	"ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou",
	"ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p",
	"ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q",
	"ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r",
	"ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r",
	"ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r",
	"ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c",
	"ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s",
	"š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s",
	"ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s",
	"ᶊ":"s","ȿ":"s","ɡ":"g","ß":"ss","ᴑ":"o",
	"ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t",
	"ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t",
	"ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t",
	"ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae",
	"ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h",
	"ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m",
	"ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r",
	"ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz",
	"ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u",
	"ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u",
	"ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u",
	"ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u",
	"ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u",
	"ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u",
	"ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v",
	"ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v",
	"ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w",
	"ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x",
	"ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y",
	"ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y",
	"ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y",
	"ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z",
	"ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z",
	"ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff",
	"ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij",
	"œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i",
	"ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v",
	"ₓ":"x"
}
