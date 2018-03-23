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
            newItem: {
                type: '',
                title: '',
                date: '',
                cont: ''
            }
        },
        firebase: {
            items: itemsRef
        },
        computed: {
            reverseItems() {
                return this.items.slice(0).reverse()
            }
        },
        methods: {
            myTitleClass: function () {
                this.alterClass = ""
            },
            newAddItem: function () {
                $('.editModal').modal('toggle')
                $('#froala-editor').froalaEditor('html.set', '')
                this.newItem = {}
                this.newItem.title = ''
                this.newItem.type = '0'
                this.newItem.title = ''
                this.newItem.date = ''
                this.newItem.cont = ''
                // toastr.info('建立新項目')
            },
            addItem: function () {
                if (this.newItem.title === "") {
                    this.alterClass = "shake is-invalid"
                    toastr.error('標題為必填欄位')
                } else {
                    this.newItem.cont = $('#froala-editor').froalaEditor('html.get')
                    itemsRef.push(this.newItem)
                    this.newItem.type = ''
                    this.newItem.title = ''
                    this.newItem.date = ''
                    this.newItem.cont = ''
                    toastr.info('新增成功')
                    $('.editModal').modal('toggle')
                }
            },
            editItem: function (item) {
                $('#froala-editor').froalaEditor('html.set', item.cont)
                this.newItem = item

                $('.editModal').modal('show')
                // toastr.success('編輯這個項目')
            },
            removeItem: function (item) {
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
            updateItem: function (item) {
                if (this.newItem.title === "") {
                    this.alterClass = "shake is-invalid"
                    toastr.error('標題為必填欄位')
                } else {
                    item.cont = $('#froala-editor').froalaEditor('html.get')

                    let childKey = item['.key']
                    delete item['.key']
                    itemsRef.child(childKey).set(item)
                    delete childKey
                    toastr.info('更新成功')
                    $('.editModal').modal('toggle')
                    // location.reload()
                    }
            },
            CancelBtn: function (item) {
                delete item['.key']
                this.newItem = {}
                this.alterClass = ''
                $('.editModal').modal('toggle')
            }
        }
    })

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

    $('button').tooltip()
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
        // toolbarButtons: [
        //     'undo', 'redo', '|', 'paragraphFormat', 'fontSize', 'color', '|', 'underline', 'bold', 'italic', 'underline', '|', 'formatOL',
        //     'formatUL', 'insertHTML', 'html'
        // ]
    })
        .on('froalaEditor.contentChanged', function (e, editor) {
            editor.events.bindClick($('section.btn-group'), 'button[data-iconSet-1]', function () {
                editor.html.insert('<i class="ml-1 fa fa-file-pdf-o text-danger"></i>')
                editor.events.focus()
            })
            editor.events.bindClick($('section.btn-group'), 'button[data-iconSet-2]', function () {
                editor.html.insert('<i class="ml-1 fa fa-file-word-o text-primary"></i>')
                editor.events.focus()
            })
            editor.events.bindClick($('section.btn-group'), 'button[data-iconSet-new]', function () {
                editor.html.insert('<img class="ml-2" src="//mtrsoftware.com.tw/images/new17.gif">')
                editor.events.focus()
            })
        })
})
