
import nltk
import re
import json

from bottle import request, response

import session

class FileProcessor:


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
		annotated_tokens = []
		tokens = nltk.word_tokenize(upload_str)
		output_str = ""
		for token in tokens:
			annotated_tokens.append(['O', token])
			output_str += 'O\t%s\n'%token

		# INSERST TO DB
		session.insert_session(db, annotated_tokens)

		return output_str


	def update_annotation(self, db, class_name, words):
		'''
		Returns output string to a default value and updates the annotated data
		'''

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

		annotated_tokens = new_annotated_tokens
		session.update_session(db, sessionid, new_annotated_tokens)

		return output_str

	def output_annotated_str(self, db, relation_annots=None):
		'''
		Returns annotated output in string format for saving and displaying
		'''
		output_str = ""
		token_pos = 1
		annotated_tokens = session.get_annotation(db, request.get_cookie('sessionid'))

		for token in annotated_tokens:
			output_str += "%s\t%s\t%s\n"%(token[0], token_pos, token[1])
			token_pos += 1

		return output_str


	def token_to_span_colour(self, db, class_button, text_str=None):
		_str = ""
		colours = class_button.get_buttons(db)
		token_pos = 1
		sessionid = request.get_cookie('sessionid')
		annotated_tokens = session.get_annotation(db, sessionid)

		named_entities = []
		if text_str:
			named_entities = self.get_named_entities(text_str)

		if colours is not None:
			for token in annotated_tokens:
				bcol = colours[token[0]]
				bcolour = class_button.rgb_format(bcol)
				fcolour = class_button.rgb_format(class_button.choose_fcolour(bcol))

				if token[1] in named_entities:
					_str += "<span class='someToken' name='"+str(token_pos)+"' style='color:" + fcolour+ "; background-color: "+bcolour + "'><strong><u>"+token[1]+"</u></strong></span> "
				else:
					_str += "<span class='someToken' name='"+str(token_pos)+"' style='color:" + fcolour+ "; background-color: "+bcolour + "'>"+token[1]+"</span> "
				
				token_pos += 1
		else: # no buttons generated yet
			for token in annotated_tokens:
				if token[1] in named_entities:
					_str += "<span><strong><u>%s</u></strong></span> "%token[1]
				else:
					_str += "<span>%s</span> "%token[1]

		return _str

	def str_to_span(self, str):
		tokens = nltk.word_tokenize(str)
		output_str = ""
		for token in tokens:
			output_str += "<span>%s</span> "%token

		return output_str


	def delete_annotation(self, db, class_name):
		'''
		replaces classes with default i.e O
		'''
		sessionid = request.get_cookie('sessionid')
		annotated_tokens = session.get_annotation(db, sessionid)
		
		if annotated_tokens:
			for i in range(len(annotated_tokens)):
				if annotated_tokens[i][0] == str(class_name):
					annotated_tokens[i][0] = "O"

		session.update_session(db, sessionid, annotated_tokens)


	def parse_annotated_text(self, db, upload_str):
		'''
		parses annotated data and returns the new classes created
		'''
		classes = set()
		tmp_str_arr = upload_str.split('\n')
		str_arr = []
		for _str in tmp_str_arr:
			str_arr.append(re.split('\t\d+\t', _str))

		annotated_tokens = str_arr[:-1]
		sessionid = session.insert_session(db, annotated_tokens)

		for token in annotated_tokens:
			classes.add(token[0])

		return classes


	def get_named_entities(self, text_str):
		'''
		Returns an array containing the named entities of a string
		Process:
			- POS tagging
			- Extract Named Entities
		'''		

		# POS tagging
		parse_tree = nltk.ne_chunk(nltk.tag.pos_tag(text_str.split()), binary=True)
		named_entities = []

		# extracts named entities
		for t in parse_tree.subtrees():
		    if t.label() == 'NE':
		        _str = ""
		        for tok in t:
		            _str += tok[0]+" "

		        named_entities.append(_str[:-1]) 

		return named_entities

