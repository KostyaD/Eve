/* jshint devel:true */
console.log('\'Allo \'Allo!');

$(document).ready(function(){
  
  var photo_json;
  
  function render_photo(photo_list) {
    $.each(photo_list, function(index, value){
      var src = value.image;
      var id = value.id;
      $('.photo-list').each(function(index){
        $(this).prepend(' \
          <label style="background-image:url('+_url+src+');"> \
            <input type="checkbox" name="photo" value="'+id+'"> \
          </label> \
        ')
      });
    })
  }
  
  function get_photo_json() {
    $.ajax({
      url: _url+"/photo/",
      dataType: 'json',
      success: function(data){
        render_photo(data.photo_list)
      }
    });
  };
  
  function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  
  get_photo_json();
  
  $(window).load(function(){
    $('.slide.n1').addClass('active');
    $('body').on('tap', '.btn, .btn-nostyle', function(e){
      e.preventDefault();
      
      href = $(this).attr('href').split('#');
      
      if (href[1] && $('.'+href[1]).size()>0 && !$(this).is('.disabled')) {
        if (href[1]=='isprinted') {
          var _id = $('.slide.print .photo-list input[type="checkbox"]:checked').val();
          $.ajax({
            url: _url+"/print/"+_id,
            success: function(data){
              $('.slide').removeClass('active');
              $('.'+href[1]).addClass('active');
            }
          });
        } else if(href[1]=='isemailsend'){
          var _ids = [];
          var email;
          $('.slide.email .photo-list input[type="checkbox"]:checked').each(function(){
            _ids.push($(this).val());
          });
          console.log(_ids);
          email = $('input[name="email"]').val();
          var serialized = $('.slide.email .photo-list').serialize();
          $.ajax({
            url: _url+"/email/",
            data: serialized + '&' + $.param({
              email: email
            }),
            success: function(data){
              console.log(data);
              $('.slide').removeClass('active');
              $('.'+href[1]).addClass('active');
            }
          });
        } else if(href[1]=='preview'){
          var _src  = $('.participate-photo .photo-list input:checked').closest('label').css('background-image').replace('url(','').replace(')','');
          var _text = $('.slide.answer textarea[name="answer"]').val();
          $('.slide.preview .text p').text(_text);
          $('.slide.preview .photo img').attr('src', _src);
          
          $('.slide').removeClass('active');
          $('.'+href[1]).addClass('active'); 
        } else if(href[1]=='participate-photo') {
          $('.slide.participate-photo .photo-list input').prop('checked', false);
          $('.slide.participate-photo .photo-list input').change();

          $('.slide').removeClass('active');
          $('.'+href[1]).addClass('active');
        } else if(href[1]=='isparicipate') {
          var serialized = $('.slide.participate-photo .photo-list').serialize();
          var answer = $('.slide.answer textarea[name="answer"]').val();
          var socials = $('.slide.socials form').serialize();
          $.ajax({
            url: _url+"/participate/",
            data: serialized + '&' + socials + '&' + $.param({
              answer: answer
            }),
            success: function(data){
              console.log(data);
              $('.slide').removeClass('active');
              $('.'+href[1]).addClass('active');
            }
          });

        } else {
          $('.slide').removeClass('active');
          $('.'+href[1]).addClass('active'); 
        };
      };
    });
    
    $('input[type="checkbox"][name="agree"]').change(function(){
      $(this).closest('.slide').find('a.btn').toggleClass('disabled');
    });
    
    $('textarea[name="answer"]').bind('input propertychange', function(e){
      if ($(this).val()=="") {
        $(this).closest('.slide').find('a.btn').addClass('disabled');
      } else {
        $(this).closest('.slide').find('a.btn').removeClass('disabled');
      };
    });
    
    $('.socials input').bind('input propertychange', function(e){
      var _val = '';
      $('.socials input').each(function(){
        if ($(this).val()!='') {
          _val = $(this).val();
        }
      });
      if (_val=="") {
        $(this).closest('.slide').find('a.btn').addClass('disabled');
      } else {
        $(this).closest('.slide').find('a.btn').removeClass('disabled');
      };
    });
    
    $('input[name="email"]').bind('input propertychange', function(e){
      if (!IsEmail($(this).val())) {
        $(this).closest('.slide').find('a.btn').addClass('disabled');
      } else {
        $(this).closest('.slide').find('a.btn').removeClass('disabled');
      };
    });
    
    $('body').on('change', '.photo-list label input[type="checkbox"]', function(){
      var $photo_list = $(this).closest('.photo-list');
      var $checkboxes = $(this).closest('.photo-list').find('input[type="checkbox"]');
      var max_checked = $photo_list.attr('data-maxselect');
      var cur_checked = $photo_list.find('input[type="checkbox"]:checked').size();
      if (cur_checked>=max_checked) {
        $checkboxes.filter(':not(:checked)').attr("disabled", true);
      } else {
        $checkboxes.removeAttr("disabled");
      }
      var $slide = $(this).closest('.slide');
      if ($slide.find('input[type="checkbox"]:checked').size() > 0) {
        $slide.find('.btn').removeClass('disabled');
      } else {
        $slide.find('.btn').addClass('disabled');
      }
    });
    
  });

  $(document)
  .on('touchstart', '.btn', function(){
    $(this).addClass('btn-on-active');
  })
  .on('touchend', '.btn', function(){
    $(this).removeClass('btn-on-active');
  });

  var background = function() {
    var settings = {
      count: 3,
      time: 4000,
      path: 'images/back-',
      parent: '.js-background',
      active: 0
    }
    var auto = function() {
      $(settings.parent).find('li').eq(settings.active).addClass('active')
        .siblings().removeClass('active');
      settings.active++;
      if(settings.active == settings.count) {
        settings.active = 0;
      }
      setTimeout(auto, settings.time);
    }
    var init = function() {
      for(var i = 0; i < settings.count; i++) {
        $(settings.parent).append('<li style="background-image: url(' + settings.path + i + '.jpg);"></li>');
      }
      auto();
    }
    init();
  }
  background();
  
  /*
  var reload_time = 30;
  var reload_timer;
  
  function startReloadTimer(){
    clearTimeout(reload_timer);
    reload_timer = setTimeout(function(){
      location.href='';
    }, reload_time*1000);
  }
  
  $(document).on('click touchstart touchend', function () {
    startReloadTimer();
  });
  
  startReloadTimer();
  */
});