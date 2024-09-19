from flask import Flask, render_template

app = Flask(__name__)

# Sample data for links
links = [
    {"name": "GitHub", "url": "https://github.com"},
    {"name": "LinkedIn", "url": "https://linkedin.com"},
    {"name": "Twitter", "url": "https://twitter.com"},
    {"name": "Portfolio", "url": "https://example.com/portfolio"},
    {"name": "Blog", "url": "https://example.com/blog"}
]

@app.route("/")
def index():
    return render_template("index.html", links=links)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
