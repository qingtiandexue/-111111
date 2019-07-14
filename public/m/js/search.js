$(function () {
  $('#btn').on('click', function () {
    let keyWord = $('#ipt').val()
    if (!keyWord) {
      alert('please input content')
      return
    }
     location.href='sRes.html?keyword='+keyWord
    if (keyArr.indexOf(keyWord) == -1) {
      keyArr.unshift(keyWord)
      localStorage.setItem('keywords', JSON.stringify(keyArr.slice(0,4)))
    }
  })
  var keyArr = []
  if (localStorage.getItem('keywords')) {
    keyArr = JSON.parse(localStorage.getItem('keywords'))
    var html = template('history', { data: keyArr })
    $('#history-list').html(html)
  }
  $('.clear').on('click', function () {
    $('#history-list').html('')
    localStorage.removeItem('keywords')
  })

})
// $(function () {
//     const storageKey = 'keyArr'  
//     $('#btn').on('click',function () {
//       let keyWord = $('#ipt').val()
//       if(!keyWord){
//         alert('请输入关键字')
//         return
//       }
//         location.href='sRes.html?keyword='+keyWord  
//         keyArr.push(keyWord)
//         localStorage.setItem(storageKey,JSON.stringify(keyArr))
//     })
//     $('.clear').on('click',function () {
//       keyArr = []
//       $('.history-list').html('')
//       localStorage.removeItem(storageKey)
//     }) 
//     let keyArr = []
//     if(localStorage.getItem(storageKey)){
//       keyArr = JSON.parse(localStorage.getItem('keyArr'))
//       console.log(keyArr);
//       let html = template('history',{ keyArr: keyArr })
//       $('#history-list').html(html)
//     }
//   })