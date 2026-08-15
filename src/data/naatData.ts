import { NaatDetails } from '../types';

export const MADINAH_NAAT: NaatDetails = {
  titleUrdu: 'مدینہ کی تمنا - مدینہ بلا لو یا رسول اللہ ﷺ',
  titleEnglish: 'Madinah Ki Tamanna (The Longing for Madinah)',
  subtitle: 'A Sacred Spiritual Naat of Ishq-e-Rasool ﷺ, Tears, Repentance & Divine Peace',
  poet: 'Devotional Kalam-e-Aqdas (Classical Islamic Devotional Tradition)',
  vocalStyle: 'Warm, Soulful South Asian Naat Reciter with Emotional Trembling, Controlled Vibrato & Tearful Phrasing',
  musicalDirection: 'Obsidian Night Ambience, Intimate Whispered Dua, Organic Daf Percussion, Soaring Ney Flute, Cinematic Strings Swell & Marble Sanctuary Reverb',
  overallTheme: 'Silent Night Longing (00:00) → Believer’s Solitude (00:25) → Dawn of Hope (01:10) → Main Devotional Chorus "Madinah Bula Lo" (01:30) → Repentance & Salawat (02:10) → Devotional Stillness Bridge (02:55) → Grand Climax Chorus (03:20) → Serene Spiritual Outro (04:00).',
  totalDurationSeconds: 270, // 04:30
  verses: [
    {
      id: 'verse-0-intro',
      verseNumber: 1,
      sectionType: 'intro',
      sectionTitle: 'روحانی تمہید | Spiritual Intro',
      timeRange: '00:00 – 00:25',
      urdu: [
        'رات کی خاموشی میں، دل کی تنہائی ہے',
        'مدینہ یاد آیا ہے، آنکھوں میں نمی آئی ہے'
      ],
      roman: [
        'Raat ki khamoshi mein, dil ki tanhai hai',
        'Madinah yaad aaya hai, aankhon mein nami aayi hai'
      ],
      english: [
        'In the silent stillness of the night, amid the soul’s solitude,',
        'Madinah surfaces in remembrance, and gentle tears well in the eyes.'
      ],
      spiritualContext: 'A quiet, introspective night atmosphere. The restless believer sits alone, surrounded by darkness, longing for the radiant peace of Madinah.',
      hadithOrTafseerRef: '"Whoever visits my grave, my intercession becomes obligatory for him." — Sunan ad-Daraqutni',
      emotionalStage: 'Longing',
      musicalCue: {
        tempo: 68,
        dafIntensity: 0.08,
        stringSwell: 0.15,
        neyPresence: 0.75,
        vocalVibrato: 0.4,
        choralLayer: false,
        description: 'Almost silent atmosphere. Soft night ambience, distant atmospheric texture, one soft daf hit after several seconds, intimate whispered vocal entry.'
      },
      durationSeconds: 25
    },
    {
      id: 'verse-1-solitude',
      verseNumber: 2,
      sectionType: 'verse',
      sectionTitle: 'بند اول: تنہائی و دوری | Verse 1: The Believer’s Solitude',
      timeRange: '00:25 – 01:10',
      urdu: [
        'میں دور ہوں مدینے سے، مگر دل وہیں رہتا ہے',
        'یہ اشکِ ندامت ہر پل، پلکوں سے بہتا ہے',
        'کاش وہ سبز گنبد، اک بار نظر آئے',
        'بے چین مِری جاں کو، کچھ چین و سکوں پائے'
      ],
      roman: [
        'Main door hoon Madine se, magar dil wahin rehta hai',
        'Yeh ashk-e-nadaamat har pal, palkon se behta hai',
        'Kaash woh Sabz Gumbad, ik baar nazar aaye',
        'Bechain meri jaan ko, kuchh chain-o-sukoon paaye'
      ],
      english: [
        'I am far from Madinah, yet my heart resides there forever,',
        'These tears of yearning and remorse stream constantly from my eyes.',
        'If only that radiant Green Dome would appear before my gaze just once,',
        'So that my restless soul might finally taste stillness and tranquility.'
      ],
      spiritualContext: 'Captures the profound loneliness of being geographically distant from the City of Light while the heart remains spiritually tethered to the Rawdah.',
      hadithOrTafseerRef: '"Medina is a sanctuary from \'Air to Thaur... Whosoever loves Medina, Allah fills his heart with faith." — Sahih Bukhari',
      emotionalStage: 'Remembrance',
      musicalCue: {
        tempo: 70,
        dafIntensity: 0.25,
        stringSwell: 0.35,
        neyPresence: 0.8,
        vocalVibrato: 0.55,
        choralLayer: false,
        description: 'Minimal instrumentation; intimate vocal phrasing accompanied by delicate breathy ney flute ornaments and soft low-frequency pad.'
      },
      durationSeconds: 45
    },
    {
      id: 'verse-2-prechorus',
      verseNumber: 3,
      sectionType: 'pre_chorus',
      sectionTitle: 'پیش کورس: امید کی کرن | Pre-Chorus: Dawn of Hope',
      timeRange: '01:10 – 01:30',
      urdu: [
        'مایوس نہیں یہ دل، رحمت کا سہارا ہے',
        'سرکارِ دو عالمؐ کا، ہر دُکھی کو پکارا ہے'
      ],
      roman: [
        'Maayoos nahin yeh dil, rehmat ka sahara hai',
        'Sarkar-e-Do Aalam ﷺ ka, har dukhi ko pukaara hai'
      ],
      english: [
        'This heart is not despondent, for Divine Mercy is its sanctuary,',
        'The Master of Both Worlds ﷺ is the solace called upon by every weary soul.'
      ],
      spiritualContext: 'A transition from sorrow toward spiritual hope. The awareness of Allah’s infinite mercy and the Prophet’s intercession elevates the seeker’s soul.',
      hadithOrTafseerRef: '"My mercy encompasses all things." — Surah Al-A\'raf [7:156]',
      emotionalStage: 'Hope & Mercy',
      musicalCue: {
        tempo: 72,
        dafIntensity: 0.5,
        stringSwell: 0.6,
        neyPresence: 0.7,
        vocalVibrato: 0.65,
        choralLayer: false,
        description: 'Gradually introducing daf rhythm and ascending strings swell; the vocal rises in emotional intensity and warmth.'
      },
      durationSeconds: 20
    },
    {
      id: 'verse-3-chorus',
      verseNumber: 4,
      sectionType: 'chorus',
      sectionTitle: 'کورَس: مدینہ بلا لو | Main Naat Chorus: The Heart’s Cry',
      timeRange: '01:30 – 02:10',
      urdu: [
        'مدینہ بلا لو، مدینہ بلا لو، یا رسول اللہ ﷺ!',
        'اپنے در پہ ہم غریبوں کو، اب تو بلا لو یا رسول اللہ ﷺ!',
        'روضۂ اقدس پہ جا کر، روئیں ہم اشک بہا کر',
        'اپنے کرم کے سائے میں، ہم کو چھپا لو یا رسول اللہ ﷺ!'
      ],
      roman: [
        'Madinah bula lo, Madinah bula lo, Ya Rasool Allah ﷺ!',
        'Apne darr pe hum ghareebon ko, ab toh bula lo Ya Rasool Allah ﷺ!',
        'Roza-e-Aqdas pe jaa kar, royein hum ashk baha kar',
        'Apne karam ke saaye mein, hum ko chhupa lo Ya Rasool Allah ﷺ!'
      ],
      english: [
        'Summon us to Madinah, summon us to Madinah, O Messenger of Allah ﷺ!',
        'To your sanctified doorway, summon us humble seekers at last, O Messenger of Allah ﷺ!',
        'Standing before your Holy Shrine, let us weep and pour out our tears,',
        'And beneath the protective shade of your mercy, shelter us, O Messenger of Allah ﷺ!'
      ],
      spiritualContext: 'The unforgettable emotional centerpiece of the Naat. A collective, heartfelt cry of love and supplication that unites every believer.',
      hadithOrTafseerRef: '"None of you truly believes until I am more beloved to him than his father, his child, and all of mankind." — Sahih al-Bukhari',
      emotionalStage: 'Deep Love',
      musicalCue: {
        tempo: 74,
        dafIntensity: 0.85,
        stringSwell: 0.9,
        neyPresence: 0.85,
        vocalVibrato: 0.8,
        choralLayer: true,
        description: 'Enormous emotional centerpiece: resonant daf frame drum, rich cinematic strings, layered devotional male vocal choir backing the lead.'
      },
      durationSeconds: 40
    },
    {
      id: 'verse-4-repentance',
      verseNumber: 5,
      sectionType: 'verse',
      sectionTitle: 'بند دوم: توبہ و بخشش | Verse 2: Repentance, Salawat & Pardon',
      timeRange: '02:10 – 02:55',
      urdu: [
        'بخش دو مِرے عیبوں کو، رحمت کے سمندر سے',
        'کوئی نہ گیا خالی، سرکارؐ ترے در سے',
        'پڑھتے ہیں درود ہم سب، بھیگی ہوئی آنکھوں سے',
        'مہکا ہے مِرا سینہ، سرکارؐ کی باتوں سے'
      ],
      roman: [
        'Bakhsh do mere aibon ko, rehmat ke samandar se',
        'Koi na gaya khaali, Sarkar ﷺ tere darr se',
        'Padhte hain Durood hum sab, bheegee hui aankhon se',
        'Mehka hai mera seena, Sarkar ﷺ ki baaton se'
      ],
      english: [
        'Pardon all my shortcomings through the boundless ocean of your mercy,',
        'For no petitioner has ever departed empty-handed from your blessed threshold.',
        'We send Durood and Salaam with tear-glistening eyes,',
        'And my heart becomes fragrant with the sublime remembrance of the Prophet ﷺ.'
      ],
      spiritualContext: 'Diving deep into repentance (Tawbah) and sending Durood-o-Salaam, seeking forgiveness and finding sanctuary under the Prophet’s intercession.',
      hadithOrTafseerRef: '"Whoever sends blessings upon me once, Allah will send blessings upon him ten times and erase ten sins." — Sahih Muslim',
      emotionalStage: 'Tears & Repentance',
      musicalCue: {
        tempo: 70,
        dafIntensity: 0.6,
        stringSwell: 0.7,
        neyPresence: 0.75,
        vocalVibrato: 0.7,
        choralLayer: true,
        description: 'Tearful, expressive male vocal intonation with microtonal ornaments; gentle daf rhythm and warm strings pad.'
      },
      durationSeconds: 45
    },
    {
      id: 'verse-5-bridge-stillness',
      verseNumber: 6,
      sectionType: 'bridge',
      sectionTitle: 'برِج: صلوٰۃ و سکوت | Devotional Bridge: Stillness & Salawat',
      timeRange: '02:55 – 03:20',
      urdu: [
        'صَلَّی اللہُ عَلٰی مُحَمَّدٍ، صَلَّی اللہُ عَلَیْہِ وَسَلَّمْ',
        'تجھ سا کوئی نہیں ہے، تجھ پر سلام ہر دم'
      ],
      roman: [
        'Sallallahu Ala Muhammad ﷺ, Sallallahu Alaihi Wa Sallam',
        'Tujh sa koi nahin hai, Tujh par Salaam har dam'
      ],
      english: [
        'May the peace and blessings of Allah be upon Muhammad ﷺ, peace and blessings upon him!',
        'None in creation compares to you; peace and salutations upon you with every breath.'
      ],
      spiritualContext: 'Almost everything drops away. A moment of complete devotional stillness and intimate Salawat recitation directly addressing the Prophet ﷺ.',
      hadithOrTafseerRef: '"The closest of people to me on the Day of Resurrection will be those who sent the most blessings upon me." — Sunan at-Tirmidhi',
      emotionalStage: 'Spiritual Elevation',
      musicalCue: {
        tempo: 68,
        dafIntensity: 0.1,
        stringSwell: 0.2,
        neyPresence: 0.9,
        vocalVibrato: 0.5,
        choralLayer: false,
        description: 'Almost everything drops away: pure intimate whispered vocal, soaring solo ney flute, and quiet ambient silence.'
      },
      durationSeconds: 25
    },
    {
      id: 'verse-6-final-chorus',
      verseNumber: 7,
      sectionType: 'chorus',
      sectionTitle: 'فائنل کورَس: معراجِ عشق | Grand Final Chorus: The Climax of Love',
      timeRange: '03:20 – 04:00',
      urdu: [
        'مدینہ بلا لو، مدینہ بلا لو، یا رسول اللہ ﷺ!',
        'اپنے در پہ ہم غریبوں کو، اب تو بلا لو یا رسول اللہ ﷺ!',
        'روئیں گے ہم لپٹ کر، روضے کی جالیوں سے',
        'جھولیاں ہماری بھر دو، اپنی سخاوتوں سے!'
      ],
      roman: [
        'Madinah bula lo, Madinah bula lo, Ya Rasool Allah ﷺ!',
        'Apne darr pe hum ghareebon ko, ab toh bula lo Ya Rasool Allah ﷺ!',
        'Royein ge hum lipat kar, Roze ki jaaliyon se',
        'Jholiyan humari bhar do, apni sakhaawaton se!'
      ],
      english: [
        'Summon us to Madinah, summon us to Madinah, O Messenger of Allah ﷺ!',
        'To your sanctified doorway, summon us humble seekers at last, O Messenger of Allah ﷺ!',
        'We shall hold fast to the golden lattice of the Sacred Rawdah and weep,',
        'Fill our outstretched laps with your bountiful, boundless generosity!'
      ],
      spiritualContext: 'The absolute emotional peak of the Naat. The vocal reaches high notes of pure devotional ecstasy and collective prayer.',
      hadithOrTafseerRef: '"A person will be with those whom he loves on the Day of Resurrection." — Sahih al-Bukhari',
      emotionalStage: 'Deep Love',
      musicalCue: {
        tempo: 76,
        dafIntensity: 1.0,
        stringSwell: 1.0,
        neyPresence: 0.95,
        vocalVibrato: 0.9,
        choralLayer: true,
        description: 'Full emotional arrangement at its peak: powerful daf pulse, majestic layered strings, choral harmonies, and peak vocal passion.'
      },
      durationSeconds: 40
    },
    {
      id: 'verse-7-outro',
      verseNumber: 8,
      sectionType: 'outro',
      sectionTitle: 'مقطع و خاتمہ: پیامِ دل | Spiritual Outro: Peace & Eternal Connection',
      timeRange: '04:00 – 04:30',
      urdu: [
        'میں مدینہ سے دور ہوں لیکن، مِری روح وہیں ہے',
        'میری محبت اور دعا، حضورؐ تک پہنچتی ہے',
        'صَلَّی اللہُ عَلٰی حَبِیبِہٖ، مُحَمَّدٍ وَّآلِہٖ وَسَلَّمْ'
      ],
      roman: [
        'Main Madinah se door hoon lekin, meri rooh wahin hai',
        'Meri mohabbat aur dua, Huzoor ﷺ tak pahunchti hai',
        'Sallallahu Ala Habibihi, Muhammadin Wa Aalihi Wa Sallam'
      ],
      english: [
        'I may be physically far from Madinah, yet my spirit dwells there forever.',
        'My deep love and fervent prayers reach the blessed presence of the Prophet ﷺ.',
        'May Allah send blessings upon His Beloved, Muhammad ﷺ, and upon his family and companions.'
      ],
      spiritualContext: 'Instruments dissolve away leaving only the serene voice, soft night breeze, and fading heartbeat pulse. The listener is left with eyes moist with love and a soul filled with Sakinah (divine tranquility).',
      hadithOrTafseerRef: '"There is no one who sends greetings of peace upon me except that Allah returns my soul so that I may return his greeting." — Sunan Abi Dawud',
      emotionalStage: 'Peace & Contentment',
      musicalCue: {
        tempo: 60,
        dafIntensity: 0.1,
        stringSwell: 0.2,
        neyPresence: 0.85,
        vocalVibrato: 0.35,
        choralLayer: false,
        description: 'Gradually removing all instruments; leaving only the intimate voice, soft night ambience, and a lingering lone daf pulse fading into peace.'
      },
      durationSeconds: 30
    }
  ]
};

