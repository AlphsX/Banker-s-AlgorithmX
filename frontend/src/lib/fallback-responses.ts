/**
 * Fallback Response System
 * Provides helpful responses when API fails
 */

export interface FallbackResponse {
  content: string;
  type: 'trending' | 'crypto' | 'weather' | 'news' | 'general';
  suggestions?: string[];
}

export class FallbackResponseGenerator {
  
  static generateResponse(query: string, error?: string): FallbackResponse {
    const queryLower = query.toLowerCase();
    
    // Trending/News queries
    if (this.isTrendingQuery(queryLower)) {
      return {
        type: 'trending',
        content: `ขออภัยครับ ตอนนี้ผมไม่สามารถเข้าถึงข้อมูลแบบเรียลไทม์ได้ 📡 

แต่ผมแนะนำแหล่งข้อมูลที่น่าเชื่อถือสำหรับข่าวสารล่าสุด:

## 📰 ข่าวเทคโนโลยี
- **TechCrunch** - ข่าวสตาร์ทอัพและเทคโนโลยี
- **The Verge** - รีวิวและข่าวเทค  
- **Wired** - เทคโนโลยีและวิทยาศาสตร์

## 🤖 AI & Machine Learning
- **OpenAI Blog** - ข่าวจาก OpenAI
- **Google AI Blog** - งานวิจัย AI จาก Google
- **Anthropic** - ข่าวและงานวิจัย AI

## 🌐 Trending Topics
- **Twitter/X Trends** - หัวข้อที่กำลังฮิต
- **Reddit Popular** - สิ่งที่คนกำลังพูดถึง
- **Google Trends** - คำค้นหายอดนิยม

ลองถามคำถามเฉพาะเจาะจงมากขึ้น เช่น "อธิบายเทคโนโลยี AI ล่าสุด" แทนนะครับ! 😊`,
        suggestions: [
          "อธิบายเทคโนโลยี AI ล่าสุด",
          "แนวโน้มเทคโนโลยีในอนาคต",
          "การพัฒนา Machine Learning"
        ]
      };
    }
    
    // Crypto queries
    if (this.isCryptoQuery(queryLower)) {
      return {
        type: 'crypto',
        content: `ขออภัยครับ ผมไม่สามารถให้ข้อมูลราคา cryptocurrency แบบเรียลไทม์ได้ 💰

## 📈 แหล่งข้อมูลราคาและตลาด
- **CoinGecko** - ข้อมูลครบถ้วน
- **CoinMarketCap** - ราคาและสถิติ  
- **Binance** - ราคาแบบเรียลไทม์

## 🔍 การวิเคราะห์
- **TradingView** - กราฟและการวิเคราะห์
- **CryptoCompare** - เปรียบเทียบราคา
- **Messari** - ข้อมูลเชิงลึก

## 💡 ข้อมูลทั่วไป
- **CoinDesk** - ข่าวและบทความ
- **Cointelegraph** - ข่าว crypto

ลองถามเกี่ยวกับเทคโนโลยี blockchain หรือแนวคิดเบื้องหลัง crypto แทนนะครับ! 🚀`,
        suggestions: [
          "อธิบายเทคโนโลยี blockchain",
          "ความแตกต่างระหว่าง Bitcoin และ Ethereum", 
          "อนาคตของ cryptocurrency"
        ]
      };
    }
    
    // Weather queries
    if (this.isWeatherQuery(queryLower)) {
      return {
        type: 'weather',
        content: `ขออภัยครับ ผมไม่สามารถให้ข้อมูลสภาพอากาศแบบเรียลไทม์ได้ 🌤️

## 🌦️ สำหรับประเทศไทย
- **กรมอุตุนิยมวิทยา** - tmd.go.th
- **Weather.com** - ข้อมูลโลก
- **AccuWeather** - พยากรณ์แม่นยำ

## 📱 แอปมือถือแนะนำ
- **Weather** (iOS/Android)
- **AccuWeather App**
- **Weather Underground**

ลองถามเกี่ยวกับสภาพภูมิอากาศหรือปรากฏการณ์ทางอุตุนิยมวิทยาแทนนะครับ! 🌍`,
        suggestions: [
          "อธิบายการเกิดพายุ",
          "ปรากฏการณ์เอลนีโญ่คืออะไร",
          "การเปลี่ยนแปลงสภาพภูมิอากาศ"
        ]
      };
    }
    
    // General fallback
    return {
      type: 'general',
      content: `ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผลคำถามของคุณ 😅

## 💡 เคล็ดลับการถามคำถาม:
- ใช้ประโยคที่ชัดเจนและเฉพาะเจาะจง
- หลีกเลี่ยงคำถามที่ต้องการข้อมูลแบบเรียลไทม์  
- ลองแบ่งคำถามซับซ้อนออกเป็นส่วนย่อยๆ

## 🚀 ผมช่วยได้ในเรื่อง:
- อธิบายแนวคิดและทฤษฎี
- ให้คำแนะนำและข้อเสนอแนะ
- วิเคราะห์และสรุปข้อมูล
- เขียนและแก้ไขเนื้อหา

ลองถามใหม่ด้วยรูปแบบที่ต่างออกไปนะครับ! 😊`,
      suggestions: [
        "อธิบายหัวข้อที่สนใจ",
        "ขอคำแนะนำในการเรียนรู้",
        "วิเคราะห์ข้อมูลที่มี"
      ]
    };
  }
  
  private static isTrendingQuery(query: string): boolean {
    const trendingKeywords = [
      'trending', 'trend', 'popular', 'viral', 'hot',
      'latest', 'recent', 'current', 'now', 'today',
      'news', 'breaking', 'update', 'happening',
      'what\'s new', 'what is trending', 'what\'s hot'
    ];
    
    return trendingKeywords.some(keyword => query.includes(keyword));
  }
  
  private static isCryptoQuery(query: string): boolean {
    const cryptoKeywords = [
      'bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'cryptocurrency',
      'price', 'market', 'trading', 'coin', 'token', 'blockchain',
      'dogecoin', 'ada', 'solana', 'binance', 'coinbase'
    ];
    
    return cryptoKeywords.some(keyword => query.includes(keyword));
  }
  
  private static isWeatherQuery(query: string): boolean {
    const weatherKeywords = [
      'weather', 'temperature', 'rain', 'sunny', 'cloudy',
      'forecast', 'climate', 'hot', 'cold', 'storm',
      'humidity', 'wind', 'snow', 'fog'
    ];
    
    return weatherKeywords.some(keyword => query.includes(keyword));
  }
  
  static getRandomEncouragement(): string {
    const encouragements = [
      "ลองถามใหม่นะครับ! 😊",
      "ผมพร้อมช่วยเหลือคุณ! 🚀", 
      "มีคำถามอื่นไหมครับ? 💫",
      "ลองเปลี่ยนรูปแบบคำถามดูครับ! 🔄",
      "ผมอยู่ที่นี่เพื่อช่วยคุณ! 💪"
    ];
    
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }
}

export default FallbackResponseGenerator;