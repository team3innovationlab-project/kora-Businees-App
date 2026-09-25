import { GoogleGenAI } from '@google/genai';

export interface PromoGeneratorOptions {
  holidayId: string;
  holidayName: string;
  displayDate?: string;
  discountRate: string; // e.g. '15% OFF', '25% OFF', or 'GH₵ 99 Deal'
  businessName: string;
  city?: string;
  phone?: string;
  tone?: 'festive' | 'flash_sale' | 'vip_exclusive' | 'clearance';
  featuredItem?: string;
}

export interface PromoGeneratorResult {
  headline: string;
  primaryMessage: string;
  variations: string[];
  recommendedSendTime: string;
  urgencyRating: 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  conversionTips: string[];
  dynamicDiscount: string;
  isAiGenerated: boolean;
}

export async function generateHighConversionPromo(
  options: PromoGeneratorOptions
): Promise<PromoGeneratorResult> {
  const {
    holidayName,
    displayDate = 'Upcoming',
    discountRate = '20% OFF',
    businessName = 'Our Store',
    city = 'Accra',
    phone = '',
    tone = 'festive',
    featuredItem = 'storewide catalog',
  } = options;

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI();
      const prompt = `You are an elite retail marketing expert specializing in high-conversion WhatsApp marketing for retail stores in West Africa (Ghana/Nigeria/Kenya).
Write a high-converting WhatsApp promotional message for a retail business.

Parameters:
- Holiday / Event: ${holidayName} (${displayDate})
- Store Name: ${businessName}
- City: ${city}
- Dynamic Discount / Offer: ${discountRate}
- Featured Products: ${featuredItem}
- Tone: ${tone} (e.g., festive celebration, urgent flash sale, or VIP customer appreciation)

Requirements:
1. Format with WhatsApp text styles: use *bold* for emphasis, appropriate emojis (🇬🇭, 🎉, ⚡, 🛍️, 🎁, 🔥), clear spacing.
2. Structure:
   - Hook / Festive Greeting with store name
   - Irresistible Value Proposition featuring the exact discount (${discountRate})
   - Scarcity / Urgency (limited stock or expires tonight)
   - Clear Call-To-Action (e.g., "Reply 'ORDER' to reserve on WhatsApp" or "Visit us at our ${city} store today")
3. Length: 4 to 7 punchy sentences. High conversion, friendly and professional.
4. Output strictly a JSON object with this shape:
{
  "headline": "Short punchy campaign title",
  "primaryMessage": "The main formatted WhatsApp copy",
  "variation1": "A punchier shorter flash-sale variant",
  "variation2": "A warmer, relationship-building VIP variant",
  "recommendedSendTime": "e.g. 08:30 AM - 10:00 AM GMT",
  "urgencyRating": "HIGH" | "VERY HIGH" | "MEDIUM",
  "conversionTips": ["tip 1", "tip 2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return {
          headline: parsed.headline || `${holidayName} Exclusive Offer`,
          primaryMessage: parsed.primaryMessage,
          variations: [parsed.variation1, parsed.variation2].filter(Boolean),
          recommendedSendTime: parsed.recommendedSendTime || '09:00 AM - 11:30 AM GMT',
          urgencyRating: parsed.urgencyRating || 'HIGH',
          conversionTips: parsed.conversionTips || [
            'Reply to incoming WhatsApp orders within 5 minutes to double conversion.',
            'Keep your Mobile Money QR and number ready for swift checkout.',
          ],
          dynamicDiscount: discountRate,
          isAiGenerated: true,
        };
      }
    } catch (err) {
      console.warn('Gemini API promo generation failed, falling back to rule-based engine:', err);
    }
  }

  // High-conversion rule-based marketing copy engine
  return generateRuleBasedPromo(options);
}

function generateRuleBasedPromo(options: PromoGeneratorOptions): PromoGeneratorResult {
  const {
    holidayName,
    displayDate = 'this week',
    discountRate = '20% OFF',
    businessName = 'Techwokx Ghana',
    city = 'Accra',
    tone = 'festive',
    featuredItem = 'our selected catalog',
  } = options;

  let emojiTheme = '🎉';
  let greeting = `Happy ${holidayName}!`;
  let culturalHook = `In celebration of ${holidayName} (${displayDate})`;

  const lowerName = holidayName.toLowerCase();
  if (lowerName.includes('independence')) {
    emojiTheme = '🇬🇭⭐';
    greeting = 'Yεn Ara Asaase Ni! Happy Independence Day!';
    culturalHook = `In honor of 6th March Freedom & Independence`;
  } else if (lowerName.includes('easter')) {
    emojiTheme = '🐣💐';
    greeting = 'Happy Easter & Blessed Weekend!';
    culturalHook = `Celebrate the blessing of Easter with your family`;
  } else if (lowerName.includes('eid') || lowerName.includes('sallah') || lowerName.includes('ramadan')) {
    emojiTheme = '🌙✨';
    greeting = 'Eid Mubarak & Warmest Blessings!';
    culturalHook = `May peace, joy and prosperity fill your home this festive season`;
  } else if (lowerName.includes('black friday')) {
    emojiTheme = '🔥🛍️';
    greeting = 'BLACK FRIDAY SUPER DEAL IS LIVE!';
    culturalHook = `The biggest price drop of the entire year has arrived`;
  } else if (lowerName.includes('christmas') || lowerName.includes('boxing')) {
    emojiTheme = '🎄🎁';
    greeting = 'Afihyia Pa & Merry Christmas!';
    culturalHook = `Spread love and festive cheer with gifts your loved ones will cherish`;
  } else if (lowerName.includes('mother') || lowerName.includes('women')) {
    emojiTheme = '💐👑';
    greeting = 'Celebrating Every Phenomenal Woman!';
    culturalHook = `Treat the queens who make life beautiful`;
  } else if (lowerName.includes('farmers')) {
    emojiTheme = '🌾🚜';
    greeting = "Happy National Farmers' Day!";
    culturalHook = `Saluting our hardworking nation with special community savings`;
  }

  const primaryMessage = `${emojiTheme} *${greeting}*\n\n` +
    `Hello from the team at *${businessName}* in ${city}! ${culturalHook}, we are giving our valued customers an exclusive *${discountRate}* on ${featuredItem}!\n\n` +
    `⚡ *Offer Details:*\n` +
    `• Discount: *${discountRate}*\n` +
    `• Valid: Today & ${displayDate} only\n` +
    `• Payment: Cash, MTN MoMo, Telecel Cash & Visa accepted at counter\n\n` +
    `🎁 *How to claim:* Simply reply *"CLAIM"* to this WhatsApp chat or show this message at our store counter in ${city}.\n\n` +
    `_Limited stock available. Hurry before promo items sell out!_ 🚀`;

  const variation1 = `🔥 *FLASH SALE ALERT: ${discountRate} for ${holidayName}!*\n\n` +
    `Hey there! *${businessName}* is slashing prices for ${holidayName}. Get an instant *${discountRate}* today.\n\n` +
    `📍 Available at our ${city} store or order directly on WhatsApp.\n` +
    `👉 Reply *"YES"* now to reserve your items before stock clears out! 🏃‍♂️💨`;

  const variation2 = `👑 *VIP Customer Appreciation: ${holidayName} Special*\n\n` +
    `Dear valued customer, as we celebrate ${holidayName}, *${businessName}* wants to thank you for choosing us.\n\n` +
    `Enjoy an exclusive VIP discount of *${discountRate}* on your purchases this week.\n\n` +
    `💬 Send us a message here to view available stock or visit our branch in ${city}. Have a wonderful celebration! ${emojiTheme}`;

  return {
    headline: `${holidayName} Promo — ${discountRate}`,
    primaryMessage,
    variations: [variation1, variation2],
    recommendedSendTime: '08:30 AM - 10:30 AM GMT',
    urgencyRating: tone === 'flash_sale' ? 'VERY HIGH' : 'HIGH',
    conversionTips: [
      `Customers in ${city} respond 3x faster to messages that explicitly mention Mobile Money payment options.`,
      `Broadcast in the morning (8:30 AM - 10:30 AM) when WhatsApp engagement is highest.`,
      'Set aside 1 staff member to handle inbound chat reservations.',
    ],
    dynamicDiscount: discountRate,
    isAiGenerated: false,
  };
}
