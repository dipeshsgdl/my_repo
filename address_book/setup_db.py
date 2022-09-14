import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

def create_users_table(conn):
    cur = conn.cursor()
    try:
        sql = ("CREATE TABLE IF NOT EXISTS users ("
               "username VARCHAR(20) NOT NULL, "
               "passwordhash VARCHAR(120) NOT NULL, "
               "PRIMARY KEY(username) "
               "UNIQUE(username))")
        cur.execute(sql)
        conn.commit
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    else:
        print("Table created.")
    finally:
        cur.close()

def add_user(conn, username, hash):
    """Add user. Returns the new user id"""
    cur = conn.cursor()
    try:
        sql = ("INSERT INTO users (username, passwordhash) VALUES (?,?)")
        cur.execute(sql, (username, hash))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
        return -1
    else:
        print("User {} created with id {}.".format(username, cur.lastrowid))
        return cur.lastrowid
    finally:
        cur.close()

def get_user_by_name(conn, username):
    """Get user details by name."""
    cur = conn.cursor()
    try:
        print("running get user by name")
        sql = ("SELECT username, passwordhash FROM users WHERE username = ?")
        cur.execute(sql, (username,))
        for row in cur:
            (username, passwordhash) = row
            return {
                "username": username,
                "passwordhash": passwordhash 
            }
        else:
            #user does not exist
            return {
                "username": username,
                "passwordhash": None
            }
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close()


def get_hash_for_login(conn, username):
    """Get user details from id."""
    cur = conn.cursor()
    try:
        sql = ("SELECT passwordhash FROM users WHERE username=?")
        cur.execute(sql, (username,))
        for row in cur:
            (passhash,) = row
            return passhash
        else:
            return None
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close()

def create_address_table(conn):
    cur=conn.cursor()
    #try:
    sql = ("CREATE TABLE IF NOT EXISTS addressbook ("
        "username VARCHAR(20) NOT NULL, "
        "contactname VARCHAR (50) NOT NULL, "
        "telephone VARCHAR (20),"
        "email VARCHAR(50),"
        "PRIMARY KEY(email))")

    cur.execute(sql)
    conn.commit
#except sqlite3.Error as err:
 #       print("Error: {}".format(err))
    #
    print("Address Table created.")
    #finally:
    cur.close()


def add_address(conn, username, contactname, telephone, email):
    cur = conn.cursor()
    try: 
        sql = ("INSERT INTO addressbook (username, contactname, telephone, email) VALUES (?,?,?,?)")
        cur.execute(sql, (username, contactname, telephone, email))
        conn.commit()
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    else:
        print("New address added for {} with id {} .".format(username, cur.lastrowid))
        return cur.lastrowid
    finally:
        cur.close()

def get_address_by_username(conn, username):
    cur= conn.cursor()
    try:
        sql = ("SELECT contactname, telephone, email FROM addressbook WHERE username = ?")
        cur.execute(sql, (username,))
        details = []
        for row in cur:
            (name, telephone, email) = row 
            a= {
                "name":name,
                "telephone":telephone,
                "email":email
                }
            details.append(a)
        return details
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close()    

def drop_table(conn):
    cur=conn.cursor()
    try:
        sql = ("DROP TABLE IF EXISTS users")
        sql1 = ("DROP TABLE IF EXISTS addressbook")     
        cur.execute(sql)
        cur.execute(sql1)
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close()    

def delete_from_table(conn, email):
    print("delete table called")
    cur= conn.cursor()
    print("line 147", email)
    try:
        sql = ("DELETE FROM addressbook WHERE email=?")
        cur.execute(sql, (email,))
        conn.commit()
        print("deleted")
    except sqlite3.Error as err:
        print("Error: {}".format(err))
    finally:
        cur.close() 
    


if __name__ == "__main__":
    

    try:
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
