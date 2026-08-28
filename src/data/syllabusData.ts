export interface SyllabusItem {
  id: string;
  textEn: string;
  textBn?: string;
}

export interface SubChapter {
  title: string;
  badge?: string;
  items: SyllabusItem[];
}

export interface CourseModule {
  id: string;
  courseNumber: number;
  titleEn: string;
  titleBn: string;
  subchapters: SubChapter[];
}

export const SYLLABUS_COURSES: CourseModule[] = [
  {
    "id": "course_1",
    "courseNumber": 1,
    "titleEn": "1. DYS and EBG Courses",
    "titleBn": "ডিসকভার ইয়োর সেলফ এবং এসেন্স অব ভগবদ্গীতা কোর্সসমূহ",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_0_0_0",
            "textEn": "1. Mastermind behind the mysterious Universe",
            "textBn": "রহস্যময় জগতের সুনিপুণ কারিগর"
          },
          {
            "id": "item_0_0_1",
            "textEn": "2. Access the truth beyond four defects",
            "textBn": "চারটি ত্রুটির ঊর্দ্ধে পরম সত্যের অনুসন্ধান"
          },
          {
            "id": "item_0_0_2",
            "textEn": "3. Vedic wisdom — The Privilege of Humanity",
            "textBn": "বৈদিক জ্ঞান — মানব সমাজের জন্য বিশেষ সুবিধা"
          },
          {
            "id": "item_0_0_3",
            "textEn": "4. Science of Soul",
            "textBn": "আত্মার বিজ্ঞান"
          },
          {
            "id": "item_0_0_4",
            "textEn": "5. Substance and Shadow",
            "textBn": "বাস্তব এবং ছায়া"
          },
          {
            "id": "item_0_0_5",
            "textEn": "6. If God is One, why there are so many religions?",
            "textBn": "যদি ভগবান একজন হন তাহলে পৃথিবীতে এত ধর্ম কেন?"
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_0_1_0",
            "textEn": "1. Introduction of Bhagavad Gita",
            "textBn": "ভগবদ্গীতার সূচনা"
          },
          {
            "id": "item_0_1_1",
            "textEn": "2. Material Problems spiritual solutions",
            "textBn": "জাগতিক সমস্যা পারমার্থিক সমাধান"
          },
          {
            "id": "item_0_1_2",
            "textEn": "3. Getting the Eyes of Knowledge",
            "textBn": "জ্ঞানচক্ষুর উন্মোচন"
          },
          {
            "id": "item_0_1_3",
            "textEn": "4. Vedas — The Privilege of Humanity",
            "textBn": "বেদ মানব জাতির পথ প্রদর্শক"
          },
          {
            "id": "item_0_1_4",
            "textEn": "5. Science of Soul",
            "textBn": "আত্মার বিজ্ঞান"
          },
          {
            "id": "item_0_1_5",
            "textEn": "6. Different platforms of worship",
            "textBn": "আরাধনার ভিন্ন ভিন্ন স্তর"
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_0_2_0",
            "textEn": "1. Spirit of Bhagavad Gita",
            "textBn": "ভগবদ্গীতার পটভূমি"
          },
          {
            "id": "item_0_2_1",
            "textEn": "2. Reincarnation — fact or fiction?",
            "textBn": "পুনর্জন্ম — বাস্তব না কল্পনা?"
          },
          {
            "id": "item_0_2_2",
            "textEn": "3. Evolving towards Perfection",
            "textBn": "বিবর্তনের মাধ্যমে সিদ্ধির দিকে"
          },
          {
            "id": "item_0_2_3",
            "textEn": "4. Identifying my divine guide",
            "textBn": "সদ্গুরুর যোগ্যতা"
          },
          {
            "id": "item_0_2_4",
            "textEn": "5. Qualifications of an ideal Disciple",
            "textBn": "আদর্শ শিষ্যের যোগ্যতা"
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_0_3_0",
            "textEn": "1. Peace Formula",
            "textBn": "শান্তির সূত্র"
          },
          {
            "id": "item_0_3_1",
            "textEn": "2. Who should be the object of my worship?",
            "textBn": "আমার আরাধ্য ভগবান কে হওয়া উচিত?"
          },
          {
            "id": "item_0_3_2",
            "textEn": "3. God and gods",
            "textBn": "ভগবান ও দেব-দেবীগণ"
          },
          {
            "id": "item_0_3_3",
            "textEn": "4. Is God Personal or impersonal?",
            "textBn": "ভগবান কি সাকার নাকি নিরাকার?"
          },
          {
            "id": "item_0_3_4",
            "textEn": "5. The Art of Self Management",
            "textBn": "আত্ম-ব্যবস্থাপনার কৌশল"
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_0_4_0",
            "textEn": "1. The three ropes that bind us",
            "textBn": "তিনটি অদৃশ্য রজ্জু — যা আমাদের আবদ্ধ করে"
          },
          {
            "id": "item_0_4_1",
            "textEn": "2. Surpassing Maya",
            "textBn": "মায়া থেকে মুক্তি"
          },
          {
            "id": "item_0_4_2",
            "textEn": "3. Our lost home — Kingdom of God",
            "textBn": "ভগবদ্ধাম — আমাদের হারানো আলয়"
          },
          {
            "id": "item_0_4_3",
            "textEn": "4. Karma — the law of infallible justice",
            "textBn": "কর্ম — অভ্রান্ত বিচারের আইন"
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_0_5_0",
            "textEn": "1. Essence of Bhagavad Gita",
            "textBn": "ভগবদ্গীতার সারতত্ত্ব"
          },
          {
            "id": "item_0_5_1",
            "textEn": "2. Creation and Universal Time",
            "textBn": "সৃষ্টি এবং কাল"
          },
          {
            "id": "item_0_5_2",
            "textEn": "3. Different types of Yoga system",
            "textBn": "বিভিন্ন প্রকার যোগ পদ্ধতি"
          },
          {
            "id": "item_0_5_3",
            "textEn": "4. Practical Application of Bhagavad Gita",
            "textBn": "ভগবদ্গীতার ব্যবহারিক প্রয়োগ"
          },
          {
            "id": "item_0_5_4",
            "textEn": "5. Passing the Final Exam",
            "textBn": "চূড়ান্ত পরীক্ষায় উত্তীর্ণ হওয়া"
          }
        ]
      }
    ]
  },
  {
    "id": "course_2",
    "courseNumber": 2,
    "titleEn": "2. EBG VMML (Sadachar)",
    "titleBn": "বৈষ্ণব সদাচার ও জীবনশৈলী প্রশিক্ষণ",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_1_0_0",
            "textEn": "1. Lifestyle Management — becoming a good animal, craftsman, friend and saint",
            "textBn": ""
          },
          {
            "id": "item_1_0_1",
            "textEn": "2. Serious responsibilities in Human life",
            "textBn": ""
          },
          {
            "id": "item_1_0_2",
            "textEn": "3. Bring out the angel in you — a comparative study of Divine vs Demoniac qualities",
            "textBn": ""
          },
          {
            "id": "item_1_0_3",
            "textEn": "4. Developing Positive Thinking",
            "textBn": ""
          },
          {
            "id": "item_1_0_4",
            "textEn": "5. Eighteen items of knowledge to become a perfect gentleman",
            "textBn": ""
          },
          {
            "id": "item_1_0_5",
            "textEn": "6. Basics of Practical devotional service",
            "textBn": ""
          },
          {
            "id": "item_1_0_6",
            "textEn": "1. Understanding the nature of Mind",
            "textBn": ""
          },
          {
            "id": "item_1_0_7",
            "textEn": "2. Yogic techniques of Concentration",
            "textBn": ""
          },
          {
            "id": "item_1_0_8",
            "textEn": "1. Identifying your true friend — Good association vs Bad association",
            "textBn": ""
          },
          {
            "id": "item_1_0_9",
            "textEn": "1. Importance of good performance in academics / work",
            "textBn": ""
          },
          {
            "id": "item_1_0_10",
            "textEn": "2. Balancing extra-curricular activities, studies along with Krishna consciousness",
            "textBn": ""
          },
          {
            "id": "item_1_0_11",
            "textEn": "3. Singing morning program songs and learning to dance",
            "textBn": ""
          },
          {
            "id": "item_1_0_12",
            "textEn": "4. Teaching how to pronounce Pranama mantras",
            "textBn": ""
          },
          {
            "id": "item_1_0_13",
            "textEn": "5. Panchanga pranam and ashtanga pranam",
            "textBn": ""
          },
          {
            "id": "item_1_0_14",
            "textEn": "6. Philosophy behind applying Tilaka, the method of applying Tilaka and wearing dhotikurta",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_1_1_0",
            "textEn": "1. On becoming a devotee of Krishna",
            "textBn": ""
          },
          {
            "id": "item_1_1_1",
            "textEn": "2. General behaviour and Personal habits",
            "textBn": ""
          },
          {
            "id": "item_1_1_2",
            "textEn": "3. Cleanliness and Hygiene",
            "textBn": ""
          },
          {
            "id": "item_1_1_3",
            "textEn": "4. Handling sacred items",
            "textBn": ""
          },
          {
            "id": "item_1_1_4",
            "textEn": "5. Philosophy of Deity and its worship",
            "textBn": ""
          },
          {
            "id": "item_1_1_5",
            "textEn": "6. Learning the meaning of morning program songs",
            "textBn": ""
          },
          {
            "id": "item_1_1_6",
            "textEn": "7. Humility and Service attitude",
            "textBn": ""
          },
          {
            "id": "item_1_1_7",
            "textEn": "8. Importance of Sadhana (card) — japa, reading, hearing, seva",
            "textBn": ""
          },
          {
            "id": "item_1_1_8",
            "textEn": "1. Glories of the Holy Name",
            "textBn": ""
          },
          {
            "id": "item_1_1_9",
            "textEn": "2. Chanting the Holy name with transcendental faith",
            "textBn": ""
          },
          {
            "id": "item_1_1_10",
            "textEn": "3. Art of keeping the mind aloof from all distractions by chanting",
            "textBn": ""
          },
          {
            "id": "item_1_1_11",
            "textEn": "1. Etiquettes within the temple, Honoring Mahaprasad or Nirmalya",
            "textBn": ""
          },
          {
            "id": "item_1_1_12",
            "textEn": "2. Meditating upon, sitting and talking in front of the Deity",
            "textBn": ""
          },
          {
            "id": "item_1_1_13",
            "textEn": "3. Serving and Honouring Prasadam, Kitchen etiquette",
            "textBn": ""
          },
          {
            "id": "item_1_1_14",
            "textEn": "4. How to read and make notes from SP books",
            "textBn": ""
          },
          {
            "id": "item_1_1_15",
            "textEn": "5. Prajalpa and Janasanga",
            "textBn": ""
          },
          {
            "id": "item_1_1_16",
            "textEn": "6. The Right attitude of a preacher",
            "textBn": ""
          },
          {
            "id": "item_1_1_17",
            "textEn": "7. Authority vs Subordinate — Level I (as subordinate)",
            "textBn": ""
          },
          {
            "id": "item_1_1_18",
            "textEn": "8. Vaishnava aparadh — the mad elephant offense — Level 1",
            "textBn": ""
          },
          {
            "id": "item_1_1_19",
            "textEn": "1. Mangalacharana and Prema dhvani prayers",
            "textBn": ""
          },
          {
            "id": "item_1_1_20",
            "textEn": "2. Prayers for offering bhoga",
            "textBn": ""
          },
          {
            "id": "item_1_1_21",
            "textEn": "3. Attending Class and Arati, Dress and appearance, Kirtans and dancing",
            "textBn": ""
          },
          {
            "id": "item_1_1_22",
            "textEn": "4. Offering Arati to the Lord",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_1_2_0",
            "textEn": "1. Proactive and Reactive behavior",
            "textBn": ""
          },
          {
            "id": "item_1_2_1",
            "textEn": "2. Importance of practicing the spiritual principles strictly",
            "textBn": ""
          },
          {
            "id": "item_1_2_2",
            "textEn": "3. Understanding the spirit behind Prescriptions and Prohibitions",
            "textBn": ""
          },
          {
            "id": "item_1_2_3",
            "textEn": "4. Balancing service and self development",
            "textBn": ""
          },
          {
            "id": "item_1_2_4",
            "textEn": "5. Visiting holy places",
            "textBn": ""
          },
          {
            "id": "item_1_2_5",
            "textEn": "6. Three levels of devotees — Kanishta, Madhyama and Uttama adhikaris",
            "textBn": ""
          },
          {
            "id": "item_1_2_6",
            "textEn": "7. Vaishnava aparadh — the mad elephant offense — Level 2",
            "textBn": ""
          },
          {
            "id": "item_1_2_7",
            "textEn": "1. Methods, Mood and Mellows",
            "textBn": ""
          },
          {
            "id": "item_1_2_8",
            "textEn": "2. Chanting with absorption in Krishna",
            "textBn": ""
          },
          {
            "id": "item_1_2_9",
            "textEn": "3. The Secret Necklace ('trnad api sunicena')",
            "textBn": ""
          },
          {
            "id": "item_1_2_10",
            "textEn": "1. Four regulative principles of freedom (notes available)",
            "textBn": ""
          },
          {
            "id": "item_1_2_11",
            "textEn": "2. Authority vs Subordinate — Level II (as authority)",
            "textBn": ""
          },
          {
            "id": "item_1_2_12",
            "textEn": "1. Japa workshop for improving the quality of Chanting",
            "textBn": ""
          },
          {
            "id": "item_1_2_13",
            "textEn": "2. Observing Ekadashi vrata",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_1_3_0",
            "textEn": "1. Varnashrama system",
            "textBn": ""
          },
          {
            "id": "item_1_3_1",
            "textEn": "2. Hinduism vs Sanatana Dharma",
            "textBn": ""
          },
          {
            "id": "item_1_3_2",
            "textEn": "3. Six urges to be controlled — vijita shad guna",
            "textBn": ""
          },
          {
            "id": "item_1_3_3",
            "textEn": "4. Six items favorable to devotional service",
            "textBn": ""
          },
          {
            "id": "item_1_3_4",
            "textEn": "5. Six items unfavorable to devotional service",
            "textBn": ""
          },
          {
            "id": "item_1_3_5",
            "textEn": "6. Six loving exchanges between devotees",
            "textBn": ""
          },
          {
            "id": "item_1_3_6",
            "textEn": "7. Principle of Yukta vairagya",
            "textBn": ""
          },
          {
            "id": "item_1_3_7",
            "textEn": "8. Keeping principles intact, while adjusting details, avoiding deviations",
            "textBn": ""
          },
          {
            "id": "item_1_3_8",
            "textEn": "9. Twenty-six qualities of a devotee",
            "textBn": ""
          },
          {
            "id": "item_1_3_9",
            "textEn": "10. Vaishnava aparadh — the mad elephant offense — Level 3",
            "textBn": ""
          },
          {
            "id": "item_1_3_10",
            "textEn": "11. Ten offenses against the Holy Name",
            "textBn": ""
          },
          {
            "id": "item_1_3_11",
            "textEn": "12. Three stages of Chanting",
            "textBn": ""
          },
          {
            "id": "item_1_3_12",
            "textEn": "13. Learning the mood of chanting from Shikshastakam prayers",
            "textBn": ""
          },
          {
            "id": "item_1_3_13",
            "textEn": "14. Right attitude towards different ashramas",
            "textBn": ""
          },
          {
            "id": "item_1_3_14",
            "textEn": "15. Practising Steadiness in ups and downs in spiritual life",
            "textBn": ""
          },
          {
            "id": "item_1_3_15",
            "textEn": "16. Authority vs Subordinate — Level III (as leaders)",
            "textBn": ""
          },
          {
            "id": "item_1_3_16",
            "textEn": "17. Laulyam and Prayas",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_3",
    "courseNumber": 3,
    "titleEn": "3. HG Radheshyam Prabhu's Video Lecture Series",
    "titleBn": "শ্রীল রাধেশ্যাম প্রভুর ভিডিও লেকচার সিরিজ",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_2_0_0",
            "textEn": "1. 11-08-04_VIT VOICE_Junior_The importance of Austerity_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_1",
            "textEn": "2. 11-08-11_GGD VOICE_Junior_Rising above the dirt_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_2",
            "textEn": "3. 11-08-18_GGD VOICE_Junior_Glory of spirituality over Piety_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_3",
            "textEn": "4. 11-09-01_GGD VOICE_Junior",
            "textBn": ""
          },
          {
            "id": "item_2_0_4",
            "textEn": "5. 11-09-08_MAYAPUR VOICE_Junior_Material prosperity only by Lord's mercy and not by our own endeavour_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_5",
            "textEn": "6. 11-09-15_GGD VOICE_Junior_The ideal and illusory goals of Jignyasa, Vidya, Karma &amp; Dharma_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_6",
            "textEn": "7. 11-09-19_GGD VOICE_Junior_The importance of cow protection and Brahminical culture_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_7",
            "textEn": "8. 11-10-06_Kolkatta_Junior_Superiority of Bhakti Yoga over other paths_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_8",
            "textEn": "9. 11-10-13_BJ VOICE_Junior_The ultimate dharma is given by Krishna himself_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_9",
            "textEn": "10. 12-01-12_GGD VOICE_Junior_How to become men of strong character I_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_10",
            "textEn": "11. 12-01-19_GGD VOICE_Junior_How to become men of strong character II_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_11",
            "textEn": "12. 12-01-23_GGD VOICE_Junior_Should KC be given directly or indirectly_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_12",
            "textEn": "13. 12-02-10_Junior_Life of the Mahajans — Bhishma and the four Kumaras_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_13",
            "textEn": "14. 12-02-24_MAYAPUR VOICE_Junior",
            "textBn": ""
          },
          {
            "id": "item_2_0_14",
            "textEn": "15. 12-02-25_GGD VOICE_Junior_Qualification of hearer and speaker of Bhagavatam_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_15",
            "textEn": "16. 12-03-15_GGD VOICE_Junior_The symptoms of and remedies for the age of Kaliyuga_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_16",
            "textEn": "17. 12-08-04_SAE VOICE_Different levels of religion &amp; ultimate religion_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_0_17",
            "textEn": "18. 12-05-18_Varnasrama dharma",
            "textBn": ""
          },
          {
            "id": "item_2_0_18",
            "textEn": "19. Vedic women vs Modern women",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_2_1_0",
            "textEn": "1. 11-08-05_SURBHI KUNJ VOICE Senior_Converting misfortune into good fortune_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_1",
            "textEn": "2. 11-08-12_SURBHI KUNJ VOICE Senior_Reception — Vedic vs Modern_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_2",
            "textEn": "3. 11-08-19_SURBHI KUNJ VOICE Senior_Rising above neophyte behaviour_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_3",
            "textEn": "4. 11-08-24_SURBHI KUNJ VOICE Senior_How juniors should behave with their seniors_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_4",
            "textEn": "5. 11-09-02_SURBHI KUNJ VOICE Senior_How seniors should behave with their juniors_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_5",
            "textEn": "6. 11-09-09_SURBHI KUNJ VOICE Senior_How to behave with guru and guru's godbrothers_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_6",
            "textEn": "7. 11-09-16_SURBHI KUNJ VOICE Senior_Friendship with equal devotees_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_7",
            "textEn": "8. 11-09-20_SURBHI KUNJ VOICE Senior_Dealing with equal devotees — Organisation vs Spontaneity_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_8",
            "textEn": "9. 11-09-30_Senior_How should a madhyama adhikari give mercy to less advanced devotee_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_9",
            "textEn": "10. 11-10-07_Senior_How should a madhyama adhikari deal with innocent &amp; atheistic non-devotees_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_10",
            "textEn": "11. 12-01-20_SURBHI KUNJ VOICE Senior_Don't get into blame game_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_11",
            "textEn": "12. 12-01-24_VIT VOICE Senior_Cooperation based on principles_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_12",
            "textEn": "13. 12-02-23_SURBHI KUNJ VOICE Senior_The Money menace — Lessons from Shamantaka pastime_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_13",
            "textEn": "14. 12-02-28_SURBHI KUNJ VOICE Senior_The four fruits of Austerity_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_14",
            "textEn": "15. 12-03-14_DY PATIL VOICE Senior_The four fruits of penance_RSP",
            "textBn": ""
          },
          {
            "id": "item_2_1_15",
            "textEn": "16. 12-04-13_SURBHI KUNJ VOICE Senior_Caution for a devotee dwelling between sinful life &amp; pure life_RSP",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_4",
    "courseNumber": 4,
    "titleEn": "4. Workshops and Camps",
    "titleBn": "ওয়ার্কশপ এবং প্রশিক্ষণ ক্যাম্পসমূহ",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_3_0_0",
            "textEn": "1. Scientific Basis of chanting Hare Krishna",
            "textBn": ""
          },
          {
            "id": "item_3_0_1",
            "textEn": "2. Why we do what we do",
            "textBn": ""
          },
          {
            "id": "item_3_0_2",
            "textEn": "3. Can faith be reasonable?",
            "textBn": ""
          },
          {
            "id": "item_3_0_3",
            "textEn": "4. Ascending from fear to love",
            "textBn": ""
          },
          {
            "id": "item_3_0_4",
            "textEn": "5. Krishna Sudama Video",
            "textBn": ""
          },
          {
            "id": "item_3_0_5",
            "textEn": "6. 'Kailash' Drama and discussion",
            "textBn": ""
          },
          {
            "id": "item_3_0_6",
            "textEn": "7. 'Mrgari' Drama and discussion",
            "textBn": ""
          },
          {
            "id": "item_3_0_7",
            "textEn": "8. \"Your Ever Wellwisher\" video and discussion",
            "textBn": ""
          },
          {
            "id": "item_3_0_8",
            "textEn": "1. Prahlad Maharaj",
            "textBn": ""
          },
          {
            "id": "item_3_0_9",
            "textEn": "2. Chitraketu",
            "textBn": ""
          },
          {
            "id": "item_3_0_10",
            "textEn": "3. Bharat Maharaj",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_3_1_0",
            "textEn": "1. \"Krishna, The Supreme Personality of Godhead\" PPT",
            "textBn": ""
          },
          {
            "id": "item_3_1_1",
            "textEn": "2. Rekindling wisdom",
            "textBn": ""
          },
          {
            "id": "item_3_1_2",
            "textEn": "4. \"Prodigal Son\" Drama and discussion",
            "textBn": ""
          },
          {
            "id": "item_3_1_3",
            "textEn": "5. Importance of chanting Hare Krishna",
            "textBn": ""
          },
          {
            "id": "item_3_1_4",
            "textEn": "6. Reviving Love",
            "textBn": ""
          },
          {
            "id": "item_3_1_5",
            "textEn": "7. Tug of War — Karna",
            "textBn": ""
          },
          {
            "id": "item_3_1_6",
            "textEn": "8. Workshop — Worship — Divine and Mundane",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_3_2_0",
            "textEn": "1. Positive Mental Attitude",
            "textBn": ""
          },
          {
            "id": "item_3_2_1",
            "textEn": "2. Is everything already destined?",
            "textBn": ""
          },
          {
            "id": "item_3_2_2",
            "textEn": "3. Vedic woman vs Modern woman",
            "textBn": ""
          },
          {
            "id": "item_3_2_3",
            "textEn": "4. BG and Art of work",
            "textBn": ""
          },
          {
            "id": "item_3_2_4",
            "textEn": "5. Varnashrama",
            "textBn": ""
          },
          {
            "id": "item_3_2_5",
            "textEn": "6. SP speaks out — Senses — gratification or purification?",
            "textBn": ""
          },
          {
            "id": "item_3_2_6",
            "textEn": "7. SP speaks out — We are animals plus humans",
            "textBn": ""
          },
          {
            "id": "item_3_2_7",
            "textEn": "8. SP speaks out — Where is your religion?",
            "textBn": ""
          },
          {
            "id": "item_3_2_8",
            "textEn": "9. SP speaks out — On seeing God",
            "textBn": ""
          },
          {
            "id": "item_3_2_9",
            "textEn": "10. SP speaks out — Does Krishna know our future?",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_3_3_0",
            "textEn": "1. Six opulences of Krishna",
            "textBn": ""
          },
          {
            "id": "item_3_3_1",
            "textEn": "2. Creation of the universe and The Three Purushavataras",
            "textBn": ""
          },
          {
            "id": "item_3_3_2",
            "textEn": "3. Science behind Deity",
            "textBn": ""
          },
          {
            "id": "item_3_3_3",
            "textEn": "4. Password for happiness",
            "textBn": ""
          },
          {
            "id": "item_3_3_4",
            "textEn": "5. Why do we put faith in spiritual world?",
            "textBn": ""
          },
          {
            "id": "item_3_3_5",
            "textEn": "6. Spiritual world — the place of mirth and merry",
            "textBn": ""
          },
          {
            "id": "item_3_3_6",
            "textEn": "7. Jetage Gurukul",
            "textBn": ""
          },
          {
            "id": "item_3_3_7",
            "textEn": "8. Madhurya Rasa and Radha Tattva",
            "textBn": ""
          },
          {
            "id": "item_3_3_8",
            "textEn": "9. Dealings with Parents, Friends and Relatives",
            "textBn": ""
          },
          {
            "id": "item_3_3_9",
            "textEn": "1. Importance of faith and dangers of doubt &amp; importance of doubting and dangers of blind faith",
            "textBn": ""
          },
          {
            "id": "item_3_3_10",
            "textEn": "2. Scriptures",
            "textBn": ""
          },
          {
            "id": "item_3_3_11",
            "textEn": "3. Philosophy and Process",
            "textBn": ""
          },
          {
            "id": "item_3_3_12",
            "textEn": "4. Science and Scientists",
            "textBn": ""
          },
          {
            "id": "item_3_3_13",
            "textEn": "5. Srila Prabhupada",
            "textBn": ""
          },
          {
            "id": "item_3_3_14",
            "textEn": "6. ISKCON",
            "textBn": ""
          },
          {
            "id": "item_3_3_15",
            "textEn": "7. Devotees",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_3_4_0",
            "textEn": "1. SRCGD Workshop (Service, Respect, Care, Glad to see others advance, Dependence on guru &amp; Krishna)",
            "textBn": ""
          },
          {
            "id": "item_3_4_1",
            "textEn": "2. Workshop: \"Learning to see good in others and avoiding fault finding, correcting without hurting\"",
            "textBn": ""
          },
          {
            "id": "item_3_4_2",
            "textEn": "3. Spirituality for Modern Youth syllabus — Part 1 (YBF Ch 11, 12, 13 &amp; Appendix: Rasa Dance, Avatars)",
            "textBn": ""
          },
          {
            "id": "item_3_4_3",
            "textEn": "1. Prahlad Maharaj teachings to his schoolmates",
            "textBn": ""
          },
          {
            "id": "item_3_4_4",
            "textEn": "2. \"Narada Muni's Past life\" PPT",
            "textBn": ""
          },
          {
            "id": "item_3_4_5",
            "textEn": "3. From Shraddha to Prema",
            "textBn": ""
          },
          {
            "id": "item_3_4_6",
            "textEn": "4. Morality and Transcendental Morality",
            "textBn": ""
          },
          {
            "id": "item_3_4_7",
            "textEn": "5. Developing Vaishnava Relationships — Krishna Sudama storyline",
            "textBn": ""
          },
          {
            "id": "item_3_4_8",
            "textEn": "6. Guru and Initiation",
            "textBn": ""
          },
          {
            "id": "item_3_4_9",
            "textEn": "7. Counselor System",
            "textBn": ""
          },
          {
            "id": "item_3_4_10",
            "textEn": "8. Brahmachari or Grihastha?",
            "textBn": ""
          },
          {
            "id": "item_3_4_11",
            "textEn": "9. \"Simple Temple\" Video and discussion",
            "textBn": ""
          },
          {
            "id": "item_3_4_12",
            "textEn": "10. Lord Chaitanya, the purpose of His appearance, His philosophy",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_3_5_0",
            "textEn": "1. DYS Trainee Preachers Forum",
            "textBn": ""
          },
          {
            "id": "item_3_5_1",
            "textEn": "2. DYS Evaluation",
            "textBn": ""
          },
          {
            "id": "item_3_5_2",
            "textEn": "3. Follow Up Training Workshop (FTW)",
            "textBn": ""
          },
          {
            "id": "item_3_5_3",
            "textEn": "4. Spirituality for Modern Youth — Part 2 (YSJ Ch 1, 2, 3; VOD Ch 1, 4)",
            "textBn": ""
          },
          {
            "id": "item_3_5_4",
            "textEn": "5. Facilitator Empowerment Course (FEC) [Summer Vacation]",
            "textBn": ""
          },
          {
            "id": "item_3_5_5",
            "textEn": "1. Overcoming false ego",
            "textBn": ""
          },
          {
            "id": "item_3_5_6",
            "textEn": "2. Cooperation",
            "textBn": ""
          },
          {
            "id": "item_3_5_7",
            "textEn": "3. Respecting other ashram",
            "textBn": ""
          },
          {
            "id": "item_3_5_8",
            "textEn": "4. DYS Trainee Preachers Forum",
            "textBn": ""
          },
          {
            "id": "item_3_5_9",
            "textEn": "5. ASHRAY Camp (Inner transformation; Three pillars: Integrity, Maturity, Non-envy)",
            "textBn": ""
          },
          {
            "id": "item_3_5_10",
            "textEn": "1. Six steps for success",
            "textBn": ""
          },
          {
            "id": "item_3_5_11",
            "textEn": "2. Learning Success Tips from Hanuman Lanka Trips",
            "textBn": ""
          },
          {
            "id": "item_3_5_12",
            "textEn": "3. Spirituality for Modern Youth — Part 3 (VOD Ch 5, 6, 8, 9, 10)",
            "textBn": ""
          },
          {
            "id": "item_3_5_13",
            "textEn": "1. Six types of materialists",
            "textBn": ""
          },
          {
            "id": "item_3_5_14",
            "textEn": "2. Gratitude and loyalty",
            "textBn": ""
          },
          {
            "id": "item_3_5_15",
            "textEn": "3. Facing the culture shock of moving from college to office",
            "textBn": ""
          },
          {
            "id": "item_3_5_16",
            "textEn": "4. Nectar of Devotion — adau guru padasraya ... first 4 items of the 64 items",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_5",
    "courseNumber": 5,
    "titleEn": "5. Counselor Meetings Syllabus",
    "titleBn": "কাউন্সিলর মিটিং সিলেবাস ও সফট স্কিলস",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_4_0_0",
            "textEn": "1. Ten benefits of cultivating values &amp; mastering the mind",
            "textBn": ""
          },
          {
            "id": "item_4_0_1",
            "textEn": "2. Practical tips for Mind management",
            "textBn": ""
          },
          {
            "id": "item_4_0_2",
            "textEn": "3. Politeness",
            "textBn": ""
          },
          {
            "id": "item_4_0_3",
            "textEn": "4. Simplicity",
            "textBn": ""
          },
          {
            "id": "item_4_0_4",
            "textEn": "5. Truthfulness",
            "textBn": ""
          },
          {
            "id": "item_4_0_5",
            "textEn": "6. Honesty",
            "textBn": ""
          },
          {
            "id": "item_4_0_6",
            "textEn": "7. Love in action",
            "textBn": ""
          },
          {
            "id": "item_4_0_7",
            "textEn": "8. True Friendship",
            "textBn": ""
          },
          {
            "id": "item_4_0_8",
            "textEn": "1. Improving memory and concentration",
            "textBn": ""
          },
          {
            "id": "item_4_0_9",
            "textEn": "2. Seven types of Intelligences",
            "textBn": ""
          },
          {
            "id": "item_4_0_10",
            "textEn": "3. Simple tips for making of a smart student",
            "textBn": ""
          },
          {
            "id": "item_4_0_11",
            "textEn": "4. P.A.R.T.H.A. — the formula for Success",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_4_1_0",
            "textEn": "1. Six items that make one a master of senses",
            "textBn": ""
          },
          {
            "id": "item_4_1_1",
            "textEn": "2. Six items favorable for advancement in KC",
            "textBn": ""
          },
          {
            "id": "item_4_1_2",
            "textEn": "3. Six items unfavorable for advancement in KC",
            "textBn": ""
          },
          {
            "id": "item_4_1_3",
            "textEn": "4. Six types of loving exchanges amongst devotees",
            "textBn": ""
          },
          {
            "id": "item_4_1_4",
            "textEn": "5. Overcoming inferiority complex",
            "textBn": ""
          },
          {
            "id": "item_4_1_5",
            "textEn": "6. Overcoming Superiority complex and Impoliteness",
            "textBn": ""
          },
          {
            "id": "item_4_1_6",
            "textEn": "7. Vairagya and Yukta vairagya",
            "textBn": ""
          },
          {
            "id": "item_4_1_7",
            "textEn": "8. Giving up Sahajyayism",
            "textBn": ""
          },
          {
            "id": "item_4_1_8",
            "textEn": "9. Overcoming Whimsical behaviour",
            "textBn": ""
          },
          {
            "id": "item_4_1_9",
            "textEn": "10. Giving up Lethargy",
            "textBn": ""
          },
          {
            "id": "item_4_1_10",
            "textEn": "11. Fanaticism vs Broadmindedness in applying KC principles",
            "textBn": ""
          },
          {
            "id": "item_4_1_11",
            "textEn": "12. Learning to live with healthy difference in opinions",
            "textBn": ""
          },
          {
            "id": "item_4_1_12",
            "textEn": "1. Public speaking and presentation skills",
            "textBn": ""
          },
          {
            "id": "item_4_1_13",
            "textEn": "2. Communication skills — Expressing one's thoughts and feelings",
            "textBn": ""
          },
          {
            "id": "item_4_1_14",
            "textEn": "3. Time management for students — Balancing Self study and Preaching",
            "textBn": ""
          },
          {
            "id": "item_4_1_15",
            "textEn": "4. Learning Team playing from geese",
            "textBn": ""
          },
          {
            "id": "item_4_1_16",
            "textEn": "5. Fundamental principles of Preaching",
            "textBn": ""
          },
          {
            "id": "item_4_1_17",
            "textEn": "6. Good habits for good health",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_6",
    "courseNumber": 6,
    "titleEn": "6. SP Books Study Course",
    "titleBn": "শ্রীল প্রভুপাদের গ্রন্থ অধ্যায়ন কোর্স",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_5_0_0",
            "textEn": "1. Science of Self Realisation (First 5 chapters)",
            "textBn": ""
          },
          {
            "id": "item_5_0_1",
            "textEn": "2. Coming Back",
            "textBn": ""
          },
          {
            "id": "item_5_0_2",
            "textEn": "3. Perfect Questions and Perfect Answers",
            "textBn": ""
          },
          {
            "id": "item_5_0_3",
            "textEn": "4. Matchless Gift",
            "textBn": ""
          },
          {
            "id": "item_5_0_4",
            "textEn": "5. Raja Vidya",
            "textBn": ""
          },
          {
            "id": "item_5_0_5",
            "textEn": "6. Elevation to KC",
            "textBn": ""
          },
          {
            "id": "item_5_0_6",
            "textEn": "7. Beyond Birth and Death",
            "textBn": ""
          },
          {
            "id": "item_5_0_7",
            "textEn": "8. Krishna — the reservoir of all Pleasure",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_5_1_0",
            "textEn": "1. Science of Self Realisation (Chapters 6–8)",
            "textBn": ""
          },
          {
            "id": "item_5_1_1",
            "textEn": "2. Laws of Nature",
            "textBn": ""
          },
          {
            "id": "item_5_1_2",
            "textEn": "3. Dharma",
            "textBn": ""
          },
          {
            "id": "item_5_1_3",
            "textEn": "4. Second Chance",
            "textBn": ""
          },
          {
            "id": "item_5_1_4",
            "textEn": "5. Sri Isopanishad (Mantra 1–10)",
            "textBn": ""
          },
          {
            "id": "item_5_1_5",
            "textEn": "6. Teachings of Queen Kunti (SP Video)",
            "textBn": ""
          },
          {
            "id": "item_5_1_6",
            "textEn": "7. Enlightenment by Natural Path",
            "textBn": ""
          },
          {
            "id": "item_5_1_7",
            "textEn": "8. Krishna Book (Chapters 1–21)",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_5_2_0",
            "textEn": "1. Life Comes From Life",
            "textBn": ""
          },
          {
            "id": "item_5_2_1",
            "textEn": "2. Teachings of Prahlada Maharaja",
            "textBn": ""
          },
          {
            "id": "item_5_2_2",
            "textEn": "3. Journey of Self Discovery",
            "textBn": ""
          },
          {
            "id": "item_5_2_3",
            "textEn": "4. Teachings of Queen Kunti (RSP classes)",
            "textBn": ""
          },
          {
            "id": "item_5_2_4",
            "textEn": "5. Teachings of Lord Kapila",
            "textBn": ""
          },
          {
            "id": "item_5_2_5",
            "textEn": "6. Nectar of Instruction (Text 1–6)",
            "textBn": ""
          },
          {
            "id": "item_5_2_6",
            "textEn": "7. Bhagavad Gita As It Is (Chapters 1–6)",
            "textBn": ""
          },
          {
            "id": "item_5_2_7",
            "textEn": "8. Krishna Book (Chapters 24–28)",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_5_3_0",
            "textEn": "1. Nectar of Instruction (Text 7–11)",
            "textBn": ""
          },
          {
            "id": "item_5_3_1",
            "textEn": "2. Path of Perfection",
            "textBn": ""
          },
          {
            "id": "item_5_3_2",
            "textEn": "3. Civilization and Transcendence",
            "textBn": ""
          },
          {
            "id": "item_5_3_3",
            "textEn": "4. Hare Krishna Challenge",
            "textBn": ""
          },
          {
            "id": "item_5_3_4",
            "textEn": "5. Bhagavad Gita As It Is (Chapters 7–12)",
            "textBn": ""
          },
          {
            "id": "item_5_3_5",
            "textEn": "6. Teachings of Lord Chaitanya",
            "textBn": ""
          },
          {
            "id": "item_5_3_6",
            "textEn": "7. Srimad Bhagavatam 1st Canto (Chapters 1–6)",
            "textBn": ""
          },
          {
            "id": "item_5_3_7",
            "textEn": "8. Krishna Book (Chapters 35–59)",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_5_4_0",
            "textEn": "1. Bhagavad Gita As It Is (Chapters 13–18)",
            "textBn": ""
          },
          {
            "id": "item_5_4_1",
            "textEn": "2. Srimad Bhagavatam 1st Canto (Chapters 7–13)",
            "textBn": ""
          },
          {
            "id": "item_5_4_2",
            "textEn": "3. Krishna Book (Chapters 63–78)",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_5_5_0",
            "textEn": "1. Srimad Bhagavatam 1st Canto (Chapters 14–19)",
            "textBn": ""
          },
          {
            "id": "item_5_5_1",
            "textEn": "2. Krishna Book (Chapters 78–89)",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_7",
    "courseNumber": 7,
    "titleEn": "7. BG As It Is Study Course",
    "titleBn": "যথার্থ ভগবদ্গীতা গভীর অধ্যায়ন কোর্স",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_6_0_0",
            "textEn": "1. Victory only for one who is on God's side — BG 1.14–20",
            "textBn": ""
          },
          {
            "id": "item_6_0_1",
            "textEn": "2. Protection for Women — Vedic and modern times — BG 1.39–41",
            "textBn": ""
          },
          {
            "id": "item_6_0_2",
            "textEn": "3. KC bears permanent results unlike material activities — BG 2.40",
            "textBn": ""
          },
          {
            "id": "item_6_0_3",
            "textEn": "4. The one Supermarket where you get everything — BG 2.46",
            "textBn": ""
          },
          {
            "id": "item_6_0_4",
            "textEn": "5. Do your best and leave the rest — BG 2.47",
            "textBn": ""
          },
          {
            "id": "item_6_0_5",
            "textEn": "6. Reasons for Krishna's appearance in the material world — BG 4.7–8",
            "textBn": ""
          },
          {
            "id": "item_6_0_6",
            "textEn": "7. Result of realizing Lord Krishna's divinity — BG 4.9",
            "textBn": ""
          },
          {
            "id": "item_6_0_7",
            "textEn": "8. Lord Krishna is never touched by Karma — BG 4.14",
            "textBn": ""
          },
          {
            "id": "item_6_0_8",
            "textEn": "9. Three types of Karma — BG 4.17",
            "textBn": ""
          },
          {
            "id": "item_6_0_9",
            "textEn": "10. Absurd enquiries and Blind following — BG 4.34",
            "textBn": ""
          },
          {
            "id": "item_6_0_10",
            "textEn": "11. If one falls down in KC, is it not failure in both spheres? — BG 6.37–45",
            "textBn": ""
          },
          {
            "id": "item_6_0_11",
            "textEn": "12. Lord is the ultimate Owner and Controller — BG 7.4–7",
            "textBn": ""
          },
          {
            "id": "item_6_0_12",
            "textEn": "13. Examples to show how everything depends on Krishna — BG 7.8–12",
            "textBn": ""
          },
          {
            "id": "item_6_0_13",
            "textEn": "14. Those who don't surrender to Krishna — BG 7.15",
            "textBn": ""
          },
          {
            "id": "item_6_0_14",
            "textEn": "15. Those who surrender to Krishna — BG 7.16",
            "textBn": ""
          },
          {
            "id": "item_6_0_15",
            "textEn": "16. How to remember Krishna at the time of death — BG 8.5–8",
            "textBn": ""
          },
          {
            "id": "item_6_0_16",
            "textEn": "17. Krishna consciousness is Safe, Certain and Direct — BG 8.27–28",
            "textBn": ""
          },
          {
            "id": "item_6_0_17",
            "textEn": "18. How simple and easy the path of Bhakti is for a sincere devotee? — BG 9.26–28",
            "textBn": ""
          },
          {
            "id": "item_6_0_18",
            "textEn": "19. Advantages of learning about opulences and expansions of Krishna — BG 10.41–42",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_6_1_0",
            "textEn": "20. One pointed and many branched intelligence — BG 2.41",
            "textBn": ""
          },
          {
            "id": "item_6_1_1",
            "textEn": "21. Sex — the shackle for the disobedient criminals — BG 3.38–39",
            "textBn": ""
          },
          {
            "id": "item_6_1_2",
            "textEn": "22. Right use of free will — BG 3.40–42",
            "textBn": ""
          },
          {
            "id": "item_6_1_3",
            "textEn": "23. Importance of Celibacy — BG 6.13–14",
            "textBn": ""
          },
          {
            "id": "item_6_1_4",
            "textEn": "24. Is it really possible to control the mind? — BG 6.33–36",
            "textBn": ""
          },
          {
            "id": "item_6_1_5",
            "textEn": "25. Developing Attachment to Krishna by Hearing — BG 7.1–2",
            "textBn": ""
          },
          {
            "id": "item_6_1_6",
            "textEn": "26. Surpass maya by surrendering to Krishna — BG 7.14",
            "textBn": ""
          },
          {
            "id": "item_6_1_7",
            "textEn": "27. Glories of spiritual world in contrast to material world — BG 8.15–22",
            "textBn": ""
          },
          {
            "id": "item_6_1_8",
            "textEn": "28. Hearing about Krishna — Glories, Qualifications and Advantages — BG 9.1–3",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_6_2_0",
            "textEn": "29. Contemplating on enemy's welfare — BG 1.45",
            "textBn": ""
          },
          {
            "id": "item_6_2_1",
            "textEn": "30. Rising above Indecision — BG 2.6–7",
            "textBn": ""
          },
          {
            "id": "item_6_2_2",
            "textEn": "31. Without Guru's help, academic knowledge and high position are useless — BG 2.8",
            "textBn": ""
          },
          {
            "id": "item_6_2_3",
            "textEn": "32. Bewilderments arising from attachments — BG 2.44",
            "textBn": ""
          },
          {
            "id": "item_6_2_4",
            "textEn": "33. Symptoms and behaviour of a sthita prajna (self realized soul) — BG 2.54–72",
            "textBn": ""
          },
          {
            "id": "item_6_2_5",
            "textEn": "34. Duties of one who is overly attached to material life — BG 3.10–16",
            "textBn": ""
          },
          {
            "id": "item_6_2_6",
            "textEn": "35. Acting without attachment to set an example for society — BG 3.19–22",
            "textBn": ""
          },
          {
            "id": "item_6_2_7",
            "textEn": "36. Need of discipline and surrender — BG 3.30",
            "textBn": ""
          },
          {
            "id": "item_6_2_8",
            "textEn": "37. Results of Following or Deriding the good instructions — BG 3.31–32",
            "textBn": ""
          },
          {
            "id": "item_6_2_9",
            "textEn": "38. Authenticity of Bhagavad Gita — BG 4.1–5",
            "textBn": ""
          },
          {
            "id": "item_6_2_10",
            "textEn": "39. Result of taking shelter of Krishna with other desires — BG 4.11",
            "textBn": ""
          },
          {
            "id": "item_6_2_11",
            "textEn": "40. Becoming an instrument in Lord's hands — BG 4.21",
            "textBn": ""
          },
          {
            "id": "item_6_2_12",
            "textEn": "41. How to perform Karma Yoga? — BG 5.7–12",
            "textBn": ""
          },
          {
            "id": "item_6_2_13",
            "textEn": "42. Internal and External behaviour of a self realized soul — BG 5.23–26",
            "textBn": ""
          },
          {
            "id": "item_6_2_14",
            "textEn": "43. Symptoms of a person with a controlled mind — BG 6.7–9",
            "textBn": ""
          },
          {
            "id": "item_6_2_15",
            "textEn": "44. Patience of a yogi for attaining success in Samadhi — BG 6.25–26",
            "textBn": ""
          },
          {
            "id": "item_6_2_16",
            "textEn": "45. The topmost yogi is one who always remembers Krishna — BG 6.46–47",
            "textBn": ""
          },
          {
            "id": "item_6_2_17",
            "textEn": "46. How does Krishna deal with demigod surrender? — BG 7.20–23",
            "textBn": ""
          },
          {
            "id": "item_6_2_18",
            "textEn": "47. Overcoming inability to recognize and serve Krishna — BG 7.25–30",
            "textBn": ""
          },
          {
            "id": "item_6_2_19",
            "textEn": "48. Duratmas, Mahatmas and others — BG 9.11–15",
            "textBn": ""
          },
          {
            "id": "item_6_2_20",
            "textEn": "49. Faults of indirect worship / Krishna is Supreme object of worship — BG 9.16–22",
            "textBn": ""
          },
          {
            "id": "item_6_2_21",
            "textEn": "50. Demigods and their relationship to Krishna — BG 9.23–25",
            "textBn": ""
          },
          {
            "id": "item_6_2_22",
            "textEn": "51. Krishna is not partial to anyone — BG 9.29",
            "textBn": ""
          },
          {
            "id": "item_6_2_23",
            "textEn": "52. Hating the sin and loving a sinner — BG 9.30–31",
            "textBn": ""
          },
          {
            "id": "item_6_2_24",
            "textEn": "53. What Qualifications are required to attain Supreme destination? — BG 9.32–34",
            "textBn": ""
          },
          {
            "id": "item_6_2_25",
            "textEn": "54. Chatushloki BG — BG 10.8–11",
            "textBn": ""
          },
          {
            "id": "item_6_2_26",
            "textEn": "55. Supremacy of Krishna confirmed — BG 10.12–14",
            "textBn": ""
          },
          {
            "id": "item_6_2_27",
            "textEn": "56. Seeing Krishna everywhere manifested by physical representations — BG 10.17–18",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_6_3_0",
            "textEn": "57. When is the best time to give up worldly duties? — BG 3.17",
            "textBn": ""
          },
          {
            "id": "item_6_3_1",
            "textEn": "58. Difference between following and imitating — BG 3.24",
            "textBn": ""
          },
          {
            "id": "item_6_3_2",
            "textEn": "59. Attached and Detached worker — BG 3.25–32",
            "textBn": ""
          },
          {
            "id": "item_6_3_3",
            "textEn": "60. Power of habits and the solution for rising above them — BG 3.33–36",
            "textBn": ""
          },
          {
            "id": "item_6_3_4",
            "textEn": "61. Types of Sacrifices and the ultimate goal of Sacrifice — BG 4.25–33",
            "textBn": ""
          },
          {
            "id": "item_6_3_5",
            "textEn": "62. Vision of a self realized soul — BG 5.18–21",
            "textBn": ""
          },
          {
            "id": "item_6_3_6",
            "textEn": "63. The stage of intimate relationship with the Supreme Lord — BG 6.30",
            "textBn": ""
          },
          {
            "id": "item_6_3_7",
            "textEn": "64. Comparison of those who approach Krishna — BG 7.17–18",
            "textBn": ""
          },
          {
            "id": "item_6_3_8",
            "textEn": "65. Impetus for surrender to Krishna — BG 7.19",
            "textBn": ""
          },
          {
            "id": "item_6_3_9",
            "textEn": "66. The imposition theory of impersonalist monist is false — BG 7.24",
            "textBn": ""
          },
          {
            "id": "item_6_3_10",
            "textEn": "67. Mystery of Krishna — BG 9.4–6",
            "textBn": ""
          },
          {
            "id": "item_6_3_11",
            "textEn": "68. Majesty of Krishna — BG 9.7–10",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_8",
    "courseNumber": 8,
    "titleEn": "8. Vani Syllabus — Morning Program Series",
    "titleBn": "বাণী সিলেবাস — শ্রীল প্রভুপাদের প্রাতঃকালীন ভাগবতম লেকচার সংকলন",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_7_0_0",
            "textEn": "1. SB 1.1.1_Increasing Your Problems_20feb75_CA",
            "textBn": ""
          },
          {
            "id": "item_7_0_1",
            "textEn": "2. SB 1.1.1_Car Is Ford--Ford Is Not Car_21feb75_CA",
            "textBn": ""
          },
          {
            "id": "item_7_0_2",
            "textEn": "3. SB 1.1.2_Dependent On Krishna's Mercy_23feb75_CA",
            "textBn": ""
          },
          {
            "id": "item_7_0_3",
            "textEn": "4. SB 1.2.26_People Are Being Killed_06nov72_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_4",
            "textEn": "5. SB 1.8.28_Don't Be A 'Skin Observer'_08oct74_MA",
            "textBn": ""
          },
          {
            "id": "item_7_0_5",
            "textEn": "6. SPD18 - Shrimad Bhagavatam 2.1.1",
            "textBn": ""
          },
          {
            "id": "item_7_0_6",
            "textEn": "7. SB 6.1.1_What To Do About Death_07may75_ME",
            "textBn": ""
          },
          {
            "id": "item_7_0_7",
            "textEn": "8. SB 6.1.10_No Heart Free Of Dirt Unless..._23jun75_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_8",
            "textEn": "9. SB 6.1.10_There Is No Culture &amp; Education_11may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_9",
            "textEn": "10. SB 6.1.11_Real Reform School_12may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_10",
            "textEn": "11. SB 6.1.1-2_Hogs Life -Eat Any Damned Food_22may75_ME",
            "textBn": ""
          },
          {
            "id": "item_7_0_11",
            "textEn": "12. SB 6.1.12_How Can One Become Civilized_13may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_12",
            "textEn": "13. SB 6.1.12_Industrialism_jan70_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_13",
            "textEn": "14. SB 6.1.12_Repent, Sinners--How_25jun75_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_14",
            "textEn": "15. SB 6.1.13-14_God Is Not A Petty Thing_26jun75_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_15",
            "textEn": "16. SB 6.1.13-14_Sex And The Sober_14may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_16",
            "textEn": "17. SB 6.1.15_Liberation By Pure Understanding_08jan76_NE",
            "textBn": ""
          },
          {
            "id": "item_7_0_17",
            "textEn": "18. SB 6.1.15_Material World--Slaughterhouse_28jun75_DE",
            "textBn": ""
          },
          {
            "id": "item_7_0_18",
            "textEn": "19. SB 6.1.16_Mercy Of Spiritual Master_16may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_19",
            "textEn": "20. SB 6.1.16_Pure Self satisfaction_29jun75_DE",
            "textBn": ""
          },
          {
            "id": "item_7_0_20",
            "textEn": "21. SB 6.1.17_We Have To Dance For Krishna_17may75_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_21",
            "textEn": "22. SB 6.1.17_Who Is A True Christian_30jun75_DE",
            "textBn": ""
          },
          {
            "id": "item_7_0_22",
            "textEn": "23. SB 6.1.18_Everything Here Is Punishment_18may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_23",
            "textEn": "24. SB 6.1.18_Prasadam--Krishna's Mercy_01jul75_DE",
            "textBn": ""
          },
          {
            "id": "item_7_0_24",
            "textEn": "25. SB 6.1.19_Barking Like A Dog_19may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_25",
            "textEn": "26. SB 6.1.19_Pure Profit_02jul75_DE",
            "textBn": ""
          },
          {
            "id": "item_7_0_26",
            "textEn": "27. SB 6.1.2_Know Krishna... Or No Way Out_06may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_27",
            "textEn": "28. SB 6.1.20_Crime--Why And What To Do_04jul75_CH",
            "textBn": ""
          },
          {
            "id": "item_7_0_28",
            "textEn": "29. SB 6.1.20_Wasting Human Form Of Life_20may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_29",
            "textEn": "30. SB 6.1.21_First-class To Fourth-class_05jul75_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_30",
            "textEn": "31. SB 6.1.21_How To Prevent Crime_05jul75_CH",
            "textBn": ""
          },
          {
            "id": "item_7_0_31",
            "textEn": "32. SB 6.1.21_Purity Made Easy_70_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_32",
            "textEn": "33. SB 6.1.21_True Guru_21may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_33",
            "textEn": "34. SB 6.1.22_Dancing-dog Guru Tara Will Not Help_22may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_34",
            "textEn": "35. SB 6.1.22_Fifth Class Education..._06jul75_CH",
            "textBn": ""
          },
          {
            "id": "item_7_0_35",
            "textEn": "36. SB 6.1.23_Don't Be A Hypocrite_23may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_36",
            "textEn": "37. SB 6.1.23_Time And Tide Wait For No Man_07jul75_CH",
            "textBn": ""
          },
          {
            "id": "item_7_0_37",
            "textEn": "38. SB 6.1.24_Family Life_08jul75_CH",
            "textBn": ""
          },
          {
            "id": "item_7_0_38",
            "textEn": "39. SB 6.1.24_Trade Dark Well For Vrndavana_24may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_39",
            "textEn": "40. SB 6.1.25_Attachment--To Shadows_09jul75_CH",
            "textBn": ""
          },
          {
            "id": "item_7_0_40",
            "textEn": "41. SB 6.1.25_Hiranyakasipu vs. Prahlada_25may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_41",
            "textEn": "42. SB 6.1.26_An Ass's Affection_11jul75_CH",
            "textBn": ""
          },
          {
            "id": "item_7_0_42",
            "textEn": "43. SB 6.1.26_Krishna's Sense Gratification_26may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_43",
            "textEn": "44. SB 6.1.27_Asses All_12jul75_PH",
            "textBn": ""
          },
          {
            "id": "item_7_0_44",
            "textEn": "45. SB 6.1.27_God Is Not Dead--You Are Dead_27may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_45",
            "textEn": "46. SB 6.1.28_Killing The Soul_28may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_46",
            "textEn": "47. SB 6.1.28-29_Krishna Is Very Tricky_13jul75_PH",
            "textBn": ""
          },
          {
            "id": "item_7_0_47",
            "textEn": "48. SB 6.1.30_He's Chanting Narayana..._29may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_48",
            "textEn": "49. SB 6.1.30_Studying Your Car-Wasting Time_14jul75_PH",
            "textBn": ""
          },
          {
            "id": "item_7_0_49",
            "textEn": "50. SB 6.1.31_Doom, Boon And Deliverance_16jul75_SF",
            "textBn": ""
          },
          {
            "id": "item_7_0_50",
            "textEn": "51. SB 6.1.31_Home Life--Heaven And Hell_16jul75_SF",
            "textBn": ""
          },
          {
            "id": "item_7_0_51",
            "textEn": "52. SB 6.1.31_Krishna, Kindly Marry Us..._30may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_52",
            "textEn": "53. SB 6.1.32_Systematically...By Chance_31may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_53",
            "textEn": "54. SB 6.1.32_Universal Government_17jul75_SF",
            "textBn": ""
          },
          {
            "id": "item_7_0_54",
            "textEn": "55. SB 6.1.33_Catching The Tail Of A Dog_18jul75_SF",
            "textBn": ""
          },
          {
            "id": "item_7_0_55",
            "textEn": "56. SB 6.1.33_No Sex In The Spiritual World_01jun76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_56",
            "textEn": "57. SB 6.1.37_Follow What Krishna Says_03jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_57",
            "textEn": "58. SB 6.1.37_Irreligious Religion_19jul75_SF",
            "textBn": ""
          },
          {
            "id": "item_7_0_58",
            "textEn": "59. SB 6.1.38_Jeweled Snakes_04jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_59",
            "textEn": "60. SB 6.1.39_Does Your Heart Cry Out For God_05jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_60",
            "textEn": "61. SB 6.1.39_Who Is Punishable_20jul75_SF",
            "textBn": ""
          },
          {
            "id": "item_7_0_61",
            "textEn": "62. SB 6.1.40_God Is Krishna--Satan Is Maya_21jul75_SF",
            "textBn": ""
          },
          {
            "id": "item_7_0_62",
            "textEn": "63. SB 6.1.40_Graduates Of Transcendental Tech_06jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_63",
            "textEn": "64. SB 6.1.41_Total Dependence-independence_07jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_64",
            "textEn": "65. SB 6.1.42_No Fakir--Go To Guru_08jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_65",
            "textEn": "66. SB 6.1.43_Better Without Disturbance_09jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_66",
            "textEn": "67. SB 6.1.44_Krishna's Central Agency_10jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_67",
            "textEn": "68. SB 6.1.44_Lion-killer Rabbit_10jun76_LA",
            "textBn": ""
          },
          {
            "id": "item_7_0_68",
            "textEn": "69. SB 6.1.45_Why Not Eternal Life_26jul75_LB",
            "textBn": ""
          },
          {
            "id": "item_7_0_69",
            "textEn": "70. SB 6.1.46_Transcending All Misery_27jul75_SD",
            "textBn": ""
          },
          {
            "id": "item_7_0_70",
            "textEn": "71. SB 6.1.47_Your Next Life--What Will Be_29jul75_DA",
            "textBn": ""
          },
          {
            "id": "item_7_0_71",
            "textEn": "72. SB 6.1.48_Part And Parcel Of Krishna_30jul75_DA",
            "textBn": ""
          },
          {
            "id": "item_7_0_72",
            "textEn": "73. SB 6.1.49_Sense Gratification_15jun76_DE",
            "textBn": ""
          },
          {
            "id": "item_7_0_73",
            "textEn": "74. SB 6.1.49_Take Advantage Of The Sastra_01aug75_NO",
            "textBn": ""
          },
          {
            "id": "item_7_0_74",
            "textEn": "75. SB 6.1.50_Live Happily And Go Back_03aug75_DE",
            "textBn": ""
          },
          {
            "id": "item_7_0_75",
            "textEn": "76. SB 6.1.50_Medicine For Conditioned Mind_16jun76_DE",
            "textBn": ""
          },
          {
            "id": "item_7_0_76",
            "textEn": "77. SB 6.1.51_All Wrapped Up In Matter_04aug75_DT",
            "textBn": ""
          },
          {
            "id": "item_7_0_77",
            "textEn": "78. SB 6.1.52_No Hard Labor--Only Light_05aug75_DT",
            "textBn": ""
          },
          {
            "id": "item_7_0_78",
            "textEn": "79. SB 6.1.55_Be A Helper--Not The Whole Show_13aug75_LO",
            "textBn": ""
          },
          {
            "id": "item_7_0_79",
            "textEn": "80. SB 6.1.55_Dangerous Yogis_11aug75_PA",
            "textBn": ""
          },
          {
            "id": "item_7_0_80",
            "textEn": "81. SB 6.1.56_Skin Expert To Soul Expert_14aug75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_0_81",
            "textEn": "82. SB 6.1.6_Saved From Severe Punishment_07may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_82",
            "textEn": "83. SB 6.1.63_Haunted Enjoyment_31aug75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_83",
            "textEn": "84. SB 6.1.64_Above Material Nature_01sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_84",
            "textEn": "85. SB 6.1.66_How To Degrade Yourself_02sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_85",
            "textEn": "86. SB 6.1.67_Life Is Very Risky_03sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_86",
            "textEn": "87. SB 6.1.68_Don't Infect Yourself..._04sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_87",
            "textEn": "88. SB 6.1.7_The Perfect Sympathizer_15jun75_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_88",
            "textEn": "89. SB 6.1.7_Why Are Here Varieties Of Life_08may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_89",
            "textEn": "90. SB 6.1.8_The Only Hope_09may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_90",
            "textEn": "91. SB 6.1.9_Devotional Desire_07jan76_NE",
            "textBn": ""
          },
          {
            "id": "item_7_0_91",
            "textEn": "92. SB 6.1.9_I Don't Wish To Die-Help_10may76_HO",
            "textBn": ""
          },
          {
            "id": "item_7_0_92",
            "textEn": "93. SB 6.2.1_ABC's Of Degradation &amp; Elevation_04sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_93",
            "textEn": "94. SB 6.2.11_Unalloyed Peace--How_13sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_94",
            "textEn": "95. SB 6.2.13_Seeing Is Not Believing_15sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_95",
            "textEn": "96. SB 6.2.14_Non-anxiety--Ask For It By Name_17sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_96",
            "textEn": "97. SB 6.2.15_The Glories Of The Holy Name_18sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_97",
            "textEn": "98. SB 6.2.16_Krishna In Outlaw Country_19sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_98",
            "textEn": "99. SB 6.2.17_Don't Try To Be Happy Here_20sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_99",
            "textEn": "100. SB 6.2.2_The Absolute Science_05sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_100",
            "textEn": "101. SB 6.2.3_Save Your Dependent_06sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_101",
            "textEn": "102. SB 6.2.5-6_In Contact With Bonafide Guru_09sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_102",
            "textEn": "103. SB 6.2.7_Government And Guardians_10sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_0_103",
            "textEn": "104. SB 6.2.8_Chant Hare Krishna--No Loss_11sep75_VV",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_7_1_0",
            "textEn": "1. SPDI3 - Shrimad Bhagavatam 1.2.6",
            "textBn": ""
          },
          {
            "id": "item_7_1_1",
            "textEn": "2. SPDI3 - Shrimad Bhagavatam 1.2.7",
            "textBn": ""
          },
          {
            "id": "item_7_1_2",
            "textEn": "3. Lecture To College Students_From Tiger To Rat_20oct68_ST",
            "textBn": ""
          },
          {
            "id": "item_7_1_3",
            "textEn": "4. SB 1.15.44_Our Real Problem Isn't Petrol_22dec73_LA",
            "textBn": ""
          },
          {
            "id": "item_7_1_4",
            "textEn": "5. SB 1.16.11_Subduing The Demons_08jan74_LA",
            "textBn": ""
          },
          {
            "id": "item_7_1_5",
            "textEn": "6. SB 1.16.12_Rogues And Rascals Cause War_09jan74_LA",
            "textBn": ""
          },
          {
            "id": "item_7_1_6",
            "textEn": "7. SB 1.16.16_Everyone Of Us Loves Krishna_11jan74_LA",
            "textBn": ""
          },
          {
            "id": "item_7_1_7",
            "textEn": "8. SB 6.1.6_Cleansing Away Our Criminality_05jan76_NE",
            "textBn": ""
          },
          {
            "id": "item_7_1_8",
            "textEn": "9. SB 6.1.61_Sexual Heart Disease_28aug75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_1_9",
            "textEn": "10. SB 6.1.62_The Agitated Mind_29aug75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_1_10",
            "textEn": "11. SB 6.2.1_ABC's Of Degradation &amp; Elevation_04sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_1_11",
            "textEn": "12. SPDI4 - Shrimad Bhagavatam 1.2.20",
            "textBn": ""
          },
          {
            "id": "item_7_1_12",
            "textEn": "13. SPDI8 - Shrimad Bhagavatam 2.2.6",
            "textBn": ""
          },
          {
            "id": "item_7_1_13",
            "textEn": "14. SPDI9 - Shrimad Bhagavatam 1.15.1",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_7_2_0",
            "textEn": "1. SB 1.16.10_Pariksit's Answer To Kali_07jan74_LA",
            "textBn": ""
          },
          {
            "id": "item_7_2_1",
            "textEn": "2. SB 1.16.5_Fish-But Don't Touch The Water_02jan74_LA",
            "textBn": ""
          },
          {
            "id": "item_7_2_2",
            "textEn": "3. SB 1.16.6_The Medicine For Death_03jan74_LA",
            "textBn": ""
          },
          {
            "id": "item_7_2_3",
            "textEn": "4. SB 1.5.15_At Least Lift Your Anchor_09jun69_NV",
            "textBn": ""
          },
          {
            "id": "item_7_2_4",
            "textEn": "5. SB 1.8.32_Become Dear To Krishna_12oct74_MA",
            "textBn": ""
          },
          {
            "id": "item_7_2_5",
            "textEn": "6. SB 7.6.1_Here Is God-Krishna-Take It_02dec75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_2_6",
            "textEn": "7. SPDI9 - Shrimad Bhagavatam 1.14.43",
            "textBn": ""
          },
          {
            "id": "item_7_2_7",
            "textEn": "8. SPDI5 - Shrimad Bhagavatam 1.8.20",
            "textBn": ""
          },
          {
            "id": "item_7_2_8",
            "textEn": "9. SPDI5 - Shrimad Bhagavatam 1.8.21",
            "textBn": ""
          },
          {
            "id": "item_7_2_9",
            "textEn": "10. SPDI5 - Shrimad Bhagavatam 1.8.23",
            "textBn": ""
          },
          {
            "id": "item_7_2_10",
            "textEn": "11. SPDI6 - Shrimad Bhagavatam 1.8.25",
            "textBn": ""
          },
          {
            "id": "item_7_2_11",
            "textEn": "12. SPDI6 - Shrimad Bhagavatam 1.8.26",
            "textBn": ""
          },
          {
            "id": "item_7_2_12",
            "textEn": "13. SPDI6 - Shrimad Bhagavatam 1.8.27",
            "textBn": ""
          },
          {
            "id": "item_7_2_13",
            "textEn": "14. SPDI6 - Shrimad Bhagavatam 1.8.28",
            "textBn": ""
          },
          {
            "id": "item_7_2_14",
            "textEn": "15. SPDI7 - Shrimad Bhagavatam 1.8.29",
            "textBn": ""
          },
          {
            "id": "item_7_2_15",
            "textEn": "16. SPDI7 - Shrimad Bhagavatam 1.8.30",
            "textBn": ""
          },
          {
            "id": "item_7_2_16",
            "textEn": "17. SPDI7 - Shrimad Bhagavatam 1.8.31",
            "textBn": ""
          },
          {
            "id": "item_7_2_17",
            "textEn": "18. SPDI7 - Shrimad Bhagavatam 1.8.32",
            "textBn": ""
          },
          {
            "id": "item_7_2_18",
            "textEn": "19. SPDI8 - Shrimad Bhagavatam 1.8.33",
            "textBn": ""
          },
          {
            "id": "item_7_2_19",
            "textEn": "20. SPDI8 - Shrimad Bhagavatam 1.8.35",
            "textBn": ""
          },
          {
            "id": "item_7_2_20",
            "textEn": "21. SB 3.1.10_Sage Advice For Human Society_21may73_DA",
            "textBn": ""
          },
          {
            "id": "item_7_2_21",
            "textEn": "22. SB 3.12.19_Entering Krishna's Family_03mar75_DA",
            "textBn": ""
          },
          {
            "id": "item_7_2_22",
            "textEn": "23. SB 3.25.1_Fire is Fire, ..., God Is God_01nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_23",
            "textEn": "24. SB 3.25.10_Get Free From Attachments_10nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_24",
            "textEn": "25. SB 3.25.11_Even Expert Swimmers Struggle_11nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_25",
            "textEn": "26. SB 3.25.12_Village Talk -Vaikuntha Talk_12nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_26",
            "textEn": "27. SB 3.25.13_Above Happiness And Distress_13nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_27",
            "textEn": "28. SB 3.25.14_Relief From The Poison-fire_14nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_28",
            "textEn": "29. SB 3.25.15_Conditioned Or Krishna-ized_15nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_29",
            "textEn": "30. SB 3.25.16_Mind Is Covered By Dirty Things_16nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_30",
            "textEn": "31. SB 3.25.17_Seeing The Real Person_17nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_31",
            "textEn": "32. SB 3.25.18_Nobody's Servant But Krsna's_18nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_32",
            "textEn": "33. SB 3.25.19_One Kind Of Devotion Will Do_19nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_33",
            "textEn": "34. SB 3.25.2_Eat, Drink, Be Merry..._02nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_34",
            "textEn": "35. SB 3.25.20_How To Get Rid Of This Body_20nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_35",
            "textEn": "36. SB 3.25.21_The Sadhu's Symptoms_21nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_36",
            "textEn": "37. SB 3.25.22_The Only Rescue_22nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_37",
            "textEn": "38. SB 3.25.23_Devotees Don't Feel Suffering_23nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_38",
            "textEn": "39. SB 3.25.24_Association Of Devotees_24nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_39",
            "textEn": "40. SB 3.25.25_Taste Of Talks About Krishna_25nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_40",
            "textEn": "41. SB 3.25.26_Krishna Gratification_26nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_41",
            "textEn": "42. SB 3.25.27_World Is Under Misunderstanding_27nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_42",
            "textEn": "43. SB 3.25.28_You Must Go To A Guru_28nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_43",
            "textEn": "44. SB 3.25.29_Understanding Highest Truth_29nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_44",
            "textEn": "45. SB 3.25.3_Krishna Has Everything_03nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_45",
            "textEn": "46. SB 3.25.30_Understanding -Standing Under_30nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_46",
            "textEn": "47. SB 3.25.31_Hear About Krsna Submissively_01dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_47",
            "textEn": "48. SB 3.25.32_From Degradation To Devotion_02dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_48",
            "textEn": "49. SB 3.25.33-34_How To Dissolve Our Suffering_03dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_49",
            "textEn": "50. SB 3.25.35_Eager To Talk With Krishna_04dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_50",
            "textEn": "51. SB 3.25.36_The Lord Is Charming_05dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_51",
            "textEn": "52. SB 3.25.37_The Devotional Position_06dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_52",
            "textEn": "53. SB 3.25.38_Krsna's Service Absolute Delight_07dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_53",
            "textEn": "54. SB 3.25.39-40_Take Krishna As Everything_08dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_54",
            "textEn": "55. SB 3.25.4_Approach A Proper Guru_04nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_55",
            "textEn": "56. SB 3.25.41_Atheists...Overbold_09dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_56",
            "textEn": "57. SB 3.25.42_Don't Take Krishna Lightly_10dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_57",
            "textEn": "58. SB 3.25.43_No More Fear_11dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_58",
            "textEn": "59. SB 3.25.44_No Water In The Desert_12dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_59",
            "textEn": "60. SB 3.25.5_Independent Woman Isn't Happy_05nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_60",
            "textEn": "61. SB 3.25.7_Sensual Darkness--Spiritual..._07nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_61",
            "textEn": "62. SB 3.25.8_This World Is Darkness_08nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_62",
            "textEn": "63. SB 3.25.9_'Advanced' Equals Ass_09nov74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_63",
            "textEn": "64. SB 3.26.1_Getting Uncontaminated_13dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_64",
            "textEn": "65. SB 3.26.10_The World Is Impersonal_22dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_65",
            "textEn": "66. SB 3.26.11-14_Analyze the Trap...And Escape_23dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_66",
            "textEn": "67. SB 3.26.15_Maya Is Krishna's_24dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_67",
            "textEn": "68. SB 3.26.16_Fear--The Time Factor_25dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_68",
            "textEn": "69. SB 3.26.17_Don't Remain Asleep!_26dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_69",
            "textEn": "70. SB 3.26.18_United By Chanting And Dancing_27dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_70",
            "textEn": "71. SB 3.26.19_This Society Needs Some Brains_28dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_71",
            "textEn": "72. SB 3.26.2_You Belong To Spiritual World_14dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_72",
            "textEn": "73. SB 3.26.20_We're All Asleep_29dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_73",
            "textEn": "74. SB 3.26.21_The Only Way To Peace Of Mind_30dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_74",
            "textEn": "75. SB 3.26.22_Our Natural Consciousness_31dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_75",
            "textEn": "76. SB 3.26.23-24_Slave vs. Revolting Mentality_01jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_76",
            "textEn": "77. SB 3.26.25_Secret Of Satisfying Everyone_02jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_77",
            "textEn": "78. SB 3.26.26_Breaking Our Karmic Chains_03jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_78",
            "textEn": "79. SB 3.26.27_Controlling The Uncontrollable_04jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_79",
            "textEn": "80. SB 3.26.28_Centering The Central Sense_05jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_80",
            "textEn": "81. SB 3.26.29_This Body Is Imitation_06jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_81",
            "textEn": "82. SB 3.26.3_Our Knowledge Is Not Knowledge_15dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_82",
            "textEn": "83. SB 3.26.30_We Should Have Firm Faith_07jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_83",
            "textEn": "84. SB 3.26.31_First-class Yoga_08jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_84",
            "textEn": "85. SB 3.26.32_Creation-Sound Explanation_09jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_85",
            "textEn": "86. SB 3.26.34_Passing Life's Final Examination_11jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_86",
            "textEn": "87. SB 3.26.35_Tolerance Of Matter's Touch_12jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_87",
            "textEn": "88. SB 3.26.39_Forest Fire Of The False Ego_14jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_88",
            "textEn": "89. SB 3.26.4_The Truth Will Set You Free_16dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_89",
            "textEn": "90. SB 3.26.40_Study Krishna Analytically_15jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_90",
            "textEn": "91. SB 3.26.41_Working Of Universal Machinery_16jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_91",
            "textEn": "92. SB 3.26.42_Universal Mixer Taste Maker_17jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_92",
            "textEn": "93. SB 3.26.43_Refreshment For Parched Mind_18jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_93",
            "textEn": "94. SB 3.26.44_Pure Love_19jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_94",
            "textEn": "95. SB 3.26.45_Transcendental Transaction_20jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_95",
            "textEn": "96. SB 3.26.46_Putting Krishna In His Place_21jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_96",
            "textEn": "97. SB 3.26.47_Dead Sound--Living Sound_22jan75_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_97",
            "textEn": "98. SB 3.26.5_Crazy Fellows And Colorful Life_17dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_98",
            "textEn": "99. SB 3.26.6_Atheistic Arrogance_18dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_99",
            "textEn": "100. SB 3.26.7_Tangle Of Material Happiness_19dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_100",
            "textEn": "101. SB 3.26.8_The Enjoyer Mentality_20dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_101",
            "textEn": "102. SB 3.26.9_Controlled Enjoyer_21dec74_BO",
            "textBn": ""
          },
          {
            "id": "item_7_2_102",
            "textEn": "103. SB 3.28.17_I Must Love Krishna_26oct75_NA",
            "textBn": ""
          },
          {
            "id": "item_7_2_103",
            "textEn": "104. SB 3.28.18_Stay Under Krsna's Protection_27oct75_NA",
            "textBn": ""
          },
          {
            "id": "item_7_2_104",
            "textEn": "105. SB 3.28.19_Krsna's Impression In Our Heart_29oct75_NA",
            "textBn": ""
          },
          {
            "id": "item_7_2_105",
            "textEn": "106. SB 3.28.20_A Most Moving Statue_30oct75_NA",
            "textBn": ""
          },
          {
            "id": "item_7_2_106",
            "textEn": "107. SB 3.28.21_Why Pay Electric Bills..._01nov75_NA",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_7_3_0",
            "textEn": "1. Lecture On Initiation The Path Of Purification_01dec68_LA",
            "textBn": ""
          },
          {
            "id": "item_7_3_1",
            "textEn": "2. Lecture_Bhaktisiddhanta Appearance Day_02mar75_AT",
            "textBn": ""
          },
          {
            "id": "item_7_3_2",
            "textEn": "3. Lecture_Hearing Srila Bhaktisiddhanta_10dec76_HY",
            "textBn": ""
          },
          {
            "id": "item_7_3_3",
            "textEn": "4. Press Conference_We Are Hare Krishna People_05mar75_NY",
            "textBn": ""
          },
          {
            "id": "item_7_3_4",
            "textEn": "5. SB 6.2.4_Behave Ideally Or Don't Preach_08sep75_VV",
            "textBn": ""
          },
          {
            "id": "item_7_3_5",
            "textEn": "6. SB 7.9.24_The Master Disease_02mar76_MA",
            "textBn": ""
          },
          {
            "id": "item_7_3_6",
            "textEn": "7. SPD19 - Shrimad Bhagavatam 1.14.44",
            "textBn": ""
          },
          {
            "id": "item_7_3_7",
            "textEn": "8. Interview For Radio_Transfer Your Love From Dog_27jun69_LA",
            "textBn": ""
          },
          {
            "id": "item_7_3_8",
            "textEn": "9. Interview_Everyone Of You- Become Guru_16oct76_CH",
            "textBn": ""
          },
          {
            "id": "item_7_3_9",
            "textEn": "10. Interview_God, Religion, Yoga, Universe_29jun74_ME",
            "textBn": ""
          },
          {
            "id": "item_7_3_10",
            "textEn": "11. Interview_Life, Liberty, Distress_17jul76_NY",
            "textBn": ""
          },
          {
            "id": "item_7_3_11",
            "textEn": "12. Interview_Sentiment And Speculation_23jul76_LO",
            "textBn": ""
          },
          {
            "id": "item_7_3_12",
            "textEn": "13. Interview_The Driver Of The Body_16jul76_NY",
            "textBn": ""
          },
          {
            "id": "item_7_3_13",
            "textEn": "14. Interview_Women's Lib-Women Cheated_13jul75_PH",
            "textBn": ""
          },
          {
            "id": "item_7_3_14",
            "textEn": "15. Interview_You Can Make Whole World India_25may75_FI",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_9",
    "courseNumber": 9,
    "titleEn": "9. Gauranga Sabha",
    "titleBn": "গৌরাঙ্গ সভা — ব্রহ্মচারী আশ্রম ও গভীর ভক্তিমার্গ লেকচার সংকলন",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_8_0_0",
            "textEn": "1. 08-02-15_RSP_GS_Everywhere Seeing Krishna",
            "textBn": ""
          },
          {
            "id": "item_8_0_1",
            "textEn": "2. 08-03-31_RSP_GS_Illusion in Material World",
            "textBn": ""
          },
          {
            "id": "item_8_0_2",
            "textEn": "3. 08-05-08_RSP_GS_Dealing With Parents",
            "textBn": ""
          },
          {
            "id": "item_8_0_3",
            "textEn": "4. 08-11-18_RSP_GS_Mood of a Humble Servant",
            "textBn": ""
          },
          {
            "id": "item_8_0_4",
            "textEn": "5. 09-03-28_GS_RSP_Internalizing KC",
            "textBn": ""
          },
          {
            "id": "item_8_0_5",
            "textEn": "6. 09-04-30_GS_RSP_Dealings with parents (while joining ashram)",
            "textBn": ""
          },
          {
            "id": "item_8_0_6",
            "textEn": "7. 09-09-15_GS_Renouncing material duties responsibly_RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_7",
            "textEn": "8. 10-02-09_GS_Join brahmachari ashram to show compassion for suffering souls_RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_8",
            "textEn": "9. 10-04-16_GS_Connection between KC &amp; Occupational duty_HG RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_9",
            "textEn": "10. 10-11-11_GS meeting Discussion of various aspects of pure devotee_RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_10",
            "textEn": "11. 11_05_15_Gauranga Sabha_Brahmacharis must hear and preach to carry on enthusiastically (Kolkatta)_HG RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_11",
            "textEn": "12. 11_06_30_Gauranga Sabha_Senior_Why One Should Become a BC_HGRSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_12",
            "textEn": "13. 11_06_30_Gauranga Sabha_Brahmacari and Mind_HGRSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_13",
            "textEn": "14. 11_07_01_Gauranga Sabha_Brahmacari and Mind_Part 2_HGRSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_14",
            "textEn": "15. 11-06-14_GS_Kudarshan VS Sudarshan_RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_15",
            "textEn": "16. 11-08-05_GS_RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_16",
            "textEn": "17. 11-09-16_GS_Raghunatha Dasa Goswami's attentiveness and determination_RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_17",
            "textEn": "18. 12-01-14_GS_RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_18",
            "textEn": "19. 12-02-26_GS_Learning to respect Grihastha ashram_RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_19",
            "textEn": "20. 12-07-06_Importance of Missionary Spirit_PAC Meetings_HG RSP",
            "textBn": ""
          },
          {
            "id": "item_8_0_20",
            "textEn": "21. RSP_GS_An easy way to eradicate lust_29-9-05",
            "textBn": ""
          },
          {
            "id": "item_8_0_21",
            "textEn": "22. RSP_GS_Attitude of hearing in association_27-4-07",
            "textBn": ""
          },
          {
            "id": "item_8_0_22",
            "textEn": "23. RSP_GS_Do not delay joining Brahmachari ashram_18-9-07",
            "textBn": ""
          },
          {
            "id": "item_8_0_23",
            "textEn": "24. RSP_GS_Experience is the best teacher &amp; fool learns no other way_11-1-07",
            "textBn": ""
          },
          {
            "id": "item_8_0_24",
            "textEn": "25. RSP_GS_How to maintain enthusiasm always_25-5-07",
            "textBn": ""
          },
          {
            "id": "item_8_0_25",
            "textEn": "26. RSP_GS_Krsna the property of the impoverished_4-2-05",
            "textBn": ""
          },
          {
            "id": "item_8_0_26",
            "textEn": "27. RSP_GS_Q-A with Gauranga Sabha Devotees",
            "textBn": ""
          },
          {
            "id": "item_8_0_27",
            "textEn": "28. RSP_GS_Role of determination in life of a brahmachari_8-4-05",
            "textBn": ""
          },
          {
            "id": "item_8_0_28",
            "textEn": "29. RSP_GS_Self Control &amp; Discipline — key to real pleasure-I",
            "textBn": ""
          },
          {
            "id": "item_8_0_29",
            "textEn": "30. RSP_GS_Self Control &amp; Discipline — key to real pleasure-II",
            "textBn": ""
          },
          {
            "id": "item_8_0_30",
            "textEn": "31. 09-05-16_RSP_G Sabha_Cutting the knot of attachment (parents)",
            "textBn": ""
          },
          {
            "id": "item_8_0_31",
            "textEn": "32. RSP_GS_Self Control &amp; Discipline — key to real pleasure-III",
            "textBn": ""
          },
          {
            "id": "item_8_0_32",
            "textEn": "33. RSP_GS_Should Devotee Men be conservative in dealing with women as in east or have free flowing thoughts/speech/dealings as in west_8-03-07",
            "textBn": ""
          },
          {
            "id": "item_8_0_33",
            "textEn": "34. RSP_GS_Transcending conditionings_31-08-07",
            "textBn": ""
          },
          {
            "id": "item_8_0_34",
            "textEn": "35. RSP_GS_Who can Become a Brahmachari (1)_05-01-05",
            "textBn": ""
          },
          {
            "id": "item_8_0_35",
            "textEn": "36. RSP_GS_Who can Become a Brahmachari (2)_05-01-05",
            "textBn": ""
          },
          {
            "id": "item_8_0_36",
            "textEn": "37. RSP+CCP_GS_Higher taste through prayers",
            "textBn": ""
          },
          {
            "id": "item_8_0_37",
            "textEn": "38. RSP_GS_Transcending conditionings_31-08-07",
            "textBn": ""
          },
          {
            "id": "item_8_0_38",
            "textEn": "39. RSP_GS_Deriving highest benefit_30-10-07",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_8_1_0",
            "textEn": "50. 05-04-05- Simple Living — HG Jananivas Prabhu",
            "textBn": ""
          },
          {
            "id": "item_8_1_1",
            "textEn": "51. 06-04-05- Brahmacharya Life — HG Jananivas Prabhu",
            "textBn": ""
          },
          {
            "id": "item_8_1_2",
            "textEn": "52. 10_07_03_GS camp_Brahmachari Ashram — Seated at the exit door of a crashing plane — Krishnanand Prabhu",
            "textBn": ""
          },
          {
            "id": "item_8_1_3",
            "textEn": "53. C-GSC_No obstacle can stop joining B ashram — Govind Prabhu_30-6-05",
            "textBn": ""
          },
          {
            "id": "item_8_1_4",
            "textEn": "54. D-GSC_Q&amp;A with Gauranga Sabha boys — Govind Prabhu_30-6-05",
            "textBn": ""
          },
          {
            "id": "item_8_1_5",
            "textEn": "55. Sex — Is it okay — HG Gaur Sundar Prabhu",
            "textBn": ""
          },
          {
            "id": "item_8_1_6",
            "textEn": "56. Laxman takes permission to leave — HH Radha Govinda Maharaj",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_10",
    "courseNumber": 10,
    "titleEn": "10. Nityananda Sabha Syllabus",
    "titleBn": "নিত্যানন্দ সভা — গৃহস্থ আশ্রম ও ব্যবহারিক আধ্যাত্মিক জীবন",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_9_0_0",
            "textEn": "1. Who should choose the grihastha ashrama?",
            "textBn": ""
          },
          {
            "id": "item_9_0_1",
            "textEn": "2. Grihamedhi vs. Grihastha ashram",
            "textBn": ""
          },
          {
            "id": "item_9_0_2",
            "textEn": "3. Living a Krishna-centered life",
            "textBn": ""
          },
          {
            "id": "item_9_0_3",
            "textEn": "4. Responsibilities of a grihastha",
            "textBn": ""
          },
          {
            "id": "item_9_0_4",
            "textEn": "5. Idle Mind — Devil's workshop",
            "textBn": ""
          },
          {
            "id": "item_9_0_5",
            "textEn": "6. The process of matching boy and girl",
            "textBn": ""
          },
          {
            "id": "item_9_0_6",
            "textEn": "7. Self control — key to real pleasure",
            "textBn": ""
          },
          {
            "id": "item_9_0_7",
            "textEn": "8. Determination to follow the vows strictly",
            "textBn": ""
          },
          {
            "id": "item_9_0_8",
            "textEn": "9. Choosing a suitable career",
            "textBn": ""
          },
          {
            "id": "item_9_0_9",
            "textEn": "10. Extravagance and unplanned spending",
            "textBn": ""
          },
          {
            "id": "item_9_0_10",
            "textEn": "11. Unrealistic expectations and hopeless hopes",
            "textBn": ""
          },
          {
            "id": "item_9_0_11",
            "textEn": "12. Simple living, High thinking in grihastha life",
            "textBn": ""
          },
          {
            "id": "item_9_0_12",
            "textEn": "13. How to be an exemplary grihastha?",
            "textBn": ""
          },
          {
            "id": "item_9_0_13",
            "textEn": "14. Maya's traps in early married life",
            "textBn": ""
          },
          {
            "id": "item_9_0_14",
            "textEn": "15. Money — the myth and the reality",
            "textBn": ""
          },
          {
            "id": "item_9_0_15",
            "textEn": "16. Success — the myth and the reality",
            "textBn": ""
          },
          {
            "id": "item_9_0_16",
            "textEn": "17. Happiness — the myth and the reality",
            "textBn": ""
          },
          {
            "id": "item_9_0_17",
            "textEn": "18. Maintaining KC in the world of rat race",
            "textBn": ""
          },
          {
            "id": "item_9_0_18",
            "textEn": "19. To earn a lot, save and stabilise or to steadily go on serving?",
            "textBn": ""
          },
          {
            "id": "item_9_0_19",
            "textEn": "20. To work hard and give charity or to wind up and serve?",
            "textBn": ""
          },
          {
            "id": "item_9_0_20",
            "textEn": "21. Types of Illusory Security and the Real security",
            "textBn": ""
          },
          {
            "id": "item_9_0_21",
            "textEn": "22. Attitude towards other ashramas",
            "textBn": ""
          },
          {
            "id": "item_9_0_22",
            "textEn": "23. Dealing with Nondevotees / devotees",
            "textBn": ""
          },
          {
            "id": "item_9_0_23",
            "textEn": "24. Good sadhana after marriage",
            "textBn": ""
          },
          {
            "id": "item_9_0_24",
            "textEn": "25. Learning to live with differences",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_9_1_0",
            "textEn": "1. Right and Wrong attitudes in Preaching",
            "textBn": ""
          },
          {
            "id": "item_9_1_1",
            "textEn": "2. A self analysis test and skit for internal purity",
            "textBn": ""
          },
          {
            "id": "item_9_1_2",
            "textEn": "3. Avoiding material outlook in dealings with vaishnavas",
            "textBn": ""
          },
          {
            "id": "item_9_1_3",
            "textEn": "4. Fall down and bloops and how to prevent them",
            "textBn": ""
          },
          {
            "id": "item_9_1_4",
            "textEn": "5. Coming out of Day dreaming",
            "textBn": ""
          },
          {
            "id": "item_9_1_5",
            "textEn": "6. Giving up brooding over problems",
            "textBn": ""
          },
          {
            "id": "item_9_1_6",
            "textEn": "7. Whimsical behaviour",
            "textBn": ""
          },
          {
            "id": "item_9_1_7",
            "textEn": "8. Giving up Lethargy and Complacency",
            "textBn": ""
          },
          {
            "id": "item_9_1_8",
            "textEn": "9. Greed and Peace — 3 incompatibles",
            "textBn": ""
          },
          {
            "id": "item_9_1_9",
            "textEn": "10. Dedication to the mission of guru",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_9_2_0",
            "textEn": "1. Bhaktivinod Thakur",
            "textBn": ""
          },
          {
            "id": "item_9_2_1",
            "textEn": "2. Srila Prabhupada in grihastha ashram",
            "textBn": ""
          },
          {
            "id": "item_9_2_2",
            "textEn": "3. Srinivas Acharya",
            "textBn": ""
          },
          {
            "id": "item_9_2_3",
            "textEn": "4. Kardama Muni and Devahuti",
            "textBn": ""
          },
          {
            "id": "item_9_2_4",
            "textEn": "5. Kashyapa and Diti",
            "textBn": ""
          },
          {
            "id": "item_9_2_5",
            "textEn": "6. Yayati and Devayani",
            "textBn": ""
          },
          {
            "id": "item_9_2_6",
            "textEn": "7. Pururava and Urvashi",
            "textBn": ""
          },
          {
            "id": "item_9_2_7",
            "textEn": "8. Priyavrata preached by Lord Brahma",
            "textBn": ""
          },
          {
            "id": "item_9_2_8",
            "textEn": "9. Arjuna and Draupadi",
            "textBn": ""
          },
          {
            "id": "item_9_2_9",
            "textEn": "10. Sudama Vipra and his wife",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_11",
    "courseNumber": 11,
    "titleEn": "11. Leaders Training",
    "titleBn": "লিডারশিপ ও ম্যানেজমেন্ট প্রশিক্ষণ (EMAIL &amp; MALA)",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_10_0_0",
            "textEn": "1. Managing with Hands, Heads and Hearts &amp; Three types of Leadership",
            "textBn": ""
          },
          {
            "id": "item_10_0_1",
            "textEn": "2. Eight attitudes of an effective leader",
            "textBn": ""
          },
          {
            "id": "item_10_0_2",
            "textEn": "3. Put horse before the cart — putting people before the project",
            "textBn": ""
          },
          {
            "id": "item_10_0_3",
            "textEn": "4. Learning to plan, schedule, organize, monitor and control",
            "textBn": ""
          },
          {
            "id": "item_10_0_4",
            "textEn": "5. Adjusting Details without changing Principles",
            "textBn": ""
          },
          {
            "id": "item_10_0_5",
            "textEn": "6. Crisis Management, Steady Maintenance and Development",
            "textBn": ""
          },
          {
            "id": "item_10_0_6",
            "textEn": "7. Power of Habits &amp; Role of Character in a Leader's life",
            "textBn": ""
          },
          {
            "id": "item_10_0_7",
            "textEn": "8. Practical tips to Converting Stress to Smile",
            "textBn": ""
          },
          {
            "id": "item_10_0_8",
            "textEn": "9. Self Management",
            "textBn": ""
          },
          {
            "id": "item_10_0_9",
            "textEn": "10. Time Management",
            "textBn": ""
          },
          {
            "id": "item_10_0_10",
            "textEn": "11. Anger Management",
            "textBn": ""
          },
          {
            "id": "item_10_0_11",
            "textEn": "12. Do your best &amp; Leave the Rest",
            "textBn": ""
          },
          {
            "id": "item_10_0_12",
            "textEn": "13. Art of Smart Work",
            "textBn": ""
          },
          {
            "id": "item_10_0_13",
            "textEn": "14. Cultivating Service Attitude in Dealing with seniors, equals and juniors",
            "textBn": ""
          },
          {
            "id": "item_10_0_14",
            "textEn": "15. Effective communication",
            "textBn": ""
          },
          {
            "id": "item_10_0_15",
            "textEn": "16. Art of thinking Win-Win",
            "textBn": ""
          },
          {
            "id": "item_10_0_16",
            "textEn": "17. Customer Care — internal and external",
            "textBn": ""
          },
          {
            "id": "item_10_0_17",
            "textEn": "18. Art of dealing with Authority and Subordinate",
            "textBn": ""
          },
          {
            "id": "item_10_0_18",
            "textEn": "19. Conducting effective meeting and establish Accountability",
            "textBn": ""
          },
          {
            "id": "item_10_0_19",
            "textEn": "20. Art of Conflict resolution",
            "textBn": ""
          },
          {
            "id": "item_10_0_20",
            "textEn": "21. Delegation and Empowerment",
            "textBn": ""
          },
          {
            "id": "item_10_0_21",
            "textEn": "22. Cultivating Right Attitude towards other guru disciples",
            "textBn": ""
          },
          {
            "id": "item_10_0_22",
            "textEn": "23. Co-operation and Team playing",
            "textBn": ""
          },
          {
            "id": "item_10_0_23",
            "textEn": "24. Cultivating Humility, Submissiveness &amp; Obedience",
            "textBn": ""
          },
          {
            "id": "item_10_0_24",
            "textEn": "25. Cultivating Compassion, Tolerance and Patience",
            "textBn": ""
          },
          {
            "id": "item_10_0_25",
            "textEn": "26. Cultivating the art of Respecting all without expecting Respect",
            "textBn": ""
          },
          {
            "id": "item_10_0_26",
            "textEn": "27. Keeping cleanliness and sticking to punctuality",
            "textBn": ""
          },
          {
            "id": "item_10_0_27",
            "textEn": "28. Exhibiting Honesty, Truthfulness and Integrity",
            "textBn": ""
          },
          {
            "id": "item_10_0_28",
            "textEn": "29. Rising above Envy and competition and offering Appreciation",
            "textBn": ""
          },
          {
            "id": "item_10_0_29",
            "textEn": "30. Avoiding Fault finding Tendency and correcting without hurting",
            "textBn": ""
          },
          {
            "id": "item_10_0_30",
            "textEn": "31. Seeing essence behind externals and professionalism vs Spontaneity",
            "textBn": ""
          },
          {
            "id": "item_10_0_31",
            "textEn": "32. Responsibility, Dependability, Commitment and Dedication",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_10_1_0",
            "textEn": "1. Curbing the whimsical tendencies — HG RVKCP",
            "textBn": ""
          },
          {
            "id": "item_10_1_1",
            "textEn": "2. Qualities of a devotee leader-1 — HG RND",
            "textBn": ""
          },
          {
            "id": "item_10_1_2",
            "textEn": "3. Parikshit cursed by brahmana — HG RVKCP",
            "textBn": ""
          },
          {
            "id": "item_10_1_3",
            "textEn": "4. Spirituality vs Management for VOICE Leaders — HG RND",
            "textBn": ""
          },
          {
            "id": "item_10_1_4",
            "textEn": "5. How to take blessings while undertaking any project — HG SMP",
            "textBn": ""
          },
          {
            "id": "item_10_1_5",
            "textEn": "6. Time Management for VOICE Leaders — HG RND",
            "textBn": ""
          },
          {
            "id": "item_10_1_6",
            "textEn": "7. Dhruva maharaj fights with yakshas — anger management — RVKCP",
            "textBn": ""
          },
          {
            "id": "item_10_1_7",
            "textEn": "8. Management &amp; Financial Responsibilities of ISKCON Leader — HG MMP",
            "textBn": ""
          },
          {
            "id": "item_10_1_8",
            "textEn": "9. Preaching mood — SP quotes — HG RND",
            "textBn": ""
          },
          {
            "id": "item_10_1_9",
            "textEn": "1. Narada's instructions on Srimad Bhagavatam to Vyasadeva — HG MMD",
            "textBn": ""
          },
          {
            "id": "item_10_1_10",
            "textEn": "2. Getting rid of material desires by serving spiritual master — HG SM",
            "textBn": ""
          },
          {
            "id": "item_10_1_11",
            "textEn": "3. Practicing Devotional Service in Association of Devotees — HG SMP",
            "textBn": ""
          },
          {
            "id": "item_10_1_12",
            "textEn": "4. Great souls do not have any selfish interest",
            "textBn": ""
          },
          {
            "id": "item_10_1_13",
            "textEn": "5. Incompleteness and Dissatisfaction due to not Preaching",
            "textBn": ""
          },
          {
            "id": "item_10_1_14",
            "textEn": "6. Effective Delegation and Empowerment",
            "textBn": ""
          },
          {
            "id": "item_10_1_15",
            "textEn": "7. To act in the Mood of servant",
            "textBn": ""
          },
          {
            "id": "item_10_1_16",
            "textEn": "8. Never enrage great souls, Appease great souls",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_12",
    "courseNumber": 12,
    "titleEn": "12. Trainee Preachers Forum",
    "titleBn": "প্রচারক প্রশিক্ষণ ফোরাম ও প্রশ্নোত্তর",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_11_0_0",
            "textEn": "1. Can a scientist believe in God?",
            "textBn": ""
          },
          {
            "id": "item_11_0_1",
            "textEn": "2. Getting the eyes to see God",
            "textBn": ""
          },
          {
            "id": "item_11_0_2",
            "textEn": "3. Vedic wisdom — The Privilege of Humanity",
            "textBn": ""
          },
          {
            "id": "item_11_0_3",
            "textEn": "4. Science of Soul",
            "textBn": ""
          },
          {
            "id": "item_11_0_4",
            "textEn": "5. Substance and Shadow",
            "textBn": ""
          },
          {
            "id": "item_11_0_5",
            "textEn": "6. If God is One, why there are so many religions?",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_11_1_0",
            "textEn": "1. Senses — gratification or purification?",
            "textBn": ""
          },
          {
            "id": "item_11_1_1",
            "textEn": "2. We are animals plus humans",
            "textBn": ""
          },
          {
            "id": "item_11_1_2",
            "textEn": "3. Where is your religion?",
            "textBn": ""
          },
          {
            "id": "item_11_1_3",
            "textEn": "4. On seeing God",
            "textBn": ""
          },
          {
            "id": "item_11_1_4",
            "textEn": "5. Does Krishna know our future?",
            "textBn": ""
          },
          {
            "id": "item_11_1_5",
            "textEn": "6. 'NO MORE CHEAP BODIES'",
            "textBn": ""
          },
          {
            "id": "item_11_1_6",
            "textEn": "7. 'NONSENSE COMMENTARY ON BG'",
            "textBn": ""
          },
          {
            "id": "item_11_1_7",
            "textEn": "8. 'THE FIGHTING SPIRIT'",
            "textBn": ""
          },
          {
            "id": "item_11_1_8",
            "textEn": "9. 'WHO LOVES GOD'",
            "textBn": ""
          },
          {
            "id": "item_11_1_9",
            "textEn": "10. 'CHEMICAL EVOLUTION, WHERE DO CHEMICALS COME FROM'",
            "textBn": ""
          },
          {
            "id": "item_11_1_10",
            "textEn": "11. 'GIVE GOD THE NOBEL PRIZE'",
            "textBn": ""
          },
          {
            "id": "item_11_1_11",
            "textEn": "12. 'IS IT ALRIGHT TO HAVE A GIRLFRIEND OR BOYFRIEND'",
            "textBn": ""
          },
          {
            "id": "item_11_1_12",
            "textEn": "13. 'IS KC NOT SOME TYPE OF CONDITIONING'",
            "textBn": ""
          },
          {
            "id": "item_11_1_13",
            "textEn": "14. 'ON CHRIST, CHRISTIANS AND KRISHNA'",
            "textBn": ""
          },
          {
            "id": "item_11_1_14",
            "textEn": "15. 'ON DARWINIAN EVOLUTION'",
            "textBn": ""
          },
          {
            "id": "item_11_1_15",
            "textEn": "16. 'ON SLAVE MENTALITY'",
            "textBn": ""
          },
          {
            "id": "item_11_1_16",
            "textEn": "17. 'ON THE EDITORIAL POLICY OF BTG'",
            "textBn": ""
          },
          {
            "id": "item_11_1_17",
            "textEn": "18. 'PEOPLE ARE LIVING LIKE HOGS AND DOGS'",
            "textBn": ""
          },
          {
            "id": "item_11_1_18",
            "textEn": "19. 'PLAIN LIVING, HIGH THINKING'",
            "textBn": ""
          },
          {
            "id": "item_11_1_19",
            "textEn": "20. 'THE MISTAKE MADE BY THE RICHEST AMERICAN'",
            "textBn": ""
          },
          {
            "id": "item_11_1_20",
            "textEn": "21. 'VARNASHRAMA CAN SOLVE UNEMPLOYMENT PROBLEM'",
            "textBn": ""
          },
          {
            "id": "item_11_1_21",
            "textEn": "1. 'ON TECHNOLOGY AND UNEMPLOYMENT'",
            "textBn": ""
          },
          {
            "id": "item_11_1_22",
            "textEn": "2. 'ON HUMAN SUFFERING AND UNJUST GOD'",
            "textBn": ""
          },
          {
            "id": "item_11_1_23",
            "textEn": "3. 'THE ABSURD DIALECTIC'",
            "textBn": ""
          },
          {
            "id": "item_11_1_24",
            "textEn": "4. 'KC IS NOT POSSIBLE FOR EVERYONE?'",
            "textBn": ""
          },
          {
            "id": "item_11_1_25",
            "textEn": "5. 'IS ACCEPTING ONE AUTHORITY NOT BAD'",
            "textBn": ""
          },
          {
            "id": "item_11_1_26",
            "textEn": "6. 'END OF KALI YUGA — NO MORE HARE KRISHNA'",
            "textBn": ""
          },
          {
            "id": "item_11_1_27",
            "textEn": "7. 'HIS FINAL INSTRUCTIONS'",
            "textBn": ""
          },
          {
            "id": "item_11_1_28",
            "textEn": "8. 'IN NATURE THERE ARE NO MISTAKES'",
            "textBn": ""
          },
          {
            "id": "item_11_1_29",
            "textEn": "9. 'INSTANT HEAVEN FOLLOWED BY HELLISH FRUSTRATION'",
            "textBn": ""
          },
          {
            "id": "item_11_1_30",
            "textEn": "10. 'LSD AND LIBERATION'",
            "textBn": ""
          },
          {
            "id": "item_11_1_31",
            "textEn": "11. 'ON EDUCATION AND THE GOOD LIFE'",
            "textBn": ""
          },
          {
            "id": "item_11_1_32",
            "textEn": "12. 'ON RESPONSIBILITY'",
            "textBn": ""
          },
          {
            "id": "item_11_1_33",
            "textEn": "13. 'ON SEX, SUFFERING AND HAPPINESS'",
            "textBn": ""
          },
          {
            "id": "item_11_1_34",
            "textEn": "14. 'THE VISION TO SEE LIFE IN STONE'",
            "textBn": ""
          },
          {
            "id": "item_11_1_35",
            "textEn": "15. 'WHY DO THEY SEEM SO STRANGE'",
            "textBn": ""
          },
          {
            "id": "item_11_1_36",
            "textEn": "16. 'YOU ARE NOT THE SUPREME'",
            "textBn": ""
          }
        ]
      },
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_11_2_0",
            "textEn": "1. CAN YOU SHOW ME GOD?",
            "textBn": ""
          },
          {
            "id": "item_11_2_1",
            "textEn": "2. GROPE IN THE DARK OR PRAY FOR LIGHT?",
            "textBn": ""
          },
          {
            "id": "item_11_2_2",
            "textEn": "3. ARE VEDAS NOT OUTDATED?",
            "textBn": ""
          },
          {
            "id": "item_11_2_3",
            "textEn": "4. REINCARNATION — FACT OR FICTION?",
            "textBn": ""
          },
          {
            "id": "item_11_2_4",
            "textEn": "5. WHO IS A GURU AND WHY DO I NEED ONE?",
            "textBn": ""
          },
          {
            "id": "item_11_2_5",
            "textEn": "6. MILLIONS OF VARIETIES OF SPECIES — WHAT'S THEIR ORIGIN?",
            "textBn": ""
          },
          {
            "id": "item_11_2_6",
            "textEn": "7. DID MAN EVOLVE FROM BRANCHES TO BENCHES?",
            "textBn": ""
          },
          {
            "id": "item_11_2_7",
            "textEn": "8. FAST FOOD, BUT SLOW TO DIGEST; BROAD ROADS BUT NARROW MINDS — ARE WE IN THE RIGHT DIRECTION?",
            "textBn": ""
          },
          {
            "id": "item_11_2_8",
            "textEn": "9. IS MANAVA SEVA NOT MADHAVA SEVA?",
            "textBn": ""
          },
          {
            "id": "item_11_2_9",
            "textEn": "10. CHEATING RELIGION &amp; REAL RELIGION",
            "textBn": ""
          },
          {
            "id": "item_11_2_10",
            "textEn": "11. WHY NOT ENJOY IN YOUTH WHEN WE HAVE EVERYTHING?",
            "textBn": ""
          },
          {
            "id": "item_11_2_11",
            "textEn": "12. GREED &amp; PEACE — INCOMPATIBLES",
            "textBn": ""
          },
          {
            "id": "item_11_2_12",
            "textEn": "1. WHAT IS REAL PROGRESS?",
            "textBn": ""
          },
          {
            "id": "item_11_2_13",
            "textEn": "2. WHY DO BAD THINGS HAPPEN TO GOOD PEOPLE?",
            "textBn": ""
          },
          {
            "id": "item_11_2_14",
            "textEn": "3. WHY DO YOU PEOPLE WORSHIP ONLY KRISHNA?",
            "textBn": ""
          },
          {
            "id": "item_11_2_15",
            "textEn": "4. IS ECONOMIC DEVELOPMENT NOT THE KEY TO REAL HUMAN HAPPINESS?",
            "textBn": ""
          },
          {
            "id": "item_11_2_16",
            "textEn": "5. WHY SHOULD KRISHNA BE SO MUCH HIGHLIGHTED?",
            "textBn": ""
          },
          {
            "id": "item_11_2_17",
            "textEn": "6. WORLD OF SUFFERING AND WORLD OF BLISS",
            "textBn": ""
          },
          {
            "id": "item_11_2_18",
            "textEn": "7. VEDIC EVOLUTION AND DARWIN'S EVOLUTION",
            "textBn": ""
          },
          {
            "id": "item_11_2_19",
            "textEn": "8. MATERIAL PLEASURE AND SPIRITUAL BLISS",
            "textBn": ""
          },
          {
            "id": "item_11_2_20",
            "textEn": "9. RELEVANCE OF BHAGAVAD GITA FOR THE MODERN CORPORATE MAN",
            "textBn": ""
          },
          {
            "id": "item_11_2_21",
            "textEn": "10. IS GOD NOT RESPONSIBLE FOR EVERYTHING?",
            "textBn": ""
          },
          {
            "id": "item_11_2_22",
            "textEn": "11. WHY WERE WOMEN MISTREATED OR DOWNPLAYED IN VEDIC SOCIETY?",
            "textBn": ""
          },
          {
            "id": "item_11_2_23",
            "textEn": "12. IS CASTE SYSTEM NOT A CONCOCTION OF THE NARROW-MINDED?",
            "textBn": ""
          },
          {
            "id": "item_11_2_24",
            "textEn": "1. CAN GOD BE IMMORAL AND PARTIAL?",
            "textBn": ""
          },
          {
            "id": "item_11_2_25",
            "textEn": "2. IS SPIRITUAL LIFE NOT PESSIMISM OR OFTEN ESCAPISM?",
            "textBn": ""
          },
          {
            "id": "item_11_2_26",
            "textEn": "3. WHY IS ABORTION SINFUL, IF IT IS JUST A REMOVAL OF TISSUE?",
            "textBn": ""
          },
          {
            "id": "item_11_2_27",
            "textEn": "4. WHAT IS REAL DHARMA?",
            "textBn": ""
          },
          {
            "id": "item_11_2_28",
            "textEn": "5. IF YOU ARE DEVOTEE OF NARAYAN, WHY NOT SERVE POOR NARAYANAS SUFFERING IN THE STREET?",
            "textBn": ""
          },
          {
            "id": "item_11_2_29",
            "textEn": "6. WHAT'S WRONG WITH BEEF?",
            "textBn": ""
          },
          {
            "id": "item_11_2_30",
            "textEn": "7. SEEING GOD EVERYWHERE",
            "textBn": ""
          },
          {
            "id": "item_11_2_31",
            "textEn": "8. WHY NOT JUST BE A HARMLESS PERSON?",
            "textBn": ""
          },
          {
            "id": "item_11_2_32",
            "textEn": "9. IF SILENCE IS GOLDEN, WHY MAKE A DISPLAY OF DEVOTION?",
            "textBn": ""
          },
          {
            "id": "item_11_2_33",
            "textEn": "10. CAN A SADHU SUPPOSED TO LIVE IN RECLUSE INDULGE IN CITY LIFE?",
            "textBn": ""
          },
          {
            "id": "item_11_2_34",
            "textEn": "11. IS CHANTING NOT SOME SORT OF BRAINWASHING EXERCISE?",
            "textBn": ""
          },
          {
            "id": "item_11_2_35",
            "textEn": "12. IF ALL PATHS LEAD TO SAME GOAL, WHY CAN'T I DO MY OWN WAY OF WORSHIP?",
            "textBn": ""
          },
          {
            "id": "item_11_2_36",
            "textEn": "13. CAN THERE BE AMERICAN BRAHMANA OR AUSTRALIAN BRAHMANA BESIDES INDIAN BRAHMANA?",
            "textBn": ""
          },
          {
            "id": "item_11_2_37",
            "textEn": "14. IS BHAKTI YOGA NOT FOR SENTIMENTAL UNEDUCATED PEOPLE?",
            "textBn": ""
          },
          {
            "id": "item_11_2_38",
            "textEn": "15. ARE PURANAS NOT SOME MYTHOLOGY?",
            "textBn": ""
          },
          {
            "id": "item_11_2_39",
            "textEn": "16. MODERN MAN HAS BECOME GOD",
            "textBn": ""
          },
          {
            "id": "item_11_2_40",
            "textEn": "17. DEPENDENCE OR INDEPENDENCE?",
            "textBn": ""
          },
          {
            "id": "item_11_2_41",
            "textEn": "18. IS CELIBACY NOT SELF DECEPTION?",
            "textBn": ""
          },
          {
            "id": "item_11_2_42",
            "textEn": "19. MAN ON MOON AND MARS",
            "textBn": ""
          },
          {
            "id": "item_11_2_43",
            "textEn": "20. IF GOD IS EVERYWHERE, WHY GO TO TEMPLE?",
            "textBn": ""
          }
        ]
      }
    ]
  },
  {
    "id": "course_13",
    "courseNumber": 13,
    "titleEn": "13. Glossary",
    "titleBn": "শব্দকোষ ও সংক্ষিপ্ত রূপসমূহ",
    "subchapters": []
  },
  {
    "id": "course_14",
    "courseNumber": 14,
    "titleEn": "14. Future Video Series Topics",
    "titleBn": "শ্রীল রাধেশ্যাম প্রভুর ভবিষ্যত ভিডিও লেকচার বিষয়াবলী",
    "subchapters": [
      {
        "title": "General",
        "badge": "",
        "items": [
          {
            "id": "item_13_0_0",
            "textEn": "1. Healthy and Unhealthy Competition",
            "textBn": ""
          },
          {
            "id": "item_13_0_1",
            "textEn": "2. Resisting temptations",
            "textBn": ""
          },
          {
            "id": "item_13_0_2",
            "textEn": "3. Developing aversion for fault finding",
            "textBn": ""
          },
          {
            "id": "item_13_0_3",
            "textEn": "4. Fearlessness and a bold spirit in preaching",
            "textBn": ""
          },
          {
            "id": "item_13_0_4",
            "textEn": "5. Respectful and arrogant attitudes",
            "textBn": ""
          },
          {
            "id": "item_13_0_5",
            "textEn": "6. Accepting spiritual master — Meaning of Harinam Diksha",
            "textBn": ""
          },
          {
            "id": "item_13_0_6",
            "textEn": "7. Learning to offer prayers and developing a Prayerful attitude",
            "textBn": ""
          },
          {
            "id": "item_13_0_7",
            "textEn": "8. Managing Anger and capturing the constructiveness of Anger",
            "textBn": ""
          },
          {
            "id": "item_13_0_8",
            "textEn": "9. Giving love, care and concern — Gentle, Friendly and helpful",
            "textBn": ""
          },
          {
            "id": "item_13_0_9",
            "textEn": "10. Does familiarity breed contempt?",
            "textBn": ""
          },
          {
            "id": "item_13_0_10",
            "textEn": "11. Dealing with Loneliness",
            "textBn": ""
          },
          {
            "id": "item_13_0_11",
            "textEn": "12. Stop worrying and Start Living &amp; Facing failures with proper attitude in material and spiritual life",
            "textBn": ""
          },
          {
            "id": "item_13_0_12",
            "textEn": "13. Learning the art of internal submissiveness",
            "textBn": ""
          },
          {
            "id": "item_13_0_13",
            "textEn": "14. Intimacy in relationships between devotees",
            "textBn": ""
          },
          {
            "id": "item_13_0_14",
            "textEn": "15. Worshiping the Acharya (acharyopaasanam)",
            "textBn": ""
          },
          {
            "id": "item_13_0_15",
            "textEn": "16. Following previous acharyas strictly vs. Adjusting details without changing principles",
            "textBn": ""
          },
          {
            "id": "item_13_0_16",
            "textEn": "17. How to see disciples of different spiritual masters as our own family members?",
            "textBn": ""
          },
          {
            "id": "item_13_0_17",
            "textEn": "18. Dealing with elders, children, women, neophytes, wellwishers etc.",
            "textBn": ""
          },
          {
            "id": "item_13_0_18",
            "textEn": "19. Fall down or bloops — How does it happen?",
            "textBn": ""
          },
          {
            "id": "item_13_0_19",
            "textEn": "20. 'Nectar shopping' or looking for 'higher' things",
            "textBn": ""
          },
          {
            "id": "item_13_0_20",
            "textEn": "21. Dealing with karmis at office",
            "textBn": ""
          },
          {
            "id": "item_13_0_21",
            "textEn": "22. Five lessons on Tolerance from Life of King Anga",
            "textBn": ""
          },
          {
            "id": "item_13_0_22",
            "textEn": "23. Lessons from Gajendra's life and prayers",
            "textBn": ""
          },
          {
            "id": "item_13_0_23",
            "textEn": "24. Learning to gain Freedom from envy from Amogha pastime",
            "textBn": ""
          },
          {
            "id": "item_13_0_24",
            "textEn": "25. Lessons from Samudra manthan lila",
            "textBn": ""
          },
          {
            "id": "item_13_0_25",
            "textEn": "26. Celebrating diversity in unity",
            "textBn": ""
          },
          {
            "id": "item_13_0_26",
            "textEn": "27. Ten lessons from Life of King Vena",
            "textBn": ""
          },
          {
            "id": "item_13_0_27",
            "textEn": "28. Three gates that lead us to hell",
            "textBn": ""
          },
          {
            "id": "item_13_0_28",
            "textEn": "29. The shelter and the sheltered — Kardama and Devahuti",
            "textBn": ""
          },
          {
            "id": "item_13_0_29",
            "textEn": "30. Purity vs Hypocrisy",
            "textBn": ""
          },
          {
            "id": "item_13_0_30",
            "textEn": "31. Developing firm faith in Sri Krishna",
            "textBn": ""
          },
          {
            "id": "item_13_0_31",
            "textEn": "32. Lessons from Daksha's pride and Sati's conversation with Shiva",
            "textBn": ""
          },
          {
            "id": "item_13_0_32",
            "textEn": "33. Qualities and Compassion of Prahlada",
            "textBn": ""
          },
          {
            "id": "item_13_0_33",
            "textEn": "34. Dealing with material desires — Lessons from Dhruva's prayers",
            "textBn": ""
          },
          {
            "id": "item_13_0_34",
            "textEn": "35. Introvertish vs. Extrovertish attitudes",
            "textBn": ""
          },
          {
            "id": "item_13_0_35",
            "textEn": "36. Escapist tendency",
            "textBn": ""
          },
          {
            "id": "item_13_0_36",
            "textEn": "37. Dealing with children, animals, plants, unmarried women",
            "textBn": ""
          },
          {
            "id": "item_13_0_37",
            "textEn": "38. How to balance economic and social responsibilities with spiritual vows",
            "textBn": ""
          },
          {
            "id": "item_13_0_38",
            "textEn": "39. Srila Prabhupada and the GBC — 4th year series",
            "textBn": ""
          },
          {
            "id": "item_13_0_39",
            "textEn": "40. Involvement in Fringe fields — final year series",
            "textBn": ""
          },
          {
            "id": "item_13_0_40",
            "textEn": "41. Loyalty and disloyalty to guru parampara — final year series",
            "textBn": ""
          },
          {
            "id": "item_13_0_41",
            "textEn": "42. Vapu and Vani seva",
            "textBn": ""
          }
        ]
      }
    ]
  }
];
