from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///links.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)  # Add this line for session management
db = SQLAlchemy(app)

class Link(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(200), nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def __init__(self, **kwargs):
        super(Link, self).__init__(**kwargs)

@app.route("/")
def index():
    links = Link.query.order_by(Link.order).all()
    return render_template("index.html", links=links)

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password = request.form['password']
        if check_password_hash(generate_password_hash('admin'), password):  # Replace 'admin' with your desired password
            session['logged_in'] = True
            return redirect(url_for('admin'))
        else:
            return render_template("login.html", error="Invalid password")
    return render_template("login.html")

@app.route("/admin")
def admin():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template("admin.html")

@app.route("/logout")
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))

@app.route("/api/links", methods=['GET'])
def get_links():
    links = Link.query.order_by(Link.order).all()
    return jsonify([{'id': link.id, 'name': link.name, 'url': link.url} for link in links])

@app.route("/api/links", methods=['POST'])
def add_link():
    if not session.get('logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    max_order = db.session.query(db.func.max(Link.order)).scalar() or 0
    new_link = Link(name=data['name'], url=data['url'], order=max_order + 1)
    db.session.add(new_link)
    db.session.commit()
    return jsonify({'id': new_link.id, 'name': new_link.name, 'url': new_link.url})

@app.route("/api/links/<int:id>", methods=['DELETE'])
def delete_link(id):
    if not session.get('logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    link = Link.query.get_or_404(id)
    db.session.delete(link)
    db.session.commit()
    return jsonify({'message': 'Link deleted successfully'})

@app.route("/api/links/swap", methods=['POST'])
def swap_links():
    if not session.get('logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    position1 = data.get('position1')
    position2 = data.get('position2')
    
    if position1 is None or position2 is None:
        return jsonify({"message": "Both positions are required"}), 400
    
    links = Link.query.order_by(Link.order).all()
    
    if position1 < 1 or position2 < 1 or position1 > len(links) or position2 > len(links):
        return jsonify({"message": "Invalid position(s)"}), 400
    
    link1 = links[position1 - 1]
    link2 = links[position2 - 1]
    
    link1.order, link2.order = link2.order, link1.order
    
    db.session.commit()
    return jsonify({"message": f"Swapped links at positions {position1} and {position2}"})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        # Add some initial links if the database is empty
        if not Link.query.first():
            initial_links = [
                Link(name="Google", url="https://www.google.com", order=0),
                Link(name="Facebook", url="https://www.facebook.com", order=1),
                Link(name="Twitter", url="https://www.twitter.com", order=2)
            ]
            db.session.add_all(initial_links)
            db.session.commit()
    app.run(host="0.0.0.0", port=5000)
