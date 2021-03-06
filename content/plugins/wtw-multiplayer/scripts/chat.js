wtwmultiplayer.prototype.addChatBox = function(chatid, displayname, stext) {
	var chatbox = "";
	try {
		chatbox = 
			"<div id='wtw_chatbox-" + chatid + "' class='wtw-chatbox'>" + 
				"<div class='wtw-chatboxshadow'>" +
					"<img class='wtw-closeright' onclick=\"WTWMultiplayer.closeChat('" + chatid + "',true);\" src='/content/system/images/menuclosegrey.png' alt='Close' title='Close' onmouseover=\"this.src='/content/system/images/menuclosehover.png';\" onmouseout=\"this.src='/content/system/images/menuclosegrey.png';\" />" + 
					"<img id='wtw_chatmin" + chatid + "' class='wtw-closeright' onclick=\"WTW.hide('wtw_chatmaxdiv" + chatid + "');WTW.hide('wtw_chatmin" + chatid + "');WTW.show('wtw_chatmax" + chatid + "');\" src='/content/system/images/menuminimizegrey.png' alt='Minimize Chat' title='Minimize Chat' onmouseover=\"this.src='/content/system/images/menuminimizehover.png';\" onmouseout=\"this.src='/content/system/images/menuminimizegrey.png';\" />" + 
					"<img id='wtw_chatmax" + chatid + "' class='wtw-closeright' onclick=\"WTW.show('wtw_chatmaxdiv" + chatid + "');WTW.hide('wtw_chatmax" + chatid + "');WTW.show('wtw_chatmin" + chatid + "');\" src='/content/system/images/menumaximizegrey.png' alt='Maximize Chat' title='Maximize Chat' onmouseover=\"this.src='/content/system/images/menumaximizehover.png';\" onmouseout=\"this.src='/content/system/images/menumaximizegrey.png';\" style='display:none;visibility:hidden;' />" +
					"<div id='wtw_chatdisplayname" + chatid + "' class='wtw-chatdisplayname'>" + displayname + "</div>" + 
					"<div id='wtw_chatmaxdiv" + chatid + "'>" +
						"<div id='wtw_chattext-" + chatid + "' class='wtw-chattext'>" + stext + "</div>" + 
						"<div class='wtw-chatcenter'>" + 
							"<textarea id='wtw_chatadd-" + chatid + "' rows='2' cols='39' class='wtw-chattextarea' autocomplete='new-password' onkeyup=\"WTWMultiplayer.chatCheckKey(this,'" + chatid + "');\" onfocus=\"WTWMultiplayer.setChatNewInfo('" + chatid + "',false);\" style='display:none;visibility:hidden;'></textarea>" + 
							"<div id='wtw_chattextsend-" + chatid + "' class='wtw-chattextsend' onclick=\"WTWMultiplayer.sendChat('" + chatid + "');\" style='display:none;visibility:hidden;'>Send</div>" +
							"<div id='wtw_chataccept-" + chatid + "' class='wtw-chatbuttonaccept' onclick=\"WTWMultiplayer.acceptChat('" + chatid + "');\" style='display:none;visibility:hidden;'>Accept</div>" + 
							"<div id='wtw_chatdecline-" + chatid + "' class='wtw-chatbuttondecline' onclick=\"WTWMultiplayer.closeChat('" + chatid + "',true,true);\" style='display:none;visibility:hidden;'>Decline</div>" + 
							"<div id='wtw_chatok-" + chatid + "' class='wtw-chatbuttonaccept' onclick=\"WTWMultiplayer.closeChat('" + chatid + "');\" style='display:none;visibility:hidden;'>OK</div>" + 
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>";
	} catch(ex) {
		WTW.log("multiuser-chat-addChatBox=" + ex.message);
	}
	return chatbox;
}

wtwmultiplayer.prototype.onClick = function(pickedname) {
	try {
		if (pickedname.indexOf("person-") > -1) {
			WTWMultiplayer.openChat(pickedname);
		}
	} catch(ex) {
		WTW.log("multiuser-chat-addChatBox=" + ex.message);
	}
}

wtwmultiplayer.prototype.openChat = function(pickedname) {
	try {
		var instanceid = WTWMultiplayer.getAvatarInstance(pickedname);
		if (instanceid.length > 10) {
			var instancearray = [];
			instancearray[0] = dGet('wtw_tinstanceid').value;
			instancearray[1] = instanceid;
			var chatid = WTWMultiplayer.getChatID(instancearray);
			var displayname = WTWMultiplayer.getAvatarDisplayName(instanceid);
			if (dGet('wtw_chatbox-' + chatid) == null) {
				dGet('wtw_chatsendrequests').innerHTML += WTWMultiplayer.addChatBox(chatid, displayname, "Chat Request Sent to " + displayname + ".<br />");
				WTWMultiplayer.addChatText(chatid, 'Chat Request', '');
			}
			WTWMultiplayer.chatSetScroll(chatid, true);
			WTW.resetActivityTimer();
		}
	} catch(ex) {
		WTW.log("multiuser-chat-openChat=" + ex.message);
	}
}

wtwmultiplayer.prototype.getChatID = function(instancearray) {
	var chatid = "";
	try {
		var found = false;
		NodeList.prototype.forEach = Array.prototype.forEach;
		var chats = dGet('wtw_chatsendrequests').childNodes;
		chats.forEach(function(obj){
			var chatbox = obj.id.replace("wtw_chatbox-","");
			var testchatbox = chatbox;
			for (var i=0;i<instancearray.length;i++) {
				if (instancearray[i] != null) {
					testchatbox = testchatbox.replace(instancearray[i],"");
				}
			}
			while (testchatbox.indexOf('_') > -1) {
				testchatbox = testchatbox.replace("_","");
			}
			if (testchatbox == "") {
				chatid = chatbox;
				found = true;
			}
		});

		if (found == false && instancearray != null) {
			if (instancearray[0] != null) {
				chatid = instancearray[0];
				for (var i=1;i<instancearray.length;i++) {
					if (instancearray[i] != null) {
						chatid += "_" + instancearray[i];
					}
				}
			}
		}
	} catch(ex) {
		WTW.log("multiuser-chat-getChatID=" + ex.message);
	}
	return chatid;
}
	
wtwmultiplayer.prototype.acceptChat = function(chatid) {
	try {
		WTWMultiplayer.addChatText(chatid, 'Accept Chat', '');
		WTW.hide('wtw_chataccept-' + chatid);
		WTW.hide('wtw_chatdecline-' + chatid);
		WTW.hide('wtw_chatok-' + chatid);
		WTW.showInline('wtw_chatadd-' + chatid);
		WTW.showInline('wtw_chattextsend-' + chatid);
		if (dGet('wtw_chattext-' + chatid) != null) {
			var sdate = new Date();
			dGet('wtw_chattext-' + chatid).innerHTML = "<span style='color:gray;font-size:.8em;'>Entered Chat: " + sdate.toLocaleString() + "</span><hr class='wtw-chathr' />";
		}
		WTWMultiplayer.chatSetScroll(chatid, true);
		WTW.resetActivityTimer();
	} catch(ex) {
		WTW.log("multiuser-chat-acceptChat=" + ex.message);
	}
}

wtwmultiplayer.prototype.closeChat = function(chatid, sendreply, decline) {
	try {
		var stext = 'Close Chat';
		if (decline == undefined) {
			decline == false;
		}
		if (sendreply == undefined) {
			sendreply == false;
		}
		if (decline) {
			stext = 'Decline Chat';
		}
		if (sendreply) {
			WTWMultiplayer.addChatText(chatid, stext, '');
		}
		if (dGet('wtw_chatsendrequests') != null && dGet('wtw_chatbox-' + chatid) != null) {
			dGet('wtw_chatsendrequests').removeChild(dGet('wtw_chatbox-' + chatid));
		}
		if (dGet('wtw_chatsendrequests').innerHTML == '') {
			WTW.hide('wtw_menuchat');
		} else {
			WTWMultiplayer.chatSetScroll(chatid, false);
		}
		WTW.resetActivityTimer();
	} catch(ex) {
		WTW.log("multiuser-chat-closeChat=" + ex.message);
	}
}
	
wtwmultiplayer.prototype.chatCheckKey = function(obj, chatid) {
	try {
		var e = window.event;
		if (e != undefined) {
			if (e.keyCode == 13) {
				WTWMultiplayer.sendChat(chatid);
				e.preventDefault();
			} else {
				WTW.checkKey(obj, 'text', 0, 0);
			}
		}
	} catch(ex) {
		WTW.log("multiuser-chat-chatCheckKey=" + ex.message);
	}
}
	
wtwmultiplayer.prototype.addChatText = function(chatid, saction, stext) {
	try {
		if (WTWMultiplayer.chatQueue == null) {
			WTWMultiplayer.chatQueue = [];
		}
		var chatind = WTWMultiplayer.chatQueue.length;
		WTWMultiplayer.chatQueue[chatind] = {'chatid':'','chattext':''};
		WTWMultiplayer.chatQueue[chatind].chatid = chatid;
		WTWMultiplayer.chatQueue[chatind].chattext = JSON.stringify({
			'chatid':chatid,
			'action':saction,
			'stext':stext,
			'sinstanceid':dGet('wtw_tinstanceid').value,
			'sfrom': btoa(dGet('wtw_menudisplayname').innerHTML)
		});
	} catch(ex) {
		WTW.log("multiuser-chat-addChatText=" + ex.message);
	}
}

wtwmultiplayer.prototype.sendChat = function(chatid) {
	try {
		var stext = "";
		if (dGet('wtw_chatadd-' + chatid) != null) {
			stext = dGet('wtw_chatadd-' + chatid).value;
		}
		if (stext.length > 0) {
			while (stext.indexOf('<') > -1) {
				stext = stext.replace("<","&lt;");
			}
			while (stext.indexOf('>') > -1) {
				stext = stext.replace(">","&gt;");
			}
			dGet('wtw_chattext-' + chatid).innerHTML += "<span style='color:gray;font-size:.8em;'>Me:</span> " + stext + "<hr class='wtw-chathr' />";
			dGet('wtw_chatadd-' + chatid).value = "";
			WTWMultiplayer.addChatText(chatid, 'Add Text', stext);
		}
		WTWMultiplayer.chatSetScroll(chatid, true);
		WTW.resetActivityTimer();
	} catch(ex) {
		WTW.log("multiuser-chat-sendChat=" + ex.message);
	}
}

wtwmultiplayer.prototype.chatSetScroll = function(chatid, setfocus) {
	try {
		WTW.showSettingsMenu('wtw_menuchat');
		if (dGet('wtw_chattext-' + chatid) != null) {
			dGet('wtw_chattext-' + chatid).scrollTop = dGet('wtw_chattext-' + chatid).scrollHeight;
		}
		if (setfocus) {
			if (dGet('wtw_chatadd-' + chatid) != null) {
				dGet('wtw_chatadd-' + chatid).focus();
			}
		} else {
			WTWMultiplayer.setChatNewInfo(chatid,true);
		}
	} catch(ex) {
		WTW.log("multiuser-chat-chatSetScroll=" + ex.message);
	}
}

wtwmultiplayer.prototype.setChatNewInfo = function(chatid, setNew) {
	try {
		if (setNew) {
			if (dGet('wtw_chatdisplayname' + chatid) != null) {
				dGet('wtw_chatdisplayname' + chatid).className = 'wtw-chatdisplaynameblink';
			}
		} else {
			if (dGet('wtw_chatdisplayname' + chatid) != null) {
				dGet('wtw_chatdisplayname' + chatid).className = 'wtw-chatdisplayname';
			}
		}
	} catch(ex) {
		WTW.log("multiuser-chat-setChatNewInfo=" + ex.message);
	}
}

wtwmultiplayer.prototype.receiveChatText = function(chatid, chattext) {
	try {
		if (chatid != undefined && chatid != null) {
			if (chatid != '') {
				chattext = JSON.parse(atob(chattext));
				var saction = '';
				var stext = '';
				var sfrom = '';
				var sinstanceid = '';
				var sdisplayname = '';
				if (chattext.action != undefined) {
					saction = chattext.action;
				}
				if (chattext.action != undefined) {
					stext = chattext.stext;
				}
				if (chattext.action != undefined) {
					sfrom = chattext.sfrom;
				}
				if (chattext.action != undefined) {
					sinstanceid = chattext.sinstanceid;
				}
				sdisplayname = WTWMultiplayer.getAvatarDisplayName(sinstanceid);
				switch (saction) {
					case "Chat Request":
						if (dGet('wtw_chatbox-' + chatid) == null) {
							dGet('wtw_chatsendrequests').innerHTML += WTWMultiplayer.addChatBox(chatid, sdisplayname, "Chat Request from " + sdisplayname + ".<br />");
							WTW.showInline('wtw_chataccept-' + chatid);
							WTW.showInline('wtw_chatdecline-' + chatid);
							WTWMultiplayer.chatSetScroll(chatid, false);
						}
						WTW.resetActivityTimer();
						break;
					case "Accept Chat":
						WTW.showInline('wtw_chatadd-' + chatid);
						WTW.showInline('wtw_chattextsend-' + chatid);
						var sdate = new Date();
						dGet('wtw_chattext-' + chatid).innerHTML = "<span style='color:gray;font-size:.8em;'>Entered Chat: " + sdate.toLocaleString() + "</span><hr class='wtw-chathr' />";
						WTW.hide('wtw_chataccept-' + chatid);
						WTW.hide('wtw_chatdecline-' + chatid);
						WTWMultiplayer.chatSetScroll(chatid, true);
						WTW.resetActivityTimer();
						break;
					case "Decline Chat":
						if (dGet('wtw_chattext-' + chatid) != null) {
							dGet('wtw_chattext-' + chatid).innerHTML = "Sorry, not now.<br />";
						}
						WTW.showInline('wtw_chatok-' + chatid);
						WTWMultiplayer.chatSetScroll(chatid, false);
						WTW.resetActivityTimer();
						break;
					case "Close Chat":
						if (dGet('wtw_chattext-' + chatid) != null) {
							dGet('wtw_chattext-' + chatid).innerHTML += "<span style='font-weight:bold;color:red;'>" + sdisplayname + " has left the chat.</span><br />Click OK to close.<br />";
						}
						WTW.hide('wtw_chattextsend-' + chatid);
						WTW.hide('wtw_chatadd-' + chatid);
						WTW.hide('wtw_chataccept-' + chatid);
						WTW.hide('wtw_chatdecline-' + chatid);
						WTW.showInline('wtw_chatok-' + chatid);
						WTWMultiplayer.chatSetScroll(chatid, false);
						WTW.resetActivityTimer();
						break;
					case "Add Text":
						dGet('wtw_chattext-' + chatid).innerHTML += "<span style='color:blue;font-size:.8em;'>" + sdisplayname + ":</span> " + stext + "<hr class='wtw-chathr' />";
						WTWMultiplayer.chatSetScroll(chatid, false);
						WTW.resetActivityTimer();
						break;
				}
			}
		}
	} catch(ex) {
		WTW.log("multiuser-chat-receiveChatText=" + ex.message);
	}
}