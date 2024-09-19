from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///links.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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

@app.route("/admin")
def admin():
    return render_template("admin.html")

@app.route("/api/links", methods=['GET'])
def get_links():
    links = Link.query.order_by(Link.order).all()
    return jsonify([{'id': link.id, 'name': link.name, 'url': link.url} for link in links])

@app.route("/api/links", methods=['POST'])
def add_link():
    data = request.json
    max_order = db.session.query(db.func.max(Link.order)).scalar() or 0
    new_link = Link(name=data['name'], url=data['url'], order=max_order + 1)
    db.session.add(new_link)
    db.session.commit()
    return jsonify({'id': new_link.id, 'name': new_link.name, 'url': new_link.url})

@app.route("/api/links/<int:id>", methods=['DELETE'])
def delete_link(id):
    link = Link.query.get_or_404(id)
    db.session.delete(link)
    db.session.commit()
    return jsonify({'message': 'Link deleted successfully'})

@app.route("/update_order", methods=['POST'])
def update_order():
    new_order = request.json.get('order', [])
    if new_order:
        for index, link_id in enumerate(new_order):
            link = Link.query.get(int(link_id))
            if link:
                link.order = index
        db.session.commit()
        return jsonify({"message": "Order updated successfully"}), 200
    return jsonify({"message": "No order data received"}), 400

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
