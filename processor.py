
import nltk
import re
import json

from bottle import request, response

import session

class FileProcessor:

	annotated_tokens = []

	def __init__(self):
		print ("starting file processor...")

	def save_file(self, str):
		print ("saving...")

	def load_file(self, str):
		print ("loading...")


	def str_to_default_annotation(self, upload_str, db=None):
		'''
		Returns output string to a default value
		'''
		self.annotated_tokens = []
		tokens = nltk.word_tokenize(upload_str)
		output_str = ""
		for token in tokens:
			self.annotated_tokens.append(['O', token])
			output_str += 'O\t%s\n'%token

		# INSERST TO DB
		session.insert_session(db, self.annotated_tokens)

		return output_str


	def update_annotation(self, db, class_name, words):
		'''
		Returns output string to a default value and updates the annotated data
		'''

		#json.loads('["foo", {"bar":["baz", null, 1.0, 2]}]')

		sessionid = request.get_cookie('sessionid')
		new_annotated_tokens = []
		output_str = ""

		annotated_tokens = session.get_annotation(db, sessionid)
		max_size = len(annotated_tokens)
		i = 0
		while i < max_size:
			found_word = False
			for word in words:
				word_split = word.split(" ")
				size = len(word_split)
				tokens = [token[1] for token in annotated_tokens[i:i+size]]
				if tokens == word_split or word == annotated_tokens[i][1]:
					found_word = True
					annotated_tokens[i][0] = class_name
					output_str += "%s\t%s\n"%(annotated_tokens[i][0], word)
					if class_name == "O":
						for w in word_split:
							new_annotated_tokens.append([class_name, w])
					else:
						new_annotated_tokens.append([class_name, word])
						i += size-1
					break

			if not found_word:
				output_str += "%s\t%s\n"%(annotated_tokens[i][0], annotated_tokens[i][1])
				new_annotated_tokens.append([annotated_tokens[i][0], annotated_tokens[i][1]])	
			i += 1

		self.annotated_tokens = new_annotated_tokens
		session.update_session(db, sessionid, new_annotated_tokens)

		return output_str

	def output_annotated_str(self, relation_annots=None):
		'''
		Returns annotated output in string format for saving and displaying
		'''
		output_str = ""
		token_pos = 1
		for token in self.annotated_tokens:
			output_str += "%s\t%s\t%s\n"%(token[0], token_pos, token[1])
			token_pos += 1

		#if relation_annots:
		#	for token in relation_annots:


		return output_str


	def token_to_span_colour(self, db, class_button):
		_str = ""
		get_button_bcolour = class_button.get_button_bcolour()
		get_button_fcolour = class_button.get_button_fcolour()
		token_pos = 1

		sessionid = request.get_cookie('sessionid')
		annotated_tokens = session.get_annotation(db, sessionid)
		print (annotated_tokens)

		for token in annotated_tokens:
			bcolour = class_button.rgb_format(get_button_bcolour[token[0]])
			fcolour = class_button.rgb_format(get_button_fcolour[token[0]])
			_str += "<span class='someToken' name='"+str(token_pos)+"' style='color:" + fcolour+ "; background-color: "+bcolour + "'>"+token[1]+"</span> "
			token_pos += 1
		return _str

	def str_to_span(self, str):
		tokens = nltk.word_tokenize(str)
		output_str = ""
		for token in tokens:
			output_str += "<span>%s</span> "%token

		return output_str


	def delete_annotation(self, class_name):
		'''
		replances classes with default i.e O
		'''
		for i in range(len(self.annotated_tokens)):
			if self.annotated_tokens[i][0] == str(class_name):
				self.annotated_tokens[i][0] = "O"


	def parse_annotated_text(self, db, upload_str):
		'''
		parses annotated data and returns the new classes created
		'''
		classes = set()
		tmp_str_arr = upload_str.split('\n')
		str_arr = []
		for str in tmp_str_arr:
			str_arr.append(re.split('\t\d+\t', str))

		self.annotated_tokens = str_arr[:-1]
		sessionid = session.insert_session(db, self.annotated_tokens)
		#print (session.get_annotation(db, sessionid))

		for token in self.annotated_tokens:
			classes.add(token[0])

		return classes



