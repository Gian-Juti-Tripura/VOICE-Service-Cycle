export interface NectarDrop {
  id: string;
  text: string;
  author: string;
  date: string;
  tag?: string;
}

export interface SpiritualLineageProfile {
  id: string;
  name: string;
  nameBn: string;
  titleEn: string;
  titleBn: string;
  roleBadge: string;
  roleBadgeBn: string;
  photo: string;
  appearanceDate: string;
  appearancePlace: string;
  appearancePlaceBn: string;
  spiritualMaster: string;
  spiritualMasterBn: string;
  keyPortfoliosEn: string[];
  keyPortfoliosBn: string[];
  bioEn: string;
  bioBn: string;
  keyAchievementsEn: string[];
  keyAchievementsBn: string[];
  notableBooksEn: string[];
  notableBooksBn: string[];
  quoteEn: string;
  quoteBn: string;
  quoteSource: string;
  voiceContributionEn: string;
  voiceContributionBn: string;
}

export const SPIRITUAL_LINEAGE_DATA: SpiritualLineageProfile[] = [
  {
    id: 'sp_prabhupada',
    name: 'His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada',
    nameBn: 'শ্রীল অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ',
    titleEn: 'Founder-Acharya of the International Society for Krishna Consciousness (ISKCON)',
    titleBn: 'আন্তর্জাতিক কৃষ্ণভাবনামৃত সংঘের (ইসকন) প্রতিষ্ঠাতা-আচার্য',
    roleBadge: '1. Founder-Acharya',
    roleBadgeBn: '১. প্রতিষ্ঠাতা-আচার্য',
    photo: '/assets/srila_prabhupada.jpg',
    appearanceDate: 'September 1, 1896 (Nandotsava)',
    appearancePlace: 'Calcutta (Kolkata), India',
    appearancePlaceBn: 'কলকাতা, ভারত',
    spiritualMaster: 'Srila Bhaktisiddhanta Sarasvati Thakura Goswami Prabhupada',
    spiritualMasterBn: 'শ্রীল ভক্তিসিদ্ধান্ত সরস্বতী গোস্বামী ঠাকুর প্রভুপাদ',
    keyPortfoliosEn: [
      'Founder-Acharya of Global ISKCON Movement (108+ Temples)',
      'Founder of Bhaktivedanta Book Trust (BBT)',
      'Global Pioneer of Sanatana Dharma & Harinama Sankirtana',
      'Inaugurator of Worldwide Food for Life & Sunday Love Feast'
    ],
    keyPortfoliosBn: [
      'বিশ্বব্যাপী ইসকন আন্দোলনের প্রতিষ্ঠাতা-আচার্য (১০৮+ মন্দির)',
      'ভক্তিবেদান্ত বুক ট্রাস্ট (বিবিটি)-এর প্রতিষ্ঠাতা',
      'বিশ্বব্যাপী সনাতন ধর্ম ও হরিনাম সংকীর্তনের পথপ্রদর্শক',
      'আন্তর্জাতিক ফুড ফর লাইফ ও রবিবারীয় মহাপ্রসাদ ভোজের প্রবর্তক'
    ],
    bioEn: 'At the advanced age of 69, with only forty Indian rupees and a trunk of translated Srimad Bhagavatam volumes, Srila Prabhupada boarded the steamship Jaladuta in 1965 to fulfill the prophecy of Sri Chaitanya Mahaprabhu and the order of his spiritual master. Within twelve relentless years, he circled the globe fourteen times, established over 108 temples, initiated thousands of disciples, and translated over 80 volumes of authentic Vedic literature.',
    bioBn: '৬৯ বছর বয়সে মাত্র ৪০ টাকা সম্বল এবং ভাগবতমের কয়েকটি খণ্ড সাথে নিয়ে ১৯৬৫ সালে জলদূত জাহাজে চড়ে শ্রীল প্রভুপাদ আমেরিকায় গমন করেন। পরবর্তী মাত্র ১২ বছরে তিনি ১৪ বার বিশ্ব পরিক্রমা করেন, ১০৮টিরও বেশি মন্দির প্রতিষ্ঠা করেন, লক্ষ লক্ষ মানুষকে হরিনামে উদ্বুদ্ধ করেন এবং বৈদিক শাস্ত্রের প্রামাণ্য অনুবাদ ও তাৎপর্য রচনা করেন।',
    keyAchievementsEn: [
      'Translated Bhagavad-gita As It Is, Srimad-Bhagavatam (18 vols), Chaitanya-Charitamrita (9 vols)',
      'Established BBT, the world\'s largest publisher of Vedic literatures',
      'Initiated global Harinama Sankirtana & Food for Life charity',
      'Established Sridham Mayapur and Sri Krishna Balaram Temple in Vrindavan'
    ],
    keyAchievementsBn: [
      'ভগবদ্গীতা যথাযথ, শ্রীমদ্ভাগবতম (১৮ খণ্ড) ও চৈতন্যচরিতামৃত (৯ খণ্ড) অনুবাদ',
      'বিশ্বের সর্ববৃহৎ বৈদিক প্রকাশনা সংস্থা বিবিটি (BBT) প্রতিষ্ঠা',
      'বিশ্বব্যাপী হরিনাম সংকীর্তন ও ফুড ফর লাইফ কার্যক্রম শুরু',
      'শ্রীধাম মায়াপুর চন্দ্রোদয় মন্দির ও বৃন্দাবন কৃষ্ণ-বলরাম মন্দির প্রতিষ্ঠা'
    ],
    notableBooksEn: [
      'Bhagavad-gita As It Is',
      'Srimad Bhagavatam (18 Volumes)',
      'Sri Caitanya-Caritamrta (9 Volumes)',
      'The Nectar of Devotion (Bhakti-rasamrita-sindhu)',
      'Krsna: The Supreme Personality of Godhead',
      'Sri Isopanisad & Science of Self-Realization',
      'Teachings of Lord Caitanya & Queen Kunti'
    ],
    notableBooksBn: [
      'ভগবদ্গীতা যথাযথ',
      'শ্রীমদ্ভাগবতম (১২ স্কন্ধ, ১৮ খণ্ড)',
      'শ্রীচৈতন্যচরিতামৃত (৯ খণ্ড)',
      'ভক্তিরসামৃতসিন্ধু (ভক্তিসুধা)',
      'শ্রীকৃষ্ণ: পরমেশ্বর ভগবান',
      'শ্রীঈশোপনিষদ ও আত্মবিজ্ঞানের আলো',
      'শ্রীচৈতন্য শিক্ষা ও মহারানী কুন্তীর শিক্ষা'
    ],
    quoteEn: '"These boys are the flower of your country... If you give them this Krishna consciousness, they will become ideal characters."',
    quoteBn: '"এই যুবকেরা আপনাদের দেশের শ্রেষ্ঠ ফুল... তাদের কৃষ্ণভাবনামৃত প্রদান করলে তারা শ্রেষ্ঠ চরিত্রের আদর্শ নাগরিক হবে।"',
    quoteSource: 'Conversation with American Leaders, 1968',
    voiceContributionEn: 'Srila Prabhupada\'s divine vision of creating youth oases in the desert of materialism is the very foundational seed, constitutional inspiration, and philosophical anchor of the entire VOICE movement.',
    voiceContributionBn: 'ভৌতিক মরূদ্যানের মাঝে যুবসমাজের জন্য আধ্যাত্মিক মরূদ্যান (VOICE) গড়ে তোলার শ্রীল প্রভুপাদের দিব্য নির্দেশই ভয়েস আন্দোলনের মূল ভিত্তি।'
  },
  {
    id: 'hh_jayapataka_swami',
    name: 'His Holiness Jayapataka Swami Gurumaharaja',
    nameBn: 'শ্রীশ্রীমৎ জয়পতাকা স্বামী গুরুমহারাজ',
    titleEn: 'ISKCON GBC • Spiritual Master • Minister of Congregational Preaching',
    titleBn: 'জিবিসি সদস্য • আধ্যাত্মিক গুরুদেব • বিশ্বব্যাপী নামহট্ট ও প্রচার মন্ত্রী',
    roleBadge: '2. Spiritual Master',
    roleBadgeBn: '২. আধ্যাত্মিক গুরুদেব',
    photo: '/assets/hh_jayapataka_swami.jpg',
    appearanceDate: 'April 9, 1949 (Rama Navami Period)',
    appearancePlace: 'Milwaukee, Wisconsin, USA (Gordon John Erdman II)',
    appearancePlaceBn: 'মিলওয়াকি, উইসকনসিন, যুক্তরাষ্ট্র',
    spiritualMaster: 'His Divine Grace A.C. Bhaktivedanta Swami Prabhupada (1968)',
    spiritualMasterBn: 'শ্রীল অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ (১৯৬৮)',
    keyPortfoliosEn: [
      'Governing Body Commissioner (GBC) for Bangladesh, Mayapur, Eastern India & South America',
      'Minister for Congregational Development & Preaching (Nama Hatta / Bhakti Vriksha)',
      'Divisional Trustee for Bhaktivedanta Book Trust (BBT)',
      'Co-Supervisor of Temple of the Vedic Planetarium (TOVP) Mayapur'
    ],
    keyPortfoliosBn: [
      'বাংলাদেশ, শ্রীধাম মায়াপুর, পূর্ব ভারত ও দক্ষিণ আমেরিকার জিবিসি',
      'বিশ্বব্যাপী নামহট্ট ও ভক্তি-বৃক্ষ প্রচার মন্ত্রী',
      'ভক্তিবেদান্ত বুক ট্রাস্ট (বিবিটি) ট্রাস্টি',
      'বৈদিক প্ল্যানেটোরিয়াম মন্দির (TOVP) প্রধান তত্ত্বাবধায়ক'
    ],
    bioEn: 'His Holiness Jayapataka Swami received sannyasa initiation in 1970 at Radhakund from Srila Prabhupada at the young age of 21. Entrusted by Prabhupada to develop Sridham Mayapur and expand congregational outreach in Bengal, Bangladesh, and worldwide, he has dedicated over 55 years of tireless service. Despite severe physical challenges and strokes, his determination to fulfill Srila Prabhupada\'s desires is legendary, initiating and guiding tens of thousands of devotees across 90+ countries.',
    bioBn: 'শ্রীশ্রীমৎ জয়পতাকা স্বামী গুরুমহারাজ ১৯৭০ সালে মাত্র ২১ বছর বয়সে রাধাকুণ্ডে শ্রীল প্রভুপাদের নিকট সন্ন্যাস গ্রহণ করেন। প্রভুপাদ তাকে শ্রীধাম মায়াপুর নির্মাণ এবং বাংলা ও বাংলাদেশে ঘরে ঘরে হরিনাম প্রচারের বিশেষ দায়িত্ব অর্পণ করেন। দীর্ঘ ৫৫ বছরেরও বেশি সময় ধরে তিনি অক্লান্তভাবে প্রচার সেবা চালিয়ে যাচ্ছেন। অদম্য শারীরিক বাধা সত্ত্বেও বিশ্বের ৯০টিরও বেশি দেশে লক্ষ লক্ষ ভক্তের আধ্যাত্মিক পথপ্রদর্শক।',
    keyAchievementsEn: [
      'Supervised expansion of ISKCON Sridham Mayapur into world headquarters',
      'Pioneered systematic Nama-Hatta and Bhakti-vriksha preaching reaching millions',
      'Gave unconditional spiritual guidance and sanctuary to the devotees of Bangladesh',
      'Authored numerous spiritual commentaries including Sri Chaitanya Charita Mahakavya translations'
    ],
    keyAchievementsBn: [
      'শ্রীধাম মায়াপুরকে আন্তর্জাতিক সদর দপ্তরে রূপান্তরে অগ্রণী ভূমিকা',
      'নামহট্ট ও ভক্তি-বৃক্ষ ব্যবস্থার মাধ্যমে কোটি মানুষের কাছে হরিনাম প্রচার',
      'বাংলাদেশের সকল ভক্ত ও মন্দিরের পরম আশ্রয় ও পথপ্রদর্শক',
      'শ্রীচৈতন্যচরিত মহাকাব্যসহ বহু প্রামাণ্য বৈষ্ণব গ্রন্থের ভাষ্য ও সংকলন'
    ],
    notableBooksEn: [
      'Spiritual Master and the Disciple',
      'Gauranga: The Golden Incarnation',
      'Vaishnava Ke? - Who is a Vaishnava?',
      'Sri Godruma Kalpatavi Commentary',
      'Lectures on Chaitanya Charitamrita'
    ],
    notableBooksBn: [
      'গুরু ও শিষ্যতত্ত্ব',
      'শ্রী গৌরাঙ্গ: প্রেমাবতার',
      'বৈষ্ণব কে?',
      'শ্রী গোদ্রুম কল্পটবী ভাষ্য',
      'শ্রীচৈতন্য চরিতামৃত প্রবচনমালা'
    ],
    quoteEn: '"I have dedicated my life to fulfill Srila Prabhupada\'s order. As long as I have breath, I will preach the holy names of Lord Chaitanya."',
    quoteBn: '"শ্রীল প্রভুপাদের আদেশ পূরণে আমি আমার জীবন উৎসর্গ করেছি। নিঃশ্বাস থাকা পর্যন্ত আমি শ্রীচৈতন্য মহাপ্রভুর পবিত্র হরিনাম প্রচার করে যাব।"',
    quoteSource: 'Address to Disciples, Sridham Mayapur',
    voiceContributionEn: 'HH Jayapataka Swami Gurumaharaja is the supreme spiritual umbrella and fatherly guardian of ISKCON Bangladesh and all student devotee communities, blessing the VOICE mission with boundless mercy and encouragement.',
    voiceContributionBn: 'গুরুমহারাজ বাংলাদেশ ইসকন ও অদ্বৈত ভয়েস পরিবারের পরম আশ্রয় ও আধ্যাত্মিক অভিভাবক, যাঁর অশেষ কৃপা ও আশীর্বাদে ভয়েস কার্যক্রম পরিচালিত হচ্ছে।'
  },
  {
    id: 'hh_bhakti_purusottama_swami',
    name: 'His Holiness Bhakti Purushottama Swami Maharaj',
    nameBn: 'শ্রীশ্রীমৎ ভক্তিপুরুষোত্তম স্বামী মহারাজ',
    titleEn: 'ISKCON GBC • Co-Director of Sridham Mayapur • Renowned Author',
    titleBn: 'জিবিসি সদস্য • শ্রীধাম মায়াপুর সহ-পরিচালক • প্রখ্যাত গ্রন্থকার',
    roleBadge: '3. Spiritual Mentor',
    roleBadgeBn: '৩. আধ্যাত্মিক অভিভাবক',
    photo: '/assets/hh_bhaktipurusottam_swami.png',
    appearanceDate: '1957',
    appearancePlace: 'Jagannath Puri, Odisha, India (Mahesh Chandra Pattanayak)',
    appearancePlaceBn: 'শ্রী জগন্নাথ পুরী ধাম, ওড়িশা, ভারত',
    spiritualMaster: 'His Holiness Jayapataka Swami (Disciple of Srila Prabhupada)',
    spiritualMasterBn: 'শ্রীশ্রীমৎ জয়পতাকা স্বামী গুরুমহারাজ',
    keyPortfoliosEn: [
      'Governing Body Commissioner (GBC), ISKCON',
      'Co-Director & General Manager of ISKCON Sridham Mayapur',
      'Chairman of India Tribal Care Trust (Assam, Tripura, Odisha, Bengal)',
      'Senior Preacher & International Speaker on Vaishnava Tattva'
    ],
    keyPortfoliosBn: [
      'জিবিসি সদস্য, আন্তর্জাতিক কৃষ্ণভাবনামৃত সংঘ (ইসকন)',
      'শ্রীধাম মায়াপুরের সহ-পরিচালক ও সাধারণ ব্যবস্থাপক',
      'ইন্ডিয়া ট্রাইবাল কেয়ার ট্রাস্টের চেয়ারম্যান (আসাম, ত্রিপুরা, ওড়িশা, বাংলা)',
      'আন্তর্জাতিক বৈষ্ণব তত্ত্ব বক্তা ও গবেষক'
    ],
    bioEn: 'Born in the holy land of Sri Jagannath Puri, Maharaj studied science before dedicating his life to ISKCON in 1976 after being captivated by Srila Prabhupada\'s books. He was initiated by HH Jayapataka Swami in 1979 and accepted sannyasa in 1985. A pillar of Mayapur development and rural outreach, Maharaj has established tribal schools and welfare centers while authoring deeply insightful books on Lord Jagannath, Sri Chaitanya, and Vaishnava parikramas.',
    bioBn: 'শ্রী জগন্নাথ পুরী ধামে জন্ম নেওয়া মহারাজ বিজ্ঞানের ছাত্র ছিলেন। ১৯৭৬ সালে শ্রীল প্রভুপাদের গ্রন্থ পাঠে আকৃষ্ট হয়ে ইসকনে যোগ দেন। ১৯৭৯ সালে শ্রীশ্রীমৎ জয়পতাকা স্বামী গুরুমহারাজের নিকট দীক্ষা ও ১৯৮৫ সালে সন্ন্যাস গ্রহণ করেন। মায়াপুর ব্যবস্থাপনার পাশাপাশি উপজাতীয় অঞ্চলে শিক্ষা ও সেবা কার্যক্রমের জন্য ট্রাইবাল কেয়ার ট্রাস্ট প্রতিষ্ঠা করেন।',
    keyAchievementsEn: [
      'Spearheaded village Nama-Hatta preaching across Eastern India & Bangladesh',
      'Founded India Tribal Care Trust uplifting thousands of underprivileged families',
      'Author of 15+ bestselling books on Lord Jagannath, Srimati Radharani, and Sridham Mayapur',
      'Key architect of Mayapur master plans and international festival coordination'
    ],
    keyAchievementsBn: [
      'পূর্ব ভারত ও বাংলাদেশে গ্রামীন নামহট্ট প্রচারে অবিস্মরণীয় অবদান',
      'উপজাতীয় জনগোষ্ঠীর সেবায় ইন্ডিয়া ট্রাইবাল কেয়ার ট্রাস্টের প্রতিষ্ঠা',
      'শ্রী জগন্নাথের লীলা, শ্রীমতী রাধারাণী ও নবদ্বীপ পরিক্রমা বিষয়ক ১৫টিরও বেশি গ্রন্থের রচয়িতা',
      'শ্রীধাম মায়াপুরের বৈশ্বিক ব্যবস্থাপনা ও উৎসব সমন্বয়'
    ],
    notableBooksEn: [
      'The Pastimes of Lord Jagannatha',
      'Sri Kshetra Parikrama',
      'Sri Navadvipa Parikrama',
      'Death — The Final Call',
      'Maya — The Divine Energy of the Supreme',
      'Glories and Pastimes of Srimati Radharani (Vols 1 & 2)',
      'The Mystery of Ratha-yatra',
      'Who am I?'
    ],
    notableBooksBn: [
      'শ্রীজগন্নাথের লীলামৃত',
      'শ্রীক্ষেত্র পরিক্রমা',
      'শ্রীনবদ্বীপ পরিক্রমা',
      'মৃত্যু — জীবনের অন্তিম আহ্বান',
      'মায়া — পরমেশ্বরের দিব্য শক্তি',
      'শ্রীমতী রাধারাণীর মহিমা ও লীলা',
      'রথযাত্রার রহস্য',
      'আমি কে?'
    ],
    quoteEn: '"By serving the Holy Dhama and hearing the transcendental pastimes of Sri Sri Radha-Madhava and Lord Jagannatha, one\'s heart is cleansed of all material contamination."',
    quoteBn: '"ধাম সেবা এবং শ্রীশ্রী রাধামাধব ও ভগবান শ্রীজগন্নাথের দিব্য লীলা শ্রবণ-কীর্তনের মাধ্যমেই হৃদয়ের সমস্ত অনর্থ বিদূরিত হয়।"',
    quoteSource: 'The Pastimes of Lord Jagannatha Introduction',
    voiceContributionEn: 'HH Bhakti Purushottama Swami Maharaj provides constant spiritual mentorship, moral grounding, and scriptural inspiration to youth across Bangladesh and tribal regions.',
    voiceContributionBn: 'মহারাজ বিশ্ববিদ্যালয় ও ছাত্রাবাসের তরুণ শিক্ষার্থীদের চরিত্র গঠন, উপজাতীয় অঞ্চলের সেবা এবং ভয়েস যুব প্রচারে সার্বক্ষণিক স্নেহময় অভিভাবকত্ব ও নির্দেশনা প্রদান করেন।'
  },
  {
    id: 'hg_radheshyam_prabhu',
    name: 'His Grace Radheshyam Das Prabhu',
    nameBn: 'শ্রীমান রাধেশ্যাম দাস প্রভু',
    titleEn: 'VOICE Architect • M.Tech (IIT Bombay) • President ISKCON NVCC Pune',
    titleBn: 'ভয়েস সিস্টেম স্থপতি • এম.টেক (আইআইটি বোম্বে) • সভাপতি ইসকন পুনে NVCC',
    roleBadge: '4. VOICE Architect',
    roleBadgeBn: '৪. ভয়েস স্থপতি',
    photo: '/assets/hg_radheshyam_prabhu.png',
    appearanceDate: '1968',
    appearancePlace: 'Tamil Nadu / Mumbai, India',
    appearancePlaceBn: 'তামিলনাড়ু / মুম্বাই, ভারত',
    spiritualMaster: 'His Holiness Radhanath Swami (Disciple of Srila Prabhupada)',
    spiritualMasterBn: 'শ্রীশ্রীমৎ রাধানাথ স্বামী মহারাজ',
    keyPortfoliosEn: [
      'Founder & Director of VOICE (Vedic Oasis for Inspiration, Culture & Education)',
      'President of ISKCON NVCC Pune (overseeing 100+ brahmacharis & massive youth community)',
      'Architect of the 854-Topic Systematic VOICE Curriculum (DYS, SS, PT, PROTONS)',
      'Global Speaker at IITs, NITs, MIT, Harvard, Stanford, Cambridge & premier forums'
    ],
    keyPortfoliosBn: [
      'ভয়েস (VOICE - Vedic Oasis for Inspiration, Culture & Education) প্রতিষ্ঠাতা ও পরিচালক',
      'ইসকন পুনে NVCC মন্দিরের সভাপতি',
      '৮৫৪-টপিকের পূর্ণাঙ্গ বৈদিক শিক্ষা সিলেবাসের (DYS, SS, PT) মূল প্রণেতা',
      'বিশ্বখ্যাত আইআইটি, এনআইটি, এমআইটি, হার্ভার্ড ও স্ট্যানফোর্ডে বৈদিক দর্শনের মুখ্য বক্তা'
    ],
    bioEn: 'An outstanding scholar who completed his M.Tech in Mechanical Engineering from the premier Indian Institute of Technology (IIT) Bombay in 1993, Radheshyam Prabhu worked in high-tech corporate research before dedicating his life as a full-time brahmachari in 1994. Recognizing the spiritual vacuum in universities, he formulated the revolutionary VOICE youth hostel model in 1996, creating a bridge between modern scientific education, sharp intellectual rigor, and pure devotion to Lord Krishna.',
    bioBn: '১৯৯৩ সালে ভারতের শ্রেষ্ঠ প্রকৌশল প্রতিষ্ঠান আইআইটি বোম্বে (IIT Bombay) থেকে মেকানিক্যাল ইঞ্জিনিয়ারিংয়ে এম.টেক সম্পন্ন করে তিনি গবেষণা ক্ষেত্রে কর্মজীবন শুরু করেন। পরবর্তীতে ১৯৯৪ সালে পূর্ণকালীন ব্রহ্মচারী হিসেবে আত্মনিয়োগ করেন। শিক্ষার্থীদের জন্য তিনি ১৯৯৬ সালে বৈপ্লবিক \'ভয়েস\' (VOICE) হোস্টেল ও যুব প্রশিক্ষণ মডেল উদ্ভাবন করেন, যা আজ বিশ্বব্যাপী সমাদৃত।',
    keyAchievementsEn: [
      'Trained over 50,000 engineering, medical, and management students in character and spirituality',
      'Established 100+ VOICE student hostels near premier universities across India & Bangladesh',
      'Authored the 5-volume "Essence of Bhagavad Gita" series and 20+ youth training manuals',
      'Recipient of the ISKCON Global Excellency Award (2004) and Jiva Goswami Award (2005)'
    ],
    keyAchievementsBn: [
      '৫০,০০০-এর বেশি প্রকৌশল, চিকিৎসা ও বিশ্ববিদ্যালয়ের ছাত্র-ছাত্রীদের বৈদিক চরিত্র ও নেতৃত্ব প্রশিক্ষণ',
      'ভারত ও বাংলাদেশে শীর্ষস্থানীয় বিশ্ববিদ্যালয়ের নিকটে ১০০টিরও বেশি ভয়েস হোস্টেল প্রতিষ্ঠা',
      '৫ খণ্ডে রচিত বেস্টসেলার "এসেন্স অব ভগবদগীতা" এবং ২০টিরও বেশি পাঠ্যপুস্তকের রচয়িতা',
      'ইসকন গ্লোবাল এক্সিলেন্সি অ্যাওয়ার্ড (২০০৪) ও জীব গোস্বামী পদক লাভ'
    ],
    notableBooksEn: [
      'Discover Your Self (DYS - 6 Sessions)',
      'Essence of Bhagavad Gita (5 Volumes)',
      'Spiritual Scientist (SS)',
      'Positive Thinker (PT / Positron)',
      'Proactive Leader (PL / Protons)',
      'Art of Mind Control',
      'Victory Over Temptation',
      'Stress Management through Yoga',
      'Spirituality for Modern Youth'
    ],
    notableBooksBn: [
      'ডিসকভার ইউরসেলফ (DYS - ৬ সেশন)',
      'এসেন্স অব ভগবদগীতা (৫ খণ্ড)',
      'স্পিরিচুয়াল সায়েন্টিস্ট (SS)',
      'পজিটিভ থিংকার (PT)',
      'প্রোঅ্যাকটিভ লিডার (PL)',
      'মাইন্ড কন্ট্রোল ও মানসিক শান্তি',
      'প্রলোভন জয় ও আত্মনিয়ন্ত্রণ',
      'আধুনিক যুবসমাজের জন্য গীতা ও বিজ্ঞান'
    ],
    quoteEn: '"Dare to be rare! The world has plenty of engineers and doctors, but what the world desperately needs is engineers and doctors with high spiritual character and godly values."',
    quoteBn: '"Dare to be Rare! পৃথিবীতে বহু ইঞ্জিনিয়ার-ডাক্তার রয়েছে, কিন্তু আজ পৃথিবীর সবচেয়ে বেশি প্রয়োজন উন্নত চরিত্রবান ও ভগবৎপ্রেমিক যুবসমাজ।""',
    quoteSource: 'DYS Inaugural Address, IIT Powai',
    voiceContributionEn: 'HG Radheshyam Das Prabhu is the founding architect of the entire VOICE ecosystem, author of all 6 training diplomas, the 13 residential camps, and the daily ashram discipline manuals utilized by Advaita VOICE.',
    voiceContributionBn: 'শ্রীল রাধেশ্যাম দাস প্রভু সমগ্র ভয়েস শিক্ষা পদ্ধতির প্রধান রূপকার; তাঁর রচিত ৬টি কোর্স, ১৩টি ক্যাম্প এবং আশ্রম নিয়মাবলীর আলোকেই আমাদের অদ্বৈত ভয়েস পরিচালিত হচ্ছে।'
  }
];

export interface DevoteeProfile {
  id: string;
  sl: number;
  name: string;
  spiritualName?: string;
  phone: string;
  gmail: string;
  birthday: string; // YYYY-MM-DD
  address: string;
  bloodGroup: string;
  department: string;
  institute: string;
  guardianNumber?: string;
  nationalId?: string;
  serviceType: string;
  roleBadge?: string;
  photo?: string;
  nectarDrops: NectarDrop[];
}

export const INITIAL_DEVOTEES_DATA: DevoteeProfile[] = [
  {
    id: 'dev_caretaker',
    sl: 0,
    name: 'H.G Rasvihari Krishna Chandra Das',
    spiritualName: 'Rasvihari Krishna Chandra Das',
    phone: '01875835986',
    gmail: 'rasvihari.voice@gmail.com',
    birthday: '1985-04-14',
    address: 'Chittagong',
    bloodGroup: 'O+',
    department: 'VOICE Caretaker & Senior Mentor',
    institute: 'ISKCON Chittagong / University of Chittagong',
    guardianNumber: '01875835986',
    nationalId: '1985159823412',
    serviceType: 'Caretaker & Spiritual Guide',
    roleBadge: 'VOICE Caretaker',
    nectarDrops: [
      {
        id: 'nd_1',
        text: 'অসীম ধৈর্য্যশীল, স্নেহাময় গুরুজন এবং তরুণ শিক্ষার্থীদের পরম আধ্যাত্মিক আশ্রয়দাতা।',
        author: 'Advaita VOICE Family',
        date: '2026-08-01',
        tag: 'স্নেহময় আশ্রয়'
      },
      {
        id: 'nd_2',
        text: 'নিয়মিত প্রত্যুষে মঙ্গল আরতিতে উপস্থিতি ও ভক্তদের সাধনায় উৎসাহ প্রদান।',
        author: 'Sadhana Desk',
        date: '2026-08-15',
        tag: 'সাধনা নিষ্ঠা'
      }
    ]
  },
  {
    id: 'dev_coordinator',
    sl: 2,
    name: 'Utpol Das Khocon',
    spiritualName: 'Utpol Das',
    phone: '01790839891',
    gmail: 'utpol.acce.cu@gmail.com',
    birthday: '2001-09-18',
    address: 'Rajshahi',
    bloodGroup: 'A+',
    department: 'ACCE',
    institute: 'University of Chittagong',
    guardianNumber: '01712000000',
    nationalId: '2001769823451',
    serviceType: 'IYF (VOICE Coordinator)',
    roleBadge: 'VOICE Coordinator',
    nectarDrops: [
      {
        id: 'nd_3',
        text: 'দুর্দান্ত সাংগঠনিক দক্ষতা ও সকল সেবায় সর্বদা হাসিমুখে নেতৃত্ব দেন।',
        author: 'Gianjyoti Tripura',
        date: '2026-08-10',
        tag: 'দক্ষ সমন্বয়ক'
      },
      {
        id: 'nd_4',
        text: 'সকল ভক্তের ব্যক্তিগত সুবিধা-অসুবিধা তদারকি ও সেবায় আন্তরিক অনুপ্রেরণা।',
        author: 'Akash Paul',
        date: '2026-08-20',
        tag: 'আন্তরিকতা'
      }
    ]
  },
  {
    id: 'dev_gianjyoti',
    sl: 3,
    name: 'Gianjyoti Tripura',
    spiritualName: 'Gianjyoti Das',
    phone: '01571328549',
    gmail: 'gianjyoti.cse.cu@gmail.com',
    birthday: '2002-11-25',
    address: 'Khagrachari',
    bloodGroup: 'B+',
    department: 'CSE',
    institute: 'University of Chittagong',
    guardianNumber: '01550000000',
    nationalId: '2002159823009',
    serviceType: 'IYF (Digital & IT Incharge)',
    roleBadge: 'IT & Digital Seva',
    nectarDrops: [
      {
        id: 'nd_5',
        text: 'অধ্যবসায়ী, প্রজ্ঞাবান ও প্রযুক্তির মাধ্যমে শ্রী প্রভুপাদের বাণী প্রচারের অক্লান্ত সেবক।',
        author: 'Utpol Das Khocon',
        date: '2026-08-12',
        tag: 'প্রযুক্তি সেবা'
      },
      {
        id: 'nd_6',
        text: 'শান্ত ও ধীরস্থির স্বভাব, যেকোনো জটিল সমস্যার সুশৃঙ্খল সমাধান করেন।',
        author: 'Dipendranath Roy',
        date: '2026-08-22',
        tag: 'শান্ত স্বভাব'
      }
    ]
  },
  {
    id: 'dev_akash',
    sl: 1,
    name: 'Akash Paul',
    spiritualName: 'Akash Das',
    phone: '01799100306',
    gmail: 'akash.socio.cu@gmail.com',
    birthday: '2001-03-12',
    address: 'Feni, Chittagong',
    bloodGroup: 'O+',
    department: 'Sociology',
    institute: 'University of Chittagong',
    guardianNumber: '01799000000',
    nationalId: '2001159876543',
    serviceType: 'IYF',
    roleBadge: 'IYF Youth Leader',
    nectarDrops: [
      {
        id: 'nd_7',
        text: 'মধুর ব্যবহারের অধিকারী এবং নতুন আগত শিক্ষার্থীদের পরম আপন করে নেন।',
        author: 'Ankan Nath',
        date: '2026-08-14',
        tag: 'মধুর স্বভাব'
      }
    ]
  },
  {
    id: 'dev_dipendra',
    sl: 4,
    name: 'Dipendranath Roy',
    spiritualName: 'Dipendra Das',
    phone: '01320903062',
    gmail: 'dipendra.philo.cu@gmail.com',
    birthday: '2002-07-08',
    address: 'Thakurgaon',
    bloodGroup: 'O+',
    department: 'Philosophy',
    institute: 'University of Chittagong',
    guardianNumber: '01320000000',
    nationalId: '2002159876111',
    serviceType: 'IYF',
    roleBadge: 'Philosophical Study',
    nectarDrops: [
      {
        id: 'nd_8',
        text: 'শাস্ত্রীয় দর্শনে গভীর মনোযোগী ও প্রাঞ্জল উপস্থাপনায় দক্ষ।',
        author: 'Sangakara Das',
        date: '2026-08-16',
        tag: 'শাস্ত্রীয় প্রজ্ঞা'
      }
    ]
  },
  {
    id: 'dev_sangakara',
    sl: 5,
    name: 'Sangakara Das',
    spiritualName: 'Sangakara Krishna Das',
    phone: '01722711849',
    gmail: 'sangakara.chem.cu@gmail.com',
    birthday: '2001-12-05',
    address: 'Jashor',
    bloodGroup: 'B+',
    department: 'Chemistry',
    institute: 'University of Chittagong',
    guardianNumber: '01722000000',
    nationalId: '2001159876222',
    serviceType: 'IYF',
    roleBadge: 'Kitchen & Prasadam Seva',
    nectarDrops: [
      {
        id: 'nd_9',
        text: 'ভগবানের ভোগের জন্য অত্যন্ত নিষ্ঠা ও পরিচ্ছন্নতার সাথে প্রসাদ সেবা পরিচালনা করেন।',
        author: 'Utpol Das Khocon',
        date: '2026-08-18',
        tag: 'প্রসাদ সেবা'
      }
    ]
  },
  {
    id: 'dev_ankan',
    sl: 6,
    name: 'Ankan Nath',
    spiritualName: 'Ankan Das',
    phone: '01933503979',
    gmail: 'ankan.socio.cu@gmail.com',
    birthday: '2002-01-20',
    address: 'Feni',
    bloodGroup: 'O+',
    department: 'Sociology',
    institute: 'University of Chittagong',
    guardianNumber: '01933000000',
    nationalId: '2002159876333',
    serviceType: 'IYF',
    roleBadge: 'IYF Seva Member',
    nectarDrops: [
      {
        id: 'nd_10',
        text: 'প্রচার অভিযানে সর্বদা অগ্রগামী ও সহযোগিতাপূর্ণ মনোভাব।',
        author: 'Akash Paul',
        date: '2026-08-19',
        tag: 'উৎসাহী প্রচারক'
      }
    ]
  },
  {
    id: 'dev_antor',
    sl: 7,
    name: 'Antor Kumar Mohanto',
    spiritualName: 'Antor Das',
    phone: '01704370139',
    gmail: 'antor.sanskrit.cu@gmail.com',
    birthday: '2003-04-15',
    address: 'Gaibandha',
    bloodGroup: 'O+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01704000000',
    nationalId: '2003159876444',
    serviceType: 'IYF',
    roleBadge: 'Morning Program Seva',
    nectarDrops: [
      {
        id: 'nd_11',
        text: 'সকালের সাধনা ও শ্লোক উচ্চারণে অত্যন্ত পারদর্শী এবং মধুর কণ্ঠস্বর।',
        author: 'Utshab Sarkar Joy',
        date: '2026-08-21',
        tag: 'শ্লোক আবৃত্তি'
      }
    ]
  },
  {
    id: 'dev_utshab',
    sl: 8,
    name: 'Utshab Sarkar Joy',
    spiritualName: 'Utshab Das',
    phone: '01734550288',
    gmail: 'utshab.joy.cu@gmail.com',
    birthday: '2002-08-28',
    address: 'Mymensingh',
    bloodGroup: 'O+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01734000000',
    nationalId: '2002159876555',
    serviceType: 'IYF',
    roleBadge: 'Kirtan & Bhajan Seva',
    nectarDrops: [
      {
        id: 'nd_12',
        text: 'হৃদয়স্পর্শী সংকীর্তন ও মৃদঙ্গ বাদনে ভক্তদের আনন্দে আত্মহারা করেন।',
        author: 'Roton Roy',
        date: '2026-08-23',
        tag: 'মধুর কীর্তনীয়া'
      }
    ]
  },
  {
    id: 'dev_roton',
    sl: 9,
    name: 'Roton Roy',
    spiritualName: 'Roton Das',
    phone: '01750504601',
    gmail: 'roton.sanskrit.cu@gmail.com',
    birthday: '2002-10-10',
    address: 'Rangpur',
    bloodGroup: 'B+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01750000000',
    nationalId: '2002159876666',
    serviceType: 'IYF',
    roleBadge: 'Study Care Incharge',
    nectarDrops: [
      {
        id: 'nd_13',
        text: 'নম্রতা, বিনয় এবং জুনিয়র ভক্তদের পড়াশোনা ও সাধনায় যত্নশীল পথপ্রদর্শক।',
        author: 'Gianjyoti Tripura',
        date: '2026-08-24',
        tag: 'বিনয়ী ও যত্নশীল'
      }
    ]
  },
  {
    id: 'dev_pranto',
    sl: 10,
    name: 'Pranto Das',
    spiritualName: 'Pranto Krishna Das',
    phone: '01609302008',
    gmail: 'pranto.cse.cu@gmail.com',
    birthday: '2003-02-14',
    address: 'Gazipur',
    bloodGroup: 'AB+',
    department: 'CSE',
    institute: 'University of Chittagong',
    guardianNumber: '01609000000',
    nationalId: '2003159876777',
    serviceType: 'IYF',
    roleBadge: 'Technical Support',
    nectarDrops: [
      {
        id: 'nd_14',
        text: 'কম্পিউটার ও ডিজিটাল প্রচারকাজে যেকোনো মুহূর্তে নিঃস্বার্থ সেবা প্রদান করেন।',
        author: 'Gianjyoti Tripura',
        date: '2026-08-25',
        tag: 'নিঃস্বার্থ সেবা'
      }
    ]
  },
  {
    id: 'dev_joykanto',
    sl: 11,
    name: 'Joykanto Sen',
    spiritualName: 'Joykanto Das',
    phone: '01754034183',
    gmail: 'joykanto.sanskrit.cu@gmail.com',
    birthday: '2002-06-18',
    address: 'Thakurgaon',
    bloodGroup: 'B+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01754000000',
    nationalId: '2002159876888',
    serviceType: 'IYF',
    roleBadge: 'Temple Cleanliness Seva',
    nectarDrops: [
      {
        id: 'nd_15',
        text: 'আশ্রম পরিচ্ছন্নতা ও পূজাসামগ্রী প্রস্তুতিতে নিরলস পরিশ্রমী মনোভাব।',
        author: 'Bappi Chandra Sarkar',
        date: '2026-08-26',
        tag: 'পরিশ্রমী মনোভাব'
      }
    ]
  },
  {
    id: 'dev_bappi',
    sl: 12,
    name: 'Bappi Chandra Sarkar',
    spiritualName: 'Bappi Das',
    phone: '01331982443',
    gmail: 'bappi.sanskrit.cu@gmail.com',
    birthday: '2003-11-02',
    address: 'Panchagarh',
    bloodGroup: 'A+',
    department: 'Sanskrit',
    institute: 'University of Chittagong',
    guardianNumber: '01331000000',
    nationalId: '2003159876999',
    serviceType: 'IYF',
    roleBadge: 'Youth Member',
    nectarDrops: [
      {
        id: 'nd_16',
        text: 'সহজ-সরল আচরণ, সিনিয়রদের আজ্ঞাবহ এবং ভক্তসঙ্গে অত্যন্ত নিষ্ঠাবান।',
        author: 'Utpol Das Khocon',
        date: '2026-08-27',
        tag: 'আজ্ঞাবহ স্বভাব'
      }
    ]
  }
];
