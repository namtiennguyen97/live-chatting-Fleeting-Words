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
    soundOnlineAlert();
})

//ton tai user


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
    socket.emit('check-user-exist');
    socket.on('check-user-exist-arr', data => {
        data.forEach(items => {
            if (input.value === items.username){
                $('#chat-history #validateLogin').text('Tên người dùng này đã có người sử dụng!');
                input.value = '';
            }
        })
    })
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
        '            <div class="chat-about">' +
        '                <div class="chat-with">Phòng chung <i class="fas fa-home"></i></div>' +
        '                <div class="chat-num-messages">Nơi tất cả mọi người chia sẻ- Phòng hội nghị ;)</div>' +
        '            </div>' +
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
        socket.emit('user-login', dataLogin);
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
    // socket.emit('leave room');
    soundOnlineDisconnect();
    localStorage.removeItem('chat-username');
    $('.logout .logoutBtn').text('Đang đăng xuất...');
    setTimeout(function(){
        window.location.reload();
        }, 3000);
}

function showToastrLogin(){
    toastr.info('Bạn đã tham gia phòng chat!');
}
// sound zone
function soundOnlineAlert(){
    let soundAlert = $('#msg-receive-online')[0];
    soundAlert.play();
}
function soundOnlineDisconnect(){
    let soundAlert = $('#msg-receive-disconnected')[0];
    soundAlert.play();
}
function soundSendMessage(){
    let soundAlert = $('#msg-receive-sound')[0];
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
$(window).on('load', function() {
    /*------------------
        Preloder
    --------------------*/
    $(".loader").fadeOut();
    $("#preloder").delay(1000).fadeOut("slow");

});

// ngan ko cho right click
document.addEventListener('contextmenu', event => event.preventDefault());
//ngan khong cho f12 xem src nguon
$(document).keydown(function (event) {
    if (event.keyCode == 123) { // Prevent F12
        return false;
    } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) { // Prevent Ctrl+Shift+I
        return false;
    }
});

function markStar(userId){
    userId = userId.item(0).id;
    $('#all-user-list #'+ userId + '.far').toggleClass('fas')
}


function getDateTime(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() ;
    return today = time +' '+ mm + '/' + dd + '/' + yyyy;
}


$('#form-send-message').on('submit', function (e){
    e.preventDefault();
    let input = document.getElementById('input-message');
    let userLocalData = JSON.parse(localStorage.getItem('chat-username'));
    if (input.value){
        let userData = {
            'avatar' : userLocalData.avatar,
            'username' : userLocalData.username,
            'token' : userLocalData.token,
            'message' : input.value
        }
        socket.emit('chat-msg', userData);
        input.value = '';
    }
})

socket.on('chat-msg', data => {
    soundSendMessage();
    let currentUserToken = JSON.parse(localStorage.getItem('chat-username'));
    if (data.token !== currentUserToken.token){
        $('#chat-history #chat-content').append('<li class="clearfix">' +
            '                    <div class="message-data align-right">' +
            '                        <span class="message-data-time">'+ getDateTime() +'</span>' +
            '                        <span class="message-data-name-enemy">'+ data.username + '</span> <img class="avatar-content" src="'+ data.avatar +'">' +
            '                    </div>' +
            '                    <div class="message other-message float-right">' +
            ''+ data.message +'' +
            '                    </div>' +
            '                </li>');
        scrollToHeight();
    } else {
        $('#chat-history #chat-content').append('<li>' +
            '                    <div class="message-data">' +
            '                        <span class="message-data-name"><img class="avatar-content" src="'+ data.avatar + '">'+ 'Bạn' +'</span>' +
            '                        <span class="message-data-time">'+ getDateTime() +'</span>' +
            '                    </div>' +
            '                    <div class="message my-message">' +
            ''+ data.message +'' +
            '                    </div>' +
            '                </li>');
        scrollToHeight();
    }
})

function scrollToHeight(){
    let objDiv = document.getElementById("chat-history");
    objDiv.scrollTop = objDiv.scrollHeight;
}



$('#public-room').click(function (){
    if (localStorage.getItem('chat-username')){
        $('#public-room').toggleClass('active-room-tab');
        socket.emit('public-room');
        headerPublicRoom();
        chatBoxShowing();
    }
});

