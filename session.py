import uuid
import json
from bottle import response, request

def active_session(db, sessionid):
	'''
	Returns active
	'''
	cur = db.cursor()
	sql = 'SELECT * FROM sessions WHERE sessionid=?'
	cur.execute(sql, (sessionid,))

	return cur.fetchall()

def insert_session(db, annotated_tokens):
	'''
	INSSERTS class annotated data to a session
	'''

	cur = db.cursor()
	sql = "INSERT INTO sessions (sessionid, classannotations) VALUES (?, ?)"
	sessionid = request.get_cookie('sessionid')
	
	if active_session(db, sessionid):
		update_session(db, sessionid, annotated_tokens)
	else:
		
		buttonstring = json.dumps(annotated_tokens)
		cur.execute(sql, (sessionid, buttonstring))
		db.commit()
	

	# COOKIE IS SET HERE BUT IS DIFFERENT ELSE WHERE

	return sessionid

def update_session(db, sessionid, annotated_tokens):
	'''
	Updates the value of classannotations in the sessions table given a sessionid
	'''
	sessionid = request.get_cookie('sessionid')
	cur = db.cursor()
	sql = "UPDATE sessions SET classannotations=? WHERE sessionid=?"
	cur.execute(sql, (json.dumps(annotated_tokens), sessionid))
	db.commit()


def get_annotation(db, sessionid):
	'''
	Returns list of annotated tokens in the form of [[class1, token1], [class2, token2], ...]
	'''
	cur = db.cursor()
	sql = 'SELECT classannotations FROM sessions WHERE sessionid=?'
	cur.execute(sql, (sessionid,))

	result = cur.fetchone()
	return result if result is None else json.loads(result[0])


def delete_class(db, sessionid, classname):
	cur = db.cursor()
	sql = 'SELECT classannotations FROM sessions WHERE sessionid=?'
	cur.execute(sql, (sessionid,))

	db.commit()


