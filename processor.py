
import nltk

class FileProcessor:

	annotated_tokens = []

	def __init__(self):
		print ("starting file processor...")

	def save_file(self, str):
		print ("saving...")

	def load_file(self, str):
		print ("loading...")


	def str_to_default_annotation(self, str):
		'''
		Returns output string to a default value
		'''
		tokens = nltk.word_tokenize(str)
		output_str = ""
		for token in tokens:
			self.annotated_tokens.append(['O', token])
			output_str += 'O\t%s\n'%token

		return output_str


	def update_annotation(self, class_name, words):
		'''
		Returns output string to a default value and updates the annotated data
		'''
		new_annotated_tokens = []
		output_str = ""
		max_size = len(self.annotated_tokens)
		i = 0
		while i < max_size:
			found_word = False
			for word in words:
				word_split = word.split(" ")
				size = len(word_split)
				tokens = [token[1] for token in self.annotated_tokens[i:i+size]]
				if tokens == word_split or word == self.annotated_tokens[i][1]:
					found_word = True
					self.annotated_tokens[i][0] = class_name
					output_str += "%s\t%s\n"%(self.annotated_tokens[i][0], word)
					if class_name == "O":
						for w in word_split:
							new_annotated_tokens.append([class_name, w])
					else:
						new_annotated_tokens.append([class_name, word])
						i += size-1
					break

			if not found_word:
				output_str += "%s\t%s\n"%(self.annotated_tokens[i][0], self.annotated_tokens[i][1])
				new_annotated_tokens.append([self.annotated_tokens[i][0], self.annotated_tokens[i][1]])	
			i += 1

		self.annotated_tokens = new_annotated_tokens
		return output_str

	def output_annotated_str(self):
		'''
		Returns annotated output in string format for saving and displaying
		'''
		output_str = ""
		for token in self.annotated_tokens:
			output_str += "%s\t%s\n"%(token[0], token[1])
		return output_str

	def token_to_span_colour(self, bgen):
		str = ""
		get_button_bcolour = bgen.get_button_bcolour()
		get_button_fcolour = bgen.get_button_fcolour()
		print (self.annotated_tokens)
		for token in self.annotated_tokens:
			bcolour = bgen.rgb_format(get_button_bcolour[token[0]])
			fcolour = bgen.rgb_format(get_button_fcolour[token[0]])
			str += "<span class='someToken' style='color:" + fcolour+ "; background-color: "+bcolour + "'>"+token[1]+"</span> "

		return str

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


	def parse_annotated_text(self, str):
		'''
		parses annotated data and returns the new classes created
		'''
		classes = set()
		str_split = str.split('\n')
		str_split = str_split[:-1]

		tmp_annotated_text = []

		for token in str_split:
			tmp = token.split('\t')
			classes.add(tmp[0])
			tmp_annotated_text.append([tmp[0], tmp[1].replace('\r', '')])

		self.annotated_tokens = tmp_annotated_text
		return classes



