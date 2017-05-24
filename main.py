'''
Server
'''

__author__ = 'Evan Bernardez'

import os
from processor import FileProcessor
from buttons import ClassButton, RelationButton
from bottle import Bottle, template, static_file, request, response, HTTPError, redirect, get
import re

from database import Database
import session

application = Bottle()

COOKIE_NAME = 'sessionid'

info = {
    'filename': "no file uploaded",
    'content': "Upload something: File -> Upload",
    'result': "",
    'buttons': '<button class="classButtons O" style="width:100%; background-color:rgb(255,255,255); color:rgb(0,0,0); margin: 5px; border-radius: 4px; outline:none;" onclick="classButtonHandler(this)">O</button>'
}


relation_button = RelationButton()

@application.route('/')
def index():

    if request.get_cookie(COOKIE_NAME) is None:
        print ('is no cookie')
        import uuid
        sessionid = str(uuid.uuid1())
        response.set_cookie(COOKIE_NAME, sessionid)

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
    '''
    Returns an Object containing:
        'buttons': 2 array of containing [class, token] i.e [['Person', 'Evan'], ['O', 'is']]
    '''
    db = Database()
    class_button = ClassButton()

    data = request.json
    if data['className']:
        class_button.add_button(db, data['className'], data['bcolour'], data['fcolour'])
        info['buttons'] = class_button.get_html_format(db)
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
    fproc = FileProcessor()
    return fproc.output_annotated_str() + '\n' + relation_button.output_relation_plain()
    
@application.route('/update_annotation', method='POST')
def update_annotation():
    fproc = FileProcessor()
    class_button = ClassButton()
    data = request.json
    class_name = data['name']
    words = data['words']

    db = Database()
    fproc.update_annotation(db, class_name, words)

    return fproc.token_to_span_colour(db, class_button)

@application.route('/update_relation', method='POST')
def update_relation():
    data = request.json
    relation_button.add_relation(data['domain'], data['range'], data['relation'])
    return {'output': relation_button.output_relation_plain(), 'relations': relation_button.relations}



@application.route('/button_delete', method='POST')
def update_annotation():
    db = Database()
    fproc = FileProcessor()
    class_button = ClassButton()

    data = request.json
    class_name = data['name']

    class_button.delete_button(db, class_name)
    fproc.delete_annotation(db, class_name)
    return {'content':fproc.token_to_span_colour(db, class_button), 'buttons': class_button.get_html_format(db)}


@application.route('/upload', method='POST')
def do_upload():
    db = Database()
    fproc = FileProcessor()
    class_button = ClassButton()

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
            is_annot_file = file_raw[i+1] == 68 or 77
            break
    
    if is_annot_file:
        classes = fproc.parse_annotated_text(db, file_content)

        for cls in classes:
            if cls != 'O':
                print ("before adding")
                print (db)
                class_button.add_button(db, cls, [255,0,0], [255,255,255])

        print ('is_annot_file')
        print (session.get_annotation(db, request.get_cookie('sesssiond')))
        info['buttons'] = class_button.get_html_format(db)
        output_content = fproc.token_to_span_colour(db, class_button)
        info['content'] = output_content
    else:
        info['content'] = fproc.str_to_span(file_content)
        info['result'] = fproc.str_to_default_annotation(file_content, db)
        info['buttons'] = ""

    redirect('/')


@application.route('/save', method='POST')
def save_file():
    fproc = FileProcessor()
    data = request.json
    save_path = './annotated_results'
    complete_name = os.path.join(save_path, data['filename'])
    text_file = open(complete_name, "w")
    text_file.write(fproc.output_annotated_str(db))
    text_file.close()


@application.route('/switch_to_relation', method='GET')
def switch_to_relation():
    buttons = relation_button.get_html_format()
    print ('relation buttons')
    print (buttons)
    return  {'buttons': buttons}


@application.route('/switch_to_class', method='GET')
def switch_to_class():
    fproc = FileProcessor()
    class_button = ClassButton()

    buttons = class_button.get_html_format(db)
    content = fproc.token_to_span_colour(db, class_button)
    return  {'content': content, 'buttons': buttons}

if __name__ == '__main__':
    application.run(debug=True, port=8010)