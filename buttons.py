import random

from bottle import request
import json
from collections import OrderedDict
#from database import Database

class ClassButton:

	def __init__(self):
		print ("starting class button generator...")
		self.sessionid = request.get_cookie('sessionid')

	def add_button(self, db, class_name, bcolour, fcolour, random=True):
		buttons = self.get_buttons(db)
		colour = self.random_colour()
		
		sessionid = request.get_cookie('sessionid')
		cur = db.cursor()

		if buttons: # IF AN ACTIVE SESSION
			if class_name not in buttons:
				buttons.update({class_name: colour})
				sql = "UPDATE buttoncolours SET colour=? WHERE sessionid=?"
				cur.execute(sql, (json.dumps(buttons), sessionid))
		else:
			buttons = {'O': [245, 245, 245],class_name: colour,}

			sql = "INSERT INTO buttoncolours (sessionid, colour) VALUES (?, ?)"
			cur.execute(sql, (sessionid, json.dumps(buttons)))

		db.commit()


	def get_buttons(self, db):
		cur = db.cursor()
		sql = "SELECT * FROM buttoncolours WHERE sessionid=?"
		cur.execute(sql, (request.get_cookie('sessionid'),))

		buttons = cur.fetchone()
		
		if buttons:
			return json.loads(buttons[1])

		return None


	def delete_button(self, db, class_name):
		bcolour = self.get_buttons(db)

		if class_name in bcolour:
			del bcolour[class_name]
			#buttons.update(button)
			sql = "UPDATE buttoncolours SET colour=? WHERE sessionid=?"
			cur = db.cursor()
			cur.execute(sql, (json.dumps(bcolour), request.get_cookie('sessionid')))
			db.commit()


	def get_html_format(self, db):
		buttons = self.get_buttons(db)
		buttons_html = ""

		for key in sorted(buttons.keys()):
			value = buttons[key]
			bcol = self.rgb_format(value)
			fcol = self.rgb_format(self.choose_fcolour(value))
			if key is 'O':
				buttons_html = '<button class="classButtons '+key+'" style="width:100%; background-color:'+bcol+'; color:'+fcol+'; margin: 5px; border-radius: 4px; outline:none;" onclick="classButtonHandler(this)">'+key+'</button>' + buttons_html
			else:
				buttons_html += '<button class="classButtons '+key+'" style="width:100%; background-color:'+bcol+'; color:'+fcol+'; margin: 5px; border-radius: 4px; outline:none;" onclick="classButtonHandler(this)">'+key+'</button>'
		
		return buttons_html


	def rgb_format(self, col):
		return "rgb(%s,%s,%s)"%(col[0],col[1],col[2])

	def get_last_button_html(self):
		return self.last_button_added

	def random_colour(self):
		return [random.randint(0,255),random.randint(0,255),random.randint(0,255)]

	def choose_fcolour(self, bcolour):
		return [255,255,255] if self.is_dark(bcolour) else [0,0,0]

	def is_dark(self, colour):

		darkness = 1-(0.299*colour[0] + 0.587*colour[1] + 0.114*colour[2])/255
		return False if darkness < 0.5 else True



class RelationButton:
	button_names = []
	relations = []
	button_data_html = []

	def __init__(self):
		print ("starting relation button generator...")
		self.sessionid = request.get_cookie('sessionid')

	def add_button(self, db, class_name, random=True):
		#relations = self.get_buttons(db)
		#self.button_names.append(class_name)
		
		#div_left = '<div class="buttonContainer"><div class="relationButtons '+class_name+'" onclick="classButtonHandler(this)"">'+class_name+'</div>'
		#div_right = '</div>'
		
		#pull_down = '<div class="relPulldown" onclick="showRelationList(this)">&#x25BC;</div><div class="listContainer"><pre class="relationList"></pre></div>'
		#button_html = div_left+pull_down+div_right

		#self.button_data_html.append(button_html)

		## 
		self.add_relation(db, -1, -1, class_name)

		

	def get_relations(self, db):
		cur = db.cursor()
		sql = "SELECT * FROM relations WHERE sessionid=?"
		cur.execute(sql, (request.get_cookie('sessionid'),))

		buttons = cur.fetchone()
		
		if buttons:
			return json.loads(buttons[1])

		return None

	def add_relation(self, db, _range, domain, relation):
		#self.relations.append([_range, domain, relation])
		sessionid = request.get_cookie('sessionid')
		cur = db.cursor()
		sql = "INSERT INTO relations (sessionid, domain, range, relation) VALUES (?,?,?,?)"
		cur.execute(sql, (sessionid, json.dumps(_range), json.dumps(domain), relation))
		db.commit()

	def get_relations(self, db, relation_name=None):
		sessionid = request.get_cookie('sessionid')
		cur = db.cursor()
		sql = None
		if relation_name:
			sql = "SELECT * FROM relations WHERE sessionid=? AND relation=? ORDER BY range"
			cur.execute(sql, (sessionid, relation_name))
		else:
			sql = "SELECT * FROM relations WHERE sessionid=? ORDER BY range"
			cur.execute(sql, (sessionid,))

		results = cur.fetchall()

		if results:
			#return results # includes session
			relations = []
			for result in results:
				if result[1] != "-1":
					# THE ORDER IS NEEDED FOR [domain, range, relation] 
					relations.append([result[2],result[1],result[3]]) 

			return relations

		return None


	def get_relation_buttons(self, db):
		sessionid = request.get_cookie('sessionid')
		cur = db.cursor()
		sql = "SELECT relation FROM relations WHERE sessionid=? AND domain=? AND range=? ORDER BY relation"
		cur.execute(sql, (sessionid, -1, -1))

		results = cur.fetchall()

		if results:
			return [_cls[0] for _cls in results]

		return None



	def get_html_format(self, db):
		#return "".join(self.button_data_html)

		rbuttons = self.get_relation_buttons(db)
		button_html = ""

		if rbuttons:
			for button in rbuttons:
				div_left = '<div class="buttonContainer"><div class="relationButtons '+button+'" onclick="classButtonHandler(this)"">'+button+'</div>'
				div_right = '</div>'
				pull_down = '<div class="relPulldown" onclick="showRelationList(this)">&#x25BC;</div><div class="listContainer"><pre class="relationList"></pre></div>'
				button_html += div_left+pull_down+div_right


		return button_html

	def output_relation_plain(self, db):
		_str = ""
		relations = self.get_relations(db)
		if relations:
			for relation in relations:
				if relation[1] != "-1":
					_range = json.loads(relation[0])[0]
					domain = json.loads(relation[1])[0]
					_str += "%s\t%s\t%s\n"%(_range, domain, relation[2])

		print ("str")
		print (_str)
		return _str

