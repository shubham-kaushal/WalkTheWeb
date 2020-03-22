<?php
require_once('../functions/class_wtwhandlers.php');
global $wtwhandlers;
try {
	require_once(wtw_rootpath.'/core/functions/class_wtwuploads.php');
	global $wtwuploads;
	$zrequest = file_get_contents('php://input');
	$zrequest = json_decode($zrequest, TRUE);

	$zfunction = strtolower($wtwhandlers->getPost('function',''));
	$zuploadobjectid = $wtwhandlers->getPost('uploadobjectid','');
	$zobjectanimationid = $wtwhandlers->getPost('objectanimationid','');
	$zobjectfolder = $wtwhandlers->getPost('objectfolder','');
	$zobjectfilepart = $wtwhandlers->getPost('objectfilepart','');
	$zfilename = $wtwhandlers->getPost('filename','');
	$zitem = $wtwhandlers->getPost('item','');
	$zmoldgroup = $wtwhandlers->getPost('moldgroup','buildings');
	$zwebid = $wtwhandlers->getPost('webid','');
	$zscriptid = $wtwhandlers->getPost('scriptid','');
	$zscriptpath = $wtwhandlers->getPost('scriptpath','');
	$zactionzoneid = $wtwhandlers->getPost('actionzoneid','');
	$zuploadfile = $wtwhandlers->getFiles('wtw_uploadfile',null);
	$zuploadfiles = $wtwhandlers->getFiles('wtw_uploadfiles',null);

	$zresponse = array();
	switch ($zfunction) {
		case "getuploadedfiles":
			$zresponse = $wtwuploads->getUploadedFiles();
			break;
		case "getuploadedfilenamedetails":
			$zresponse = $wtwuploads->getUploadedFileNameDetails($zuploadobjectid);
			break;
		case "getuploadedfilefilesdetails":
			$zresponse = $wtwuploads->getUploadedFileFilesDetails($zobjectfolder);
			break;
		case "uploadfile":
			$wtwuploads->uploadFile($zuploadfile);
			break;
		case "uploadfiles":
			$serror = $wtwuploads->uploadFiles($zuploadfiles, $zitem);
			$zresponse = array(
				'serror'=> $serror
			);
			break;
		case "uploadobjectfiles":
			$serror = $wtwuploads->uploadObjectFiles($zuploadfiles, $zobjectfilepart);
			$zresponse = array(
				'serror'=> $serror
			);
			break;
		case "deleteobjectfile":
			$wtwuploads->deleteObjectFile($zfilename, $zobjectfilepart);
			break;
		case "uploadjavascriptfiles":
			$serror = $wtwuploads->uploadJavaScriptFiles($zuploadfiles, $zmoldgroup, $zwebid, $zactionzoneid);
			$zresponse = array(
				'serror'=> $serror
			);
			break;
		case "deletejavascriptfile":	
			$serror = $wtwuploads->deleteJavaScriptFile($zmoldgroup, $zwebid, $zactionzoneid, $zscriptid, $zscriptpath);
			$zresponse = array(
				'serror'=> $serror
			);
			break;
	}

	echo $wtwhandlers->addHandlerHeader($wtwhandlers->domainname);
	echo json_encode($zresponse);

} catch (Exception $e) {
	$wtwhandlers->serror("core-handlers-uploadedfiles.php=".$e->getMessage());
}
?>