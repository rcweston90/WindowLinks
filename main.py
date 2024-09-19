from flask import Flask, render_template, request, redirect, url_for
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

@app.route("/")
def index():
    links = Link.query.all()
    return render_template("index.html", links=links)

@app.route("/admin", methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        name = request.form['name']
        url = request.form['url']
        new_link = Link(name=name, url=url)
        db.session.add(new_link)
        db.session.commit()
        return redirect(url_for('admin'))
    
    links = Link.query.all()
    return render_template("admin.html", links=links)

@app.route("/delete/<int:id>")
def delete(id):
    link = Link.query.get_or_404(id)
    db.session.delete(link)
    db.session.commit()
    return redirect(url_for('admin'))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)
