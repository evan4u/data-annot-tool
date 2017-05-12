'''
Server
'''

__author__ = 'Evan Bernardez'

import os
from processor import FileProcessor
from buttons import ClassButton, RelationButton
from bottle import Bottle, template, static_file, request, response, HTTPError, redirect, get
import re

application = Bottle()

info = {
    'filename': "no file uploaded",
    'content': "Upload something: File -> Upload",
    'result': "",
    'buttons': '<button class="classButtons O" style="width:100%; background-color:rgb(255,255,255); color:rgb(0,0,0); margin: 5px; border-radius: 4px; outline:none;" onclick="classButtonHandler(this)">O</button>'
}


fproc = FileProcessor()
class_button = ClassButton()
relation_button = RelationButton()

@application.route('/')
def index():
    return template('views/index', info)


@application.route('/css/<filepath:re:.*\.css>')
def css(filepath):
    return static_file(filepath, root="css")

@application.route('/images/<filepath:re:.*\.png>')
def images(filepath):
    return static_file(filepath, root="images")


@application.route('/js_controller/<filepath:re:.*\.js>')
def js_controller(filepath):
    return static_file(filepath, root="js_controller")


@application.route('/js_library/<filepath:re:.*\.js>')
def js_library(filepath):
    return static_file(filepath, root="js_library")


@application.route('/default_annotation', method='POST')
def default_annotation():
    data = request.json
    if data['className'] not in class_button.button_bcolour.keys():
        class_button.add_button(data['className'], data['bcolour'], data['fcolour'])
        info['buttons'] = class_button.get_html_format()
        return {'buttons': info['buttons']}


@application.route('/add_relation_button', method='POST')
def add_relation_button():
    data = request.json
    if data['className'] not in relation_button.button_names:
        relation_button.add_button(data['className'])
        info['buttons'] = relation_button.get_html_format()
        return {'buttons': info['buttons']}


@application.route('/annotated_results', method='GET')
def default_annotation():
    return fproc.output_annotated_str() + '\n' + relation_button.output_relation_plain()
    
@application.route('/update_annotation', method='POST')
def update_annotation():
    data = request.json
    class_name = data['name']
    words = data['words']
    fproc.update_annotation(class_name, words)

    return fproc.token_to_span_colour(class_button)

@application.route('/update_relation', method='POST')
def update_relation():
    data = request.json
    relation_button.add_relation(data['domain'], data['range'], data['relation'])
    return {'output': relation_button.output_relation_plain(), 'relations': relation_button.relations}



@application.route('/button_delete', method='POST')
def update_annotation():
    data = request.json
    class_name = data['name']
    class_button.delete_button(class_name)
    fproc.delete_annotation(class_name)
    return {'content':fproc.token_to_span_colour(class_button), 'buttons': class_button.get_html_format()}


@application.route('/upload', method='POST')
def do_upload():
    upload = request.files.get('upload')
    name, ext = os.path.splitext(upload.filename)
    filename = name+ext
    info['filename'] = filename

    data = request.files.upload
    file_raw = data.file.read()
    file_content = file_raw.decode("utf-8")
    
    if ext not in ('.docx', '.pdf', '.doc', '.txt'):
        filename = "File uploaded was not valid"

    # CHECKS WHETHER THE FILE IS ANNOTATED DATA OR TEXT FILE
    is_annot_file = False
    for i in range(len(file_raw)):
        if file_raw[i] == 9:
            print (file_raw[i+1])
            is_annot_file = file_raw[i+1] == 68 or 77
            break


    if is_annot_file:
        classes = fproc.parse_annotated_text(file_content)
        for cls in classes:
            if cls != 'O' and cls not in class_button.button_bcolour.keys():
                class_button.add_button(cls, [255,0,0], [255,255,255])
        info['buttons'] = "".join(class_button.button_data_html)
        output_content = fproc.token_to_span_colour(class_button)
        info['content'] = output_content
    else:
        info['content'] = fproc.str_to_span(file_content)
        info['result'] = fproc.str_to_default_annotation(file_content)
        info['buttons'] = ""

    redirect('/')


@application.route('/save', method='POST')
def save_file():
    data = request.json
    save_path = './annotated_results'
    complete_name = os.path.join(save_path, data['filename'])
    text_file = open(complete_name, "w")
    text_file.write(fproc.output_annotated_str())
    text_file.close()


@application.route('/switch_to_relation', method='GET')
def switch_to_relation():
    buttons = relation_button.get_html_format()
    print ('relation buttons')
    print (buttons)
    return  {'buttons': buttons}


@application.route('/switch_to_class', method='GET')
def switch_to_class():
    buttons = class_button.get_html_format()
    content = fproc.token_to_span_colour(class_button)
    return  {'content': content, 'buttons': buttons}

if __name__ == '__main__':
    application.run(debug=True, port=8010)