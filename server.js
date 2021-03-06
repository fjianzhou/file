var http=require('http');
var fs=require('fs');
var path=require('path');
var url= require('url');
var mime=require('mime');
var fsExtendedSync=require('./fsExtendedSync.js');


http.createServer(function(req,res){
    var rootPath=path.resolve();
    var urls=url.parse(req.url);

    var visitPath=path.join(rootPath,urls.pathname);


    if(urls.pathname=='/')
    {
        fs.readFile('./index.html',function(err,data)
        {
            if(err)
            {
                res.setHeader("Content-Type","text/html;charset=utf-8");
                res.end('文件读取失败！'+err);
            }
            else
            {
                res.end(data);
            }

        })
    }
    else if(urls.pathname=='/left.html')
    {
        fs.readdir(rootPath+'/Manager',function(err,files){
                var htmlstr="";
                if(files.length==0){return;}
                files.forEach(function(currentFile){

                var currentFilePath=path.join(rootPath,'Manager',currentFile).replace(/\\/g,"/");
                var stata=fs.statSync(currentFilePath);

                var  temsrc=path.join("/",'Manager',currentFile).replace(/\\/g,"/");
                if(stata.isDirectory())
                {
                    htmlstr+='<li class="dir">';
                    htmlstr+='<a href ="javascript:onclick(\'left\',\''+temsrc+'\')">'+currentFile+'</a>'
                    htmlstr+='<a href ="javascript:deleteDirOrFile(\''+temsrc+'\')" ><img src="/imge/delete.png" /></a>';

                    htmlstr+='</li>';
                }
                else if(stata.isFile())
                {
                    var ext= path.extname(currentFile);
                    switch (ext)
                    {
                        case '.jpg':
                            htmlstr+='<li class="pic">';
                            htmlstr+='<a href ="javascript:onclick(\'right\',\''+temsrc+'\')">'+currentFile+'</a>';
                            htmlstr+='<a href ="javascript:deleteDirOrFile(\''+temsrc+'\')" ><img src="/imge/delete.png" /></a>';

                            htmlstr+='</li>';
                            break;
                        case '.png':
                            htmlstr+='<li class="pic">';
                            htmlstr+='<a href ="javascript:onclick(\'right\',\''+temsrc+'\')">'+currentFile+'</a>';
                            htmlstr+='<a href ="javascript:deleteDirOrFile(\''+temsrc+'\')" ><img src="/imge/delete.png" /></a>';

                            htmlstr+='</li>';
                            break;
                        case '.jpeg':
                            htmlstr+='<li class="pic">';
                            htmlstr+='<a href ="javascript:onclick(\'right\',\''+temsrc+'\')">'+currentFile+'</a>';
                            htmlstr+='<a href ="javascript:deleteDirOrFile(\''+temsrc+'\')" ><img src="/imge/delete.png" /></a>';

                            htmlstr+='</li>';
                            break;
                        case '.txt':
                            htmlstr+='<li class="file">';
                            htmlstr+='<a href ="javascript:onclick(\'right\',\''+temsrc+'\')">'+currentFile+'</a>';
                            htmlstr+='<a href ="javascript:deleteDirOrFile(\''+temsrc+'\')" ><img src="/imge/delete.png" /></a>';;

                            htmlstr+='</li>';
                            break;
                        case '.mp3':
                            htmlstr+='<li class="mp3">';
                            htmlstr+='<a href ="javascript:onclick(\'right\',\''+temsrc+'\')">'+currentFile+'</a>';
                            htmlstr+='<a href ="javascript:deleteDirOrFile(\''+temsrc+'\')" ><img src="/imge/delete.png" /></a>';

                            htmlstr+='</li>';
                            break;
                        case '.mp4':
                            htmlstr+='<li class="video">';
                            htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                            htmlstr+='<a href ="javascript:deleteDirOrFile(\''+temsrc+'\')" ><img src="/imge/delete.png" /></a>';

                            htmlstr+='</li>';
                            break;
                        default :
                            htmlstr+='<li class="file">';
                            htmlstr+='<a href ="javascript:onclick(\'right\',\''+temsrc+'\')">'+currentFile+'</a>';
                            htmlstr+='<a href ="javascript:deleteDirOrFile(\''+temsrc+'\')" ><img src="/imge/delete.png" /></a>';

                            htmlstr+='</li>';
                            break
                    }
                }

            })
            fs.readFile('./left.html','utf-8',function(err,data){

                res.setHeader('Content-Type',mime.lookup('./left.html'));
                res.end(data.replace("@content",htmlstr));

            })
        })
    }
    else if(urls.pathname=='/ajax')
    {

        var queryArray=urls.query.split('&');
        var keyValues={};
        queryArray.forEach(function(item,index,array){
            keyValues[item.split('=')[0]]=item.split('=')[1];
        });

        if(keyValues['action']=='del')
        {
            var deleteSrc=keyValues['src'];

            fsExtendedSync.deleteDir('.'+deleteSrc);

            var lastStrIndex= deleteSrc.lastIndexOf('/');
            var tem=deleteSrc.substring(0,lastStrIndex);

            fs.readdir('.'+tem,function(err,files){
                var htmlstr="";
                if(tem!='' && tem!='/Manager') {
                    if (files.length == 0) {
                        htmlstr += '<li>目录下没有发现文件';
                        htmlstr += '</li>';
                    }

                    htmlstr += '<li><a href ="' + tem.substring(0,tem.lastIndexOf('/')) + '">返回上一级目录</a></li>';
                }

                files.forEach(function(currentFile){
                    var currentFilePath=path.join(tem,currentFile).replace(/\\/g,"/");
                    var stata=fs.statSync(path.join('.'+tem,currentFile));
                    if(stata.isDirectory())
                    {

                        htmlstr+='<li class="dir">';
                        htmlstr+='<a href ="javascript:onclick(\'left\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                        htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                        htmlstr+='</li>';
                    }
                    else if(stata.isFile())
                    {
                        var ext= path.extname(currentFile);

                        switch (ext)
                        {
                            case '.jpg':

                                htmlstr+='<li class="pic">';
                                htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                htmlstr+='</li>';
                                break;
                            case '.png':
                                htmlstr+='<li class="pic">';
                                htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                htmlstr+='</li>';
                                break;
                            case '.jpeg':
                                htmlstr+='<li class="pic">';
                                htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                htmlstr+='</li>';
                                break;
                            case '.txt':
                                htmlstr+='<li class="file">';
                                htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                htmlstr+='</li>';
                                break;
                            case '.mp3':
                                htmlstr+='<li class="mp3">';
                                htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                htmlstr+='</li>';
                                break;
                            case '.mp4':
                                htmlstr+='<li class="video">';
                                htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                htmlstr+='</li>';
                                break;
                            default:
                                htmlstr+='<li class="file">';
                                htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                htmlstr+='</li>';
                                break;
                        }
                    }

                });

                res.write(htmlstr);
                res.end();

            })

        }
        else
        {

        }

    }
    else
    {

        fs.stat(visitPath,function(err,stat){
            if(err)
            {
                res.setHeader("Content-Type","text/html;charset=utf-8");
                res.end('未知异常！'+err);
            }
            else
            {
                if(stat.isFile())
                {
                    fs.readFile(visitPath,function(err,data)
                    {
                        if(err)
                        {
                            res.setHeader("Content-Type","text/html;charset=utf-8");
                            res.end('文件读取失败！'+err);
                        }
                        else
                        {

                            if(path.extname(visitPath)=='.js')
                            {
                                res.setHeader('Content-Type',mime.lookup('./inedx.html'));
                            }
                            else
                            {
                                res.setHeader('Content-Type',mime.lookup(urls.pathname));
                            }

                            res.end(data);
                        }

                    })

                }
                else if(stat.isDirectory())
                {
                    fs.readdir(visitPath,function(err,files){
                        var htmlstr="";
                        var lastStrIndex= visitPath.lastIndexOf('\\');
                        var tem=visitPath.substring(0,lastStrIndex).replace(rootPath,"");

                        if(tem!='') {
                            if (files.length == 0) {
                                htmlstr += '<li>目录下没有发现文件';
                            }
                            htmlstr += '</li>';
                            htmlstr += '<li><a href ="' + tem + '">返回上一级目录</a></li>';
                        }

                        files.forEach(function(currentFile){


                            var currentFilePath=path.join(visitPath.replace(rootPath,""),currentFile).replace(/\\/g,"/");

                            var stata= fs.statSync(path.join(visitPath,currentFile));

                            if(err)
                            {

                            }
                            if(stata.isDirectory())
                            {

                                htmlstr+='<li class="dir">';
                                htmlstr+='<a href ="javascript:onclick(\'left\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                htmlstr+='</li>';
                            }
                            else if(stata.isFile())
                            {
                                var ext= path.extname(currentFile);

                                switch (ext)
                                {
                                    case '.jpg':

                                        htmlstr+='<li class="pic">';
                                        htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                        htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                        htmlstr+='</li>';
                                        break;
                                    case '.png':
                                        htmlstr+='<li class="pic">';
                                        htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                        htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                        htmlstr+='</li>';
                                        break;
                                    case '.jpeg':
                                        htmlstr+='<li class="pic">';
                                        htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                        htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                        htmlstr+='</li>';
                                        break;
                                    case '.txt':
                                        htmlstr+='<li class="file">';
                                        htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                        htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                        htmlstr+='</li>';
                                        break;
                                    case '.mp3':
                                        htmlstr+='<li class="mp3">';
                                        htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                        htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                        htmlstr+='</li>';
                                        break;
                                    case '.mp4':
                                        htmlstr+='<li class="video">';
                                        htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                        htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                        htmlstr+='</li>';
                                        break;
                                    default:
                                        htmlstr+='<li class="file">';
                                        htmlstr+='<a href ="javascript:onclick(\'right\',\''+currentFilePath+'\')">'+currentFile+'</a>';
                                        htmlstr+='<a href ="javascript:deleteDirOrFile(\''+currentFilePath+'\')" ><img src="/imge/delete.png" /></a>';

                                        htmlstr+='</li>';
                                        break;
                                }
                            }

                        })
                        fs.readFile('./left.html','utf-8',function(err,data){

                            res.setHeader('Content-Type',mime.lookup('./left.html'));

                            res.end(data.replace("@content",htmlstr));
                        })
                    })
                }

            }

        })
    }

}).listen(8080);