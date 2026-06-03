// =================== PROGRAM (5-Day Glute Focus) ===================
// Adaptat dintr-un program Glute-Focused 5-day pentru începătoare la 45kg
// Hip thrust pe FIECARE zi de lower (3x/săpt frecvență)
const PROGRAM = {
  lower_a: {
    name: 'LOWER A',
    focus: 'Glute + Quad — Hip Thrust King',
    exercises: [
      { id: 'glute_act_kickback', name: 'Glute Activation — Cable Kickback', target: '2×15/picior (warmup)', defaultUnit: 'total', note: 'OBLIGATORIU înainte de orice. 5-8 kg pe cablu. Squeeze 2s la vârf. Trezește glute-ul „dormit".' },
      { id: 'hip_thrust_a', name: 'Hip Thrust (bară pe sold)', target: '1W+4×12-15', defaultUnit: 'total', note: 'Exercițiu #1 glute. Bară 20kg gol pentru început. Chin spre piept. Squeeze MAXIM 2s sus.' },
      { id: 'goblet_squat', name: 'Goblet Squat', target: '3×12-15', defaultUnit: 'db', note: 'Ganteră la piept (8-14 kg). Torso vertical, genunchii peste degete, drive din călcâie. Profund.' },
      { id: 'bulgarian_split', name: 'Bulgarian Split Squat', target: '3×10-12/picior', defaultUnit: 'db', note: 'PAS LUNG = glute focus. 4-8 kg/db. Stretch pe hip flexor. Control total pe coborâre.' },
      { id: 'cable_pull_through_a', name: 'Cable Pull-Through', target: '3×12-15', defaultUnit: 'total', note: 'Hip hinge pur (18-25 kg). Glute squeeze 2s la vârf. Spate DREPT, NU rotunjit.' },
      { id: 'calf_raise_a', name: 'Standing Calf Raises', target: '3×15-20', defaultUnit: 'db', note: 'Gantere în mâini (6-10 kg/db). Pe o treaptă. Stretch jos, squeeze sus. Tempo lent.' }
    ]
  },
  upper_core: {
    name: 'UPPER + CORE',
    focus: 'Tonifiere Upper + Abdomen',
    exercises: [
      { id: 'lat_pulldown', name: 'Cable Lat Pulldown', target: '3×12-15', defaultUnit: 'total', note: '18-25 kg, grip mediu. Spate tonifiat (V-taper). Trage spre piept. Omoplații jos și înapoi.' },
      { id: 'chest_fly', name: 'Cable Chest Fly', target: '3×12-15', defaultUnit: 'db', note: '5-10 kg/parte scripete (folosește unit DB EA — totalul se calculează automat). Squeeze la centru 2s.' },
      { id: 'face_pulls', name: 'Cable Face Pulls', target: '3×15-20', defaultUnit: 'total', note: '8-14 kg, frânghie scripete sus. Postură perfectă + rear delts. Rotație externă la vârf.' },
      { id: 'lat_raise', name: 'Lateral Raises DB', target: '3×12-15', defaultUnit: 'db', note: '2-4 kg/db DOAR. Greutate MICĂ, formă perfectă. Pauză 1s sus. Umeri rotunzi feminin.' },
      { id: 'cable_crunch_uc', name: 'Cable Crunch', target: '3×15-20', defaultUnit: 'total', note: '14-20 kg, în genunchi. Flexie coloană (NU de la șold). Abs superior. Squeeze.' },
      { id: 'knee_raises_uc', name: 'Hanging Knee Raises', target: '3×12-15', defaultUnit: 'total', note: 'BW, bară pull-up. Abs inferior. Control pe coborâre. Lying leg raises dacă e greu.' },
      { id: 'pallof_uc', name: 'Pallof Press', target: '3×10-12/parte', defaultUnit: 'total', note: '5-10 kg pe cablu, o mână. Anti-rotație. Talie definită. Core stability profundă.' }
    ]
  },
  lower_b: {
    name: 'LOWER B',
    focus: 'Glute + Hamstring — Hip Hinge',
    exercises: [
      { id: 'glute_act_bridge', name: 'Glute Activation — Glute Bridge', target: '2×20 (warmup)', defaultUnit: 'total', note: 'BW (sau cu bandă). Squeeze MAXIM sus 3s. Lent și controlat. Trezește glute-ul.' },
      { id: 'rdl_db', name: 'Romanian Deadlift DB', target: '1W+4×10-12', defaultUnit: 'db', note: 'Gantere (8-14 kg/db). Spate DREPT mereu. Stretch pe hamstrings. Împinge șoldul ÎNAPOI.' },
      { id: 'hip_thrust_b', name: 'Hip Thrust', target: '4×12-15', defaultUnit: 'total', note: 'Bară 20kg (sau ganteră 14-20 kg pe sold). Chin jos. Squeeze MAXIM 2s. NU hiper-extinde.' },
      { id: 'walking_lunges', name: 'Walking Lunges (PAS LUNG)', target: '3×12/picior', defaultUnit: 'db', note: '4-8 kg/db. PAS LUNG = glute. Pas scurt = quad. Aici vrem LUNG. Control fiecare pas.' },
      { id: 'cable_kickback_b', name: 'Cable Kickback', target: '3×12-15/picior', defaultUnit: 'total', note: '8-14 kg pe cablu, glezniere. Izolare glute pură. Ușor lean forward. Squeeze 2s. NU balansa.' },
      { id: 'cable_leg_curl', name: 'Cable Leg Curl', target: '3×12-15', defaultUnit: 'total', note: '10-16 kg. Glezniere + culcat pe bancă cu fața în jos. Flexie genunchi = hamstrings.' },
      { id: 'calf_raise_b', name: 'Calf Raises', target: '3×15-20', defaultUnit: 'db', note: '6-10 kg/db, pe treaptă. Full stretch, full squeeze. Tempo lent.' }
    ]
  },
  lower_c: {
    name: 'LOWER C',
    focus: 'Glute Pump + Full Legs + Core',
    exercises: [
      { id: 'glute_act_frog', name: 'Glute Activation — Frog Pumps', target: '2×20 (warmup)', defaultUnit: 'total', note: 'BW. Tălpile lipite, genunchii în exterior. Squeeze glute maxim. Activare profundă.' },
      { id: 'sumo_goblet', name: 'Sumo Goblet Squat', target: '4×15', defaultUnit: 'db', note: '10-16 kg. Stance LARG, degete ușor afară. Glute + adductori. Squat profund. Squeeze sus.' },
      { id: 'sl_hip_thrust', name: 'Single Leg Hip Thrust', target: '3×12-15/picior', defaultUnit: 'total', note: 'BW sau 5-10 kg ganteră pe sold. Unilateral = dublu intens. Corectează dezechilibre. Control.' },
      { id: 'cable_kickback_c', name: 'Cable Kickback (Volume)', target: '4×15/picior', defaultUnit: 'total', note: '8-12 kg pe cablu. VOLUME mare. Reps ridicate. Pump maxim. Squeeze 1s fiecare rep.' },
      { id: 'cable_pull_through_c', name: 'Cable Pull-Through (high-rep)', target: '3×15-20', defaultUnit: 'total', note: '18-25 kg. High reps, pump metabolic. Glute squeeze la vârf. Nu grăbi.' },
      { id: 'reverse_lunge', name: 'Reverse Lunges (deficit)', target: '3×12/picior', defaultUnit: 'db', note: '4-8 kg/db. De pe step/disc = stretch mai mare. Pas înapoi, control pe coborâre.' },
      { id: 'cable_crunch_c', name: 'Cable Crunch', target: '3×15-20', defaultUnit: 'total', note: '14-20 kg. Abs superior. Flexie coloană. Squeeze.' },
      { id: 'woodchops_c', name: 'Cable Woodchops', target: '3×12/parte', defaultUnit: 'total', note: '10-14 kg pe cablu sus. Oblici. Rotație controlată. Talie definită.' }
    ]
  },
  core_mobility: {
    name: 'CORE + MOBILITY',
    focus: 'Abdomen + Stretching + Recovery',
    exercises: [
      { id: 'cable_crunch_mob', name: 'Cable Crunch', target: '3×15-20', defaultUnit: 'total', note: '14-22 kg. Abs superior. Flexie coloană controlată. Squeeze la contracție.' },
      { id: 'knee_raises_mob', name: 'Hanging Knee Raises', target: '3×12-15', defaultUnit: 'total', note: 'BW. Abs inferior. Control 3s coborâre. Fără swing.' },
      { id: 'woodchops_mob', name: 'Cable Woodchops', target: '3×12/parte', defaultUnit: 'total', note: '10-14 kg pe cablu. Oblici. Rotație controlată. Talie.' },
      { id: 'pallof_mob', name: 'Pallof Press', target: '3×10-12/parte', defaultUnit: 'total', note: '5-10 kg pe cablu. Anti-rotație. Core stability profundă.' },
      { id: 'plank_mob', name: 'Plank (pe coate)', target: '3×30-45s', defaultUnit: 'total', note: 'BW. Core complet. NU lăsa șoldul să cadă. Squeeze abs + glute.' },
      { id: 'dead_hangs_mob', name: 'Dead Hangs', target: '3×20-30s', defaultUnit: 'total', note: 'BW, bară pull-up. Decompresie coloană. Relaxare după săptămână intensă.' },
      { id: 'stretching_mob', name: 'Stretching Complet', target: '15-20 min', defaultUnit: 'total', note: 'Hip flexors 30s/parte, Pigeon pose 30s/parte, Hamstring stretch, Quad stretch, Cat-Cow, Child pose 60s.' }
    ]
  },
  rest: {
    name: 'REST',
    focus: 'Recovery Activ — Walk + Hydrate',
    exercises: [
      { id: 'rest_walk', name: 'Plimbare Ușoară', target: '20-30 min', defaultUnit: 'total', note: 'HR sub 120. Aer curat. Fără telefon. Reset mental și fizic.' },
      { id: 'rest_hydrate', name: 'Hidratare', target: '2-3L apă', defaultUnit: 'total', note: 'Bea apă pe parcursul zilei. Cu electroliți dacă ai antrenat ieri.' },
      { id: 'rest_stretch', name: 'Stretching Ușor', target: '10-15 min', defaultUnit: 'total', note: 'Focus zone tensionate. Fără forțare. Respirație profundă.' },
      { id: 'rest_skincare', name: 'Self-Care Ritual', target: '15-20 min', defaultUnit: 'total', note: 'Mască + skincare complet + 10 min lectură. Recovery mental.' }
    ]
  }
};

// Structura săptămânală: L=A, M=Upper, Mi=B, J=REST, V=C, S=Core+Mob, D=REST
const DAY_ORDER = ['lower_a', 'upper_core', 'lower_b', 'lower_c', 'core_mobility', 'rest'];

// =================== BONUS MISSIONS POOL ===================
// Mai blânde pentru începătoare (2 luni gym). FĂRĂ duș rece / cold exposure.
// rarity multiplier: common×1, rare×3, legendary×6
const BONUS_MISSION_POOL = [
  // ─── STR · fizic ușor & beginner-friendly ───
  { id: 'walk_10',         title: 'Plimbare 10 min',          desc: '10 minute de mers afară, fără telefon în mână.',                                xp: 25, rarity: 'common',    stat: 'STR' },
  { id: 'stretch_15',      title: 'Stretching 15 min',        desc: '15 minute stretching, focus glute & hamstrings.',                               xp: 25, rarity: 'common',    stat: 'STR' },
  { id: 'yoga_20',         title: 'Yoga 20 min',              desc: 'Sesiune yoga ușoară, flow continuu, respirație controlată.',                     xp: 30, rarity: 'common',    stat: 'STR' },
  { id: 'squats_50_bw',    title: '50 Genoflexiuni BW',       desc: '50 genoflexiuni cu greutatea corpului, profund, pe parcursul zilei.',            xp: 25, rarity: 'common',    stat: 'STR' },
  { id: 'glute_bridge_50', title: '50 Glute Bridges',         desc: '50 glute bridges cu squeeze 2s la vârf, pe parcursul zilei.',                    xp: 25, rarity: 'common',    stat: 'STR' },
  { id: 'dance_15',        title: 'Dans 15 min',              desc: '15 minute de dans pe muzica preferată. Just have fun.',                          xp: 25, rarity: 'common',    stat: 'STR' },
  { id: 'steps_8k',        title: '8.000 Pași',               desc: 'Acumulează 8.000 pași astăzi.',                                                 xp: 30, rarity: 'common',    stat: 'STR' },
  { id: 'pushup_mod_20',   title: '20 Flotări (de pe genunchi)', desc:'20 flotări de pe genunchi sau înclinate pe canapea/perete.',                   xp: 30, rarity: 'common',    stat: 'STR' },
  { id: 'cycling_30',      title: 'Bicicletă 30 min',         desc: 'Pedalează 30 minute (în oraș sau staționară).',                                  xp: 35, rarity: 'common',    stat: 'STR' },
  { id: 'kickback_100_bw', title: '100 Kickbacks BW',         desc: '100 cable kickbacks fără greutate pe parcursul zilei. Squeeze fiecare.',         xp: 30, rarity: 'common',    stat: 'STR' },
  { id: 'yoga_45',         title: 'Yoga 45 min',              desc: 'Sesiune yoga completă 45 minute. Mai profundă.',                                 xp: 50, rarity: 'rare',      stat: 'STR' },
  { id: 'plank_3min',      title: 'Plank Total 3 min',        desc: 'Acumulează 3 minute de plank total (oricâte serii).',                            xp: 50, rarity: 'rare',      stat: 'STR' },
  { id: 'hike_60',         title: 'Plimbare 1h Natură',       desc: '1 oră de plimbare în natură (parc, pădure). Fără ecran.',                        xp: 55, rarity: 'rare',      stat: 'STR' },
  { id: 'glute_burnout',   title: 'Glute Burnout BW',         desc: '100 glute bridges + 100 kickbacks pe parcursul zilei. Pump acasă.',              xp: 60, rarity: 'rare',      stat: 'STR' },
  { id: 'run_3k',          title: 'Aleargă 3 km',             desc: 'Aleargă 3 km, oricare ar fi ritmul.',                                            xp: 60, rarity: 'rare',      stat: 'STR' },
  { id: 'workout_bonus',   title: 'Mini Workout Acasă',       desc: '30 min antrenament glute BW extra (peste programul zilei).',                     xp: 90, rarity: 'legendary', stat: 'STR' },
  { id: 'steps_15k',       title: '15.000 Pași',              desc: 'Atinge 15.000 pași într-o singură zi.',                                          xp: 90, rarity: 'legendary', stat: 'STR' },
  { id: 'yoga_90',         title: 'Yoga 90 min Complet',      desc: 'Sesiune yoga 90 minute. Flow + flexibilitate completă.',                         xp: 100,rarity: 'legendary', stat: 'STR' },

  // ─── END · rezistență (fără cold!) ───
  { id: 'water_2l',        title: 'Hidratare 2L',             desc: 'Bea minim 2 litri de apă astăzi.',                                              xp: 25, rarity: 'common',    stat: 'END' },
  { id: 'water_3l',        title: 'Hidratare 3L',             desc: 'Bea 3 litri de apă astăzi.',                                                    xp: 35, rarity: 'common',    stat: 'END' },
  { id: 'sleep_8h',        title: 'Somn 8h+',                 desc: 'Dormi minim 8 ore. Fără ecran 30 min înainte.',                                  xp: 30, rarity: 'common',    stat: 'END' },
  { id: 'breathing_box',   title: 'Respirație Box 10 min',    desc: '10 min respirație 4-4-4-4. Calm și echilibru. Fără cold.',                       xp: 30, rarity: 'common',    stat: 'END' },
  { id: 'protein_4meals',  title: '4 Mese cu Proteine',       desc: 'Minim 20g proteine în 4 mese astăzi. Critic pentru glute growth.',               xp: 35, rarity: 'common',    stat: 'END' },
  { id: 'fast_12h',        title: 'Post 12h (overnight)',     desc: 'Post intermitent 12 ore — practic peste noapte.',                                xp: 25, rarity: 'common',    stat: 'END' },
  { id: 'morning_water',   title: 'Apă la Trezire',           desc: '500 ml apă în primele 10 min după trezire.',                                     xp: 20, rarity: 'common',    stat: 'END' },
  { id: 'sleep_9h',        title: 'Somn 9h+',                 desc: 'Dormi minim 9 ore. Recovery prețios pentru creștere musculară.',                 xp: 50, rarity: 'rare',      stat: 'END' },
  { id: 'no_processed',    title: 'Zi Fără Procesat',         desc: 'Toată ziua fără mâncare procesată. Doar real food.',                             xp: 50, rarity: 'rare',      stat: 'END' },
  { id: 'fast_14h',        title: 'Post 14h',                 desc: 'Post intermitent 14 ore.',                                                       xp: 55, rarity: 'rare',      stat: 'END' },
  { id: 'sauna_20',        title: 'Saună 20 min',             desc: '20 minute saună sau cameră cu aburi.',                                           xp: 45, rarity: 'rare',      stat: 'END' },
  { id: 'workout_fasted',  title: 'Antrenament în Post',      desc: 'Antrenament dimineața pe stomacul gol (după 12h+ post).',                        xp: 60, rarity: 'rare',      stat: 'END' },
  { id: 'spa_day',         title: 'Zi de Spa',                desc: 'Mască + skincare complet + baie relaxantă (45+ min). Self-love.',                xp: 80, rarity: 'legendary', stat: 'END' },
  { id: 'full_reset',      title: 'Reset Total 24h',          desc: 'Real food + 3L apă + 9h somn + plimbare + skincare. Zi perfectă recovery.',      xp: 110,rarity: 'legendary', stat: 'END' },

  // ─── MND · mental & spiritual ───
  { id: 'read_15',         title: '15 min Lectură',           desc: 'Citește 15 minute. Carte fizică sau e-reader, NU social.',                       xp: 25, rarity: 'common',    stat: 'MND' },
  { id: 'meditation_10',   title: 'Meditație 10 min',         desc: '10 minute meditație. Respirație calmă, ochii închiși.',                          xp: 30, rarity: 'common',    stat: 'MND' },
  { id: 'journal_5',       title: 'Journal 5 min',            desc: '5 minute scriere liberă despre cum te simți.',                                   xp: 25, rarity: 'common',    stat: 'MND' },
  { id: 'gratitude_3',     title: '3 Lucruri Recunoștință',   desc: 'Scrie 3 lucruri specifice pentru care ești recunoscătoare astăzi.',              xp: 20, rarity: 'common',    stat: 'MND' },
  { id: 'compliment_3',    title: '3 Complimente',            desc: 'Oferă 3 complimente sincere (inclusiv unul ție în oglindă).',                    xp: 25, rarity: 'common',    stat: 'MND' },
  { id: 'help_someone',    title: 'Ajută pe Cineva',          desc: 'Fă o faptă bună mică pentru cineva, fără să o spui nimănui.',                    xp: 30, rarity: 'common',    stat: 'MND' },
  { id: 'tomorrow_plan',   title: 'Planifică Mâine',          desc: 'Scrie 3 obiective concrete pentru mâine, în ordinea priorității.',               xp: 25, rarity: 'common',    stat: 'MND' },
  { id: 'learn_15',        title: 'Învață Ceva Nou',          desc: '15 minute învățare deliberată dintr-un skill nou.',                              xp: 30, rarity: 'common',    stat: 'MND' },
  { id: 'call_family',     title: 'Sună un Părinte',          desc: 'Sună mama, tata, bunica. 10+ minute. Întreabă-i cum sunt.',                     xp: 35, rarity: 'common',    stat: 'MND' },
  { id: 'silent_meal',     title: 'Masa în Liniște',          desc: 'O masă completă în liniște. Fără ecran, fără muzică. Mâncare conștientă.',       xp: 30, rarity: 'common',    stat: 'MND' },
  { id: 'art_create',      title: 'Creează Ceva 20 min',      desc: '20 min creație: desen, scris, gătit, dans, muzică. Just create.',                xp: 30, rarity: 'common',    stat: 'MND' },
  { id: 'skincare_full',   title: 'Skincare Complet',         desc: 'Rutină skincare completă AM + PM. Self-care real, nu rushed.',                   xp: 25, rarity: 'common',    stat: 'MND' },
  { id: 'nature_observe',  title: 'Observă Natura 15 min',    desc: '15 min observă natura fără telefon. Doar prezență. Doar respirație.',            xp: 30, rarity: 'common',    stat: 'MND' },
  { id: 'visualization',   title: 'Vizualizare Obiective',    desc: '10 min vizualizează viu cum arată viața ta cu obiectivele atinse.',              xp: 30, rarity: 'common',    stat: 'MND' },
  { id: 'self_love_letter',title: 'Scrisoare către Tine',     desc: 'Scrie o scrisoare scurtă către tine peste 1 an. Cum te vrei să arăți.',          xp: 45, rarity: 'rare',      stat: 'MND' },
  { id: 'meditation_20',   title: 'Meditație 20 min',         desc: 'Meditație profundă 20 minute neîntrerupt.',                                      xp: 50, rarity: 'rare',      stat: 'MND' },
  { id: 'book_60',         title: '1h Lectură Carte',         desc: '60 minute lectură continuă, fără pauze de telefon.',                             xp: 55, rarity: 'rare',      stat: 'MND' },
  { id: 'forgive',         title: 'Iartă Sincer',             desc: 'Iartă în sufletul tău pe cineva care te-a rănit. Lasă să plece.',                xp: 70, rarity: 'rare',      stat: 'MND' },
  { id: 'mirror_work',     title: 'Mirror Work 10 min',       desc: '10 min în oglindă, vorbește cu tine ca cu cea mai bună prietenă.',               xp: 50, rarity: 'rare',      stat: 'MND' },
  { id: 'book_finish',     title: 'Termină o Carte',          desc: 'Termină o carte pe care o citeai. Marchează finalul.',                           xp: 100,rarity: 'legendary', stat: 'MND' },
  { id: 'creative_2h',     title: '2h Creativitate Continuă', desc: '2h muncă creativă continuă (artă, scris, design). Fără distrageri.',             xp: 100,rarity: 'legendary', stat: 'MND' },

  // ─── WIL · voință (fără cold-related, mai blândă) ───
  { id: 'no_phone_morning',title: 'Prima Oră fără Telefon',   desc: 'Prima oră după trezire — zero ecrane. Doar tu și ziua.',                         xp: 30, rarity: 'common',    stat: 'WIL' },
  { id: 'no_food_8pm',     title: 'Fără Mâncare după 20:00',  desc: 'După 20:00 doar apă sau ceai. Lasă digestia să se odihnească.',                  xp: 30, rarity: 'common',    stat: 'WIL' },
  { id: 'evening_routine', title: 'Rutină de Seară 20 min',   desc: '20 min înainte de somn: skincare + carte + apă + fără ecran. Decompresie reală.', xp: 30, rarity: 'common',    stat: 'WIL' },
  { id: 'no_snacking',     title: 'Fără Gustări Procesate',   desc: 'Toată ziua fără gustări procesate. Doar fructe, nuci, iaurt.',                   xp: 30, rarity: 'common',    stat: 'WIL' },
  { id: 'no_social_morning',title:'Fără Social până la 12:00',desc: 'Zero rețele sociale înainte de prânz. Liniște dimineața.',                       xp: 35, rarity: 'common',    stat: 'WIL' },
  { id: 'silent_hour',     title: '1h Liniște Absolută',      desc: '1 oră în liniște. Fără muzică, voci, ecrane. Doar tu.',                          xp: 35, rarity: 'common',    stat: 'WIL' },
  { id: 'no_mirror_critic',title: '24h Fără Auto-Critică',    desc: 'Toată ziua, când te vezi în oglindă, doar lucruri pozitive.',                    xp: 35, rarity: 'common',    stat: 'WIL' },
  { id: 'screen_free_pm',  title: '2h fără Ecran Seara',      desc: 'Ultimele 2 ore înainte de culcare — zero ecrane.',                               xp: 35, rarity: 'common',    stat: 'WIL' },
  { id: 'no_sugar',        title: 'Zero Zahăr Adăugat',       desc: 'Toată ziua fără zahăr adăugat. Citește etichetele.',                             xp: 45, rarity: 'rare',      stat: 'WIL' },
  { id: 'no_phone_2h',     title: 'No Phone 2h',              desc: '2h consecutive fără telefon. Pune-l în altă cameră.',                            xp: 50, rarity: 'rare',      stat: 'WIL' },
  { id: 'wake_7am',        title: 'Trezire înainte de 7 AM',  desc: 'Sari din pat înainte de 7 dimineața. Fără snooze.',                              xp: 45, rarity: 'rare',      stat: 'WIL' },
  { id: 'wake_6am',        title: 'Trezire înainte de 6 AM',  desc: 'Sari din pat înainte de 6 dimineața. Disciplină reală.',                         xp: 65, rarity: 'rare',      stat: 'WIL' },
  { id: 'no_complaining',  title: '24h Fără Plângeri',        desc: 'Toată ziua fără să te plângi (voce, scris, gând).',                              xp: 60, rarity: 'rare',      stat: 'WIL' },
  { id: 'single_task',     title: '90 min Mono-Task',         desc: '90 minute pe O singură sarcină. Fără switch. Fără notificări.',                  xp: 55, rarity: 'rare',      stat: 'WIL' },
  { id: 'no_social_24h',   title: 'No Social Media 24h',      desc: 'Zero rețele sociale 24 ore complete. Detox real.',                               xp: 90, rarity: 'legendary', stat: 'WIL' },
  { id: 'clean_day_24h',   title: 'Zi Curată Total',          desc: 'Zero zahăr + zero procesate + zero alcool 24h. Body reset.',                     xp: 95, rarity: 'legendary', stat: 'WIL' },
  { id: 'no_negative_24h', title: '24h Fără Negativitate',    desc: 'Zero gânduri/cuvinte negative despre tine sau alții 24 ore.',                    xp: 100,rarity: 'legendary', stat: 'WIL' }
];

// =================== BOSS DAY MISSIONS ===================
// 5x XP per boss (250 XP), apar joi/vineri/sâmbătă. Mai blânde decât versiunea masculină.
const BOSS_MISSIONS = [
  { id: 'boss_perfect_day',    title: 'Zi Perfectă',              desc: 'Completează TOATE misiunile principale, plus minim 2 bonusuri.' },
  { id: 'boss_pushup_50',      title: '50 Flotări (modified)',    desc: 'Acumulează 50 flotări de pe genunchi sau înclinate astăzi.' },
  { id: 'boss_squats_100',     title: '100 Genoflexiuni BW',      desc: 'Acumulează 100 genoflexiuni cu greutatea corpului pe parcursul zilei.' },
  { id: 'boss_glute_focus',    title: 'Glute Day Perfect',        desc: 'Antrenament complet cu squeeze MAXIM conștient la fiecare rep glute. Mind-muscle.' },
  { id: 'boss_run_3k',         title: 'Aleargă 3 km',             desc: 'Aleargă 3 km, oricare ar fi ritmul. Distanța contează.' },
  { id: 'boss_yoga_60',        title: 'Yoga 60 min Complet',      desc: 'Sesiune yoga completă 60 minute neîntrerupte.' },
  { id: 'boss_steps_15k',      title: '15.000 Pași',              desc: 'Atinge 15.000 pași într-o singură zi.' },
  { id: 'boss_no_social_24h',  title: '24h No Social Media',      desc: 'Zero rețele sociale 24 ore complete. Detox.' },
  { id: 'boss_meal_prep',      title: 'Meal Prep Săptămânal',     desc: 'Pregătește mesele sănătoase pentru toată săptămâna într-o singură sesiune.' },
  { id: 'boss_water_4l',       title: 'Hidratare 4L',             desc: 'Bea 4 litri de apă într-o singură zi.' },
  { id: 'boss_meditation_30',  title: 'Meditație 30 min',         desc: 'Meditează 30 minute neîntrerupt. Doar respirația.' },
  { id: 'boss_no_phone_4h',    title: '4h Fără Telefon',          desc: '4 ore consecutive fără telefon. Pune-l într-un sertar.' },
  { id: 'boss_creative_3h',    title: '3h Creativitate',          desc: '3 ore muncă creativă continuă (artă, scris, gătit, design).' },
  { id: 'boss_no_sugar',       title: '24h Zero Zahăr',           desc: 'Toată ziua fără zahăr adăugat. Citește toate etichetele.' },
  { id: 'boss_book_chapter',   title: 'Capitol Complet',          desc: 'Citește un capitol întreg dintr-o carte fără pauze.' },
  { id: 'boss_morning_routine',title: 'Rutină Matinală 60 min',   desc: 'Rutină matinală completă 60 min: stretching + skincare + journal + breakfast healthy.' },
  { id: 'boss_no_complaining', title: '24h Fără Plângeri',        desc: 'Toată ziua fără să te plângi în niciun fel.' },
  { id: 'boss_journal_long',   title: 'Journal Profund 30 min',   desc: '30 minute journaling profund. Tot ce simți, fără cenzură.' },
  { id: 'boss_call_friend',    title: 'Apel cu un Prieten',       desc: 'Sună un prieten cu care nu ai vorbit demult. 20+ minute conversație reală.' },
  { id: 'boss_self_care',      title: 'Zi de Self-Care',          desc: 'Skincare + bath + carte + muzică + somn 9h. Reset complet, nicio vinovăție.' },
  { id: 'boss_hip_thrust_pr',  title: 'Hip Thrust PR',            desc: 'Pe Lower day: crește greutatea hip thrust cu 2.5+ kg față de săptămâna trecută.' },
  { id: 'boss_no_negative',    title: '24h Doar Pozitiv',         desc: 'Zero gânduri/cuvinte negative despre tine sau corpul tău 24h.' }
];

// =================== ACHIEVEMENTS ===================
const ACHIEVEMENTS = {
  // ─── Începătoare / First steps ───
  first_blood:      { id: 'first_blood',      title: 'Prima Scânteie',    desc: 'Prima misiune completată vreodată',          icon: '✨', rarity: 'bronze' },
  untouchable:      { id: 'untouchable',      title: 'Shielded',          desc: 'Prima utilizare de shield',                  icon: '🛡',  rarity: 'bronze' },
  legendary_pull:   { id: 'legendary_pull',   title: 'Legendary Bloom',   desc: 'Prima misiune legendară completată',         icon: '💎', rarity: 'gold' },
  boss_slayer:      { id: 'boss_slayer',      title: 'Queen Slayer',      desc: 'Primul Boss Day câștigat',                   icon: '👑', rarity: 'gold' },

  // ─── Streak (zile consecutive perfecte) ───
  week_warrior:     { id: 'week_warrior',     title: 'Săptămâna Perfectă',desc: 'Prima săptămână cu toate misiunile zilnice', icon: '🌸', rarity: 'silver' },
  iron_will:        { id: 'iron_will',        title: 'Diamond Will',      desc: '30 zile streak consecutive',                 icon: '💎', rarity: 'silver' },
  streak_60:        { id: 'streak_60',        title: 'Two Months Glow',   desc: '60 zile streak consecutive',                 icon: '🌺', rarity: 'gold' },
  streak_100:       { id: 'streak_100',       title: 'Eternal Glow',      desc: '100 zile streak consecutive',                icon: '∞',  rarity: 'legendary' },

  // ─── Zile perfecte cumulative (nu consecutiv) ───
  perfect_7:        { id: 'perfect_7',        title: '7 Zile Perfecte',   desc: '7 zile perfecte cumulate',                   icon: '🍀', rarity: 'bronze' },
  perfect_30:       { id: 'perfect_30',       title: '30 Zile Perfecte',  desc: '30 zile perfecte cumulate',                  icon: '🎀', rarity: 'silver' },
  perfect_100:      { id: 'perfect_100',      title: 'Centurion Discipline', desc: '100 zile perfecte cumulate',              icon: '🏅', rarity: 'gold' },
  perfect_365:      { id: 'perfect_365',      title: 'An Perfect',        desc: '365 zile perfecte cumulate',                 icon: '🌟', rarity: 'legendary' },
  weekend_perfect:  { id: 'weekend_perfect',  title: 'Perfect Weekend',   desc: 'Sâmbătă + duminică ambele perfecte',         icon: '🎉', rarity: 'bronze' },

  // ─── XP total acumulat ───
  xp_1k:            { id: 'xp_1k',            title: '1K Total XP',       desc: '1.000 XP acumulate',                         icon: '💫', rarity: 'bronze' },
  xp_10k:           { id: 'xp_10k',           title: '10K Total XP',      desc: '10.000 XP acumulate',                        icon: '⭐', rarity: 'silver' },
  xp_50k:           { id: 'xp_50k',           title: '50K Total XP',      desc: '50.000 XP acumulate',                        icon: '🌟', rarity: 'gold' },
  xp_100k:          { id: 'xp_100k',          title: 'XP Goddess',        desc: '100.000 XP acumulate',                       icon: '✨', rarity: 'legendary' },

  // ─── Ranguri globale ───
  rank_d:           { id: 'rank_d',           title: 'D-Rank',            desc: 'Atinge rangul D',                            icon: '🥉', rarity: 'bronze' },
  rank_c:           { id: 'rank_c',           title: 'C-Rank',            desc: 'Atinge rangul C',                            icon: '🥈', rarity: 'bronze' },
  rank_b:           { id: 'rank_b',           title: 'B-Rank',            desc: 'Atinge rangul B',                            icon: '⚜️',rarity: 'silver' },
  rank_a:           { id: 'rank_a',           title: 'A-Rank',            desc: 'Atinge rangul A',                            icon: '🏆', rarity: 'gold' },
  rank_s:           { id: 'rank_s',           title: 'S-Rank',            desc: 'Atinge rangul S',                            icon: '👑', rarity: 'gold' },
  shadow_monarch:   { id: 'shadow_monarch',   title: 'Queen Mode',        desc: 'Ajunge la S-Rank sau peste',                 icon: '🦋', rarity: 'legendary' },

  // ─── Hunter Stats ───
  stat_25:          { id: 'stat_25',          title: 'Quarter Stat',      desc: 'Un stat ajunge la nivelul 25',               icon: '🔸', rarity: 'bronze' },
  stat_50:          { id: 'stat_50',          title: 'Half Hundred',      desc: 'Un stat ajunge la nivelul 50',               icon: '⚡', rarity: 'silver' },
  stat_100:         { id: 'stat_100',         title: 'Centurion',         desc: 'Un stat ajunge la nivelul 100',              icon: '💯', rarity: 'gold' },
  stat_200:         { id: 'stat_200',         title: 'Stat Empress',      desc: 'Un stat ajunge la nivelul 200',              icon: '🪩', rarity: 'legendary' },
  all_stats_25:     { id: 'all_stats_25',     title: 'Balanced Goddess',  desc: 'Toate 4 stats peste nivelul 25',             icon: '⚖️',rarity: 'silver' },
  all_stats_50:     { id: 'all_stats_50',     title: 'Quad Mastery',      desc: 'Toate 4 stats peste nivelul 50',             icon: '🔱', rarity: 'gold' },
  all_stats_100:    { id: 'all_stats_100',    title: 'Divine Balance',    desc: 'Toate 4 stats peste nivelul 100',            icon: '🌈', rarity: 'legendary' },

  // ─── Antrenamente ───
  workout_10:       { id: 'workout_10',       title: '10 Antrenamente',   desc: '10 antrenamente complete',                   icon: '💪', rarity: 'bronze' },
  workout_30:       { id: 'workout_30',       title: '30 Antrenamente',   desc: '30 antrenamente complete',                   icon: '🏋️',rarity: 'silver' },
  glute_50:         { id: 'glute_50',         title: 'Glute Goddess',     desc: '50 antrenamente complete',                   icon: '🍑', rarity: 'gold' },
  workout_100:      { id: 'workout_100',      title: '100 Antrenamente',  desc: '100 antrenamente complete',                  icon: '🦾', rarity: 'gold' },
  workout_300:      { id: 'workout_300',      title: 'Veterană',          desc: '300 antrenamente complete',                  icon: '👸', rarity: 'legendary' },
  hip_thrust_master:{ id: 'hip_thrust_master',title: 'Hip Thrust Master', desc: '100 sesiuni de lower (cu hip thrust)',       icon: '🔥', rarity: 'legendary' },

  // ─── Bonus missions ───
  bonus_hunter:     { id: 'bonus_hunter',     title: 'Bonus Queen',       desc: '50 misiuni bonus completate',                icon: '🎯', rarity: 'silver' },
  bonus_200:        { id: 'bonus_200',        title: 'Bonus Hunter',      desc: '200 misiuni bonus completate',               icon: '🏹', rarity: 'gold' },
  bonus_500:        { id: 'bonus_500',        title: 'Bonus Empress',     desc: '500 misiuni bonus completate',               icon: '🌟', rarity: 'legendary' },
  rare_25:          { id: 'rare_25',          title: '25 Rare Done',      desc: '25 misiuni rare completate',                 icon: '🔮', rarity: 'silver' },
  rare_100:         { id: 'rare_100',         title: '100 Rare Done',     desc: '100 misiuni rare completate',                icon: '💠', rarity: 'gold' },
  legendary_5:      { id: 'legendary_5',      title: '5 Legendary',       desc: '5 misiuni legendare completate',             icon: '🎇', rarity: 'silver' },
  legendary_25:     { id: 'legendary_25',     title: '25 Legendary',      desc: '25 misiuni legendare completate',            icon: '🪄', rarity: 'legendary' },

  // ─── Boss days ───
  boss_5:           { id: 'boss_5',           title: 'Boss Killer',       desc: '5 Boss Days câștigate',                      icon: '⚔️', rarity: 'silver' },
  boss_10:          { id: 'boss_10',          title: 'Boss Hunter',       desc: '10 Boss Days câștigate',                     icon: '🗡', rarity: 'gold' },
  boss_25:          { id: 'boss_25',          title: 'Boss Empress',      desc: '25 Boss Days câștigate',                     icon: '🛡️', rarity: 'legendary' },

  // ─── Special ───
  triple_shield:    { id: 'triple_shield',    title: 'Triple Shield',     desc: 'Toate 3 shields-uri active simultan',        icon: '🛡', rarity: 'bronze' },
  shield_save_3:    { id: 'shield_save_3',    title: 'Shield Saver',      desc: '3 shields folosite pentru a salva streak',   icon: '🪖', rarity: 'silver' }
};

// =================== MOTIVATIONAL QUOTES (weekly report + tip of day) ===================
const QUOTES = [
  '"Bună dimineața, regină. Astăzi ești și mai puternică decât ieri."',
  '"Frumusețea adevărată e disciplina mascată în zâmbet."',
  '"Glute-urile nu se construiesc din rugăminți. Ci din hip thrusts."',
  '"Ești sculptorul propriului corp. Continuă să dăltuiești."',
  '"Slăbiciunea de azi este forța de mâine."',
  '"Confortul nu te-a făcut niciodată stronger. Disciplina, da."',
  '"Ai grijă de tine cum ai avea grijă de cea mai bună prietenă."',
  '"Cea mai bună versiune a ta te așteaptă în antrenamentul de mâine."',
  '"O singură zi consistentă bate o sută de zile motivate."',
  '"Corpul tău este templul. Și templul cere lucru, nu rugăminți."',
  '"Glow-up-ul nu vine din machiaj. Vine din somn, mâncare bună, și hip thrusts."',
  '"Frumusețea fără disciplină e doar potențial. Cu disciplină devine putere."',
  '"Ești o operă de artă în lucru. Ai răbdare cu artistul."',
  '"Forța ta interioară crește la fel ca mușchii — sub presiune controlată."',
  '"Nu cere o viață mai ușoară. Cere să devii mai puternică."',
  '"Hunter-ița nu se compară cu nimeni. Doar cu ea de ieri."'
];

// Tips zilnice rotative — wisdom general de viață, nu exerciții
const DAILY_TIPS = [
  'Bea 500ml apă imediat după trezire. Corpul tău e deshidratat după 8 ore fără apă — pielea, mintea, totul.',
  'Cea mai bună investiție pe care o poți face e în tine: somn bun, mâncare reală, oameni buni.',
  'Telefonul în altă cameră noaptea = somn de 2x mai bun. Încearcă o săptămână și o să vezi.',
  'O femeie disciplinată în acțiuni mici devine femeia pe care o admiri în acțiuni mari.',
  'Nu te compara cu o femeie de pe Instagram. Compară-te doar cu cine erai acum 6 luni.',
  'Vorbește cu tine cum ai vorbi cu cea mai bună prietenă a ta. Cu blândețe și onestitate.',
  'Stresul îmbătrânește pielea mai mult decât soarele. Învață să respiri profund când te enervezi.',
  'Cumpără puține haine, dar de calitate. Mai puțin = mai elegant. Mai puțin = mai liber.',
  'Citește 10 pagini pe zi. În 1 an = aproximativ 12 cărți. Te schimbă mai mult decât crezi.',
  'Spune NU mai des. Fiecare „da" la lucruri care nu-ți plac e un „nu" la viața pe care o vrei.',
  'Pielea oglindește ce mănânci, cât bei apă și cât dormi. Nu există cremă magică.',
  'Tăcerea e adesea cel mai puternic răspuns. Nu trebuie să răspunzi imediat la orice.',
  'Începe ziua fără telefon. Primele 30 min sunt pentru tine, nu pentru notificări.',
  'Banii economisiți sunt libertate. Salvează 10% din venit minimum, mereu, înainte de orice.',
  'Cei care te critică cel mai mult sunt cei care nu îndrăznesc să facă ce faci tu.',
  'Învață un skill nou la fiecare 3-6 luni. Mintea care învață rămâne tânără.',
  'Iartă pe cine ți-a făcut rău — nu pentru ei, ci pentru tine. Resentimentul te otrăvește din interior.',
  'Părinții și bunicii tăi îmbătrânesc. Sună-i mai des. Niciodată nu vei regreta că ai vorbit prea mult cu ei.',
  'Cel mai sexy nu e ce porți, ci cum te miști. Postura dreaptă și pasul sigur — gratis, dar prețioase.',
  'Disciplina e libertate. Persoanele indisciplinate devin sclavele propriilor capricii.',
  'Călătorește când ești tânără. Memoriile valorează mai mult decât hainele și gadget-urile.',
  'Frumusețea exterioară se schimbă. Caracterul, inteligența, blândețea — astea cresc cu vârsta.',
  'Spune mulțumesc concret. Nu doar „mersi" generic. Spune EXACT pentru ce. Asta schimbă relațiile.',
  'Mâncarea nu e doar combustibil — e medicament sau otravă. Alege cu intenție, nu din plictiseală.',
  'Postura ta îți schimbă hormonii în 2 minute. Stai dreaptă, respiră adânc, ridică bărbia.',
  'Cumpără cărți, nu like-uri. Investește în ce-ți construiește mintea, nu ce-ți consumă atenția.',
  'Nu te grăbi să răspunzi când ești supărată. „Lasă-mă să mă gândesc" e răspuns elegant și matur.',
  'Plătește-te primul. Pune 10% din venit deoparte ÎNAINTE de orice cheltuială.',
  'Oamenii pe care îi inviți în viața ta îți determină nivelul. Alege-i cu grijă, taie-i când e nevoie.',
  'Niciodată nu te plânge fără să propui o soluție. Plângerea singură e otravă pentru cei din jur.',
  'Trei lucruri îți schimbă viața dacă le faci 5 ani: lectură zilnică, sport regulat, economisire constantă.',
  'Nu împrumuta bani prietenilor decât dacă ești ok să nu-i mai vezi vreodată — banii și amiciția se sting împreună.',
  'O scuzare sinceră și o promisiune ținută sunt mai valoroase decât 100 de complimente.',
  'Râsul e cel mai bun ten cream. Petrece timp cu oameni care te fac să râzi din burtă.',
  'Sportul nu e despre cum arăți. E despre cum te simți. Frumusețea vine ca bonus, nu ca scop.'
];

// =================== GHID FORMĂ CORECTĂ (pt începătoare) ===================
// Un ghid per mișcare, mapat la toate id-urile variantelor. q = termen pt căutare YouTube.
const EXERCISE_FORM = (function () {
  const guides = {
    hip_thrust: { q: 'hip thrust', form: [
      'Sprijină omoplații pe o bancă; bara (cu pernă) peste șolduri.',
      'Tălpi late pe podea, genunchii ajung la ~90° când ești sus.',
      'Împinge din CĂLCÂIE și ridică șoldul până corpul e drept (umeri–șold–genunchi în linie).',
      'Strânge fesele 1-2s sus, bărbia spre piept, coastele în jos.',
      'Coboară lent, fără să arcuiești spatele.'
    ], mistakes: ['Arcuiești spatele (lombar) în loc să strângi fesele.', 'Împingi din vârfuri, nu din călcâi.', 'Nu ajungi sus la linie dreaptă șold–genunchi.'] },

    sl_hip_thrust: { q: 'single leg hip thrust', form: [
      'Omoplați pe bancă, un picior pe podea, celălalt întins/ridicat.',
      'Împinge din călcâiul piciorului de jos.',
      'Ridică șoldul drept, fără să-l lași într-o parte.',
      'Strânge fesa 1-2s, coboară controlat.'
    ], mistakes: ['Lași șoldul să cadă într-o parte (asimetric).', 'Folosești elan în loc de control.', 'Împingi din vârf, nu din călcâi.'] },

    goblet_squat: { q: 'goblet squat', form: [
      'Ține o ganteră vertical la piept, ambele mâini sub partea de sus.',
      'Picioare la lățimea umerilor, vârfuri ușor în afară.',
      'Coboară împingând șoldul înapoi, torso vertical, genunchii spre vârfuri.',
      'Coboară cât poți cu spatele drept, apoi împinge din călcâie în sus.'
    ], mistakes: ['Genunchii cad spre interior.', 'Te apleci în față / ridici călcâiele.', 'Spatele rotunjit jos.'] },

    sumo_goblet: { q: 'sumo goblet squat', form: [
      'Picioare mai late decât umerii, vârfuri în afară (~45°).',
      'Ganteră la piept, torso vertical.',
      'Coboară împingând genunchii spre EXTERIOR (în linie cu vârfurile).',
      'Împinge din călcâie, strânge fesele sus.'
    ], mistakes: ['Genunchii cad spre interior.', 'Picioare prea apropiate.', 'Te apleci în față.'] },

    bulgarian_split: { q: 'bulgarian split squat', form: [
      'Piciorul din spate pe bancă, cel din față cu un pas LUNG în față (focus fese).',
      'Coboară drept în jos, genunchiul din față peste gleznă, torso ușor înclinat.',
      'Coboară până coapsa din față e ~paralelă, apoi împinge din călcâiul din față.',
      'Control total, fără să te legeni.'
    ], mistakes: ['Pas prea scurt (suprasolicită genunchiul).', 'Genunchiul trece mult peste vârf.', 'Te dezechilibrezi / cobori prea repede.'] },

    reverse_lunge: { q: 'reverse lunge', form: [
      'Din picioare, fă un pas mare ÎNAPOI.',
      'Coboară genunchiul din spate spre podea, torso drept.',
      'Genunchiul din față peste gleznă, ~90°.',
      'Împinge din călcâiul piciorului din FAȚĂ ca să revii.'
    ], mistakes: ['Pas prea mic.', 'Te apleci în față.', 'Împingi din piciorul din spate.'] },

    walking_lunges: { q: 'walking lunges', form: [
      'Pas LUNG în față (pentru fese), coboară genunchiul din spate spre podea.',
      'Torso drept, genunchiul din față peste gleznă.',
      'Împinge din călcâiul din față și pășește direct în următorul lunge.',
      'Echilibru, privirea înainte.'
    ], mistakes: ['Pași prea scurți.', 'Genunchiul trece mult peste vârf.', 'Te apleci / te legeni.'] },

    rdl_db: { q: 'romanian deadlift dumbbell', form: [
      'Gantere în față, picioare la lățimea șoldului, genunchi ușor flexați (FIXI).',
      'Împinge ȘOLDUL înapoi și coboară ganterele aproape de picioare.',
      'Spate DREPT (neutru); simți întindere în spatele coapsei.',
      'Coboară până la jumătatea tibiei, apoi împinge șoldul în față și strânge fesele sus.'
    ], mistakes: ['Rotunjești spatele (cel mai periculos!).', 'Îndoi genunchii ca la genuflexiune (e hip hinge, nu squat).', 'Cobori ganterele departe de corp.'] },

    cable_pull_through: { q: 'cable pull through', form: [
      'Cu spatele la cablu (jos), funia între picioare, pași în față.',
      'Împinge șoldul înapoi (hip hinge), spate drept.',
      'Trage înainte din FESE (nu din brațe), extinde șoldul complet.',
      'Strânge fesele 1-2s, revino controlat.'
    ], mistakes: ['Tragi din brațe în loc de fese.', 'Rotunjești spatele.', 'Te apleci pe spate la final.'] },

    glute_bridge: { q: 'glute bridge', form: [
      'Întinsă pe spate, genunchi îndoiți, tălpi aproape de fese.',
      'Împinge din călcâie și ridică șoldul.',
      'Strânge fesele sus 2s (corp drept umeri–genunchi).',
      'Coboară controlat.'
    ], mistakes: ['Arcuiești lombarul în loc de fese.', 'Tălpile prea departe (lucrează ischio).', 'Nu strângi sus.'] },

    frog_pumps: { q: 'frog pumps glute', form: [
      'Întinsă pe spate, tălpile lipite, genunchii căzuți în afară (poziție „broască").',
      'Împinge din tălpi/călcâie și ridică șoldul.',
      'Strânge fesele sus, coboară controlat, repetă pompat.'
    ], mistakes: ['Folosești lombarul.', 'Range prea mic (nu strângi sus).', 'Genunchii nu sunt relaxați în afară.'] },

    cable_kickback: { q: 'cable glute kickback', form: [
      'Gleznieră la cablu jos, cu fața la aparat, ușor aplecată din șold.',
      'Împinge piciorul ÎNAPOI și ușor în sus, din FESĂ.',
      'Strânge fesa 1-2s la vârf, fără să arcuiești spatele.',
      'Revino controlat, fără elan.'
    ], mistakes: ['Folosești elan/spatele în loc de fesă.', 'Arcuiești lombarul.', 'Compensezi cu spatele pt range mai mare.'] },

    cable_leg_curl: { q: 'standing cable leg curl hamstring', form: [
      'Gleznieră la cablu jos, cu fața la aparat, prinde-te de suport.',
      'Flexează genunchiul ducând călcâiul spre fesă.',
      'Strânge spatele coapsei (ischio) la vârf.',
      'Revino lent, controlat.'
    ], mistakes: ['Folosești elan din șold.', 'Range scurt.', 'Cobori prea repede.'] },

    calf_raise: { q: 'standing calf raise', form: [
      'În picioare, vârfurile pe o treaptă, gantere în mâini.',
      'Coboară călcâiele sub nivel (stretch).',
      'Ridică-te pe vârfuri cât poți de sus (squeeze).',
      'Tempo lent: 2s sus, 2s jos.'
    ], mistakes: ['Range prea mic.', 'Te legeni cu elan.', 'Prea rapid.'] },

    chest_fly: { q: 'cable chest fly', form: [
      'Câte un mâner în fiecare mână, un pas în față, ușor aplecată.',
      'Brațele ușor îndoite (fixe), deschise lateral.',
      'Adu mâinile în față într-un arc, ca o îmbrățișare.',
      'Strânge pieptul 1-2s, revino controlat la stretch.'
    ], mistakes: ['Îndoi/întinzi coatele (devine împins).', 'Folosești elan.', 'Range prea mic.'] },

    lat_pulldown: { q: 'lat pulldown', form: [
      'Prinde bara mai lat decât umerii, stai dreaptă, ușor pe spate.',
      'Trage bara spre partea de SUS a pieptului, coatele jos.',
      'Strânge omoplații, fără să te legeni.',
      'Revino controlat, brațele întinse sus.'
    ], mistakes: ['Tragi din brațe, nu din spate.', 'Te legeni cu elan.', 'Bara în spatele capului.'] },

    lat_raise: { q: 'dumbbell lateral raise', form: [
      'Gantere pe lângă corp, ușor aplecată, coate ușor îndoite.',
      'Ridică lateral până la nivelul umerilor.',
      'Condu cu COATELE, nu cu mâinile; pumnii nu trec de umeri.',
      'Coboară lent.'
    ], mistakes: ['Folosești elan / ridici din trapez.', 'Ganterele peste umeri.', 'Coborâre prea rapidă.'] },

    face_pulls: { q: 'cable face pull', form: [
      'Funie la cablu la nivelul feței.',
      'Trage funia spre frunte, coatele sus și în spate.',
      'Rotește extern (mâinile spre urechi), strânge omoplații.',
      'Revino controlat.'
    ], mistakes: ['Tragi prea jos (spre piept).', 'Nu rotești extern.', 'Greutate prea mare cu elan.'] },

    cable_crunch: { q: 'kneeling cable crunch abs', form: [
      'Îngenunchează cu fața la cablu (funie sus), ține funia lângă cap.',
      'Curbează coloana ducând coatele spre coapse (ABDOMENUL face mișcarea).',
      'Strânge abdomenul jos; șoldul rămâne fix.',
      'Revino lent, controlat.'
    ], mistakes: ['Tragi din șold/brațe în loc de abdomen.', 'Range prea mic.', 'Spatele drept (nu curbezi coloana).'] },

    pallof: { q: 'pallof press', form: [
      'Lateral față de cablu (la nivelul pieptului), prinde mânerul la piept cu ambele mâini.',
      'Întinde brațele drept în față, REZISTÂND rotației.',
      'Ține 1-2s, revino la piept.',
      'Core strâns tot timpul, nu te roti.'
    ], mistakes: ['Lași corpul să se rotească spre cablu.', 'Folosești brațele în loc de core.', 'Te apleci.'] },

    woodchops: { q: 'cable woodchop', form: [
      'Lateral față de cablu, prinde mânerul cu ambele mâini.',
      'Trage diagonal peste corp, rotind din TRUNCHI/core.',
      'Brațele relativ întinse; mișcarea vine din core.',
      'Controlează revenirea.'
    ], mistakes: ['Tragi doar din brațe.', 'Prea repede, cu elan.', 'Nu rotești din trunchi.'] },

    plank: { q: 'plank correct form', form: [
      'Pe coate (sub umeri) și vârfuri, corp drept ca o scândură.',
      'Strânge abdomenul și fesele, bazinul ușor retrovers.',
      'Privirea în jos, gât neutru.',
      'Respiră normal, ține poziția.'
    ], mistakes: ['Lași șoldul să cadă (lombar).', 'Ridici fundul prea sus.', 'Ții respirația.'] },

    knee_raises: { q: 'hanging knee raises', form: [
      'Atârnă de bară, brațe întinse, umeri activi.',
      'Ridică genunchii spre piept curbând bazinul (nu doar din șold).',
      'Strânge abdomenul jos, coboară controlat.',
      'Evită balansul.'
    ], mistakes: ['Te legeni cu elan.', 'Ridici doar din șold.', 'Cobori prea repede.'] },

    dead_hangs: { q: 'dead hang', form: [
      'Atârnă de bară cu ambele mâini, brațe întinse.',
      'Umeri ușor activi (nu complet pasivi), corp relaxat.',
      'Respiră și ține cât poți (decompresie + grip).'
    ], mistakes: ['Umeri complet pasivi de la început.', 'Te legeni.', 'Strângi excesiv (obosești repede).'] },

    stretching: { q: 'full body stretching routine', form: [
      'Întinderi statice ușoare, fără durere ascuțită.',
      'Ține fiecare poziție 30-60s, respiră adânc.',
      'Static, nu balistic (nu te legăna).'
    ], mistakes: ['Forțezi până la durere.', 'Ții respirația.', 'Întinderi prea scurte.'] }
  };
  const ids = {
    hip_thrust: ['hip_thrust_a', 'hip_thrust_b'],
    sl_hip_thrust: ['sl_hip_thrust'],
    goblet_squat: ['goblet_squat'],
    sumo_goblet: ['sumo_goblet'],
    bulgarian_split: ['bulgarian_split'],
    reverse_lunge: ['reverse_lunge'],
    walking_lunges: ['walking_lunges'],
    rdl_db: ['rdl_db'],
    cable_pull_through: ['cable_pull_through_a', 'cable_pull_through_c'],
    glute_bridge: ['glute_act_bridge'],
    frog_pumps: ['glute_act_frog'],
    cable_kickback: ['glute_act_kickback', 'cable_kickback_b', 'cable_kickback_c'],
    cable_leg_curl: ['cable_leg_curl'],
    calf_raise: ['calf_raise_a', 'calf_raise_b'],
    chest_fly: ['chest_fly'],
    lat_pulldown: ['lat_pulldown'],
    lat_raise: ['lat_raise'],
    face_pulls: ['face_pulls'],
    cable_crunch: ['cable_crunch_c', 'cable_crunch_mob', 'cable_crunch_uc'],
    pallof: ['pallof_mob', 'pallof_uc'],
    woodchops: ['woodchops_c', 'woodchops_mob'],
    plank: ['plank_mob'],
    knee_raises: ['knee_raises_mob', 'knee_raises_uc'],
    dead_hangs: ['dead_hangs_mob'],
    stretching: ['stretching_mob']
  };
  const out = {};
  for (const key in ids) ids[key].forEach(id => { out[id] = guides[key]; });
  return out;
})();

window.PROGRAM = PROGRAM;
window.EXERCISE_FORM = EXERCISE_FORM;
window.DAY_ORDER = DAY_ORDER;
window.BONUS_MISSION_POOL = BONUS_MISSION_POOL;
window.BOSS_MISSIONS = BOSS_MISSIONS;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.QUOTES = QUOTES;
window.DAILY_TIPS = DAILY_TIPS;
