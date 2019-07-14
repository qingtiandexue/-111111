$(function(){
    function getParams(queryStr){
        let arr=queryStr.split('&')
        let obj={}
        arr.forEach(v=> {
            var arr1=v.split('=')
            obj[arr1[0]]=arr1[1]
        });
        return obj          
    }
    $('#modify-btn').on('tap',function(){
        var formData=getParams($('#modify-form').serialize())
        console.log(formData);        
        $.ajax({
            type:'post',
            url:'/user/updatePassword',
            data:formData,
            dataType:'json',
            success:function(res){
                console.log(res);
                if(res.success==true){
                    mui.toast('修改成功')
                    setTimeout(function(){
                        location.href='login.html'
                    },2000)
                }                
            }
        })
    })
    $('.getCode').on('tap',function(){
        $.ajax({
            type:'get',
            url:'/user/vCodeForUpdatePassword',
            dataType:'json',
            success:function(res){
                console.log(res);
                alert(res.vCode)
                
            }
        })
    })
})