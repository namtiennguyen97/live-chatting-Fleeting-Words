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

socket.on('count-total-data', data =>{
    $('#count-user-online').text(data);
})

socket.on('count-user-down', data =>{
    $('#count-user-online').text(data);
})

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


$('#form-send-message').on('submit', function (e) {
    e.preventDefault();
})

// render form login khi khong co localStorage
if (!localStorage.getItem('chat-username')) {
    $('.logout').hide();
    $('.chat-message').hide();
    chatHeaderEmptyLogin();
    $('#chat-history').html('<div class="form-login">' +
        '<label><b>Bạn cần đăng nhập để truy cập phòng chat</b></label>' +
        '<br>' +
        '    <input type="text" id="firstname"  placeholder="Tên của bạn.." oninput="checkUsername()">' +
        '<br>' +
        '<span id="validateUsername" class="validateUsername" style="color: #fd7d49"></span>' +
        '<br>' +
        '    <label for="lname"><b>Chọn Avatar tạm thời</b></label>' +
        '<br>' +
        '<span class="tags" gloss="Cô nàng A2"><img  onclick="chooseAvatar(1)" id="firstAvatar" class="login-avatar" src="https://raw.githubusercontent.com/namtiennguyen97/UpLoadImage/master/a2.gif" alt="Avatar"></span> ' +
        '<span class="tags" gloss="Thợ săn 2B"><img  onclick="chooseAvatar(2)" id="secondAvatar" class="login-avatar" src="https://raw.githubusercontent.com/namtiennguyen97/UpLoadImage/master/newIconAva/download%20(5).gif" alt="Avatar"></span> ' +
        '<span class="tags" gloss="2B Battle"><img  onclick="chooseAvatar(3)" id="thirdAvatar" class="login-avatar" src="https://raw.githubusercontent.com/namtiennguyen97/UpLoadImage/master/avatar2.gif" alt="Avatar"> </span>' +
        '<span class="tags" gloss="Hacker 9S"><img  onclick="chooseAvatar(4)" id="fourthAvatar" class="login-avatar" src="https://raw.githubusercontent.com/namtiennguyen97/UpLoadImage/master/9s.gif" alt="Avatar"></span>' +
        '<span class="tags" gloss="Cô nàng 2B"><img onclick="chooseAvatar(5)" id="firthAvatar" class="login-avatar" src="https://raw.githubusercontent.com/namtiennguyen97/UpLoadImage/master/newIconAva/asd.gif" alt="Avatar"></span>' +
        '<br>' +
        '<br>'+
        '<span id="validateLogin" class="validateUsername" style="color: #fd7d49"></span>' +
        '    <button id="loginButton" onclick="login()">Đăng nhập <i class="fas fa-key"></i></button>' +
        '</div>');
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
        '                <div class="chat-num-messages">Hiện đang có 11 người online <i class="fa fa-circle online"></i></div>' +
        '            </div>' +
        '            <i class="fa fa-star"></i>');
}
//header sau khi login- auto Public room
function headerAfterLogin(){
    $('.chat-header').html('<img class="avatar-chat" src="https://raw.githubusercontent.com/namtiennguyen97/UpLoadImage/master/tumblr_p96i9gKKbI1xut6buo1_1280.gif"\n' +
        '                 alt="avatar"/>\n' +
        '\n' +
        '            <div class="chat-about">\n' +
        '                <div class="chat-with">Phòng chung <i class="fas fa-home"></i></div>\n' +
        '                <div class="chat-num-messages">Nơi tất cả mọi người chia sẻ- Phòng hội nghị ;)</div>\n' +
        '            </div>\n' +
        '            <i class="fa fa-star"></i>');
}
//khung chat sau khi login
function chatboxAfterLogin(){
    $('#chat-history').html('   <ul style="list-style: none">\n' +
        '                <li class="clearfix">\n' +
        '                    <div class="message-data align-right">\n' +
        '                        <span class="message-data-time">10:10 AM, Today</span> &nbsp; &nbsp;\n' +
        '                        <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>\n' +
        '                    </div>\n' +
        '                    <div class="message other-message float-right">\n' +
        '                        Hi Vincent, how are you? How is the project coming along?\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '\n' +
        '                <li>\n' +
        '                    <div class="message-data">\n' +
        '                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>\n' +
        '                        <span class="message-data-time">10:12 AM, Today</span>\n' +
        '                    </div>\n' +
        '                    <div class="message my-message">\n' +
        '                        Are we meeting today? Project has been already finished and I have results to show you.\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '\n' +
        '                <li class="clearfix">\n' +
        '                    <div class="message-data align-right">\n' +
        '                        <span class="message-data-time">10:14 AM, Today</span> &nbsp; &nbsp;\n' +
        '                        <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>\n' +
        '\n' +
        '                    </div>\n' +
        '                    <div class="message other-message float-right">\n' +
        '                        Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced\n' +
        '                        any problems at the last phase of the project?\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '\n' +
        '                <li>\n' +
        '                    <div class="message-data">\n' +
        '                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>\n' +
        '                        <span class="message-data-time">10:20 AM, Today</span>\n' +
        '                    </div>\n' +
        '                    <div class="message my-message">\n' +
        '                        Actually everything was fine. I\'m very excited to show this to our team.\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '\n' +
        '                <li>\n' +
        '                    <div class="message-data">\n' +
        '                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>\n' +
        '                        <span class="message-data-time">10:31 AM, Today</span>\n' +
        '                    </div>\n' +
        '                    <i class="fa fa-circle online"></i>\n' +
        '                    <i class="fa fa-circle online" style="color: #AED2A6"></i>\n' +
        '                    <i class="fa fa-circle online" style="color:#DAE9DA"></i>\n' +
        '                </li>\n' +
        '\n' +
        '            </ul>');
}

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
        chatBoxShowing();
        headerAfterLogin();
        $('.logout').show();
        showToastrLogin();
        socket.emit('new-user-connection', dataLogin);
        socket.emit('make-count-user');
    }
}



function chatBoxShowing(){
    let html = ' <ul style="list-style: none">\n' +
        '                <li class="clearfix">\n' +
        '                    <div class="message-data align-right">\n' +
        '                        <span class="message-data-time">10:10 AM, Today</span> &nbsp; &nbsp;\n' +
        '                        <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>\n' +
        '                    </div>\n' +
        '                    <div class="message other-message float-right">\n' +
        '                        Hi Vincent, how are you? How is the project coming along?\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '\n' +
        '                <li>\n' +
        '                    <div class="message-data">\n' +
        '                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>\n' +
        '                        <span class="message-data-time">10:12 AM, Today</span>\n' +
        '                    </div>\n' +
        '                    <div class="message my-message">\n' +
        '                        Are we meeting today? Project has been already finished and I have results to show you.\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '\n' +
        '                <li class="clearfix">\n' +
        '                    <div class="message-data align-right">\n' +
        '                        <span class="message-data-time">10:14 AM, Today</span> &nbsp; &nbsp;\n' +
        '                        <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>\n' +
        '\n' +
        '                    </div>\n' +
        '                    <div class="message other-message float-right">\n' +
        '                        Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced\n' +
        '                        any problems at the last phase of the project?\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '\n' +
        '                <li>\n' +
        '                    <div class="message-data">\n' +
        '                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>\n' +
        '                        <span class="message-data-time">10:20 AM, Today</span>\n' +
        '                    </div>\n' +
        '                    <div class="message my-message">\n' +
        '                        Actually everything was fine. I\'m very excited to show this to our team.\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '\n' +
        '                <li>\n' +
        '                    <div class="message-data">\n' +
        '                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>\n' +
        '                        <span class="message-data-time">10:31 AM, Today</span>\n' +
        '                    </div>\n' +
        '                    <i class="fa fa-circle online"></i>\n' +
        '                    <i class="fa fa-circle online" style="color: #AED2A6"></i>\n' +
        '                    <i class="fa fa-circle online" style="color:#DAE9DA"></i>\n' +
        '                </li>\n' +
        '\n' +
        '            </ul>'
    $('#chat-history').html(html);
    $('.chat-message').show();
    normalChatHeaderInformation()
}

function normalChatHeaderInformation(){
    let html = '<img class="avatar-chat" src="https://raw.githubusercontent.com/namtiennguyen97/UpLoadImage/master/a2.gif"\n' +
        '                 alt="avatar"/>\n' +
        '\n' +
        '            <div class="chat-about">\n' +
        '                <div class="chat-with">Chat with Vincent Porter</div>\n' +
        '                <div class="chat-num-messages">already 1 902 messages</div>\n' +
        '            </div>\n' +
        '            <i class="fa fa-star"></i>';
    $('.chat-header').html(html);
}

//logout delete storage key
function logout(){
    socket.emit('logout');
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
$('#form-send-message').on('submit', function (e){
    e.preventDefault();
    let input = document.getElementById('');
})
