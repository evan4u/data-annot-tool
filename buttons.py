import random

from bottle import request
import json
from collections import OrderedDict
#from database import Database

class ClassButton:

	def __init__(self):
		print ("starting class button generator...")

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

	def add_button(self, class_name, random=True):
		self.button_names.append(class_name)
		#new_button = '<div class="buttonContainer"><div class="relationButtons '+class_name+'" onclick="classButtonHandler(this)">'+class_name+' <div class="relPulldown" onclick="showRelationList(this)">&#x25BC;<span class="relationList" >s</span></div>'
		div_left = '<div class="buttonContainer"><div class="relationButtons '+class_name+'" onclick="classButtonHandler(this)"">'+class_name+'</div>'
		div_right = '</div>'
		
		pull_down = '<div class="relPulldown" onclick="showRelationList(this)">&#x25BC;</div><div class="listContainer"><pre class="relationList"></pre></div>'
		button_html = div_left+pull_down+div_right

		self.button_data_html.append(button_html)

	def add_relation(self, _range, domain, relation):
		self.relations.append([_range, domain, relation])

	def get_html_format(self):
		return "".join(self.button_data_html)
		
	def output_relation_plain(self):
		_str = ""
		for relation in self.relations:
			_str += "%s\t%s\t%s\n"%(relation[0][0], relation[1][0], relation[2])
		return _str

