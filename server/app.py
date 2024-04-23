#import files

import os
from dotenv import load_dotenv
from flask import Flask, render_template, request
from flask_cors import CORS
from openai import OpenAI

load_dotenv()  # take environment variables from .env.
client = OpenAI(
	# This is the default and can be omitted
	api_key=os.environ.get("OPENAI_API_KEY"),
)

app = Flask(__name__)
CORS(app)

def get_completion(prompt, model="gpt-3.5-turbo"):
	messages = [{"role": "user", "content": prompt}]
	response = client.chat.completions.create(
		model=model,
		messages=messages,
		temperature=0, # this is the degree of randomness of the model's output
	)
	# print(dict(response))
	response_message = response.choices[0].message.content
	return response_message
@app.route("/")
def home():	
	return { "message": "Submit a simple form to `/get` to get a response!" }
@app.route("/get", methods=["POST"])
def get_bot_response():	
	userText = request.form["message"] 
	message = get_completion(userText)
	return {
		"message": message
	}
if __name__ == "__main__":
	app.run(port=3000)