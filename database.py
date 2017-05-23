'''
Created on Mar 26, 2012

@author: steve
'''

import sqlite3
import time
from random import randint, choice


class Database:
    """
    Provide an interface to the database for a COMP249 web application
    """

    def __init__(self, test=False):
        """
        Database called database.db
        """

        self.dbname = "database.db"

        self.conn = sqlite3.connect(self.dbname)

    def cursor(self):
        """Return a cursor on the database"""

        return self.conn.cursor()

    def commit(self):
        """Commit pending changes"""

        self.conn.commit()


    def create_tables(self):
        """Create and initialise the database tables
        This will have the effect of overwriting any existing
        data."""
        
        
        sql = """
DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
            sessionid text unique primary key,
            classannotations text
);

DROP TABLE IF EXISTS buttoncolours;
CREATE TABLE buttoncolours (
            sessionid text unique primary key,
            colour text,
            FOREIGN KEY(sessionid) REFERENCES sessions(sessionid)
);

"""

        self.conn.executescript(sql)
        self.conn.commit()
 

if __name__=='__main__':
    # if we call this script directly, create the database and make sample data
    db = Database()
    db.create_tables()