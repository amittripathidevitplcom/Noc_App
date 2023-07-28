
setTimeout(function () {
  var pageName = window.location.href.split('/')[window.location.href.split('/').length - 1];
  pageName = pageName.replace(/#/g, '')
  $(".sideBars").find("a[href='/" + pageName + "']").parents("li").addClass("active");
  $(".sideBars").find("a[href='/" + pageName + "']").addClass("active");
}, 500)


var count = 0;
var timer;
var flagSocietyNewOld = 0;
function togglesidebar() {  
  $('.mainPortal').toggleClass('sideopen'); 
}

function js_GetLegalEntity(elem) {
  var getLegalVal = $(elem).val();
  //alert(getLegalVal);
  if (parseInt(getLegalVal) == 1) {
    $('#RegisterNoBox').show();
    $("#RegistrationNo, #EnterOTP").val("");
    $("#ddlDistrictlist").focus();
    $('#FormsFill').hide();
    $('.saveCancelBtn').hide();
    $('#societyList').hide();
    $('#societyNewReg').hide();
  }
  else {
    $('#RegisterNoBox').hide();
    $('#societyList').hide();
    $('#FormsFill').show();
    $('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId').val("");
    $('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId').removeAttr('disabled');
    $('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId').removeClass('disabled');
    $('.saveCancelBtn').show();
    $('#societyNewReg').hide();
  }
}



function js_OTPModalClose() {
  clearInterval(timer);
  $("#RegistrationNo, #EnterOTP").val("")
}
function js_GetRegistrationDetails() {
  
  flagSocietyNewOld = 1;
  var RegisteredNo = "1";
  var RecState = $("#ddlRegistrationState").val();
  var RecDistrict = $("#ddlDistrictlist").val();
  var RecievedRegisteredNo = $("#OldRegistrationNo").val();
  $("#SecondCount").html("");
  count = 60;
  clearInterval(timer);
  if (RecState != "0" && RecState != null && RecState != undefined && RecDistrict != "0" && RecDistrict != null && RecDistrict != undefined) {
    if (RecState == "6") {
      if (RecievedRegisteredNo != "" && RecievedRegisteredNo != null && RecievedRegisteredNo != undefined) {
        if (RegisteredNo == RecievedRegisteredNo) {
          $('#ModalOtpVerify').modal('show');
          $("#EnterOTP").focus();
          $('#ResendOTP').addClass('d-none');
          $('#SecondCount').removeClass('d-none');
          timer = setInterval(function () {
            $("#SecondCount").html("Please Wait.." + count--);
            
            if (count <= 0) {
              clearInterval(timer);
              $('#ResendOTP').removeClass('d-none');
              $('#ResendOTP').addClass('d-block');
              $('#SecondCount').addClass('d-none');
            }
            else {
              //OTPs = '';
            }
          }, 1000);
        }
        else {
          $('#NotRegistered').modal('show');
        }
      }
      else {
        alert("Please Fill the all fields in the form ");
      }
    }
    else {
      js_NewRegisterApp();
    }
  }
  else {
    alert("Please Fill the all fields in the form ");
  }

}
function js_SendOTP1() {
  
  flagSocietyNewOld = 2;
  var NewPreMobileNo = $("#NewPreMobileNo").val();
  var NewPreEmailID = $("#NewPreEmailID").val();
  $("#SecondCount").html("");
  count = 60;
  clearInterval(timer);
  if (NewPreMobileNo != "" && NewPreMobileNo != null && NewPreMobileNo != undefined && NewPreEmailID != "" && NewPreEmailID != null && NewPreEmailID != undefined) {

    $('#ModalOtpVerify').modal('show');
    $("#EnterOTP").focus();
    $('#ResendOTP').addClass('d-none');
    $('#SecondCount').removeClass('d-none');
    timer = setInterval(function () {
      $("#SecondCount").html("Please Wait.." + count--);

      if (count <= 0) {
        clearInterval(timer);
        $('#ResendOTP').removeClass('d-none');
        $('#ResendOTP').addClass('d-block');
        $('#SecondCount').addClass('d-none');
      }
      else {
        //OTPs = '';
      }
    }, 1000);

  }
  else {
    alert("Please Fill the all fields in the form ");
  }
}

function js_CheckOTP() {

  var OTPs = 6565;
  var RecievedOtp = $("#EnterOTP").val();
  if (parseInt(RecievedOtp) == OTPs) {
    alert("Verify");
    
    if (flagSocietyNewOld == 2) {
      clearInterval(timer);
      $('#societyList').hide();
      $('#societyNewReg').hide();
      $('#FormsFill').show();
      $('#txtRegistrationNo').val($('#NewRegistrationNo').val());
      $('#txtPreMobNo').val($('#NewPreMobileNo').val());
      $('#txtPreMailId').val($('#NewPreEmailID ').val());
      $('#txtPreMobNo, #txtRegistrationNo, #txtPreMailId, input[name="LegalEntity"]').attr('disabled', 'disabled');
      $('#txtPreMobNo, #txtRegistrationNo, #txtPreMailId, input[name="LegalEntity"]').addClass('disabled');
      $('.saveCancelBtn').show();
      $('#ModalOtpVerify').modal('hide');
      $('#RegisterNoBox').hide();
    }

    else {
      $('#societyList').show();
      clearInterval(timer);
      $('#ModalOtpVerify').modal('hide');
      $('#RegisterNoBox').hide();
    }


  }
  else {
    alert("Please Enter Correct OTP");
  }
}

function js_ProceedSocietyList() {
  $('#FormsFill').show();
  $('#txtRegistrationNo').val("Reg/2018/12345");
  $('#txtPreMobNo').val("9876543210");
  $('#txtPreMailId').val("demo@gmail.com");
  $('#txtPreMobNo, #txtRegistrationNo, #txtPreMailId, input[name="LegalEntity"]').attr('disabled', 'disabled');
  $('#txtPreMobNo, #txtRegistrationNo, #txtPreMailId, input[name="LegalEntity"]').addClass('disabled');
  $('.saveCancelBtn').show();
  $('#societyNewReg').hide();
}

function js_NewRegisterApp() {
  $('#NotRegistered').modal('hide');
  $('#RegisterNoBox').hide();
  //$('#FormsFill').show();
  //$('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId, #RegistrationNo').val("");
  //$('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId').removeAttr('disabled');
  //$('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId').removeClass('disabled');
  //$('.saveCancelBtn').show();
  $('#societyNewReg').show();
}

function js_SaveDataCancel() {
  $('#FormsFill').hide();
  $('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId, #RegistrationNo').val("");
  $('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId, input[name="LegalEntity"]').removeAttr('disabled');
  $('#txtRegistrationNo, #txtPreMobNo, #txtPreMailId, input[name="LegalEntity"]').removeClass('disabled');
  $('#FormsFill input').val("");
  $('.saveCancelBtn').hide();
  $('#societyList').hide();
}
//alert('hello');

//Highcharts.chart('chart1', {
//  chart: {
//    plotBackgroundColor: null,
//    plotBorderWidth: null,
//    plotShadow: false,
//    type: 'pie'
//  },
//  title: {
//    text: 'Student',
//    align: 'left'
//  },
//  tooltip: {
//    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//  },
//  accessibility: {
//    point: {
//      valueSuffix: '%'
//    }
//  },
//  plotOptions: {
//    pie: {
//      allowPointSelect: true,
//      cursor: 'pointer',
//      dataLabels: {
//        enabled: false
//      },
//      showInLegend: true
//    }
//  },

//  credits: {
//    enabled: false
//  },
//  series: [{
//    name: 'Brands',
//    colorByPoint: true,
//    data: [{
//      name: 'Chrome',
//      y: 74.77,
//      sliced: true,
//      selected: true
//    }, {
//      name: 'Edge',
//      y: 12.82
//    }, {
//      name: 'Firefox',
//      y: 4.63
//    }, {
//      name: 'Safari',
//      y: 2.44
//    }, {
//      name: 'Internet Explorer',
//      y: 2.02
//    }, {
//      name: 'Other',
//      y: 3.28
//    }]
//  }]
//});


//Highcharts.chart('chart2', {
//  chart: {
//    type: 'column'
//  },
//  title: {
//    text: 'Student Monthaly Report'
//  },
//  xAxis: {
//    categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
//  },
//  credits: {
//    enabled: false
//  },
//  series: [{
//    name: 'John',
//    data: [5, 3, 4, 7, 2]
//  }, {
//    name: 'Jane',
//    data: [2, -2, -3, 2, 1]
//  }, {
//    name: 'Joe',
//    data: [3, 4, 4, -2, 5]
//  }]
//});


// Counter start

const counters = document.querySelectorAll(".counter");
counters.forEach((counter) => {
  counter.innerText = "0";
  const updateCounter = () => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;
    const increment = target / 200;
    if (count < target) {
      counter.innerText = `${Math.ceil(count + increment)}`;
      setTimeout(updateCounter, 1);
    } else counter.innerText = target;
  };

  updateCounter();
});

// Counter end


// Nav collapse

function js_navCollapse(elem) {
  $(elem).find("i.fa").toggleClass("fa-navicon fa-close")
  $('.sideBars').toggleClass("ShowSideBar");
}

// nav collapse end

function js_FilterCollapse(elem) {
  $(elem).parents('.card').find('.cardBodyCollape').slideToggle();
  $(elem).find('i.fa').toggleClass('fa-minus fa-plus');
}
function js_Tabs(elem) {
  var panel = $(elem).attr('data-target');
  $('.tabCard').addClass('d-none');
  $('#' + panel).removeClass('d-none');
  $('#' + panel).addClass('d-block');
  $('.tabUl .tabs-Link').removeClass('tabActive');
  $(elem).parents('.tabUl .tabs-Link').addClass('tabActive');
}

function js_Tabs1(elem) {
  var panel = $(elem).attr('data-target');
  $('.tabCard1').addClass('d-none');
  $('#' + panel).removeClass('d-none');
  $('#' + panel).addClass('d-block');
  $('.tabUl1 .tabs-Link').removeClass('tabActive');
  $(elem).parents('.tabUl1 .tabs-Link').addClass('tabActive');
}

function js_Tabs2(elem) {
  var panel = $(elem).attr('data-target');
  $('.tabCard2').addClass('d-none');
  $('#' + panel).removeClass('d-none');
  $('#' + panel).addClass('d-block');
  $('.tabUl2 .tabs-Link').removeClass('tabActive');
  $(elem).parents('.tabUl2 .tabs-Link').addClass('tabActive');
}


function js_navCollapse(elem) {
  $(elem).find("i.fa").toggleClass("fa-navicon fa-close")
  $('.sideBars').toggleClass("ShowSideBar");
}
function js_FilterCollapse(elem) {
  $(elem).parents('.card').find('.cardBodyCollape').slideToggle();
  $(elem).find('i.fa').toggleClass('fa-minus fa-plus');
}

function js_AddRemarks(elem) {
  $(elem).parents('tr').find('.RemarkForm').removeClass('d-none').addClass('d-block');
}
function js_RemoveRemarks(elem) {
  $(elem).parents('tr').find('.RemarkForm').removeClass('d-block').addClass('d-none');
  $(elem).parents('tr').find('.RemarkForm').find('textarea').val("");
}




  Fancybox.bind('[data-fancybox="gallery"]', {
    //
  });

