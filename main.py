__author__ = 'Evan Bernardez'

import os
from processor import FileProcessor
from buttons import ButtonGenerator
from bottle import Bottle, template, static_file, request, response, HTTPError, redirect, get
import re

application = Bottle()

info = {
    'filename': "no file uploaded",
    'content': "Upload something: File -> Upload",
    'result': "",
    'buttons': ""
}


fproc = FileProcessor()
bgen = ButtonGenerator()

@application.route('/')
def index(): 
    return template('views/index', info)


@application.route('/css/<filepath:re:.*\.css>')
def css(filepath):
    return static_file(filepath, root="css")

@application.route('/images/<filepath:re:.*\.png>')
def images(filepath):
    print("hereree")
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
    if data['className'] not in bgen.button_bcolour.keys():
        bgen.add_button(data['className'], data['bcolour'], data['fcolour'])
        info['buttons'] = bgen.get_html_format()
        response.set_header('Location', '/')
        return bgen.get_last_button_html()

@application.route('/annotated_results', method='GET')
def default_annotation():
    return fproc.output_annotated_str()
    
@application.route('/update_annotation', method='POST')
def update_annotation():
    data = request.json
    class_name = data['name']
    words = data['words']
    fproc.update_annotation(class_name, words)


    response.set_header('Location', '/')
    return fproc.token_to_span_colour(bgen)


@application.route('/button_delete', method='POST')
def update_annotation():
    data = request.json
    class_name = data['name']
    bgen.delete_button(class_name)
    fproc.delete_annotation(class_name)
    return fproc.token_to_span_colour(bgen)


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
        return "Not a valid file extension"

    # CHECKS WHETHER THE FILE IS ANNOTATED DATA OR TEXT FILE
    is_annot_file = False
    for i in range(len(file_raw)):
        if file_raw[i] == 9:
            is_annot_file = file_raw[i+1] == 68
            break

    if is_annot_file:
        classes = fproc.parse_annotated_text(file_content)
        for cls in classes:
            if cls != 'O' and cls not in bgen.button_bcolour.keys():
                bgen.add_button(cls, [255,0,0], [255,255,255])

        info['buttons'] = "".join(bgen.button_data_html)
        output_content = fproc.token_to_span_colour(bgen)
        info['content'] = output_content
    else:
        info['content'] = fproc.str_to_span(file_content)
        info['result'] = fproc.str_to_default_annotation(file_content)
        info['buttons'] = ""

    response.set_header('Location', '/')
    return template('views/index', info)


@application.route('/save', method='POST')
def save_file():
    data = request.json
    save_path = './annotated_results'
    complete_name = os.path.join(save_path, data['filename'])
    text_file = open(complete_name, "w")
    text_file.write(fproc.output_annotated_str())
    text_file.close()


if __name__ == '__main__':
    application.run(debug=True, port=8010)