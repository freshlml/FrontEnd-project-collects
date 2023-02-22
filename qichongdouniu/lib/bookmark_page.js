// bookmark_page.js, ver. 1.0
// visit: www.pdfhacks.com/bookmark_page/
// edit:cjs 2008-02-17 
// 1 修改为中文标签
// 2 设置书签时可以自动获取当前的书名
// 3 自动获取当前所在的页码与总页数,方便查阅
// 4 实现更多功能可以参看Adobe Reader的SDK


// use this delimiter for serializing our array
var bp_delim= '%#%#';

function SaveData( data ) 
{
// data is an array of arrays that needs
// to be serialized and stored into a persistent
// global string
var ds= '';
for( ii= 0; ii< data.length; ++ii )
{
   for( jj= 0; jj< 3; ++jj ) 
   {
    if( ii!= 0 || jj!= 0 )
     ds+= bp_delim;
    ds+= data[ii][jj];
   }
}
global.pdf_hacks_js_bookmarks= ds;
global.setPersistent( "pdf_hacks_js_bookmarks", true );
}

function GetData() {
// reverse of SaveData; return an array of arrays
if( global.pdf_hacks_js_bookmarks== null ) {
   return new Array(0);
}

var flat= global.pdf_hacks_js_bookmarks.split( bp_delim );
var data= new Array();
for( ii= 0; ii< flat.length; ) {
   var record= new Array();
   for( jj= 0; jj< 3 && ii< flat.length; ++ii, ++jj ) {
    record.push( flat[ii] );
   }
   if( record.length== 3 ) {
    data.push( record );
   }
}
return data;
}

//Get Current Date
function DateNow(){
var d, s ;
d = new Date();
s = d.getFullYear()+"/";
s += (d.getMonth() + 1) + "/";
s += d.getDate() ;
/**//*
   s += d.getHours() + ":";
   s += d.getMinutes() + ":";
   s += d.getSeconds() ;
*/
return(s);
}


function AddBookmark() {
// query the user for a name, and then combine it with
// the current PDF page to create a record; store this record
var thisfilename=this.documentFileName;
thisfilename=thisfilename.substr(0,thisfilename.lastIndexOf("."));
var numPlugInss=this.pageNum+1;
var currentdate=DateNow();
var label= 
   app.response( "书签名称,可以修改以便于记忆:",
   "书签名称",
   "《"+thisfilename+"》第 "+numPlugInss+" 页/共 "+this.numPages+" 页 "+currentdate,
   false );
if( label!= null ) {
   var record= new Array(3);
   record[0]= label;
   record[1]= this.path;
   record[2]= this.pageNum;
   data= GetData();
   data.push( record );
   SaveData( data );
}
}

function ShowBookmarks() {
// show a pop-up menu; this seems to only work when
// a PDF is alreay in the viewer;
var data= GetData();
var items= '';
for( ii= 0; ii< data.length; ++ii ) {
   if( ii!= 0 )
    items+= ', ';
   items+= '"'+ ii+ ': '+ data[ii][0]+ '"';
}
// assemble the command and the execute it with eval()
var command= 'app.popUpMenu( '+ items+ ' );';
var selection= eval( command );
if( selection== null ) {
   return; // exit
}

// the user made a selection; parse out its index and use it
// to access the bookmark record
var index= 0;
// toString() converts the String object to a string literal
// eval() converts the string literal to a number
index= eval( selection.substring( 0, selection.indexOf(':') ).toString() );
if( index< data.length ) {
   try {
    // the document must be 'disclosed' for us to have any access
    // to its properties, so we use these FirstPage NextPage calls
    //
    app.openDoc( data[index][1] );
    app.execMenuItem( "FirstPage" );
    for( ii= 0; ii< data[index][2]; ++ii ) {
     app.execMenuItem( "NextPage" );
    }
   }
   catch( ee ) {
    var response= 
     app.alert("打开书签错误. 是否删除本书签?", 2, 2,"删除书签");
    if( response== 4 && index< data.length ) {
     data.splice( index, 1 );
     SaveData( data );
    }
   }
}
}

function DropBookmark() {
// modelled after ShowBookmarks()
var data= GetData();
var items= '';
for( ii= 0; ii< data.length; ++ii ) {
   if( ii!= 0 )
    items+= ', ';
   items+= '"'+ ii+ ': '+ data[ii][0]+ '"';
}
var command= 'app.popUpMenu( '+ items+ ' );';
var selection= eval( command );
if( selection== null ) {
   return; // exit
}

var index= 0;
index= eval( selection.substring( 0, selection.indexOf(':') ).toString() );
if( index< data.length ) {
   data.splice( index, 1 );
   SaveData( data );
}
}

function ClearBookmarks() {
if( app.alert("确认要清除所有的书签吗?", 2, 2,"删除书签" )== 4 ) {
   SaveData( new Array(0) );
}
}

app.addMenuItem( {
cName: "-",              // menu divider
cParent: "View",         // append to the View menu
cExec: "void(0);" } );
    
    app.addMenuItem( {
cName: "set this page as bookmark",
cParent: "View",
cExec: "AddBookmark();",
cEnable: "event.rc= (event.target != null);" } );
    
    app.addMenuItem( {
cName: "move to bookmark",
cParent: "View",
cExec: "ShowBookmarks();",
cEnable: "event.rc= (event.target != null);" } );
    //cEnable: "event.rc= true;" } );
    
    app.addMenuItem( {
cName: "del a bookmark",
cParent: "View",
cExec: "DropBookmark();",
cEnable: "event.rc= (event.target != null);" } );
    
    app.addMenuItem( {
cName: "del all",
cParent: "View",
cExec: "ClearBookmarks();",
cEnable: "event.rc= true;" } );