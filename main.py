__author__ = 'Evan Bernardez'

from bottle import Bottle, template, static_file, request, response, HTTPError, redirect, get

application = Bottle()

@application.route('/')
def index():
	return template('views/index')


@application.route('/css/<filepath:re:.*\.css>')
def css(filepath):
    return static_file(filepath, root="css")

@application.route('/js_controller/<filepath:re:.*\.js>')
def js_controller(filepath):
    return static_file(filepath, root="js_controller")


@application.route('/js_library/<filepath:re:.*\.js>')
def js_library(filepath):
    return static_file(filepath, root="js_library")


if __name__ == '__main__':
    application.run(debug=True, port=8010)