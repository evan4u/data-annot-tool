<!--
Author: Evan Bernardez, Macquarie University
-->
<!DOCTYPE html>
<html lang="en">
<head>
      <meta charset="utf-8">
      <title>Annotation Tool</title>

      <!-- CSS -->
      <link href="/css/jquery-ui.css" type="text/css">
      <link href="/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css">
      <link href="/css/styles.css" rel="stylesheet" type="text/css">
      <link href="/css/bootstrap.css" rel="stylesheet" type="text/css">

      
</head>
<body style="background-color: #c0c0c0;">

      <div id="main-container" style="width:100%;">
      <div class="settings-div">
            <nav class="navbar navbar-inverse" style="border-radius:0px; margin-bottom: 0;"role="navigation">
                  <!-- Brand and toggle get grouped for better mobile display -->
                  <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                              <span class="sr-only">Toggle navigation</span>
                              <span class="icon-bar"></span>
                              <span class="icon-bar"></span>
                              <span class="icon-bar"></span>
                        </button>
                        <span class="navbar-brand" style="color: white;"><span="display-4"><strong><i>Annotation Tool</i></strong> </span></span>
                  </div>

                  <!-- Collect the nav links, forms, and other content for toggling -->
                  <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav">
                           `   <li class="dropdown">
                                    <!-- FILE -->
                                    <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"> File <b class="caret"></b></a>
                                    <ul class="dropdown-menu" >
                                          <!-- SAVE SUBMENU -->
                                          <li><a href="javascript:void(0);" onclick="saveButton()">Save</a></li>
                                          <li class="divider"></li>
                                          <!-- LOAD SUBMENU -->
                                          <li>
                                                <a href="javascript:void(0);" id="upload">

                                                <form class="fileupload" action="/upload" method="post" enctype="multipart/form-data">
                                                <input hidden type="file" name="upload"/ id="uploadinput">Upload
                                                </form>

                                                </a>
                                          </li>
                                    </ul>
                              </li>
                              <!-- INPUT MODE MENU -->
                              <li class="dropdown" >
                                    <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">Annotation Mode <b class="caret"></b></a>
                                    <ul class="dropdown-menu" >
                                          <li> <a href="javascript:void(0);" data-bind="event:{click: changeToTextMode}">Entity</a> </li>
                                          <li class="divider"></li>
                                          <li> <a href="javascript:void(0);" data-bind="click: changeToSpeechMode">Relation</a> </li>
                                    </ul>
                              </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right">
                              <li><a href="http://github.com/evan4u"><strong><span data-bind="text: inputMode" style="color: white;"></span></strong>Evan Bernardez</a></li>
                        </ul>
                  </div><!-- /.navbar-collapse -->
            </nav>
      </div>


      
      <div class="results-div" >
                  <div class="container" style="width:100%; padding:0;" >
                        
                        <div class="panel panel-default" style="padding:5px; border:none; border-radius: 0; width:60%; float:left">
                              
                              <div style="padding-left: 5px;" class="panel-heading">
                                    <h4 class="panel-title">Annotation Area</h4>

                              </div>  
                                                 
                              <div id="collapseOne" class="panel-collapse collapse in"  style="height:350px;">
                                    <div class="panel-body">
                                          <div class="panel panel-default">
                                                <div class="panel-body context" style="height:320px; overflow-y: scroll;">
                                                {{!content}}
                                                 </div>
                                          </div>
                                    </div>
                              </div>
                               <div style="padding-left: 25px;" class="panel-heading">
                                    <h4 class="panel-title">File: <span style="font-weight:normal;">{{filename}} <span></h4>
                              </div>
                        </div>


                        <div class="panel panel-default" style="padding:5px; border:none; border-radius: 0; width:40%; float:left">      
                              <div style="padding-left: 25px;" class="panel-heading">
                                    <h4 class="panel-title">Class Selection</h4> 
                              </div>                   
                              <div style="height:350px;">
                                    <div class="panel-body">
                                          <div class="panel panel-default">
                                                <div  style="height:320px; overflow-y: scroll;">
                                                       <div id="buttonArea" class="form-group" style="padding:10px;">
                                                            <label for="classname">Add Class:</label>
                                                            <input type="text" class="form-control" id="classname" style="margin-bottom:10px;">
                                                             {{!buttons}}
                                                      </div>
                                                 </div>
                                          </div>
                                    </div>
                              </div>

                              <div style="padding: 7.5px;" class="panel-heading">
                                    <h4 class="panel-title">
                                    Delete Classes:
                                          <input id="toggle-annot" type="checkbox" name="my-checkbox" data-size="mini" >

                                    </h4>

                                   
                              </div>


                        </div>
                        </div>
                        <div>

                        <div class="panel-group" id="accordion">                              
                              <div class="panel panel-default" style="padding:5px; border:none; border-radius: 0">
                                    <div style="padding-left: 0;" class="panel-heading" style="border: none">
                                          <h4 class="panel-title">
                                                <a href="javascript:void(0);" class="accordion-toggle" data-toggle="collapse"  data-target="#collapseThree">
                                                      <span class="glyphicon glyphicon-plus"></span>
                                                      Results
                                                </a>
                                          </h4>
                                    </div>
                                    <div id="collapseThree" class="panel-collapse collapse">
                                          <div class="panel-body">
                                                <pre style="max-height:640px; overflow-y: scroll;" id="result">{{result}}</pre>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      </div>

           



      <form hidden id="myForm">
          <label for="search">Save as...</label>
          <input< type="text" id="textSave" name="q">
      </form>
      
      <!-- Bootstrap --><!-- Required to use AJAX and JQuery -->
      <script src="/js_library/jquery-latest.min.js" type="text/javascript"></script>
      <script src="/js_library/jquery-ui.js" type="text/javascript"></script>
      <script src="/js_library/bootstrap.min.js" type="text/javascript"></script>
      <script src="/js_library/bootstrap-switch.min.js" type="text/javascript"></script>
      <script src="/js_library/jquery.mark.min.js" type="text/javascript"></script>

      <script src="/js_controller/global_variables.js"></script>
      <script src="/js_controller/class_button.js"></script>
      <script src="/js_controller/highlight.js"></script>
      <script src="/js_controller/upload.js"></script>
      <script src="/js_controller/main.js"></script>
      <style>mark{background:#eb7804; color:white;}#toggle-annot {background-color:red;}</style>

      <script>

      </script>
</body>
</html>
