let socket = io();
let src = '';



//su kien co nguoi dung ket noi
socket.on('new-user', data =>{
    toastr.info(data.username +' đã tham gia phòng chat!');
    socket.emit('add-new-user-list', data);
    $('#all-user-list').append('<li class="clearfix list-online" id="'+ data.token +'">' +
        '                    <img class="avatar-on-the-list"' +
        '                         src="'+ data.avatar +'"' +
        '                         alt="avatar"/>' +
        '                    <div class="about">' +
        '                        <div class="name name-user">'+ data.username +' <i id="'+ data.token +'" class="far fa-star mark-important" onclick="markStar('+ data.token +')"></i></div>' +
        '                        <div class="status">' +
        '                            <i class="fa fa-circle online"></i> Trực tuyến' +
        '                        </div>' +
        '                    </div>' +
        '                </li>');
})

// dem so luong nguoi sau khi dang nhap
socket.on('count-total-data', data =>{
    $('#count-user-online').text(data);
})

//live count- dem so luong nguoi truc tuyen tren sv
socket.on('count-online', data =>{
    $('#count-user-online').text(data);
})

socket.on('count-user-down', data =>{
    $('#count-user-online').text(data);
})
//end of count

//su kien co nguoi dung ngat ket noi
socket.on('user-disconnected', name =>{
    name = name? name : 'Một người dùng';
    toastr.warning(name +' đã ngắt kết nối!');
})

socket.on('logout-user', data =>{
    let arr = data.filter(value => {
        if(value.token !== data[0].token){
            return true;
        }
    });
    $('#all-user-list #'+ data[0].token).remove();
    socket.emit('update-user-list', arr);
})

socket.on('user-arr', data =>{
    if (localStorage.getItem('chat-username')){
        let getLocalData = JSON.parse(localStorage.getItem('chat-username'));
        let userToken = getLocalData.token;
        let currentUserIndex = data.findIndex(x => x.token === userToken);
        data.splice(currentUserIndex, 1);
    }
    data.forEach(items =>{
            $('#all-user-list').append('<li class="clearfix list-online" id="'+ items.token +'">' +
                '                    <img class="avatar-on-the-list"' +
                '                         src="'+ items.avatar +'"' +
                '                         alt="avatar"/>' +
                '                    <div class="about">' +
                '                        <div class="name name-user">'+ items.username +' <i id="'+ items.token +'" class="far fa-star mark-important" onclick="markStar('+ items.token +')"></i></div>' +
                '                        <div class="status">' +
                '                            <i class="fa fa-circle online"></i> Trực tuyến' +
                '                        </div>' +
                '                    </div>' +
                '                </li>');
    });

})


// render form login khi khong co localStorage
if (!localStorage.getItem('chat-username')) {
    $('.logout').hide();
    $('.chat-message').hide();
    chatHeaderEmptyLogin();
    $('#form-login').show();
    $('#chat-content').hide();
}
else {
    blankPage()
}

//validate username
function checkUsername() {
    let input = document.getElementById('firstname');
    if (input.value.length > 15) {
        $('#chat-history #validateUsername').text('Tên không được quá 15 kí tự!');
        input.value = '';
    }
}

//header truoc khi login
function chatHeaderEmptyLogin() {
    $('.chat-header').html('<div class="chat-about">' +
        '                <div class="chat-with">Chào mừng đến phòng chat Fleeting Words</div>' +
        '                <div class="chat-num-messages">Fleeting Words - Không lưu trữ, không ràng buộc <i style="color: #7ac108" class="fas fa-comment-slash"></i></div>' +
        '            </div>' +
        '            <i class="fa fa-star"></i>');
}
//header sau khi login- auto Public room
function headerPublicRoom(){
    $('.chat-header').html('<img class="avatar-chat" src="https://raw.githubusercontent.com/namtiennguyen97/UpLoadImage/master/tumblr_p96i9gKKbI1xut6buo1_1280.gif"\n' +
        '                 alt="avatar"/>' +
        '\n' +
        '            <div class="chat-about">' +
        '                <div class="chat-with">Phòng chung <i class="fas fa-home"></i></div>' +
        '                <div class="chat-num-messages">Nơi tất cả mọi người chia sẻ- Phòng hội nghị ;)</div>' +
        '            </div>\n' +
        '            <i class="fa fa-star"></i>');
}
//khung chat sau khi login

function chooseAvatar(num) {
    $('#chat-history').on('click', '.login-avatar', function () {
        switch (num) {
            case 1:
                $('#firstAvatar').addClass('isActive-avatar');
                src = $('#firstAvatar').attr('src');
                chooseOne('secondAvatar', 'thirdAvatar', 'fourthAvatar', 'firthAvatar')
                break;
            case 2:
                $('#secondAvatar').addClass('isActive-avatar');
                src = $('#secondAvatar').attr('src');
                chooseOne('firstAvatar', 'thirdAvatar', 'fourthAvatar', 'firthAvatar')
                break;
            case 3:
                $('#thirdAvatar').addClass('isActive-avatar');
                src = $('#thirdAvatar').attr('src');
                chooseOne('secondAvatar', 'firstAvatar', 'fourthAvatar', 'firthAvatar')
                break;
            case 4:
                $('#fourthAvatar').addClass('isActive-avatar');
                src = $('#fourthAvatar').attr('src');
                chooseOne('secondAvatar', 'thirdAvatar', 'firstAvatar', 'firthAvatar')
                break;
            case 5:
                $('#firthAvatar').addClass('isActive-avatar');
                src = $('#firthAvatar').attr('src');
                chooseOne('secondAvatar', 'thirdAvatar', 'fourthAvatar', 'firstAvatar')
                break;
        }
        return src
    })
}

function chooseOne(ava1, ava2, ava3, ava4) {
    $('#' + ava1).removeClass('isActive-avatar');
    $('#' + ava2).removeClass('isActive-avatar');
    $('#' + ava3).removeClass('isActive-avatar');
    $('#' + ava4).removeClass('isActive-avatar');
}

function login() {
    let input = document.getElementById('firstname');
    if (!input.value) {
        $('#chat-history #validateLogin').text('Vui lòng nhập tên người đăng nhập!');
    }
    if (!src) {
        $('#chat-history #validateLogin').text('Vui lòng chọn ảnh đại diện tạm thời!');
    }
    if (input.value && src){
        $("#chat-history #loginButton").text('Đang nhập thành công, vui lòng đợi...');
        let dataLogin = {
            'username': input.value,
            'avatar': src,
            'token': makeid()
        };
        localStorage.setItem('chat-username', JSON.stringify(dataLogin));
        //khoi dau sau khi login se la blank page
        blankPage();
        $('#form-login').hide();
        chatHeaderEmptyLogin();
        $('.logout').show();
        showToastrLogin();
        socket.emit('new-user-connection', dataLogin);
        socket.emit('make-count-user');
    }
}

function blankPage(){
    $('#chat-content').hide();
    $('.chat-message').hide();
    $('#form-login').hide();
}

function chatBoxShowing(){
    $('#chat-content').show();
    $('.chat-message').show();
    headerPublicRoom()
}


//logout delete storage key
function logout(){
    socket.emit('logout');
    socket.emit('leave room');
    localStorage.removeItem('chat-username');
    window.location.reload();
}

function showToastrLogin(){
    toastr.info('Bạn đã tham gia phòng chat!');
}
// sound zone
function soundOnlineAlert(){
    let soundAlert = $('#msg-receive-online')[0];
    soundAlert.play();
}


//random token user
function makeid() {
    let result           = '';
    let characters       = 'abcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for ( var i = 0; i < 12; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}



//chat function zone -------------------------------------------

