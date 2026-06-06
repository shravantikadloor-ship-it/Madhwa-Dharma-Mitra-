import { useState, useRef, useEffect } from "react";

// ══════════════════════════════════════════════════════════════
//  KNOWLEDGE BASE  (RAG corpus — 30 topics)
// ══════════════════════════════════════════════════════════════
const KNOWLEDGE_BASE = [
  // ── CORE PHILOSOPHY ──────────────────────────────────────────
  {
    id: 1, topic: "Founder & Philosophy",
    content: `Sri Madhvacharya (1238–1317 CE), also called Purna Prajna or Ananda Tirtha, is the founder of the Dvaita Vedanta school and the Madhwa Sampradaya. Born in Pajaka near Udupi, Karnataka. He established Tattvavada asserting five fundamental differences (Pancha Bheda). He refuted Advaita and Vishishtadvaita. Core teaching: Jiva (soul) and Brahman (Vishnu) are eternally and fundamentally distinct. Mukti is eternal blissful proximity to Lord Vishnu, not merger. The Guru Parampara starts: Vishnu → Brahma → Narada → Vedavyasa → Madhvacharya. Vedavyasa was his direct Guru at Badrikashrama.`
  },
  {
    id: 2, topic: "Dvaita Vedanta Pancha Bheda",
    content: `Dvaita Vedanta (Tattvavada) teaches five eternal differences (Pancha Bheda): 1) Jiva-Brahma Bheda: souls differ from God/Vishnu. 2) Jada-Brahma Bheda: inert matter differs from God. 3) Jiva-Jiva Bheda: souls differ from each other. 4) Jada-Jiva Bheda: matter differs from souls. 5) Jada-Jada Bheda: different matter differs from each other. Vishnu alone is Swatantra (independent). All Jivas and Jada are Paratantra (dependent). These differences are real—not maya/illusion. Mukti = eternal blissful service to Vishnu, with Taratamya (gradation of bliss) preserved.`
  },
  {
    id: 3, topic: "Taratamya Hierarchy",
    content: `Taratamya is the eternal hierarchy of beings in Dvaita philosophy. From highest to lowest: Vishnu (Supreme, independent), Lakshmi Devi (highest dependent being), Brahma/Vayu (equal second tier among Jivas), Garuda and Shesha, Indra, Saraswati/Bharati (consort of Vayu), and so on descending. Vayu (identified as Hanuman in Treta Yuga, Bhima in Dvapara, Madhvacharya in Kali Yuga) is the most exalted Jiva and intermediary between humans and Vishnu. Even in Mukti, Taratamya persists — souls experience bliss proportional to their inherent capacity, not equal bliss.`
  },
  {
    id: 4, topic: "Key Texts Sarva Mula Granthas",
    content: `Madhvacharya wrote 37 works called Sarva Mula Granthas. Key texts: Anuvyakhyana, Brahmasutra Bhashya, Gita Bhashya, Mahabharata Tatparya Nirnaya, Bhagavata Tatparya Nirnaya, Vishnu Tattva Vinirnaya. Later scholars elaborated: Jayatirtha wrote Nyaya Sudha and Tika literature; Vyasatirtha wrote Nyayamrita and Chandrika; Raghavendra Swami wrote over 60 works. Jagannatha Dasa's Harikathamrita Sara is called the fifth Veda by devotees.`
  },
  // ── PUJA VIDHANA ─────────────────────────────────────────────
  {
    id: 5, topic: "Nithya Puja Daily Worship Vidhana",
    content: `Madhwa daily puja (Nithya Devara Puja) steps: 1) Achamana — sip water thrice chanting Keshava, Narayana, Madhava. 2) Sankalpa — resolve the puja with date, place, purpose. 3) Kalasha Puja — consecrate water vessel with Panchakarpoora, Kesari, Lavanga, Elakki. 4) Abhisheka — bathe the idol/Saligrama with Pancha Amrita (milk, curd, ghee, honey, sugar) chanting Purusha Sukta. 5) Gandha — apply sandal paste. 6) Pushpa — offer flowers (Tulsi is supreme, offered with each name). 7) Dhupa — incense. 8) Deepa — light ghee lamp. 9) Naivedya — offer cooked food. 10) Dvadasha Stotra recitation during Naivedya. 11) Mangalarati — wave camphor flame clockwise. 12) Pradakshina — circumambulation. 13) Sashtanga Namaskara — full prostration. 14) Vishnu Sahasranama Parayana. 15) Mantrapushpa and Samarpana — "Krishnarpanamasthu." Urdhvapundra (vertical sandal paste mark) is applied at 12 body points before puja.`
  },
  {
    id: 6, topic: "Ekadashi Fasting Vidhana",
    content: `Ekadashi (11th lunar day) is the supreme fasting day. Both Shukla and Krishna Paksha Ekadashis observed. Dashami (10th): eat before sunset, avoid certain greens (leafy vegetables, rice, urad dal). Ekadashi: complete fast from grains — rice, wheat, dal all prohibited. Permitted: fruits, milk, sabudana, sendha namak (rock salt), dry fruits, certain roots. The night is spent in Vishnu bhajana and Sahasranama parayana. Dvadashi (12th): Parana — break fast at prescribed time within the Dvadashi window (must not cross Dvadashi tithi). The parana mantra: "Ajnana timirandhasya jnananjana shalakaya chakshur unmilitam yena tasmai Sri Gurave namah." Special Ekadashis in Madhwa tradition: Shayani Ekadashi (Ashadha Shukla) begins Chaturmasya; Utthana Ekadashi (Kartika Shukla) ends it; Vaikunta Ekadashi (Margashira/Pushya) is supremely auspicious.`
  },
  {
    id: 7, topic: "Krishnashtami Janmashtami Puja Vidhana",
    content: `Sri Krishna Janmashtami falls on Bhadrapada Krishna Ashtami. In Parabhava Samvatsara: 04 September 2026. Puja Vidhana: Fast the entire day. At midnight (birth hour of Krishna): Abhisheka of Krishna idol with Panchamrita. Offer butter (makhan), poha (flattened rice), panchasara. Chant: Krishnashtaka by Madhvacharya. Recite Sri Krishna's Dvadasha Naama: "Kesava, Narayana, Madhava, Govinda, Vishnu, Madhusudana, Trivikrama, Vamana, Sridhara, Hrishikesha, Padmanabha, Damodara." Sing Haridasas' Devaranamas on Krishna. Udupi Janmashtami is celebrated grandly. Break fast on Navami morning.`
  },
  {
    id: 8, topic: "Raghavendra Aradhana Puja Vidhana",
    content: `Sri Raghavendra Swami Aradhana (Shravana Bahula Triteeya) falls on 29-31 August 2026 in Parabhava Samvatsara. Puja Vidhana: 1) Brindavana Puja — decorate the Brindavana with flowers. 2) Abhisheka of Raghavendra Swami's Padukas (sandals) with Panchamrita. 3) Recite Raghavendra Swami Stotra: "Poojyaya Raghavendraya Satya Dharma Ratayacha, Bhajataam Kalpavrikshaaya Namathaam Kamadhenave." 4) Read Sri Raghavendra Vijaya (biography). 5) Mantralaya Sri Prabha recitation. 6) Distribute prasada. 7) Recite Rayara Stotra by Appannacharya. Fasting on this day is highly meritorious. Mantralayam sees lakhs of pilgrims during Aradhana.`
  },
  {
    id: 9, topic: "Narasimha Jayanti Puja Vidhana",
    content: `Narasimha Jayanti (Vaishakha Shukla Chaturdashi) falls on 30 April 2026 in Parabhava Samvatsara. Lord Narasimha is the ferocious man-lion form of Vishnu who destroyed Hiranyakashipu. Puja Vidhana: Fast the entire day. 1) Abhisheka of Narasimha with Panchamrita. 2) Offer red flowers (hibiscus). 3) Chant Narasimha Kavacham. 4) Recite Nakha Stuti (composed by Madhvacharya): "Pancha Nash… (praises Narasimha's nails that destroyed Hiranyakashipu)." 5) Chant Narasimha Ashtakam. 6) Recite Narasimha Panchratna Stotra. 7) Offer Ugra Narasimha Mantra: "Om Ugram Veeram Mahavishnum Jvalantam Sarvatomukham, Nrisimham Bheeshanam Bhadram Mrityur Mrityum Namamy Aham." 8) Mangalarati at dusk (appearance time). Break fast on Panchami.`
  },
  {
    id: 10, topic: "Rama Navami Puja Vidhana",
    content: `Sri Rama Navami (Chaitra Shukla Navami) falls on 27 March 2026 in Parabhava Samvatsara. Lord Rama is the seventh avatar of Vishnu. Puja Vidhana: 1) Fast until midday (Madhyahna — Lord Rama's birth time). 2) Abhisheka of Rama, Sita, Lakshmana, Hanuman. 3) Offer yellow flowers, bananas, panchamrita. 4) Chant: Ramashtakam, Sri Rama Raksha Stotra. 5) Recite Valmiki Ramayana — Balakanda — Balakanda Chapter 18 (Rama's birth). 6) Chant: "Sri Rama Rama Rameti, Rame Rame Manorame, Sahasranama Tattulyam, Rama Nama Varanane." 7) Tulsi Archana with "Sri Ramaya Namah." 8) Panaka (jaggery water with pepper) is traditional prasada on Navami. 9) Mangalarati and break fast after midday.`
  },
  {
    id: 11, topic: "Madhwa Navami Puja Vidhana",
    content: `Madhwa Navami (Phalguna Shukla Navami) — Birthday of Sri Madhvacharya — falls on 15 February 2027 in Parabhava Samvatsara. This is the most important day for all Madhwas. Puja Vidhana: 1) Read Madhvacharya's biography and Sarva Mula Granthas. 2) Recite Vayustuti (composed by Trivikrama Pandita): praises Madhvacharya as the third avatar of Vayu. 3) Recite Dvadasha Stotras. 4) Chant Madhwa Mangalashtaka. 5) Read Madhvavijaya (biography by Narayana Pandita). 6) Discuss Dvaita philosophy. 7) Offer special naivedya. Udupi celebrates with grand puja, processions, and scholarly discourses.`
  },
  // ── STOTRAS ──────────────────────────────────────────────────
  {
    id: 12, topic: "Dvadasha Stotra Twelve Stotras by Madhvacharya",
    content: `Dvadasha Stotra (Twelve Stotras) were composed by Madhvacharya and are recited during Naivedya (food offering) in all Madhwa temples and homes. First verse: "Vande vandyam sadanandam Vasudevam niranjanam, Indiradpatimadyadi varadesavarapradam" — meaning "I reverentially salute Vasudeva, adorable, of impeccable bliss, immaculate, Lord of Lakshmi and bestower of boons." There are 12 stotras total, each with deep philosophical meaning. The stotras were composed during the installation of the Krishna idol at Udupi. Recited at time of Naivedya: it is believed that if food is offered while chanting these, Vishnu is pleased and grants liberation. Eight commentaries exist on Dvadasha Stotra. Reciting them earns merit equivalent to 1000 Vishnu Sahasranamas.`
  },
  {
    id: 13, topic: "Vishnu Sahasranama in Madhwa tradition",
    content: `Vishnu Sahasranama (1000 names of Vishnu) from the Anushasana Parva of Mahabharata (Chapter 134) is central to Madhwa practice. Madhvacharya wrote a unique Bhashya interpreting each name through Dvaita philosophy — often giving up to 100 meanings per name, all affirming Vishnu's supreme independence. Daily parayana during morning/evening puja is the ideal. Method: begin with Dhyana shloka "Yasya Smarana Matrena..."; recite all 108 verses; end with Uttara Phalashruti "Anyadapi cha ye dhimanta..." Recitation of Sahasranama on Ekadashi, Pournima, and special festivals brings extraordinary merit. The opening Phala shloka: "Shri Rama Rama Rameti Rame Rame Manorame, Sahasranama Tattulyam Rama Nama Varanane" — chanting Rama's name thrice equals reciting the full Sahasranama.`
  },
  {
    id: 14, topic: "Vayustuti Stotra",
    content: `Vayustuti was composed by Trivikrama Pandita (a great scholar who debated Madhvacharya for 15 days and was converted to Dvaita). It praises Vayu as the supreme Jiva who appeared as: Hanuman in Treta Yuga, Bhima in Dvapara Yuga, and Madhvacharya in Kali Yuga. The Vayustuti is considered the most important stotra after Dvadasha Stotras. It begins with "Hari Sarvottama Vayu Jeevottama" (Hari is the Supreme, Vayu is the greatest of Jivas). Regular recitation of Vayustuti is prescribed for all Madhwa devotees. The stotra elaborates how Vayu, empowered by Vishnu's grace, serves as the bridge between the souls and God.`
  },
  {
    id: 15, topic: "Nakha Stuti Narasimha Kavacham",
    content: `Nakha Stuti (Narasimha Nakha Stuti) was composed by Madhvacharya. It praises Lord Narasimha's nails (nakha) that tore apart the demon Hiranyakashipu. Opening verse praises the nails as "Panka jaksho raksha raksha..." — the nails that destroyed evil, protect the devotee. It is recited on Narasimha Jayanti and during times of fear and danger. Narasimha Kavacham: protective prayer shield for devotees, beginning "Narasimha maha veero, dhanamadyam namamy aham..." The Narasimha Ashtottara (108 names) is chanted on Chaturdashi and Jayanti.`
  },
  {
    id: 16, topic: "Raghavendra Stotra by Appannacharya",
    content: `The celebrated stotra on Sri Raghavendra Swami composed by his disciple Appannacharya: "Poojyaya Raghavendraya Satya Dharma Ratayacha, Bhajataam Kalpavrikshaaya Namathaam Kamadhenave" — meaning "I bow to the worshipful Raghavendra, devoted to truth and righteousness, who is like a Kalpavriksha (wish-fulfilling tree) to devotees and Kamadhenu (wish-fulfilling cow) to those who bow." The stotra has 7 verses elaborating Raghavendra Swami's glory, miracles (reviving the dead, multiplying food), scholarly achievements (60+ works), and his role as Prahlada's avatar. Recited daily by all Uttaradi Math devotees.`
  },
  // ── UTTARADI MATH PANCHANG ────────────────────────────────────
  {
    id: 17, topic: "Uttaradi Math Panchang Overview",
    content: `The Sri Uttaradi Math (Jagadguru Madhwacharya Moola Maha Samstanam) is the principal math of the Madhwa Sampradaya, headquartered in Bangalore. Its Panchanga is the authoritative almanac for all Madhwa Sampradaya festivals, fasting days, and anushtanas (observances). Published annually in Sanskrit, Kannada, Telugu, Tamil, and Marathi. Available online at uttaradimath.org and vmmp.org. The current year (2026-2027) is Sri Parabhava Nama Samvatsara, which began on March 19, 2026 (Chandramana Ugadi). Key special days in the Panchanga: Guru Pushya Yoga — June 18, 2026 and March 18, 2027; Pushyarka Yoga — November 26, 2026. These are highly auspicious days for new ventures and spiritual initiation.`
  },
  {
    id: 18, topic: "Parabhava Samvatsara 2026-2027 Major Festivals",
    content: `Sri Parabhava Nama Samvatsara (March 19, 2026 – March 2027) festivals as per Uttaradi Math / SRS Matha Panchanga: Chandramana Ugadi – 19 Mar 2026; Chaitra Gaurivrata – 21 Mar 2026; Sri Rama Navami – 27 Mar 2026; Chitra Pournima / Hampi Chariot Festival – 02 Apr 2026; Akshaya Tadige – 20 Apr 2026; Narasimha Jayanti – 30 Apr 2026; Deepastambha Gaurivrata – 12 Aug 2026; Naga Chaturthi – 16 Aug 2026; Naga Panchami – 17 Aug 2026; Rigveda Upakarma – 26 Aug 2026; Varamahalakshmi Vrata / Yajurveda Upakarma – 28 Aug 2026; Sri Raghavendra Guru Aradhana – 29, 30, 31 Aug 2026; Sri Krishna Janmashtami – 04 Sep 2026; Swarna Gaurivrata / Ganesha Chaturthi – 14 Sep 2026; Rishi Panchami – 15 Sep 2026; Ananta Chaturdashi – 25 Sep 2026; Sharad Navaratri begins – 11 Oct 2026; Saraswati Avahane – 16 Oct 2026; Saraswati Puja – 18 Oct 2026; Durgashtami – 19 Oct 2026; Maha Navami / Vijayadashami – 20 Oct 2026; Madhwa Jayanti – 21 Oct 2026; Narakachaturdashi / Dhana Lakshmi Puja – 08 Nov 2026; Diwali Amavasya – 09 Nov 2026; Bali Padyami – 10 Nov 2026; Utthana Dwadashi / Tulsi Vivaha – 21 Nov 2026; Hanumadvrata – 22 Dec 2026; Makara Sankrama – 15 Jan 2027; Ratha Saptami – 13 Feb 2027; Bhishma Ashtami – 14 Feb 2027; Madhwa Navami – 15 Feb 2027; Mahashivaratri – 20 Feb 2027; Bharata Pournima / Bellary Ratha – 06 Mar 2027; Kama Dahana – 21 Mar 2027; Holi Pournima – 22 Mar 2027.`
  },
  {
    id: 19, topic: "Ekadashi Dates Parabhava Samvatsara 2026-2027",
    content: `Ekadashi fasting days (Uttaradi Math Panchanga) in Parabhava Samvatsara: Chaitra Shukla Ekadashi (Kamada) – Apr 2026; Chaitra Krishna Ekadashi (Varuthini) – Apr 2026; Vaishakha Shukla (Mohini) – May 2026; Vaishakha Krishna (Apara) – May 2026; Jyeshtha Shukla (Nirjala) – Jun 2026 [most rigorous — no water]; Jyeshtha Krishna (Yogini) – Jun 2026; Ashadha Shukla (Shayani/Devashayani) – Jul 2026 [begins Chaturmasya]; Ashadha Krishna (Kamika) – Jul 2026; Shravana Shukla (Putrada) – Aug 2026; Shravana Krishna (Aja) – Aug 2026; Bhadrapada Shukla (Parivartini) – Sep 2026; Bhadrapada Krishna (Indira) – Sep 2026; Ashvija Shukla (Papankusha) – Oct 2026; Ashvija Krishna (Rama) – Oct 2026; Kartika Shukla (Utthana/Prabodhini) – Nov 2026 [ends Chaturmasya]; Margashira Shukla (Mokshadika/Vaikunta) – Nov/Dec 2026 [most auspicious]; Pushya Shukla (Putrada) – Jan 2027; Magha Shukla (Jaya) – Feb 2027; Phalguna Shukla (Amalaki) – Feb/Mar 2027. Devotees are advised to consult local Uttaradi Math temple or uttaradimath.org for exact dates in their region.`
  },
  {
    id: 20, topic: "Chaturmasya Vrata Madhwa",
    content: `Chaturmasya (four sacred months) begins on Ashadha Shukla Ekadashi (Shayani Ekadashi) and ends on Kartika Shukla Ekadashi (Utthana Ekadashi). In 2026: approximately July-November. During Chaturmasya, the Lord (Vishnu) is said to be in yogic sleep (Yoga Nidra), and special austerities apply: month 1 (Shravana): abstain from leafy greens; month 2 (Bhadrapada): abstain from curds/yogurt; month 3 (Ashvija): abstain from milk; month 4 (Kartika): abstain from urad dal and two-grain meals. All Madhwa mathadhipatis (pontiffs) remain in one place during Chaturmasya and conduct intensive religious programs (Chaturmasya Vrata). Devotees take Sankalpa to observe specific austerities.`
  },
  // ── SRIMAD BHAGAVATAM ─────────────────────────────────────────
  {
    id: 21, topic: "Srimad Bhagavatam Overview Madhwa Perspective",
    content: `Srimad Bhagavata Purana (Bhagavatam) is one of the Maha Puranas and is considered the crown jewel of Vedic literature. It consists of 12 Skandhas (cantos), 335 chapters, and 18,000 verses. Madhvacharya wrote the Bhagavata Tatparya Nirnaya, a commentary revealing the inner purport of the Bhagavatam through the Dvaita lens. In Madhwa tradition, the Bhagavatam is considered the ripened fruit of the Vedic tree (Nigama Kalpataroh Galitam Phalam). The Bhagavatam was narrated by Suka Muni to King Parikshit during his final 7 days on earth. The central teaching is pure, unmotivated devotion (Ananya Bhakti) to Lord Vishnu/Krishna as the supreme means of liberation. Sa vai pumsam paro dharmo yato bhaktir adhokshaje — "The highest dharma for mankind is that which creates devotion to the transcendent Lord."`
  },
  {
    id: 22, topic: "Bhagavatam Skandhas and Key Stories",
    content: `The 12 Skandhas (cantos) of Srimad Bhagavatam: Skandha 1: Parikshit, Suta-Saunaka dialogue; Bhishma's passing. Skandha 2: Vishnu's cosmic form, meditation on Lord. Skandha 3: Creation; Kapila Muni teaches Sankhya to Devahuti. Skandha 4: Stories of Dhruva (the pole star devotee), Prithu, Daksha yaga. Skandha 5: Cosmology; Rishabhadeva; Jada Bharata. Skandha 6: Ajamila — liberation by calling God's name at death; Vritra story. Skandha 7: Prahlada — supreme devotee; Narasimha avatara. Skandha 8: Gajendra Moksha — elephant's prayer to Vishnu; Vamana avatara; Samudra Manthan. Skandha 9: Rama's story, solar and lunar dynasties. Skandha 10: The longest — life of Sri Krishna (Mathura, Vrindavana, Gokula, Kurukshetra). Skandha 11: Uddhava Gita — Krishna's final teachings. Skandha 12: Kali Yuga description; Bhagavatam Mahatmya.`
  },
  {
    id: 23, topic: "Bhagavatam Skandha 10 Krishna Stories",
    content: `Bhagavatam Skandha 10 (Dasha Skandha) is the most beloved, describing Sri Krishna's divine leelas: Birth in Mathura prison to Devaki and Vasudeva (Janmashtami); Transfer to Gokula — crossing the Yamuna; Childhood miracles — killing Putana, Trinavarta; Damodara lila — Yashoda binding Krishna; Kaliya Mardana — subduing the serpent Kaliya; Govardhana Puja — lifting Govardhana hill to protect Gokula from Indra's floods; Rasa Lila — divine dance with the Gopis; Killing of Kamsa in Mathura; Parijata theft; Rukmini's marriage; Syamantaka episode; Battle with Banasura; Kurukshetra war as charioteer of Arjuna; Uddhava's final visit. In Madhwa interpretation, the Gopis' love for Krishna represents the highest Ananya Bhakti — pure, unmotivated devotion.`
  },
  {
    id: 24, topic: "Bhagavatam Prahlada Gajendra Stories",
    content: `Prahlada Charitra (Skandha 7) is a central story in Madhwa teaching: Prahlada, son of the demon Hiranyakashipu, was a supreme devotee of Vishnu from birth. Despite his father's torture (thrown into fire, poisoned, trampled by elephants — all protected by Vishnu), Prahlada's devotion never wavered. He taught: Shravanam (hearing God's glories), Kirtanam (singing praises), Smaranam (remembering God), Pada Sevanam (serving God's feet), Archanam (worshipping), Vandanam (bowing), Dasyam (servitude), Sakhyam (friendship), Atma Nivedanam (self-surrender) — the Nava Vidha Bhakti. Gajendra Moksha (Skandha 8): Gajendra (elephant) was caught by a crocodile. After exhausting his own strength, he surrendered completely to Vishnu: "Narayana Hare!" Vishnu instantly appeared riding Garuda and liberated him. This teaches: complete surrender (Prapatti/Sharanagati) is the supreme means.`
  },
  {
    id: 25, topic: "Bhagavatam Ajamila Narada Bhakti Stories",
    content: `Ajamila Upakhyana (Skandha 6): Ajamila was a fallen Brahmin who lived sinfully all his life. Yet at the moment of death, he called out to his son "Narayana!" Vishnu's messengers (Vishnu Dutas) came and rescued him from Yama's messengers, because even unconsciously calling the Lord's name grants liberation. Teaching: the name of Vishnu (Hari Nama) is so powerful that even inadvertent utterance grants moksha. Narada Bhakti Sutra connection: Narada, the divine sage, is a supreme devotee and Guru in the Madhwa Guru Parampara (Vishnu → Brahma → Narada → Vedavyasa → Madhvacharya). Narada's teaching: "Bhakti paramananda rupa, amritasvarupa cha" — Bhakti is of the nature of supreme bliss and immortality.`
  },
  {
    id: 26, topic: "Bhagavatam Uddhava Gita Final Teachings",
    content: `Uddhava Gita (Skandha 11) is Krishna's final teachings to his dear friend and cousin Uddhava before the Lord's departure from earth. Often called the "Hamsa Gita" (Swan Song). Topics covered: Sankhya (knowledge of soul and matter), Yoga, Bhakti, Vedantic knowledge, qualities of a Sadhu (saint), and the 24 Gurus (Avadhuta's teaching from nature). Krishna describes the attributes of His devotees: "Mayi ananya bhaktih — undivided devotion to Me." The Bhagavata Dharma is: hear, sing, and remember Vishnu always. The final teaching: "Give up all dharmas and surrender to Me alone (Sarva dharman parityajya mam ekam saranam vraja)." In Madhwa interpretation, this does not negate other duties but means: perform all duties as worship of Vishnu.`
  },
  // ── SAINTS & MATHAS ───────────────────────────────────────────
  {
    id: 27, topic: "Haridasa Movement Purandaradasa Kanakadasa",
    content: `The Haridasa movement (14th–18th c.) democratized Madhwa philosophy through Kannada devotional songs (Devaranamas). Key Haridasas: Sripadaraja (earliest systematizer), Vyasatirtha/Vyasaraja (greatest scholar-Haridasa, Guru of Purandaradasa and Kanakadasa), Purandaradasa (called Karnataka Sangeeta Pitamaha — grandfather of Carnatic music; systematized 72 Melakarta ragas; composed thousands of Devaranamas, Suladi, Ugabhoga, Kriti forms), Kanakadasa (Kanakana Kindi legend — western wall of Udupi temple broke open for his darshan), Vadiraja Tirtha (great pontiff and poet), Jagannatha Dasa (composed Harikathamrita Sara). Their songs contain deep Dvaita philosophy in simple Kannada, accessible to all.`
  },
  {
    id: 28, topic: "Raghavendra Swami Mantralayam",
    content: `Sri Raghavendra Swami (1595–1671 CE), avatar of Prahlada and Baahlika, was the greatest pontiff of the Uttaradi Math. Known as Kalpavruksha (wish-fulfilling tree). His Brindavana (Jeeva Samadhi — live samadhi) is at Mantralayam on the Tungabhadra River, Andhra Pradesh. He wrote 60+ works including Parimala (sub-commentary on Brahma Sutras). Miracles: revived a dead boy, multiplied food during famine, purified the atmosphere. Stotra: "Poojyaya Raghavendraya Satya Dharma Ratayacha." Annual Aradhana: Shravana Bahula Triteeya (29-31 Aug 2026 in Parabhava Samvatsara) — 3-day grand festival. The Uttaradi Math manages Mantralayam. Devotees receive Navagraha Shanti, solutions to problems.`
  },
  {
    id: 29, topic: "Udupi Krishna Matha Ashta Mathas Paryaya",
    content: `Udupi Sri Krishna Matha was established by Madhvacharya. The Paryaya system — rotation of governance among 8 Mathas every 2 years — is unique to Udupi. The Ashta Mathas: Palimaru, Adamar, Krishnapura, Puttige, Shirur, Sodhe, Kaniyoor, and Pejawar Mathas. The Kanakana Kindi (Kanakadasa window) on the western wall broke miraculously to give darshan to Kanakadasa. The Ashta Mathas also manage charitable services, education, and cultural programs. The Udupi Paryaya handover ceremony is a grand event attended by lakhs of devotees. During Paryaya, Ekadashi and Janmashtami celebrations at Udupi are exceptionally grand.`
  },
  {
    id: 30, topic: "Bhagavatam Parayana Mahatmya",
    content: `Bhagavatam Parayana (recitation) Mahatmya: The Bhagavatam itself (Skandha 12) declares its own glory. A Saptaha (7-day) parayana of the entire Bhagavatam is the highest spiritual act, recreating the original narration of Suka Muni to Parikshit. Benefits: purification of the mind, freedom from sins, attainment of Bhakti and Moksha. In Madhwa tradition, Bhagavatam parayana is performed during: Chaturmasya, Ekadashi, Amavasya (for ancestors), and Aradhana days. The Bhagavatam Mahatmya verses: "Srimad Bhagavatam Purana Mamalam, Yad Vaishnavaanam Priyam" — the spotless Bhagavatam is dear to all Vaishnavas. Daily reading of even one shloka with understanding and devotion earns immense merit. The Uttaradi Math publishes Bhagavatam Tatparya Nirnaya of Madhvacharya for study.`
  }
];

// ══════════════════════════════════════════════════════════════
//  FESTIVAL CALENDAR  (Parabhava Samvatsara 2026-2027)
// ══════════════════════════════════════════════════════════════
const FESTIVALS = [
  { date: "19 Mar 2026", name: "Chandramana Ugadi", desc: "Telugu/Kannada New Year — Parabhava Samvatsara begins", type: "major" },
  { date: "21 Mar 2026", name: "Chaitra Gaurivrata", desc: "Gowri Vrata begins", type: "vrata" },
  { date: "27 Mar 2026", name: "Sri Rama Navami", desc: "Birth of Lord Rama. Fast until midday.", type: "major" },
  { date: "02 Apr 2026", name: "Chitra Pournima", desc: "Hampi Chariot Festival. Full moon of Chaitra.", type: "pournima" },
  { date: "20 Apr 2026", name: "Akshaya Tadige", desc: "Akshaya Tritiya — all acts done are inexhaustible.", type: "auspicious" },
  { date: "30 Apr 2026", name: "Narasimha Jayanti", desc: "Appearance of Lord Narasimha. Full fast, Nakha Stuti.", type: "major" },
  { date: "18 Jun 2026", name: "Guru Pushya Yoga", desc: "Highly auspicious for initiation and new ventures.", type: "auspicious" },
  { date: "12 Aug 2026", name: "Deepastambha Gaurivrata", desc: "Gowri Vrata — light a lamp for the Goddess.", type: "vrata" },
  { date: "16 Aug 2026", name: "Naga Chaturthi", desc: "Worship of the Naga devatas.", type: "festival" },
  { date: "17 Aug 2026", name: "Naga Panchami", desc: "Naga Puja — milk offering to snake gods.", type: "festival" },
  { date: "26 Aug 2026", name: "Rigveda Upakarma", desc: "Annual Vedic thread renewal ceremony for Rigvedis.", type: "anushtana" },
  { date: "28 Aug 2026", name: "Varamahalakshmi Vrata / Yajurveda Upakarma", desc: "Varamahalakshmi — worship of Goddess Lakshmi for boons.", type: "major" },
  { date: "29-31 Aug 2026", name: "Sri Raghavendra Aradhana", desc: "Grand 3-day Aradhana at Mantralayam. Shravana Bahula Triteeya.", type: "aradhana" },
  { date: "04 Sep 2026", name: "Sri Krishna Janmashtami", desc: "Birth of Lord Krishna. Midnight Abhisheka. Fast the full day.", type: "major" },
  { date: "14 Sep 2026", name: "Swarna Gaurivrata / Ganesha Chaturthi", desc: "Ganesha installation; Swarna Gowri Vrata for married women.", type: "major" },
  { date: "15 Sep 2026", name: "Rishi Panchami", desc: "Reverence to the seven Rishis; cleansing observance.", type: "festival" },
  { date: "25 Sep 2026", name: "Ananta Chaturdashi", desc: "Ananta (Shesha/Vishnu) Vrata — tying Ananta thread.", type: "vrata" },
  { date: "11 Oct 2026", name: "Sharad Navaratri Begins", desc: "Nine nights of the Goddess. Saraswati Puja included.", type: "major" },
  { date: "16 Oct 2026", name: "Saraswati Avahane", desc: "Installation of books and tools for Saraswati Puja.", type: "festival" },
  { date: "18 Oct 2026", name: "Saraswati Puja", desc: "Worship of Goddess Saraswati. Books and instruments blessed.", type: "major" },
  { date: "20 Oct 2026", name: "Maha Navami / Vijayadashami", desc: "Dasara — Vijaya Dashami. Most auspicious day for new beginnings.", type: "major" },
  { date: "21 Oct 2026", name: "Madhwa Jayanti", desc: "Celebration of Madhvacharya's philosophy. Vijaya Dashami+1.", type: "aradhana" },
  { date: "08 Nov 2026", name: "Narakachaturdashi / Dhana Lakshmi Puja", desc: "Pre-Diwali Lakshmi Puja. Oil bath before sunrise.", type: "major" },
  { date: "09 Nov 2026", name: "Diwali Amavasya", desc: "Lakshmi Puja on the new moon. Festival of lights.", type: "major" },
  { date: "10 Nov 2026", name: "Bali Padyami", desc: "King Bali's ascent. New year for some traditions.", type: "festival" },
  { date: "21 Nov 2026", name: "Utthana Dwadashi / Tulsi Vivaha", desc: "Vishnu awakens from Yoga Nidra. Marriage of Tulsi and Krishna.", type: "major" },
  { date: "26 Nov 2026", name: "Pushyarka Yoga", desc: "Pushya Nakshatra on Sunday — extremely auspicious.", type: "auspicious" },
  { date: "22 Dec 2026", name: "Hanumadvrata", desc: "Hanuma Jayanti in some regional calendars. Vayu Deva worship.", type: "festival" },
  { date: "15 Jan 2027", name: "Makara Sankrama", desc: "Sun enters Capricorn. Sacred dip, Sesame (til) offerings.", type: "major" },
  { date: "13 Feb 2027", name: "Ratha Saptami", desc: "Sun god's chariot turns. Most auspicious for health and sun worship.", type: "major" },
  { date: "14 Feb 2027", name: "Bhishma Ashtami", desc: "Bhishma Pitamaha's departure day. Tarpana for ancestors.", type: "festival" },
  { date: "15 Feb 2027", name: "Madhwa Navami", desc: "Birthday of Sri Madhvacharya! Most sacred for all Madhwas.", type: "aradhana" },
  { date: "18 Mar 2027", name: "Guru Pushya Yoga", desc: "Second Guru Pushya Yoga of the year.", type: "auspicious" },
  { date: "20 Feb 2027", name: "Mahashivaratri", desc: "Great night of Shiva. All-night vigil and fast.", type: "major" },
  { date: "06 Mar 2027", name: "Bharata Pournima / Bellary Ratha", desc: "Phalguna Pournima, Bellary chariot festival.", type: "pournima" },
  { date: "22 Mar 2027", name: "Holi Pournima", desc: "Holika Dahan and festival of colors.", type: "festival" },
];

// ══════════════════════════════════════════════════════════════
//  RAG: keyword-based retrieval
// ══════════════════════════════════════════════════════════════
function retrieveContext(query) {
  const q = query.toLowerCase();
  const scored = KNOWLEDGE_BASE.map(doc => {
    const words = q.split(/\s+/);
    const content = (doc.content + " " + doc.topic).toLowerCase();
    let score = 0;
    words.forEach(w => { if (w.length > 3 && content.includes(w)) score++; });
    if (q.includes(doc.topic.toLowerCase())) score += 5;
    return { ...doc, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter(d => d.score > 0).slice(0, 3);
  return top.length ? top : scored.slice(0, 2);
}

// ══════════════════════════════════════════════════════════════
//  TABS CONFIG
// ══════════════════════════════════════════════════════════════
const TABS = [
  { id: "chat",      label: "🪷 Dharma Chat",    icon: "🪷" },
  { id: "festival",  label: "📅 Festivals",       icon: "📅" },
  { id: "puja",      label: "🔔 Puja Vidhana",    icon: "🔔" },
  { id: "bhagavata", label: "📖 Bhagavatam",      icon: "📖" },
];

const SUGGESTIONS = [
  "What is Dvaita Vedanta?",
  "How to do Ekadashi fasting?",
  "Tell me about Dvadasha Stotra",
  "Who is Sri Raghavendra Swami?",
  "Explain Pancha Bheda",
  "What happened during Gajendra Moksha?",
  "What is the Parabhava Samvatsara?",
  "Tell me about Chaturmasya Vrata",
];

// ══════════════════════════════════════════════════════════════
//  PUJA VIDHANA CONTENT
// ══════════════════════════════════════════════════════════════
const PUJA_ITEMS = [
  {
    title: "Nithya Puja (Daily Worship)",
    icon: "🪔",
    steps: [
      "Achamana — sip water thrice: Keshava, Narayana, Madhava",
      "Sankalpa — resolve the puja with date, time, place",
      "Kalasha Puja — consecrate the water vessel",
      "Abhisheka — bathe the idol with Pancha Amrita (milk, curd, ghee, honey, sugar) chanting Purusha Sukta",
      "Gandha — apply sandal paste to the idol",
      "Pushpa — offer flowers; Tulsi is supreme for each of Vishnu's names",
      "Dhupa — light incense",
      "Deepa — light ghee lamp, wave clockwise",
      "Naivedya — offer cooked food. Chant Dvadasha Stotra during offering",
      "Mangalarati — wave camphor flame while chanting Mangala shloka",
      "Pradakshina — circumambulate the deity",
      "Sashtanga Namaskara — full prostration",
      "Vishnu Sahasranama Parayana",
      "Mantrapushpa & Samarpana — conclude: 'Krishnarpanamasthu'",
    ],
    note: "Apply Urdhvapundra (12 vertical sandal paste marks) on your body before beginning puja."
  },
  {
    title: "Ekadashi Fasting Procedure",
    icon: "🌙",
    steps: [
      "Dashami (10th): Eat before sunset. Avoid leafy greens, rice, urad dal",
      "Ekadashi Day: Complete fast from all grains (no rice, wheat, dal, barley)",
      "Permitted: fruits, milk, rock salt, sabudana, dry fruits",
      "Spend the day/night chanting Vishnu Sahasranama and Haridasa songs",
      "Dvadashi (12th): Break fast (Parana) within the Dvadashi window — do not cross the tithi",
      "Parana Mantra: 'Ajnana timirandhasya jnananjana shalakaya, Chakshur unmilitam yena tasmai Sri Gurave namah'",
    ],
    note: "Vaikunta Ekadashi (Margashira Shukla) is the most auspicious. Shayani Ekadashi begins Chaturmasya; Utthana Ekadashi ends it."
  },
  {
    title: "Krishna Janmashtami Puja",
    icon: "🦚",
    steps: [
      "Fast the entire day (Ashtami day — 04 Sep 2026)",
      "Decorate Krishna's idol/picture with flowers and new clothes",
      "At midnight: Abhisheka with Panchamrita — milk, curd, ghee, honey, sugar",
      "Offer butter (makhan) and poha (flattened rice) — Krishna's favorites",
      "Chant Krishnashtaka by Madhvacharya",
      "Recite Dvadasha Naama: Kesava, Narayana, Madhava, Govinda, Vishnu, Madhusudana, Trivikrama, Vamana, Sridhara, Hrishikesha, Padmanabha, Damodara",
      "Sing Haridasa Devaranamas on Krishna by Purandaradasa and Kanakadasa",
      "Mangalarati at midnight after birth",
      "Break fast on Navami morning after sunrise",
    ],
    note: "In Parabhava Samvatsara: Janmashtami falls on 04 September 2026."
  },
  {
    title: "Narasimha Jayanti Puja",
    icon: "🔱",
    steps: [
      "Fast the entire day (30 Apr 2026 in Parabhava Samvatsara)",
      "Abhisheka of Narasimha idol with Panchamrita",
      "Offer red flowers (hibiscus/kempu pushpa) — Lord Narasimha's favorite",
      "Chant Narasimha Kavacham for protection",
      "Recite Nakha Stuti by Madhvacharya — praises Narasimha's nails",
      "Ugra Narasimha Mantra: 'Om Ugram Veeram Mahavishnum Jvalantam Sarvatomukham, Nrisimham Bheeshanam Bhadram Mrityur Mrityum Namamy Aham'",
      "Mangalarati at dusk (appearance time of Lord Narasimha)",
      "Break fast on Panchami",
    ],
    note: "Lord Narasimha is especially worshipped for protection and removal of fear. Prahlada's story is read on this day."
  },
  {
    title: "Raghavendra Aradhana Puja",
    icon: "🌺",
    steps: [
      "Aradhana: 29-31 August 2026 (Shravana Bahula Triteeya)",
      "Decorate Raghavendra Swami's Brindavana / picture with flowers",
      "Abhisheka of Padukas (sacred sandals) with Panchamrita",
      "Recite Rayara Stotra by Appannacharya: 'Poojyaya Raghavendraya Satya Dharma Ratayacha, Bhajataam Kalpavrikshaaya Namathaam Kamadhenave'",
      "Read Sri Raghavendra Vijaya (biography chapters)",
      "Recite Mantralaya Sri Prabha",
      "Distribute Panchamrita and Prasada",
      "Fasting on this day is highly meritorious",
    ],
    note: "Those who cannot visit Mantralayam can observe Aradhana at the nearest Uttaradi Math branch or at home."
  },
];

// ══════════════════════════════════════════════════════════════
//  BHAGAVATAM CONTENT
// ══════════════════════════════════════════════════════════════
const BHAGAVATA_SKANDHAS = [
  { num: 1,  title: "Pravritti — Creation of Devotion",     key: "Parikshit's curse, Suta-Saunaka dialogue, Bhishma's passing on the arrow-bed, Dharma in Kali Yuga" },
  { num: 2,  title: "Cosmic Vision of the Lord",            key: "Vishnu's universal form (Virata Purusha), meditation on the Lord's form, the Bhagavata Dharma" },
  { num: 3,  title: "Creation & Kapila's Sankhya",          key: "Maitreya-Vidura dialogue, creation by Brahma, Kapila Muni teaches Sankhya to mother Devahuti" },
  { num: 4,  title: "Dhruva, Prithu & Daksha Yajna",        key: "Dhruva's penance and elevation to pole star, King Prithu, Daksha yajna disaster, Shiva's sorrow" },
  { num: 5,  title: "Cosmic Geography & Jada Bharata",      key: "Rishabhadeva (Jain connection), Jada Bharata's wisdom, description of the universe and Patala lokas" },
  { num: 6,  title: "Ajamila & Vritra",                     key: "Ajamila liberated by calling 'Narayana' at death, Vishnu vs Vritra, Nava Vidha Bhakti from Prahlada" },
  { num: 7,  title: "Prahlada & Narasimha Avatara",         key: "Prahlada — supreme devotee despite demonic father. Lord Narasimha appears and destroys Hiranyakashipu. Nine types of Bhakti." },
  { num: 8,  title: "Gajendra Moksha & Vamana Avatara",     key: "Gajendra the elephant surrenders to Vishnu and is liberated. Samudra Manthan. Vamana defeats Bali." },
  { num: 9,  title: "Solar & Lunar Dynasties",              key: "Story of Sri Rama (brief). Ancestors of Krishna. King Ambarisha. Solar and lunar lineages." },
  { num: 10, title: "Life of Sri Krishna (Dasha Skandha)",   key: "Birth, Gokula, Govardhana, Rasa Lila, killing Kamsa, Rukmini marriage, Syamantaka, Kurukshetra. The longest and most beloved Skandha." },
  { num: 11, title: "Uddhava Gita — Krishna's Final Words", key: "Krishna's teachings to Uddhava before departure. 24 Gurus of the Avadhuta. Nature of Bhakti. Hamsa Gita." },
  { num: 12, title: "Kali Yuga & Bhagavata Mahatmya",       key: "Signs of Kali Yuga. Importance of Hari Nama in Kali Yuga. Glory of Srimad Bhagavatam — the ripened fruit of the Vedic tree." },
];

const KEY_BHAGAVATA_SHLOKAS = [
  {
    text: "Sa vai puṃsāṃ paro dharmo yato bhaktir adhokṣaje",
    meaning: "The highest dharma for all of humanity is that which leads to devotion to the transcendent Lord Vishnu. (Skandha 1.2.6)"
  },
  {
    text: "Naimiṣe 'nimisha-kṣetre ṛṣayaḥ śaunakādayaḥ",
    meaning: "In the sacred forest of Naimisha, the great sages headed by Saunaka gathered... (Skandha 1.1.1 — opening verse)"
  },
  {
    text: "Nigama-kalpa-taror galitaṃ phalaṃ śuka-mukhād amṛta-drava-saṃyutam",
    meaning: "O King, the Bhagavatam is the ripe fruit of the Vedic tree, flowing with nectar from the lips of Suka Muni. (Skandha 1.1.3)"
  },
  {
    text: "Śṛṇvatāṃ sva-kathāḥ kṛṣṇaḥ puṇya-śravaṇa-kīrtanaḥ",
    meaning: "Sri Krishna, who purifies one by hearing and chanting His glories, removes the heart's dirt for those who listen to His stories. (Skandha 1.2.17)"
  },
  {
    text: "Nāmāny anantasya yaśo 'ṅkitāni yat śṛṇvanti gāyanti gṛṇanti sādhavaḥ",
    meaning: "The holy names of the unlimited Lord are heard, sung, and uttered by saints — this alone purifies all the worlds. (Skandha 1.5.11)"
  },
];

// ══════════════════════════════════════════════════════════════
//  COLORS
// ══════════════════════════════════════════════════════════════
const C = {
  bg: "#110800",
  surface: "rgba(255,255,255,0.035)",
  border: "rgba(200,134,10,0.22)",
  gold: "#c8860a",
  brightGold: "#f5c842",
  text: "#e8d5b0",
  muted: "#9a6a20",
  faint: "#5a3a10",
};

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function MadhwaChatbot() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "🙏 Hari Sarvottama! Vayu Jeevottama!\n\nI am Madhwa Dharma Mitra — your guide to the Madhwa Sampradaya. Ask me about:\n• Dvaita Vedanta philosophy\n• Puja Vidhana & Stotras\n• Parabhava Samvatsara festivals (UM Panchang)\n• Srimad Bhagavatam stories\n• Haridasas, Saints & Mathas\n\nHow may I serve you today?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSug, setShowSug] = useState(true);
  const [expandedPuja, setExpandedPuja] = useState(null);
  const [expandedSkandha, setExpandedSkandha] = useState(null);
  const [festFilter, setFestFilter] = useState("all");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = (text || input).trim();
    if (!userMsg) return;
    setShowSug(false);
    setMessages(p => [...p, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    const context = retrieveContext(userMsg);
    const contextText = context.map(c => `[Topic: ${c.topic}]\n${c.content}`).join("\n\n---\n\n");

    // Also inject festival data if relevant
    const festKeywords = ["festival", "when is", "date", "samvatsara", "parabhava", "2026", "2027", "panchang", "aradhana", "jayanti", "navami"];
    const useFestData = festKeywords.some(k => userMsg.toLowerCase().includes(k));
    const festContext = useFestData
      ? "\n\nFESTIVAL DATES (Parabhava Samvatsara, UM Panchanga):\n" + FESTIVALS.map(f => `${f.date}: ${f.name} — ${f.desc}`).join("\n")
      : "";

    const systemPrompt = `You are a knowledgeable and devoted guide to the Madhwa Sampradaya (Dvaita Vedanta founded by Sri Madhvacharya). Answer with warmth, reverence, and clarity. Begin greetings with "Hari Sarvottama! Vayu Jeevottama!" when appropriate. Use Sanskrit terms with brief explanations. Keep answers focused. Use the retrieved knowledge below as primary source.

===RETRIEVED KNOWLEDGE===
${contextText}${festContext}
===END===

Guidelines: Answer from retrieved knowledge. Be warm and devotional. If outside the context, answer from general Madhwa Sampradaya knowledge. Use bullet points where helpful. Always be respectful of the tradition.`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.filter((_, i) => i > 0).slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg }
          ]
        })
      });
      const data = await resp.json();
      const reply = data.content?.[0]?.text || "Apologies — please try again.";
      setMessages(p => [...p, { role: "assistant", content: reply, sources: context.map(c => c.topic) }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "🙏 A technical issue occurred. Please try again." }]);
    }
    setLoading(false);
  }

  const filteredFests = festFilter === "all" ? FESTIVALS : FESTIVALS.filter(f => f.type === festFilter);

  const typeColors = {
    major: "#f5c842", vrata: "#7ec8c8", aradhana: "#ff9955",
    auspicious: "#90ee90", pournima: "#c8a0ff", festival: "#ffa0c0", anushtana: "#aaccff"
  };

  // ── STYLES ─────────────────────────────────────────────────
  const s = {
    root: { minHeight: "100vh", background: `linear-gradient(160deg, ${C.bg} 0%, #1e0c00 60%, ${C.bg} 100%)`, fontFamily: "'Crimson Text', Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center" },
    header: { width: "100%", maxWidth: 820, padding: "22px 20px 12px", textAlign: "center" },
    tabBar: { display: "flex", gap: 4, justifyContent: "center", padding: "0 16px 0", width: "100%", maxWidth: 820, flexWrap: "wrap" },
    tab: (active) => ({ padding: "7px 14px", borderRadius: 24, border: `1px solid ${active ? C.gold : C.border}`, background: active ? `rgba(200,134,10,0.18)` : "transparent", color: active ? C.brightGold : C.muted, cursor: "pointer", fontSize: 13, fontFamily: "'Crimson Text', Georgia, serif", transition: "all 0.2s" }),
    panel: { flex: 1, width: "100%", maxWidth: 820, padding: "16px 16px 0", overflowY: "auto", maxHeight: "calc(100vh - 240px)" },
    card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 },
  };

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#110800}::-webkit-scrollbar-thumb{background:#c8860a;border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .msg-in{animation:fadeUp .35s ease forwards}
        .sug-btn:hover{background:rgba(200,134,10,0.18)!important;color:#f5c842!important;border-color:#c8860a!important}
        .tabHov:hover{background:rgba(200,134,10,0.1)!important}
        .puja-row:hover{background:rgba(200,134,10,0.06)!important;cursor:pointer}
        .fest-row:hover{background:rgba(200,134,10,0.08)!important}
        .skd-row:hover{background:rgba(200,134,10,0.06)!important;cursor:pointer}
      `}</style>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
          <span style={{ fontSize: 22, animation: "float 4s ease-in-out infinite" }}>🪷</span>
          <span style={{ color: C.brightGold, fontFamily: "'Cinzel Decorative'", fontSize: 10, letterSpacing: 4 }}>MADHWA DHARMA MITRA</span>
          <span style={{ fontSize: 22, animation: "float 4s ease-in-out 2s infinite" }}>🪷</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
        </div>
        <h1 style={{ fontFamily: "'Cinzel Decorative'", color: C.brightGold, fontSize: "clamp(16px,4vw,24px)", letterSpacing: 2, textShadow: `0 0 24px rgba(245,200,66,.35)`, marginBottom: 2 }}>Madhwa Dharma Mitra</h1>
        <p style={{ color: C.gold, fontSize: 13, fontStyle: "italic" }}>Dvaita Vedanta · UM Panchang · Bhagavatam · Puja Vidhana</p>
      </header>

      {/* ── TABS ── */}
      <div style={s.tabBar}>
        {TABS.map(t => (
          <button key={t.id} className="tabHov" style={s.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: 820, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, margin: "10px 0 0" }} />

      {/* ══ CHAT TAB ══ */}
      {activeTab === "chat" && (
        <>
          <main style={{ ...s.panel, display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((msg, i) => (
              <div key={i} className="msg-in" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.gold}, ${C.brightGold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginTop: 2, boxShadow: `0 0 10px rgba(200,134,10,.4)` }}>🪷</div>
                )}
                <div style={{ maxWidth: "78%", background: msg.role === "user" ? "linear-gradient(135deg,#7a3a0a,#5a2808)" : C.surface, border: `1px solid ${msg.role === "user" ? "rgba(200,134,10,.4)" : C.border}`, borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px", padding: "11px 15px" }}>
                  <p style={{ color: msg.role === "user" ? "#fde8c0" : C.text, fontSize: 15, lineHeight: 1.72, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                  {msg.sources?.length > 0 && (
                    <div style={{ marginTop: 8, borderTop: `1px solid rgba(200,134,10,.15)`, paddingTop: 6 }}>
                      <p style={{ color: C.faint, fontSize: 10, marginBottom: 3 }}>📚 Sources:</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {msg.sources.map(s => <span key={s} style={{ fontSize: 10, color: C.gold, border: `1px solid rgba(200,134,10,.25)`, borderRadius: 10, padding: "1px 7px" }}>{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,#4a2008,#7a3a0a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginTop: 2, border: `1px solid rgba(200,134,10,.3)` }}>🙏</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="msg-in" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.brightGold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🪷</div>
                <div style={{ ...s.card, display: "flex", gap: 5, padding: "13px 18px", marginBottom: 0 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
                </div>
              </div>
            )}
            {showSug && messages.length === 1 && (
              <div className="msg-in">
                <p style={{ color: C.muted, fontSize: 12, textAlign: "center", marginBottom: 8, fontStyle: "italic" }}>— Ask me anything —</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} className="sug-btn" onClick={() => sendMessage(s)}
                      style={{ background: "rgba(200,134,10,.06)", border: `1px solid rgba(200,134,10,.22)`, color: C.gold, borderRadius: 18, padding: "5px 13px", fontSize: 13, cursor: "pointer", fontFamily: "'Crimson Text',Georgia,serif", transition: "all .2s" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </main>
          <footer style={{ width: "100%", maxWidth: 820, padding: "12px 16px 20px" }}>
            <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,.03)", border: `1px solid rgba(200,134,10,.28)`, borderRadius: 26, padding: "5px 6px 5px 16px" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about Dvaita, festivals, puja, Bhagavatam..." disabled={loading} rows={1}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 15, fontFamily: "'Crimson Text',Georgia,serif", resize: "none", lineHeight: 1.6, padding: "6px 0", maxHeight: 100, overflowY: "auto" }} />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: input.trim() && !loading ? `linear-gradient(135deg,${C.gold},${C.brightGold})` : "rgba(200,134,10,.15)", color: input.trim() && !loading ? "#1a0a00" : C.faint, cursor: input.trim() && !loading ? "pointer" : "not-allowed", fontSize: 17, flexShrink: 0, transition: "all .2s", boxShadow: input.trim() && !loading ? `0 0 12px rgba(200,134,10,.45)` : "none" }}>
                {loading ? <div style={{ width: 16, height: 16, border: `2px solid rgba(200,134,10,.3)`, borderTopColor: C.gold, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "auto" }} /> : "→"}
              </button>
            </div>
            <p style={{ textAlign: "center", color: C.faint, fontSize: 10, marginTop: 8 }}>🪷 Hari Sarvottama · Vayu Jeevottama · Madhwa Dharma Mitra · UM Panchanga</p>
          </footer>
        </>
      )}

      {/* ══ FESTIVALS TAB ══ */}
      {activeTab === "festival" && (
        <div style={{ ...s.panel, paddingBottom: 24 }}>
          <div style={{ ...s.card, background: "rgba(200,134,10,.06)", borderColor: `rgba(200,134,10,.35)`, marginBottom: 12 }}>
            <p style={{ color: C.brightGold, fontFamily: "'Cinzel Decorative'", fontSize: 13, marginBottom: 2 }}>Sri Parabhava Nama Samvatsara</p>
            <p style={{ color: C.text, fontSize: 13 }}>19 March 2026 – March 2027 · Source: Uttaradi Math / SRS Matha Panchanga</p>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Guru Pushya Yoga: 18 Jun 2026, 18 Mar 2027 · Pushyarka Yoga: 26 Nov 2026</p>
          </div>
          {/* Filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {["all", "major", "aradhana", "vrata", "auspicious", "festival", "pournima", "anushtana"].map(f => (
              <button key={f} onClick={() => setFestFilter(f)}
                style={{ padding: "3px 10px", borderRadius: 14, border: `1px solid ${festFilter === f ? C.gold : C.border}`, background: festFilter === f ? "rgba(200,134,10,.18)" : "transparent", color: festFilter === f ? C.brightGold : C.muted, cursor: "pointer", fontSize: 11, fontFamily: "'Crimson Text',Georgia,serif" }}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {filteredFests.map((f, i) => (
            <div key={i} className="fest-row" style={{ ...s.card, display: "flex", gap: 10, alignItems: "flex-start", transition: "all .15s", marginBottom: 6 }}>
              <div style={{ minWidth: 90, fontSize: 11, color: C.gold, paddingTop: 2, fontStyle: "italic" }}>{f.date}</div>
              <div>
                <p style={{ color: typeColors[f.type] || C.text, fontSize: 14, fontWeight: 600 }}>{f.name}</p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{f.desc}</p>
              </div>
              <div style={{ marginLeft: "auto", minWidth: 60, textAlign: "right" }}>
                <span style={{ fontSize: 10, color: typeColors[f.type] || C.muted, border: `1px solid ${typeColors[f.type] || C.border}`, borderRadius: 10, padding: "1px 7px", opacity: .75 }}>{f.type}</span>
              </div>
            </div>
          ))}
          <p style={{ color: C.faint, fontSize: 11, textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
            Dates based on SRS Matha / Uttaradi Math Panchanga (India). Consult uttaradimath.org for exact dates in your region.
          </p>
        </div>
      )}

      {/* ══ PUJA VIDHANA TAB ══ */}
      {activeTab === "puja" && (
        <div style={{ ...s.panel, paddingBottom: 24 }}>
          <div style={{ ...s.card, background: "rgba(200,134,10,.05)", marginBottom: 12 }}>
            <p style={{ color: C.brightGold, fontSize: 14, fontStyle: "italic" }}>
              "Archithah samsmruthah dhyathah kirthithah kathithah shruthah yo dadaathyamruthathvam hi sa maam rakshathu keshavah"
            </p>
            <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>— Sri Madhvacharya, Krishnamruthamaharnava: "Keshava who is worshipped, remembered, meditated upon, praised, described and prayed to — may He protect me and grant immortality."</p>
          </div>

          {/* KEY STOTRAS SECTION */}
          <div style={{ ...s.card, marginBottom: 10 }}>
            <p style={{ color: C.brightGold, fontSize: 15, marginBottom: 8 }}>✨ Key Stotras to Chant</p>
            {[
              { name: "Dvadasha Stotra", when: "During Naivedya (food offering) at puja", desc: "12 stotras by Madhvacharya. First verse: 'Vande vandyam sadanandam Vasudevam niranjanam...'" },
              { name: "Vishnu Sahasranama", when: "Daily — morning or evening puja", desc: "1000 names of Vishnu from Mahabharata. Madhvacharya's Bhashya gives up to 100 meanings per name." },
              { name: "Vayustuti", when: "Daily recitation; especially on Ekadashi", desc: "By Trivikrama Pandita. Praises Vayu as Hanuman, Bhima, Madhvacharya. Begins with 'Hari Sarvottama Vayu Jeevottama.'" },
              { name: "Nakha Stuti", when: "Narasimha Jayanti (30 Apr 2026) and times of danger", desc: "By Madhvacharya. Praises Lord Narasimha's nails that destroyed Hiranyakashipu." },
              { name: "Raghavendra Stotra", when: "Daily by Uttaradi Math devotees; Aradhana (29-31 Aug 2026)", desc: "'Poojyaya Raghavendraya Satya Dharma Ratayacha, Bhajataam Kalpavrikshaaya Namathaam Kamadhenave'" },
              { name: "Krishnashtaka", when: "Janmashtami (04 Sep 2026) and Krishna puja", desc: "8-verse stotra by Madhvacharya glorifying Lord Krishna's divine beauty and attributes." },
            ].map((st, i) => (
              <div key={i} style={{ borderBottom: `1px solid rgba(200,134,10,.12)`, paddingBottom: 8, marginBottom: 8 }}>
                <p style={{ color: C.brightGold, fontSize: 13 }}>{st.name}</p>
                <p style={{ color: C.gold, fontSize: 11, fontStyle: "italic" }}>When: {st.when}</p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{st.desc}</p>
              </div>
            ))}
          </div>

          {/* PUJA PROCEDURES */}
          <p style={{ color: C.brightGold, fontSize: 14, marginBottom: 8, padding: "0 4px" }}>🔔 Puja Procedures by Festival</p>
          {PUJA_ITEMS.map((p, i) => (
            <div key={i} className="puja-row" style={{ ...s.card, marginBottom: 6, transition: "all .15s" }} onClick={() => setExpandedPuja(expandedPuja === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: C.text, fontSize: 14 }}>{p.icon} {p.title}</p>
                <span style={{ color: C.gold, fontSize: 16 }}>{expandedPuja === i ? "▲" : "▼"}</span>
              </div>
              {expandedPuja === i && (
                <div style={{ marginTop: 10 }}>
                  <ol style={{ paddingLeft: 18 }}>
                    {p.steps.map((step, j) => (
                      <li key={j} style={{ color: C.text, fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>{step}</li>
                    ))}
                  </ol>
                  {p.note && <p style={{ color: C.gold, fontSize: 12, marginTop: 10, fontStyle: "italic", borderTop: `1px solid rgba(200,134,10,.15)`, paddingTop: 8 }}>📌 {p.note}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══ BHAGAVATAM TAB ══ */}
      {activeTab === "bhagavata" && (
        <div style={{ ...s.panel, paddingBottom: 24 }}>
          <div style={{ ...s.card, background: "rgba(200,134,10,.06)", marginBottom: 12 }}>
            <p style={{ color: C.brightGold, fontSize: 14, fontStyle: "italic", lineHeight: 1.6 }}>
              "Nigama-kalpa-taror galitaṃ phalaṃ śuka-mukhād amṛta-drava-saṃyutam"
            </p>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>The Bhagavatam is the ripe fruit of the Vedic tree, flowing with nectar from the lips of Suka Muni. (SB 1.1.3)</p>
          </div>

          {/* KEY SHLOKAS */}
          <p style={{ color: C.brightGold, fontSize: 14, marginBottom: 8, padding: "0 4px" }}>🕉️ Key Shlokas</p>
          {KEY_BHAGAVATA_SHLOKAS.map((sh, i) => (
            <div key={i} style={{ ...s.card, marginBottom: 6 }}>
              <p style={{ color: C.brightGold, fontSize: 13, fontStyle: "italic", lineHeight: 1.6 }}>{sh.text}</p>
              <p style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>{sh.meaning}</p>
            </div>
          ))}

          {/* 12 SKANDHAS */}
          <p style={{ color: C.brightGold, fontSize: 14, margin: "12px 0 8px", padding: "0 4px" }}>📖 The 12 Skandhas (Cantos)</p>
          {BHAGAVATA_SKANDHAS.map((sk, i) => (
            <div key={i} className="skd-row" style={{ ...s.card, marginBottom: 5, transition: "all .15s" }} onClick={() => setExpandedSkandha(expandedSkandha === i ? null : i)}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `rgba(200,134,10,.15)`, border: `1px solid rgba(200,134,10,.35)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.gold, fontSize: 12, flexShrink: 0 }}>{sk.num}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text, fontSize: 13 }}>{sk.title}</p>
                  {expandedSkandha === i && <p style={{ color: C.muted, fontSize: 12, marginTop: 5, lineHeight: 1.6 }}>{sk.key}</p>}
                </div>
                <span style={{ color: C.gold, fontSize: 14 }}>{expandedSkandha === i ? "▲" : "▼"}</span>
              </div>
            </div>
          ))}

          {/* MADHWA VIEW */}
          <div style={{ ...s.card, marginTop: 10, borderColor: `rgba(200,134,10,.35)` }}>
            <p style={{ color: C.brightGold, fontSize: 13, marginBottom: 6 }}>Madhwa Interpretation</p>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>Madhvacharya's Bhagavata Tatparya Nirnaya reveals the Dvaita purport: every lila of Krishna demonstrates His supreme independence (Swatantrya) and omnipotence. The Gopis' love represents the highest Ananya Bhakti — completely selfless and undivided devotion. Gajendra's surrender is the model of Prapatti (Sharanagati). Prahlada teaches us that devotion cannot be destroyed by any external force. The Bhagavatam's core teaching: Hari Sarvottama — Vishnu alone is the Supreme.</p>
          </div>
        </div>
      )}
    </div>
  );
}
