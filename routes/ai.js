const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API);

router.get("/", function(req, res) {
    res.render("index"); 
});

router.post("/", async (req, res) => {
    const { question, pre, weight, age } = req.body; 

    if (!question) {
      return res.status(400).send("No question provided!");  
    }

    const finalPrompt = `
        User asked: "${question}".  
        Medical info: Pre-condition: ${pre}, Weight: ${weight}kg, Age: ${age}.  
        Provide a structured response with the following sections:
        1. **Overview** - A brief summary of the question.
        2. **Key Points** - Bullet points addressing key aspects of the question.
        3. **Will it be cure at home?** - Give proper info about it. if it can cure at home or not.
        3. **Conclusion** - A brief conclusion or recommendation based on the information.
    `;

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(finalPrompt);  
      const response = await result.response;
      const text = response.text();  

      // console.log("Gemini Response:", text); 

      res.render("response", { 
        question: question, 
        pre: pre,             
        weight: weight,         
        age: age,           
        answer: text           
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Something went wrong");  
    }
});

module.exports = router;
