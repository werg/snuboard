import json, random

usernames = ["Beef_Sister","Cheeseface","DirtyDiaper2011","Nuck_Chorris","Artswerdstone","Fastnbulbous","Useful_idiot","Lahot","Giggling_monkey","Twittersaurusrex","BufferOverflaw","Maverickrolled","Mayor_naise","Schmetterlink","MarmiteIceCream","RoundhouseChick","bitbot","dotbit","ChocChipChopShop","ZombieKitten","Halitosiosus","CalinaVenomous_Darmor","Ayne_Brutal","Zoucka_Metalhead","Julthor_Cruel","LelaniSteelworm","Nelena_BadValker","Wanera_EvilSenic","Wild-eyesNeowald","DeadlyNathon","Laenaya_Black_Dakboon","Rythorn_Deadly","Yveflorian_Bad","NimayaWildman","PanicSedar","Enoka_Cold-blodded","Mylene_Bitter","Koala_Grotesque","Elastic_Lamb","Gazette_Lost","BraveTurtle","UniqueWalrus","FattySwiftWarrior","Hungry_Hippopotamus","Worthy_Monkey","Fox_Doggy","Airmen_Drunken","Desire_Bella","BellaOld","ViciousOld_Duckbill","Boiling_Mule","MoleMole","Hilarious_Judge","The_Duckling","Pink_Cutie","Freaky_ForsakenPuppy","Icy_Honey","Homeless_Dormouse","EndlessSugar_Kid","Permanent_Butter","DangerousSilver_Eagle","Railroad_Bitter","GrimSupersonic_Haystack","Northernmost_Alarm","Insane_Lama","Insane_Comic","Hidden_Canal","OutstandingQuality_Crystal","Outstanding_Crystal","New_Finger","Itchy_Creek","RebelSwallow","FistSolid","Don-Top","Opefresh","Graveredhome","Ittouch","Onto-Light","KeyQuadtough","Alphafax","Runlam","Stockwarm","Stanair","Damtouch","Konex","Mysterious_Mothers","The_AcousticZeus_Divisions","The_Global_Epsilon","The_Massive_Intense_Comics","Golden_Cobras","The_Mysterious_Epsilon","The_Heavy_HelplessSofas","Total_Killers","Bitter_Beta","TheWealthy_Autumn","MagentaQueens","YellowVultures","The_Fast_Global_Anacondas","KnightsofPadan","TheOgresofShardo","Brutal_Cool_Duck","The_Corporal","ElTorpedo","Bitter_Kangaroo","Falcon_Black","El_Agent","EndlessOgre","Empty_Doctor","Beta_Dragonfly","Needless_Locomotive","The_Black_Lobster","FoghornWestern","Rockhard_Freaky_Leather","The_GhostSnappy_Barbarian","LieutenantRocky","Raving_Invader","Solid_Foghorn","El_Lobster","Dark_Arrow","ElTiger","El_Doctor","El_General","WhitePower","Cheerful_Airman","GlobalSnake","ToughOyster","Wild_Falcon","TheWarrior","Helpless_Agent","The_Gangster","Kangaroo_Heroic","AlphaNeutron","HideousPower","Guard_Gamma","Strong_Monkey","Monkey_Gutsy","Strong_Frostbite","The_Messenger","Jared_Barber","Gary_Mckay","Tyler_Estes","Rosanne_Gayle_Guerra","Francis_Amanda_Ballard","NicolasPerry","Teddy_Erickson","ArturoPatrice_Castro","RodneyPaul","EliObrien","Tonya_Jordan","TiaNewton","DenaSaunders","Jake_Mercer","Linda_Mccray","Max_Levy","Lenore_Lara","Kim_Malone","Alec_Hunter","Ronald_Carson","GabrielleReeves","Homer_Donovan","YolandaPetty","Doreen_Houston","Jolene_Jackson","Clark_HankWolf","BuddyReid_Griffith","Dora_Melendez","Vital_Gnu","Hungry_Antelope","Hungry_Duck","Dusty_Kid","Swush_Hungry","Slimy_Devil","Seriously_BluePilot","Running_Kit","Black_Mandrill","YoungUgly_Invader","RapidRotten_Filly","El_Hare","Jaguar_Fast","SugarWombat","PrisonerVicious","Knife_Hot","ScarletSunny_Foal","Wolf_Minimum","NavyOx","Old_FoxyPet","Elastic_Dog","Eager_Bear","Kit_Endless","Meaty_Filly","RapidVillain","Ranger_Fisty","StrongStony_Mare","BlackSleepy_Fox","Wild_Deer","GalironsParents","MonstersofSyr","LeurkesRebels","TholanoftheSons","LurdLoons","The_Eaglesof_Chidak","The_Fighters_from_Agon","Modrics_Monsters","The_Fightersof_Atgur","Spirits_from_Amerdan","TheSphinxof_Lidorn","YinasOgres","The_Brutes_fromYerpal","TheRollers_from_Darmor","DerikoftheRiders","Spiritsof_Latzaf","Colthans_Demons","Jelli_Horde","Der_Hippopotamus","Stoned_Helpless_Buffalo","HeartyTrustee","Toad_Heavy","Cruel_Icy_Child","SlimyRhino","Young_Lucky_Coyote","PhantomPurple","Drunken_Musk-ox","Nymph_Fatty","ThePuppy","Rusty_HungryRat","WildOtter","Rapid_Lion","Blue_Doggy_Mustang","Dusty_Maxi_Grizzly","Solid_Alligator","Hot_Flower_Child","Flapper_Morbid","Cute_Jockey","The_Dolly","RoughStrongWaterbuck","Titan_Hidden","Flipper_Ivory","DeerSkinny","Ivory_Gold_Mole","Modern_Boy","Demon_Flying","TheWolverine","DancerSteamy","MorbidSteel","DancingStreamingShadow","RawSilverOtter","DreadedSapphire","Star_Grotesque","Alpha_Beam","DoggyThirsty_Harmony","Hook_Mini","Freak_Golden","Slimy_Elephant","Cool_Breeze","Beauty_Lovebird","ColorRat","KingSilver","Los_Guinea","Solid_Eternal_Duckie"]
comment_texts = ["I frowned on a ninja in line at the bank because my family thinks I'm stupid anyway.",
"I pooped on a gangster in my car because I'm NOT crazy.",
"I jumped on my best friends' boyfriend while riding a motorcycle because the voices told me to.",
"I licked on a gangster in your bathroom because that's how I roll.",
"I yelled at a spoon at the dinner table because I'm a Ninja!",
"I jumped on a monster in a hole because Big Bird told me to.",
"I jumped on my neighbour in line at the bank because the voices told me to.",
"I jumped on a football player on your car because I had an epiphany.",
"I loved my brother in my car because Daddy would like some sausages.",
"I danced with a nipple under your bed because I'm AWESOME!",
"I loved a football player in my car because I can't control myself!",
"I smelled a llama in line at the bank because I'm really not on drugs!",
"I loved my best friends' boyfriend sliding down a hill because I think I need some serious help.",
"I sang to a smurf in your bathroom because Big Bird told me to.",
"I loved an iPod at the dinner table because I can.",
"I loved a football player in your bathroom because someone offered me 1,000,000 dollars",
"I danced with a homeless guy in line at the bank because I can.",
"I yelled at a homeless guy under your bed because I'm a Ninja!",
"I trolled a squirrel in my car because I'm a Ninja!",
"I frowned on a gangster at the dinner table because I've got ADD!",
"I trolled a baseball bat in line at the bank because someone offered me 1,000,000 dollars",
"I loved my brother under your bed because that's how I roll.",
"I yelled at a fork sliding down a hill because I can.",
"I had lunch with Chuck Norris in your bathroom because I'm really not on drugs!",
"I karate chopped a squirrel in your bathroom because Daddy would like some sausages.",
"I smelled a pickle at the dinner table because the voices told me to.",
"I sang to a spoon in a swimming pool because I'm a Ninja!",
"I yelled at a fork under your bed because that's how I roll.",
"I frowned on a fork at the dinner table because the voices told me to.",
"I jumped on my brother under your bed because Daddy would like some sausages.",
"I frowned on a football player on your car because someone offered me 1,000,000 dollars",
"I trolled a homeless guy while riding a motorcycle because the voices told me to.",
"I did the Macarena with my sister in your bathroom because I'm AWESOME!",
"I licked on a llama in line at the bank because someone offered me 1,000,000 dollars",
"I yelled at my sister on your car because I'm sexy and I do what I want",
"I danced with my mobile phone in a swimming pool because I'm a Ninja!",
"I yelled at a snowman while riding a motorcycle because I had a vision from God.",
"I pooped on a birdbath in a hole because Daddy would like some sausages.",
"I did the Macarena with a homeless guy on your car because I'm NOT crazy.",
"I loved a spoon on your car because that's how I roll.",
"I yelled at my neighbour on your car because my family thinks I'm stupid anyway.",
"I yelled at a goat while riding a motorcycle because I'm sexy and I do what I want",
"I yelled at your mom sliding down a hill because I'm AWESOME!",
"I jumped on a squirrel in a hole because someone offered me 1,000,000 dollars",
"I licked on a homeless guy on your car because I can.",
"I loved a baseball bat in a hole because I had a vision from God.",
"I pooped on a squirrel in a hole because I'm AWESOME!",
"I sang to my science teacher in my car because I've got ADD!",
"I loved my best friends' boyfriend in my car because I'm a Ninja!",
"I did the Macarena with a birdbath in line at the bank because I've got ADD!",
"I loved a football player under your bed because I can't control myself!",
"I kicked a snowman in a swimming pool because my family thinks I'm stupid anyway.",
"I pooped on a squirrel in an elevator because I can't control myself!",
"I yelled at a goat under your bed because I like getting wet.",
"I karate chopped my dog in a hole because I like getting wet.",
"I pooped on a monster sliding down a hill because Big Bird told me to.",
"I had lunch with a homeless guy in an elevator because the voices told me to.",
"I frowned on your mom in an elevator because I'm AWESOME!",
"I loved my brother in a swimming pool because I'm really not on drugs!",
"I licked on my neighbour in a swimming pool because I'm a Ninja!",
"I ran over my mobile phone in a hole because I had a vision from God.",
"I karate chopped a squirrel under your bed because someone offered me 1,000,000 dollars",
"I had lunch with a gangster sliding down a hill because I'm NOT crazy.",
"I trolled a smurf in my car because I'm cool like that",
"I licked on a homeless guy on your car because my family thinks I'm stupid anyway.",
"I ran over a surfer in your bathroom because I'm sexy and I do what I want",
"I sang to a pickle while riding a motorcycle because that's how I roll.",
"I yelled at an iPod in a swimming pool because that's how I roll.",
"I had lunch with your mom in an elevator because I had a vision from God.",
"I trolled a goat sliding down a hill because that's how I roll.",
"I loved a banana under your bed because I think I need some serious help.",
"I yelled at a stuffed animal under your bed because I'm cool like that",
"I licked on a noodle while riding a motorcycle because that's how I roll.",
"I karate chopped a pickle in a swimming pool because my family thinks I'm stupid anyway.",
"I pooped on a noodle in a swimming pool because I like getting wet.",
"I ran over a banana in my car because I've got ADD!",
"I trolled my science teacher in line at the bank because I think I need some serious help.",
"I jumped on a homeless guy under your bed because I can.",
"I frowned on a pickle on your car because I've got ADD!",
"I frowned on a nipple at the dinner table because the voices told me to.",
"I pooped on a noodle in my car because I'm sexy and I do what I want",
"I frowned on a football player in a swimming pool because I'm sexy and I do what I want",
"I had lunch with a squirrel at the dinner table because I can't control myself!",
"I kicked my best friends' boyfriend sliding down a hill because I can't control myself!",
"I loved a birdbath while riding a motorcycle because I'm a Ninja!",
"I sang to a surfer in my car because I can.",
"I trolled a banana at the dinner table because I had an epiphany.",
"I smelled my sister in a swimming pool because I've got ADD!",
"I trolled a stuffed animal in a hole because I can't control myself!",
"I sang to my science teacher in a hole because my family thinks I'm stupid anyway.",
"I loved a llama under your bed because Big Bird told me to.",
"I yelled at a snowman in line at the bank because I had an epiphany.",
"I pooped on my best friends' boyfriend while riding a motorcycle because I'm cool like that",
"I sang to my science teacher in my car because Big Bird told me to.",
"I sang to my sister in a hole because I'm NOT crazy.",
"I trolled a smurf under your bed because Big Bird told me to.",
"I trolled my mobile phone sliding down a hill because the voices told me to.",
"I jumped on my mobile phone on your car because I'm AWESOME!",
"I did the Macarena with a nipple in line at the bank because I'm really not on drugs!",
"I danced with a birdbath under your bed because I can.",
"I had lunch with a stuffed animal in an elevator because I'm NOT crazy.",
"I loved a fireman while riding a motorcycle because I had a vision from God.",
"I sang to a squirrel at the dinner table because my family thinks I'm stupid anyway.",
"I yelled at a gangster in your bathroom because I can.",
"I ran over my sister on your car because I like getting wet.",
"I did the Macarena with a llama in my car because Daddy would like some sausages.",
"I danced with an iPod in my car because someone offered me 1,000,000 dollars",
"I karate chopped a birdbath under your bed because I can.",
"I licked on a banana in my car because I'm sexy and I do what I want",
"I frowned on a phone in a swimming pool because Big Bird told me to.",
"I danced with a pickle while riding a motorcycle because the voices told me to.",
"I yelled at your mom in a swimming pool because I'm NOT crazy.",
"I karate chopped my sister sliding down a hill because I like getting wet.",
"I loved a fireman on your car because I'm NOT crazy.",
"I smelled Chuck Norris sliding down a hill because I'm sexy and I do what I want",
"I karate chopped a snowman in my car because someone offered me 1,000,000 dollars",
"I kicked my sister in an elevator because Big Bird told me to.",
"I loved a banana at the dinner table because I'm cool like that",
"I kicked a homeless guy in an elevator because that's how I roll.",
"I danced with a monster while riding a motorcycle because I've got ADD!",
"I yelled at my best friends' boyfriend in your bathroom because I'm really not on drugs!",
"I karate chopped a phone in a swimming pool because I had a vision from God.",
"I loved a snowman in my car because Big Bird told me to.",
"I jumped on my neighbour in a swimming pool because I'm a Ninja!",
"I had lunch with my mobile phone while riding a motorcycle because I'm AWESOME!",
"I pooped on a smurf at the dinner table because I can't control myself!",
"I kicked a ninja sliding down a hill because I can't control myself!",
"I sang to your mom on your car because I'm AWESOME!",
"I jumped on a fork in line at the bank because that's how I roll.",
"I had lunch with my sister while riding a motorcycle because I had a vision from God.",
"I had lunch with a gangster sliding down a hill because I'm NOT crazy.",
"I yelled at a ninja in a hole because I'm really not on drugs!",
"I sang to a monster in a hole because I had an epiphany.",
"I sang to a fork under your bed because Daddy would like some sausages.",
"I trolled a smurf in your bathroom because I can.",
"I frowned on a spoon while riding a motorcycle because I can.",
"I licked on my neighbour sliding down a hill because I'm really not on drugs!",
"I smelled a nipple while riding a motorcycle because Daddy would like some sausages.",
"I pooped on a squirrel while riding a motorcycle because my family thinks I'm stupid anyway.",
"I had lunch with a ninja in line at the bank because that's how I roll.",
"I had lunch with a spoon in a hole because I'm cool like that",
"I trolled a nipple in a hole because I had a vision from God.",
"I karate chopped a baseball bat in a swimming pool because someone offered me 1,000,000 dollars",
"I ran over a phone in your bathroom because I'm really not on drugs!",
"I yelled at a squirrel while riding a motorcycle because I had an epiphany.",
"I trolled a phone while riding a motorcycle because someone offered me 1,000,000 dollars",
"I karate chopped a phone in a hole because I think I need some serious help.",
"I smelled my brother under your bed because I'm NOT crazy.",
"I danced with your mom in your bathroom because I like getting wet.",
"I karate chopped a stuffed animal in an elevator because that's how I roll.",
"I trolled a fireman in your bathroom because I like getting wet.",
"I kicked my best friends' boyfriend in a swimming pool because I think I need some serious help.",
"I loved Chuck Norris sliding down a hill because I can't control myself!",
"I had lunch with a stuffed animal under your bed because I had a vision from God.",
"I pooped on a baseball bat sliding down a hill because I can.",
"I sang to a fork in line at the bank because I can't control myself!",
"I danced with a goat in a hole because Big Bird told me to.",
"I trolled a spoon on your car because I think I need some serious help.",
"I kicked a fork on your car because I'm really not on drugs!",
"I licked on a noodle in a hole because I had an epiphany.",
"I ran over my sister under your bed because my family thinks I'm stupid anyway.",
"I smelled a pickle in a swimming pool because I think I need some serious help.",
"I did the Macarena with a noodle sliding down a hill because I've got ADD!",
"I did the Macarena with a spoon in your bathroom because I can't control myself!",
"I did the Macarena with Chuck Norris in your bathroom because I can't control myself!",
"I trolled my mobile phone in your bathroom because Daddy would like some sausages.",
"I jumped on my best friends' boyfriend while riding a motorcycle because I had an epiphany.",
"I karate chopped a stuffed animal on your car because the voices told me to.",
"I licked on my science teacher sliding down a hill because I've got ADD!",
"I loved a fork sliding down a hill because I can.",
"I had lunch with an iPod in your bathroom because the voices told me to.",
"I pooped on an iPod in a hole because I can't control myself!",
"I sang to a nipple in a hole because someone offered me 1,000,000 dollars",
"I licked on a gangster while riding a motorcycle because I had an epiphany.",
"I karate chopped my dog on your car because I'm sexy and I do what I want",
"I did the Macarena with a snowman on your car because I'm NOT crazy.",
"I did the Macarena with a pickle in a hole because I'm really not on drugs!",
"I pooped on a birdbath in a swimming pool because I've got ADD!",
"I did the Macarena with a ninja in your bathroom because I'm really not on drugs!",
"I danced with an iPod on your car because someone offered me 1,000,000 dollars",
"I trolled a surfer while riding a motorcycle because I can.",
"I kicked a pickle in an elevator because I'm really not on drugs!",
"I frowned on a nipple sliding down a hill because I had an epiphany.",
"I did the Macarena with a llama while riding a motorcycle because I'm cool like that",
"I ran over a baseball bat in line at the bank because I like getting wet.",
"I yelled at a snowman in a hole because I like getting wet.",
"I sang to my neighbour sliding down a hill because I'm cool like that",
"I trolled a birdbath while riding a motorcycle because that's how I roll.",
"I pooped on a smurf at the dinner table because I think I need some serious help.",
"I licked on your mom under your bed because I'm cool like that",
"I frowned on an iPod in a swimming pool because I can't control myself!",
"I loved a baseball bat in an elevator because I think I need some serious help.",
"I smelled a birdbath sliding down a hill because I'm AWESOME!",
"I did the Macarena with a pickle under your bed because Daddy would like some sausages.",
"I had lunch with my brother in an elevator because I'm cool like that",
"I frowned on a smurf in my car because I can.",
"I sang to my mobile phone in your bathroom because I like getting wet.",
"I yelled at a noodle in your bathroom because Daddy would like some sausages.",
"I loved a spoon in my car because I can't control myself!",
"I trolled a snowman in a swimming pool because I think I need some serious help.",
"I trolled a pickle while riding a motorcycle because I'm cool like that",
"I trolled a snowman in an elevator because I'm sexy and I do what I want",
"I sang to a squirrel sliding down a hill because the voices told me to.",
"I frowned on Chuck Norris sliding down a hill because I've got ADD!",
"I sang to a surfer in line at the bank because I'm really not on drugs!",
"I frowned on my neighbour sliding down a hill because Daddy would like some sausages.",
"I karate chopped a football player while riding a motorcycle because I think I need some serious help.",
"I did the Macarena with an iPod in your bathroom because Daddy would like some sausages.",
"I pooped on a birdbath in an elevator because I'm AWESOME!",
"I did the Macarena with a stuffed animal while riding a motorcycle because I'm really not on drugs!",
"I smelled my sister under your bed because that's how I roll.",
"I licked on my brother while riding a motorcycle because I'm AWESOME!",
"I had lunch with a spoon sliding down a hill because I can.",
"I smelled your mom in line at the bank because I'm a Ninja!",
"I had lunch with a squirrel sliding down a hill because the voices told me to.",
"I licked on my dog in my car because I think I need some serious help.",
"I smelled a banana in a swimming pool because I'm a Ninja!",
"I did the Macarena with my dog in a swimming pool because my family thinks I'm stupid anyway.",
"I trolled a homeless guy while riding a motorcycle because I think I need some serious help.",
"I karate chopped a birdbath in my car because I can.",
"I licked on a monster in an elevator because I'm a Ninja!",
"I did the Macarena with an iPod sliding down a hill because I can.",
"I did the Macarena with my best friends' boyfriend at the dinner table because someone offered me 1,000,000 dollars",
"I kicked a monster in my car because my family thinks I'm stupid anyway.",
"I kicked my brother in a swimming pool because Big Bird told me to.",
"I frowned on a nipple in a swimming pool because I had a vision from God.",
"I kicked a squirrel in my car because my family thinks I'm stupid anyway.",
"I frowned on my science teacher sliding down a hill because I'm really not on drugs!",
"I licked on Chuck Norris in my car because the voices told me to.",
"I did the Macarena with a fork in your bathroom because I can.",
"I smelled a goat at the dinner table because my family thinks I'm stupid anyway.",
"I did the Macarena with a noodle in a swimming pool because I'm AWESOME!",
"I jumped on my dog in a swimming pool because the voices told me to.",
"I pooped on a stuffed animal in an elevator because Daddy would like some sausages.",
"I sang to a stuffed animal in an elevator because I'm AWESOME!",
"I licked on a gangster in line at the bank because I like getting wet.",
"I yelled at your mom in your bathroom because I'm AWESOME!",
"I loved Chuck Norris sliding down a hill because I'm NOT crazy.",
"I kicked my mobile phone at the dinner table because my family thinks I'm stupid anyway.",
"I jumped on a ninja under your bed because the voices told me to.",
"I had lunch with my science teacher in your bathroom because I can't control myself!",
"I karate chopped your mom in a hole because I'm cool like that",
"I danced with my neighbour under your bed because I'm a Ninja!",
"I ran over a ninja at the dinner table because I think I need some serious help.",
"I had lunch with a squirrel in an elevator because I'm NOT crazy.",
"I jumped on a snowman sliding down a hill because I'm NOT crazy.",
"I smelled a monster in line at the bank because the voices told me to.",
"I danced with my best friends' boyfriend sliding down a hill because someone offered me 1,000,000 dollars",
"I danced with a pickle at the dinner table because I've got ADD!",
"I smelled a smurf on your car because I had a vision from God.",
"I pooped on a llama on your car because I'm cool like that",
"I loved a homeless guy in an elevator because I had an epiphany.",
"I frowned on my brother in line at the bank because I'm NOT crazy.",
"I loved a stuffed animal sliding down a hill because I'm cool like that",
"I frowned on a goat under your bed because I've got ADD!",
"I pooped on my neighbour in an elevator because I think I need some serious help.",
"I yelled at a ninja in my car because I'm cool like that",
"I yelled at a goat on your car because I like getting wet.",
"I sang to my sister in your bathroom because I think I need some serious help.",
"I kicked a birdbath in your bathroom because I can.",
"I trolled a monster at the dinner table because the voices told me to.",
"I loved a llama sliding down a hill because I'm sexy and I do what I want",
"I yelled at an iPod in line at the bank because I've got ADD!",
"I trolled a surfer while riding a motorcycle because I'm really not on drugs!",
"I danced with a birdbath in line at the bank because I'm cool like that",
"I yelled at a football player in a hole because Daddy would like some sausages.",
"I trolled an iPod in a swimming pool because Big Bird told me to.",
"I kicked a snowman in line at the bank because I like getting wet.",
"I smelled a gangster sliding down a hill because I'm sexy and I do what I want",
"I kicked a phone in a hole because I'm sexy and I do what I want",
"I ran over Chuck Norris sliding down a hill because I can.",
"I kicked a football player on your car because I had a vision from God.",
"I loved my science teacher while riding a motorcycle because I'm sexy and I do what I want",
"I licked on a fork at the dinner table because the voices told me to.",
"I ran over a homeless guy in line at the bank because I can't control myself!",
"I loved a gangster on your car because Big Bird told me to.",
"I loved a monster sliding down a hill because I like getting wet.",
"I pooped on a football player under your bed because I'm cool like that",
"I licked on a phone while riding a motorcycle because I can.",
"I danced with my science teacher on your car because the voices told me to.",
"I did the Macarena with my brother in my car because I'm a Ninja!",
"I danced with a birdbath in a swimming pool because that's how I roll.",
"I loved a llama under your bed because the voices told me to.",
"I ran over your mom in a swimming pool because I've got ADD!",
"I trolled a surfer sliding down a hill because that's how I roll.",
"I did the Macarena with a squirrel in a hole because I'm cool like that",
"I trolled a homeless guy under your bed because I think I need some serious help.",
"I trolled a gangster in line at the bank because I'm AWESOME!",
"I jumped on my best friends' boyfriend in your bathroom because I like getting wet.",
"I yelled at a llama in line at the bank because I had an epiphany.",
"I licked on a ninja sliding down a hill because I've got ADD!",
"I did the Macarena with a smurf under your bed because I can.",
"I licked on a goat in an elevator because I'm sexy and I do what I want",
"I karate chopped a squirrel at the dinner table because I'm cool like that",
"I yelled at my neighbour on your car because that's how I roll.",
"I had lunch with a ninja in your bathroom because Daddy would like some sausages.",
"I licked on a birdbath in line at the bank because my family thinks I'm stupid anyway.",
"I had lunch with a football player in a swimming pool because Daddy would like some sausages.",
"I loved a surfer sliding down a hill because I'm really not on drugs!",
"I smelled a phone in line at the bank because I like getting wet."
]
users = {}

import time

start_time = int(time.time()) - 60 * 60 * 24 * 31 # start 31 days ago

def r(scale):
    return int(scale*(1-(1-random.random())**.1))

for i, user in enumerate(usernames):
    users[i] = {'id': i, 'name': user, 'reputation': r(10000)}

f = open('content')
data = json.load(f)
f.close()



def enrich(thing):
    interactions = r(200)
    action = random.choice(['like', 'follow', 'comment'])
    author = random.choice(users)
    mass = author['reputation']
    thing['author'] = author['id']

    post_time = random.randint(start_time, start_time+60 * 60 * 24 * 31)
    mass_history = [(post_time, author['reputation'])]
    acc_history = [(post_time, 1)]
    acc = 1

    contributors = set([author['id']])

    comments = []
    follows = []
    likes = []
    commenters = [users[n] for n in random.sample(users, interactions/10+1)]
    userperm = range(len(usernames))
    random.shuffle(userperm)
    current_user = 0
    popularity = random.random()**.4
    st = post_time
    while post_time < time.time() and acc > 0 and current_user < 250:
        # rule of thumb: 100 interactions that are r(n) seconds apart take n*10 seconds
        # r(10000) will last just slightly more than one day.
        dt = r(30000 * popularity * current_user**.5)
        post_time += dt
        tp = random.random()
        
        acc -= dt / 600000.0 # decay acceleration by decay factor
        acc_history.append((post_time-1, acc))
        
        if tp < .7: # like
            user = users[userperm[current_user]]
            mass += user['reputation'] * 0.01
            acc += .005
            contributors.add(user['id'])
            likes.append({'time': post_time, 'user': user['id']})
            current_user += 1
        elif tp < .9: # comments
            user = random.choice(commenters)
            comment = random.choice(comment_texts)
            comments.append({'time': post_time, "user": user['id'], 'text': comment})
            mass += user['reputation'] * 0.05
            acc += .02
            contributors.add(user['id'])
        else: # follows
            user = users[userperm[current_user]]
            mass += user['reputation'] * 0.1
            acc += .05
            contributors.add(user['id'])
            follows.append({'time': post_time, 'user': user['id']})
            current_user += 1            
        
        acc_history.append((post_time-1, acc))        
        mass_history.append((post_time, mass))

    thing['comments'] = comments
    thing['likes'] = likes
    thing['follows'] = follows
    thing['mass'] = mass
    thing['acc'] = acc
    #thing['contributors'] = list(contributors)
    #thing['acc_history'] = acc_history
    #thing['mass_history'] = mass_history

alive = 0
data = data[:500]
for ind, d in enumerate(data):
    alive = False
    while not alive:
        enrich(d)
        alive = d['acc'] > 0

f = open("mockdb.js", 'w')
f.write("var snutes = ")
f.write(json.dumps(data))
f.write("var users = ")
f.write(json.dumps(users))
f.close()