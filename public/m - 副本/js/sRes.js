$(function () {
    var keyword = getParamsByUrl(location.href, 'keyword')
    var html = ''
    var page = 1
    var priceSort=1
    var that=null
    function getData() {
        if(!that){
            that=this
        }
        $.ajax({
            type: 'get',
            url: '/product/queryProduct',
            data: {price:priceSort, proName: keyword, page: page++, pageSize: 4 },
            dataType: 'json',
            success: function (res) {
                // console.log(res);
                if (res.data.length == 0) {
                    that.endPullupToRefresh(true);
                    return
                }
                html += template('zyr', { data: res.data })
                $('#search-result').html(html)
                that.endPullupToRefresh(false);
            }
        })
    }
    mui.init({
        pullRefresh: {
            container: $('#refreshContainer'),
            up: {
                height: 50,
                auto: true,
                contentrefresh: "正在加载...",
                contentnomore: '没有更多数据了',
                callback: getData
            }
        }
    });
    $('#price-sort').on('tap',function(){
        html=''
        page=1
        priceSort = priceSort==1?2:1
        mui('#refreshContainer').pullRefresh().refresh(true); 
        // getData()       
        getData()   
    })
})
function getParamsByUrl(url, name) {
    var arr = url.split('?')
    arr = arr[1].split('&')
    for (var i = 0; i < arr[i].length; i++) {
        var arr1 = arr[i].split('=')
        if (name == arr1[0]) {
            return arr1[1]
        }
        return null
    }
}