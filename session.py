import uuid
import json
from bottle import response, request

class Session:
	'''
	Helper class for tracking a current session's contents
	'''

	def __init__(self):
		self.sessionid = request.get_cookie('sessionid')

	def active_session(self, db):
		'''
		Returns active sessionid data
		'''
		cur = db.cursor()
		sql = 'SELECT * FROM sessions WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))

		return cur.fetchall()

	def insert_session(self, db, annotated_tokens):
		'''
		INSSERTS class annotated data to a session
		'''

		cur = db.cursor()
		sql = "INSERT INTO sessions (sessionid, classannotations) VALUES (?, ?)"

		if self.active_session(db):
			self.update_session(db, annotated_tokens)
		else:
			buttonstring = json.dumps(annotated_tokens)
			cur.execute(sql, (self.sessionid, buttonstring))
			db.commit()
		
		return self.sessionid

	def update_session(self, db, annotated_tokens):
		'''
		Updates the value of classannotations in the sessions table given a sessionid
		'''
		cur = db.cursor()
		sql = "UPDATE sessions SET classannotations=? WHERE sessionid=?"
		cur.execute(sql, (json.dumps(annotated_tokens), self.sessionid))
		db.commit()


	def get_annotation(self, db):
		'''
		Returns list of annotated tokens in the form of [[class1, token1], [class2, token2], ...]
		'''
		cur = db.cursor()
		sql = 'SELECT classannotations FROM sessions WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))

		result = cur.fetchone()
		return result if result is None else json.loads(result[0])


	def delete_class(self, db, classname):
		'''
		Deletes a button from a current session
		'''
		cur = db.cursor()
		sql = 'SELECT classannotations FROM sessions WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))


	def is_relation(self, db):
		cur = db.cursor()
		sql = 'SELECT active FROM relations WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))

		active = cur.fetchone()
		if active and active[0] == "true":
			return True

		return False

	def set_relation_mode(self, db, mode, firsttime=False):
		cur = db.cursor()
		sql = 'SELECT active FROM relations WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))

		active = cur.fetchone()
		if not active:
			sql = "INSERT INTO relations (sessionid, active) VALUES (?, ?)"
			cur.execute(sql, (self.sessionid, mode))
		else:
			sql = "UPDATE relations SET active=? WHERE sessionid=?"
			cur.execute(sql, (mode, self.sessionid))

		db.commit()

	def reset(self, db):
		sessionid = request.get_cookie('sessionid')

		cur = db.cursor()
		sql = 'DELETE FROM sessions WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))
		sql = 'DELETE FROM buttoncolours WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))
		sql = 'DELETE FROM relations WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))
		sql = 'DELETE FROM content WHERE sessionid=?'
		cur.execute(sql, (self.sessionid,))

		db.commit()

