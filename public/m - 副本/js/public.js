$(function(){
    $('.my-footer').on('tap','a',function(){
        mui.openWindow({
            url:$(this).attr('href')
        })
    })
})