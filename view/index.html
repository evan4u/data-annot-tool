<!--
Author: Evan Bernardez, Macquarie University
-->
<!DOCTYPE html>
<html lang="en">
<head>
      <meta charset="utf-8">
      <title>Annotation Tool</title>

      <!-- CSS -->
      <link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/themes/base/jquery-ui.css">
      <link src="../css/jquery-ui.css" type="text/css">
      <link rel="stylesheet" type="text/css" href="../css/bootstrap-switch.min.css">
      <link rel="stylesheet" href="../css/styles.css">
      <link rel="stylesheet" href="../css/bootstrap.css">
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
                                          <li class="dropdown dropdown-submenu">
                                                <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" data-bind="event:{click: loadFileNames}" style=" padding-right:90px;" >Load</a>
                                                <ul class="dropdown-menu" data-bind="foreach: fileNames">
                                                      <li>
                                                            <a href="javascript:void(0);" onclick="return false" data-bind="text:$data, click: $parent.loadFile"> </a>
                                                      </li>
                                                      <li class="divider"></li>
                                                </ul>
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
                              <!-- Class Selection -->
                              <li class="dropdown" >
                                    <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">Class Selection <b class="caret"></b></a>
                                    <ul class="dropdown-menu" id="classList" >
                                          <li class="divider"></li>
                                          <li class="divider"></li>
                                          <li id="edit"> <a>Edit</a> </li>
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
                                                CONTENT GOES HERE
                                                 </div>
                                          </div>
                                    </div>
                              </div>
                               <div style="padding-left: 25px;" class="panel-heading">
                                    <h4 class="panel-title">&nbsp;</h4>
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
                                                      Result
                                                </a>
                                          </h4>
                                    </div>
                                    <div id="collapseThree" class="panel-collapse collapse">
                                          <div class="panel-body">
                                                <pre style="max-height:640px; overflow-y: scroll;" id="entity-result"></pre>
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
      <script src="../js_library/jquery-latest.min.js" type="text/javascript"></script>
      <script src="../js_library/jquery-ui.js" type="text/javascript"></script>
      <script src="../js_library/bootstrap.min.js" type="text/javascript"></script>
      <script src="../js_library/bootstrap-switch.min.js" type="text/javascript"></script>
      <script src="../js_library/jquery.mark.min.js" type="text/javascript"></script>

      <script src="../js_controller/global_variables.js"></script>
      <script src="../js_controller/class_button.js"></script>
      <script src="../js_controller/highlight.js"></script>
      <script src="../js_controller/main.js"></script>
      <style>mark{background:#eb7804; color:white;}#toggle-annot {background-color:red;}</style>
</body>
</html>
