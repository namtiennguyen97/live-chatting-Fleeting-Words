
$('#dataMenuSound').hide();
$('#dataMenuHome').hide();
$('#dataMenuGuide').hide();
$('#dataMenuLogin').hide();

$('#dataMenu').click(function (){
    $('.fa-angle-double-up').toggleClass('fa-chevron-down');
    $('#dataMenuHome').toggle();
    $('#dataMenuSound').toggle();
    $('#dataMenuSoundUp').toggle();
    $('#dataMenuGuide').toggle();
    $('#dataMenuLogin').toggle();
});

// $('#option-zone').on('click','.dataMenuSound', function () {
//     $('#dataMenuSound').replaceWith("<a href='javascript:' id='dataMenuSoundUp' class='dataMenuSound'><i class='fas fa-volume-mute'></i></a>");
// });
// $('#option-zone').on('click','#dataMenuSoundUp', function () {
//     $('#dataMenuSoundUp').replaceWith("<a href='javascript:' id='dataMenuSound' class='dataMenuSound'><i class='fas fa-volume-up'></i></a>");
// });

$('.dataMenuSound').click(function (){
    $('.fa-volume-mute').toggleClass('fa-volume-up');
});

$('#dataMenuGuide').click(function (){
    $('.fa-user-cog').toggleClass('fa-user-alt-slash');
    $('#showGuide').toggle();
});

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}