export interface BusinessPitchRecommendation {
  categoryName: string;
  hook: Record<'English' | 'Tamil' | 'Hindi' | 'Telugu', string>;
  valueProposition: Record<'English' | 'Tamil' | 'Hindi' | 'Telugu', string>;
  keyPainPoints: string[];
  recommendedModules: string[];
  estimatedMonthlySavingsINR: number;
  objectionHandlers: Array<{
    objection: string;
    rebuttal: Record<'English' | 'Tamil' | 'Hindi' | 'Telugu', string>;
  }>;
  whatsAppTemplate: string;
}

export const BUSINESS_VERTICAL_RECOMMENDATIONS: Record<string, BusinessPitchRecommendation> = {
  'Fine Dining': {
    categoryName: 'Fine Dining & Restro-Bar',
    hook: {
      English: "Hello, am I speaking with the Owner or General Manager? My name is {agentName} from BuildScaleDeploy. We help premium dining restaurants like {businessName} cut table checkout wait times by 40% and increase premium wine & dessert re-orders with digital interactive menus.",
      Tamil: "வணக்கம், நான் BuildScaleDeploy-ல் இருந்து {agentName} பேசுகிறேன். {businessName} போன்ற சிறந்த உணவகங்களில் டேபிள் பில்லிங் தாமதத்தை குறைத்து, வாடிக்கையாளர்களின் அனுபவத்தை உயர்த்தும் டிஜிட்டல் மெனு சிஸ்டம் குறித்து பேசுகிறேன்.",
      Hindi: "नमस्ते, क्या मैं {businessName} के ओनर या मैनेजर से बात कर रहा हूँ? मैं BuildScaleDeploy से {agentName} हूँ। हम फाइन डाइनिंग रेस्टोरेंट्स में टेबल टर्नअराउंड स्पीड 40% बढ़ाते हैं और बिलिंग को सुपरफास्ट बनाते हैं।",
      Telugu: "నమస్కారం, నేను BuildScaleDeploy నుండి {agentName} మాట్లాడుతున్నాను. {businessName} వంటి ప్రీమియం రెస్టారెంట్లలో టేబుల్ ఆర్డర్స్ వేగవంతం చేసి, బిల్లింగ్ సమయాన్ని 40% తగ్గించే ఆధునిక సాఫ్ట్‌వేర్ అందిస్తున్నాము.",
    },
    valueProposition: {
      English: "Our dual captain-tablet sync lets stewards take orders tableside that route immediately to specific kitchen and bar KOT printers, eliminating billing counter bottlenecks on Saturday dinner rushes.",
      Tamil: "எங்கள் கேப்டன் டேப்லெட் சிஸ்டம் மூலம் டேபிளிலேயே ஆர்டர் எடுத்து நேரடியாக கிச்சன் மற்றும் பாருக்கு அனுப்பலாம். வார இறுதி கூட்டத்தில் பில் கவுண்டரில் தாமதமே இருக்காது.",
      Hindi: "हमारा कैप्टन टैबलेट सिस्टम तुरंत किचन और बार में KOT प्रिंट भेजता है, जिससे वीकेंड रश में कोई भी कस्टमर इंतज़ार नहीं करता।",
      Telugu: "మా సిస్టమ్‌తో వెయిటర్స్ టేబుల్ వద్దే ఆర్డర్ తీసుకోగానే కిచెన్ మరియు బార్ ప్రింటర్స్ కి క్షణాల్లో వెళ్తుంది. రద్దీ సమయంలో బిల్లింగ్ ఆలస్యం ఉండదు.",
    },
    keyPainPoints: [
      'Slow bill printing during weekend peak rush',
      'High monthly renewals for add-on captain tablets',
      'Wine and premium liquor shrinkage/inventory loss',
      'Reservation no-shows without deposit locks',
    ],
    recommendedModules: ['Tableside Captain App', 'Bar & Kitchen Dual KOT Sync', 'Sommelier Digital Wine List', 'VIP Guest Loyalty CRM'],
    estimatedMonthlySavingsINR: 35000,
    objectionHandlers: [
      {
        objection: "We already use Petpooja / Posist.",
        rebuttal: {
          English: "Understood! Most fine dining clients initially used them. But they charge expensive yearly renewals for each extra captain tablet. Our system has zero device license fees and gives you lifetime ownership.",
          Tamil: "புரிகிறது! ஆனால் அவர்கள் ஒவ்வொரு கூடுதல் டேப்லெட்டிற்கும் ஆண்டுதோறும் கட்டணம் வசூலிக்கிறார்கள். எங்களிடம் ஒருமுறை மட்டுமே - கூடுதல் கட்டணங்கள் இல்லை.",
          Hindi: "बिल्कुल सही। लेकिन वे हर टैबलेट के लिए अलग से भारी रिन्यूअल फीस लेते हैं। हमारा सॉफ्टवेयर जीरो एक्स्ट्रा डिवाइस फीस पर चलता है।",
          Telugu: "అర్థమైంది! అయితే వారు ప్రతి టాబ్లెట్‌కు వార్షిక రుసుము వసూలు చేస్తారు. మా వద్ద అదనపు డివైస్ ఫీజులు అసలు ఉండవు.",
        },
      },
      {
        objection: "Our guests prefer paper menus, not phones.",
        rebuttal: {
          English: "We completely agree for fine dining! Guests still receive your luxurious physical menu. The digital system is in the captain's hands for instant kitchen dispatch without running back and forth.",
          Tamil: "கண்டிப்பாக! வாடிக்கையாளர்கள் வழக்கமான அட்டையை பயன்படுத்தலாம். ஆனால் கேப்டன் டேப்லெட்டில் ஆர்டர் எடுப்பதால் உணவு விரைவாக பரிமாறப்படும்.",
          Hindi: "बिल्कुल! गेस्ट्स को फिजिकल मेनू ही मिलेगा। कैप्टन के हाथ में टैबलेट होगा ताकि वो बिना भागे तुरंत किचन को आर्डर भेज सकें।",
          Telugu: "ఖచ్చితంగా! అతిథులు పేపర్ మెనూనే చూడవచ్చు. వెయిటర్స్ మాత్రమే వేగంగా ఆర్డర్ పంపడానికి టాబ్లెట్ వాడుతారు.",
        },
      },
    ],
    whatsAppTemplate: "Hi {contactPerson}, thank you for speaking with me today regarding {businessName}. Here is the 2-minute walkthrough of our Fine Dining Tableside KOT & VIP Reservation System: https://buildscaledeploy.internal/finedining-demo. Would tomorrow 3 PM be a good time for a 10-minute online screen demo?",
  },

  'QSR / Fast Food': {
    categoryName: 'Quick Service Restaurant (QSR) & Cafe',
    hook: {
      English: "Hello {contactPerson}! My name is {agentName} from BuildScaleDeploy. We work with busy QSRs and fast-food outlets in {city} to eliminate long ordering lines and save 18-25% on Swiggy/Zomato commission through direct WhatsApp ordering.",
      Tamil: "வணக்கம் {contactPerson}, நான் {agentName}. {city}-ல் உள்ள துரித உணவு மையங்களில் நீண்ட வரிசைகளை தவிர்த்து, ஸ்விக்கி/ஜொமாட்டோ கமிஷன் இல்லாமல் நேரடி வாட்ஸ்அப் ஆர்டர் பெற உதவுகிறோம்.",
      Hindi: "नमस्ते {contactPerson}, मैं {agentName} हूँ। हम {city} में QSRs की लाइनें खत्म करने और स्विगी/ज़ोमैटो को 20% कमीशन दिए बिना डायरेक्ट व्हाट्सप्प आर्डर शुरू कराने में मदद करते हैं।",
      Telugu: "నమస్కారం {contactPerson}, నేను {agentName}. {city} లోని ఫాస్ట్ ఫుడ్ రెస్టారెంట్లలో క్యూలు తగ్గించి, స్విగ్గీ/జొమాటో కమీషన్లు లేకుండా డైరెక్ట్ ఆర్డర్స్ పొందడానికి సహాయం చేస్తున్నాము.",
    },
    valueProposition: {
      English: "Counter QR self-ordering and 3-second thermal receipt generation cuts line wait times from 8 minutes down to 45 seconds, increasing counter throughput by 35%.",
      Tamil: "கவுண்டர் QR ஸ்கேனிங் மற்றும் 3 வினாடி பில்லிங் மூலம் வாடிக்கையாளர்களின் காத்திருப்பு நேரம் வெகுவாகக் குறைந்து விற்பனை 35% அதிகரிக்கும்.",
      Hindi: "काउंटर QR और 3-सेकंड थर्मल बिलिंग से कस्टमर की 8 मिनट की लाइन सिर्फ 45 सेकंड में ख़त्म हो जाती है और बिक्री 35% बढ़ती है।",
      Telugu: "కౌంటర్ QR మరియు 3 సెకన్ల బిల్లింగ్ ద్వారా కస్టమర్ల నిరీక్షణ సమయం తగ్గి సేల్స్ 35% పెరుగుతాయి.",
    },
    keyPainPoints: [
      'Cashier counter bottle-necks during lunchtime rush',
      'Paying 22-28% commissions to Swiggy and Zomato',
      'Kitchen mistakes due to noisy verbal counter call-outs',
      'Lacks customer phone number database for repeat promos',
    ],
    recommendedModules: ['Counter Self-Service QR', 'High-Speed Thermal ESC/POS Invoicing', 'Direct WhatsApp Menu', 'Kitchen Display System (KDS)'],
    estimatedMonthlySavingsINR: 28000,
    objectionHandlers: [
      {
        objection: "Customers are in a hurry, they won't scan QR.",
        rebuttal: {
          English: "That's why our system supports both! Regular walk-ins get billed in 3 seconds at the counter, while waiting customers scan the queue QR to order ahead before reaching the cashier.",
          Tamil: "இரண்டும் உண்டு! கவுண்டரில் 3 வினாடியில் பில் செய்யலாம், அல்லது வரிசையில் நிற்பவர்கள் முன்கூட்டியே QR ஸ்கேன் செய்து ஆர்டர் செய்யலாம்.",
          Hindi: "हम दोनों ऑप्शन देते हैं! काउंटर पर 3 सेकंड में बिलिंग होती है, और लाइन में खड़े लोग पहले ही स्कैन करके आर्डर प्लेस कर सकते हैं।",
          Telugu: "మేము రెండూ అందిస్తాము! కౌంటర్‌లో 3 సెకన్లలో బిల్ అవుతుంది, క్యూలో ఉన్నవారు ముందే QR తో ఆర్డర్ ఇవ్వవచ్చు.",
        },
      },
    ],
    whatsAppTemplate: "Hi {contactPerson}, thank you for taking my call regarding {businessName}. Here is how other fast-food outlets in {city} saved over ₹25,000/mo on aggregator commissions with our instant ordering engine: https://buildscaledeploy.internal/qsr-demo",
  },

  'Cloud Kitchen': {
    categoryName: 'Cloud Kitchen & Multi-Brand Delivery Hub',
    hook: {
      English: "Hello {contactPerson}, this is {agentName} from BuildScaleDeploy. We specialize in Multi-Brand Cloud Kitchen operating systems that consolidate 5+ virtual brands onto one single tablet display with unified raw ingredient inventory.",
      Tamil: "வணக்கம் {contactPerson}, நான் {agentName}. ஒரே டேப்லெட்டில் பல பிராண்டுகளின் ஆர்டர்களை நிர்வகிக்கும் நவீன கிளவுட் கிச்சன் சிஸ்டம் பற்றி பேசுகிறேன்.",
      Hindi: "नमस्ते {contactPerson}, मैं {agentName} हूँ। हम क्लाउड किचन्स के लिए सिंगल-स्क्रीन सिस्टम उपलब्ध कराते हैं जहाँ 5 अलग-अलग ब्रांड्स के ऑर्डर्स एक ही जगह मैनेज होते हैं।",
      Telugu: "నమస్కారం {contactPerson}, నేను {agentName}. ఒకే స్క్రీన్‌పై బహుళ బ్రాండ్ల ఆర్డర్లు మరియు ఇన్వెంటరీని నిర్వహించే క్లౌడ్ కిచెన్ సాఫ్ట్‌వేర్ గురించి కాల్ చేశాను.",
    },
    valueProposition: {
      English: "Centralized kitchen display routes pizza, burger, and biryani orders to respective prep stations automatically, auto-deducting chicken and cheese from stock in real-time.",
      Tamil: "ஒரே சிஸ்டம் மூலம் அனைத்து பிராண்டுகளின் கிச்சன் டிக்கெட்டுகளை துல்லியமாக பிரித்து, மூலப்பொருட்கள் இருப்பை உடனுக்குடன் கணக்கிடலாம்.",
      Hindi: "एक ही स्क्रीन से सारे ब्रांड्स के आर्डर अलग-अलग शेफ्स तक पहुंचते हैं और इन्वेंटरी अपने आप कट जाती है।",
      Telugu: "అన్ని బ్రాండ్ల ఆర్డర్స్ ఆయా కిచెన్ స్టేషన్స్ కి వెంటనే చేరి ఇన్వెంటరీ ఆటోమేటిక్‌గా అప్‌డేట్ అవుతుంది.",
    },
    keyPainPoints: [
      'Managing 5 different tablets for different brands',
      'Stock mismatch and unexpected ingredient shortages',
      'High rider cancellation penalties due to KOT delays',
      'Excessive food waste from lack of batch recipe yields',
    ],
    recommendedModules: ['Multi-Brand Aggregator Dispatch', 'Ingredient Recipe Auto-Deduction', 'Batch Prep Forecast', 'Rider Handover Screen'],
    estimatedMonthlySavingsINR: 42000,
    objectionHandlers: [
      {
        objection: "We already manage on Swiggy / Zomato merchant tablets.",
        rebuttal: {
          English: "Juggling 4-5 different tablets during lunch rush causes missed orders and delayed rider handovers. Our system pulls all brands into one screen and prints one standardized kitchen slip.",
          Tamil: "பல டேப்லெட்டுகளை கையாள்வது தாமதத்தை உண்டாக்கும். எங்கள் சிஸ்டம் அனைத்தையும் ஒரே திரையில் காட்டி ஒற்றை பில் பிரிண்ட் தரும்.",
          Hindi: "अलग-अलग टैबलेट संभालने में आर्डर छूट जाते हैं। हमारा सिस्टम सभी ब्रांड्स को एक ही डिस्प्ले में समेट देता है।",
          Telugu: "అనేక టాబ్లెట్లు నిర్వహించడం కష్టం. మా సాఫ్ట్‌వేర్ అన్నింటినీ ఒకే స్క్రీన్‌పైకి తెస్తుంది.",
        },
      },
    ],
    whatsAppTemplate: "Hi {contactPerson}, thank you for speaking with me about {businessName}. Here is a quick 90-second video showing how our Multi-Brand Cloud Kitchen Engine routes orders to kitchen stations: https://buildscaledeploy.internal/cloudkitchen-demo",
  },

  'Cafe & Bakery': {
    categoryName: 'Cafe, Bakery & Dessert Parlour',
    hook: {
      English: "Hello {contactPerson}! This is {agentName} from BuildScaleDeploy. We help specialty cafes and bakeries in {city} turn first-time coffee buyers into weekly repeat customers with automated WhatsApp loyalty cards and real-time pastry shelf expiry tracking.",
      Tamil: "வணக்கம் {contactPerson}, நான் {agentName}. உங்கள் கஃபே வாடிக்கையாளர்களை மீண்டும் வரவழைக்கும் வாட்ஸ்அப் லாயல்டி மற்றும் பேக்கரி இருப்பு கண்காணிப்பு முறை பற்றி பேசுகிறேன்.",
      Hindi: "नमस्ते {contactPerson}, मैं {agentName} हूँ। हम कैफ़े और बेकरी के लिए डिजिटल लॉयल्टी कार्ड और पेस्ट्री फ्रेशनेस ट्रैकर देते हैं जिससे ग्राहक बार-बार आते हैं।",
      Telugu: "నమస్కారం {contactPerson}, నేను {agentName}. మీ కేఫ్ కస్టమర్లు మళ్లీ మళ్లీ వచ్చేలా వాట్సాప్ లాయల్టీ మరియు బేకరీ ఇన్వెంటరీ సిస్టమ్ అందిస్తున్నాము.",
    },
    valueProposition: {
      English: "Customers scan once to get a digital stamp card on WhatsApp (e.g. '5th Coffee Free'). Zero app downloads required, driving a proven 28% increase in 30-day customer return rate.",
      Tamil: "வாடிக்கையாளர்கள் ஆப் எதுவும் தரவிறக்காமல் வாட்ஸ்அப்பிலேயே டிஜிட்டல் முத்திரை அட்டை பெறலாம். இது வாடிக்கையாளர் வருகையை 28% உயர்த்தும்.",
      Hindi: "बिना कोई ऐप डाउनलोड किए कस्टमर को व्हाट्सप्प पर '5वीं कॉफ़ी फ्री' का डिजिटल स्टैम्प मिलता है, जिससे वे बार-बार आते हैं।",
      Telugu: "యాప్ డౌన్‌లోడ్ లేకుండానే కస్టమర్ వాట్సాప్‌లో డిజిటల్ లాయల్టీ కార్డ్ లభిస్తుంది, దీనివల్ల మళ్లీ వచ్చే కస్టమర్లు 28% పెరుగుతారు.",
    },
    keyPainPoints: [
      'Unsold bakery items spoiling at end of day',
      'No customer loyalty tracking without paper cards',
      'High cost of custom branded mobile apps',
      'Barista order confusion between milk/sugar customizations',
    ],
    recommendedModules: ['WhatsApp Digital Stamp Loyalty', 'Daily Pastry Shelf Expiry Tracker', 'Barista Modifier Customizer', 'Combo Upsell Recommender'],
    estimatedMonthlySavingsINR: 22000,
    objectionHandlers: [
      {
        objection: "We are a small cafe, we don't need fancy software.",
        rebuttal: {
          English: "That's exactly why our cafe edition is lightweight! It runs on any regular smartphone or tablet you already own with zero expensive hardware purchases.",
          Tamil: "அதனால் தான் எங்கள் மென்பொருள் மிகவும் எளியது! உங்களிடம் உள்ள எந்த மொபைல் அல்லது டேப்லெட்டிலும் எளிதாக இயங்கும்.",
          Hindi: "इसीलिए हमारा कैफ़े एडिशन बहुत हल्का और आसान है। यह आपके मौजूदा फ़ोन या टैबलेट पर बिना किसी नए खर्चे के चलता है।",
          Telugu: "అందుకే మా సాఫ్ట్‌వేర్ చాలా తేలికైనది! మీ వద్ద ఉన్న ఫోన్ లేదా టాబ్లెట్‌లోనే పని చేస్తుంది.",
        },
      },
    ],
    whatsAppTemplate: "Hi {contactPerson}, thanks for your time discussing {businessName}! Here is our 1-minute demo of the WhatsApp Coffee Stamp Card: https://buildscaledeploy.internal/cafe-loyalty-demo",
  },
};

export const getPitchRecommendation = (category: string = ''): BusinessPitchRecommendation => {
  const normalized = category.toLowerCase();
  if (normalized.includes('fine') || normalized.includes('bar') || normalized.includes('lounge') || normalized.includes('pub') || normalized.includes('brewery')) {
    return BUSINESS_VERTICAL_RECOMMENDATIONS['Fine Dining'];
  }
  if (normalized.includes('qsr') || normalized.includes('fast') || normalized.includes('burger') || normalized.includes('pizza') || normalized.includes('shawarma')) {
    return BUSINESS_VERTICAL_RECOMMENDATIONS['QSR / Fast Food'];
  }
  if (normalized.includes('cloud') || normalized.includes('delivery') || normalized.includes('dark')) {
    return BUSINESS_VERTICAL_RECOMMENDATIONS['Cloud Kitchen'];
  }
  if (normalized.includes('cafe') || normalized.includes('bakery') || normalized.includes('coffee') || normalized.includes('tea') || normalized.includes('dessert') || normalized.includes('ice cream')) {
    return BUSINESS_VERTICAL_RECOMMENDATIONS['Cafe & Bakery'];
  }
  // Default to QSR / Fast Food base if general
  return BUSINESS_VERTICAL_RECOMMENDATIONS['QSR / Fast Food'];
};

