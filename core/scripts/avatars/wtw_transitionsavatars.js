WTWJS.prototype.saveAvatarEnterAnimation = function() {
	try {
		var zavataranimationid = WTW.getDDLValue('wtw_tselectavataranimation-enter');
		if (WTW.isNumeric(zavataranimationid) == false) {
			zavataranimationid = 1;
		}
		var zrequest = {
			'useravatarid': dGet('wtw_tuseravatarid').value,
			'instanceid': dGet("wtw_tinstanceid").value,
			'avataranimationid': zavataranimationid,
			'transport': '1',
			'function':'savetransportanimation'
		};
		WTW.postJSON("/core/handlers/avatars.php", zrequest, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				/* note serror would contain errors */
			}
		);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-saveAvatarEnterAnimation=" + ex.message);
    }
}

WTWJS.prototype.addAvatarAnimationRow = function(zoptionind, zselectedvalue) {
	try {
		var zuseravataranimationid = "";
		var zoptional = dGet('wtw_tselectavataranimation-' + zoptionind);
		var znewoptional = zoptional.cloneNode();
		var zbasename = 'wtw_tselectavataranimation-';
		var i = zoptionind;
		var znewname = zbasename + i;
		while (dGet(znewname) != null) {
			znewname = zbasename + i;
			zoptionind = i;
			i += 1;
		}
		if (zoptionind > 68) {
			WTW.hide('wtw_animation-add');
		}
		if (zselectedvalue.indexOf('|') > -1) {
			var zcurrentvalues = zselectedvalue.split('|');
			zuseravataranimationid = zcurrentvalues[0];
		}
		znewoptional.id = znewname;
		znewoptional.className = 'wtw-inlinespacing';
		znewoptional.style = '';
		znewoptional.innerHTML = "";
		for (var i = 0; i < zoptional.options.length; i++) {
			var zoption = zoptional.options[i].cloneNode();
			zoption.innerHTML = zoptional.options[i].innerHTML;
			if (zoption.value == zselectedvalue) {
				zoption.selected = true;
			} else {
				zoption.selected = false;
			}
			znewoptional.appendChild(zoption);
		}
		var zcurrent = document.createElement('input');
		zcurrent.type = 'hidden';
		zcurrent.value = zuseravataranimationid;
		zcurrent.id = 'wtw_tselectavataranimation-' + zoptionind + '-value';
		var zdeleteanimation = document.createElement('div');
		zdeleteanimation.id = 'wtw_tselectavataranimation-' + zoptionind + '-delete';
		zdeleteanimation.className = "wtw-deleteanimicon";
		zdeleteanimation.innerHTML = "<img src='/content/system/images/deleteicon.png' alt='Delete Animation' title='Delete Animation' onclick=\"WTW.deleteUserAnimation('" + znewname + "');\" class='wtw-deleteicon' />";
		dGet('wtw_addoptionalanimations').appendChild(zcurrent);
		zdeleteanimation.appendChild(znewoptional);
		dGet('wtw_addoptionalanimations').appendChild(zdeleteanimation);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-addAvatarAnimationRow=" + ex.message);
    }
}

WTWJS.prototype.updateAnimSelectValue = function(zuseravataranimationidfield, zuseravataranimationid) {
	try {
		if (dGet(zuseravataranimationidfield) != null) {
			dGet(zuseravataranimationidfield).value = zuseravataranimationid;
			var zselobjid = zuseravataranimationidfield.replace('-value','');
			var zselvalue = WTW.getDDLValue(zselobjid);
			var znewselvalue = "";
			if (zselvalue.indexOf('|') > -1) {
				var zselvalues = zselvalue.split('|');
				znewselvalue = zuseravataranimationid;
				for (var i=1;i<zselvalues.length;i++) {
					znewselvalue += "|" + zselvalues[i];
				}
			}
			if (dGet(zselobjid) != null) {
				if (dGet(zselobjid).selectedIndex > -1) {
					dGet(zselobjid).options[dGet(zselobjid).selectedIndex].value = znewselvalue;
				}
			}
			var zavatar = scene.getMeshByID("myavatar-" + dGet("wtw_tinstanceid").value);
			if (zavatar != null) {
				if (zavatar.WTW.animations != undefined) {
					for (var i=zavatar.WTW.animations.length;i>-1;i--) {
						if (zavatar.WTW.animations[i] != null) {
							if (zavatar.WTW.animations[i].animationevent == "onoption" && zavatar.WTW.animations[i].useravataranimationid == '') {
								zavatar.WTW.animations[i].useravataranimationid = zuseravataranimationid;
							}
						}
					}
				}
			}
		}
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-updateAnimSelectValue=" + ex.message);
    }
}

WTWJS.prototype.deleteUserAnimation = function(zselectname) {
	try {
		var zuseravataranimationid = "";
		var zavataranimationid = "";
		var zanimationevent = "";
		var zselectedvalue = WTW.getDDLValue(zselectname);
		if (zselectedvalue.indexOf('|') > -1) {
			var zcurrentvalues = zselectedvalue.split('|');
			zuseravataranimationid = zcurrentvalues[0];
			zavataranimationid = zcurrentvalues[1];
			zanimationevent = zcurrentvalues[3];
		}
		WTW.show('wtw_animation-add');
		var zavatar = scene.getMeshByID("myavatar-" + dGet("wtw_tinstanceid").value);
		if (zavatar != null) {
			if (zavatar.WTW.animations != undefined) {
				for (var i=zavatar.WTW.animations.length;i>-1;i--) {
					if (zavatar.WTW.animations[i] != null) {
						if (zavatar.WTW.animations[i].useravataranimationid == zuseravataranimationid) {
							if (zavatar.WTW.animations.running['onoption' + zavatar.WTW.animations[i].avataranimationid] != undefined) {
								zavatar.WTW.animations.running['onoption' + zavatar.WTW.animations[i].avataranimationid].stop();
							}
							zavatar.WTW.animations.splice(i,1);
						}
					}
				}
			}
		}
		if (dGet(zselectname) != null) {
			WTW.hide(zselectname);
			WTW.hide(zselectname + '-delete');
		}
		if (zuseravataranimationid != "") {
			var zrequest = {
				'useravatarid': dGet('wtw_tuseravatarid').value,
				'instanceid': dGet("wtw_tinstanceid").value,
				'useravataranimationid': zuseravataranimationid,
				'avataranimationid':zavataranimationid,
				'function':'deleteavataranimation'
			};
			WTW.postJSON("/core/handlers/avatars.php", zrequest, 
				function(zresponse) {
					zresponse = JSON.parse(zresponse);
					/* note serror would contain errors */
				}
			);
		}
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-deleteUserAnimation=" + ex.message);
    }
}

WTWJS.prototype.toggleMenuAnimations = function() {
	try {
		if (dGet('wtw_menuoptionalanimations').style.display == 'none') {
			var zlistoptionalanimations = "";
			var zavatar = scene.getMeshByID("myavatar-" + dGet("wtw_tinstanceid").value);
			if (zavatar != null) {
				if (zavatar.WTW.animations != undefined) {
					
					for (var i=zavatar.WTW.animations.length; i>-1; i--) {
						if (zavatar.WTW.animations[i] != null) {
							var zanimdef = zavatar.WTW.animations[i];
							if (zanimdef.animationevent.indexOf('onoption') > -1) {
								var zicon = "/content/system/icons/animdefault.png";
								if (zanimdef.animationicon != '') {
									zicon = zanimdef.animationicon;
								}
								zlistoptionalanimations += "<div id='wtw_playanimation" + i + "' class='wtw-animationicondiv'";
								zlistoptionalanimations += " onmousedown=\"WTW.runOptionalAnimation(this,'" + zanimdef.animationevent + "')\"";
								zlistoptionalanimations += " onmouseup=\"WTW.stopOptionalAnimation(this,'" + zanimdef.animationevent + "')\"";
								zlistoptionalanimations += " onpointerdown=\"WTW.runOptionalAnimation(this,'" + zanimdef.animationevent + "')\"";
								zlistoptionalanimations += " onpointerup=\"WTW.stopOptionalAnimation(this,'" + zanimdef.animationevent + "')\"";
								zlistoptionalanimations += " ontouchstart=\"WTW.runOptionalAnimation(this,'" + zanimdef.animationevent + "')\"";
								zlistoptionalanimations += " ontouchend=\"WTW.stopOptionalAnimation(this,'" + zanimdef.animationevent + "')\">";
								zlistoptionalanimations += "<img src='" + zicon + "' class='wtw-animationicon' alt='" + zanimdef.animationfriendlyname + "' title='" + zanimdef.animationfriendlyname + "' /></div>";
							}
						}
					}
				}
			}
			zlistoptionalanimations += "<div id='wtw_editplayanimations' class='wtw-animationicondiv' onclick=\"WTW.editPlayAnimations();\">";
			zlistoptionalanimations += "<br />Select<br /><br />Animations<br /></div>";
			dGet('wtw_listoptionalanimations').innerHTML = zlistoptionalanimations;
			WTW.show('wtw_menuoptionalanimations');
			var zmenuwidth = dGet('wtw_menuoptionalanimations').clientWidth;
			if (dGet('wtw_menuoptionanimations') != null) {
				var zicon = dGet('wtw_menuoptionanimations').getBoundingClientRect();
				dGet('wtw_menuoptionalanimations').style.left = (zicon.left + 12 - (zmenuwidth/2)) + 'px';
			}
		} else {
			WTW.hide('wtw_menuoptionalanimations');
		}
	} catch (ex) { 
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-toggleMenuAnimations=" + ex.message);
	}
}

WTWJS.prototype.getAvatarAnimationsAll = function() {
	try {
		var zrequest = {
			'useravatarid': dGet('wtw_tuseravatarid').value,
			'instanceid': dGet("wtw_tinstanceid").value,
			'function':'getavataranimationsall'
		};
		WTW.postJSON("/core/handlers/avatars.php", zrequest, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				/* note serror would contain errors */
				WTW.loadAvatarAnimationsAll(JSON.parse(zresponse.avataranimations));
			}
		);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-getAvatarAnimationsAll=" + ex.message);
    }
}

WTWJS.prototype.loadAvatarAnimationsAll = function(zresponse) {
	try {
		var zoptionind = -1;
		var zeditavataranimations = "<ul style='padding:0px;'>";
		var zoptionalanimations = [];
		if (zresponse != null) {
			var zlastanimationname = "";
			var zcurrentinput = "";
			var zsetselect = false;
			for (var i=0;i<zresponse.length;i++) {
				if (zresponse[i] != null) {
					var zfound = false;
					var zanimationname = zresponse[i].animationevent;
					switch (zresponse[i].animationevent) {
						case "onwait":
							zanimationname = "Standing Idle";
							zfound = true;
							break;
						case "onwalk":
							zanimationname = "Walk";
							zfound = true;
							break;
						case "onwalkbackwards":
							zanimationname = "Walk Backwards";
							zfound = true;
							break;
						case "onturnleft":
							zanimationname = "Turn Left";
							zfound = true;
							break;
						case "onturnright":
							zanimationname = "Turn Right";
							zfound = true;
							break;
						case "onstrafeleft":
							zanimationname = "Strafe Left";
							zfound = true;
							break;
						case "onstraferight":
							zanimationname = "Strafe Right";
							zfound = true;
							break;
						case "onrun":
							zanimationname = "Run";
							zfound = true;
							break;
						case "onrunbackwards":
							zanimationname = "Run Backwards";
							zfound = true;
							break;
						case "onrunturnleft":
							zanimationname = "Run Turn Left";
							zfound = true;
							break;
						case "onrunturnright":
							zanimationname = "Run Turn Right";
							zfound = true;
							break;
						case "onrunstrafeleft":
							zanimationname = "Run Strafe Left";
							zfound = true;
							break;
						case "onrunstraferight":
							zanimationname = "Run Strafe Right";
							zfound = true;
							break;
						case "onoption":
							zanimationname = "Optional Gestures ++";
							zfound = true;
							break;
					}
					if (zfound) {
						if (zlastanimationname != zanimationname) {
							zsetselect = false;
							if (zlastanimationname != "") {
								zeditavataranimations += "</select></div></li>";
							}
							if (zresponse[i].animationevent == "onoption") {
								zoptionind = i;
							}
							zcurrentinput = "wtw_tselectavataranimation-" + i + "-value";
							zeditavataranimations += "<li id='wtw_animation-" + zresponse[i].animationevent + "' class='wtw-avatarli' onclick=\"WTW.editAvatarAnimation('" + zresponse[i].animationevent + "'," + i + "," + zresponse.length + ");\">";
							zeditavataranimations += "<div class='wtw-inlineindent'>" + zanimationname + "</div></li>";
							zeditavataranimations += "<li id='wtw_animationdiv-" + i + "' class='wtw-avatarli' style='display:none;visibility:hidden;'>";
							if (zresponse[i].animationevent == "onoption") {
								zeditavataranimations += "<div>";
							} else {
								zeditavataranimations += "<div class='wtw-inlineindent2'>";
							}
							zeditavataranimations += "<input id='" + zcurrentinput + "' type='hidden' value='' />";
							
							if (zresponse[i].animationevent == "onoption") {
								zeditavataranimations += "<select id='wtw_tselectavataranimation-" + i + "' onchange=\"WTW.changeAvatarAnimation(this);\" style='display:none;visibility:hidden;' >";
								zeditavataranimations += "<option value=''> -- Select Animation -- </option>";
							} else {
								zeditavataranimations += "<select id='wtw_tselectavataranimation-" + i + "' onchange=\"WTW.changeAvatarAnimation(this);\" >";
							}
							if (zoptionind > 68) {
								WTW.hide('wtw_animation-add');
							}
							zlastanimationname = zanimationname;
						}
						var zselected = "";
						var zvalue = zresponse[i].useravataranimationid + "|" + zresponse[i].avataranimationid + "|" + zresponse[i].speedratio + "|" + zresponse[i].animationevent + "|" + zresponse[i].startframe + "|" + zresponse[i].endframe + "|" + zresponse[i].objectfolder + "|" + zresponse[i].objectfile + "|" + zresponse[i].animationfriendlyname + "|" + zresponse[i].loadpriority + "|" + zresponse[i].animationicon;
						if (zresponse[i].useravataranimationid != null && zresponse[i].useravataranimationid != '') {
							if (zsetselect == false && zresponse[i].animationevent != "onoption") {
								zselected = "selected='true'";
								if (dGet(zcurrentinput) != null) {
									dGet(zcurrentinput).value = zresponse[i].useravataranimationid;
								}
								zsetselect = true;
							} else {
								zoptionalanimations[zoptionalanimations.length] = zvalue;
							}
						}
						zeditavataranimations += "<option " + zselected + " value='" + zvalue + "'>" + zresponse[i].animationfriendlyname + "</option>";
					}
				}
			}
		}
		zeditavataranimations += "</select></div><div id='wtw_addoptionalanimations'></div><div id='wtw_animation-add' class='wtw-addbuttonaccept' onclick=\"WTW.addAvatarAnimationRow(" + zoptionind + ",'');\" style='text-align:center;margin-left:20px;'>+ Add Animation</div>";
		zeditavataranimations += "<div style='font-size:.8em;text-align:center;'><img id='wtw_helpanimicon' src='/content/system/images/menugestures32.png' alt='Animations' title='Animations' /> Click on toolbar below to execute.</div></li></ul>";
		dGet("wtw_editavataranimations").innerHTML = zeditavataranimations;
		if (zoptionalanimations.length > 0) {
			for (var i=0;i<zoptionalanimations.length;i++) {
				if (zoptionalanimations[i] != null) {
					if (zoptionalanimations[i] != '') {
						WTW.addAvatarAnimationRow(zoptionind, zoptionalanimations[i]);
					}
				}
			}
		}
		WTW.showSettingsMenu('wtw_menuavatar');
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-loadAvatarAnimationsAll=" + ex.message);
    }
}

WTWJS.prototype.editEnterAnimation = function() {
	try {
		WTW.editAvatarAnimation('', -1, 181);
		WTW.toggle("wtw_animationdiv-enter");
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-editEnterAnimation=" + ex.message);
    }
}

WTWJS.prototype.editAvatarAnimation = function(animationevent, currentind, total) {
	try {
		dGet('wtw_tavataranimationevent').value = animationevent;
		for (var i=0;i<total;i++) {
			if (dGet("wtw_animationdiv-" + i) != null && i != currentind) {
				WTW.hide("wtw_animationdiv-" + i);
			} else if (i == currentind) {
				WTW.toggle("wtw_animationdiv-" + i);
			}
		}
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-editAvatarAnimation=" + ex.message);
    }
}

WTWJS.prototype.avatarEnter = function(zavatarname) {
	try {
		var zavatarparts = [];
		var zavatar = scene.getMeshByID(zavatarname);
		var zenteranimation = '1';
		if (zavatar != null) {
			if (zavatar.WTW != null) {
				if (zavatar.WTW.enteranimation != null) {
					if (WTW.isNumeric(zavatar.WTW.enteranimation)) {
						zenteranimation = zavatar.WTW.enteranimation;
					}
				}
			}
			var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
			if (zavatarscale != null) {
				zavatarparts = zavatarscale.getChildren();
			}
		}
		switch (zenteranimation) {
			case '1':
				WTW.avatarShowVisible(zavatarname, zavatarparts);
				break;
			case '2':
				WTW.avatarShowFade(zavatarname, zavatarparts);
				break;
			case '3':
				WTW.avatarShowFadeSmoke(zavatarname, zavatarparts);
				break;
			case '4':
				WTW.avatarShowFadeSwirl(zavatarname, zavatarparts);
				break;
			case '5':
				WTW.avatarShowFadeSprite(zavatarname, zavatarparts);
				break;
			case '6':
				WTW.avatarShowFadeParticles(zavatarname, zavatarparts);
				break;
			case '7':
				WTW.avatarShowGrow(zavatarname, zavatarparts);
				break;
			case '8':
				WTW.avatarShowGrowGlow(zavatarname, zavatarparts);
				break;
			case '9':
				WTW.avatarShowGrowSmoke(zavatarname, zavatarparts);
				break;
			case '10':
				WTW.avatarShowGrowGlowSmoke(zavatarname, zavatarparts);
				break;
			case '11':
				WTW.avatarShowBeam(zavatarname, zavatarparts);
				break;
			default:
				WTW.avatarShowVisible(zavatarname, zavatarparts);
				break;
		}
		if (zavatarname.indexOf("myavatar") > -1) {
			WTW.switchCamera(1);
		}
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarEnter=" + ex.message);
    }
}

WTWJS.prototype.avatarMinLoadEnter = function(zavatarname) {
	try {
		var zavatarparts = [];
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
			if (zavatarscale != null) {
				zavatarparts = zavatarscale.getChildren();
			}
		}
		WTW.avatarShowVisible(zavatarname, zavatarparts);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarMinLoadEnter=" + ex.message);
    }
}

WTWJS.prototype.avatarShowVisible = function(zavatarname, zavatarparts) {
	try {
		if (zavatarparts == undefined) {
			zavatarparts = [];
			var zavatar = scene.getMeshByID(zavatarname);
			var zenteranimation = '1';
			if (zavatar != null) {
				if (zavatar.WTW != null) {
					if (zavatar.WTW.enteranimation != null) {
						if (WTW.isNumeric(zavatar.WTW.enteranimation)) {
							zenteranimation = zavatar.WTW.enteranimation;
						}
					}
				}
				var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
				if (zavatarscale != null) {
					zavatarparts = zavatarscale.getChildren();
				}
			}
		}
		for (var i=0; i<zavatarparts.length; i++) {
			if (zavatarparts[i] != null) {
				zavatarparts[i].isVisible = true;
			}
		}
		WTW.myAvatarLoadComplete(zavatarname);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowVisible=" + ex.message);
    }
}

WTWJS.prototype.avatarShowFade = function(zavatarname, zavatarparts) {
	try {
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				if (zavatarparts[i].material != null) {
					zavatarparts[i].material.alpha = 0;
				}
				zavatarparts[i].isVisible = true;
			}
		}
		var ztimername  = window.setInterval(function(){
			var zavatar = scene.getMeshByID(zavatarname);
			if (zavatar != null) {
				var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
				if (zavatarscale != null) {
					var zavatarparts = zavatarscale.getChildren();
					var zchildalpha = 0;
					for (var i=0; i<zavatarparts.length;i++) {
						if (zavatarparts[i] != null) {
							if (zavatarparts[i].material != null) {
								zchildalpha = zavatarparts[i].material.alpha;
								if (zchildalpha < 1) {
									zchildalpha += .01;
								} else {
									zchildalpha = 1;
								}
								zavatarparts[i].material.alpha = zchildalpha;
							}
						}
					} 
					if (zchildalpha == 1) {
						window.clearInterval(ztimername);
						WTW.myAvatarLoadComplete(zavatarname);
					}
				}
			}
		},10);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowFade=" + ex.message);
    }
}

WTWJS.prototype.avatarShowFadeSwirl = function(zavatarname, zavatarparts) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var ztorus1 = WTW.addMoldTorus(zavatarname + "-torus1", .5, .5, .5, 24, 20)
			ztorus1.isVisible = true;
			ztorus1.parent = zavatar;
			ztorus1.position.y += 10;
			ztorus1.rotation.z = WTW.getRadians(25);
			var ztorus2 = WTW.addMoldTorus(zavatarname + "-torus2", .5, .5, .5, 24, 20)
			ztorus2.isVisible = true;
			ztorus2.parent = zavatar;
			ztorus2.position.y += 5;
			ztorus2.rotation.z = WTW.getRadians(-25);
		}
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				if (zavatarparts[i].material != null) {
					zavatarparts[i].material.alpha = 0;
				}
				zavatarparts[i].isVisible = true;
			}
		}
		var timername  = window.setInterval(function(){
			var zavatar = scene.getMeshByID(zavatarname);
			if (zavatar != null) {
				var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
				if (zavatarscale != null) {
					var zavatarparts = zavatarscale.getChildren();
					var zchildalpha = 0;
					for (var i=0; i<zavatarparts.length;i++) {
						if (zavatarparts[i] != null) {
							if (zavatarparts[i].material != null) {
								zchildalpha = zavatarparts[i].material.alpha;
								if (zchildalpha < 1) {
									zchildalpha += .01;
								} else {
									zchildalpha = 1;
								}
								zavatarparts[i].material.alpha = zchildalpha;
							}
						}
					} 
					var ztorus1 = scene.getMeshByID(zavatarname + "-torus1");
					var ztorus2 = scene.getMeshByID(zavatarname + "-torus2");
					if (ztorus1 != null) {
						ztorus1.rotation.y += WTW.getRadians(10);
					} else {
						zchildalpha = 1;
					}
					if (ztorus2 != null) {
						ztorus2.rotation.y += WTW.getRadians(10);
					} else {
						zchildalpha = 1;
					}
					if (zchildalpha == 1) {
						WTW.disposeClean(zavatarname + "-torus1");
						WTW.disposeClean(zavatarname + "-torus2");
						window.clearInterval(timername);
						WTW.myAvatarLoadComplete(zavatarname);
					}
				}
			}
		},20);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowFadeSwirl=" + ex.message);
    }
}

WTWJS.prototype.avatarShowFadeSmoke = function(zavatarname, zavatarparts) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zsmoke = WTW.addMoldSmoke(zavatarname + "-smoke", null, .6, 1, .6);
			zsmoke.parent = zavatar;
			zsmoke.position.y -= 2;
		}
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				if (zavatarparts[i].material != null) {
					zavatarparts[i].material.alpha = 0;
				}
				zavatarparts[i].isVisible = true;
			}
		}
		window.setTimeout(function() {
			var ztimername  = window.setInterval(function(){
				var zavatar = scene.getMeshByID(zavatarname);
				if (zavatar != null) {
					var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
					if (zavatarscale != null) {
						var zavatarparts = zavatarscale.getChildren();
						var zchildalpha = 0;
						for (var i=0; i<zavatarparts.length;i++) {
							if (zavatarparts[i] != null) {
								if (zavatarparts[i].material != null) {
									zchildalpha = zavatarparts[i].material.alpha;
									if (zchildalpha < 1) {
										zchildalpha += .01;
									} else {
										zchildalpha = 1;
									}
									zavatarparts[i].material.alpha = zchildalpha;
								}
							}
						} 
						if (zchildalpha == 1) {
							var zsmoke = scene.getMeshByID(zavatarname + "-smoke");
							if (zsmoke != null) {
								zsmoke.position.y -= 1000;
								window.setTimeout(function(){WTW.disposeClean(zavatarname + "-smoke");},7000);
							}
							window.clearInterval(ztimername);
							WTW.myAvatarLoadComplete(zavatarname);
						}
					}
				}
			},30);
		},500);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowFadeSmoke=" + ex.message);
    }
}

WTWJS.prototype.avatarShowFadeParticles = function(zavatarname, zavatarparts) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zsmoke = WTW.addMoldSmoke(zavatarname + "-smoke", null, .6, 1, .6);
			zsmoke.parent = zavatar;
			zsmoke.position.y -= 2; 
		}
		var zpcs = new BABYLON.PointsCloudSystem(zavatarname + "pcs", 5, scene);
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				var zmold = BABYLON.MeshBuilder.CreateBox(zavatarname + "particles", {}, scene);
				zmold.scaling = new BABYLON.Vector3(1,1,1);
				var ztransparentmat = new BABYLON.StandardMaterial("mat" + zavatarname + "particles", scene);
				ztransparentmat.alpha = 0;
				zmold.material = ztransparentmat;
				zpcs.addSurfacePoints(zavatarparts[i], 20000, BABYLON.PointColor.UV);
				zpcs.buildMeshAsync().then((zmesh) => {
					zmesh.material.pointSize = 2;
					zmesh.material.alpha = 1;
					var zmeshtimer = window.setInterval(function(){
						if (zmesh.material.alpha > 0) {
							zmesh.material.alpha -= .01;
						} else {
							zmesh.dispose();
							window.clearInterval(zmeshtimer);
						}
					},30);
				});
				if (zavatarparts[i].material != null) {
					zavatarparts[i].material.alpha = 0;
				}
				zavatarparts[i].isVisible = true;
			}
		}
		window.setTimeout(function() {
			var ztimername  = window.setInterval(function(){
				var zavatar = scene.getMeshByID(zavatarname);
				if (zavatar != null) {
					var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
					if (zavatarscale != null) {
						var zavatarparts = zavatarscale.getChildren();
						var zchildalpha = 0;
						for (var i=0; i<zavatarparts.length;i++) {
							if (zavatarparts[i] != null) {
								if (zavatarparts[i].material != null) {
									zchildalpha = zavatarparts[i].material.alpha;
									if (zchildalpha < 1) {
										zchildalpha += .01;
									} else {
										zchildalpha = 1;
									}
									zavatarparts[i].material.alpha = zchildalpha;
								}
							}
						} 
						if (zchildalpha == 1) {
							var zsmoke = scene.getMeshByID(zavatarname + "-smoke");
							if (zsmoke != null) {
								zsmoke.position.y -= 1000;
								window.setTimeout(function(){WTW.disposeClean(zavatarname + "-smoke");},7000);
							} 
							if (zpcs != null) {
								zpcs.dispose();
								zpcs = null;
							}
							window.clearInterval(ztimername);
							WTW.myAvatarLoadComplete(zavatarname);
						}
					}
				}
			},30);
		},1000);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowFadeParticles=" + ex.message);
    }
}

WTWJS.prototype.avatarShowFadeSprite = function(zavatarname, zavatarparts) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zmold = WTW.addMoldParticleSphere(zavatarname + "-sprite", null, 2.2, 2.2, 2.2);
			zmold.parent = zavatar;
			zmold.position.y += 8;
			var zsmoke = WTW.addMoldSmoke(zavatarname + "-smoke", null, .6, 1, .6);
			zsmoke.parent = zavatar;
			zsmoke.position.y -= 2;
		}
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				if (zavatarparts[i].material != null) {
					zavatarparts[i].material.alpha = 0;
				}
				zavatarparts[i].isVisible = true;
			}
		}
		window.setTimeout(function() {
			var ztimername  = window.setInterval(function(){
				var zavatar = scene.getMeshByID(zavatarname);
				if (zavatar != null) {
					var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
					if (zavatarscale != null) {
						var zavatarparts = zavatarscale.getChildren();
						var zchildalpha = 0;
						for (var i=0; i<zavatarparts.length;i++) {
							if (zavatarparts[i] != null) {
								if (zavatarparts[i].material != null) {
									zchildalpha = zavatarparts[i].material.alpha;
									if (zchildalpha < 1) {
										zchildalpha += .01;
									} else {
										zchildalpha = 1;
									}
									zavatarparts[i].material.alpha = zchildalpha;
								}
							}
						} 
						if (zchildalpha == 1) {
							WTW.disposeClean(zavatarname + "-sprite");
							var zsmoke = scene.getMeshByID(zavatarname + "-smoke");
							if (zsmoke != null) {
								zsmoke.position.y -= 1000;
								window.setTimeout(function(){WTW.disposeClean(zavatarname + "-smoke");},7000);
							}
							window.clearInterval(ztimername);
							WTW.myAvatarLoadComplete(zavatarname);
						}
					}
				}
			},30);
		},500);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowFadeSprite=" + ex.message);
    }
}

WTWJS.prototype.avatarShowGrow = function(zavatarname, zavatarparts) {
	try {
		var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
		if (zavatarscale != null) {
			zavatarscale.scaling.x = .001;
			zavatarscale.scaling.y = .001;
			zavatarscale.scaling.z = .001;
		}
		
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				zavatarparts[i].isVisible = true;
			}
		}
		var ztimername  = window.setInterval(function(){
			var zavatar = scene.getMeshByID(zavatarname);
			if (zavatar != null) {
				var zscalingx = .04;
				var zscalingy = .04;
				var zscalingz = .04;
				if (zavatar.WTW != null) {
					if (zavatar.WTW.scaling != null) {
						if (zavatar.WTW.scaling.x != null) {
							if (WTW.isNumeric(zavatar.WTW.scaling.x)) {
								zscalingx = Number(zavatar.WTW.scaling.x);
							}
						}
						if (zavatar.WTW.scaling.y != null) {
							if (WTW.isNumeric(zavatar.WTW.scaling.y)) {
								zscalingy = Number(zavatar.WTW.scaling.y);
							}
						}
						if (zavatar.WTW.scaling.z != null) {
							if (WTW.isNumeric(zavatar.WTW.scaling.z)) {
								zscalingz = Number(zavatar.WTW.scaling.z);
							}
						}
					}
				}
				var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
				if (zavatarscale != null) {
					var zsetscalingx = zavatarscale.scaling.x;
					var zsetscalingy = zavatarscale.scaling.y;
					var zsetscalingz = zavatarscale.scaling.z;
					if (zsetscalingx < zscalingx) {
						zavatarscale.scaling.x += .001;
					} else {
						zsetscalingx = zscalingx;
						zavatarscale.scaling.x = zscalingx;
					}
					if (zsetscalingy < zscalingy) {
						zavatarscale.scaling.y += .001;
					} else {
						zsetscalingy = zscalingy;
						zavatarscale.scaling.y = zscalingy;
					}
					if (zsetscalingz < zscalingz) {
						zavatarscale.scaling.z += .001;
					} else {
						zsetscalingz = zscalingz;
						zavatarscale.scaling.z = zscalingz;
					}
					if (zsetscalingx == zscalingx && zsetscalingy == zscalingy && zsetscalingz == zscalingz) {
						window.clearInterval(ztimername);
						WTW.myAvatarLoadComplete(zavatarname);
					}
				}
			}
		},10);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowGrow=" + ex.message);
    }
}

WTWJS.prototype.avatarShowGrowSmoke = function(zavatarname, zavatarparts) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zsmoke = WTW.addMoldSmoke(zavatarname + "-smoke", null, .6, .5, 2);
			zsmoke.parent = zavatar;
			zsmoke.position.y -= 2;
		}
		var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
		if (zavatarscale != null) {
			zavatarscale.scaling.x = .001;
			zavatarscale.scaling.y = .001;
			zavatarscale.scaling.z = .001;
		}
		
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				zavatarparts[i].isVisible = true;
			}
		}
		window.setTimeout(function() {
			var ztimername  = window.setInterval(function(){
				var zavatar = scene.getMeshByID(zavatarname);
				if (zavatar != null) {
					var zscalingx = .04;
					var zscalingy = .04;
					var zscalingz = .04;
					if (zavatar.WTW != null) {
						if (zavatar.WTW.scaling != null) {
							if (zavatar.WTW.scaling.x != null) {
								if (WTW.isNumeric(zavatar.WTW.scaling.x)) {
									zscalingx = Number(zavatar.WTW.scaling.x);
								}
							}
							if (zavatar.WTW.scaling.y != null) {
								if (WTW.isNumeric(zavatar.WTW.scaling.y)) {
									zscalingy = Number(zavatar.WTW.scaling.y);
								}
							}
							if (zavatar.WTW.scaling.z != null) {
								if (WTW.isNumeric(zavatar.WTW.scaling.z)) {
									zscalingz = Number(zavatar.WTW.scaling.z);
								}
							}
						}
					}
					var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
					if (zavatarscale != null) {
						var zsetscalingx = zavatarscale.scaling.x;
						var zsetscalingy = zavatarscale.scaling.y;
						var zsetscalingz = zavatarscale.scaling.z;
						if (zsetscalingx < zscalingx) {
							zavatarscale.scaling.x += .001;
						} else {
							zsetscalingx = zscalingx;
							zavatarscale.scaling.x = zscalingx;
						}
						if (zsetscalingy < zscalingy) {
							zavatarscale.scaling.y += .001;
						} else {
							zsetscalingy = zscalingy;
							zavatarscale.scaling.y = zscalingy;
						}
						if (zsetscalingz < zscalingz) {
							zavatarscale.scaling.z += .001;
						} else {
							zsetscalingz = zscalingz;
							zavatarscale.scaling.z = zscalingz;
						}
						if (zsetscalingx == zscalingx && zsetscalingy == zscalingy && zsetscalingz == zscalingz) {
							var zsmoke = scene.getMeshByID(zavatarname + "-smoke");
							if (zsmoke != null) {
								zsmoke.position.y -= 1000;
								window.setTimeout(function(){WTW.disposeClean(zavatarname + "-smoke");},7000);
							}
							window.clearInterval(ztimername);
							WTW.myAvatarLoadComplete(zavatarname);
						}
					}
				}
			},40);
		},300);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowGrowSmoke=" + ex.message);
    }
}

WTWJS.prototype.avatarShowGrowGlow = function(zavatarname, zavatarparts) {
	try {
		if (WTW.highlightLayer == null) {
			WTW.highlightLayer = new BABYLON.HighlightLayer("highlightlayer", scene);
		}
		var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
		if (zavatarscale != null) {
			zavatarscale.scaling.x = .001;
			zavatarscale.scaling.y = .001;
			zavatarscale.scaling.z = .001;
			for (var i=0; i<zavatarparts.length;i++) {
				if (zavatarparts[i] != null) {
					zavatarparts[i].isVisible = true;
					try {
						WTW.highlightLayer.addMesh(zavatarparts[i], BABYLON.Color3.Yellow());
					} catch(ex){}
				}
			} 
		}
		var ztimername  = window.setInterval(function(){
			var zavatar = scene.getMeshByID(zavatarname);
			if (zavatar != null) {
				var zscalingx = .04;
				var zscalingy = .04;
				var zscalingz = .04;
				if (zavatar.WTW != null) {
					if (zavatar.WTW.scaling != null) {
						if (zavatar.WTW.scaling.x != null) {
							if (WTW.isNumeric(zavatar.WTW.scaling.x)) {
								zscalingx = Number(zavatar.WTW.scaling.x);
							}
						}
						if (zavatar.WTW.scaling.y != null) {
							if (WTW.isNumeric(zavatar.WTW.scaling.y)) {
								zscalingy = Number(zavatar.WTW.scaling.y);
							}
						}
						if (zavatar.WTW.scaling.z != null) {
							if (WTW.isNumeric(zavatar.WTW.scaling.z)) {
								zscalingz = Number(zavatar.WTW.scaling.z);
							}
						}
					}
				}
				var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
				if (zavatarscale != null) {
					var setscalingx = zavatarscale.scaling.x;
					var setscalingy = zavatarscale.scaling.y;
					var setscalingz = zavatarscale.scaling.z;
					if (setscalingx < zscalingx) {
						zavatarscale.scaling.x += .001;
					} else {
						setscalingx = zscalingx;
						zavatarscale.scaling.x = zscalingx;
					}
					if (setscalingy < zscalingy) {
						zavatarscale.scaling.y += .001;
					} else {
						setscalingy = zscalingy;
						zavatarscale.scaling.y = zscalingy;
					}
					if (setscalingz < zscalingz) {
						zavatarscale.scaling.z += .001;
					} else {
						setscalingz = zscalingz;
						zavatarscale.scaling.z = zscalingz;
					}
					if (setscalingx == zscalingx && setscalingy == zscalingy && setscalingz == zscalingz) {
						var zavatarparts = zavatarscale.getChildren();
						for (var i=0; i<zavatarparts.length;i++) {
							if (zavatarparts[i] != null) {
								try {
									WTW.highlightLayer.removeMesh(zavatarparts[i]);
								} catch(ex){}
							}
						} 
						window.clearInterval(ztimername);
						WTW.myAvatarLoadComplete(zavatarname);
					}
				}
			}
		},10);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowGrowGlow=" + ex.message);
    }
}

WTWJS.prototype.avatarShowGrowGlowSmoke = function(zavatarname, zavatarparts) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zsmoke = WTW.addMoldSmoke(zavatarname + "-smoke", null, .6, .5, 2);
			zsmoke.parent = zavatar;
			zsmoke.position.y -= 2;
		}
		var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
		if (zavatarscale != null) {
			zavatarscale.scaling.x = .001;
			zavatarscale.scaling.y = .001;
			zavatarscale.scaling.z = .001;
		}
		if (WTW.highlightLayer == null) {
			WTW.highlightLayer = new BABYLON.HighlightLayer("highlightlayer", scene);
		}
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				zavatarparts[i].isVisible = true;
				try {
					WTW.highlightLayer.addMesh(zavatarparts[i], BABYLON.Color3.Gray());
					WTW.highlightLayer.outerGlow = true;
					WTW.highlightLayer.innerGlow = false;
				} catch(ex){}
			}
		}
		window.setTimeout(function() {
			var ztimername  = window.setInterval(function(){
				var zavatar = scene.getMeshByID(zavatarname);
				if (zavatar != null) {
					var zscalingx = .04;
					var zscalingy = .04;
					var zscalingz = .04;
					if (zavatar.WTW != null) {
						if (zavatar.WTW.scaling != null) {
							if (zavatar.WTW.scaling.x != null) {
								if (WTW.isNumeric(zavatar.WTW.scaling.x)) {
									zscalingx = Number(zavatar.WTW.scaling.x);
								}
							}
							if (zavatar.WTW.scaling.y != null) {
								if (WTW.isNumeric(zavatar.WTW.scaling.y)) {
									zscalingy = Number(zavatar.WTW.scaling.y);
								}
							}
							if (zavatar.WTW.scaling.z != null) {
								if (WTW.isNumeric(zavatar.WTW.scaling.z)) {
									zscalingz = Number(zavatar.WTW.scaling.z);
								}
							}
						}
					}
					var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
					if (zavatarscale != null) {
						var zsetscalingx = zavatarscale.scaling.x;
						var zsetscalingy = zavatarscale.scaling.y;
						var zsetscalingz = zavatarscale.scaling.z;
						if (zsetscalingx < zscalingx) {
							zavatarscale.scaling.x += .001;
						} else {
							zsetscalingx = zscalingx;
							zavatarscale.scaling.x = zscalingx;
						}
						if (zsetscalingy < zscalingy) {
							zavatarscale.scaling.y += .001;
						} else {
							zsetscalingy = zscalingy;
							zavatarscale.scaling.y = zscalingy;
						}
						if (zsetscalingz < zscalingz) {
							zavatarscale.scaling.z += .001;
						} else {
							zsetscalingz = zscalingz;
							zavatarscale.scaling.z = zscalingz;
						}
						if (zsetscalingx == zscalingx && zsetscalingy == zscalingy && zsetscalingz == zscalingz) {
							var zsmoke = scene.getMeshByID(zavatarname + "-smoke");
							if (zsmoke != null) {
								zsmoke.position.y -= 1000;
								window.setTimeout(function(){WTW.disposeClean(zavatarname + "-smoke");},7000);
							}
							var zavatarparts = zavatarscale.getChildren();
							for (var i=0; i<zavatarparts.length;i++) {
								if (zavatarparts[i] != null) {
									try {
										WTW.highlightLayer.removeMesh(zavatarparts[i]);
									} catch(ex){}
								}
							} 
							window.clearInterval(ztimername);
							WTW.myAvatarLoadComplete(zavatarname);
						}
					}
				}
			},40);
		},300);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowGrowGlowSmoke=" + ex.message);
    }
}

WTWJS.prototype.avatarShowBeam = function(zavatarname, zavatarparts) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zmold = WTW.addMoldParticleShower(zavatarname + "-sprite", null, 1, 2.4, 1);
			zmold.parent = zavatar;
			zmold.position.y += 3;
		}
		for (var i=0; i<zavatarparts.length;i++) {
			if (zavatarparts[i] != null) {
				if (zavatarparts[i].material != null) {
					zavatarparts[i].material.alpha = 0;
				}
				zavatarparts[i].isVisible = true;
			}
		}
		window.setTimeout(function() {
			var ztimername  = window.setInterval(function(){
				var zavatar = scene.getMeshByID(zavatarname);
				if (zavatar != null) {
					var zavatarscale = scene.getMeshByID(zavatarname + "-scale");
					if (zavatarscale != null) {
						var zavatarparts = zavatarscale.getChildren();
						var zchildalpha = 0;
						for (var i=0; i<zavatarparts.length;i++) {
							if (zavatarparts[i] != null) {
								if (zavatarparts[i].material != null) {
									zchildalpha = zavatarparts[i].material.alpha;
									if (zchildalpha < 1) {
										zchildalpha += .01;
									} else {
										zchildalpha = 1;
									}
									zavatarparts[i].material.alpha = zchildalpha;
								}
							}
						} 
						if (zchildalpha == 1) {
							WTW.disposeClean(zavatarname + "-sprite");
							window.clearInterval(ztimername);
							WTW.myAvatarLoadComplete(zavatarname);
						}
					}
				}
			},50);
		},1500);
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-avatarShowBeam=" + ex.message);
    }
}

WTWJS.prototype.loadSit = function(zavatarname) {
	try {
		var zuseravataranimationid = "cccccccccccccccc";
		var zavataranimationid = "dddddddddddddddd";
		WTW.loadAvatarAnimation(zavatarname, zuseravataranimationid, 'Sit Wait', '', zavataranimationid, 'onsitwait', '/content/system/animations/movement/', 'sitwait.babylon', 1, 155, 1, 0, 0);
    } catch (ex) {
		WTW.log("avatars-loadavatar-loadSit=" + ex.message);
    }
}

WTWJS.prototype.startSit = function(zmoldname) {
	try {	
		var zavatarname = "myavatar-" + dGet("wtw_tinstanceid").value;
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zmoldnameparts = WTW.getMoldnameParts(zmoldname);
			var zactionzonename = zmoldnameparts.parentname;
			var zactionzoneaxle = scene.getMeshByID(zactionzonename.replace("actionzoneaxlebase-","actionzoneaxle-"));
			if (zactionzoneaxle != null) {
				WTW.walkToPosition(zavatarname, zactionzoneaxle, 'WTW.setSit', zactionzoneaxle);
			}
		}
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-startSit=" + ex.message);
    }
}

WTWJS.prototype.setSit = function(zmoldtomatch) {
	try {	
		/* walk to position, rotate then */
/*						
		WTW.keyPressedAdd('onsitwait');
		var zsitdist = 0;
		var zsitmove = window.setInterval(function() {
			avatar.translate(BABYLON.Axis.Z, .1, BABYLON.Space.LOCAL);
			if (zsitdist > 4.4) {
				window.clearInterval(zsitmove);
			} else {
				zsitdist += .1;
			}
		},10); 
*/					
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-setSit=" + ex.message);
    }
}

WTWJS.prototype.walkToPosition = function(zavatarname, zmoldtomatch, zfunctionname, zparameters) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zabspos = WTW.getWorldPosition(zmoldtomatch);
			var zabsrot = WTW.getWorldRotation(zmoldtomatch);

			if (zavatar.position != zabspos) {
				var zangledegy = WTW.cleanDegrees(WTW.getDegrees(Math.atan((zabspos.x-zavatar.position.x)/(zabspos.z-zavatar.position.z))) + 180);
				var zavatardeg = WTW.getDegrees(zavatar.rotation.y);
				var moveavatar = window.setInterval(function(){
					var targetangle = WTW.getMyAngleToPoint(zabspos.x,zabspos.z);
					var zavatardeg = WTW.getDegrees(zavatar.rotation.y);
					var zdir = 1;
					var zdegleft = 0;
					var zwalk = 1;
					var zdx = (zabspos.x - zavatar.position.x);
					var zdz = (zabspos.z - zavatar.position.z);
					var zdist = Math.sqrt((zdx * zdx) + (zdz * zdz));
					if (Math.round(targetangle) == 0 || Math.round(targetangle) == 360 || zdist < 3) {
						zdir = 0;
					} else if (targetangle < 1) {
						zdir = -.1;
						zdegleft = targetangle;
					} else if (targetangle < 2) {
						zdir = -.5;
						zdegleft = targetangle;
					} else if (targetangle < 10) {
						zdir = -1;
						zdegleft = targetangle;
					} else if (targetangle < 30) {
						zdir = -5;
						zdegleft = targetangle;
					} else if (targetangle < 90) {
						zdir = -10;
						zdegleft = targetangle;
					} else if (targetangle < 180) {
						zdir = -15;
						zdegleft = targetangle;
					} else {
						zdegleft = 360 - targetangle;
					}
					zavatardeg += zdir;
					zavatar.rotation.y = WTW.getRadians(zavatardeg);
					if (zdist < 3) {
						zwalk = 0;
						WTW.keyPressedRemove('onwalk');
					} else {
						WTW.keyPressedAdd('onwalk');
					}
					if (zdegleft < 3 && zwalk == 0) {
						window.clearInterval(moveavatar);
						zavatar.position.x = zabspos.x;
						zavatar.position.z = zabspos.z;
						WTW.executeFunctionByName(zfunctionname, window, zparameters);
					}
				},10);
			} else {
				WTW.executeFunctionByName(zfunctionname, window, zparameters);
			}
		}
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-walkToPosition=" + ex.message);
    }
}

WTWJS.prototype.turnToRotation = function(zavatarname, zmoldtoface, zfunctionname, zparameters) {
	try {
		var zavatar = scene.getMeshByID(zavatarname);
		if (zavatar != null) {
			var zabspos = WTW.getWorldPosition(zmoldtoface);
			var zangle = WTW.getMyAngleToPoint(zabspos.x, zabspos.z);
			
			var zmoveavatar = window.setInterval(function(){
				var ztargetangle = WTW.getMyAngleToPoint(zabspos.x,zabspos.z);
				var zavatardeg = WTW.getDegrees(zavatar.rotation.y);
				var zdir = 1;
				var zdegleft = 0;
				if (Math.round(ztargetangle) == 0 || Math.round(ztargetangle) == 360) {
					zdir = 0;
				} else if (ztargetangle < 2) {
					zdir = -ztargetangle;
					zdegleft = ztargetangle;
				} else if (ztargetangle < 180) {
					zdir = -1;
					zdegleft = ztargetangle;
				} else {
					zdegleft = 360 - ztargetangle;
				}
				zavatardeg += zdir;
				zavatar.rotation.y = WTW.getRadians(zavatardeg);
				if (zdir > 1) {
					WTW.keyPressedAdd('onrunturnright');
				} else {
					WTW.keyPressedAdd('onrunturnleft');
				}
				if (zdegleft < 1) {
					window.clearInterval(zmoveavatar);
					WTW.keyPressedRemove('onrunturnright');
					WTW.keyPressedRemove('onrunturnleft');
					WTW.executeFunctionByName(zfunctionname, window, zparameters);
				}
			},10);			
		}
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-turnToRotation=" + ex.message);
    }
}

WTWJS.prototype.cancelSit = function(zavatar, zmoveevents) {
	try {
		if (WTW.isInMovementEvents(zmoveevents, 'onsitwait')) {
			WTW.keyPressedAdd('onwait');
			WTW.keyPressedRemove('onsitwait');
			var zdist = 0;
			var zsitmove = window.setInterval(function() {
				var zmovedist = -.1;
				if (zdist < .5) {
					zmovedist = -.5;
				}
				zavatar.translate(BABYLON.Axis.Z, zmovedist, BABYLON.Space.LOCAL);
				if (zdist < -4.4) {
					window.clearInterval(zsitmove);
					WTW.keyPressedRemove('onwait');
				} else {
					zdist += zmovedist;
				}
			},10);
		}
    } catch (ex) {
		WTW.log("core-scripts-avatars-wtw_transitionsavatars.js-cancelSit=" + ex.message);
    }
}
