export interface WordEntry {
  word: string;
  definition: string;
  synonyms: string[];
}

export var WORD_DICTIONARY: WordEntry[] = [
  // Nature & Geography
  { word: 'lighthouse', definition: 'A tower built near the coast with a powerful light at the top to warn and guide ships at sea.', synonyms: ['beacon', 'pharos'] },
  { word: 'avalanche', definition: 'A sudden, rapid flow of snow, ice, and debris cascading down a mountain slope.', synonyms: ['snowslide', 'landslide', 'snowfall'] },
  { word: 'volcano', definition: 'A mountain with a vent through which molten rock, gases, and ash erupt from beneath the earth.', synonyms: [] },
  { word: 'glacier', definition: 'A slow-moving river of ice formed by the accumulation and compression of snow over many years.', synonyms: ['ice field', 'icecap'] },
  { word: 'hurricane', definition: 'A large, violent tropical storm system with extremely powerful circular winds.', synonyms: ['typhoon', 'cyclone'] },
  { word: 'tornado', definition: 'A violently rotating column of air that extends from a thunderstorm cloud down to the ground.', synonyms: ['twister', 'whirlwind', 'cyclone'] },
  { word: 'tsunami', definition: 'An enormous ocean wave caused by an underwater earthquake, landslide, or volcanic eruption.', synonyms: ['tidal wave', 'seismic wave'] },
  { word: 'canyon', definition: 'A deep, narrow valley with steep sides, typically carved over centuries by a flowing river.', synonyms: ['gorge', 'ravine', 'gully'] },
  { word: 'peninsula', definition: 'A piece of land that is almost completely surrounded by water but remains connected to a larger landmass.', synonyms: ['cape', 'headland'] },
  { word: 'oasis', definition: 'A fertile area in the middle of a desert where underground water allows plants and life to thrive.', synonyms: ['watering hole', 'spring'] },
  { word: 'estuary', definition: 'The wide tidal mouth where a river meets and mingles with the sea.', synonyms: ['firth', 'inlet'] },
  { word: 'fjord', definition: 'A long, narrow, deep inlet of the sea between high cliffs, formed by glacial erosion.', synonyms: ['inlet', 'sound'] },
  { word: 'lagoon', definition: 'A shallow body of water separated from the open sea by a coral reef or narrow strip of land.', synonyms: ['lake', 'pool'] },
  { word: 'tundra', definition: 'A vast, flat, treeless Arctic region where the ground beneath the surface is permanently frozen.', synonyms: ['barren', 'plain'] },
  { word: 'savanna', definition: 'A flat, grassy plain in tropical regions with scattered trees and seasonal rainfall.', synonyms: ['savannah', 'grassland', 'plain'] },
  { word: 'archipelago', definition: 'A group of islands scattered across a sea or ocean.', synonyms: ['islands', 'island chain'] },
  { word: 'geyser', definition: 'A natural hot spring that intermittently shoots jets of boiling water and steam into the air.', synonyms: ['hot spring', 'spring'] },
  { word: 'blizzard', definition: 'A severe snowstorm with strong winds and very poor visibility.', synonyms: ['snowstorm', 'snowsquall'] },
  { word: 'delta', definition: 'A triangular landform deposited at the mouth of a river where it enters a larger body of water.', synonyms: [] },
  { word: 'stalactite', definition: 'A spike of mineral deposit hanging downward from the ceiling of a cave.', synonyms: [] },
  { word: 'stalagmite', definition: 'A column of mineral deposit that rises upward from the floor of a cave.', synonyms: [] },
  { word: 'whirlpool', definition: 'A rapidly rotating mass of water in a river or sea that draws objects toward its center.', synonyms: ['vortex', 'maelstrom', 'eddy'] },
  { word: 'bioluminescence', definition: 'The production and emission of light by living organisms such as certain fish, jellyfish, or fungi.', synonyms: [] },
  { word: 'permafrost', definition: 'A thick layer of soil below the earth\'s surface that remains permanently frozen throughout the year.', synonyms: [] },
  { word: 'mirage', definition: 'An optical illusion caused by atmospheric heat, making distant objects appear closer or as if reflected in water.', synonyms: ['illusion', 'hallucination'] },

  // Objects & Instruments
  { word: 'telescope', definition: 'An optical instrument with lenses or mirrors that magnifies distant objects for observation.', synonyms: ['spyglass'] },
  { word: 'compass', definition: 'A navigational device with a magnetized needle that always points toward magnetic north.', synonyms: [] },
  { word: 'sundial', definition: 'An ancient timekeeping instrument that tells the hour by the shadow cast by sunlight.', synonyms: [] },
  { word: 'hourglass', definition: 'A device for measuring time consisting of two glass bulbs connected by a narrow neck through which sand slowly falls.', synonyms: ['sandglass'] },
  { word: 'lantern', definition: 'A protective case of transparent material enclosing a light source to be carried or hung.', synonyms: ['lamp', 'light'] },
  { word: 'anchor', definition: 'A heavy metal device attached to a chain, lowered to the seabed to keep a vessel in place.', synonyms: [] },
  { word: 'periscope', definition: 'An instrument using mirrors and prisms to allow vision around or above obstacles, used in submarines.', synonyms: [] },
  { word: 'catapult', definition: 'An ancient military machine used to hurl heavy stones or projectiles at enemy fortifications.', synonyms: ['trebuchet', 'ballista', 'sling'] },
  { word: 'abacus', definition: 'An ancient calculating device with rows of beads that slide along rods to perform arithmetic.', synonyms: ['counting frame'] },
  { word: 'pendulum', definition: 'A weight suspended from a fixed point that swings back and forth in a regular rhythm, used to regulate clocks.', synonyms: ['bob'] },
  { word: 'pulley', definition: 'A simple machine consisting of a grooved wheel and rope used to lift heavy loads with less effort.', synonyms: ['block and tackle'] },
  { word: 'sextant', definition: 'A navigational instrument used by sailors to measure the angle between the horizon and a celestial body.', synonyms: [] },
  { word: 'anvil', definition: 'A heavy iron block on which heated metal is hammered and shaped by a blacksmith.', synonyms: [] },
  { word: 'bellows', definition: 'A device with pleated sides that, when compressed, delivers a strong blast of air to stoke a fire.', synonyms: [] },
  { word: 'loom', definition: 'A device or machine used for weaving thread or yarn into fabric.', synonyms: [] },
  { word: 'quill', definition: 'A large feather from a bird\'s wing or tail, historically used as a writing pen by dipping in ink.', synonyms: ['pen', 'feather', 'plume'] },
  { word: 'parchment', definition: 'A thin material made from the dried skin of a sheep or goat, historically used as a writing surface.', synonyms: ['vellum', 'scroll'] },
  { word: 'vial', definition: 'A small cylindrical glass container used for holding liquid substances, especially medicines.', synonyms: ['phial', 'ampoule'] },
  { word: 'barometer', definition: 'An instrument used to measure atmospheric pressure, commonly used for weather forecasting.', synonyms: [] },
  { word: 'monocle', definition: 'A single round lens worn over one eye to correct or assist vision, held in place by the eye socket.', synonyms: ['eyeglass'] },

  // Animals
  { word: 'chameleon', definition: 'A lizard famous for its remarkable ability to change the color and pattern of its skin.', synonyms: [] },
  { word: 'narwhal', definition: 'An Arctic whale, the male of which sports a long spiraling tusk protruding from its upper jaw.', synonyms: [] },
  { word: 'platypus', definition: 'A semiaquatic Australian mammal with a ducklike bill, webbed feet, and a beaver-like tail that lays eggs.', synonyms: ['duckbill'] },
  { word: 'pangolin', definition: 'A nocturnal mammal covered head-to-tail in overlapping scales, which curls into a ball when threatened.', synonyms: ['scaly anteater'] },
  { word: 'firefly', definition: 'A soft-bodied beetle that produces a flickering cold light from its abdomen to attract mates at night.', synonyms: ['lightning bug', 'glowworm'] },
  { word: 'piranha', definition: 'A carnivorous freshwater fish of South America with razor-sharp teeth known for its aggressive feeding.', synonyms: [] },
  { word: 'albatross', definition: 'A very large seabird with an enormous wingspan that can soar for thousands of miles over open ocean.', synonyms: ['seabird'] },
  { word: 'armadillo', definition: 'A small mammal of the Americas covered in a hard bony shell that it can roll into for protection.', synonyms: [] },
  { word: 'salamander', definition: 'A moist-skinned amphibian resembling a lizard that lives near water and is often associated with regenerating lost limbs.', synonyms: ['newt'] },
  { word: 'wolverine', definition: 'A stocky, powerful carnivorous mammal of northern forests known for its ferocity and strength.', synonyms: ['glutton'] },
  { word: 'manatee', definition: 'A large, gentle, slow-moving marine mammal that grazes on aquatic plants, sometimes called a sea cow.', synonyms: ['sea cow', 'dugong'] },
  { word: 'porcupine', definition: 'A large rodent covered in sharp, stiff spines called quills used for defense against predators.', synonyms: [] },
  { word: 'sloth', definition: 'A slow-moving tree-dwelling mammal of Central and South America that hangs upside down from branches.', synonyms: [] },
  { word: 'tapir', definition: 'A large herbivorous mammal with a short prehensile snout, related to horses and rhinoceroses.', synonyms: [] },
  { word: 'toucan', definition: 'A tropical bird of Central and South America recognized by its enormous, brightly colored beak.', synonyms: [] },
  { word: 'walrus', definition: 'A large Arctic marine mammal with two long ivory tusks, a whiskered muzzle, and flipper-like limbs.', synonyms: [] },
  { word: 'pelican', definition: 'A large water bird with a long bill and an expandable throat pouch for scooping up fish.', synonyms: [] },
  { word: 'flamingo', definition: 'A tall wading bird with distinctive pink or red plumage, long thin legs, and a curved beak.', synonyms: [] },
  { word: 'mantis', definition: 'A predatory insect that holds its front legs folded as if in prayer while waiting to ambush prey.', synonyms: ['praying mantis'] },
  { word: 'axolotl', definition: 'A Mexican aquatic salamander that never fully matures and keeps its external gills throughout its life.', synonyms: ['mexican walking fish'] },
  { word: 'condor', definition: 'The largest flying bird of the Americas, a vulture with a bald red head and massive black wings.', synonyms: ['vulture'] },
  { word: 'okapi', definition: 'A large giraffe relative from central Africa with a horse-like body and zebra-striped legs.', synonyms: [] },
  { word: 'capybara', definition: 'The world\'s largest rodent, a semi-aquatic mammal native to South America that lives near bodies of water.', synonyms: [] },

  // People & Roles
  { word: 'nomad', definition: 'A person who has no fixed home and travels from place to place, often following seasonal resources.', synonyms: ['wanderer', 'drifter', 'roamer'] },
  { word: 'hermit', definition: 'A person who chooses to live alone in seclusion, away from society.', synonyms: ['recluse', 'loner'] },
  { word: 'pilgrim', definition: 'A person who undertakes a journey to a sacred place for religious or spiritual reasons.', synonyms: ['wayfarer', 'traveler'] },
  { word: 'jester', definition: 'A professional fool employed by a medieval royal court to entertain through jokes, acrobatics, and storytelling.', synonyms: ['fool', 'clown', 'buffoon'] },
  { word: 'cartographer', definition: 'A person who creates and designs maps.', synonyms: ['mapmaker'] },
  { word: 'blacksmith', definition: 'A craftsperson who forges and shapes iron and steel by heating it in a fire and hammering it.', synonyms: ['smith', 'farrier'] },
  { word: 'archaeologist', definition: 'A scientist who studies ancient human history by excavating and analyzing artifacts and structures.', synonyms: [] },
  { word: 'apothecary', definition: 'A historical term for a person who prepared, sold, and dispensed medicines and herbal remedies.', synonyms: ['pharmacist', 'druggist', 'chemist'] },
  { word: 'troubadour', definition: 'A medieval poet-musician of southern France who composed and performed lyric poetry about courtly love.', synonyms: ['minstrel', 'bard'] },
  { word: 'polymath', definition: 'A person whose expertise and knowledge span a wide variety of different subjects or fields.', synonyms: ['renaissance man', 'genius'] },
  { word: 'virtuoso', definition: 'A person who has achieved an exceptional or extraordinary level of skill in a fine art, especially music.', synonyms: ['master', 'maestro', 'prodigy'] },
  { word: 'alchemist', definition: 'A medieval practitioner who attempted to transform ordinary metals into gold and discover a cure for all diseases.', synonyms: [] },
  { word: 'mariner', definition: 'A person who works and navigates aboard a ship; a sailor.', synonyms: ['sailor', 'seaman', 'seafarer'] },

  // Places & Structures
  { word: 'dungeon', definition: 'A dark underground prison cell, typically found beneath a castle or fortress.', synonyms: ['cell', 'oubliette'] },
  { word: 'monastery', definition: 'A building or complex of buildings where a community of monks lives, works, and worships.', synonyms: ['abbey', 'priory', 'convent', 'cloister'] },
  { word: 'catacomb', definition: 'An underground burial place consisting of passages and chambers carved from rock.', synonyms: ['crypt', 'tomb', 'vault'] },
  { word: 'citadel', definition: 'A fortress situated on high ground that commands the surrounding city and serves as a last refuge.', synonyms: ['fortress', 'stronghold', 'fort', 'bastion'] },
  { word: 'bazaar', definition: 'A busy street market in Middle Eastern or Asian countries where a variety of goods are traded.', synonyms: ['market', 'marketplace', 'souk'] },
  { word: 'amphitheater', definition: 'An open circular or oval outdoor venue with rising tiers of seats surrounding a central performance area.', synonyms: ['arena', 'coliseum', 'stadium'] },
  { word: 'mausoleum', definition: 'A large, stately tomb or a building that houses the burial chambers of prominent individuals.', synonyms: ['tomb', 'sepulcher', 'crypt'] },
  { word: 'aqueduct', definition: 'An ancient bridge-like structure built to carry water over long distances, typically from hills to cities.', synonyms: ['channel', 'conduit'] },
  { word: 'catacombs', definition: 'Underground networks of tunnels used as burial sites, especially those built beneath ancient Rome.', synonyms: ['crypts', 'tombs', 'tunnels'] },
  { word: 'labyrinth', definition: 'A complex, confusing network of tunnels or passages designed to trap anyone who enters.', synonyms: ['maze'] },

  // Abstract Concepts
  { word: 'paradox', definition: 'A statement or situation that appears self-contradictory but may reveal a deeper truth upon reflection.', synonyms: ['contradiction', 'puzzle'] },
  { word: 'enigma', definition: 'A person, thing, or situation that is mysterious, puzzling, and difficult to understand or explain.', synonyms: ['mystery', 'riddle', 'puzzle'] },
  { word: 'serendipity', definition: 'The fortunate and unexpected discovery of something valuable or delightful while not actively searching for it.', synonyms: ['fortune', 'luck', 'chance'] },
  { word: 'nostalgia', definition: 'A bittersweet longing and affection for the past, often idealized in memory.', synonyms: ['longing', 'wistfulness', 'reminiscence'] },
  { word: 'euphoria', definition: 'An intense feeling of great happiness, excitement, and well-being.', synonyms: ['elation', 'bliss', 'joy', 'rapture'] },
  { word: 'solitude', definition: 'The state of being alone, free from outside contact, often experienced as peaceful and restorative.', synonyms: ['isolation', 'seclusion', 'loneliness'] },
  { word: 'karma', definition: 'The spiritual principle that a person\'s actions determine their fate in future lives or circumstances.', synonyms: ['fate', 'destiny'] },
  { word: 'utopia', definition: 'An imagined society or place where everything is perfect, peaceful, and ideally organized.', synonyms: ['paradise', 'eden', 'nirvana'] },
  { word: 'silhouette', definition: 'The dark shape and outline of someone or something visible against a lighter background.', synonyms: ['outline', 'profile', 'shadow'] },
  { word: 'catharsis', definition: 'The emotional release and purification achieved through art, music, or a profound experience.', synonyms: ['release', 'purging', 'purification'] },
  { word: 'wanderlust', definition: 'A strong and irresistible desire to travel and explore distant places.', synonyms: [] },
  { word: 'epiphany', definition: 'A sudden and striking moment of clarity or understanding about something important.', synonyms: ['revelation', 'realization', 'insight'] },
  { word: 'renaissance', definition: 'A period of great cultural, artistic, and intellectual revival and rebirth.', synonyms: ['revival', 'rebirth', 'resurgence'] },
  { word: 'purgatory', definition: 'In some religious beliefs, a place where souls undergo purification before entering heaven.', synonyms: ['limbo'] },
  { word: 'zeitgeist', definition: 'The defining spirit or mood of a particular period in history as shown by its ideas and beliefs.', synonyms: ['spirit of the age'] },
  { word: 'schadenfreude', definition: 'The pleasure or satisfaction felt when observing the misfortunes of others.', synonyms: [] },
  { word: 'hyperbole', definition: 'An extreme exaggeration used for emphasis or dramatic effect, not meant to be taken literally.', synonyms: ['exaggeration', 'overstatement'] },
  { word: 'metaphor', definition: 'A figure of speech that describes something by stating it is something else, revealing a similarity.', synonyms: ['analogy', 'comparison'] },
  { word: 'irony', definition: 'The use of words or situations where the actual meaning or outcome is opposite to what is expected.', synonyms: [] },
  { word: 'sarcasm', definition: 'A sharp, cutting remark that says the opposite of what is meant, often used to mock or taunt.', synonyms: ['mockery', 'derision', 'sardonicism'] },

  // Science & Nature Phenomena
  { word: 'eclipse', definition: 'The blocking of light from one celestial body by the passage of another between it and the observer.', synonyms: ['occultation'] },
  { word: 'aurora', definition: 'Colorful bands and curtains of light visible in the night sky near the poles, caused by solar particles.', synonyms: ['northern lights', 'polar lights'] },
  { word: 'hibernation', definition: 'A dormant state of inactivity some animals enter during winter to conserve energy.', synonyms: ['dormancy'] },
  { word: 'migration', definition: 'The seasonal movement of animals from one region to another, typically for feeding or breeding.', synonyms: ['movement', 'journey'] },
  { word: 'metamorphosis', definition: 'A dramatic biological transformation in an organism\'s body structure, such as a caterpillar becoming a butterfly.', synonyms: ['transformation', 'transmutation'] },
  { word: 'photosynthesis', definition: 'The process by which green plants use sunlight, water, and carbon dioxide to produce food.', synonyms: [] },
  { word: 'osmosis', definition: 'The spontaneous movement of water through a membrane from a region of low to high concentration.', synonyms: ['diffusion'] },
  { word: 'combustion', definition: 'A chemical reaction that produces heat and light, commonly known as burning.', synonyms: ['burning', 'ignition'] },
  { word: 'gravity', definition: 'The natural force of attraction that pulls objects toward one another, keeping planets in orbit.', synonyms: ['gravitation'] },
  { word: 'magnetism', definition: 'The force exerted by magnets that attracts iron and creates invisible fields of attraction and repulsion.', synonyms: [] },
  { word: 'echo', definition: 'A sound that is reflected off a surface and heard again after a brief delay.', synonyms: ['reverberation', 'reflection'] },
  { word: 'fossil', definition: 'The preserved remains or impression of an ancient living organism found in rock.', synonyms: ['remains', 'relic'] },
  { word: 'venom', definition: 'A poisonous fluid produced by animals and transmitted to prey or enemies by biting or stinging.', synonyms: ['poison', 'toxin'] },
  { word: 'camouflage', definition: 'The ability to blend into surroundings through color, pattern, or texture to avoid detection.', synonyms: ['disguise', 'concealment'] },
  { word: 'symbiosis', definition: 'A close, long-term relationship between two different organisms that often benefits both parties.', synonyms: ['mutualism'] },

  // Everyday items
  { word: 'refrigerator', definition: 'An appliance or compartment which is artificially kept cool and used to store food and drink.', synonyms: ['fridge', 'cooler'] },
  { word: 'umbrella', definition: 'A device consisting of a circular canopy of cloth on a folding metal frame supported by a central rod, used as protection against rain or sun.', synonyms: ['parasol', 'brolly'] },
  { word: 'wallet', definition: 'A pocket-sized, flat folding case for holding money, credit cards, and personal papers.', synonyms: ['billfold', 'purse'] },
  { word: 'keyboard', definition: 'A panel of keys that operates a computer or typewriter.', synonyms: ['keypad', 'board'] },
  { word: 'mirror', definition: 'A reflective surface, typically of glass coated with a metal amalgam, that reflects a clear image.', synonyms: ['looking-glass', 'reflector'] },
  { word: 'backpack', definition: 'A bag with shoulder straps that allow it to be carried on someone\'s back, typically made of canvas or nylon.', synonyms: ['rucksack', 'knapsack'] },
  { word: 'toothbrush', definition: 'A small brush with a long handle, used for cleaning the teeth.', synonyms: ['brush', 'dental-brush'] },
  { word: 'key', definition: 'A small piece of shaped metal with incisions cut to fit the wards of a particular lock, which is inserted and turned to open or close it.', synonyms: ['opener', 'latchkey'] },
  { word: 'pillow', definition: 'A rectangular cloth bag stuffed with feathers, foam rubber, or other soft materials, used to support the head when lying down.', synonyms: ['cushion', 'bolster'] },
  { word: 'mug', definition: 'A large cup, typically cylindrical with a handle and used without a saucer, for hot beverages.', synonyms: ['cup', 'beaker'] },
  { word: 'clock', definition: 'A mechanical or electrical device for measuring and showing time, not worn on the person.', synonyms: ['timepiece', 'chronometer'] },
  { word: 'scissors', definition: 'An instrument used for cutting cloth, paper, and other thin material, consisting of two blades pivoted together.', synonyms: ['shears', 'clippers'] },
  { word: 'blanket', definition: 'A large piece of woolen or similar material used as a bed covering or other warmth provider.', synonyms: ['coverlet', 'quilt'] },
  { word: 'calendar', definition: 'A chart or series of pages showing the days, weeks, and months of a particular year.', synonyms: ['almanac', 'schedule'] },
  { word: 'soap', definition: 'A substance used with water for washing and cleaning, made of natural oils or fats treated with an alkaline.', synonyms: ['cleanser', 'detergent'] },
  { word: 'lamp', definition: 'A device for giving light, either one having an electric bulb or a wire giving off heat.', synonyms: ['light', 'lantern'] },
  { word: 'notebook', definition: 'A book with blank or ruled pages for recording notes or memoranda.', synonyms: ['notepad', 'journal'] },
  { word: 'stapler', definition: 'A device for fastening sheets of paper together with a wire fastener.', synonyms: ['paper-fastener', 'binder'] },
  { word: 'towel', definition: 'A piece of thick absorbent cloth or paper used for drying oneself or wiping things dry.', synonyms: ['wipe', 'cloth'] },
  { word: 'headphones', definition: 'A pair of earphones joined by a band placed over the head, for listening to audio privately.', synonyms: ['earphones', 'headset'] },
  { word: 'hammer', definition: 'A tool with a heavy metal head mounted at right angles at the end of a handle, used for pounding nails.', synonyms: ['mallet', 'gavel'] },
  { word: 'glasses', definition: 'A pair of lenses set in a frame resting on the nose and ears, used to correct or assist defective eyesight.', synonyms: ['spectacles', 'eyewear'] },
  { word: 'sponge', definition: 'A piece of a light, porous, absorbent substance used in washing, cleaning, or padding.', synonyms: ['scrubber', 'pad'] },
  { word: 'pen', definition: 'An instrument for writing or drawing with ink, typically consisting of a metal nib or ball point.', synonyms: ['marker', 'quill'] },
  { word: 'plate', definition: 'A flat, dish, typically circular, from which food is eaten or served.', synonyms: ['dish', 'platter'] },
  { word: 'remote', definition: 'A handheld device used to control an electronic appliance from a distance.', synonyms: ['clicker', 'controller'] },
  { word: 'socks', definition: 'Garments for the foot and lower part of the leg, typically knitted from wool, cotton, or nylon.', synonyms: ['hosiery', 'stockings'] },
  { word: 'candle', definition: 'A cylinder or block of wax or other fatty substance with an embedded wick that is burned to provide light.', synonyms: ['taper', 'bougie'] },
  { word: 'toaster', definition: 'An electrical appliance for making toast from slices of bread.', synonyms: ['bread-toaster', 'warmer'] },
  { word: 'curtain', definition: 'A piece of material suspended as a screen at a window or door to shut out the light.', synonyms: ['drape', 'screen'] },
  { word: 'broom', definition: 'A brush with a long handle, used for sweeping floors.', synonyms: ['sweeper', 'besom'] },
  { word: 'kettle', definition: 'A container or device in which water is boiled, having a lid, spout, and handle.', synonyms: ['teapot', 'boiler'] },
  { word: 'spoon', definition: 'An implement consisting of a small, shallow oval or round bowl on a long handle, used for eating or stirring.', synonyms: ['utensil', 'ladle'] },
  { word: 'chair', definition: 'A separate seat for one person, typically with four legs and a back.', synonyms: ['stool', 'seat'] },
  { word: 'shoes', definition: 'Coverings for the feet, typically made of leather or plastic, having a sturdy sole.', synonyms: ['footwear', 'sneakers'] },
  { word: 'napkin', definition: 'A square piece of cloth or paper used at a meal to wipe the fingers or lips and to protect garments.', synonyms: ['serviette', 'wipe'] },
  { word: 'charger', definition: 'A device for charging a battery or battery-powered equipment from a main electrical supply.', synonyms: ['adapter', 'power-cord'] },
  { word: 'comb', definition: 'A strip of plastic or other material with a row of narrow teeth, used for detangling or arranging the hair.', synonyms: ['brush', 'styler'] },
  { word: 'bottle', definition: 'A container, typically made of glass or plastic, with a narrow neck, used for storing liquids.', synonyms: ['flask', 'jug'] },
  { word: 'pillowcase', definition: 'A removable cloth cover for a pillow.', synonyms: ['pillow-slip', 'casing'] },
  { word: 'bucket', definition: 'A roughly cylindrical open container with a handle, made of plastic or metal, used to hold and carry liquids.', synonyms: ['pail', 'can'] },
  { word: 'tissue', definition: 'A piece of soft, absorbent disposable paper used as a handkerchief.', synonyms: ['kleenex', 'wipe'] },
  { word: 'tweezers', definition: 'A small instrument like a pair of pincers for plucking out hairs or picking up small objects.', synonyms: ['pincers', 'tongs'] },
  { word: 'calculator', definition: 'A small electronic device used for making mathematical calculations.', synonyms: ['computer', 'adding-machine'] },
  { word: 'pencil', definition: 'An instrument for writing or drawing, consisting of a thin stick of graphite or a similar substance enclosed in a long wooden cylinder.', synonyms: ['graphite', 'crayon'] },
  { word: 'coaster', definition: 'A small mat or tray placed under a bottle or glass to protect the surface of a table.', synonyms: ['mat', 'pad'] },
  { word: 'flashlight', definition: 'A small portable electric lamp powered by batteries.', synonyms: ['torch', 'lantern'] },
  { word: 'scissors', definition: 'An edge tool having two opposed blades pivoted together so that the handles can be brought toward each other.', synonyms: ['shears', 'snips'] },
  { word: 'rug', definition: 'A floor covering of thick woven material or animal skin, typically not extending over the entire floor.', synonyms: ['carpet', 'mat'] },
  { word: 'fan', definition: 'An apparatus with rotating blades that creates a current of air for cooling or ventilation.', synonyms: ['ventilator', 'blower'] },

  // Brainrot
  { word: 'skibidi', definition: 'A versatile slang term used to describe something as cool, bad, or interesting, popularized by a viral YouTube series.', synonyms: ['cool', 'dope'] },
  { word: 'rizz', definition: 'The ability to charm or flirt with someone successfully; abbreviated from charisma.', synonyms: ['game', 'charm'] },
  { word: 'gyatt', definition: 'An exclamation of surprise, excitement, or shock, often used when encountering an attractive person.', synonyms: ['wow', 'damn'] },
  { word: 'sigma', definition: 'A popular internet archetype describing a successful, independent, and self-reliant lone wolf.', synonyms: ['maverick', 'independent'] },
  { word: 'fanum-tax', definition: 'The act of jokingly stealing a portion of a friend\'s food, popularized by online streamers.', synonyms: ['food-theft', 'taxing'] },
  { word: 'delulu', definition: 'A slang term derived from delusional, used to describe someone with unrealistic or overly optimistic expectations.', synonyms: ['idealistic', 'unrealistic'] },
  { word: 'mewing', definition: 'A facial exercise involving flattening the tongue against the roof of the mouth, done to define the jawline in photos or videos.', synonyms: ['jaw-toning', 'shaping'] },
  { word: 'looksmaxxing', definition: 'The practice of attempting to maximize one\'s physical attractiveness through grooming, fitness, and style.', synonyms: ['self-improvement', 'glow-up'] },
  { word: 'grifter', definition: 'In internet culture, a content creator who fakes beliefs, political stances, or expertise purely for financial gain or views.', synonyms: ['fraud', 'con-artist'] },
  { word: 'slay', definition: 'To do something exceptionally well, look incredibly stylish, or succeed spectacularly.', synonyms: ['kill-it', 'excel'] },
  { word: 'clout', definition: 'Influence, fame, or social standing on digital platforms, often pursued aggressively.', synonyms: ['fame', 'leverage'] },
  { word: 'doomscrolling', definition: 'The act of obsessively scrolling through social media feeds to read negative or distressing news.', synonyms: ['rage-scrolling', 'over-consuming'] },
  { word: 'noob', definition: 'A slang term for a newcomer or inexperienced person in a video game, community, or technical field.', synonyms: ['rookie', 'novice'] },
  { word: 'gatekeep', definition: 'The act of withholding information or access to a subculture, hobby, or interest to keep it exclusive.', synonyms: ['withhold', 'restrict'] },
  { word: 'sus', definition: 'A shortened version of suspicious or suspect, indicating that someone or something is untrustworthy.', synonyms: ['shady', 'sketchy'] },
  { word: 'ghosting', definition: 'The practice of suddenly ending all communication with someone without any explanation.', synonyms: ['vanishing', 'ignoring'] },
  { word: 'cringe', definition: 'An intense feeling of embarrassment or awkwardness triggered by someone else\'s actions or content.', synonyms: ['secondhand-embarrassment', 'awkward'] },
  { word: 'glowup', definition: 'A dramatic, positive transformation in physical appearance, confidence, or personal life style.', synonyms: ['makeover', 'transformation'] },
  { word: 'stan', definition: 'An overzealous, obsessive, or intensely loyal fan of a particular celebrity, show, or brand.', synonyms: ['mega-fan', 'devotee'] },
  { word: 'ratio', definition: 'A phenomenon on social media where a reply to a post receives significantly more engagement or likes than the original post, signaling disagreement.', synonyms: ['outvote', 'bested'] },
  { word: 'mid', definition: 'Used to describe something that is thoroughly mediocre, uninspiring, or average.', synonyms: ['mediocre', 'subpar'] },
  { word: 'tea', definition: 'Gossip, hot news, or personal drama that is shared between friends online.', synonyms: ['gossip', 'scoop'] },
  { word: 'flex', definition: 'An act of boasting or showing off one\'s wealth, status, or achievements.', synonyms: ['brag', 'boast'] },
  { word: 'cancelled', definition: 'The collective public rejection of a celebrity or influencer following offensive behavior or controversial statements.', synonyms: ['boycotted', 'shunned'] },
  { word: 'vibe', definition: 'A casual assessment of a person\'s current emotional state, energy, or the general mood of a situation.', synonyms: ['mood', 'evaluation'] }
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

/**
 * Returns true if the given guess matches the entry's word or any of its
 * synonyms (case-insensitive, trimmed). Used by the game to accept synonyms
 * as correct answers.
 */
export function isAcceptedAnswer(guess: string, word: string, synonyms: string[] = []): boolean {
  const g = guess.trim().toLowerCase();
  if (!g) return false;
  if (g === word.trim().toLowerCase()) return true;
  return synonyms.some(s => s.trim().toLowerCase() === g);
}
