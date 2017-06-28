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
import uuid

application = Bottle()

COOKIE_NAME = 'sessionid'




@application.route('/')
def index():
    fproc = FileProcessor()
    db = Database()

    button = None
    mode = "Class"

    # MIGHT NOT NEED

    sessionid = str(uuid.uuid1())
    if request.get_cookie(COOKIE_NAME) is None:
        response.set_cookie(COOKIE_NAME, sessionid)


    if fproc.is_relation(db):
        print ("goes rel")
        button = RelationButton()
        mode = "Relation"
    else:
        print ("goes class")
        button = ClassButton()

    class_button = ClassButton()
    info = {
        'filename': fproc.get_filename(db),
        'content': fproc.token_to_span_colour(db, class_button),
        'result': fproc.output_annotated_str(db),
        'buttons': button.get_html_format(db),
        'mode': mode
    } 

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
        return {'buttons': class_button.get_html_format(db)}


@application.route('/add_relation_button', method='POST')
def add_relation_button():
    data = request.json
    db = Database()
    relation_button = RelationButton()

    rels = relation_button.get_relation_buttons(db)
    if rels:
        if data['className'] not in rels:
            print (relation_button.get_relation_buttons(db))
            relation_button.add_button(db, data['className'])
            return {'buttons': relation_button.get_html_format(db)}
    else:
        relation_button.add_button(db, data['className'])
        return {'buttons': relation_button.get_html_format(db)}


@application.route('/annotated_results', method='GET')
def default_annotation():
    fproc = FileProcessor()
    db = Database()
    relation_button = RelationButton()

    return fproc.output_annotated_str(db) + '\n' + relation_button.output_relation_plain(db)
    
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
    db = Database()

    relation_button = RelationButton()
    relation_button.add_relation(db, data['domain'], data['range'], data['relation'])
    print ([data['domain'], data['range'], data['relation']])
    print (relation_button.get_relations(db))
    return {'output': relation_button.output_relation_plain(db), 'relations': relation_button.get_relations(db)}

@application.route('/get_relations', method='GET')
def get_relations():
    db = Database()
    relation_button = RelationButton()
    
    return {'relations':relation_button.get_relations(db)}


@application.route('/button_delete', method='POST')
def delete_button():
    db = Database()
    fproc = FileProcessor()
    class_button = ClassButton()
    data = request.json
    class_name = data['name']

    if fproc.is_relation(db):
        relation_button = RelationButton()
        relation_button.delete_button(db, class_name)
        return {'content':fproc.token_to_span_colour(db, class_button), 'buttons': relation_button.get_html_format(db)}
    else:
        class_button.delete_button(db, class_name)
        fproc.delete_annotation(db, class_name)
        return {'content':fproc.token_to_span_colour(db, class_button), 'buttons': class_button.get_html_format(db)}



@application.route('/upload', method='POST')
def do_upload():
    db = Database()
    fproc = FileProcessor()
    class_button = ClassButton()
    fproc.reset(db)

    upload = request.files.get('upload')
    name, ext = os.path.splitext(upload.filename)
    filename = name+ext


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
    
    content = ""
    results = ""

    if is_annot_file:
  
        # SPLIT TO CLASS DATA AND RELATION DATA
        file_content_split = file_content.split("\n\n")

        classes = fproc.parse_annotated_text(db, file_content_split[0])

        for cls in classes:
            if cls != 'O':
                class_button.add_button(db, cls, [255,0,0], [255,255,255])


        relation_button = RelationButton()
        relations = []
        if len(file_content_split) > 1:
            relations = fproc.parse_annotated_text_relations(db, file_content_split[1], relation_button)

        output_content = fproc.token_to_span_colour(db, class_button)
        content = output_content

    else:
        content = fproc.str_to_span(file_content)
        results = fproc.str_to_default_annotation(db, file_content)


    fproc.store_content(db, name, content)

    info = {
        'filename': filename,
        'content': content,
        'result': "",
        'buttons': class_button.get_html_format(db)
    } 


    redirect('/')


@application.route('/reset')
def reset():
    db = Database()
    fproc = FileProcessor()
    fproc.reset(db)
    redirect('/')

@application.route('/save', method='POST')
def save_file():
    db = Database()
    fproc = FileProcessor()
    relation_button = RelationButton()

    data = request.json
    save_path = './annotated_results'
    complete_name = os.path.join(save_path, data['filename'])
    
    text_file = open(complete_name, "w")
    text_file.write(fproc.output_annotated_str(db) + '\n' + relation_button.output_relation_plain(db))
    text_file.close()


@application.route('/switch_to_relation', method='GET')
def switch_to_relation():
    db = Database()
    relation_button = RelationButton()
    fproc = FileProcessor()

    buttons = relation_button.get_html_format(db)
    fproc.set_relation_mode(db, "true")
    return  {'buttons': buttons}


@application.route('/switch_to_class', method='GET')
def switch_to_class():
    fproc = FileProcessor()
    class_button = ClassButton()
    db = Database()

    buttons = class_button.get_html_format(db)
    content = fproc.token_to_span_colour(db, class_button)
    fproc.set_relation_mode(db, "false")
    return  {'content': content, 'buttons': buttons}

@application.route('/get_named_entity', method='POST')
def get_named_entity():
    fproc = FileProcessor()
    class_button = ClassButton()
    db = Database()

    annotations = fproc.get_annotation(db)
    annotations = [annot[1] for annot in annotations]
    text_content =  " ".join(annotations) 
    content = fproc.token_to_span_colour(db, class_button, text_str=text_content)
    fproc.set_relation_mode(db, "true")
    return  {'content': content}

if __name__ == '__main__':
    application.run(debug=True, port=8010)