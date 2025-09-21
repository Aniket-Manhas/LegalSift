const OpenAI = require('openai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @desc    Extract text from document
// @param   {Buffer} fileBuffer - File buffer
// @param   {string} fileType - File type (pdf, doc, docx, txt)
// @returns {string} Extracted text
exports.extractTextFromDocument = async (fileBuffer, fileType) => {
  try {
    let text = '';

    switch (fileType.toLowerCase()) {
      case 'pdf':
        const pdfData = await pdfParse(fileBuffer);
        text = pdfData.text;
        break;
      
      case 'docx':
        const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
        text = docxResult.value;
        break;
      
      case 'doc':
        // For .doc files, you might need a different library
        // For now, we'll treat it as text
        text = fileBuffer.toString('utf-8');
        break;
      
      case 'txt':
        text = fileBuffer.toString('utf-8');
        break;
      
      default:
        throw new Error('Unsupported file type');
    }

    return text.trim();
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from document');
  }
};

// @desc    Analyze document for legal risks
// @param   {string} text - Document text
// @param   {string} documentType - Type of document
// @param   {string} language - Language preference
// @returns {Object} Analysis results
exports.analyzeDocument = async (text, documentType, language = 'en') => {
  try {
    const prompt = `You are an expert legal AI assistant specializing in Indian law. Analyze the following ${documentType} document and provide a comprehensive risk assessment.

Document Text:
${text}

Please provide your analysis in the following JSON format:
{
  "riskScore": 0-100,
  "summary": "Brief summary of the document",
  "keyTerms": ["term1", "term2", "term3"],
  "flaggedClauses": [
    {
      "clause": "exact text of the clause",
      "riskLevel": "low|medium|high|critical",
      "explanation": "why this clause is risky",
      "suggestion": "recommended action"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "plainLanguageExplanation": "Simple explanation of the document in ${language}",
  "confidence": 0-100
}

Focus on:
1. Hidden charges and penalties
2. Unfair terms and conditions
3. Rights and obligations
4. Termination clauses
5. Dispute resolution mechanisms
6. Payment terms
7. Liability limitations
8. Data privacy concerns
9. Compliance with Indian laws

Respond only with valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert legal AI assistant specializing in Indian contract law. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const analysisText = response.choices[0].message.content;
    
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback analysis if JSON parsing fails
      return {
        riskScore: 50,
        summary: "Document analysis completed with limited results",
        keyTerms: [],
        flaggedClauses: [],
        recommendations: ["Please review the document manually"],
        plainLanguageExplanation: "Analysis completed but results may be incomplete",
        confidence: 30
      };
    }
  } catch (error) {
    console.error('Document analysis error:', error);
    throw new Error('Failed to analyze document');
  }
};

// @desc    Generate AI chat response
// @param   {string} message - User message
// @param   {string} context - Conversation context
// @param   {string} language - Language preference
// @returns {string} AI response
exports.generateChatResponse = async (message, context = '', language = 'en') => {
  try {
    const systemPrompt = `You are LegalSift, an AI legal assistant specializing in Indian law. You help users understand legal documents, provide legal guidance, and answer questions about Indian legal system.

Key capabilities:
- Analyze legal documents and contracts
- Explain legal terms in simple language
- Identify potential risks and red flags
- Provide guidance on legal procedures
- Answer questions about Indian laws
- Support multiple Indian languages

Guidelines:
- Always provide accurate, helpful information
- If unsure, recommend consulting a qualified lawyer
- Explain complex legal concepts in simple terms
- Focus on Indian legal context
- Be professional and empathetic
- If the question is outside legal scope, politely redirect

Current conversation context: ${context}
User's preferred language: ${language}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Chat response generation error:', error);
    throw new Error('Failed to generate chat response');
  }
};

// @desc    Generate document summary
// @param   {string} text - Document text
// @param   {string} language - Language preference
// @returns {string} Document summary
exports.generateDocumentSummary = async (text, language = 'en') => {
  try {
    const prompt = `Summarize the following legal document in ${language}. Focus on:
1. Main purpose and parties involved
2. Key terms and conditions
3. Important dates and deadlines
4. Rights and obligations
5. Potential risks or concerns

Document:
${text}

Provide a clear, concise summary in ${language}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert legal assistant. Provide clear, accurate summaries of legal documents."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Document summary error:', error);
    throw new Error('Failed to generate document summary');
  }
};

// @desc    Translate text to different language
// @param   {string} text - Text to translate
// @param   {string} targetLanguage - Target language code
// @returns {string} Translated text
exports.translateText = async (text, targetLanguage) => {
  try {
    const languageNames = {
      'en': 'English',
      'hi': 'Hindi',
      'bn': 'Bengali',
      'te': 'Telugu',
      'ta': 'Tamil',
      'gu': 'Gujarati',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'pa': 'Punjabi',
      'or': 'Odia'
    };

    const targetLangName = languageNames[targetLanguage] || 'English';

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLangName}. Maintain the legal terminology and context.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
};

// @desc    Generate voice summary
// @param   {string} text - Text to summarize for voice
// @param   {string} language - Language preference
// @returns {string} Voice-optimized summary
exports.generateVoiceSummary = async (text, language = 'en') => {
  try {
    const prompt = `Create a voice-friendly summary of the following legal document in ${language}. 
    The summary should be:
    - Conversational and easy to listen to
    - Under 200 words
    - Focus on key points
    - Use simple language
    - Include important warnings or risks

    Document:
    ${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are creating voice summaries for legal documents. Make them conversational and easy to understand."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Voice summary error:', error);
    throw new Error('Failed to generate voice summary');
  }
};
