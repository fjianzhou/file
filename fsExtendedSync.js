
var fs=require('fs');
var path=require('path');


var deleteDir=function(delteSrc)
{
    var flag=false;
    if(fs.existsSync(delteSrc)==false){

        flag= false;
    }
    if(delteSrc)
    {
        //读取文件状态判断是文件还是文件夹
        var stat=fs.statSync(delteSrc);
        if(stat.isFile())  //是文件直接删掉
        {
            fs.unlinkSync(delteSrc)

        }
        else if(stat.isDirectory())  //如果是文件夹在进行进一步的处理
        {
            var files=fs.readdirSync(delteSrc)

            if(files.length==0)//要删除的文件夹是空的。
            {
                fs.rmdirSync(delteSrc);



            }
            else//要删除的文件夹有内容
            {

                files.forEach(function(currentFile){
                    flag=deleteDir(path.join( delteSrc,currentFile));
                });
                fs.rmdirSync(delteSrc)


            }
        }
    }

}


module.exports.deleteDir=deleteDir;