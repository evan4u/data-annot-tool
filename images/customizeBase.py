"""
customizeBase.py
(funnelweb.5.0) (C) 2016 Toshiba (Australia) Pty Ltd
"""

from config import config
from atrax.testcase import *
from subprocess import call

import glob
import time
import re

if os.name == 'nt':
    import win32com.client
    import win32api
    import win32con
    import win32gui
    import win32process

class CustomizeBase(UIA, Appearance):


    def setup(self):

        self.gui = None

        #Panel visibility mode
        self.mode_collapsed = 0
        self.mode_normalexpanded = 1
        self.mode_fullexpanded = 2

        #Panel action button IDs
        self.btnid_edit = 'customizeEdit'
        self.btnid_save = 'customizeSave'
        self.btnid_expand = 'customizeExpand'
        self.btnid_cancel = 'customizeCancel'

        #Panel tabs
        self.tab_currenttab = 'currentTab_tab'
        self.tab_features = 'features_tab'
        self.tab_layout = 'layout_tab'
        self.tab_featuresettings = 'currentFeature_tab'
        self.tab_about = 'about_tab'

        #feature edit toolbar buttons
        self.editbtn_lock = 'labelledby=custedit_btnlock;'
        self.editbtn_unlock = 'labelledby=custedit_btnunlock;'
        self.editbtn_delete = 'labelledby=custedit_btndelete;'
        self.editbtn_settings = 'labelledby=custedit_btnsettings;'

        #Private variables to control logic
        self.__firstdisplay = True
        self.__firstfeatures = True
        self.__panelWnd = None

        # zip package
        self.plugindir = os.path.join('c:\\', 'plugins')
        self.zippackage = os.path.join(self.plugindir, 'PreferencesPackages', 'customize' , 'customize.zip')

        # Call super
        super(CustomizeBase, self).setup()
        self.skipIf(self.fw5r1 or self.fw5r2, 'Customization not required for release')

        # enable customization plugin from device console
        device = self.deviceprefsgui()
        device.selectTab('Plug-in')
        cust = device.find(id = 'customize', type ='checkbox', timeout = 10)
        self.check(cust , 'customization checkbox not found in device console')
        cust.check()
        device.close()


    ''' Customization pane

        An alternative to the Print Preference GUI when one does not want to find features
        in the features carousel
    '''
    @property
    def custpane(self, **kwargs): #may not exist on other tabs
        return self.gui.find(type = 'pane' , name = 'Customize',timeout = 0.1)

    def dropslot(self, slot):
        if self.gui.find(id = 'dropslot'+slot , timeout = 0.1):
            return  self.gui.find(id = 'dropslot'+slot)
        elif self.custpane and len(slot.split('_')) == 2:
            x,y = slot.split('_')
            x,y = int(x), int(y)
            if self.custpane.find(row = x , col = y, type = 'dataitem', timeout = 1):
                return self.custpane.find(row = x , col = y, type = 'dataitem')
        else:
            return None

    def dialog(self, dlgid):
        # Convoluted way of finding auid for dialog open button
        # The order of the items in the dialog list is not always consistent
        self.log('Finding ID for %s'%(dlgid))
        row = self.gui.find(name = dlgid).row()

        openbuttonid = '%s_row_%s_cell_1'%(dlgid , row)
        self.check(self.gui.find(id = openbuttonid), '%s not found'%(dlgid))
        return self.gui.find(id = openbuttonid)

    ''' Features

    Features that you drag into the customization pane
    '''
    @property
    def AllTextBlack(self):
        return self.getFeature('AllTextBlack')

    @property
    def AuthenticationGroup(self):
        return self.getFeature('AuthenticationGroup')

    @property
    def BackCover(self):
        return self.getFeature('BackCover')

    @property
    def CakePassLaunchGroup(self):
        return self.getFeature('CakePassLaunchGroup')

    @property
    def Color(self):
        return self.getFeature('Color')

    @property
    def ColorBalance(self):
        return self.getFeature('ColorBalance')

    @property
    def CopyHandling(self):
        return self.getFeature('CopyHandling')

    @property
    def CustomImage(self):
        return self.getFeature('CustomImage', name='Custom Image')

    @property
    def CustomMargin(self):
        return self.getFeature('CustomMargin')

    @property
    def DSLauncher(self):
        return self.getFeature('DSLauncher')

    @property
    def DepartmentCode(self):
        return self.getFeature('DepartmentCode')

    @property
    def Destination(self):
        return self.getFeature('Destination')

    @property
    def Details(self):
        return self.getFeature('Details')

    @property
    def DistinguishThinLines(self):
        return self.getFeature('DistinguishThinLines')

    @property
    def DoEcoPrinting(self):
        return self.getFeature('DoEcoPrinting')

    @property
    def DuplexAdjustment(self):
        return self.getFeature('DuplexAdjustment')

    @property
    def FirstPageOnly(self):
        return self.getFeature('FirstPageOnly')

    @property
    def Folding(self):
        return self.getFeature('Folding')

    @property
    def FrontCover(self):
        return self.getFeature('FrontCover')

    @property
    def Halftone(self):
        return self.getFeature('Halftone')

    @property
    def HolePunch(self):
        return self.getFeature('HolePunch')

    @property
    def ImageAttribute(self):
        return self.getFeature('ImageAttribute')

    @property
    def ImageQualityType(self):
        return self.getFeature('ImageQualityType')

    @property
    def LetterHead(self):
        return self.getFeature('LetterHead')

    @property
    def NickName(self):
        return self.getFeature('NickName')

    @property
    def Nin1(self):
        return self.getFeature('Nin1')

    @property
    def NoPrintBlankPages(self):
        return self.getFeature('NoPrintBlankPages')

    @property
    def NumberOfCopies(self):
        return self.getFeature('NumberOfCopies')

    @property
    def Orientation(self):
        return self.getFeature('Orientation')

    @property
    def OverlayImageSettings(self):
        return self.getFeature('OverlayImageSettings')

    @property
    def OverlayLayering(self):
        return self.getFeature('OverlayLayering')

    @property
    def OverlayOccurance(self):
        return self.getFeature('OverlayOccurance')

    @property
    def OverlaysList(self):
        return self.getFeature('OverlaysList')

    @property
    def OverlaysSelect(self):
        return self.getFeature('OverlaysSelect')

    @property
    def PaperGroup(self):
        return self.getFeature('PaperGroup')

    @property
    def PosterPrint(self):
        return self.getFeature('PosterPrint')

    @property
    def PrintJob(self):
        return self.getFeature('PrintJob')

    @property
    def PrinterDarkness(self):
        return self.getFeature('PrinterDarkness')

    @property
    def ProjectCode(self):
        return self.getFeature('ProjectCode')

    @property
    def RedSealMode(self):
        return self.getFeature('RedSealMode')

    @property
    def Resolution(self):
        return self.getFeature('Resolution')

    @property
    def Rotate180(self):
        return self.getFeature('Rotate180')

    @property
    def SettingsButton(self):
        return self.getFeature('SettingsButton')

    @property
    def Smoothing(self):
        return self.getFeature('Smoothing')

    @property
    def Staple(self):
        return self.getFeature('Staple')

    @property
    def TonerSave(self):
        return self.getFeature('TonerSave')

    @property
    def VersionNumber(self):
        return self.getFeature('VersionNumber')

    @property
    def WatermarkAngle(self):
        return self.getFeature('WatermarkAngle')

    @property
    def WatermarkOccurance(self):
        return self.getFeature('WatermarkOccurance')

    @property
    def WatermarkPosition(self):
        return self.getFeature('WatermarkPosition')

    @property
    def WatermarkPrintStyle(self):
        return self.getFeature('WatermarkPrintStyle')

    @property
    def WatermarkSelect(self):
        return self.getFeature('WatermarkSelect')

    @property
    def WatermarkText(self):
        return self.getFeature('WatermarkText')

    @property
    def WatermarkTextColour(self):
        return self.getFeature('WatermarkTextColour')

    @property
    def WatermarkTextFont(self):
        return self.getFeature('WatermarkTextFont')

    @property
    def WatermarkTextFontSize(self):
        return self.getFeature('WatermarkTextFontSize')

    @property
    def WatermarkTextStyle(self):
        return self.getFeature('WatermarkTextStyle')

    @property
    def WatermarkTransparency(self):
        return self.getFeature('WatermarkTransparency')

    @property
    def _2SidePrinting(self):
        return self.getFeature('_2SidePrinting')

    @property
    def preview(self, **kwargs):
        return self.getFeature('preview', **kwargs)

    @property
    def TextBlock(self):
        #text blocks already on the page have the same aria properties - find only the parent of the one in customizepanel...
        return self.gui.find(name='CustomizePanel').find(ariaproperties='labelledby=TextBlock;').getParent()

    @property
    def CustomImage(self):
        return self.gui.find(name='CustomizePanel').find(ariaproperties='labelledby=CustomImage;').getParent()

    @property
    def HorizontalLine(self):
        return self.gui.find(name='CustomizePanel').find(ariaproperties='labelledby=HorizontalLine;').getParent()


    def getFeature(self, featureId, **kwargs):
        if not self.gui:
            self.gui = self.uia.uia().searchwindow('Print Preferences')

        if kwargs:
            return self.gui.find(**kwargs)
        else:
            return self.gui.find(ariaproperties='labelledby='+featureId+';', **kwargs)


    def savePanel(self, action='OK'):
        # before saving, delete the plugins
        if os.path.exists(self.plugindir):
            shutil.rmtree(self.plugindir)

        # save
        if self.getPanelVisibilityMode() == self.mode_collapsed :
            self.gui.find(id = 'togglePanel').invoke()
        self.gui.find(id = self.btnid_save).invoke()
        self.gui.find(name = 'OK', id = '1').invoke()
        self.wait()

        # check package is successfully created
        self.check(os.path.exists(self.zippackage) , 'customization zip package is missing : %s'%self.zippackage)


    def getPanelVisibilityMode(self):
        editpanel = self.gui.find(name='CustomizePanel', timeout = 0)
        rc = editpanel.uiaelem.CurrentBoundingRectangle
        rc_main = self.gui.find(name='FWAPP').uiaelem.CurrentBoundingRectangle
        if rc.top - rc_main.top < 100:
            return self.mode_fullexpanded
        elif rc_main.bottom - rc.top < 200:
            return self.mode_collapsed
        return self.mode_normalexpanded

    def ensureExpanded(self):
        mode = self.getPanelVisibilityMode()
        if mode == self.mode_collapsed:
            editpanel = self.gui.find(name='CustomizePanel')
            rc = editpanel.uiaelem.CurrentBoundingRectangle
            self.gui.find(id = 'togglePanel').invoke()
            btn_el = self.gui.find(id = self.btnid_edit).uiaelem
            time.sleep(1)
            rc_main = self.gui.find(name='FWAPP').uiaelem.CurrentBoundingRectangle
            start = time.time()
            while 1:
                if time.time() - start > 10:
                    raise TestCaseError(self, 'customization panel did not expand in due time')
                rc = btn_el.CurrentBoundingRectangle
                if rc.top > 0 and rc.bottom < rc_main.bottom:
                    break
                time.sleep(1)

    def ensureCollapsed(self):
        mode = self.getPanelVisibilityMode()
        if mode != self.mode_collapsed:
            self.gui.find(id = 'togglePanel').invoke()
            time.sleep(1)
            start = time.time()
            while 1:
                if time.time() - start > 10:
                    raise TestCaseError(self, 'customization panel did not collapse in due time')
                mode = self.getPanelVisibilityMode()
                if mode == self.mode_collapsed:
                    break
                time.sleep(0.5)

    def selectPanelTab(self,tab):
        self.ensureExpanded()
        btntab = self.gui.find(id = tab)
        btntab.click()
        if tab == self.tab_features and self.__firstfeatures == True:
            self.__firstfeatures = False
            time.sleep(2)
            start = time.time()
            while 1:
                if time.time() - start > 10:
                    raise TestCaseError(self, 'features population did not finish in due time')
                waitimg = self.gui.find(id = 'waitSpinImage')
                if waitimg == None:
                    break
                time.sleep(2)

    def scrollFeatureIntoView(self,feature,fullExpand=False):

        if fullExpand == False:
            scrlRight = self.gui.find(id='featuresCarouselRight')
            rcScRight = scrlRight.uiaelem.CurrentBoundingRectangle

        self.gui.find(id='featuresCarouselLeft').click()
        self.gui.sendkeys('{TAB}')
        while 1:
            rc = feature.uiaelem.CurrentBoundingRectangle
            if fullExpand == False:
                if rc.right != 0 and rc.right <= rcScRight.right:
                    break
                scrlRight.invoke(verbose = False)
            else:
                if rc.right>0 and rc.top>0:
                    break;
                self.gui.sendkeys('{RIGHT}')
        return feature


    def dragAndDrop(self , src , dst, err = '', adjust = None) :
        # Check that all elements are available
        if not err:
            err = 'Drag and Drop'
        if src == None :
            raise TestCaseError(self , err + ': src not available!')
        if dst == None :
            raise TestCaseError(self , err + ': dst not available!')

        self.log('Drag : %s >> Drop: %s'%(src.ariaproperties().lstrip('labelledby=') , dst.auid()))

        # Expand cust panel if not already expanded
        if 'dropslot' not in src.auid() and self.getPanelVisibilityMode() == self.mode_collapsed :
            self.gui.find(id = 'togglePanel').invoke()
        # Scroll to the feature
        if not src.auid().startswith('dropslot'):
            self.scrollFeatureIntoView(src)

        # Get drag/drop geometry
        s = src.uiaelem.CurrentBoundingRectangle
        d = dst.uiaelem.CurrentBoundingRectangle

        srcx = (s.right - s.left)/2 + s.left
        srcy = (s.bottom - s.top)/2 + s.top
        dstx = (d.right - d.left)/2 + d.left + 30
        dsty = (d.bottom - d.top)/2 + d.top

        # If dragging items from the features carousel, srcy is different
        if 'dropslot' not in src.auid():
            label = self.getFeature(src.ariaproperties().lstrip('labelledby=').rstrip(";")+ "_label")
            parent = src.getParent()

            parent_s = parent.uiaelem.CurrentBoundingRectangle
            label_s = label.uiaelem.CurrentBoundingRectangle

            height = (parent_s.bottom - parent_s.top) - (label_s.bottom - label_s.top)

            srcy = parent_s.top + height/2


        # Geometrical adjustment for extra tall / short / dropslot elements
        # Should not need this . logged #23702
        tallelements = ['AuthenticationGroup' , 'ImageQualityType' , 'OverlayImageSettings' , 'preview' , 'ImageAttribute', 'Staple', 'Nin1', 'PaperGroup', 'ColorBalance', 'Details']
        if [x for x in tallelements if x in src.ariaproperties()]:
            dsty -= 55

        #shortelements = ['FirstPageOnly' , 'PaperGroup', 'AuthenticationGroup', 'WatermarkSelect', 'WatermarkText']
        #if [x for x in shortelements if x in src.ariaproperties()]:
        #    srcy += 15

        if 'dropslot' in src.auid():
            srcy = s.bottom  - 3
            dsty = d.bottom  - 3

        if adjust :
            sx, sy, dx, dy = adjust[0], adjust[1] , adjust[2], adjust[3]
            srcx += sx
            srcy += sy
            dstx += dx
            dsty += dy

        # drag and drop
        self.gui.hwnd().dragdrop(srcx, srcy, dstx , dsty, 0.5, 5, 0.1)

    def dragToTab(self,from_tab,from_slot,to_tab,to_slot):
        self.gui.selectTab(from_tab)
        self.dropslot(from_slot).drag()
        drag_name = self.dropslot(from_slot).name()

        if from_tab != to_tab:
            #mouse over the tab
            self.gui.find(name=to_tab,id=to_tab.lower()).mouseOver()

            #wait for tab to change (dragged drop slot should get a new name after changing)
            start = time.time()
            while time.time() - start < 20: #can be 8-10s
                if self.dropslot(to_slot):
                    slot = self.dropslot(from_slot)
                    if slot:
                        if slot.name() != drag_name:
                            break
                    else:
                        break
            else:
                raise TestCaseError(self,"Could not drag dropslot to new tab within 20 seconds...")
            self.log('New tab appeared after %ss' % (time.time() - start))

        self.dropslot(to_slot).drop()

    """For list items - mouse over the item to click lock button etc"""
    def hover_option(self,item_id,option):
        self.gui.find(id=item_id).mouseOver()
        self.gui.find(name=option).invoke()


    def merge(self , slot1 , slot2):
        s1 = slot1.uiaelem.CurrentBoundingRectangle
        s2 = slot2.uiaelem.CurrentBoundingRectangle

        def mergeclick(x,y):
            self.gui.setCursorPos(x,y)
            self.gui.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, x, y)
            time.sleep(0.1)
            self.gui.mouse_event(win32con.MOUSEEVENTF_LEFTUP, x, y)

        def mergey(s, y):
            x = (s.right - s.left)/2 + s.left
            mergeclick(x,y)
            self.gui.find(name = 'Merge Up-Down').click()

        def mergex(x,s):
            y = (s1.bottom - s1.top)/2 + s1.top
            mergeclick(x,y)
            self.gui.find(name = 'Merge Left-Right').click()

        if s1.bottom == s2.top:
            mergey(s1 , s1.bottom)
        elif s1.top == s2.bottom:
            mergey(s1 , s1.top)
        elif s1.right == s2.left:
            mergex(s1.right , s1)
        elif s1.left == s2.right:
            mergex(s1.left , s1)
        else:
            raise TestCaseError(self , 'Unable to merge cells : [%s,%s], [%s,%s]'%(slot1.row() , slot1.col(), slot2.row() , slot2.col()))


    def resize(self , rowcol , pixels):
        ''' Resize some rows and columns

        Args:
            rowcol : the row/column to resize. Has to be prefixed by 'row' or 'col'. Index starts at 0
            pixels : number of pixels to resize the row/column by. can be negative
        '''
        if rowcol.startswith('row'):
            slot = self.dropslot('%s_0'%(rowcol.strip('row')))
            s = slot.uiaelem.CurrentBoundingRectangle
            srcx, srcy = s.left + 10 , s.bottom - 2

            # Drag slot!
            self.gui.setCursorPos(srcx,srcy)
            self.gui.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, srcx, srcy)
            self.gui.setCursorPos(srcx,srcy+pixels)
            self.gui.mouse_event(win32con.MOUSEEVENTF_LEFTUP, srcx, srcy + pixels)

        elif rowcol.startswith('col'):
            slot = self.dropslot('0_%s'%(rowcol.strip('col')))
            s = slot.uiaelem.CurrentBoundingRectangle
            srcx, srcy = s.right , s.top + 2

            # Drag slot!
            self.gui.setCursorPos(srcx,srcy)
            self.gui.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, srcx, srcy)
            self.gui.setCursorPos(srcx + pixels,srcy)
            self.gui.mouse_event(win32con.MOUSEEVENTF_LEFTUP, srcx + pixels, srcy)
        else:
            raise TestCaseError(self, 'Invalid arguments entered : %s'%(rowcol))


    def deleterow(self, row):
        slot = self.dropslot('%s_0'%str(row))
        self.check(slot , 'Slot %s,0 not available'%str(row))

        coord = slot.uiaelem.CurrentBoundingRectangle
        x = coord.left + 2
        y = (coord.bottom - coord.top)/2 + coord.top

        # click on the left edge of the row
        self.gui.mouseClick(x,y,hwnd = False)
        self.gui.find(name = 'Delete Row').click()


    def deletecol(self, col):
        slot = self.dropslot('0_%s'%str(col))
        self.check(slot , 'Slot 0,%s not available'%str(col))

        coord = slot.uiaelem.CurrentBoundingRectangle
        x = (coord.right - coord.left)/2 + coord.left
        y = coord.top  + 3

        # click on the left edge of the row
        self.gui.mouseClick(x,y,hwnd=False)
        self.gui.find(name = 'Delete Column').click()


    def insertrow(self , row1):
        ''' Insert a row after row1 '''
        slot1 = self.dropslot('%s_0'%str(row1))
        slot2 = self.dropslot('%s_0'%str(row1 + 1))
        self.check(slot1 and slot2 , 'Cannot insert row between row %i and row %i'%(row1 , row1 + 1))

        slot1 = slot1.uiaelem.CurrentBoundingRectangle
        x = slot1.left + 1
        y = slot1.bottom

        # click on the left edge of the row
        self.gui.mouseClick(x,y,hwnd=False)
        self.gui.find(name = 'Insert Row').click()


    def insertcol(self , col1):
        ''' Insert a column after col1 '''
        slot1 = self.dropslot('0_%s'%str(col1))
        slot2 = self.dropslot('0_%s'%str(col1 + 1))
        self.check(slot1 and slot2 , 'Cannot insert column between col %i and col %i'%(col1 , col1+ 1))

        slot1 = slot1.uiaelem.CurrentBoundingRectangle
        x = slot1.right
        y = slot1.top + 3

        # click on the top edge of the column
        self.gui.mouseClick(x,y,hwnd=False)
        self.gui.find(name = 'Insert Column').click()


    def clickEditToolbarBtn2(self, dropslot, btnId):
        dcid = 'dropslot'+dropslot
        dropCell = self.gui.find(id=dcid)
        if dropCell == None:
            self.log('Error. clickEditToolbarBtn. drop cell with id ',dcid,' not found')
            return False
        btn = dropCell.find(ariaproperties='labelledby='+btnId+';')
        if btn == None:
            self.log('Error. clickEditToolbarBtn. button with id ',btnId,' was not found in cell ',dcid)
            return False
        btn.click()
        return True


    def clickEditToolbarBtn(self, row, column, btnId):
        return self.clickEditToolbarBtn2(str(row)+'_'+str(column), btnId)

    themes = [  ('page','THEME_PAGEBKCOLOR'),
                ('panel','THEME_PANELBKCOLOR'),
                ('feature','THEME_FEATUREBKCOLOR'),
                ('summary','THEME_SUMMARYFEATUREBKCOLOR'),
                ('selected_option','THEME_OPTIONSELBKCOLOR'),
                ('selected_hovered_option','THEME_OPTIONSELHOVERBKCOLOR'),
                ('hovered_option','THEME_OPTIONSHOVERBKCOLOR'),
                ('label','THEME_LABELCOLOR'),
                ('menu_label','THEME_MENULABELCOLOR'),
                ('preview_label','THEME_PREVIEWLABELCOLOR'),
                ('feature_label','THEME_FEATURELABELCOLOR'),
                ('selected_feature_label','THEME_FEATURELABELSELCOLOR'),
                ('dialog','THEME_DLGBKCOLOR'),
                ('dialog_title','THEME_DLGTITLECOLOR'),
                ('dialog_label','THEME_DLGINPUTLABLECOLOR'),
                ('dialog_feature','THEME_DLGFEATUREBKCOLOR'),
                ('button_bar','THEME_BTNBARBKCOLOR'),
            ]

    def changeTheme(self,**kwargs):
        self.selectPanelTab('other_tab') #Other Settings
        self.gui.find(id='customizeTheme').invoke()
        self.check(self.gui.find(ariaproperties='labelledby=dialog;'),'Dialog did not appear in 5 seconds')
        for theme in self.themes:
            if theme[0] in kwargs.keys():
                combo = self.gui.find(ariaproperties=('labelledby=%s;' % theme[1]),timeout=1)
                if not combo and theme[0] == 'button_bar':
                    combo = self.gui.find(ariaproperties=('labelledby=%s;valuenow=1;' % theme[1]))
                combo.select(kwargs[theme[0]])
        self.gui.find(name='OK',id='1').invoke()

    def importPackage(self,path=None):
        if not path:
            path = os.path.join('C:\\','plugins','packages.json')

        self.selectPanelTab('other_tab')
        self.gui.find(id='customizeImport').invoke()
        uia = self.uia.uia()
        window = uia.searchwindow('Open',timeout=20)
        #enter path to import and press Open (more than one id='1'...)
        window.find(id='1148', type='edit').setValue(path)
        window.find(id='1', type='button', name='Open').invoke()

        self.wait()

    def resetUI(self):
        self.selectPanelTab('other_tab') #Other Settings
        self.gui.find(id='customizeReset').invoke()
        self.gui.find(id='6',name='Yes').invoke()

        self.wait()

    def replaceCache(self,remove=False,path=None):
        if not path:
            path = os.path.join('C:\\','plugins')
        to_path = glob.glob(os.path.join(self.userprofile,'AppData','Local','TOSHIBA','*','Tips','cache'))[-1]

        #remove GUI cache and current Tips settings
        shutil.rmtree(os.path.join(to_path,'gui'))
        shutil.rmtree(os.path.join(to_path,'plugins'))

        #replace with saved Tips settings
        if not remove:
            shutil.copytree(path,os.path.join(to_path,'plugins'))

    def __setupPanelInfo(self):
        editpanel = self.gui.find(name='CustomizePanel')
        if editpanel == None:
            self.log('Error. CustomizePanel document not found')
            return False
        self.__panel_togglebtn = self.gui.find(id='togglePanel')
        return True


    def featureSettingsSelected(self):
        #check if feature settings panel is the current tab in the panel
        self.ensureExpanded()
        test = self.gui.find(id= 'currentFeatureSettings',timeout=0.5)
        if test == None:
            return False
        rc = test.uiaelem.CurrentBoundingRectangle
        if rc.top == 0 or rc.left == 0:
            return False
        return True

    def switchlayout(self , newlayout):
        if self.getPanelVisibilityMode() == self.mode_collapsed :
            self.gui.find(id = 'togglePanel').invoke()
        self.gui.find(id = 'currentTab_tab').select()

        if self.gui.find(name = '2column', timeout = 0):
            self.gui.find(name = '2column').click()
        elif self.gui.find(name = 'fullPage', timeout = 0):
            self.gui.find(name = 'fullPage').click()
        elif self.gui.find(name = 'flexible', timeout = 0):
            self.gui.find(name = 'flexible').click()

        self.gui.find(name = newlayout).click()

    def enablecustomizeplugin(self):
        #make customize visible through device settings
        device = self.deviceprefsgui()
        device.selectTab('Plug-in')
        cust = device.find(id = 'customize', type ='checkbox', timeout = 10)
        self.check(cust , 'customization checkbox not found in device console')
        cust.check()
        device.close()

    def initcustomization(self, gui, view = '2column'):
        self.gui = gui

        # Enable customization panel
        time.sleep(1) # bug 23744
        self.gui.find(id = 'menuSettings').click()
        self.check(self.gui.find(id = 'showCustomizationPanel') , 'Show Customization Panel checkbox not found!')
        self.gui.find(id = 'showCustomizationPanel').check()
        self.gui.find(id = '1', name="OK").invoke()

        # Set customization panel to 'Edit' mode
        gui.selectTab('Custom')
        gui.find(id = 'togglePanel').invoke()

        # Select different layout. Default is 2 columns
        if view != '2column':
            self.switchlayout(view)

        gui.find(id = 'customizeEdit').invoke()

        # Wait for all features to load
        if self.getPanelVisibilityMode() == self.mode_collapsed :
            self.gui.find(id = 'togglePanel').invoke()
        gui.find(id = 'features_tab').select()
        gui.find(ariaproperties='labelledby=preview;', timeout = 10)

    def wait(self):
        start = time.time()
        while time.time() - start < 15:
            if not self.gui.find(id ='dialogGlobalGlassSheet_dialogGlassEffect', timeout = 3):
                self.log('Customization Reset [%.2fs]'%(time.time() - start))
                break
            time.sleep(0.1)


    def cleanup(self):
        super(CustomizeBase, self).cleanup()
        if os.path.exists(self.plugindir):
            shutil.rmtree(self.plugindir)



