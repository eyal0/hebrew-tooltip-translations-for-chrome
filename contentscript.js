window.addEventListener("load",
  (function() {
    //globals
    var HTTtimeoutID;
    var HTTelem;
    var HTTcurX;
    var HTTcurY;
    var HTTtooltip;
    var HTTdefinitions = ""; //translation output
    var HTToptions;

    //helper functions
    function appendChild(child,parent){return(parent.insertBefore(child,parent.lastChild.nextSibling));}

    function HTTshowToolTip() {
      if(HTTdefinitions.length) {
        var minX, minY, maxX, maxY, ttX, ttY;

        HTTtooltip.style.width = "auto";
        HTTtooltip.style.height = "auto";
        HTTtooltip.innerHTML = HTTdefinitions;
        HTTtooltip.firstChild.style.marginTop = "0";
        HTTtooltip.firstChild.style.marginRight = "0";
        HTTtooltip.firstChild.style.marginBottom = "0";
        HTTtooltip.firstChild.style.marginLeft = "0";
        ttX = HTTcurX + window.scrollX;
        ttY = HTTcurY + window.scrollY;
        if(HTToptions['align_left']) {
          ttX += 10;
        } else {
          ttX -= HTTtooltip.scrollWidth + 10;
        }
        if(HTToptions['align_top']) {
          ttY += 10;
        } else {
          ttY -= HTTtooltip.scrollHeight + 10;
        }
        minX = window.scrollX;
        minY = window.scrollY;
        maxX = minX + window.innerWidth - HTTtooltip.scrollWidth;
        maxY = minY + window.innerHeight - HTTtooltip.scrollHeight;
        if(HTToptions['keep_on_screen']) {
          if(ttX < minX)
            ttX = minX;
          else if(ttX > maxX)
            ttX = maxX;
          if(ttY < minY)
            ttY = minY;
          else if(ttY > maxY)
            ttY = maxY;
        }
        HTTtooltip.style.left = ttX + "px";
        HTTtooltip.style.top = ttY + "px";

        HTTtooltip.style.visibility="visible";
      }
    }

    function HTTparseResponse(responseText) {
      var startText;
      var endPos;
      var rtl;

      if(responseText == null) return;
      startText = responseText.indexOf("word_ph");
      if(startText != -1) {
        //we've got something
        if(responseText.indexOf('word_ph translation_en') != -1)
          rtl = false; //search of an English word
        else
          rtl = true; //search of a Hebrew word
        HTTdefinitions = "";
        HTTdefinitions += "<table class='HTT " + (rtl?"HTTHebrew":"HTTEnglish") + "' dir=\"\"><tbody class='HTT " + (rtl?"HTTHebrew":"HTTEnglish") + "' dir=\"\">\n";
        startText = 0;
        while(responseText.indexOf("word_ph", startText) != -1) {
          //first the original word
          startText = responseText.indexOf('<span class="word"', startText);
          startText = responseText.indexOf(">", startText) + 1;
          endText = responseText.indexOf("</span>", startText);
          HTTdefinitions += "<tr class='HTT'><td class='HTT HTTWord " + (rtl?"HTTHebrew":"HTTEnglish") + "'>" + responseText.substring(startText, endText) + "</td>\n";

          //now the part of speech
          startText = responseText.indexOf('<span class="diber"', endText);
          startText = responseText.indexOf(">", startText) + 1;
          endText = responseText.indexOf("</span>", startText);
          HTTdefinitions += "<td class='HTT HTTPartOfSpeech " + (rtl?"HTTHebrew":"HTTEnglish") + "'>" + responseText.substring(startText, endText) + "</td>\n";

          //finally the definition
          startText = responseText.indexOf("<div", endText);
          HTTdefinitions += "<td class='HTT HTTDefinition " + (!rtl?"HTTHebrew":"HTTEnglish") + "'>";
          if(responseText.indexOf('default_trans', startText) != -1 && responseText.indexOf('default_trans', startText) < responseText.indexOf('</div>', startText)) {
            startText = responseText.indexOf('default_trans', startText);
          }
          startText = responseText.indexOf('>', startText) + 1;
          endText = responseText.indexOf('</div>', startText);
          HTTdefinitions += responseText.substring(startText, endText);
          HTTdefinitions += "</td></tr>\n";
        }
        HTTdefinitions += "</tbody></table>";
      }
      HTTshowToolTip();
    }

    function HTTtranslateWord(input) {
      var HTTreq;

      chrome.extension.sendRequest({'action' : 'xhr', 'url' : 'http://morfix.mako.co.il/default.aspx?q=' + escape(input)}, HTTparseResponse);
    }

    function getStringOffsetFromPoint(elem, x, y) {
      if(elem.nodeType == elem.TEXT_NODE) {
        var range = elem.ownerDocument.createRange();
        range.selectNodeContents(elem);
        var str = range.toString();
        var currentPos = 0;
        var endPos = range.endOffset;
        //can't binary search because the rectangles are complicated, two-dimensional
        while(currentPos < endPos) {
          range.setStart(elem, currentPos);
          range.setEnd(elem, currentPos+1);
          if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
             range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
            range.detach();
            return({'string' : str, 'offset' : currentPos, 'text_node' : elem});
          }
          currentPos += 1;
        }
      } else {
        for(var i = 0; i < elem.childNodes.length; i++) {
          var range = elem.childNodes[i].ownerDocument.createRange();
          range.selectNodeContents(elem.childNodes[i]);
          if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
             range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
            range.detach();
            var ret = getStringOffsetFromPoint(elem.childNodes[i], x, y);
            if(ret)
              return(ret);
          } else {
            range.detach();
          }
        }
      }
      return(null);
    }

    function HTTgetWord() {
      var text = "";
      var str_offset = getStringOffsetFromPoint(HTTelem, HTTcurX, HTTcurY);
      if(str_offset) {
        var range = window.getSelection();
        if(range && //there is a range
           range.toString != "" && //there is text selected
           range.anchorNode == range.focusNode && //it's just a single node
           str_offset.text_node == range.anchorNode && //it's the same node as the one under the cursor
           ((range.baseOffset < range.focusOffset && range.baseOffset <= str_offset.offset && str_offset.offset <= range.focusOffset) || //offset is inside the selected region
            (range.focusOffset < range.baseOffset && range.focusOffset <= str_offset.offset && str_offset.offset <= range.baseOffset))) {
          text = range.toString();
        } else {
          var str = str_offset.string;
          var start = str_offset.offset;
          var end = start + 1;
          var valid_word = /^((\w)+|([\u0590-\u05ff\"\']+))$/;
          if(!valid_word.test(str.substring(start, end)))
            return null;
          while(start > 0 && valid_word.test(str.substring(start - 1, end)))
            start--;
          while(end < str.length && valid_word.test(str.substring(start, end+1)))
            end++;
          text = str.substring(start, end);
        }
      }
      HTTtranslateWord(text);
    }

    function HTTmousescroll(event) {
      HTTmousemove(event);
    }

    function HTThide(force) {
      if(HTTtimeoutID || force) {
        HTTdefinitions = "";
        HTTtooltip.style.visibility = "hidden";
        HTTtooltip.innerHTML = HTTdefinitions;
        HTTtooltip.style.left = 0 + "px";
        HTTtooltip.style.top = 0 + "px";
        HTTtooltip.style.width = 0 + "px";
        HTTtooltip.style.height = 0 + "px";
        window.clearTimeout(HTTtimeoutID);
        HTTtimeoutID = 0;
      }
    }

    function HTTkeypress(event) {
      var e = event;
      
      //GM_log("got keypress");
      HTThide(true); //hide the old one if there is one

      var keynum;
      var keychar;
      var numcheck;
      var text;

      if(window.event) // IE
        keynum = e.keyCode;
      else if(e.which) // Netscape/Firefox/Opera
        keynum = e.which;

      keychar = String.fromCharCode(keynum);
      //GM_log("keychar is " + keychar);
      if(keychar == HTToptions['HTTtooltipCharacter']) {
        //GM_log("match");
        if(window.getSelection() != '') {
          //GM_log("translating phrase " + window.getSelection());
          HTTtranslateWord(window.getSelection());
        } else {
          HTTgetWord(); //get the word under the cursor right now and translate it
        }
      }
      return;
    }

    function HTTmouseup(event) {
      var e = event;
      
      if(window.getSelection() == '')
        return; //nothing to do
      //GM_log("got mouseup " + window.getSelection());
      HTThide(true); //hide the old one if there is one

      //variables for use in displaying the translation
      HTTcurX=e.clientX;
      HTTcurY=e.clientY;
      //GM_log("try to translate " + window.getSelection());
      HTTtranslateWord(window.getSelection());
      return;
    }

    function HTTclick(event) {
      var e = event;

      //click is used by many handlers, mostly to hide the tooltip
      //variables for use in displaying the translation
      HTTelem = e.target;
      HTTcurX = e.clientX;
      HTTcurY = e.clientY;

      //GM_log("got click");
      HTThide(true); //hide the old one if there is one
      if(!HTToptions['trigger_click'])
        return; //just hide and finished

      //variables for use in finding the word
      HTTgetWord(); //get the word under the cursor right now
      return;
    }

    function HTTmousemove(event) {
      var e = event;
      if(e.target == HTTelem && e.clientX == HTTcurX && e.clientY == HTTcurY) return; //no real movement
      //variables for use in finding the word and displaying the translation
      HTTelem = e.target;
      HTTcurX = e.clientX;
      HTTcurY = e.clientY;
      //every movement of the mouse restarts the timer and removes the tooltip
      HTThide();
      if(!HTToptions['trigger_hover'])
        return; //only used this to get the last_mouse_event (location)
      HTTtimeoutID = window.setTimeout(HTTgetWord, HTToptions['HTTtooltipDelay']);
      return;
    }

    function HTTinit () {
      chrome.extension.sendRequest({'action' : 'localStorage_get', 'attribute' : 'options'}, HTToptions_callback);
      //don't continue until the callback completes
    }

    function HTToptions_callback(options) {
      HTToptions = options;
      if(!HTToptions) {
        HTToptions = {'trigger_hover' : 1,
                      'HTTtooltipDelay' : 1000,
                      'trigger_click' : 0,
                      'trigger_highlight' : 0,
                      'trigger_keyboard' : 0,
                      'HTTtooltipCharacter' : "T",
                      'align_top' : 1,
                      'align_left' : 1,
                      'keep_on_screen' : 1};
      }
      if(HTToptions['trigger_hover']) {
        window.addEventListener("mousemove", HTTmousemove, false);
        window.addEventListener("scroll", HTTmousescroll, false);
        window.addEventListener("click", HTTclick, false);
      }
      if(HTToptions['trigger_click']) {
        window.addEventListener("click", HTTclick, false);
      }
      if(HTToptions['trigger_highlight']) {
        window.addEventListener("mouseup", HTTmouseup, false);
        window.addEventListener("click", HTTclick, false);
      }
      if(HTToptions['trigger_keyboard']) {
        window.addEventListener("keypress", HTTkeypress, false);
        window.addEventListener("click", HTTclick, false);
        window.addEventListener("mousemove", HTTmousemove, false);
      }

      HTTtooltip = document.createElement("div");
      HTTtooltip.className = "HTT HTTtooltip"; //for use by users that might do things with stylish
      document.body.insertBefore(HTTtooltip, document.body.firstChild);
    }

    HTTinit();
  }),false);