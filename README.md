## 乐淘移动端说明书
### 获取url参数
```javascript
// http://www.klxin.cn:3000/mobile/searchList.html?key=222&name=%E6%9D%A5%E4%B8%AA%E4%B8%AD%E6%96%87
var rr = new URLSearchParams(location.search)
rr.get('name')
```

### mui框架默认会阻止a的跳转
- 解决mui框架中的a不会跳转问题
  ```javascript
  $('body').on('tap', 'a', function(){
    mui.openWindow({
        url: $(this).attr('href')
    })
  })
  ```


### 使用picker的步骤
1. 引入静态相关资源
   ```
    <link rel="stylesheet" href="assets/mui/css/mui.picker.css">
	<link rel="stylesheet" href="assets/mui/css/mui.poppicker.css">
    <script src="assets/mui/js/mui.picker.js"></script>
	<script src="assets/mui/js/mui.poppicker.js"></script>
    <script src="js/city.js"></script>
   ```

2. 创建picker选择器
   ```javascript
   var picker = new mui.PopPicker({layer:3})
   ```

3. 为picker选择器添加数据
   ```javascript
   picker.setData(cityData)
   ```

4. 创建picker选择器
   ```javascript
    // 显示picker选择器
    picker.show(function(selectItems){
        // 将用户选择的内容显示在文本框中
        $('#selectCity').val(selectItems[0].text + selectItems[1].text + selectItems[2].text)
    })
   ```

### artTemplate使用步骤
1. 引入`<script src="assets/artTemplate/template-native.js"></script>`
2. 使用artTemplate定义一个模板
   ```javascript
    <script id="historySearchTpl" type="text/html">
		<% for(var i=0;i<data.length;i++){ %>
			<li class="mui-table-view-cell"><%= data[i].name %></li>
		<% } %>
	</script>
   ````

3. 给模板传递一些数据
   ```javascript
   var htmlStr = template('historySearchTpl',{data: [{name: 'zs'},{name: 'ls'},{name: 'zl'}]})
   ```

4. 将带有数据的模板字符放到h't'm'l的容器中去`$('#box').html(htmlStr)`


### 分类页步骤
1. 完成静态页面
2. 完成左侧功能1
   1. 页面加载后 通过ajax请求获取到一级分类的数据
      ```javascript
      $.ajax({
		type:'get',
		url:'/category/queryTopCategory',
		success:function(result){
            console.log(result) // 从后台获取的一级分类数据
        }
      })
      ```

   2. 将一级分类的数据通过模板引擎渲染到页面中去
      ```javascript
      var aa = template('leftCateTpl',{data:result.rows})
      // console.log(aa)
      $('#leftCate').html(aa)
      ```

   3. 根据一级分类的数据，默认取数据中第0项的id,通过这个id去获取二级分类的数据
      ```
        var id = result.rows[0].id;
        $.ajax({
            type:'get',
            url:'/category/querySecondCategory',
            data:{
                id:id
            },
            success:function(result){
                $('#rightCate').html(template('rightCateTpl',{data:result.rows}))
                // $('#leftCate').find('a:first-child').addClass('active');
            }
        })
      ```

   4. 在右侧使用模板引擎渲染二级分类数据到页面中去
3. 完成左侧功能2
   1. 给左侧列表通过事件委托注册点击事件
      ```javascript
      $('body').on('tap','.getSecond',function(){
          // ....
      }
      ```

   2. 在事件中获取当前点击元素（this）的id, 然后通过这个id获取二级分类的数据
      ```javascript
        var id = $(this).attr('data-id');
		$(this).addClass('active').siblings().removeClass('active');
		$.ajax({
			type:'get',
			url:'/category/querySecondCategory',
			data:{
				id:id
			},
			success:function(result){
                // 下面的第三步
				$('#rightCate').html(template('rightCateTpl',{data:result.rows}))
			}
		})
      ```

   3. 在右侧使用模板引擎渲染二级分类数据到页面中去
   

### 搜索页思路
1. 完成静态页面
2. 给搜索按钮注册点击事件
3. 获取搜索文本框中的值
4. 使用本地存储`var historyArr = []`
   1. 先判断本地是否是存储搜索的历史纪录`if(localStorage.getItem('keywords'))`
   2. 如果有
      ```javascript
        if(localStorage.getItem('keywords')) {
            historyArr = JSON.parse(localStorage.getItem('keywords'))  // 从本地存储中取出的值默认是字符串 需要用JSON的方法转换成数组

            // 通过模板引擎宣导到页面中去
            $('#historySearch').html(template('historySearchTpl',{data:keywords}))
        }
      ```
    
    3. 在push之前 
       ```javascript
       var urlServerVal = encodeURI(搜索框中值)
       if (historyArr.indexOf(搜索框中值) !== -1 ) {
           // 跳转到搜索列表页
           // 搜索框中的值如果是中问建议urL编码
           
           location.href = `search-list.html?=${urlServerVal}`
       }

       // 没有在数组中查到  说明本地历史记录里没有当前的搜索值
       historyArr.push(搜索框中值)
       // 将新push完之后的数组转换成字符串数组存储到本地
       localStorage.setItem('keywords', JSON.stringify(historyArr))
       location.href = `search-list.html?=${urlServerVal}`
       ```

5. 清除历史纪录
   1. 清除本地存储`localStorage.removeItem(keywords)`
   2. 清除页面中html历史纪录`$('#ul').html('')`


### 搜索结果页面
1. 获取通过url传递过来的搜索关键字
   ```javascript
    var keyword = new URLSearchParams(location.search).get('key')
   ```

2. 用关键字去调取搜索接口
   ```javascript
    $.ajax({
            url: '/product/queryProduct',
            type: 'get',
            data: {
                page: 1,
                pageSize: 3,
                proName: keyword
            },
            success: function(response){
                // 使用模板渲染到页面中去
                // ...
            }
    })
   ```

3. 将搜索结果展示在页面中
4. 实现搜索结果分页(使用MUI)
   1. 使用mui初始化容器上拉加载更多
      ```javascript
      mui.init({
        pullRefresh : {
            container: '#refreshContainer',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
            up : {
            height:50,//可选.默认50.触发上拉加载拖动距离
            auto:true,//可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: getData //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
      })
      ```

   2. 定义上拉回调函数getData
      ```javascript
      function getData() {
        if(!This){
		    This = this  // 纪录mui中的this
	    }
        $.ajax({
            url: '/product/queryProduct',
            type: 'get',
            data: {
                page: page++,
                pageSize: 3,
                proName: keyword,
                price: priceSort
            },
            success: function(response){
                if(response.data.length > 0){
                    html += template('searchTpl', response)
                    $('#search-box').html(html)
                    console.log(this)
                    // 告诉上拉加载组件当前数据加载完毕
                    This.endPullupToRefresh(false)
                }else {
                    // 告诉上拉加载组件当前数据加载完毕
                    This.endPullupToRefresh(true)
                } 
            }
        })
      }
      ```

   3. 按照价格对商品进行排序
      ```javascript
      $('#priceSort').on('tap', function(){

		// 更改价格排序条件
		priceSort = priceSort == 1 ? 2 : 1

		// 对之前的各种配置进行初始化
		html = ""
		page = 1
		mui('#refreshContainer').pullRefresh().refresh(true)
		getData()
	  })
      ```
  
   4. `注意`要定义一些全局变量
      ```javascript
      // 获取url传递的关键字
      var keyword = new URLSearchParams(location.search).get('key')
      // 当前页
      var page = 1
      // 页面中的数据
      var html = ""
      // 价格排序规则 升序
      var priceSort = 1
      var This = null
      ```
   
   5. `注意`排序不要同时传递price和num参数 只能有一种排序规则
        | 参数名称     | 是否必须 | 说明              |
        | -------- | ---- | --------------- |
        | proName  | 否    | 产品名称            |
        | brandId  | 否    | 品牌id            |
        | price    | 否    | 使用价格排序（1升序，2降序） |
        | num      | 否    | 产品库存排序（1升序，2降序） |
        | page     | 是    | 第几页             |
        | pageSize | 是    | 每页的条数           |


### 登陆注册页面
#### 注册页面
1. 使用mui完成注册页面静态布局
2. 给注册按钮添加点击事件
   ```javascript
   $('#register-btn').on('click', function () {}
   ```

3. 获取到用户注册的信息
   ```javascript
   var username = $.trim($('.mui-input-group input[name=username]').val())
   var mobile = $.trim($('.mui-input-group input[name=mobile]').val())
   var password = $.trim($('.mui-input-group input[name=password]').val())
   var againPass = $.trim($('.mui-input-group input[name=againPass]').val())
   var vCode = $.trim($('.mui-input-group input[name=vCode]').val())
   ```

4. 对用户输入的信息做验证
5. 调用注册接口 实现注册功能
   1. 获取vCode码
      ```javascript
      $('#getCode').on('click', function () {
        $.ajax({
            url: '/user/vCode',
            type: 'get',
            success: function (res) {
                console.log(res.vCode)
            }
        })
      })
      ```

   2. 请求注册接口
      ```javascript
      $.ajax({
		url: '/user/register',
		type: 'post',
		data: {
			username: username,
			password: password,
			mobile: mobile,
			vCode: vCode
		},
		success: function (res) {
			console.log(res)
            if (res.success) { // 注册成功
                // 提示
                mui.toast('注册成功')
                // 跳转到 login.html页面
                location.href = login.html
            } else if(res.error) {
				mui.toast(res.message)
			}
		}
	  })
      ```

6. 给出提示 告诉用户是否注册成功
7. 跳转到登录页面

#### 登录页面
1. 获取登录按钮并且添加点击事件
   ```javascript
   $('#login-btn').on('click', function(){// ...}
   ```

2. 获取到用户输入的表单信息
   ```javascript
   var username = $.trim($("[name='username']").val())
   var password = $.trim($("[name='password']").val())
   ```

3. 调用登录接口实现登录
   ```javascript
   // 验证通过之后发请求登录
   $.ajax({
        url: '/user/login',
        type: 'post',
        data: {
            username: username,
            password: password
        },
        beforeSend: function(){
            $('#login-btn').html("正在登录...")
        },
        success: function(res){
            if (res.success) { // 登录成功
                mui.toast("登录成功")
                $('#login-btn').html("登录")
                setTimeout(function(){
                    location.href = "user.html"
                }, 1000)
            } else if(res.error) {
				mui.toast(res.message)
			}
        }
    })
   ```

4. 如果用户登录成功跳转到会员中心


### 会员中心
1. 完成静态页面
2. 退出登录功能
   1. 获取到退出登录按钮并添加点击事件
   2. 调用退出登录接口实现 退出登录
   3. 如果退出成功 跳转到首页
      ```javascript
        $('#logout').on('click', function(){
            $.ajax({
                url: '/user/logout',
                type: 'get',
                success: function(res){
                    if(res.success){
                        mui.toast("退出登录成功")
                        // setTimeout(function(){
                        // 	location.href = "index.html"
                        // },1000)
                    }
                }
            })
        })
       ```

3. 用户中心页面登录拦截
   ```javascript
    var userInfo = null
    // 进入用户中心页面先发ajax请求 成功之后才会进入 否则跳去登录页面
    $.ajax({
        url: '/user/queryUserMessage',
        type: 'get',
        async: false,// 同步
        success: function(res){
            console.log(res)  // {"id":4,"username":"root","password":"4QrcOUm6Wau+VuBX8g+IPg==","mobile":"12345678932","isDelete":1}
            // 用户没有登录
            if(res.error && res.error == 400){
                location.href = "login.html" 
            }
            userInfo = res
        }
    })
   ```

4. 展示用户信息(使用artTemplate模板引擎将用户信息渲染到页面中)
   ```
    var html = template('userTpl', userInfo)
	// 展示用户信息
	$('#userInfoBox').html(html)
   ```
   

#### 修改密码
1. 获取修改密码按钮并添加点击事件
   ```javascript
   $('#modify-btn').on('tap', function(){
       // ...
   }
   ```

2. 获取用户输入的信息
   ```javascript
    // 原密码
    var originPass = $.trim($("[name='originPass']").val())
    // 新密码
    var newPass = $.trim($("[name='newPass']").val())
    // 确认新密码
    var confirmNewPass = $.trim($("[name='confirmNewPass']").val())
    // 认证码
    var vCode = $.trim($("[name='vCode']").val())
   ```

3. 对用户输入的信息做校验
4. 调用修改密码接口 实现修改密码功能
   1. 获取修改密码认证码
      ```javascript
       // 获取认证码
       $('#getCode').on('tap', function(){
            $.ajax({
                url: '/user/vCodeForUpdatePassword',
                type: 'get',
                success: function(res){
                    // 将认证码显示在控制台中
                    console.log(res.vCode);
                }
            })
       })
      ```

   2. 请求接口修改密码
      ```javascript
        // 发送修改密码请求
		$.ajax({
			url: '/user/updatePassword',
			type: 'post',
			data: {
				oldPassword: originPass,
				newPassword: newPass,
				vCode: vCode
			},
			success: function(res){
				if(res.success){
					mui.toast("修改密码成功");
					setTimeout(function(){
						location.href = "login.html"
					},1000)
				}
			}
		})
      ```

5. 跳转到登录页面 重新登录



### 收货地址
#### 获取用户存储的收货地址
```javascript
var address = null;
// 1.1 页面一加载 发请求获取收货地址信息
$.ajax({
    url: '/address/queryAddress',
    type: 'get',
    success: function(res) {
        console.log(res) // [{"id":2,"userId":4,"address":"北京市北京市东城区","addressDetail":"11","isDelete":1,"recipients":"11","postCode":"111","mobile":null}]
        address = res
        // 1.2 将请求回来的数据渲染到页面中去  
        // 注意 需要先添加收货地址才可以获取到列表信息  如果没有则 返回给你的可能是空数组
        var html = template("addressTpl",{result:res})
        $('#address-box').html(html)
    }
})
```

#### 删除收货地址
1. 给删除按钮添加点击事件
   ```javascript
   $('#address-box').on('tap','.delete-btn',function(){
       // 注意要通过事件委托的形式注册点击事件
       // 因为 删除按钮是通过模板引擎动态插入过来的  页面一加载获取不到删除按钮
   })
   ```

2. 弹出一个删除确认框
   ```javascript
   mui.confirm("确认要删除吗?",function(message){
       // message 会返回删除的按钮索引
   })
   ```

3. 如果用户点击确认 删除
   ```javascript
   if(message.index == 1) {
       // 确认删除
   } else {
       // 取消删除
   }
   ```
   
4. 调用删除收货地址的接口 完成删除功能
   ```javascript
    // 4.1 获取删除按钮上的id
    var id = this.getAttribute('data-id')
    // 4.2 发请求删除地址
    $.ajax({
        url: '/address/deleteAddress',
        type: 'post',
        data: {
            id: id
        },
        success: function(res){
            // 删除成功 则刷新页面  ---> 刷新页面 会重新获取收货地址 数据并渲染到页面中去
            /* location.href = location.href
            location.reload() */
            history.go(0)
        }
    })
   ```
   
5. 取消删除 左滑复原
   ```javascript
    // 关闭列表滑出效果
	mui.swipeoutClose(li)
   ```
   
#### 编辑收货地址
1. 给编辑按钮添加点击事件
2. 跳转到收货地址编辑页面 并且要将编辑的数据传递到这个页面
   ```javascript
   // 1.1 注册点击事件
   $('#address-box').on('tap', '.edit-btn', function(){
       // 1.2 获取当前按钮的id
       var id = this.getAttribute('data-id')
       // 1.3 循环遍历获取到当前编辑的数据
       for(var i=0;i<address.length;i++) {
			if(address[i].id == id) {
                // 1.4 将获取到的收货地址数据存储在本地
                // 说明  本地存储是放在当前域名下 只要当前域名下的所有页面都可以获取到 
                // 这样就实现了 不同页面间传值问题
				localStorage.setItem('editAddress',JSON.stringify(address[i]));
				// 终止循环
				break
			}
		}
		// 1.4 跳转到编辑页面 并从url带上标识 告诉添加地址页 我是来编辑的
		location.href = "addAddress.html?isEdit=1"
   })
   ```

3. 到addAress.html页面中后 通过isEdit参数分别执行编辑逻辑和增加收货地址逻辑
   ```javascript
   // 获取传递过来的isEdit参数
   var isEdit = new URLSearchParams(location.search).get('isEdit')
   ```

4. 分别完成编辑逻辑和增加收货地址逻辑
   ```javascript
   // var a = '0'  '1'
   // Number(a) parseInt(a) parseFloat(a)
   isEdit = +isEdit
   if(isEdit){
		// 编辑操作
		if(localStorage.getItem("editAddress")){
			var address = JSON.parse(localStorage.getItem("editAddress"))
			var html = template("editTpl",address)
			$('#editForm').html(html)
		}
	}else{
		// 添加操作
		var html = template("editTpl",{})
		$('#editForm').html(html)
    }
    
    // 。。
    if(isEdit){
        // 编辑操作
        var url = "/address/updateAddress"
        data.id = address.id
    }else {
        // 添加操作
        var url = "/address/addAddress"
    }
    // 。。。
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function(res) {
            if(res.success) {
                if(isEdit){
                    mui.toast("地址修改成功")
                }else{
                    mui.toast("地址添加成功")
                }
                setTimeout(function(){
                    location.href = "adress.html"
                },1000)
            }
        }
    })
   ```


### 商品详情页
1. 获取url参数
   ```javascript
   var id = new URLSearchParams(location.search).get('id')
   ```

2. 通过id去发ajax请求获取详情页面数据
   ```javascript
   $.ajax({
		url: '/product/queryProductDetail',
		type: 'get',
		data: {
			id: id
		},
		success: function(res){
            console.log(res)
        }
   })
   ```

3. 将数据渲染到页面中
   1. 渲染动态数据
      ```javascript
      var html = template("productTpl", res)
	  $('#product-box').html(html)
      ```
   
   2. 由于轮播图是动态渲染的 所以需要重新初始化
      ```javascript
      //获得slider插件对象
	  var gallery = mui('.mui-slider')
	  gallery.slider()
      ```

   3. 在模板中渲染尺码
      ```html
      <% var size = size.split('-') %>
        <!-- ["35","56"] -->
        <% for(var i=size[0];i<=size[1];i++){ %>
        <span><%=i %></span>
      <% } %>
      ```

4. 尺码的排他效果和数量的选择
5. 添加购物车
   ```javascript
   $('#addCart').on('tap', function(){
		if(!size){
			alert('请选择尺码')
			return
		}
		$.ajax({
			url: '/cart/addCart',
			type: 'post',
			data: {
				productId: productId,
				num: kucunNum,
				size: size
			},
			success: function(res){
				if(res.success){
					mui.confirm("加入购物车成功,跳转到购物车?", function(message){
						if(message.index){
							// 跳转到购物车
							// location.href = "cart.html"
						}
					})
				}
			}
		})
	})
   ```


## 乐淘PC端说明书
### 后台登录功能
1. 获取登录按钮并且添加点击事件
   ```javascript
   $('#login-btn').on('click', function(){
       // ...
   })
   ```

2. 获取到用户输入的表单信息
   ```javascript
    var username = $.trim($("[name='username']").val())
	var password = $.trim($("[name='password']").val())
   ```

3. 调用登录接口实现登录
   ```javascript
    $.ajax({
        url: '/employee/employeeLogin',
        type: 'post',
        data: {
            username: username,
            password: password
        },
        success: function(res){
            // res
        }
    })
   ```

4. 如果用户登录成功跳转到会员中心失败则给提示文字
   ```javascript
    if (res.success) { // 登录成功
        alert("登录成功")
        $('#login-btn').html("登录")
        setTimeout(function(){
            location.href = "user.html"
        }, 1000)
    } else if(res.error) {
        alert(res.message)
    }
   ```

### 退出登录功能
1. `注意`推出功能需要在除了登录页面都要用所以，所以需要写在公共js中
   ```javascript
    $('.login_out_bot').on('click',function(){
		console.log(666)
		$.ajax({
			type:'get',
			url:'/employee/employeeLogout',
			success:function(result){
				console.log(result)
				if(result.success){
					location.href = "login.html"
				}else{
					alert('登出失败')
				}
			}
		})
	})
   ```

### 登录拦截
1. 除了login.html页面都要加入拦截功能，所以写在公共js中
   ```javascript
    // login.html页面如果引入会陷入死循环中
    $.ajax({
		url:'/employee/checkRootLogin',
		type:'get',
		success:function(result){
			if(result.error && result.error == 400){
				location.href = "login.html"
			}
		}
	})
   ```

2. 专门给login.html页面的拦截
   ```javascript
    $.ajax({
		url:'/employee/checkRootLogin',
		type:'get',
		success:function(result){
			if(result.success){
				location.href = "user.html"
			}
		}
	})
   ```

### 用户列表
1. 获取用户信息列表通过模板引擎渲染到页面中去
   ```javascript
    $.ajax({
		url:'/user/queryUser',
		type:'get',
		data:{
			page:1,
			pageSize:10
		},
		success:function(result){
			console.log(result)
			$('#userBox').html(template('userTpl',{data:result}))
		}
    })
   ```

2. 更新用户状态
   ```javascript
    $('body').on('click','#deleteBtn',function(){
		var id = $(this).attr('data-id') // 获取当前点击按钮的属性值 id
		var isDelete = Number($(this).attr('data-isDelete')) ? 0 : 1 // 传递给后台的告诉后台是启用还是禁用
		$.ajax({
			url:'/user/updateUser',
			type:'post',
			data:{
				id:id,
				isDelete:isDelete
			},
			success:function(result){
				if(result.success){
					location.reload()
				}else{
					if(result.error){
						alert(result.message)
					}
				}
			}
		})
	})
   ```


### 一级分类
1. 获取一级分类数据并展示
   ```javascript
    var page = 1
	var pagesize = 10
    var totalPage = 0
    // 页面一加载获取
    GetCategory()
    // 定义获取一级分类数据并展示函数
    function GetCategory(){
		$.ajax({
			url:'/category/queryTopCategoryPaging',
			type:'get',
			data:{
				page:page,
				pageSize:pagesize
			},
			success:function(result){
                // 通过 总条数/一页多少条数据 ==> 总共几页数据
                totalPage = Math.ceil(result.total/pagesize)
                // 使用模板引擎渲染
				$('#categoryBox').html(template('categoryTpl',{data:result}))
		})
	}
   ```

2. 点击上一页和下一页分别获取上一页数据和下一页数据
   ```javascript
    // 上一页
    $('#prevBtn').on('click',function(){
		page--;
		if(page < 1){
			page = 1
			alert('已经到了第一页')
			return;
		}
		GetCategory()
    })
    // 下一页
    $('#nextBtn').on('click',function(){
		page++;
		if(page > totalPage){
			page = totalPage
			alert('已经到了最后一页')
			return
		}
		GetCategory()
	})
   ```

3. 添加一级分类
   ```javascript
   $('#addCategory').on('click',function(){
		var categoryName = $('#categoryName').val() // 获取输入的一级分类内容
		if(!categoryName){ // 简单效验
			alert('请输入分类名称')
			return
		}
		$.ajax({  // 请求接口添加一级分类
			type:'post',
			url:'/category/addTopCategory',
			data:{
				categoryName:categoryName
			},
			success:function(result){
				if(result.success){
					$('#modal').modal('hide')
					location.reload()
				}
			}
		})
	})
   ```

### 二级分类
1. 获取数据并展示 和一级分类一样 只是接口不一样`/category/querySecondCategoryPaging`
2. 上一页/下一页和一级分类一样
3. 添加二级分类
   1. 获取一级分类数据 
      ```javascript
      $.ajax({
		url:'/category/queryTopCategoryPaging',
		type:'get',
		data:{
			page:1,
			pageSize:10
		},
		success:function(result){
			$('#firstCategory').html(template('firstCategoryTpl',{data:result.rows}))
		}
	  })
      ```

   2. 图片上传
      ```
        // 1. 引入上传插件
        <script src="assets/jquery-fileupload/jquery.ui.widget.js"></script>
	    <script src="assets/jquery-fileupload/jquery.iframe-transport.js"></script>
	    <script src="assets/jquery-fileupload/jquery.fileupload.js"></script>
        // 2. 定义上传路径
        <div class="form-group">
            <input type="file" class="form-control" id="fileUpload" data-url="/category/addSecondCategoryPic" name="file" accept="image/jpeg">
        </div>
        // 3. 获取元素执行上传 并将返回的图片放到页面中
        $('#fileUpload').fileupload({
            dataType: 'json',
            done: function (e, data) {
                brandData.brandLogo = data._response.result.picAddr
                var imgUrl= data._response.result.picAddr
                $("#showBrand").attr("src",imgUrl)
            }
        })
      ```

   3. 添加基于一级分类下的二级分类
      ```javascript
        // brandData所有要传递给后天的数据对象
        $.ajax({
			url:'/category/addSecondCategory',
			type:'post',
			data:brandData,
			success:function(result){
				if(result.success){
					location.reload()
				}else{
					alert('品牌添加失败')
					console.log(result)
				}
			}
		})
      ```
   