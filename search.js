/**
 * Created by apple on 2017/9/5.
 */

var history_search = [];//存储历史搜索数据

//获取历史搜索数据,若没有则为空
if(localStorage.getItem("history_search")){
    history_search = JSON.parse(localStorage.getItem("history_search"));//获取历史搜索数据
}else{
    history_search = [];
}


//渲染历史记录
function setpage(){
    var product_list = '';
    //动态添加元素至页面上
    if(history_search.length != 0){
        $(".search_history").show();
        if(history_search.length >= 10){
            for(var i = 0; i < 10 ;i++){
                product_list = '<a class="search_find_title">'+history_search[i]+'</a>';
                $(".search_find_line").append(product_list);
            }
        }else{
            for(var i = 0; i < history_search.length;i++){
                product_list = '<a class="search_find_title">'+history_search[i]+'</a>';
                $(".search_find_line").append(product_list);
            }
        }
    }else{
        $(".search_history").hide();
    }
}
setpage();

var obj_arr = [];//请求结果
var timeout = 0;
var keyName = '';//关键字
var ajaxCache = {};//定义缓存对象(保存请求出来的数据)
$('.searchProduct').keyup(function(evt){

    keyName = $(this).val();

    if(isNull(keyName) == false || keyName != ''){
        //若输入字符串不为空,则显示网络请求搜索。
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            if(!!ajaxCache[keyName]){
                //显示自动提示框，给框里填关联词条的内容
                setListPage(ajaxCache[keyName],1);
                ajaxCache = {};
            }else{
                var sendData = {
                    "keyName":keyName
                };
                $.ajax({
                    type: "POST",
                    url: url,
                    data:sendData,
                    dataType: 'json',
                    success: function (data) {
                        console.log(data);
                        if(data){
                            if(data.data){
                                //显示自动提示框，给框里填关联词条的内容
                                ajaxCache[keyName]=[];
                                ajaxCache[keyName]=data.data;//给缓存对象赋值
                                setListPage(data.data,1);
                            }
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        },200);
    }else{
        //若输入字符串为空,则显示历史搜索。
        ajaxCache = {};
        if(history_search.length == 0){
            //若数组为空,历史搜索不显示
            $(".search_history").hide();
        }else{
            $(".search_history").show();
            setListPage(history_search,2)
        }
    }

    if (evt.keyCode == 13) {
        localStorage.setItem('search_keyName',keyName);
        var count = 0;
        //判断历史搜索中是否已经存在当前搜索的关键字
        for(var j = 0; j < history_search.length;j++){
            if(keyName == history_search[j]){
                count += 1;
            }else{
                count += 0;
            }
        }
        //如果没有,则添加进历史搜索
        if(count == 0){
            history_search.unshift(keyName);
        }
        //这边缺少的处理是历史搜索排序的问题。
        localStorage.setItem("history_search",JSON.stringify(history_search));
        window.location.href="";//跳转到搜索结果页之类的页面
    }
});

function setListPage(obj,no){
    console.log(obj);
    console.log(no);
    ajaxCache = {};
    obj_arr = obj;
    $(".search_find_line").empty();
    if(no == 1){
        $(".search_history").hide();
    }else{
        $(".search_history").show();
    }

    var search_res = '';
    for(var i = 0; i < obj.length;i++){
        search_res = '<a class="search_find_title">'+obj[i]+'</a>';
        $(".search_find_line").append(search_res);
    }
}

//判断字符串是不是为空
function isNull( str ){
    if ( str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}


