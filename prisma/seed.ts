import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const GAMES_DATA = [
  {
    name: 'Cyberpunk 2077: Ultimate Edition',
    description: 'An open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival. Includes the Phantom Liberty spy-thriller expansion.',
    genre: ['RPG', 'Action', 'Sci-Fi', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/8X2kIfS6fb8',
    sizeGB: 112.5,
    releaseYear: 2023,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Elden Ring: Shadow of the Erdtree',
    description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between, including the massive Shadow of the Erdtree expansion.',
    genre: ['RPG', 'Action', 'Fantasy', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/E3Huy2cdih0',
    sizeGB: 68.4,
    releaseYear: 2024,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Red Dead Redemption 2',
    description: 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age.',
    genre: ['Action', 'Adventure', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/eaW0tYpxyp0',
    sizeGB: 150.0,
    releaseYear: 2019,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Black Myth: Wukong',
    description: 'Black Myth: Wukong is an action RPG rooted in Chinese mythology. You shall set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend.',
    genre: ['Action', 'RPG', 'Adventure'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/pnSsgRJmsCc',
    sizeGB: 128.8,
    releaseYear: 2024,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Grand Theft Auto V: Premium Edition',
    description: 'Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second.',
    genre: ['Action', 'Adventure', 'Open World', 'Racing'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/QkkoHAzjnUs',
    sizeGB: 110.2,
    releaseYear: 2015,
    isFeatured: true,
    isOP: false,
  },
  {
    name: 'Baldur\'s Gate 3',
    description: 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.',
    genre: ['RPG', 'Strategy', 'Adventure', 'Fantasy'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/1T22wNvoNiU',
    sizeGB: 142.0,
    releaseYear: 2023,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'God of War Ragnarök',
    description: 'Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.',
    genre: ['Action', 'Adventure', 'RPG'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/hfJ4Km46A-0',
    sizeGB: 175.0,
    releaseYear: 2024,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Ghost of Tsushima DIRECTOR\'S CUT',
    description: 'A storm is coming. Venture into the complete Ghost of Tsushima DIRECTOR\'S CUT on PC; forge your own path through this open-world action adventure and uncover its hidden wonders.',
    genre: ['Action', 'Adventure', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/RcWk08PBe7k',
    sizeGB: 75.0,
    releaseYear: 2024,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'EA SPORTS FC 25',
    description: 'EA SPORTS FC 25 gives you more ways to win for the club. Team up with friends in your favourite modes with the new 5v5 Rush, and manage your club to victory as FC IQ delivers more tactical control than ever before.',
    genre: ['Sports', 'Simulation'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2669320/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/pBM2xyco_Kg',
    sizeGB: 54.5,
    releaseYear: 2024,
    isFeatured: true,
    isOP: false,
  },
  {
    name: 'Forza Horizon 5: Premium Edition',
    description: 'Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world\'s greatest cars.',
    genre: ['Racing', 'Sports', 'Open World', 'Simulation'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/FYH9n37B7Yw',
    sizeGB: 136.0,
    releaseYear: 2021,
    isFeatured: true,
    isOP: false,
  },
  {
    name: 'Hogwarts Legacy',
    description: 'Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books. Embark on a journey through familiar and new locations as you explore and discover fantastic beasts.',
    genre: ['RPG', 'Adventure', 'Open World', 'Fantasy'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/1O6Qstncpnc',
    sizeGB: 85.0,
    releaseYear: 2023,
    isFeatured: true,
    isOP: false,
  },
  {
    name: 'Resident Evil 4 Remake: Gold Edition',
    description: 'Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, one of the survivors, tracks the president\'s kidnapped daughter to a secluded European village.',
    genre: ['Horror', 'Action', 'Shooter'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/Id2EaldBaWw',
    sizeGB: 67.2,
    releaseYear: 2023,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'The Witcher 3: Wild Hunt - Complete Edition',
    description: 'You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Complete Edition includes Next-Gen update and all expansions.',
    genre: ['RPG', 'Open World', 'Adventure', 'Fantasy'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/c0i88t0Kacs',
    sizeGB: 58.0,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Marvel\'s Spider-Man Remastered',
    description: 'In Marvel\'s Spider-Man Remastered, the worlds of Peter Parker and Spider-Man collide in an original action-packed story. Play as an experienced Peter Parker, fighting big crime and iconic villains in Marvel\'s New York.',
    genre: ['Action', 'Adventure', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/1E051WtpyWg',
    sizeGB: 72.5,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Marvel\'s Spider-Man: Miles Morales',
    description: 'Following the events of Marvel\'s Spider-Man Remastered, teenager Miles Morales is adjusting to his new home while following in the footsteps of his mentor, Peter Parker, as a new Spider-Man.',
    genre: ['Action', 'Adventure', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/NTunTURbyUU',
    sizeGB: 52.0,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Warhammer 40,000: Space Marine 2',
    description: 'Embody the superhuman skill and brutality of a Space Marine. Unleash deadly abilities and devastating weaponry to obliterate the relentless Tyranid swarms.',
    genre: ['Action', 'Shooter', 'Sci-Fi'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2183900/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/m3ef2x1d3fA',
    sizeGB: 75.0,
    releaseYear: 2024,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Silent Hill 2 Remake',
    description: 'Having received a letter from his deceased wife, James heads to where they shared so many memories, in the hope of seeing her one more time: Silent Hill.',
    genre: ['Horror', 'Adventure', 'Puzzle'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2124490/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/pyC_qiW_4ZY',
    sizeGB: 50.4,
    releaseYear: 2024,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Call of Duty: Modern Warfare III',
    description: 'In the direct sequel to the record-breaking Call of Duty: Modern Warfare II, Captain Price and Task Force 141 face off against the ultimate threat, ultranationalist war criminal Vladimir Makarov.',
    genre: ['Shooter', 'Action'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2519060/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/mHDEDDrGYvo',
    sizeGB: 149.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Alan Wake 2: Deluxe Edition',
    description: 'Saga Anderson arrives to investigate ritualistic murders in a small town. Alan Wake pens a dark story to shape the reality around him. These two heroes are somehow connected.',
    genre: ['Horror', 'Adventure', 'Action'],
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dlQ3FeNu5Yw',
    sizeGB: 90.0,
    releaseYear: 2023,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Starfield: Shattered Space',
    description: 'Starfield is the first new universe in over 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4.',
    genre: ['RPG', 'Sci-Fi', 'Open World', 'Shooter'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/pYqyVpCV-3c',
    sizeGB: 125.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Horizon Forbidden West Complete Edition',
    description: 'Experience the epic Horizon Forbidden West in its entirety with bonus content and the Burning Shores expansion included. Join Aloy as she braves a majestic but dangerous new frontier.',
    genre: ['Action', 'RPG', 'Open World', 'Sci-Fi'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2420110/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/95k68w3CE7A',
    sizeGB: 150.0,
    releaseYear: 2024,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'The Last of Us Part I',
    description: 'Experience the emotional storytelling and unforgettable characters in The Last of Us, winner of over 200 Game of the Year awards, rebuilt from the ground up for PC.',
    genre: ['Action', 'Adventure', 'Horror'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/CxVyuE2Nn_w',
    sizeGB: 100.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Sekiro: Shadows Die Twice - GOTY',
    description: 'Carve your own clever path to vengeance in the critically acclaimed adventure from developer FromSoftware, creators of Bloodborne and the Dark Souls series.',
    genre: ['Action', 'Adventure', 'RPG'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/rXMX4YJ7Lks',
    sizeGB: 25.0,
    releaseYear: 2019,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Armored Core VI: Fires of Rubicon',
    description: 'Combining FromSoftware\'s longstanding expertise in mech games with their signature action gameplay, ARMORED CORE VI FIRES OF RUBICON brings a brand-new action experience.',
    genre: ['Action', 'Sci-Fi', 'Shooter'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888160/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/Slk2991h94c',
    sizeGB: 60.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Dragon\'s Dogma 2',
    description: 'Dragon\'s Dogma 2 is a single player, narrative driven action-RPG that challenges the players to choose their own experience – from the appearance of their Arisen, their vocation, their party, and how to approach different situations.',
    genre: ['RPG', 'Action', 'Fantasy', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2054970/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/cT0rIgaiPWA',
    sizeGB: 64.5,
    releaseYear: 2024,
    isFeatured: false,
    isOP: true,
  },
  {
    name: 'Street Fighter 6',
    description: 'Here comes Capcom\'s newest challenger! Street Fighter 6 launches worldwide and represents the next evolution of the Street Fighter series with World Tour, Fighting Ground and Battle Hub.',
    genre: ['Action', 'Sports'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/1INU3FOJsTw',
    sizeGB: 60.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Tekken 8',
    description: 'Get ready for the next chapter in the legendary fighting game franchise, TEKKEN 8. Completely redesigned character visuals and destructible environments powered by Unreal Engine 5.',
    genre: ['Action', 'Sports'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/2hPuRQz6IlM',
    sizeGB: 100.0,
    releaseYear: 2024,
    isFeatured: false,
    isOP: true,
  },
  {
    name: 'Mortal Kombat 1: Khaos Reigns',
    description: 'Discover a reborn Mortal Kombat Universe created by the Fire God Liu Kang. Mortal Kombat 1 ushers in a new era of the iconic franchise with a new fighting system, game modes, and fatalities!',
    genre: ['Action', 'Horror'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/UZ6eFEjFfJ0',
    sizeGB: 138.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Lies of P',
    description: 'Lies of P is a thrilling soulslike that takes the story of Pinocchio, turns it on its head, and sets it against the darkly elegant backdrop of the Belle Epoque era.',
    genre: ['Action', 'RPG', 'Adventure'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/kXZoKdr-xeo',
    sizeGB: 50.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Assassin\'s Creed Mirage',
    description: 'Experience the story of Basim, a cunning street thief with nightmarish visions, seeking answers and justice as he navigates the bustling streets of ninth-century Baghdad.',
    genre: ['Action', 'Adventure', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/3035570/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/x55lAlFtXmw',
    sizeGB: 42.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Assassin\'s Creed Valhalla: Complete',
    description: 'Become Eivor, a legendary Viking raider on a quest for glory. Explore England\'s Dark Ages as you raid your enemies, grow your settlement, and build your political power.',
    genre: ['Action', 'RPG', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2208920/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/ssrNcwxALS4',
    sizeGB: 145.0,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'DOOM Eternal: Deluxe Edition',
    description: 'Hell\'s armies have invaded Earth. Become the Slayer in an epic single-player campaign to conquer demons across dimensions and stop the final destruction of humanity.',
    genre: ['Shooter', 'Action', 'Sci-Fi'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/_UuktemkCFI',
    sizeGB: 89.0,
    releaseYear: 2020,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Death Stranding Director\'s Cut',
    description: 'From legendary game creator Hideo Kojima comes a genre-defying experience, now expanded and remastered for PC in this definitive DIRECTOR\'S CUT.',
    genre: ['Action', 'Adventure', 'Sci-Fi', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1850570/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/Mpn-MC2B6Zc',
    sizeGB: 80.0,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Days Gone',
    description: 'Ride and fight into a deadly, post pandemic America. Play as Deacon St. John, a drifter and bounty hunter who rides the broken road, fighting to survive while searching for a reason to live.',
    genre: ['Action', 'Adventure', 'Open World', 'Horror'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1259420/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/FKtaOY9lMvM',
    sizeGB: 70.0,
    releaseYear: 2021,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Detroit: Become Human',
    description: 'Detroit: Become Human puts the destiny of both mankind and androids in your hands, taking you to a near future where machines have become more intelligent than humans.',
    genre: ['Adventure', 'Sci-Fi'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222140/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/8a-EObAhYrg',
    sizeGB: 55.0,
    releaseYear: 2020,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Final Fantasy XVI',
    description: 'An epic dark fantasy world where the fate of the land is decided by the mighty Eikons and the Dominants who wield them. This is the tale of Clive Rosfield, a warrior granted the title "First Shield of Rosaria".',
    genre: ['RPG', 'Action', 'Fantasy'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2515020/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/v3FFbfZ1_U4',
    sizeGB: 170.0,
    releaseYear: 2024,
    isFeatured: true,
    isOP: true,
  },
  {
    name: 'Final Fantasy VII Remake Intergrade',
    description: 'Cloud Strife, an ex-SOLDIER operative, descends on the mako-powered city of Midgar. The world of the timeless classic FINAL FANTASY VII is reborn.',
    genre: ['RPG', 'Action', 'Fantasy'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/ERgrFVhL-n4',
    sizeGB: 100.0,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Star Wars Jedi: Survivor',
    description: 'The story of Cal Kestis continues in Star Wars Jedi: Survivor, a third-person, galaxy-spanning, action-adventure game from Respawn Entertainment.',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1774580/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/VRaobDJjiec',
    sizeGB: 155.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Dead Space Remake',
    description: 'The sci-fi survival-horror classic Dead Space returns, completely rebuilt from the ground up to offer a deeper, more immersive experience.',
    genre: ['Horror', 'Sci-Fi', 'Shooter'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1693980/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/ctQl9wa3ydE',
    sizeGB: 50.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Metro Exodus: Enhanced Edition',
    description: 'Flee the shattered ruins of the Moscow Metro and embark on an epic, continent-spanning journey across the post-apocalyptic Russian wilderness.',
    genre: ['Shooter', 'Action', 'Horror'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/412020/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/fbbqlvuovQ0',
    sizeGB: 78.0,
    releaseYear: 2021,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Monster Hunter: World - Iceborne',
    description: 'Welcome to a new world! In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience, using everything at your disposal to hunt monsters in a new world.',
    genre: ['Action', 'RPG', 'Adventure'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/OotQrKEqe94',
    sizeGB: 98.0,
    releaseYear: 2020,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Hades II',
    description: 'Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler.',
    genre: ['Action', 'RPG', 'Fantasy'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/l-iHDj3EwdI',
    sizeGB: 12.0,
    releaseYear: 2024,
    isFeatured: false,
    isOP: true,
  },
  {
    name: 'Hollow Knight: Voidheart Edition',
    description: 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs.',
    genre: ['Action', 'Adventure'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/UAO2urG23S4',
    sizeGB: 9.0,
    releaseYear: 2017,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Frostpunk 2',
    description: 'Frostpunk 2 elevates the city-survival genre to a new level. Take the role of a Steward and lead your city through a cascade of calamities taking place in a postapocalyptic, snowy setting.',
    genre: ['Strategy', 'Simulation'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1601580/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/L53s7w3N2sU',
    sizeGB: 30.0,
    releaseYear: 2024,
    isFeatured: false,
    isOP: true,
  },
  {
    name: 'Manor Lords',
    description: 'Manor Lords is a medieval strategy game featuring in-depth city building, large-scale tactical battles, and complex economic and social simulations.',
    genre: ['Strategy', 'Simulation'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1363080/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/p3_7bU-E2nE',
    sizeGB: 16.0,
    releaseYear: 2024,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Total War: WARHAMMER III',
    description: 'The cataclysmic conclusion to the Total War: WARHAMMER trilogy is here. Rally your forces and step into the Realm of Chaos, a dimension of mind-bending horror where the very fate of the world will be decided.',
    genre: ['Strategy', 'Fantasy'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1142710/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/HAr7yUlM0Po',
    sizeGB: 120.0,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Age of Mythology: Retold',
    description: 'From the creators of the award-winning Age of Empires franchise, Age of Mythology: Retold goes beyond history to a mythical age where gods, monsters, and humans collide.',
    genre: ['Strategy', 'Fantasy'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1934680/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/f1sM6X6M5wI',
    sizeGB: 25.0,
    releaseYear: 2024,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Hitman World of Assassination',
    description: 'Enter the world of the ultimate assassin. HITMAN World of Assassination brings together the best of HITMAN, HITMAN 2 and HITMAN 3 including the main campaign, contract mode, escalations and Freelancer.',
    genre: ['Action', 'Strategy', 'Adventure'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/R_3vL1t4RKE',
    sizeGB: 72.0,
    releaseYear: 2023,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Microsoft Flight Simulator: 40th Anniversary',
    description: 'From light planes to wide-body jets, fly highly detailed and accurate aircraft in the next generation of Microsoft Flight Simulator.',
    genre: ['Simulation', 'Open World'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1250410/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/TYqJALPVn0Y',
    sizeGB: 195.0,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'It Takes Two',
    description: 'Embark on the craziest journey of your life in It Takes Two, a genre-bending platform adventure created purely for co-op.',
    genre: ['Adventure', 'Puzzle', 'Action'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/ohClxMmNLQQ',
    sizeGB: 50.0,
    releaseYear: 2021,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'Portal 2: RTX Edition',
    description: 'The "Perpetual Testing Initiative" has been expanded to allow you to design co-op puzzles for you and your friends, enhanced with full ray tracing.',
    genre: ['Puzzle', 'Sci-Fi', 'Adventure'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/tax4e4hBBZc',
    sizeGB: 24.0,
    releaseYear: 2022,
    isFeatured: false,
    isOP: false,
  },
  {
    name: 'F1 24: Champions Edition',
    description: 'Be One of the 20. Drive like the Greatest in EA SPORTS F1 24, the official video game of the 2024 FIA Formula One World Championship.',
    genre: ['Racing', 'Sports', 'Simulation'],
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2488620/library_600x900_2x.jpg',
    trailerUrl: 'https://www.youtube.com/embed/4rCs87muGjc',
    sizeGB: 82.0,
    releaseYear: 2024,
    isFeatured: false,
    isOP: false,
  },
];

async function main() {
  console.log('🚀 Seeding GIGADROP MySQL database...');

  // 1. Site Settings
  const defaultSettings = [
    { key: 'ratePerGB', value: '1.00' },
    { key: 'siteName', value: 'GIGADROP' },
    { key: 'tagline', value: 'Your next world. Ready to drop.' },
    { key: 'contactPhone', value: '+20 100 999 8877' },
    { key: 'contactWhatsapp', value: '+201009998877' },
    { key: 'contactEmail', value: 'drop@gigadrop.eg' },
    { key: 'instapayAddress', value: 'gigadrop@instapay' },
    { key: 'operatingAreas', value: 'Nasr City, Maadi, Heliopolis, New Cairo, Zamalek, Dokki, Mohandessin, 6th of October, Sheikh Zayed, Downtown Cairo' },
    { key: 'deliveryTime', value: '1–2 Days' },
    { key: 'referralDiscountPercent', value: '15' },
    { key: 'bulkThresholdGB', value: '250' },
    { key: 'bulkDiscountPercent', value: '10' },
    { key: 'maintenanceMode', value: 'false' },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // 2. Users
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@gigadrop.eg' },
    update: {},
    create: {
      name: 'Mohamed Admin',
      email: 'admin@gigadrop.eg',
      phone: '+20 100 111 2233',
      whatsapp: '+20 100 111 2233',
      password: adminPassword,
      address: 'New Cairo, 5th Settlement, Cairo',
      role: 'SUPER_ADMIN',
      referralCode: 'GIGA-ADMIN26',
    },
  });

  const supportUser = await prisma.user.upsert({
    where: { email: 'support@gigadrop.eg' },
    update: {},
    create: {
      name: 'Youssef Support',
      email: 'support@gigadrop.eg',
      phone: '+20 109 888 7766',
      whatsapp: '+20 109 888 7766',
      password: adminPassword,
      address: 'Heliopolis, Cairo',
      role: 'SUPPORT',
      referralCode: 'GIGA-SUPP26',
    },
  });

  const ahmedCustomer = await prisma.user.upsert({
    where: { email: 'ahmed@gigadrop.eg' },
    update: {},
    create: {
      name: 'Ahmed Hassan',
      email: 'ahmed@gigadrop.eg',
      phone: '+20 101 234 5678',
      whatsapp: '+20 101 234 5678',
      password: customerPassword,
      address: 'Abbas El-Akkad, Nasr City, Cairo',
      birthdate: new Date('1999-05-14'),
      role: 'CUSTOMER',
      referralCode: 'GIGA-AHMED24',
    },
  });

  const omarCustomer = await prisma.user.upsert({
    where: { email: 'omar@gigadrop.eg' },
    update: {},
    create: {
      name: 'Omar Khaled',
      email: 'omar@gigadrop.eg',
      phone: '+20 112 345 6789',
      whatsapp: '+20 112 345 6789',
      password: customerPassword,
      address: 'Degla, Maadi, Cairo',
      birthdate: new Date('2001-08-20'),
      role: 'CUSTOMER',
      referralCode: 'GIGA-OMAR26',
      referredBy: 'GIGA-AHMED24',
    },
  });

  const saraCustomer = await prisma.user.upsert({
    where: { email: 'sara@gigadrop.eg' },
    update: {},
    create: {
      name: 'Sara Mahmoud',
      email: 'sara@gigadrop.eg',
      phone: '+20 122 987 6543',
      whatsapp: '+20 122 987 6543',
      password: customerPassword,
      address: 'Zamalek, Cairo',
      birthdate: new Date('2000-11-02'),
      role: 'CUSTOMER',
      referralCode: 'GIGA-SARA26',
    },
  });

  // 3. Games (52 PC games)
  await prisma.orderItem.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.game.deleteMany({});

  const createdGames = [];
  for (const g of GAMES_DATA) {
    const game = await prisma.game.create({
      data: {
        name: g.name,
        description: g.description,
        genre: g.genre,
        coverImage: g.coverImage,
        trailerUrl: g.trailerUrl,
        sizeGB: g.sizeGB,
        price: Number((g.sizeGB * 1.0).toFixed(2)),
        releaseYear: g.releaseYear,
        status: 'ACTIVE',
        isFeatured: g.isFeatured,
        isOP: g.isOP,
      },
    });
    createdGames.push(game);
  }

  // 4. Promo Codes
  const promos = [
    { code: 'GIGA10', discountType: 'PERCENTAGE' as const, value: 10, maxUses: 500, usedCount: 14 },
    { code: 'CAIRO25', discountType: 'FIXED' as const, value: 25, maxUses: 200, usedCount: 8 },
    { code: 'DROP50', discountType: 'FIXED' as const, value: 50, maxUses: 100, usedCount: 3 },
  ];

  for (const p of promos) {
    await prisma.promoCode.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  // 5. Sample Orders
  await prisma.payment.deleteMany({});
  await prisma.orderStatusHistory.deleteMany({});
  await prisma.order.deleteMany({});

  const order1Games = [createdGames[0], createdGames[1], createdGames[3]]; // Cyberpunk + Elden Ring + Wukong
  const order1GB = Number(order1Games.reduce((acc, g) => acc + g.sizeGB, 0).toFixed(2));

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'GD-2026-00001',
      userId: ahmedCustomer.id,
      totalGB: order1GB,
      totalPrice: order1GB,
      status: 'DELIVERED',
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      paidAt: new Date(Date.now() - 86400000 * 3),
      customerName: ahmedCustomer.name,
      phone: ahmedCustomer.phone!,
      email: ahmedCustomer.email,
      whatsapp: ahmedCustomer.whatsapp,
      address: ahmedCustomer.address!,
      notes: '1TB Seagate External HDD handed over at City Stars Gate 3.',
      items: {
        create: order1Games.map((g) => ({
          gameId: g.id,
          sizeGB: g.sizeGB,
          price: g.price,
        })),
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Order submitted online', changedBy: 'System' },
          { status: 'PROCESSING', note: 'Hard drive received, loading games', changedBy: superAdmin.name },
          { status: 'READY', note: 'All 309.7 GB verified with SHA-256 check', changedBy: superAdmin.name },
          { status: 'DELIVERED', note: 'Drive delivered & cash collected', changedBy: superAdmin.name },
        ],
      },
      payments: {
        create: {
          method: 'COD',
          amount: order1GB,
          transactionId: 'COD-CAIRO-00001',
          status: 'PAID',
        },
      },
    },
  });

  const order2Games = [createdGames[2], createdGames[6], createdGames[7]]; // RDR2 + GoW + Ghost of Tsushima
  const order2GB = Number(order2Games.reduce((acc, g) => acc + g.sizeGB, 0).toFixed(2));

  await prisma.order.create({
    data: {
      orderNumber: 'GD-2026-00002',
      userId: ahmedCustomer.id,
      totalGB: order2GB,
      totalPrice: order2GB - 25,
      discount: 25,
      promoCode: 'CAIRO25',
      status: 'READY',
      paymentMethod: 'FAWRY',
      paymentStatus: 'PAID',
      paymentRef: 'FWR-984312054',
      paidAt: new Date(Date.now() - 86400000),
      customerName: ahmedCustomer.name,
      phone: ahmedCustomer.phone!,
      email: ahmedCustomer.email,
      whatsapp: ahmedCustomer.whatsapp,
      address: ahmedCustomer.address!,
      items: {
        create: order2Games.map((g) => ({
          gameId: g.id,
          sizeGB: g.sizeGB,
          price: g.price,
        })),
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Order placed with Fawry Pay', changedBy: 'System' },
          { status: 'PROCESSING', note: 'Fawry payment confirmed, loading games', changedBy: superAdmin.name },
          { status: 'READY', note: 'Ready for courier dispatch in Nasr City', changedBy: superAdmin.name },
        ],
      },
      payments: {
        create: {
          method: 'FAWRY',
          amount: order2GB - 25,
          transactionId: 'FWR-984312054',
          status: 'PAID',
        },
      },
    },
  });

  const order3Games = [createdGames[5], createdGames[8], createdGames[9]];
  const order3GB = Number(order3Games.reduce((acc, g) => acc + g.sizeGB, 0).toFixed(2));

  await prisma.order.create({
    data: {
      orderNumber: 'GD-2026-00003',
      userId: omarCustomer.id,
      totalGB: order3GB,
      totalPrice: Number((order3GB * 0.85).toFixed(2)),
      discount: Number((order3GB * 0.15).toFixed(2)),
      referralCodeUsed: 'GIGA-AHMED24',
      status: 'PROCESSING',
      paymentMethod: 'VODAFONE_CASH',
      paymentStatus: 'PAID',
      paymentRef: 'VFC-77210944',
      paidAt: new Date(),
      customerName: omarCustomer.name,
      phone: omarCustomer.phone!,
      email: omarCustomer.email,
      whatsapp: omarCustomer.whatsapp,
      address: omarCustomer.address!,
      items: {
        create: order3Games.map((g) => ({
          gameId: g.id,
          sizeGB: g.sizeGB,
          price: g.price,
        })),
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Order created with referral code GIGA-AHMED24', changedBy: 'System' },
          { status: 'PROCESSING', note: 'Copying files onto WD Black SSD', changedBy: superAdmin.name },
        ],
      },
      payments: {
        create: {
          method: 'VODAFONE_CASH',
          amount: Number((order3GB * 0.85).toFixed(2)),
          transactionId: 'VFC-77210944',
          status: 'PAID',
        },
      },
    },
  });

  const order4Games = [createdGames[10], createdGames[11]];
  const order4GB = Number(order4Games.reduce((acc, g) => acc + g.sizeGB, 0).toFixed(2));

  await prisma.order.create({
    data: {
      orderNumber: 'GD-2026-00004',
      userId: saraCustomer.id,
      totalGB: order4GB,
      totalPrice: order4GB,
      status: 'PENDING',
      paymentMethod: 'INSTAPAY',
      paymentStatus: 'AWAITING_PAYMENT',
      paymentRef: 'INSTA-339102',
      customerName: saraCustomer.name,
      phone: saraCustomer.phone!,
      email: saraCustomer.email,
      whatsapp: saraCustomer.whatsapp,
      address: saraCustomer.address!,
      items: {
        create: order4Games.map((g) => ({
          gameId: g.id,
          sizeGB: g.sizeGB,
          price: g.price,
        })),
      },
      statusHistory: {
        create: [
          { status: 'PENDING', note: 'Awaiting InstaPay transfer verification', changedBy: 'System' },
        ],
      },
      payments: {
        create: {
          method: 'INSTAPAY',
          amount: order4GB,
          transactionId: 'INSTA-339102',
          status: 'AWAITING_PAYMENT',
        },
      },
    },
  });

  // 6. Reviews
  await prisma.review.createMany({
    data: [
      {
        userId: ahmedCustomer.id,
        gameId: createdGames[0].id,
        rating: 5,
        comment: 'Files came completely clean and verified! Handed over my external SSD in Nasr City and got it back the next evening with Cyberpunk 2077 ready to play.',
        helpfulCount: 19,
        isVisible: true,
      },
      {
        userId: omarCustomer.id,
        gameId: createdGames[0].id,
        rating: 5,
        comment: 'Saved me 112 GB of home internet quota! 1 EGP per GB is literally a steal in Cairo.',
        helpfulCount: 12,
        isVisible: true,
      },
      {
        userId: ahmedCustomer.id,
        gameId: createdGames[1].id,
        rating: 5,
        comment: 'Elden Ring + Shadow of the Erdtree ran flawlessly at 60fps right off the drive. Best service ever.',
        helpfulCount: 14,
        isVisible: true,
      },
      {
        userId: saraCustomer.id,
        gameId: createdGames[3].id,
        rating: 5,
        comment: 'Black Myth: Wukong is 128 GB—would have destroyed my monthly WE quota. GIGADROP delivered in 24 hours!',
        helpfulCount: 23,
        isVisible: true,
      },
    ],
  });

  // 7. Wishlist
  await prisma.wishlist.createMany({
    data: [
      { userId: ahmedCustomer.id, gameId: createdGames[5].id },
      { userId: ahmedCustomer.id, gameId: createdGames[15].id },
      { userId: ahmedCustomer.id, gameId: createdGames[16].id },
    ],
  });

  // 8. Referrals
  await prisma.referral.deleteMany({});
  await prisma.referral.createMany({
    data: [
      {
        referrerId: ahmedCustomer.id,
        referredEmail: omarCustomer.email,
        discount: 49.6,
        isUsed: true,
      },
      {
        referrerId: ahmedCustomer.id,
        referredEmail: 'karim.gamer@gmail.com',
        discount: 35.0,
        isUsed: false,
      },
    ],
  });

  // 9. Support Tickets
  await prisma.ticketMessage.deleteMany({});
  await prisma.ticket.deleteMany({});

  await prisma.ticket.create({
    data: {
      userId: ahmedCustomer.id,
      subject: 'Pickup time confirmation for GD-2026-00002',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedTo: supportUser.name,
      messages: {
        create: [
          {
            senderId: ahmedCustomer.id,
            message: 'Hi GIGADROP team! My order GD-2026-00002 is marked READY. Can we meet near City Stars Gate 1 around 7 PM today?',
            isAdmin: false,
          },
          {
            senderId: supportUser.id,
            message: 'Hello Ahmed! Yes, our courier Captain Mostafa will be at City Stars Gate 1 at 7:00 PM sharp with your drive.',
            isAdmin: true,
          },
        ],
      },
    },
  });

  // 10. Notifications
  await prisma.notification.deleteMany({});
  await prisma.notification.createMany({
    data: [
      {
        userId: ahmedCustomer.id,
        title: 'Your Drive is Ready! 🎮',
        message: 'Order GD-2026-00002 (400.00 GB) is loaded and verified. Our courier will contact you shortly.',
        type: 'ORDER_UPDATE',
        isRead: false,
      },
      {
        userId: ahmedCustomer.id,
        title: 'Referral Reward Unlocked! 💸',
        message: 'Your friend Omar Khaled used your code GIGA-AHMED24. You earned 49.60 EGP discount credit!',
        type: 'REFERRAL',
        isRead: false,
      },
      {
        userId: ahmedCustomer.id,
        title: 'Weekend Drop Promo: CAIRO25',
        message: 'Get 25 EGP off any order above 150 GB this weekend using code CAIRO25.',
        type: 'PROMOTION',
        isRead: true,
      },
    ],
  });

  console.log(`✅ Seeded ${createdGames.length} games, 4 users, 4 orders (` + order1.orderNumber + `), promo codes, tickets & reviews!`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
