/**
 * Created by Administrator on 2015/9/7.
 */
var fs=require('fs');
var path=require('path');

var deleteDir=function(delteSrc)
{
    var flag=false;
    if(fs.existsSync(delteSrc)==false){
        console.log( delteSrc,"不存在!");
        flag= false;
    }
    if(delteSrc)
    {
        //读取文件状态判断是文件还是文件夹
        fs.stat(delteSrc,function(err,stats){
            if(err)
            {
                console.log( delteSrc,"stats读取错误!");
                flag= false;
            }
            else
            {
                if(stats.isFile())  //是文件直接删掉
                {
                    fs.unlink(delteSrc,function(err){
                        if(err){
                            console.log( delteSrc,"删除失败!");
                            flag= false;
                        }
                        else{
                            console.log( delteSrc,"删除成功!");
                            flag= true;

                        }
                    })
                }
                else if(stats.isDirectory())  //如果是文件夹在进行进一步的处理
                {
                    fs.readdir(delteSrc,function(err,files){
                        if(err){
                            console.log( delteSrc,"读取失败!");
                            flag= false;
                        }
                        else
                        {
                            console.log( delteSrc,"下有",files.length,"文件");
                            if(files.length==0)//要删除的文件夹是空的。
                            {
                                fs.rmdir(delteSrc,function(err){
                                    if(err)
                                    {
                                        console.log( delteSrc,"删除失败!");
                                        flag= false;
                                    }
                                    else
                                    {
                                        console.log( delteSrc,"删除成功!");
                                        flag= true;
                                    }
                                });
                            }
                            else//要删除的文件夹有内容
                            {
                                var count = 0;
                                files.forEach(function(currentFile){
                                    flag=deleteDir(path.join( delteSrc,currentFile));
                                    count++;
                                    if(count ==files.length){
                                        fs.rmdir(delteSrc,function(err){
                                            if(err){
                                                flag==false;
                                                console.log( delteSrc,"删除失败!"+err);
                                            }
                                            else
                                            {
                                                flag==true;
                                                console.log( delteSrc,"删除成功!");
                                            }
                                        });
                                    }
                                });


                            }
                        }

                    });
                }

            }
        });
    }
    else
    {
        flag= false;
    }
    return flag;
}

console.log(deleteDir("./Manager/2dir/2.1/2.2"));

//module.exports.deleteDir=deleteDir;