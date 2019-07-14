$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        dataType: 'json',
        success: function (res) {
            var html = template('cate-left', { data: res.rows })
            $('#links').html(html)
            $('#links').find('a').eq(0).addClass('active')
            getSecondCate(1)
        }
    })
    function getSecondCate(id) {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: { id },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                var html = template('cate-right', res)
                $('.brand-list').html(html)
            }
        })
    }
    $('.links').on('click', 'a', function () {
        let id = $(this).attr('data-id')
        $(this).addClass('active').siblings().removeClass('active')
        getSecondCate(id)
    })
})

