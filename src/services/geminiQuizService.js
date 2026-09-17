import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

// تحويل الملف أو الصورة إلى Base64
function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type || "application/pdf"
                }
            });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

const quizSchema = {
    type: Type.ARRAY,
    description: "قائمة أسئلة الكويز الموّلدة",
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING, description: "نص السؤال" },
            options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "الاختيارات المتاحة"
            },
            correct: { type: Type.INTEGER, description: "مؤشر الإجابة الصحيحة" },
            explanation: { type: Type.STRING, description: "شرح وتبسيط الإجابة" }
        },
        required: ["question", "options", "correct", "explanation"]
    }
};

// 1. توليد كويز من نص
export async function generateQuizFromText(userText, numQuestions = 5) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `أنت مدرس أكاديمي متخصص. بناءً على النص التالي:\n"""\n${userText}\n"""\nقم بإنشاء كويز مكون من ${numQuestions} أسئلة.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("❌ خطأ Gemini Text:", error);
        throw error;
    }
}

// 2. توليد كويز من صورة
export async function generateQuizFromImage(imageFile, numQuestions = 5) {
    try {
        const imagePart = await fileToGenerativePart(imageFile);

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
                `أنت مدرس أكاديمي متخصص. اقرأ الصورة المرفقة وأنشئ منها كويز تفاعلي مكون من ${numQuestions} أسئلة.`,
                imagePart
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("❌ خطأ معالجة الصورة:", error);
        throw error;
    }
}

// 3. توليد كويز من ملف PDF
export async function generateQuizFromFile(file, numQuestions = 5) {
    try {
        const filePart = await fileToGenerativePart(file);

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
                `أنت مدرس أكاديمي متخصص. اقرأ الملف المرفق جيداً وأنشئ منه كويز تفاعلي مكون من ${numQuestions} أسئلة.`,
                filePart
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("❌ خطأ معالجة الملف:", error);
        throw error;
    }
}