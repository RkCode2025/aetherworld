from flask import Flask, jsonify, request
from flask_cors import CORS  
import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv  

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")  # Load API key from .env
genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

DEFENSE_STYLES = {
    "Serious Defense": "Defend this topic with well-reasoned, logical arguments:",
    "Humorous Reversal": "Make a funny, satirical defense of this situation:",
    "Historical Context": "Compare this controversy with a similar event from history and explain the similarities:",
    "Devil's Advocate": "Play devil's advocate and provide a counterargument defending this issue:",
}

@app.route("/generate-unsummary", methods=["POST"])
def generate_unsummary():
    """Generates an 'Unsummary' based on the user's input."""
    data = request.json
    prompt = data.get("prompt")
    style = data.get("style")
    word_count = data.get("wordCount")

    if not prompt or not style or not word_count:
        return jsonify({"error": "Missing required fields: 'prompt', 'style', 'wordCount'"}), 400

    try:
        response = model.generate_content(f"Write a {style} unsummary of {word_count} words for: {prompt}")
        return jsonify({"unsummary": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate-excuse", methods=["POST"])
def generate_excuse():
    """Generates a humorous but realistic excuse."""
    try:
        data = request.json
        prompt = data.get("situation")

        if not prompt:
            return jsonify({"error": "Missing required field: 'situation'"}), 400

        ai_prompt = f"Give a very realistic and believable excuse for this situation: {prompt} (Make it absurd but very realistic.)"
        response = model.generate_content(ai_prompt)
        return jsonify({"excuse": response.text})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route("/reverse-cancel", methods=["POST"])
def reverse_cancel():
    """Generates a defense argument for a controversial topic."""
    try:
        data = request.json
        topic = data.get("topic")
        style = data.get("style")
        word_count = data.get("wordCount")

        if not topic or not style or not word_count:
            return jsonify({"error": "Missing required fields: 'topic', 'style', 'wordCount'"}), 400

        if not isinstance(word_count, int) or word_count < 50 or word_count > 1000:
            return jsonify({"error": "Invalid word count. It must be between 50 and 1000 words."}), 400

        style_prompt = DEFENSE_STYLES.get(style, "Defend this controversial topic:")
        ai_prompt = f"{style_prompt} {topic} (Make it persuasive and compelling.)\n\nEnsure the response is approximately {word_count} words."

        response = requests.post(
            f"{GEMINI_API_URL}?key={GENAI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json={"contents": [{"parts": [{"text": ai_prompt}]}]},
        )

        if response.status_code != 200:
            return jsonify({"error": f"API request failed with status {response.status_code}: {response.text}"}), 500

        response_data = response.json()
        candidates = response_data.get("candidates", [])

        if not candidates or not candidates[0].get("content", {}).get("parts"):
            return jsonify({"error": "Invalid API response structure."}), 500

        generated_text = candidates[0]["content"]["parts"][0]["text"]
        actual_word_count = len(generated_text.split())

        if actual_word_count < 0.8 * word_count or actual_word_count > 1.2 * word_count:
            return jsonify({"error": f"Response length ({actual_word_count} words) is outside the acceptable range."}), 400

        return jsonify({"defense": generated_text, "word_count": actual_word_count})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route("/generate-timeline", methods=["POST"])
def generate_timeline():
    """Generates an alternate history timeline."""
    try:
        data = request.json
        prompt = data.get("prompt")

        if not prompt:
            return jsonify({"error": "Missing required field: 'prompt'"}), 400

        ai_prompt = f"Generate an alternate history timeline based on: {prompt}. Provide key events with years."

        response = model.generate_content(ai_prompt)
        generated_text = response.text

        # Convert response into structured timeline events
        events = []
        for line in generated_text.split("\n"):
            parts = line.strip().split(": ", 1)
            if len(parts) == 2:
                year, description = parts
                events.append({"year": year.strip(), "description": description.strip()})

        return jsonify({"timeline": events if events else [{"year": "N/A", "description": "No timeline events generated."}]})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    print("🚀 Flask API running at http://127.0.0.1:5000/")
    app.run(debug=True)

