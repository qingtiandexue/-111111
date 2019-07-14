$(function(){
    $('#login').on('tap',function(){
        var username=$('input[type="text"]').val()
        var password=$('input[type="password"]').val()
        $.ajax({
            type:'post',
            url:'/user/login',
            data:{username:username,password:password},
            dataType:'json',
            beforeSend:function(){
                $('#login').html('正在登陆...')
            },
            success:function(res){
                console.log(res);
                if(res.success==true){
                    mui.toast('登陆成功')
                    setTimeout(() => {
                        location.href='user.html'
                    }, 2000);
                }
            }
        })
    })
})