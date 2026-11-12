import { LanguageCode, UserProfile, ExpenseItem } from '../types';

interface AdviceResponse {
  answer: string;
  hindiAnswer: string;
  actionableStep?: string;
  recommendedCategory?: string;
  badgeUnlocked?: string;
}

export class AIAdvisorService {
  /**
   * Intelligently parses spoken or typed phrases into financial records
   * e.g. "दूध के 150 रुपये मिले" -> income, dairy, 150
   * e.g. "राशन में 300 खर्च हुए" -> expense, grocery, 300
   */
  static parseVoiceTransaction(transcript: string): Partial<ExpenseItem> | null {
    const text = transcript.toLowerCase();
    
    // Extract numbers (supporting Indian digit phrases or direct digits)
    const numMatch = text.match(/\d+/);
    const amount = numMatch ? parseInt(numMatch[0], 10) : 0;

    if (amount <= 0) return null;

    // Detect income vs expense
    const isIncome = 
      text.includes('मिले') || 
      text.includes('कमाई') || 
      text.includes('आए') || 
      text.includes('मिला') || 
      text.includes('income') || 
      text.includes('received') || 
      text.includes('earning') ||
      text.includes('मिळाले') ||
      text.includes('આવ્યા');

    let category = isIncome ? 'other_income' : 'other_expense';
    let title = isIncome ? 'आमदनी' : 'दैनिक खर्च';
    let icon = '💵';

    if (text.includes('दूध') || text.includes('डेयरी') || text.includes('गाय') || text.includes('भैंस') || text.includes('milk') || text.includes('dairy')) {
      category = 'dairy';
      title = 'दूध / डेयरी';
      icon = '🥛';
    } else if (text.includes('सब्जी') || text.includes('किराना') || text.includes('राशन') || text.includes('गेहूं') || text.includes('चावल') || text.includes('ration') || text.includes('grocery')) {
      category = 'grocery';
      title = 'राशन व किराना';
      icon = '🌾';
    } else if (text.includes('सिलाई') || text.includes('कपड़ा') || text.includes('tailoring') || text.includes('clothes')) {
      category = 'tailoring';
      title = 'सिलाई आमदनी';
      icon = '🧵';
    } else if (text.includes('दवा') || text.includes('अस्पताल') || text.includes('डॉक्टर') || text.includes('बीमार') || text.includes('medicine') || text.includes('hospital')) {
      category = 'health';
      title = 'दवा व इलाज';
      icon = '💊';
    } else if (text.includes('स्कूल') || text.includes('किताब') || text.includes('फीस') || text.includes('बच्चे') || text.includes('school') || text.includes('fees')) {
      category = 'education';
      title = 'बच्चों की पढ़ाई';
      icon = '📚';
    } else if (text.includes('खाद') || text.includes('बीज') || text.includes('खेत') || text.includes('कृषि') || text.includes('farming') || text.includes('seeds')) {
      category = 'agriculture';
      title = 'खेती व बीज';
      icon = '🌱';
    } else if (text.includes('त्योहार') || text.includes('पूजा') || text.includes('मेला') || text.includes('festival')) {
      category = 'festival';
      title = 'त्योहार व उत्सव';
      icon = '🪔';
    }

    return {
      title,
      amount,
      type: isIncome ? 'income' : 'expense',
      category,
      icon,
      date: new Date().toISOString().split('T')[0],
      note: transcript
    };
  }

  /**
   * Generates conversational financial advice for rural women
   */
  static getFinancialAdvice(query: string, lang: LanguageCode, profile: UserProfile): AdviceResponse {
    const q = query.toLowerCase();

    // 1. Moneylender vs Bank Mudra Loan
    if (q.includes('साहूकार') || q.includes('ब्याज') || q.includes('कर्ज') || q.includes('लोन') || q.includes('loan') || q.includes('interest')) {
      return {
        answer: "गांव के साहूकार अक्सर 36% से 60% तक भारी ब्याज लेते हैं, जिससे कभी कर्जा नहीं उतरता। आप 'मुद्रा योजना' (Mudra Loan) या अपने स्वयं सहायता समूह (SHG) से 7-9% वार्षिक ब्याज पर बिना किसी गिरवी के ₹50,000 तक का शिशु लोन ले सकती हैं।",
        hindiAnswer: "साहूकार से कभी भारी ब्याज पर कर्जा न लें! बैंक या स्वयं सहायता समूह से केवल 7% ब्याज पर मुद्रा लोन लें।",
        actionableStep: "अपने नजदीकी बैंक मित्र या SHG दीदी से मुद्रा योजना फॉर्म भरें।",
        recommendedCategory: "schemes"
      };
    }

    // 2. Savings & Gold vs Cash at home
    if (q.includes('सोना') || q.includes('गोल्ड') || q.includes('gold') || q.includes('ज्वेलरी')) {
      return {
        answer: "घर में नकद रखने पर न ब्याज मिलता है और चोरी का डर रहता है। फिजिकल सोने में मेकिंग चार्ज (15-20%) कट जाता है। 'डिजिटल गोल्ड' या 'सुकन्या समृद्धि' में आप सिर्फ ₹10 या ₹250 से शुरुआत कर सकती हैं। हर रुपया सुरक्षित रहता है और बढ़ता है।",
        hindiAnswer: "घर में छुपाकर रखने से पैसे नहीं बढ़ते। ₹10 की छोटी बचत से डिजिटल सोना या पोस्ट ऑफिस आरडी शुरू करें।",
        actionableStep: "आज ही ₹50 की पहली डिजिटल गोल्ड या बचत गुल्लक में जमा करें।",
        recommendedCategory: "invest"
      };
    }

    // 3. Government Scheme for Daughters
    if (q.includes('बेटी') || q.includes('सुकन्या') || q.includes('लड़की') || q.includes('daughter') || q.includes('girl')) {
      return {
        answer: "यदि आपकी बेटी 10 वर्ष से छोटी है, तो पोस्ट ऑफिस में 'सुकन्या समृद्धि खाता' जरूर खुलवाएं। इसमें भारत सरकार 8.2% का सबसे ज्यादा सुरक्षित ब्याज देती है। हर महीने सिर्फ ₹250 जमा करने पर शादी या कॉलेज के समय लाखों का फंड तैयार होगा।",
        hindiAnswer: "बेटी के सुनहरे भविष्य के लिए डाकघर में सुकन्या समृद्धि योजना में ₹250/माह से खाता खुलवाएं।",
        actionableStep: "बेटी का जन्म प्रमाण पत्र और अपना आधार लेकर पोस्ट ऑफिस जाएं।",
        recommendedCategory: "schemes"
      };
    }

    // 4. Budgeting / Less income
    if (q.includes('कमाई') || q.includes('कम') || q.includes('बचत कैसे') || q.includes('budget') || q.includes('save money')) {
      return {
        answer: "लक्ष्मी दीदी, बचत बड़ी रकम से नहीं बल्कि हर दिन के छोटे फैसले से होती है। नियम बनाएं: 'पहले बचत, फिर खर्च'। जैसे ही दूध या सिलाई के ₹100 आएं, तुरंत ₹10 गुल्लक में अलग कर दें। महीने के ₹300 साल में ₹3600 बन जाएंगे।",
        hindiAnswer: "रोजाना की कमाई में से सबसे पहले 10% अलग कर लें। छोटी बचत ही आड़े वक्त में ढाल बनती है।",
        actionableStep: "लक्ष्य बनाएं: अगले 3 महीने में एक सिलाई मशीन या ₹3000 का इमरजेंसी फंड।",
        recommendedCategory: "budget"
      };
    }

    // 5. Digital Fraud & Safety
    if (q.includes('धोखा') || q.includes('पिन') || q.includes('otp') || q.includes('कागजात') || q.includes('fraud') || q.includes('scam')) {
      return {
        answer: "सावधान! बैंक अधिकारी या सरकार कभी भी फोन पर आपसे OTP, पासवर्ड या ATM पिन नहीं मांगती। किसी भी अनजान व्यक्ति को फोन पर बैंक की जानकारी न दें, चाहे वह लॉटरी या सब्सिडी का लालच ही क्यों न दे।",
        hindiAnswer: "सतर्क रहें: OTP और ATM पिन किसी को न बताएं। बैंक कभी फोन पर पिन नहीं मांगता!",
        actionableStep: "कोई भी संदेहास्पद कॉल आने पर 1930 साइबर हेल्पलाइन पर कॉल करें।",
        recommendedCategory: "safety"
      };
    }

    // Default friendly assistant response
    return {
      answer: `नमस्ते ${profile.name} दीदी! मैं आपकी सखी हूँ। आप मुझसे घर का बजट, सरकारी सहायता योजनाएं, बैंक खाता खोलने, या ₹10 से बचत शुरू करने के बारे में कभी भी पूछ सकती हैं।`,
      hindiAnswer: `मैं आपकी वित्तीय सखी हूँ। आप मुझसे बचत, कर्ज, सरकारी योजना या हिसाब-किताब के बारे में पूछ सकती हैं।`,
      actionableStep: "सीखें सेक्शन में जाकर 2 मिनट की ऑडियो कहानी सुनें और नया तमगा पाएं।"
    };
  }

  /**
   * Cashflow forecast & seasonal warning for rural households
   */
  static getSeasonalCashflowWarning(month: number): string {
    // Monsoon / sowing season (June-August) vs Harvest (October-November, March-April)
    if (month >= 5 && month <= 7) {
      return "🌱 बुआई का मौसम: इस समय खाद-बीज का खर्च बढ़ सकता है। अपनी बचत गुल्लक से योजना बनाकर खर्च करें ताकि साहूकार के पास न जाना पड़े।";
    } else if (month >= 9 && month <= 10) {
      return "🌾 खरीफ फसल कटाई: इस समय आमदनी बढ़ने की उम्मीद है। अतिरिक्त आय का 40% तुरंत सुरक्षित बचत या डिजिटल गोल्ड में निवेश करें।";
    } else if (month >= 2 && month <= 3) {
      return "✨ रबी कटाई व शादी-ब्याह का सीजन: त्योहारों व आयोजनों में बजट से अधिक खर्च करने से बचें।";
    }
    return "💡 टिप: हर हफ्ते हिसाब-किताब में ₹100 की आपातकालीन बचत जरूर जोड़ें।";
  }
}
