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

@app.route("/")
def index():
    links = Link.query.order_by(Link.order).all()
    return render_template("index.html", links=links)

@app.route("/admin", methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        name = request.form['name']
        url = request.form['url']
        max_order = db.session.query(db.func.max(Link.order)).scalar() or 0
        new_link = Link(name=name, url=url, order=max_order + 1)
        db.session.add(new_link)
        db.session.commit()
        return redirect(url_for('admin'))
    
    links = Link.query.order_by(Link.order).all()
    return render_template("admin.html", links=links)

@app.route("/delete/<int:id>")
def delete(id):
    link = Link.query.get_or_404(id)
    db.session.delete(link)
    db.session.commit()
    return redirect(url_for('admin'))

@app.route("/update_order", methods=['POST'])
def update_order():
    new_order = request.json['order']
    for index, link_id in enumerate(new_order):
        link = Link.query.get(link_id)
        if link:
            link.order = index
    db.session.commit()
    return jsonify({"message": "Order updated successfully"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.drop_all()  # Drop all existing tables
        db.create_all()  # Create new tables
        # Add some initial links
        initial_links = [
            Link(name="Google", url="https://www.google.com", order=0),
            Link(name="Facebook", url="https://www.facebook.com", order=1),
            Link(name="Twitter", url="https://www.twitter.com", order=2)
        ]
        db.session.add_all(initial_links)
        db.session.commit()
    app.run(host="0.0.0.0", port=5000)
