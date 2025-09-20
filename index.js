// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend files

const PORT = 3000;

// AI Generation Endpoint
app.post("/generate", async (req, res) => {
    const { productName, artisanStory } = req.body;
    console.log("Received request:", productName, artisanStory);

    try {
        // Correctly formatted multi-line template literal
        const prompt = `Create a short, engaging product description for "${productName}".
Also include a small story snippet from the artisan: "${artisanStory}".
Additionally, generate 2-3 catchy slogans and 2-3 social media captions suitable for promoting this product.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        console.log("AI raw response:", response.data);

        const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No text generated";
        res.json({ result: generatedText });

    } catch (error) {
        console.error("🔥 AI API Error:", error.response?.data || error.message);

        // Always return JSON
        res.status(500).json({
            error: "AI generation failed",
            details: error.response?.data || error.message
        });
    }
});

// AI TRANSLATION 

app.post("/translate", async (req, res) => {
    const { text, targetLanguage } = req.body;
    console.log("Received translation request for:", text.slice(0, 50), "...");
    console.log("Target language:", targetLanguage);

    // --- Critical debugging step ---
    if (!process.env.GOOGLE_API_KEY) {
        console.error("🔥 Error: GOOGLE_API_KEY environment variable is not set.");
        return res.status(500).json({ error: "Server misconfiguration: API key is missing." });
    }

    try {
        const prompt = `Translate the following English text to ${targetLanguage}. Only provide the translated text, do not add any extra commentary or labels: "${text}"`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    candidate_count: 1
                }
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        const translatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Translation failed.";
        
        console.log("Translation successful:", translatedText.slice(0, 50), "...");
        res.json({ translatedText });

    } catch (error) {
        console.error("🔥 AI API Error:", error.response?.data || error.message);

        res.status(500).json({
            error: "Translation failed",
            details: error.response?.data || error.message
        });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});