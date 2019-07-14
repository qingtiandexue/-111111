$(function(){
    function splits(queryStr){
        let arr=queryStr.split('&')
        let obj={}
        for(let i=0;i<arr.length;i++){
            var arr1=arr[i].split('=')
            obj[arr1[0]]=arr1[1]
        }
        return obj
    }
    $('#register').on('click',function(){
        var data=$('#register-form').serialize()
        console.log(data);
        let formData=splits(data)
        console.log(formData);        
        let {username,password,rePass,mobile,vCode}=formData    
        if(!username) {
            mui.toast('请输入用户名')
            return
        }
        if(!mobile) {
            mui.toast('请输入mobile')
            return
        }
        if(password!=rePass) {
            mui.toast('密码不一致')
            return
        }
        $.ajax({
            type:'post',
            url:'/user/register',
            data:{username:username,password:password,mobile:mobile,vCode:vCode},
            dataType:'json',
            success:function(res){
                console.log(res);
                if(res.success==true){
                    location.href='login.html'
                }
                
            }
        })
    })
    $('.getCode').on('click',function(){
        $.ajax({
            type:'get',
            url:'/user/vCode',
            dataType:'json',
            success:function(res){              
                alert(res.vCode)                
            }
        })
    })
})