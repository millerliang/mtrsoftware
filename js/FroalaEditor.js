// javascript IIFE 匿名 function 即刻執行 or ES6 {}
// (function () {
$(function () {
    // Initialize Firebase
    const config = {
        // apiKey: "AIzaSyDRto90KkThWy9JM4aEj7Uhf8MUR1gbfhI",
        // authDomain: "my-test-site-fef4c.firebaseapp.com",
        databaseURL: "//my-test-site-fef4c.firebaseio.com",
        // projectId: "my-test-site-fef4c",
        // storageBucket: "my-test-site-fef4c.appspot.com",
        // messagingSenderId: "734922552802"
    }
    firebase.initializeApp(config)

    const db = firebase.database()
    const itemsRef = db.ref('newsitems')

    const app = new Vue({
        el: '#app',
        data: {
            alterClass: '',
            creatNew: {
                type: '0',
                title: '',
                date: '',
                twYear: '',
                cont: '',
                editDate: ''
            },
            newItem: {
                type: '',
                title: '',
                date: '',
                twYear: '',
                cont: '',
                editDate: ''
            }
        },
        firebase: {
            items: itemsRef
        },
        computed: {
            reverseItems() {
                return this.items.slice(0).reverse()
            },
            calculateDate: {
                get: function () {
                    return this.newItem.date
                },
                set: function (value) {
                    this.newItem.date = value
                    this.newItem.twYear = value.substr(0, 4) - 1911 + '年'
                    // this.twMon = value.replace(/-/g,".").substr(6, 2)
                }
            },
            timeStamp() {
                const now = new Date() // 建立目前時間容器
                let date = [now.getFullYear(), now.getMonth() + 1, now.getDate()] // 取得年月日
                let time = [now.getHours(), now.getMinutes()] // 現在時間
                let suffix = (time[0] < 12) ? 'AM' : 'PM' // 判斷上下午
                time[0] = (time[0] < 12) ? time[0] : time[0] - 12

                for (let i = 1; i < 3; i++) {
                    if (time[i] < 10) {
                        time[i] = '0' + time[i]
                    }
                }
                return date.join('/') + ' ' + suffix + ' ' + time.join(':')
            }
        },
        methods: {
            myTitleClass () {
                this.alterClass = ""
            },
            newAddItem: function () {
                $('.editModal').modal('toggle')
                $('#froala-editor').froalaEditor('html.set', '')
                this.newItem = this.creatNew
                // toastr.info('建立新項目')
            },
            addItem () {
                if (this.newItem.title === "") {
                    this.alterClass = "shake is-invalid"
                    toastr.error('標題為必填欄位')
                } else {
                    this.newItem.editDate = this.timeStamp
                    this.newItem.cont = $('#froala-editor').froalaEditor('html.get')
                    itemsRef.push(this.newItem)
                    toastr.info('新增成功')
                    $('.editModal').modal('toggle')
                }
            },
            editItem (item) {
                $('#froala-editor').froalaEditor('html.set', item.cont)
                this.newItem = item

                $('.editModal').modal('show')
                // toastr.success('編輯這個項目')
            },
            removeItem (item) {
                let checkstr = confirm('確定刪除此項目？')
                if (checkstr == true) {
                    itemsRef.child(item['.key']).remove()
                    toastr.error('刪除成功')
                    delete item['.key']
                    this.newItem = ''
                } else {
                    return false
                }
            },
            updateItem(item) {
                if (this.newItem.title === "") {
                    this.alterClass = "shake is-invalid"
                    toastr.error('標題為必填欄位')
                } else {
                    let childKey = item['.key']
                    itemsRef.child(item['.key']).remove()
                    delete item['.key']
                    this.newItem.editDate = this.timeStamp
                    this.newItem.cont = $('#froala-editor').froalaEditor('html.get')
                    itemsRef.child(childKey).set(this.newItem)
                    delete childKey
                    toastr.info('更新成功')
                    $('.editModal').modal('toggle')
                }
            },
            CancelBtn () {
                this.alterClass = ''
                $('.editModal').modal('toggle')
            }
        }
    })

    /* event listener */
    // document.querySelector('#itemAuthor').addEventListener('change', doThing);

    /* function */
    // function doThing() {
    //     if (this.value === ''){
    //         document.querySelector('#twYear').value = ('')
    //         return false
    //     }else{
    //         let tempNum = this.value.replace(/-/g,".")
    //         let twYear = (this.value.substr(0,4) - 1911 )
    //         // document.querySelector('#twYear').value = (`${tempNum} = 民國 ${twYear}年`)
    //         document.querySelector('#twYear').value = (`${twYear}年`)
    //     }
    // }

    // Do something​
    // const QS = document.querySelector('.form-control') // 簡化固定 Const 變數

    // let clickHandler = function (){ // 變數 function
    //     // document.querySelector('.form-control h4').innerHTML = 'New Preview 222'
    //     this.firstElementChild.innerHTML = 'New Preview 333'
    //     // this.querySelector('h4').innerHTML = 'New Preview 444'
    // }

    // QS.addEventListener('click', clickHandler) // 執行 function

    // QS.addEventListener('click', function (e) {
    //     e.preventDefault()
    //     const choice = confirm("sure u want to Toggle Red Class?")
    //     if (choice) {
    //         setTimeout(() => {
    //             this.classList.toggle("text-danger")
    //         }, 1000)
    //         return false
    //     }
    // })
    // })()

    // $(function () {
    toastr.options = {"timeOut": "800"} // Toast show timeOut

    $('button').tooltip() // bootstrap v4.0 tooltip
    $('#froala-editor').froalaEditor({
        // iframeStyleFiles: ['//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
        language: 'zh_tw',
        heightMin: 250,
        heightMax: 500,
        placeholderText: '在此處編輯您的內容',
        inlineStyles: {
            'Big Red': 'font-size: 20px color: red',
            'Big Blue': 'font-size: 18px color: blue',
            'Small Blue': 'font-size: 14px color: blue'
        },
        paragraphStyles: {
            'text-muted': 'Grey',
            'btn btn-danger': 'btn-danger',
            'text-primary': 'text-primary'
        },
        // toolbarSticky: true,
        // colorsBackground: ['#61BD6D', '#1ABC9C', '#aa00ee', 'REMOVE'],
        toolbarButtons: [
            'undo', 'redo', '|', 'paragraphFormat', 'fontSize', 'insertLink', 'insertImage', 'color', '|', 'underline', 'bold', 'italic',
            'insertTable', 'paragraphStyle', '|', 'align', 'formatOL', 'formatUL', 'insertHTML', 'outdent', 'indent', '|', 'clearFormatting', 'html'
        ]
    })
    .on('froalaEditor.contentChanged', function (e, editor) {
        // $('#froala-editor').froalaEditor('html.get');
        // $('textarea#froala-editor').froalaEditor('html.get')
        editor.events.bindClick($('section.btn-group'), 'button[data-iconSet-1]', function () {
            editor.html.insert('<i class="ml-1 fa fa-file-pdf-o text-danger"></i>')
            editor.events.focus()
        })
        editor.events.bindClick($('section.btn-group'), 'button[data-iconSet-2]', function () {
            editor.html.insert('<i class="ml-1 fa fa-file-word-o text-primary"></i>')
            editor.events.focus()
        })
        editor.events.bindClick($('section.btn-group'), 'button[data-iconSet-3]', function () {
            editor.html.insert('<i class="ml-1 fa fa-file-image-o text-muted"></i>')
            editor.events.focus()
        })
        editor.events.bindClick($('section.btn-group'), 'button[data-iconSet-4]', function () {
            editor.html.insert('<i class="ml-1 fa fa-external-link text-primary"></i>')
            editor.events.focus()
        })
        editor.events.bindClick($('section.btn-group'), 'button[data-iconSet-new]', function () {
            editor.html.insert('<img class="ml-2" src="imgs/newIco.gif">')
            editor.events.focus()
        })
    })
})