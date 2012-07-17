// Time-stamp: <2012-07-17 13:38 kyloma>
//
// ==UserScript==
// @name           ServiceNow-linker
// @namespace      http://userscripts.org/users/?
// @description    Turns service now ticket numbers into links to service now
// @include        *
// ==/UserScript==


//Casey Watts would like to thank ferk for the apt-linker implementation of James Padolsey's findAndReplace function



// I would like to thank James Padolsey (http://james.padolsey.com/)
// for the findAndReplace function

// Copyright (C) 2009 Fernando Carmona Varo
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// The GNU General Public License is available by visiting
//   http://www.gnu.org/copyleft/gpl.html
// or by writing to
//   Free Software Foundation, Inc.
//   51 Franklin Street, Fifth Floor
//   Boston, MA  02110-1301
//   USA



/* == findAndReplace ==
 * (By James Padolsey  http://james.padolsey.com/javascript/find-and-replace-text-with-javascript/)
 *
 * No library or framework is required to use this function, it's entirely stand-alone. The function requires
 * two parameters, the third one is optional:
 *
 * * searchText - This can either be a string or a regular expression. Either way, it will eventually become a
 *   RegExp object. So, if you wanted to search for the word "and" then that alone would not be appropriate - all
 * words that contain "and" would be matched so you need to use either the string, \\band\\b or the regular
 * expression, /\band\b/g to test for word boundaries. (remember the global flag)
 *
 * * replacement - This parameter will be directly passed to the String.replace function, so you can either have
 *  a string replacement (using $1, $2, $3 etc. for backreferences) or a function.
 *
 * * searchNode - This parameter is mainly for internal usage but you can, if you so desire, specify the node
 * under which the search will take place. By default it's set to document.body.
 */


//function injectit (){

  function findAndReplace(searchText, replacement, searchNode) {
    if (!searchText || typeof replacement === 'undefined') {
      // Throw error here if you want...
      return;
    }
    var regex = typeof searchText === 'string' ?
      new RegExp(searchText, 'g') : searchText,
    childNodes = (searchNode || document.body).childNodes,
    cnLength = childNodes.length,
    excludes = 'html,head,style,title,link,meta,script,object,iframe,textarea';
    while (cnLength--) {
      var currentNode = childNodes[cnLength];
      if (currentNode.nodeType === 1 &&
          (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
        arguments.callee(searchText, replacement, currentNode);
      }
      if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
        continue;
      }
      var parent = currentNode.parentNode,
      frag = (function(){
        var html = currentNode.data.replace(regex, replacement),
        wrap = document.createElement('div'),
        frag = document.createDocumentFragment();
        wrap.innerHTML = html;
        while (wrap.firstChild) {
          frag.appendChild(wrap.firstChild);
        }
        return frag;
      })();
      parent.insertBefore(frag, currentNode);
      parent.removeChild(currentNode);
    }
  }

  function findAndReplaceNetIDs(){
    findAndReplace('\\b[A-z]{2,4}\\d{1,4}\\b',
                   '<a href=\"http://directory.yale.edu/phonebook/index.htm?searchString=netid%3D$&\" target=\"_blank\">$&</a>'
                   //function(netid) {
                   //return '<a href="http://directory.yale.edu/phonebook/index.htm?searchString=netid%3D' + netid + '">' + netid + '</a>'
                   //}
                   //"lol"
                  );
  }


//}


//function putscriptiniframe(theframe, injectit){
  //var script = document.createElement( 'script' );
  //script.type = 'text/javascript';
  //script.text = injectit;
  //jQuery(theframe).append( script );
//}



//injectit(); // on normal page
//putscriptiniframe('iframe#gsft_main', injectit); // in iframe
//jQuery('iframe#gsft_main').findAndReplaceNetIDs()



jQuery(document).ready(function(){findAndReplaceNetIDs()}) //call as a standalone page
jQuery("iframe#gsft_main").load(function(){findAndReplaceNetIDs()}) //call when navigationg within service now (which changes this particular iframe)


//for migration tool
setTimeout(function(){// do it again after other js has gotten out of the way
  findAndReplaceNetIDs()
},2000)

