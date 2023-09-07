
from pickle import TRUE
from setup_db import *
from flask import Flask, render_template, request, redirect, url_for, flash, session, g, abort, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import logging


app = Flask(__name__)
app.debug = True
app.logger.setLevel(logging.ERROR)
app.secret_key = 'some_secret'

def get_db():
    if not hasattr(g, "_database"):
        print("create connection")
        g._database = sqlite3.connect("database.db")
    return g._database

def valid_login(username, password):
    """Checks if username-password combination is valid."""
    # user password data typically would be stored in a database
    conn = get_db()

    hash = get_hash_for_login(conn, username)
    # the generate a password hash use the line below:
    # generate_password_hash("rawPassword")
    if hash != None:
        password_correct = check_password_hash(hash, password)
        print(f"password correct = {password_correct}")
        return True
    return False

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":  # if the form was submitted (otherwise we just display form)
        if valid_login(request.form["username"], request.form["password"]):
            conn = get_db()
            print("username is:",request.form["username"])
            user = get_user_by_name(conn,request.form["username"])
            print(user)
            session["username"] = user["username"]
            fetch_contacts()
            return redirect(url_for("index"))
        else:
            flash("Invalid username or password!")
    return app.send_static_file("login.html")

@app.route("/register", methods=["POST"])
def register():
    username=request.form.get("username", "").strip()
    if username == "":
        flash("Enter username")
        return redirect(url_for("login_page"))
    if len(username) < 4:
        flash("Username must have at least 4 characters")
        return redirect(url_for("login_page"))

    pw=request.form.get("password", "")
    if pw =="":
        flash("Enter password")
        return redirect(url_for("login_page"))
    
    hash=generate_password_hash(pw)

    conn=get_db()
    id = add_user(conn, username, hash)
    if id == -1:
        flash("Username already taken")
        return redirect(url_for("login_page"))
    
    session["username"] = username
    return redirect(url_for("index"))

@app.route("/logout", methods=["POST"])
def logout():
    print("session : ", session)
    try:
        session.pop("username")
        print("line 77: logout redirect")
        return app.send_static_file("login.html")
    except:
        print("error logging out")
        return app.send_static_file("login.html")

@app.route("/")
def login_page():
    print("session : ", session)
    return app.send_static_file("login.html")


@app.route("/index")
def index():
    print("session : ", session)
    return app.send_static_file("index.html")

@app.route("/fetch_username")
def fetch_username():
    username=session.get("username", None)
    if username:
        
        user = [{"username": username}]
        print('---------------------------------', user)
        return jsonify(user)
    return 'no user logged in'

@app.route("/fetch_contacts")
def fetch_contacts():
    username=session.get("username", None)
    conn=get_db()
    contact_details=get_address_by_username(conn, username)
    #print(contact_details)
    if contact_details:
        print(contact_details)
        return jsonify(contact_details)
    return "no contacts to display"

@app.route("/add_contact", methods=["POST"])
def add_contact():
    print("add_contact initiated")
    username=session.get("username", None)
    conn=get_db()
    contactname=request.form["name"]
    tel=request.form["tel"]
    email=request.form["email"] 
    conn=get_db()
    add_address(conn, username, contactname, tel, email)
    fetch_contacts()
    return app.send_static_file("index.html")


@app.route("/delete_contact", methods=["GET", "POST"])
def delete_contact():
    print("delete_contact initiated")
    if request.method=="POST":
        jsonDATA = request.get_json()
        print(jsonDATA)
        print(jsonDATA['email'])
        conn=get_db()
        delete_from_table(conn, jsonDATA['email'])
        fetch_contacts()
    return app.send_static_file("index.html")

    

def create_database():
    try:
        conn = sqlite3.connect("database.db")
    except sqlite3.Error as err:
        print(err)
    drop_table(conn)  
    create_users_table(conn)
    create_address_table(conn)
    add_user(conn,"first_guy", generate_password_hash("first1"))
    add_user(conn,"other_guy", generate_password_hash("other1"))
    add_user(conn, "yet_another_guy", generate_password_hash("another1"))
    add_address(conn, "first_guy","Don John", "12-322-622", "donjohn@mail.com")
    add_address(conn, "first_guy","Elizabeth Westland", "66-112-312", "e47wl@outlook.com")
    add_address(conn, "first_guy","Kevin Hodges", "1-12-1234-123", "kevinhodges@hotmail.com")
    conn.close()

if __name__ == "__main__":
    create_database()

    ''' try:
        conn = sqlite3.connect("database.db")
    except sqlite3.Error as err:
        print(err)
    #else:
    
    drop_table(conn)    
    create_users_table(conn)
    create_address_table(conn)
    add_user(conn,"first_guy", generate_password_hash("first1"))
    add_user(conn,"other_guy", generate_password_hash("other1"))
    add_user(conn, "yet_another_guy", generate_password_hash("another1"))
    add_address(conn, "first_guy","Don John", "12-322-622", "donjohn@mail.com")
    add_address(conn, "first_guy","Elizabeth Westland", "66-112-312", "e47wl@outlook.com")
    add_address(conn, "first_guy","Kevin Hodges", "1-12-1234-123", "kevinhodges@hotmail.com")
    hash = get_hash_for_login(conn, "other_guy")
    print("Check password: {}".format(check_password_hash(hash,"other1")))
    
    conn.close()
 '''

    app.run(debug=True)