export interface WordEntry {
  word: string;
  definition: string;
}

export var WORD_DICTIONARY: WordEntry[] = [
  // Nature & Geography
  { word: 'lighthouse', definition: 'A tower built near the coast with a powerful light at the top to warn and guide ships at sea.' },
  { word: 'avalanche', definition: 'A sudden, rapid flow of snow, ice, and debris cascading down a mountain slope.' },
  { word: 'volcano', definition: 'A mountain with a vent through which molten rock, gases, and ash erupt from beneath the earth.' },
  { word: 'glacier', definition: 'A slow-moving river of ice formed by the accumulation and compression of snow over many years.' },
  { word: 'hurricane', definition: 'A large, violent tropical storm system with extremely powerful circular winds.' },
  { word: 'tornado', definition: 'A violently rotating column of air that extends from a thunderstorm cloud down to the ground.' },
  { word: 'tsunami', definition: 'An enormous ocean wave caused by an underwater earthquake, landslide, or volcanic eruption.' },
  { word: 'canyon', definition: 'A deep, narrow valley with steep sides, typically carved over centuries by a flowing river.' },
  { word: 'peninsula', definition: 'A piece of land that is almost completely surrounded by water but remains connected to a larger landmass.' },
  { word: 'oasis', definition: 'A fertile area in the middle of a desert where underground water allows plants and life to thrive.' },
  { word: 'estuary', definition: 'The wide tidal mouth where a river meets and mingles with the sea.' },
  { word: 'fjord', definition: 'A long, narrow, deep inlet of the sea between high cliffs, formed by glacial erosion.' },
  { word: 'lagoon', definition: 'A shallow body of water separated from the open sea by a coral reef or narrow strip of land.' },
  { word: 'tundra', definition: 'A vast, flat, treeless Arctic region where the ground beneath the surface is permanently frozen.' },
  { word: 'savanna', definition: 'A flat, grassy plain in tropical regions with scattered trees and seasonal rainfall.' },
  { word: 'archipelago', definition: 'A group of islands scattered across a sea or ocean.' },
  { word: 'geyser', definition: 'A natural hot spring that intermittently shoots jets of boiling water and steam into the air.' },
  { word: 'blizzard', definition: 'A severe snowstorm with strong winds and very poor visibility.' },
  { word: 'delta', definition: 'A triangular landform deposited at the mouth of a river where it enters a larger body of water.' },
  { word: 'stalactite', definition: 'A spike of mineral deposit hanging downward from the ceiling of a cave.' },
  { word: 'stalagmite', definition: 'A column of mineral deposit that rises upward from the floor of a cave.' },
  { word: 'whirlpool', definition: 'A rapidly rotating mass of water in a river or sea that draws objects toward its center.' },
  { word: 'bioluminescence', definition: 'The production and emission of light by living organisms such as certain fish, jellyfish, or fungi.' },
  { word: 'permafrost', definition: 'A thick layer of soil below the earth\'s surface that remains permanently frozen throughout the year.' },
  { word: 'mirage', definition: 'An optical illusion caused by atmospheric heat, making distant objects appear closer or as if reflected in water.' },

  // Objects & Instruments
  { word: 'telescope', definition: 'An optical instrument with lenses or mirrors that magnifies distant objects for observation.' },
  { word: 'compass', definition: 'A navigational device with a magnetized needle that always points toward magnetic north.' },
  { word: 'sundial', definition: 'An ancient timekeeping instrument that tells the hour by the shadow cast by sunlight.' },
  { word: 'hourglass', definition: 'A device for measuring time consisting of two glass bulbs connected by a narrow neck through which sand slowly falls.' },
  { word: 'lantern', definition: 'A protective case of transparent material enclosing a light source to be carried or hung.' },
  { word: 'anchor', definition: 'A heavy metal device attached to a chain, lowered to the seabed to keep a vessel in place.' },
  { word: 'periscope', definition: 'An instrument using mirrors and prisms to allow vision around or above obstacles, used in submarines.' },
  { word: 'catapult', definition: 'An ancient military machine used to hurl heavy stones or projectiles at enemy fortifications.' },
  { word: 'abacus', definition: 'An ancient calculating device with rows of beads that slide along rods to perform arithmetic.' },
  { word: 'pendulum', definition: 'A weight suspended from a fixed point that swings back and forth in a regular rhythm, used to regulate clocks.' },
  { word: 'pulley', definition: 'A simple machine consisting of a grooved wheel and rope used to lift heavy loads with less effort.' },
  { word: 'sextant', definition: 'A navigational instrument used by sailors to measure the angle between the horizon and a celestial body.' },
  { word: 'anvil', definition: 'A heavy iron block on which heated metal is hammered and shaped by a blacksmith.' },
  { word: 'bellows', definition: 'A device with pleated sides that, when compressed, delivers a strong blast of air to stoke a fire.' },
  { word: 'loom', definition: 'A device or machine used for weaving thread or yarn into fabric.' },
  { word: 'quill', definition: 'A large feather from a bird\'s wing or tail, historically used as a writing pen by dipping in ink.' },
  { word: 'parchment', definition: 'A thin material made from the dried skin of a sheep or goat, historically used as a writing surface.' },
  { word: 'vial', definition: 'A small cylindrical glass container used for holding liquid substances, especially medicines.' },
  { word: 'barometer', definition: 'An instrument used to measure atmospheric pressure, commonly used for weather forecasting.' },
  { word: 'monocle', definition: 'A single round lens worn over one eye to correct or assist vision, held in place by the eye socket.' },

  // Animals
  { word: 'chameleon', definition: 'A lizard famous for its remarkable ability to change the color and pattern of its skin.' },
  { word: 'narwhal', definition: 'An Arctic whale, the male of which sports a long spiraling tusk protruding from its upper jaw.' },
  { word: 'platypus', definition: 'A semiaquatic Australian mammal with a ducklike bill, webbed feet, and a beaver-like tail that lays eggs.' },
  { word: 'pangolin', definition: 'A nocturnal mammal covered head-to-tail in overlapping scales, which curls into a ball when threatened.' },
  { word: 'firefly', definition: 'A soft-bodied beetle that produces a flickering cold light from its abdomen to attract mates at night.' },
  { word: 'piranha', definition: 'A carnivorous freshwater fish of South America with razor-sharp teeth known for its aggressive feeding.' },
  { word: 'albatross', definition: 'A very large seabird with an enormous wingspan that can soar for thousands of miles over open ocean.' },
  { word: 'armadillo', definition: 'A small mammal of the Americas covered in a hard bony shell that it can roll into for protection.' },
  { word: 'salamander', definition: 'A moist-skinned amphibian resembling a lizard that lives near water and is often associated with regenerating lost limbs.' },
  { word: 'wolverine', definition: 'A stocky, powerful carnivorous mammal of northern forests known for its ferocity and strength.' },
  { word: 'manatee', definition: 'A large, gentle, slow-moving marine mammal that grazes on aquatic plants, sometimes called a sea cow.' },
  { word: 'porcupine', definition: 'A large rodent covered in sharp, stiff spines called quills used for defense against predators.' },
  { word: 'sloth', definition: 'A slow-moving tree-dwelling mammal of Central and South America that hangs upside down from branches.' },
  { word: 'tapir', definition: 'A large herbivorous mammal with a short prehensile snout, related to horses and rhinoceroses.' },
  { word: 'toucan', definition: 'A tropical bird of Central and South America recognized by its enormous, brightly colored beak.' },
  { word: 'walrus', definition: 'A large Arctic marine mammal with two long ivory tusks, a whiskered muzzle, and flipper-like limbs.' },
  { word: 'pelican', definition: 'A large water bird with a long bill and an expandable throat pouch for scooping up fish.' },
  { word: 'flamingo', definition: 'A tall wading bird with distinctive pink or red plumage, long thin legs, and a curved beak.' },
  { word: 'mantis', definition: 'A predatory insect that holds its front legs folded as if in prayer while waiting to ambush prey.' },
  { word: 'axolotl', definition: 'A Mexican aquatic salamander that never fully matures and keeps its external gills throughout its life.' },
  { word: 'condor', definition: 'The largest flying bird of the Americas, a vulture with a bald red head and massive black wings.' },
  { word: 'okapi', definition: 'A large giraffe relative from central Africa with a horse-like body and zebra-striped legs.' },
  { word: 'capybara', definition: 'The world\'s largest rodent, a semi-aquatic mammal native to South America that lives near bodies of water.' },

  // People & Roles
  { word: 'nomad', definition: 'A person who has no fixed home and travels from place to place, often following seasonal resources.' },
  { word: 'hermit', definition: 'A person who chooses to live alone in seclusion, away from society.' },
  { word: 'pilgrim', definition: 'A person who undertakes a journey to a sacred place for religious or spiritual reasons.' },
  { word: 'jester', definition: 'A professional fool employed by a medieval royal court to entertain through jokes, acrobatics, and storytelling.' },
  { word: 'cartographer', definition: 'A person who creates and designs maps.' },
  { word: 'blacksmith', definition: 'A craftsperson who forges and shapes iron and steel by heating it in a fire and hammering it.' },
  { word: 'archaeologist', definition: 'A scientist who studies ancient human history by excavating and analyzing artifacts and structures.' },
  { word: 'apothecary', definition: 'A historical term for a person who prepared, sold, and dispensed medicines and herbal remedies.' },
  { word: 'troubadour', definition: 'A medieval poet-musician of southern France who composed and performed lyric poetry about courtly love.' },
  { word: 'polymath', definition: 'A person whose expertise and knowledge span a wide variety of different subjects or fields.' },
  { word: 'virtuoso', definition: 'A person who has achieved an exceptional or extraordinary level of skill in a fine art, especially music.' },
  { word: 'alchemist', definition: 'A medieval practitioner who attempted to transform ordinary metals into gold and discover a cure for all diseases.' },
  { word: 'mariner', definition: 'A person who works and navigates aboard a ship; a sailor.' },

  // Places & Structures
  { word: 'dungeon', definition: 'A dark underground prison cell, typically found beneath a castle or fortress.' },
  { word: 'monastery', definition: 'A building or complex of buildings where a community of monks lives, works, and worships.' },
  { word: 'catacomb', definition: 'An underground burial place consisting of passages and chambers carved from rock.' },
  { word: 'citadel', definition: 'A fortress situated on high ground that commands the surrounding city and serves as a last refuge.' },
  { word: 'bazaar', definition: 'A busy street market in Middle Eastern or Asian countries where a variety of goods are traded.' },
  { word: 'amphitheater', definition: 'An open circular or oval outdoor venue with rising tiers of seats surrounding a central performance area.' },
  { word: 'mausoleum', definition: 'A large, stately tomb or a building that houses the burial chambers of prominent individuals.' },
  { word: 'aqueduct', definition: 'An ancient bridge-like structure built to carry water over long distances, typically from hills to cities.' },
  { word: 'catacombs', definition: 'Underground networks of tunnels used as burial sites, especially those built beneath ancient Rome.' },
  { word: 'labyrinth', definition: 'A complex, confusing network of tunnels or passages designed to trap anyone who enters.' },

  // Abstract Concepts
  { word: 'paradox', definition: 'A statement or situation that appears self-contradictory but may reveal a deeper truth upon reflection.' },
  { word: 'enigma', definition: 'A person, thing, or situation that is mysterious, puzzling, and difficult to understand or explain.' },
  { word: 'serendipity', definition: 'The fortunate and unexpected discovery of something valuable or delightful while not actively searching for it.' },
  { word: 'nostalgia', definition: 'A bittersweet longing and affection for the past, often idealized in memory.' },
  { word: 'euphoria', definition: 'An intense feeling of great happiness, excitement, and well-being.' },
  { word: 'solitude', definition: 'The state of being alone, free from outside contact, often experienced as peaceful and restorative.' },
  { word: 'karma', definition: 'The spiritual principle that a person\'s actions determine their fate in future lives or circumstances.' },
  { word: 'utopia', definition: 'An imagined society or place where everything is perfect, peaceful, and ideally organized.' },
  { word: 'silhouette', definition: 'The dark shape and outline of someone or something visible against a lighter background.' },
  { word: 'catharsis', definition: 'The emotional release and purification achieved through art, music, or a profound experience.' },
  { word: 'wanderlust', definition: 'A strong and irresistible desire to travel and explore distant places.' },
  { word: 'epiphany', definition: 'A sudden and striking moment of clarity or understanding about something important.' },
  { word: 'renaissance', definition: 'A period of great cultural, artistic, and intellectual revival and rebirth.' },
  { word: 'purgatory', definition: 'In some religious beliefs, a place where souls undergo purification before entering heaven.' },
  { word: 'zeitgeist', definition: 'The defining spirit or mood of a particular period in history as shown by its ideas and beliefs.' },
  { word: 'schadenfreude', definition: 'The pleasure or satisfaction felt when observing the misfortunes of others.' },
  { word: 'hyperbole', definition: 'An extreme exaggeration used for emphasis or dramatic effect, not meant to be taken literally.' },
  { word: 'metaphor', definition: 'A figure of speech that describes something by stating it is something else, revealing a similarity.' },
  { word: 'irony', definition: 'The use of words or situations where the actual meaning or outcome is opposite to what is expected.' },
  { word: 'sarcasm', definition: 'A sharp, cutting remark that says the opposite of what is meant, often used to mock or taunt.' },

  // Science & Nature Phenomena
  { word: 'eclipse', definition: 'The blocking of light from one celestial body by the passage of another between it and the observer.' },
  { word: 'aurora', definition: 'Colorful bands and curtains of light visible in the night sky near the poles, caused by solar particles.' },
  { word: 'hibernation', definition: 'A dormant state of inactivity some animals enter during winter to conserve energy.' },
  { word: 'migration', definition: 'The seasonal movement of animals from one region to another, typically for feeding or breeding.' },
  { word: 'metamorphosis', definition: 'A dramatic biological transformation in an organism\'s body structure, such as a caterpillar becoming a butterfly.' },
  { word: 'photosynthesis', definition: 'The process by which green plants use sunlight, water, and carbon dioxide to produce food.' },
  { word: 'osmosis', definition: 'The spontaneous movement of water through a membrane from a region of low to high concentration.' },
  { word: 'combustion', definition: 'A chemical reaction that produces heat and light, commonly known as burning.' },
  { word: 'gravity', definition: 'The natural force of attraction that pulls objects toward one another, keeping planets in orbit.' },
  { word: 'magnetism', definition: 'The force exerted by magnets that attracts iron and creates invisible fields of attraction and repulsion.' },
  { word: 'echo', definition: 'A sound that is reflected off a surface and heard again after a brief delay.' },
  { word: 'fossil', definition: 'The preserved remains or impression of an ancient living organism found in rock.' },
  { word: 'venom', definition: 'A poisonous fluid produced by animals and transmitted to prey or enemies by biting or stinging.' },
  { word: 'camouflage', definition: 'The ability to blend into surroundings through color, pattern, or texture to avoid detection.' },
  { word: 'symbiosis', definition: 'A close, long-term relationship between two different organisms that often benefits both parties.' },
];

export function getRandomWord(): WordEntry {
  const idx = Math.floor(Math.random() * WORD_DICTIONARY.length);
  return WORD_DICTIONARY[idx];
}

export function getRandomWordExcluding(excludeWord: string): WordEntry {
  WORD_DICTIONARY = WORD_DICTIONARY.filter(e => e.word !== excludeWord);
  const idx = Math.floor(Math.random() * WORD_DICTIONARY.length);
  return WORD_DICTIONARY[idx];
}
