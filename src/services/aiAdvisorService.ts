import { LanguageCode, UserProfile, ExpenseItem } from '../types';

interface AdviceResponse {
  answer: string;
  hindiAnswer: string;
  actionableStep?: string;
  recommendedCategory?: string;
  badgeUnlocked?: string;
}

export class AIAdvisorService {
  static parseVoiceTransaction(transcript: string): Partial<ExpenseItem> | null {
    const text = transcript.toLowerCase();
    
    // Extract numbers
    const numMatch = text.match(/\d+/);
    const amount = numMatch ? parseInt(numMatch[0], 10) : 0;

    if (amount <= 0) return null;

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
    let title = isIncome ? 'आमदनी / Income' : 'दैनिक खर्च / Expense';
    let icon = '💵';

    if (text.includes('दूध') || text.includes('डेयरी') || text.includes('गाय') || text.includes('भैंस') || text.includes('milk') || text.includes('dairy')) {
      category = 'dairy';
      title = 'दूध / Dairy Milk';
      icon = '🥛';
    } else if (text.includes('सब्जी') || text.includes('किराना') || text.includes('राशन') || text.includes('ration') || text.includes('grocery')) {
      category = 'grocery';
      title = 'राशन / Groceries';
      icon = '🌾';
    } else if (text.includes('सिलाई') || text.includes('कपड़ा') || text.includes('tailoring') || text.includes('clothes')) {
      category = 'tailoring';
      title = 'सिलाई / Tailoring';
      icon = '🧵';
    } else if (text.includes('दवा') || text.includes('अस्पताल') || text.includes('डॉक्टर') || text.includes('medicine') || text.includes('hospital')) {
      category = 'health';
      title = 'दवा / Healthcare';
      icon = '💊';
    } else if (text.includes('स्कूल') || text.includes('फीस') || text.includes('school') || text.includes('fees')) {
      category = 'education';
      title = 'पढ़ाई / Education';
      icon = '📚';
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

  static getFinancialAdvice(query: string, lang: LanguageCode, profile: UserProfile): AdviceResponse {
    const q = query.toLowerCase();
    const isEn = lang === 'en';
    const isMr = lang === 'mr';

    // 1. Moneylender vs Bank Mudra Loan
    if (q.includes('साहूकार') || q.includes('ब्याज') || q.includes('कर्ज') || q.includes('लोन') || q.includes('loan') || q.includes('interest')) {
      if (isEn) {
        return {
          answer: "Village moneylenders often charge 36% to 60% annual interest, which creates a never-ending debt cycle. Instead, apply for a PM Mudra Shishu Loan (up to ₹50,000 without collateral) or borrow from your Self-Help Group (SHG) at subsidized 7-9% annual interest.",
          hindiAnswer: "Never borrow from moneylenders at 36%! Take a bank Mudra loan or SHG loan at just 7% interest.",
          actionableStep: "Visit your local Bank Mitra or SHG leader to fill the Mudra Shishu form.",
          recommendedCategory: "schemes"
        };
      }
      if (isMr) {
        return {
          answer: "गावातील सावकार ३६% ते ६०% व्याज घेतात, ज्यामुळे कर्ज कधीच संपत नाही. त्याऐवजी बँक किंवा महिला बचत गटाकडून फक्त ७-९% व्याजाने ५०,००० रुपयांपर्यंतचे तारणमुक्त मुद्रा कर्ज घ्या.",
          hindiAnswer: "सावकाराकडून जास्त व्याजाने कर्ज घेऊ नका! बँकेतून मुद्रा योजना किंवा बचत गटातून कर्ज घ्या.",
          actionableStep: "आपल्या बँक सखीशी किंवा बचत गट अध्यक्षांशी संपर्क साधा.",
          recommendedCategory: "schemes"
        };
      }
      return {
        answer: "गांव के साहूकार अक्सर 36% से 60% तक भारी ब्याज लेते हैं, जिससे कभी कर्जा नहीं उतरता। आप 'मुद्रा योजना' (Mudra Loan) या अपने स्वयं सहायता समूह (SHG) से 7-9% वार्षिक ब्याज पर बिना किसी गिरवी के ₹50,000 तक का शिशु लोन ले सकती हैं।",
        hindiAnswer: "साहूकार से कभी भारी ब्याज पर कर्जा न लें! बैंक या स्वयं सहायता समूह से केवल 7% ब्याज पर मुद्रा लोन लें।",
        actionableStep: "अपने नजदीकी बैंक मित्र या SHG दीदी से मुद्रा योजना फॉर्म भरें।",
        recommendedCategory: "schemes"
      };
    }

    // 2. Savings & Gold vs Cash at home
    if (q.includes('सोना') || q.includes('गोल्ड') || q.includes('gold') || q.includes('ज्वेलरी') || q.includes('save') || q.includes('saving')) {
      if (isEn) {
        return {
          answer: "Keeping cash hidden at home earns zero interest and risks theft or pest damage. With Digital Gold, you can start investing in 24K 99.9% pure gold with as little as ₹10. Every rupee is insured and legally protected.",
          hindiAnswer: "Start saving with Digital Gold starting at just 10 rupees.",
          actionableStep: "Deposit ₹50 in digital gold or your Gullak today.",
          recommendedCategory: "invest"
        };
      }
      return {
        answer: "घर में नकद रखने पर न ब्याज मिलता है और चोरी का डर रहता है। फिजिकल सोने में मेकिंग चार्ज (15-20%) कट जाता है। 'डिजिटल गोल्ड' में आप सिर्फ ₹10 से शुरुआत कर सकती हैं। हर रुपया सुरक्षित रहता है और बढ़ता है।",
        hindiAnswer: "घर में छुपाकर रखने से पैसे नहीं बढ़ते। ₹10 की छोटी बचत से डिजिटल सोना या पोस्ट ऑफिस आरडी शुरू करें।",
        actionableStep: "आज ही ₹50 की पहली डिजिटल गोल्ड या बचत गुल्लक में जमा करें।",
        recommendedCategory: "invest"
      };
    }

    // 3. Government Scheme for Daughters
    if (q.includes('बेटी') || q.includes('सुकन्या') || q.includes('लड़की') || q.includes('daughter') || q.includes('girl')) {
      if (isEn) {
        return {
          answer: "If your daughter is under 10 years old, open a 'Sukanya Samriddhi Account' at your village post office. The government provides the highest guaranteed interest rate of 8.2% per year. Saving just ₹250/month creates a substantial fund for her higher education or marriage.",
          hindiAnswer: "Open a Sukanya Samriddhi account at the post office with just 250 rupees per month.",
          actionableStep: "Bring your daughter's birth certificate and your Aadhaar to the post office.",
          recommendedCategory: "schemes"
        };
      }
      return {
        answer: "यदि आपकी बेटी 10 वर्ष से छोटी है, तो पोस्ट ऑफिस में 'सुकन्या समृद्धि खाता' जरूर खुलवाएं। इसमें भारत सरकार 8.2% का सबसे ज्यादा सुरक्षित ब्याज देती है। हर महीने सिर्फ ₹250 जमा करने पर शादी या कॉलेज के समय लाखों का फंड तैयार होगा।",
        hindiAnswer: "बेटी के सुनहरे भविष्य के लिए डाकघर में सुकन्या समृद्धि योजना में ₹250/माह से खाता खुलवाएं।",
        actionableStep: "बेटी का जन्म प्रमाण पत्र और अपना आधार लेकर पोस्ट ऑफिस जाएं।",
        recommendedCategory: "schemes"
      };
    }

    // Default friendly assistant response
    if (isEn) {
      return {
        answer: `Hello ${profile.name}! I am your AI Saheli financial guide. You can ask me anytime about household budgeting, subsidized Mudra loans, opening a zero-balance bank account, or micro-investing starting from ₹10.`,
        hindiAnswer: `Hello Didi! I am your AI Saheli guide. Feel free to ask me anything about savings, loans, or government schemes.`,
        actionableStep: "Explore the Education modules to listen to a 2-minute story and earn your first badge."
      };
    }
    return {
      answer: `नमस्ते ${profile.name} दीदी! मैं आपकी सखी हूँ। आप मुझसे घर का बजट, सरकारी सहायता योजनाएं, बैंक खाता खोलने, या ₹10 से बचत शुरू करने के बारे में कभी भी पूछ सकती हैं।`,
      hindiAnswer: `मैं आपकी वित्तीय सखी हूँ। आप मुझसे बचत, कर्ज, सरकारी योजना या हिसाब-किताब के बारे में पूछ सकती हैं।`,
      actionableStep: "सीखें सेक्शन में जाकर 2 मिनट की ऑडियो कहानी सुनें और नया तमगा पाएं।"
    };
  }

  static getSeasonalCashflowWarning(month: number): string {
    if (month >= 5 && month <= 7) {
      return "🌱 बुआई का मौसम: खाद-बीज का खर्च बढ़ सकता है। अपनी बचत गुल्लक से योजना बनाकर खर्च करें ताकि साहूकार के पास न जाना पड़े।";
    } else if (month >= 9 && month <= 10) {
      return "🌾 खरीफ फसल कटाई: इस समय आमदनी बढ़ने की उम्मीद है। अतिरिक्त आय का 40% तुरंत सुरक्षित बचत या डिजिटल गोल्ड में निवेश करें।";
    }
    return "💡 टिप: हर हफ्ते हिसाब-किताब में ₹100 की आपातकालीन बचत जरूर जोड़ें।";
  }
}
