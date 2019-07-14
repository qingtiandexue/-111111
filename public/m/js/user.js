var userIfo={}
$.ajax({
    type:'get',
    url:'/user/queryUserMessage',
    dataType:'json',
    async:false, 
    success:function(res){
        console.log(res);       
        if(res.error==400){
            location.href='login.html'
            return
        }
        userIfo=res        
    }
})
$(function(){
    $('.logout').on('click',function(){
        $.ajax({
            type:'get',
            url:'/user/logout',
            dataType:'json',
            success:function(res){
                console.log(res);
                if(res.success==true){
                    location.href='index.html'
                }               
            }
        })
    })
    var html=template('userTpl',userIfo)
    $('#user').html(html)   
    $('#modify-btn').on('click',function(){
        
    })
})