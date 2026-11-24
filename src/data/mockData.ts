import { UserProfile, ExpenseItem, SavingsGoal, EducationLesson, GovernmentScheme, Mentor, CommunityPost, LanguageCode } from '../types';

export const initialUserProfile: UserProfile = {
  name: "लक्ष्मी देवी (Lakshmi Devi)",
  avatar: "👩‍🌾",
  village: "रामपुर (Rampur)",
  state: "महाराष्ट्र (Maharashtra)",
  occupation: "सिलाई व डेयरी (Tailoring & Dairy)",
  language: "hi",
  literacyLevel: "visual",
  audioAutoPlay: true,
  walletBalance: 2450,
  digitalGoldGrams: 0.35,
  shgPoolContribution: 1200,
};

// Base lessons with multilingual translations
export const getLocalizedLessons = (lang: LanguageCode): EducationLesson[] => {
  const isEn = lang === 'en';
  const isMr = lang === 'mr';
  const isGu = lang === 'gu';
  const isTa = lang === 'ta';
  const isTe = lang === 'te';
  const isBn = lang === 'bn';
  const isKn = lang === 'kn';

  return [
    {
      id: "lesson-1",
      title: isEn ? "Bank Savings vs Cash at Home" : isMr ? "घरातील रोख रक्कम विरुद्ध बँक बचत" : isGu ? "ઘરમાં રોકડ વિરુદ્ધ બેંક બચત" : isTa ? "வீட்டுப் பணம் vs வங்கி சேமிப்பு" : isTe ? "ఇంట్లో నగదు vs బ్యాంకు పొదుపు" : isBn ? "বাড়িতে টাকা রাখা বনাম ব্যাংক সঞ্চয়" : isKn ? "ಮನೆಯಲ್ಲಿ ನಗದು vs ಬ್ಯಾಂಕ್ ಉಳಿತಾಯ" : "घर में छुपा पैसा बनाम बैंक बचत",
      hindiTitle: isEn ? "Put Money to Work: Why Open a Bank Account?" : isMr ? "पैशाला कामाला लावा: बँक खाते का आवश्यक आहे?" : isGu ? "પૈસાને કામે લગાવો: બેંક ખાતું કેમ જરૂરી છે?" : isTa ? "பணத்தை பெருக்கலாம்: வங்கி கணக்கு ஏன் அவசியம்?" : isTe ? "డబ్బును వృద్ధి చేయండి: బ్యాంకు ఖాతా ఎందుకు ముఖ్యం?" : isBn ? "টাকাকে কাজে লাগান: ব্যাংক অ্যাকাউন্ট কেন জরুরি?" : isKn ? "ಹಣವನ್ನು ಬೆಳೆಸಿ: ಬ್ಯಾಂಕ್ ಖಾತೆ ಏಕೆ ಮುಖ್ಯ?" : "पैसे को काम पर लगाएं: बैंक खाता क्यों जरूरी है?",
      category: "basics",
      icon: "🏦",
      duration: isEn ? "3 mins" : isMr ? "3 मिनिटे" : "3 मिनट",
      storyNarrative: isEn
        ? "Lakshmi used to hide cash inside clay pots and boxes. Rats damaged the notes, and inflation reduced their value. Sarita Didi helped her open a Zero-Balance PM Jan Dhan account. Now her money earns guaranteed interest and government subsidies deposit directly into her account."
        : isMr
        ? "लक्ष्मी ताई पूर्वी पैसे मडक्यात किंवा पेटीत लपवून ठेवत असत. उंदरांनी नोटा कुरतडल्या आणि महागाईमुळे पैशांचे मूल्य कमी झाले. सरिता ताईंनी त्यांना झिरो बॅलन्स जन धन खाते उघडून दिले. आता पैशांवर सुरक्षित व्याज मिळते आणि सरकारी अनुदान थेट खात्यात जमा होते."
        : "लक्ष्मी दीदी पहले पैसे मटके या संदूक में छुपाती थीं। एक दिन चूहों ने नोट कुतर दिए और महंगाई से उन पैसों का मोल भी घट गया। सरिता दीदी ने उन्हें जीरो बैलेंस जन धन बैंक खाता खुलवाया। अब पैसे पर सुरक्षित ब्याज भी मिलता है और सरकार की सब्सिडी सीधे बैंक में आती है।",
      keyTakeaways: isEn
        ? [
            "Cash kept at home loses value over time due to inflation and risks theft.",
            "Every rupee deposited in a licensed bank is secure and insured by the RBI.",
            "PM Jan Dhan zero-balance accounts have no minimum balance penalty."
          ]
        : isMr
        ? [
            "घरात लपवलेला पैसा वाढत नाही, उलट महागाईमुळे त्याचे मूल्य घटते.",
            "बँकेत जमा केलेला प्रत्येक रुपया सुरक्षित आणि आरबीआयद्वारे संरक्षित असतो.",
            "झिरो बॅलन्स जन धन खात्यात किमान रक्कम ठेवण्याची सक्ती नसते."
          ]
        : [
            "घर में छुपाया पैसा बढ़ता नहीं, बल्कि महंगाई में घटता है।",
            "बैंक में जमा हर रुपया सुरक्षित और बीमित (RBI द्वारा) रहता है।",
            "जीरो बैलेंस जन धन खाते में कोई न्यूनतम बैलेंस रखने की मजबूरी नहीं।"
          ],
      audioScript: isEn
        ? "Hello Lakshmi Didi! Money grows safely in bank accounts, not in clay pots. Opening a Jan Dhan account ensures all government benefits reach you directly."
        : isMr
        ? "नमस्कार लक्ष्मी ताई! पैसे मडक्यात नाही तर बँकेत सुरक्षित वाढतात. जन धन खात्यामुळे सरकारची सर्व मदत थेट तुमच्या खात्यात येते."
        : "नमस्ते लक्ष्मी दीदी! पैसे मटके में नहीं, बैंक में सुरक्षित बढ़ते हैं। जन धन खाता खुलवाने से सरकार की हर मदद सीधे आपके खाते में आती है।",
      quizQuestion: {
        question: isEn
          ? "What is the key benefit of keeping money in a bank compared to hiding it in a pot at home?"
          : isMr
          ? "घरातील मडक्यात पैसे लपवून ठेवण्यापेक्षा बँकेत ठेवण्याचा मुख्य फायदा काय?"
          : "घर के मटके में रखे पैसे और बैंक में रखे पैसे में क्या अंतर है?",
        options: isEn
          ? [
              "Bank deposits earn interest and are legally insured (Correct)",
              "Money inside pots multiplies automatically",
              "Keeping money in a bank is illegal",
              "There is no difference"
            ]
          : isMr
          ? [
              "बँकेत पैशांवर सुरक्षित व्याज मिळते आणि ते सुरक्षित राहतात (बरोबर)",
              "मडक्यातील पैसे आपोआप दुप्पट होतात",
              "बँकेत पैसे ठेवणे बेकायदेशीर आहे",
              "दोन्हींमध्ये काहीही फरक नाही"
            ]
          : [
              "बैंक में पैसे पर ब्याज मिलता है और सुरक्षित रहते हैं (सही)",
              "घर के मटके में पैसे अपने आप दोगुने हो जाते हैं",
              "बैंक में पैसा रखना गैरकानूनी है",
              "दोनों में कोई फर्क नहीं"
            ],
        correctIndex: 0,
        explanation: isEn
          ? "Excellent! Money deposited in banks earns guaranteed interest and stays protected."
          : isMr
          ? "छान! बँकेत जमा केलेल्या पैशांवर सुरक्षित व्याज मिळते आणि चोरीचा कोणताही धोका राहत नाही."
          : "शाबाश! बैंक में जमा पैसे पर सरकार द्वारा मान्यता प्राप्त सुरक्षित ब्याज मिलता है।"
      },
      rewardBadge: isEn ? "🏆 Bank Sakhi Badge" : isMr ? "🏆 बँक सखी पदक" : "🏆 बैंक सखी बैज",
      completed: true
    },
    {
      id: "lesson-2",
      title: isEn ? "Freedom from Predatory Moneylenders" : isMr ? "सावकारी पाशातून मुक्ती" : "साहूकार के जाल से मुक्ति",
      hindiTitle: isEn ? "The Reality of '3% per month': How Moneylenders Trap Families" : isMr ? "दरमहा ३% व्याजाचे सत्य: सावकार कसे अडकवतात?" : "3% प्रति माह का सच: साहूकार कैसे खून चूसते हैं?",
      category: "debt_freedom",
      icon: "⛓️",
      duration: isEn ? "4 mins" : "4 मिनट",
      storyNarrative: isEn
        ? "Village moneylenders claim to charge only 3 rupees per hundred. But this equals 36% annually! A ₹10,000 loan doubles into ₹20,000 in just three years. Banks and Self-Help Groups (SHGs) provide loans at just 7% to 9% per year without requiring you to mortgage your land or jewelry."
        : isMr
        ? "गावातील सावकार म्हणतात की फक्त ३ रुपये शेकडा व्याज आहे. पण हे वर्षाला ३६% होते! १०,००० रुपयांचे कर्ज ३ वर्षांत २०,००० होते. तेच बँक किंवा बचत गटातून केवळ ७% ते ९% दराने सोप्या हप्त्यांवर मिळते."
        : "गांव के लाला जी कहते हैं कि सिर्फ ₹3 प्रति सैकड़ा ब्याज है। लेकिन यह सालाना 36% बनता है! ₹10,000 का कर्ज 3 साल में ₹20,000 बन जाता है। वहीं बैंक से या SHG समूह से यही कर्ज केवल 7% से 9% सालाना पर मिल जाता है।",
      keyTakeaways: isEn
        ? [
            "Moneylender's '3 rupees per hundred' is actually an exorbitant 36% annual rate.",
            "Bank Mudra loans and SHG community loans charge only 7% to 9% per year.",
            "Never mortgage your agricultural land or ancestral jewelry to unorganized lenders."
          ]
        : isMr
        ? [
            "सावकाराचा '३ रुपये शेकडा' हा प्रत्यक्षात वार्षिक ३६% चा महाभयंकर भार आहे.",
            "मुद्रा योजना आणि बचत गटात व्याज दर अत्यंत कमी (७-९% वार्षिक) असतो.",
            "सावकाराकडे कधीही जमीन किंवा दागिने गहाण ठेवू नका."
          ]
        : [
            "साहूकार का '3 रुपये सैकड़ा' असल में 36% सालाना का भयानक बोझ है।",
            "बैंक मुद्रा लोन और SHG में ब्याज बहुत ही कम (7-9% वार्षिक) होता है।",
            "साहूकार को कभी अपनी जमीन या जेवर गिरवी न दें।"
          ],
      audioScript: isEn
        ? "Listen carefully, Didi! A moneylender's 3 rupees per hundred is actually 36% interest per year. Turn to your Self-Help Group or Bank Mitra instead."
        : "दीदी ध्यान से सुनें! साहूकार का 3 रुपये प्रति सैकड़ा ब्याज असल में 36% सालाना का जानलेवा जाल है।",
      quizQuestion: {
        question: isEn
          ? "Instead of a moneylender charging 36% interest, where should rural women get low-interest loans?"
          : isMr
          ? "सावकाराच्या ३६% व्याजाऐवजी आपण कुठून कमी व्याजात कर्ज घेतले पाहिजे?"
          : "साहूकार के 36% ब्याज के बदले हमें कहां से कम ब्याज पर कर्ज लेना चाहिए?",
        options: isEn
          ? [
              "Self-Help Group (SHG) or Bank Mudra Loan (7-9%) (Correct)",
              "Another private moneylender",
              "By mortgaging farmland",
              "Never repaying loans"
            ]
          : isMr
          ? [
              "महिला बचत गट (SHG) किंवा बँक मुद्रा कर्ज (७-९%) (बरोबर)",
              "दुसऱ्या सावकाराकडून",
              "शेती गहाण ठेवून",
              "कर्ज कधीच न फेडणे"
            ]
          : [
              "स्वयं सहायता समूह (SHG) या बैंक मुद्रा लोन (7-9%) (सही)",
              "किसी दूसरे साहूकार से",
              "जमीन गिरवी रखकर",
              "कर्ज कभी नहीं चुकाना चाहिए"
            ],
        correctIndex: 0,
        explanation: isEn
          ? "Correct! SHGs and banks offer subsidized rates without exploiting borrowers."
          : "बिल्कुल सही! SHG और बैंक आपको बहुत कम ब्याज पर और बिना जमीन गिरवी रखे आत्मनिर्भर बनाते हैं।"
      },
      rewardBadge: isEn ? "🛡️ Debt Freedom Shield" : isMr ? "🛡️ सावकार मुक्ती ढाल" : "🛡️ स्वाभिमान रक्षक",
      completed: false
    },
    {
      id: "lesson-3",
      title: isEn ? "The Collective Power of SHGs" : isMr ? "महिला बचत गटांची ताकद" : "स्वयं सहायता समूह (SHG) की ताकत",
      hindiTitle: isEn ? "Prosperity in Unity: How 10 Sisters Became Independent" : isMr ? "एकतेतून समृद्धी: १० बहिणी कशा स्वावलंबी झाल्या?" : "एकता में समृद्धि: 10 बहनें मिलकर कैसे बनीं लखपति?",
      category: "shg",
      icon: "🤝",
      duration: isEn ? "4 mins" : "4 मिनट",
      storyNarrative: isEn
        ? "When 10 to 15 women pool ₹100 each month, they build a powerful community fund. Any member facing illness, school fee deadlines, or wishing to start a tailoring or spices venture receives instant loans with friendly repayment terms."
        : "जब 10 से 15 बहनें हर महीने ₹100-₹100 जमा करती हैं, तो एक बड़ा समूह कोष बनता है। किसी बहन को बीमारी में, बच्चे की पढ़ाई में या सिलाई का काम शुरू करने में तुरंत बिना किसी झंझट के आसान किश्तों पर मदद मिल जाती है।",
      keyTakeaways: isEn
        ? [
            "Saving ₹100/month consistently creates an emergency reserve fund.",
            "Internal lending within the group resolves emergencies without delay.",
            "Government Lakhpati Didi missions offer free vocational training and market linkages."
          ]
        : [
            "नियमित ₹100 की मासिक बचत से बड़ा संचित फंड बनता है।",
            "समूह के अंदर ही आपात स्थिति में तुरंत लोन मिल जाता है।",
            "सरकार 'लखपति दीदी' योजना के तहत SHG महिलाओं को मुफ्त हुनर व सहायता दे रही है।"
          ],
      audioScript: isEn
        ? "When sisters unite, poverty retreats! Consistent monthly savings in an SHG build a fortress of financial security."
        : "बहनें जब एक साथ आती हैं, तो गरीबी खुद-ब-खुद हार मान लेती है। SHG में हर महीने की छोटी बचत से लाखों का सामूहिक फंड बनता है।",
      quizQuestion: {
        question: isEn
          ? "What is the primary advantage of joining a Self-Help Group (SHG)?"
          : "स्वयं सहायता समूह (SHG) का मुख्य फायदा क्या है?",
        options: isEn
          ? [
              "Low-interest emergency support and business credit (Correct)",
              "Lottery ticket gambling",
              "Just gossip and meetings",
              "No practical benefit"
            ]
          : [
              "कम ब्याज पर आपातकालीन सहायता और व्यापार लोन (सही)",
              "लॉटरी में पैसा लगाना",
              "सिर्फ बातें करना",
              "कोई फायदा नहीं"
            ],
        correctIndex: 0,
        explanation: isEn
          ? "Well done! SHGs empower women through collective bargaining, low-cost credit, and mutual solidarity."
          : "बहुत खूब! SHG समूह महिलाओं को एकजुट कर आर्थिक शक्ति और सस्ता लोन देता है।"
      },
      rewardBadge: isEn ? "👭 SHG Star Badge" : "👭 सखी शक्ति स्टार",
      completed: false
    },
    {
      id: "lesson-4",
      title: isEn ? "Cyber & Digital Fraud Defense" : isMr ? "सायबर फसवणुकीपासून सावध राहा" : "डिजिटल सुरक्षा: जालसाजी से कैसे बचें?",
      hindiTitle: isEn ? "OTP and ATM PIN: Never Hand Over Your Vault Key" : isMr ? "OTP आणि पिन: चावी कोणालाही देऊ नका!" : "OTP और पिन: चाबी किसी को न सौंपें!",
      category: "cyber_safety",
      icon: "🔒",
      duration: isEn ? "3 mins" : "3 मिनट",
      storyNarrative: isEn
        ? "Lakshmi received a phone call: 'I am calling from the bank manager's desk. You won a ₹25,000 grant. Share the 4-digit code sent to your phone.' Remembering the Sakhi safety rules, she refused and hung up. Banks NEVER call asking for OTPs or ATM PINs."
        : "एक दिन लक्ष्मी दीदी को फोन आया: 'मैं बैंक मैनेजर बोल रहा हूँ, आपकी 25,000 की लॉटरी लगी है, फोन पर आया 4 अंकों का कोड बताएं'। लक्ष्मी दीदी ने सखी ऐप का सबक याद रखा और मना कर दिया। असल में वह एक ठग था। बैंक कभी फोन पर OTP नहीं मांगता!",
      keyTakeaways: isEn
        ? [
            "Your OTP and ATM PIN are your private digital keys; never share them with anyone.",
            "Do not tap on unknown SMS or WhatsApp links promising free money or smartphones.",
            "Only scan biometrics at official Micro-ATMs or certified Bank Mitra counters."
          ]
        : [
            "OTP या पिन आपके बैंक की तिजोरी की चाबी है—किसी अनजान को न दें।",
            "फोन पर मुफ्त लॉटरी या सरकारी योजना के नाम पर लिंक पर क्लिक न करें।",
            "अंगूठा सिर्फ बैंक मित्र या सरकारी राशन की आधिकारिक मशीन पर लगाएं।"
          ],
      audioScript: isEn
        ? "Stay vigilant, Lakshmi Didi! If someone claims to be a bank official and requests an OTP, hang up immediately."
        : "सतर्क रहें लक्ष्मी दीदी! अगर कोई कहे कि वह बैंक से बोल रहा है और ओटीपी मांगे, तो तुरंत फोन काट दें।",
      quizQuestion: {
        question: isEn
          ? "If a caller claims to be a bank official and asks for your 4-digit SMS OTP, what should you do?"
          : "अगर फोन पर कोई खुद को बैंक अधिकारी बताकर आपसे 4 अंकों का OTP मांगे, तो क्या करना चाहिए?",
        options: isEn
          ? [
              "Refuse and disconnect immediately; never disclose OTPs (Correct)",
              "Read out the OTP immediately",
              "Ask for a reward first",
              "Tell your neighbor to share it"
            ]
          : [
              "साफ मना करें और फोन काट दें, OTP कभी न बताएं (सही)",
              "तुरंत OTP बता देना चाहिए",
              "उससे पैसे की मांग करें",
              "पड़ोसी को बताने को कहें"
            ],
        correctIndex: 0,
        explanation: isEn
          ? "Brilliant! Legitimate bank institutions never request authentication passwords or OTPs over voice calls."
          : "उत्कृष्ट! OTP कभी किसी को नहीं बताना चाहिए। यह आपके खाते की सुरक्षा की गारंटी है।"
      },
      rewardBadge: isEn ? "🔐 Digital Guardian" : "🔐 सतर्क सखी",
      completed: false
    }
  ];
};

export const getLocalizedSchemes = (lang: LanguageCode): GovernmentScheme[] => {
  const isEn = lang === 'en';
  const isMr = lang === 'mr';

  return [
    {
      id: "sch-1",
      name: isEn ? "Pradhan Mantri Mudra Yojana (PMMY)" : "प्रधानमंत्री मुद्रा योजना (PMMY)",
      hindiName: isEn ? "Mudra Loan (Shishu Tier up to ₹50,000)" : isMr ? "मुद्रा योजना (शिशू कर्ज ₹५०,००० पर्यंत)" : "मुद्रा योजना (शिशु लोन ₹50,000 तक)",
      ministry: isEn ? "Ministry of Finance, Govt of India" : "वित्त मंत्रालय, भारत सरकार",
      tagline: isEn ? "Collateral-free, zero-guarantee micro-enterprise loan for women" : isMr ? "कोणतेही तारण न ठेवता नवीन व्यवसाय सुरू करण्यासाठी सुलभ कर्ज" : "बिना किसी गारंटी या गिरवी के नया रोजगार शुरू करने का लोन",
      benefitAmount: isEn ? "₹50,000 to ₹10 Lakhs" : "₹50,000 से ₹10 लाख तक",
      targetGroup: isEn ? "Women tailoring, dairy, petty shops, and handicrafts" : "सिलाई, छोटी दुकान, डेयरी, हस्तशिल्प करने वाली महिलाएं",
      eligibility: isEn
        ? [
            "Age above 18 years",
            "No prior loan defaults",
            "Intent to establish or scale micro-livelihoods"
          ]
        : [
            "आयु 18 वर्ष से अधिक हो",
            "कोई पिछला बैंक डिफ़ॉल्ट न हो",
            "स्वयं का छोटा व्यापार शुरू करने या बढ़ाने का इरादा"
          ],
      documentsRequired: isEn ? ["Aadhaar Card", "Voter ID / Address Proof", "Bank Passbook", "2 Passport Photos"] : ["आधार कार्ड", "निवास प्रमाण", "बैंक पासबुक", "2 पासपोर्ट फोटो"],
      icon: "💼",
      applySteps: isEn
        ? [
            "Visit the local rural bank or certified Bank Mitra kiosk",
            "Request the Mudra Shishu loan application form",
            "Attach photocopies of Aadhaar and passbook",
            "Disbursement credited directly into savings account within 7-10 business days"
          ]
        : [
            "नजदीकी ग्रामीण बैंक या बैंक मित्र शाखा जाएं",
            "मुद्रा शिशु लोन का फॉर्म मांगें",
            "आधार व पासबुक की फोटोकॉपी संलग्न करें",
            "7 से 10 कार्यदिवसों में पैसा सीधे बैंक खाते में"
          ],
      audioExplanation: isEn
        ? "Under the Mudra Yojana, you can get a ₹50,000 collateral-free business loan for tailoring, dairy, or grocery store expansion."
        : "मुद्रा योजना के तहत आप सिलाई मशीन, गाय-भैंस या दुकान के लिए बिना किसी जमीन के गिरवी ₹50,000 का सस्ता लोन ले सकती हैं।"
    },
    {
      id: "sch-2",
      name: isEn ? "Sukanya Samriddhi Yojana (SSY)" : "सुकन्या समृद्धि योजना (SSY)",
      hindiName: isEn ? "Sukanya Samriddhi: Securing Your Daughter's Future" : isMr ? "सुकन्या समृद्धी: मुलीच्या उज्ज्वल भविष्यासाठी" : "सुकन्या समृद्धि: बेटी के उज्ज्वल भविष्य का आधार",
      ministry: isEn ? "Ministry of Women & Child Development / Post Office" : "महिला एवं बाल विकास / डाक विभाग",
      tagline: isEn ? "Highest government guaranteed 8.2% annual compounding interest" : "बेटी की पढ़ाई व शादी के लिए सबसे ज्यादा 8.2% ब्याज दर",
      benefitAmount: isEn ? "8.2% Compound Interest (Tax-Free)" : "सालाना 8.2% चक्रवृद्धि ब्याज (टैक्स फ्री)",
      targetGroup: isEn ? "Parents/Guardians of daughters aged under 10 years" : "10 वर्ष से कम उम्र की बालिकाओं के अभिभावक",
      eligibility: isEn
        ? [
            "Girl child aged 10 years or younger",
            "Minimum initial deposit of just ₹250"
          ]
        : [
            "बेटी की उम्र 10 वर्ष से कम हो",
            "न्यूनतम केवल ₹250 सालाना से खाता शुरू किया जा सकता है"
          ],
      documentsRequired: isEn ? ["Daughter's Birth Certificate", "Parent's Aadhaar Card", "Passport Photos"] : ["बेटी का जन्म प्रमाण पत्र", "माता/पिता का आधार कार्ड", "पासपोर्ट फोटो"],
      icon: "👧",
      applySteps: isEn
        ? [
            "Visit the village Post Office branch",
            "Complete the Sukanya Samriddhi account opening form",
            "Deposit the initial ₹250 amount and receive the official passbook"
          ]
        : [
            "गांव के डाकघर (Post Office) जाएं",
            "सुकन्या समृद्धि फॉर्म भरें",
            "मात्र ₹250 पहली जमा राशि देकर पासबुक प्राप्त करें"
          ],
      audioExplanation: isEn
        ? "If your daughter is under 10, open a Sukanya account at the post office. Starting with just ₹250 gives you 8.2 percent government guaranteed growth."
        : "अगर आपकी बेटी 10 साल से छोटी है, तो डाकघर में सुकन्या खाता खुलवाएं। सिर्फ 250 रुपये से शुरू करें और 8.2 प्रतिशत का सरकारी ब्याज पाएं।"
    },
    {
      id: "sch-3",
      name: isEn ? "PM Suraksha Bima Yojana (PMSBY)" : "प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)",
      hindiName: isEn ? "₹2 Lakh Accident Insurance for Just ₹20/Year" : isMr ? "फक्त ₹२० मध्ये २ लाखांचा अपघात विमा" : "मात्र ₹20 में 2 लाख का दुर्घटना बीमा",
      ministry: isEn ? "Department of Financial Services" : "वित्तीय सेवाएं विभाग",
      tagline: isEn ? "Full family protection for less than the cost of a cup of tea" : "एक चाय के कप के खर्च में पूरे परिवार की सुरक्षा",
      benefitAmount: isEn ? "₹2,00,000 Accidental Death / Disability Cover" : "₹2,00,000 दुर्घटना मृत्यु / दिव्यांगता कवर",
      targetGroup: isEn ? "All bank account holders aged 18 to 70 years" : "18 से 70 वर्ष के सभी बैंक खाताधारक",
      eligibility: isEn
        ? [
            "Active savings account in any licensed bank",
            "Nominal auto-debit of ₹20 deducted annually"
          ]
        : [
            "किसी भी बैंक में बचत खाता हो",
            "साल में केवल ₹20 खाते से कटते हैं"
          ],
      documentsRequired: isEn ? ["Bank Account Passbook", "Aadhaar Card"] : ["बैंक खाता नंबर", "आधार कार्ड"],
      icon: "☂️",
      applySteps: isEn
        ? [
            "Visit your Bank Mitra or rural branch with your passbook",
            "Sign the PMSBY auto-debit enrollment form",
            "Auto-renewal occurs in May/June automatically"
          ]
        : [
            "बैंक पासबुक लेकर बैंक मित्र या शाखा में जाएं",
            "PMSBY के सहमति फॉर्म पर हस्ताक्षर लगाएं",
            "हर साल ₹20 अपने आप कटेंगे और सुरक्षा चालू रहेगी"
          ],
      audioExplanation: isEn
        ? "Just 20 rupees a year provides 2 lakh rupees of emergency insurance coverage for your family."
        : "साल का मात्र 20 रुपया! अगर कोई अनहोनी हो जाए तो परिवार को दो लाख रुपये की आर्थिक ढाल मिलती है।"
    },
    {
      id: "sch-4",
      name: isEn ? "Lakhpati Didi Mission" : "लखपति दीदी योजना",
      hindiName: isEn ? "Lakhpati Didi: Enabling ₹1 Lakh Annual Income for Women" : isMr ? "लखपती दीदी: महिलांचे उत्पन्न ₹१ लाख करण्याचा संकल्प" : "लखपति दीदी: महिला को ₹1 लाख वार्षिक आय का लक्ष्य",
      ministry: isEn ? "Ministry of Rural Development (NRLM)" : "ग्रामीण विकास मंत्रालय (NRLM)",
      tagline: isEn ? "Free technical skills, solar, drone, and dairy training for SHG members" : "SHG बहनों को मुफ्त तकनीकी प्रशिक्षण व सस्ता ऋण",
      benefitAmount: isEn ? "Free Vocational Training + Subsidized Credit" : "मुफ्त कौशल प्रशिक्षण + आसान ऋण",
      targetGroup: isEn ? "Rural women enrolled in active SHGs" : "स्वयं सहायता समूह से जुड़ी ग्रामीण महिलाएं",
      eligibility: isEn
        ? [
            "Active member of an officially recognized SHG",
            "Commitment to operate a micro-livelihood activity"
          ]
        : [
            "सक्रिय महिला स्वयं सहायता समूह की सदस्या हों",
            "आजीविका गतिविधि शुरू करने के लिए इच्छुक हों"
          ],
      documentsRequired: isEn ? ["SHG Membership Certificate", "Aadhaar Card", "Bank Passbook"] : ["SHG सदस्यता प्रमाणपत्र", "आधार कार्ड", "बैंक पासबुक"],
      icon: "🌟",
      applySteps: isEn
        ? [
            "Contact your Community Resource Person (CRP) or Village Organization (VO)",
            "Register for livelihood training (Dairy, Organic Farming, Solar Technician)"
          ]
        : [
            "अपने SHG की बैठक में सीआरपी (CRP) से संपर्क करें",
            "आजीविका प्रशिक्षण के लिए नाम दर्ज करवाएं"
          ],
      audioExplanation: isEn
        ? "Government's Lakhpati Didi mission provides free training and tools to help every rural woman earn over ₹1 lakh annually."
        : "सरकार का संकल्प है हर SHG बहन को लखपति दीदी बनाना। इसमें आपको मुफ्त ट्रेनिंग और अपना काम शुरू करने के लिए आर्थिक मदद मिलती है।"
    }
  ];
};

export const getLocalizedGoals = (lang: LanguageCode): SavingsGoal[] => {
  const isEn = lang === 'en';
  const isMr = lang === 'mr';

  return [
    {
      id: "g-1",
      title: isEn ? "Electric Sewing Machine (Asset)" : isMr ? "इलेक्ट्रिक शिलाई मशीन खरेदी" : "नई इलेक्ट्रिक सिलाई मशीन",
      targetAmount: 5000,
      currentAmount: 3400,
      targetDate: "2027-01-15",
      icon: "🧵",
      category: "asset",
      visualMilestone: isEn ? "68% completed! Only ₹1,600 more needed." : isMr ? "६८% पूर्ण! फक्त १६०० रुपये बाकी आहेत." : "लगभग 68% पूरी! बस 1600 रुपये और चाहिए।"
    },
    {
      id: "g-2",
      title: isEn ? "Priya's 10th Grade Schooling & Cycle" : isMr ? "प्रियाच्या १०वीची फी व सायकल" : "प्रिया की 10वीं कक्षा फीस व साइकिल",
      targetAmount: 4000,
      currentAmount: 2200,
      targetDate: "2027-04-01",
      icon: "🚲",
      category: "education",
      visualMilestone: isEn ? "55% achieved toward school fees." : isMr ? "५५% ध्येय पूर्ण झाले." : "55% लक्ष्य पूरा हुआ।"
    },
    {
      id: "g-3",
      title: isEn ? "Emergency Health Reserve Fund" : isMr ? "तातडीचा आरोग्य सुरक्षा निधी" : "आपातकालीन स्वास्थ्य सुरक्षा गुल्लक",
      targetAmount: 6000,
      currentAmount: 4800,
      targetDate: "2026-12-31",
      icon: "🏥",
      category: "emergency",
      visualMilestone: isEn ? "80% secured! Protects against moneylenders during medical emergencies." : isMr ? "८०% सुरक्षित! आजारपणात सावकाराकडे जावे लागणार नाही." : "80% सुरक्षित! मुसीबत में साहूकार से बचाएगा।"
    },
    {
      id: "g-4",
      title: isEn ? "Murrah Dairy Buffalo Purchase" : isMr ? "दुसरी दुभती म्हैस खरेदी" : "दूसरी मुर्रा भैंस की खरीद",
      targetAmount: 40000,
      currentAmount: 11500,
      targetDate: "2027-10-30",
      icon: "🐄",
      category: "business",
      visualMilestone: isEn ? "Mudra loan + SHG bachat will cover remaining balance." : isMr ? "मुद्रा कर्ज + बचत गट फंडातून उर्वरित रक्कम मिळेल." : "मुद्रा योजना + बचत समूह से शेष फंड मिलेगा।"
    }
  ];
};

export const getLocalizedMentors = (lang: LanguageCode): Mentor[] => {
  const isEn = lang === 'en';
  const isMr = lang === 'mr';

  return [
    {
      id: "m-1",
      name: isEn ? "Sunita Bai Patil" : "सुनीता बाई पाटिल",
      role: isEn ? "President, Ahilyabai Spices Cooperative" : isMr ? "अध्यक्ष, अहिल्याबाई महिला मसाला उद्योग" : "अध्यक्ष, अहिल्याबाई महिला मसाला उद्योग",
      location: isEn ? "Jalgaon, Maharashtra" : "जलगांव, महाराष्ट्र",
      story: isEn
        ? "Started 10 years ago by pounding chilies with just ₹500. Today, our cooperative employs 45 rural women and generates ₹35,000 monthly take-home profit."
        : "10 साल पहले सिर्फ ₹500 से मिर्च-मसाला कूटना शुरू किया था। आज हमारे समूह में 45 महिलाएं काम करती हैं और महीने की ₹35,000 की कमाई होती है।",
      expertise: isEn ? ["Spices & Papad Processing", "SHG Governance", "Rural Haat Distribution"] : ["मसाला व पापड़ उद्योग", "समूह संचालन (SHG)", "हाट बाजार बिक्री"],
      avatar: "👩‍🌾",
      isOnline: true,
      rating: 4.9,
      languages: ["हिंदी", "मराठी", "English"],
      audioIntro: isEn
        ? "Hello sisters! I am Sunita Bai. Never lose hope, even a ₹500 micro-saving can blossom into a prosperous enterprise."
        : "नमस्ते बहनों! मैं सुनीता बाई। हिम्मत मत हारो, ₹500 की बचत भी एक दिन बड़ा कारखाना बन सकती है।"
    },
    {
      id: "m-2",
      name: isEn ? "Meenakshi Rao" : "मीनाक्षी राव",
      role: isEn ? "Certified Rural Bank Mitra & Financial Planner" : isMr ? "प्रमाणित बँक सखी व आर्थिक मार्गदर्शिका" : "सर्टिफाइड ग्रामीण बैंक मित्र व वित्तीय परामर्शदाता",
      location: isEn ? "Dharwad, Karnataka" : "धारवाड़, कर्नाटक",
      story: isEn
        ? "Helped over 1,200 rural women open zero-balance Jan Dhan bank accounts and access collateral-free Mudra business loans."
        : "पिछले 7 वर्षों में 1,200 से अधिक ग्रामीण महिलाओं के जन धन खाते खुलवाए और उन्हें मुद्रा लोन दिलवाने में मदद की।",
      expertise: isEn ? ["Mudra Documentation", "Sukanya Samriddhi", "Cyber Scam Protection"] : ["मुद्रा लोन कागजात", "सुकन्या खाता", "डिजिटल बैंकिंग व फ्रॉड से सुरक्षा"],
      avatar: "👩‍💼",
      isOnline: true,
      rating: 5.0,
      languages: ["हिंदी", "कन्नड़", "English"],
      audioIntro: isEn
        ? "Hello Lakshmi Didi! If you have any questions regarding bank forms, loans, or subsidies, I am here to guide you."
        : "नमस्कार लक्ष्मी दीदी! अगर बैंक में फॉर्म भरने या लोन में कोई परेशानी आए, तो मुझे बताएं।"
    },
    {
      id: "m-3",
      name: isEn ? "Radha Devi Yadav" : "राधा देवी यादव",
      role: isEn ? "Progressive Dairy Leader (12 Indigenous Cow Co-op)" : isMr ? "प्रगतीशील डेअरी व्यावसायिक" : "प्रगतिशील डेयरी संचालिका",
      location: isEn ? "Sitapur, Uttar Pradesh" : "सीतापुर, उत्तर प्रदेश",
      story: isEn
        ? "Began with a single cow. Secured a subsidized loan under the Gokul Mission, and now runs an automated dairy cooperative employing 8 girls."
        : "एक गाय से शुरुआत की थी। राष्ट्रीय गोकुल मिशन की सब्सिडी लेकर आज आधुनिक डेयरी चला रही हूँ।",
      expertise: isEn ? ["Dairy Animal Husbandry", "Biogas Units", "Direct Milk Distribution"] : ["पशुपालन व डेयरी लोन", "गोबर गैस प्लांट", "दूध की सीधी बिक्री"],
      avatar: "🐄",
      isOnline: false,
      rating: 4.8,
      languages: ["हिंदी", "English"],
      audioIntro: isEn
        ? "Greetings sisters! Dairy livestock is our real wealth. Learn about milk yields and subsidies from me."
        : "राम-राम सखियों! पशुधन ही हमारी असली संपत्ति है। वैज्ञानिक तरीके से दूध उत्पादन के बारे में मुझसे सीखें।"
    }
  ];
};

export const getLocalizedPosts = (lang: LanguageCode): CommunityPost[] => {
  const isEn = lang === 'en';

  return [
    {
      id: "post-1",
      authorName: isEn ? "Kamla Bai" : "कमला बाई",
      authorVillage: isEn ? "Hingoli, Maharashtra" : "हिंगोली, महाराष्ट्र",
      authorAvatar: "🧕",
      badge: isEn ? "Tailoring Champion" : "सिलाई सुपर स्टार",
      content: isEn
        ? "Sisters, for the past 4 months I saved ₹50 daily from blouse tailoring into Digital Gold. Today I reached ₹6,000! Now I am purchasing an electric pico machine for Diwali. Small drops truly make an ocean!"
        : "दीदी लोग, मैंने पिछले 4 महीने से रोज सिलाई का ₹50 डिजिटल गोल्ड में जमा किया। आज कुल ₹6,000 की बचत हो गई! अब मैं दिवाली पर अपनी दुकान के लिए पीको मशीन ले रही हूँ। सच में बूंद-बूंद से घड़ा भरता है!",
      likes: 42,
      commentsCount: 9,
      timestamp: isEn ? "2 hours ago" : "2 घंटे पहले",
      category: "success_story"
    },
    {
      id: "post-2",
      authorName: isEn ? "Geeta Ahirwar" : "गीता अहिरवार",
      authorVillage: isEn ? "Sagar, Madhya Pradesh" : "सागर, मध्य प्रदेश",
      authorAvatar: "👩‍🌾",
      badge: isEn ? "Vigilant Sakhi" : "जागरूक सखी",
      content: isEn
        ? "Stay alert, sisters! Yesterday I got a fake phone call claiming my housing subsidy had arrived and asking for an OTP. I remembered our training and hung up immediately. Never give away your digital vault keys!"
        : "बहनों सावधान रहना! कल मुझे एक फोन आया कि पीएम आवास योजना की किस्त आई है, OTP बताओ। मैंने तुरंत फोन काटा और बैंक मित्र दीदी को बताया। कोई भी अपनी चाबी (OTP) किसी को न दे!",
      likes: 68,
      commentsCount: 14,
      timestamp: isEn ? "5 hours ago" : "5 घंटे पहले",
      category: "savings_tip"
    },
    {
      id: "post-3",
      authorName: isEn ? "Sarita Maurya" : "सरिता मौर्य",
      authorVillage: isEn ? "Basti, Uttar Pradesh" : "बस्ती, उत्तर प्रदेश",
      authorAvatar: "👩",
      badge: isEn ? "SHG Secretary" : "SHG सचिव",
      content: isEn
        ? "Our 'Durga Self-Help Group' just had a ₹2 Lakh credit line sanctioned by the bank. Five of us are starting an incense and soap making collective. Thank you all for the blessings!"
        : "हमारे 'जय मां दुर्गे स्वयं सहायता समूह' ने आज बैंक से ₹2 लाख का सीसीएल लोन पास करवाया है। हम 5 बहनें मिलकर अगरबत्ती और साबुन बनाने की यूनिट शुरू कर रही हैं।",
      likes: 85,
      commentsCount: 22,
      timestamp: isEn ? "1 day ago" : "1 दिन पहले",
      category: "shg_update"
    }
  ];
};

export const getLocalizedExpenses = (lang: LanguageCode): ExpenseItem[] => {
  const isEn = lang === 'en';
  const isMr = lang === 'mr';

  return [
    {
      id: "tx-1",
      title: isEn ? "Dairy Milk Revenue" : isMr ? "दूध विक्री कमाई" : "दूध बिक्री आमदनी",
      amount: 320,
      type: "income",
      category: "dairy",
      icon: "🥛",
      date: "2026-11-12",
      note: isEn ? "Supplied 8 liters to cooperative" : "सुबह डेयरी को 8 लीटर दूध दिया",
      audioHint: isEn ? "320 rupees deposited from milk sale" : "डेयरी से 320 रुपये की कमाई जमा हुई"
    },
    {
      id: "tx-2",
      title: isEn ? "Blouse Tailoring Earning" : isMr ? "ब्लाउज शिलाई कमाई" : "ब्लाउज सिलाई कमाई",
      amount: 250,
      type: "income",
      category: "tailoring",
      icon: "🧵",
      date: "2026-11-11",
      note: isEn ? "Finished 2 festive blouses" : "कमला दीदी के 2 शादी के ब्लाउज सिले",
      audioHint: isEn ? "250 rupees received from tailoring" : "सिलाई कार्य से 250 रुपये मिले"
    },
    {
      id: "tx-3",
      title: isEn ? "Ration & Weekly Groceries" : isMr ? "किराणा व तांदूळ" : "राशन व दाल-चावल",
      amount: 180,
      type: "expense",
      category: "grocery",
      icon: "🌾",
      date: "2026-11-10",
      note: isEn ? "Oil, lentils and grains" : "साप्ताहिक हाट से तेल और दाल खरीदी",
      audioHint: isEn ? "180 rupees spent on groceries" : "राशन में 180 रुपये का खर्च हुआ"
    },
    {
      id: "tx-4",
      title: isEn ? "Children's School Books" : isMr ? "मुलांची वह्या-पुस्तके" : "बच्चों की कॉपी-किताब",
      amount: 120,
      type: "expense",
      category: "education",
      icon: "📚",
      date: "2026-11-08",
      note: isEn ? "Mathematics workbook for Priya" : "प्रिया के लिए गणित की अभ्यास पुस्तिका",
      audioHint: isEn ? "120 rupees spent on education" : "पढ़ाई की सामग्री में 120 रुपये खर्च"
    },
    {
      id: "tx-5",
      title: isEn ? "Cattle Feed & Fodder" : isMr ? "गाईसाठी चारा व पಶುಖಾದ್ಯ" : "गाय के लिए चारा व दाना",
      amount: 150,
      type: "expense",
      category: "agriculture",
      icon: "🌱",
      date: "2026-11-06",
      note: isEn ? "Cattle nutrition feed" : "पशु आहार केंद्र से भूसा",
      audioHint: isEn ? "150 rupees spent on cattle feed" : "पशु आहार में 150 रुपये का व्यय"
    }
  ];
};

// Legacy exports for backwards compatibility
export const initialExpenses = getLocalizedExpenses('hi');
export const initialGoals = getLocalizedGoals('hi');
export const educationLessons = getLocalizedLessons('hi');
export const governmentSchemes = getLocalizedSchemes('hi');
export const mentorsList = getLocalizedMentors('hi');
export const communityPosts = getLocalizedPosts('hi');
