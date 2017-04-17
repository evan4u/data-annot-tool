import random

class ButtonGenerator:
	button_bcolour = {"O": [255, 255, 255]}
	button_fcolour = {"O": [0, 0, 0]}
	button_data_html = ['<button class="classButtons O" style="width:100%; background-color:rgb(255,255,255); color:rgb(0,0,0); margin: 5px; border-radius: 4px; outline:none;" onclick="classButtonHandler(this)">O</button>']
	last_button_added = button_data_html[0]
	word_class = []

	def __init__(self):
		print ("starting button generator...")

	def add_button(self, className, bcolour, fcolour, random=True):
		self.button_bcolour[className] = self.random_colour() if random==True else bcolour
		self.button_fcolour[className] = self.choose_fcolour(bcolour)
		new_button = '<button class="classButtons '+className+'" style="width:100%; background-color:'+self.rgb_format(self.button_bcolour[className])+'; color:'+self.rgb_format(self.button_fcolour[className])+'; margin: 5px; border-radius: 4px; outline:none;" onclick="classButtonHandler(this)">'+className+'</button>'
		
		self.button_data_html.append(new_button)
		self.last_button_added = new_button


	def delete_button(self, class_name):
		if class_name in self.button_bcolour:
			del self.button_bcolour[class_name]
			del self.button_fcolour[class_name]


	def get_html_format(self):
		return "".join(self.button_data_html)


	def rgb_format(self, col):
		return "rgb(%s,%s,%s)"%(col[0],col[1],col[2])

	def get_last_button_html(self):
		return self.last_button_added

	def get_button_bcolour(self):
		return self.button_bcolour

	def get_button_fcolour(self):
		return self.button_fcolour

	def random_colour(self):
		return [random.randint(0,255),random.randint(0,255),random.randint(0,255)]

	def choose_fcolour(self, bcolour):
		return [255,255,255] if self.is_dark(bcolour) else [0,0,0]

	def is_dark(self, colour):
		darkness = 1-(0.299*colour[0] + 0.587*colour[1] + 0.114*colour[2])/255
		return False if darkness < 0.5 else True

