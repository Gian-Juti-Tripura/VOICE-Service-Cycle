export interface PreacherQA {
  id: string;
  category: 'SCIENCE' | 'KARMA' | 'GURU' | 'PHILOSOPHY' | 'LIFESTYLE';
  questionEn: string;
  questionBn: string;
  shortAnswerEn: string;
  shortAnswerBn: string;
  keyVerses: string[];
}

export interface ShlokaEntry {
  id: string;
  source: string;
  verseNumber: string;
  sanskrit: string;
  bengaliScript: string;
  transliteration: string;
  wordForWordEn?: string;
  wordForWordBn?: string;
  meaningEn: string;
  meaningBn: string;
}

export const PREACHER_QA_LIST: PreacherQA[] = [
  {
    id: 'qa1',
    category: 'SCIENCE',
    questionEn: 'Can modern scientists believe in God? Why is there order in the Universe?',
    questionBn: 'আধুনিক বিজ্ঞানীরা কি ঈশ্বরে বিশ্বাস করতে পারেন? এই মহাবিশ্বে এত সুশৃঙ্খলতা কেন?',
    shortAnswerEn: 'Order implies a designer. Complex laws of gravity, planetary orbits, and DNA coding cannot arise from blind chance.',
    shortAnswerBn: 'সুশৃঙ্খলতা একজন নিখুঁত নকশাকারকে নির্দেশ করে। মহাকর্ষ, গ্রহের কক্ষপথ ও ডিএনএ কোডিং কখনো অন্ধ আকস্মিকতা থেকে আসতে পারে না।',
    keyVerses: ['BG 9.10', 'BG 7.7']
  },
  {
    id: 'qa2',
    category: 'KARMA',
    questionEn: 'Why do bad things happen to good people and innocent children?',
    questionBn: 'ভালো মানুষ এবং নিষ্পাপ শিশুদের সাথে কেন খারাপ ঘটনা ঘটে?',
    shortAnswerEn: 'The soul carries karmic reactions from previous lifetimes. Present suffering is the result of past seeds ripening under infallible cosmic law.',
    shortAnswerBn: 'আত্মা পূর্বজন্মের কর্মফল বহন করে। বর্তমানের কষ্ট অতীত কর্মের বীজের ফল যা অভ্রান্ত কর্মনিয়মের অধীন।',
    keyVerses: ['BG 2.22', 'BG 4.17']
  },
  {
    id: 'qa3',
    category: 'PHILOSOPHY',
    questionEn: 'If God is one, why are there so many different religions and paths?',
    questionBn: 'যদি ভগবান একজন হন, তাহলে পৃথিবীতে এত ভিন্ন ভিন্ন ধর্ম কেন?',
    shortAnswerEn: 'God reveals teachings according to time, place, audience capacity, and cultural eligibility (Adhikara). Like medicine dosages vary, but goal is health.',
    shortAnswerBn: 'ভগবান দেশ, কাল, পাত্র এবং মানুষের ধারণক্ষমতা (অধিকার) অনুসারে শিক্ষা দেন। ওষুধের মাত্রা ভিন্ন হলেও মূল লক্ষ্য রোগ নিরাময়।',
    keyVerses: ['BG 4.11', 'SB 1.2.6']
  },
  {
    id: 'qa4',
    category: 'GURU',
    questionEn: 'Why is a bona fide Spiritual Master (Guru) necessary for spiritual realization?',
    questionBn: 'আত্মোপলব্ধির জন্য সদগুরুর কেন প্রয়োজন?',
    shortAnswerEn: 'Transcendental knowledge cannot be grasped by mundane speculation. It must be received through disciplic succession (Parampara) with submissive inquiry and service.',
    shortAnswerBn: 'দিব্য জ্ঞান জাগতিক অনুমানের মাধ্যমে জানা যায় না। প্রণিপাত, পরিপ্রশ্ন ও সেবার মাধ্যমে পরম্পরা ধারায় সদগুরুর নিকট হতে তা গ্রহণ করতে হয়।',
    keyVerses: ['BG 4.34', 'Mundaka Upanishad 1.2.12']
  },
  {
    id: 'qa5',
    category: 'LIFESTYLE',
    questionEn: 'Why do Vaishnavas strictly follow the 4 Regulative Principles?',
    questionBn: 'বৈষ্ণবরা কেন কঠোরভাবে ৪টি নিয়ম পালন করেন?',
    shortAnswerEn: 'They protect the 4 pillars of Dharma: Austerity (Tapa), Cleanliness (Sauca), Mercy (Daya), and Truthfulness (Satyam).',
    shortAnswerBn: 'এগুলো ধর্মের ৪টি স্তম্ভকে রক্ষা করে: তপস্যা, শুচিতা, দয়া এবং সত্যবাদিতা।',
    keyVerses: ['SB 1.17.38', 'BG 16.21']
  }
];

export const SHLOKA_BOX: ShlokaEntry[] = [
  {
    id: 'bg2_12',
    source: 'Bhagavad Gita',
    verseNumber: '2.12',
    sanskrit: 'न त्वेवाहं जातु नासं न त्वं नेमे जनाधिपाः । न चैव न भविष्यामः सर्वे वयमतः परम् ॥',
    bengaliScript: 'ন ত্বেবাহং জাতু নাসং ন ত্বং নেমে জনাধিপাঃ । ন চৈব ন ভবিষ্যমঃ সর্বে বয়মতঃ পরম্ ॥',
    transliteration: 'na tv evāhaṁ jātu nāsaṁ na tvaṁ neme janādhipāḥ / na caiva na bhaviṣyāmaḥ sarve vayam ataḥ param',
    wordForWordEn: 'na—never; tu—but; eva—certainly; aham—I; jātu—at any time; na—did not; āsam—exist; na—not; tvam—you; na—not; ime—all these; jana-adhipāḥ—kings; na—never; ca—also; eva—certainly; na—not; bhaviṣyāmaḥ—shall exist; sarve vayam—all of us; ataḥ param—hereafter.',
    wordForWordBn: 'ন—কখনই না; তু—কিন্তু; অহম্—আমি; জাতু—কোন কালেই; ন—না; আসম্—ছিলাম; ন—না; ত্বম্—তুমি; নেমে—এই সমস্ত; জনাধিপাঃ—রাজারা; ন চ—এবং না; এব—নিশ্চয়ই; ন—না; ভবিষ্যমঃ—থাকব; সর্বে বয়ম্—আমরা সকলে; অতঃ পরম্—ভবিষ্যতে।',
    meaningEn: 'Never was there a time when I did not exist, nor you, nor all these kings; nor in the future shall any of us cease to be.',
    meaningBn: 'এমন কোন কাল ছিল না যখন আমি, তুমি এবং এই সমস্ত রাজারা বর্তমান ছিলাম না এবং ভবিষ্যতেও কখনো আমাদের অস্তিত্ব বিনষ্ট হবে না।'
  },
  {
    id: 'bg2_13',
    source: 'Bhagavad Gita',
    verseNumber: '2.13',
    sanskrit: 'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा । तथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ॥',
    bengaliScript: 'দেহিনোঽস্মিন্যথা দেহে কৌমারং যৌবনং জরা । তথা দেহান্তরপ্রাপ্তির্ধীরস্তত্র ন মুহ্যতি ॥',
    transliteration: 'dehino \'smin yathā dehe kaumāraṁ yauvanaṁ jarā / tathā dehāntara-prāptir dhīras tatra na muhyati',
    wordForWordEn: 'dehinaḥ—of the embodied soul; asmin—in this; yathā—as; dehe—in the body; kaumāram—boyhood; yauvanam—youth; jarā—old age; tathā—similarly; deha-antara—transmigration of the body; prāptiḥ—achievement; dhīraḥ—the sober person; tatra—thereupon; na—never; muhyati—is deluded.',
    wordForWordBn: 'দেহিনঃ—দেহধারী আত্মার; অস্মিন্—এই; যথা—যেমন; দেহে—দেহে; কৌমারম্—বাল্য; যৌবনম্—যৌবন; জরা—বার্ধক্য; তথা—তেমনই; দেহান্তর-প্রাপ্তিঃ—অন্য দেহ প্রাপ্তি; ধীরঃ—ধীর ব্যক্তি; তত্র—তাহাতে; ন—না; মুহ্যতি—মোহগ্রস্ত হন।',
    meaningEn: 'As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.',
    meaningBn: 'দেহাভ্যন্তরে জীবাত্মা যেমন বাল্য, যৌবন ও জরার মধ্য দিয়ে অতিক্রম করে, তেমনই মৃত্যুর পর আত্মা অন্য দেহ ধারণ করে। ধীর ব্যক্তি এতে মোহগ্রস্ত হন না।'
  },
  {
    id: 'bg2_20',
    source: 'Bhagavad Gita',
    verseNumber: '2.20',
    sanskrit: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः । अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥',
    bengaliScript: 'ন জায়তে ম্রিয়তে বা কদাচিন্নায়ং ভূত্বা ভবিতা বা ন ভূয়ঃ । অজো নিত্যঃ শাশ্বতোঽয়ং পুরাণো ন হন্যতে হন্যমানে শরীরে ॥',
    transliteration: 'na jāyate mriyate vā kadācin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ / ajo nityaḥ śāśvato \'yaṁ purāṇo na hanyate hanyamāne śarīre',
    wordForWordEn: 'na—never; jāyate—takes birth; mriyate—dies; vā—either; kadācit—at any time; na—never; ayam—this soul; bhūtvā—having come into being; bhavitā—will come to be; vā—or; na—not; bhūyaḥ—or is again created; ajaḥ—unborn; nityaḥ—eternal; śāśvataḥ—permanent; ayam—this; purāṇaḥ—the oldest; na—not; hanyate—is killed; hanyamāne—being killed; śarīre—in the body.',
    wordForWordBn: 'ন—না; জায়তে—জন্মগ্রহণ করে; ম্রিয়তে—মারা যায়; বা—বা; কদাচিৎ—কখনও; ন—না; অয়ম্—এই আত্মা; অজঃ—জন্মরহিত; নিত্যঃ—শাশ্বত; পুরাণঃ—পুরাতন; ন হন্যতে—নিহত হয় না; হন্যমানে শরীরে—শরীর বিনষ্ট হলেও।',
    meaningEn: 'For the soul there is neither birth nor death at any time. He has not come into being, does not come into being, and will not come into being. He is unborn, eternal, ever-existing and primeval. He is not slain when the body is slain.',
    meaningBn: 'আত্মার কখনও জন্ম বা মৃত্যু হয় না। তিনি জন্মরহিত, শাশ্বত, নিত্য ও সনাতন। শরীর বিনষ্ট হলেও আত্মা কখনও নিহত হয় না।'
  },
  {
    id: 'bg4_7',
    source: 'Bhagavad Gita',
    verseNumber: '4.7',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    bengaliScript: 'যদা যদা হি ধর্মস্য গ্লানির্ভবতি ভারত । অভ্যুত্থানমধর্মস্য তদাত্মানং সৃজাম্যহম্ ॥',
    transliteration: 'yadā yadā hi dharmasya glānir bhavati bhārata / abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham',
    wordForWordEn: 'yadā yadā—whenever; hi—certainly; dharmasya—of religion; glāniḥ—discrepancies; bhavati—manifests; bhārata—O descendant of Bharata; abhyutthānam—predominance; adharmasya—of irreligion; tadā—at that time; ātmānam—Myself; sṛjāmi—manifest; aham—I.',
    wordForWordBn: 'যদা যদা—যখন যখন; হি—নিশ্চয়ই; ধর্মস্য—ধর্মের; গ্লানিঃ—অধঃপতন; ভবতি—ঘটে; ভারত—হে অর্জুন; অভ্যুত্থানম্—উত্থান; অধর্মস্য—অধর্মের; তদা—তখন; আত্মানম্—নিজেকে; সৃজামি অহম্—আমি প্রকাশিত করি।',
    meaningEn: 'Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself.',
    meaningBn: 'হে ভারত! যখনই ধর্মের গ্লানি এবং অধর্মের অভ্যুত্থান ঘটে, তখনই আমি নিজেকে প্রকাশ বা অবতারিত করি।'
  },
  {
    id: 'bg4_8',
    source: 'Bhagavad Gita',
    verseNumber: '4.8',
    sanskrit: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम् । धर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥',
    bengaliScript: 'পরিত্রাণায় সাধূনাং বিনাশায় চ দুষ্কৃতাম্ । ধর্মসংস্থাপনার্থায় সম্ভবামি যুগে যুগে ॥',
    transliteration: 'paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām / dharma-saṁsthāpanārthāya sambhavāmi yuge yuge',
    wordForWordEn: 'paritrāṇāya—for the deliverance; sādhūnām—of the devotees; vināśāya—for the annihilation; ca—and; duṣkṛtām—of the miscreants; dharma—principles of religion; saṁsthāpana-arthāya—to reestablish; sambhavāmi—I appear; yuge yuge—millennium after millennium.',
    wordForWordBn: 'পরিত্রাণায়—উদ্ধার করার জন্য; সাধূনাম্—সাধুদের; বিনাশায়—বিনাশের জন্য; চ—এবং; দুষ্কৃতাম্—পাপীদের; ধর্মসংস্থাপনার্থায়—ধর্ম পুনঃসংস্থাপনের জন্য; সম্ভবামি—আমি আবির্ভূত হই; যুগে যুগে—যুগে যুগে।',
    meaningEn: 'To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of religion, I Myself appear, millennium after millennium.',
    meaningBn: 'সাধুদের পরিত্রাণ, দুষ্কৃতকারীদের বিনাশ এবং ধর্ম সংস্থাপনের জন্য আমি যুগে যুগে আবির্ভূত হই।'
  },
  {
    id: 'bg4_34',
    source: 'Bhagavad Gita',
    verseNumber: '4.34',
    sanskrit: 'तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया । उपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः ॥',
    bengaliScript: 'তদ্বিদ্ধি প্রণিপাতেন পরিপ্রশ্নেন সেবয়া । উপদেক্ষ্যন্তি তে জ্ঞানং জ্ঞানিনস্তত্ত্বদর্শিনঃ ॥',
    transliteration: 'tad viddhi praṇipātena paripraśnena sevayā / upadekṣyanti te jñānaṁ jñāninas tattva-darśinaḥ',
    wordForWordEn: 'tat—that knowledge; viddhi—understand; praṇipātena—by surrendering; paripraśnena—by all inquiries; sevayā—by rendering service; upadekṣyanti—they will initiate; te—unto you; jñānam—knowledge; jñāninaḥ—the self-realized; tattva—of the truth; darśinaḥ—seers.',
    wordForWordBn: 'তৎ বিদ্ধি—সেই জ্ঞান জানো; প্রণিপাতেন—বিনম্র প্রণিপাত দ্বারা; পরিপ্রশ্নেন—যথার্থ জিজ্ঞাসার দ্বারা; সেবয়া—সেবা দ্বারা; উপদেক্ষ্যন্তি—উপদেশ করবেন; তে—তোমাকে; জ্ঞানম্—তত্ত্বজ্ঞান; জ্ঞানিনঃ—তত্ত্বজ্ঞানী ব্যক্তিগণ।',
    meaningEn: 'Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him. The self-realized souls can impart knowledge unto you because they have seen the truth.',
    meaningBn: 'সদগুরুর শরণাপন্ন হয়ে বিনীত জিজ্ঞাসার দ্বারা এবং তাঁর সেবা করে তত্ত্বজ্ঞান লাভ করার চেষ্টা কর। তত্ত্বদর্শী জ্ঞানী ব্যক্তিগণ তোমাকে সেই জ্ঞান উপদেশ করবেন।'
  },
  {
    id: 'bg7_7',
    source: 'Bhagavad Gita',
    verseNumber: '7.7',
    sanskrit: 'मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय । मयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव ॥',
    bengaliScript: 'মত্তঃ পরতরং নান্যৎকিঞ্চিদস্তি ধনঞ্জয় । ময়ি সর্বমিদং প্রোতং সূত্রে মণিগণ ইব ॥',
    transliteration: 'mattaḥ parataraṁ nānyat kiñcid asti dhanañjaya / mayi sarvam idaṁ protaṁ sūtre maṇi-gaṇā iva',
    wordForWordEn: 'mattaḥ—beyond Me; para-taram—superior; na—not; anyat kiñcit—anything else; asti—there is; dhanañjaya—O conqueror of wealth; mayi—in Me; sarvam—all that exists; idam—this; protam—is strung; sūtre—on a thread; maṇi-gaṇāḥ—pearls; iva—like.',
    wordForWordBn: 'মত্তঃ—আমার চেয়ে; পরতরম্—শ্রেষ্ঠ; ন অন্যৎ কিঞ্চিৎ—অন্য কিছুই; অস্তি—নেই; ধনঞ্জয়—হে অর্জুন; ময়ি—আমাতে; সর্বম্ ইদম্—এই সমগ্র জগৎ; প্রোতম্—গ্রথিত; সূত্রে—সূতায়; মণিগণঃ ইব—মালার মণির মতো।',
    meaningEn: 'O conqueror of wealth, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread.',
    meaningBn: 'হে ধনঞ্জয়! আমার চেয়ে শ্রেষ্ঠ তত্ত্ব আর কিছুই নেই। সূত্রে যেমন মণি গ্রথিত থাকে, তেমনই এই সমগ্র জগৎ আমাতেই ওতপ্রোতভাবে অবস্থান করছে।'
  },
  {
    id: 'bg18_65',
    source: 'Bhagavad Gita',
    verseNumber: '18.65',
    sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु । मामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे ॥',
    bengaliScript: 'মন্মনা ভব মদ্ভক্তো মদ্যাজী মাং নমস্কুরু । মামেবৈষ্যসি সত্যং তে প্রতিজানে প্রিয়োঽসি মে ॥',
    transliteration: 'man-manā bhava mad-bhakto mad-yājī māṁ namaskuru / mām evaiṣyasi satyaṁ te pratijāne priyo \'si me',
    wordForWordEn: 'mat-manāḥ—thinking of Me; bhava—just become; mat-bhaktaḥ—My devotee; mat-yājī—My worshiper; mām—unto Me; namaskuru—offer your obeisances; mām—unto Me; eva—certainly; eṣyasi—you will come; satyam—truly; te—to you; pratijāne—I promise; priyaḥ—dear; asi—you are; me—to Me.',
    wordForWordBn: 'মন্মনা ভব—আমাতে মন অর্পণ কর; মদ্ভক্তঃ—আমার ভক্ত হও; মদ্যাজী—আমার পূজা কর; মাম্ নমস্কুরু—আমাকে প্রণাম কর; মাম্ এব এষ্যসি—আমাকে নিশ্চয়ই লাভ করবে; সত্যম্—সত্যই; তে প্রতিজানে—তোমাকে প্রতিজ্ঞা করছি; প্রিয়ঃ অসি মে—তুমি আমার অত্যন্ত প্রিয়।',
    meaningEn: 'Always think of Me, become My devotee, worship Me and offer your homage unto Me. Thus you will come to Me without fail. I promise you this because you are My very dear friend.',
    meaningBn: 'সর্বদা আমাতে মন অর্পণ কর, আমার ভক্ত হও, আমার পূজা কর এবং আমাকে প্রণাম কর। তাহলে তুমি নিশ্চিতভাবেই আমাকে লাভ করবে। আমি তোমার কাছে সত্য প্রতিজ্ঞা করছি, কারণ তুমি আমার অতি প্রিয় বন্ধু।'
  },
  {
    id: 'bg18_66',
    source: 'Bhagavad Gita',
    verseNumber: '18.66',
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
    bengaliScript: 'সর্বধর্মান্পরিত্যজ্য মামেকং শরণং ব্রজ । অহং ত্বাং সর্বপাপেভ্যো মোক্ষয়িষ্যামি মা শুচঃ ॥',
    transliteration: 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja / ahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ',
    wordForWordEn: 'sarva-dharmān—all varieties of religion; parityajya—abandoning; mām—unto Me; ekam—only; śaraṇam—for surrender; vraja—go; aham—I; tvām—you; sarva—all; pāpebhyaḥ—from sinful reactions; mokṣayiṣyāmi—will deliver; mā—do not; śucaḥ—worry.',
    wordForWordBn: 'সর্বধর্মান্—সকল প্রকার ধর্ম; পরিত্যজ্য—পরিত্যাগ করে; মাম্ একম্—কেবল আমারই; শরণম্ ব্রজ—শরণ গ্রহণ কর; অহম্ ত্বাম্—আমি তোমাকে; সর্বপাপেভ্যঃ—সকল পাপ হতে; মোক্ষয়িষ্যামি—মুক্ত করব; মা শুচঃ—কোনো শোক করো না।',
    meaningEn: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.',
    meaningBn: 'সর্বপ্রকার ধর্ম পরিত্যাগ করে কেবল আমার শরণাগত হও। আমি তোমাকে সমস্ত পাপ হতে মুক্ত করব, তুমি শোক করো না।'
  },
  {
    id: 'cc_adi17_21',
    source: 'Sri Chaitanya Charitamrita',
    verseNumber: 'Adi 17.21',
    sanskrit: 'हरेर्नाम हरेर्नाम हरेर्नामैव केवलम् । कलौ नास्त्येव नास्त्येव नास्त्येव गतिरन्यथा ॥',
    bengaliScript: 'হরের্নাম হরের্নাম হরের্নামৈব কেবলম্ । কলৌ নাস্ত্যেব নাস্ত্যেব নাস্ত্যেব গতিরন্যথা ॥',
    transliteration: 'harer nāma harer nāma harer nāmaiva kevalam / kalau nāsty eva nāsty eva nāsty eva gatir anyathā',
    wordForWordEn: 'hareḥ nāma—the holy name of the Lord Hari; eva—certainly; kevalam—only; kalau—in the Age of Kali; na asti—there is not; eva—certainly; gatiḥ—progress or destination; anyathā—otherwise.',
    wordForWordBn: 'হরের্নাম—হরি নাম; এব কেবলম্—একমাত্র উপায়; কলৌ—কলিযুগে; ন অস্তি এব—নেই নেই নেই; গতিঃ অন্যথা—অন্য কোনো গতি বা উপায়।',
    meaningEn: 'In this Age of Kali there is no other means, no other means, no other means for self-realization than chanting the holy name, chanting the holy name, chanting the holy name of Lord Hari.',
    meaningBn: 'এই কলিযুগে পারমার্থিক উন্নতির জন্য হরিনাম, হরিনাম, হরিনাম ব্যতীত অন্য কোনো গতি নেই, গতি নেই, গতি নেই।'
  }
];
