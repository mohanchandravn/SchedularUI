define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton'],
function(oj, ko, $)
{ 

function buttonModel(){
    var self = this;
    router = oj.Router.rootInstance;
    self.quotes = {
        "myEmp": "my employee",
        "dept": "departments"
    };
    self.quote = ko.observable();
     this.drinkRadios = [
        {id: 'myEmp', label: 'MY EMPLOYEE DETAILS'},
        {id: 'dept',    label: 'DEPARTMENTS'},
        {id: 'empCount',    label: 'EMPLOYEE COUNT'},
    ];
    self.drink = ko.observable("myEmp");
    self.buttonClick = function(data, event){
                    console.log("mysel"+self.drink());
       if((self.drink()) === ('myEmp')) {
           //$('empButton').html('style','backgrounf-color:#FFFFFF');
//           document.getElementById("myEmp").style.backgroundColor = "blue";
//           document.getElementById("dept").style.backgroundColor = "white";
           router.go('manageUser');
           
       } else if((self.drink()) === ('dept')) {
//           document.getElementById("dept").style.backgroundColor = "blue";
//           document.getElementById("myEmp").style.backgroundColor = "white";
          router.go('deptPieChart');
       }else if((self.drink()) === ('empCount')) {
//           document.getElementById("dept").style.backgroundColor = "blue";
//           document.getElementById("myEmp").style.backgroundColor = "white";
          router.go('employeeCount');
       }
        self.quote(self.quotes[event.currentTarget.id]);
        return true;
    };
    self.buttonClick1 = function (){
        document.getElementById('drinkset').style.visibility = "hidden";
        document.getElementById('button').style.visibility = "hidden";
        router.go('login');
    }
    // When the country flags are clicked we get a new language to set as the current locale
self.setLang = function( event, ui ) {
       var lang = ui.item.children("a").text();
       //alert(lang);
  var newLang = '';
  
  switch (lang){
    case '?eština':
      newLang = 'cs-CZ';
      break;
    case 'français':
      newLang = 'fr-FR';
      break;
    default:
      newLang = 'en-US';
  }
  if (newLang !== 'fr-FR') {
    if (($('#html').lang) !== 'fr-FR' || ($('#html').lang) === '') {
      oj.Config.setLocale(newLang,
        function() {
            console.log('inside setlocale function'+newLang);
          $('#html').attr('lang', newLang);
          // In this callback function we can update whatever is needed with the 
          // new locale. In this example, we reload the menu items.
          loadMenu();
        }
      );
    }
    else {
      window.location.assign('../index.html');
    }
  }
  else {
    window.location.assign('fr/index.html');
  }
}
self.localeLabel = ko.observable('English');
function loadMenu() {
    console.log('Current locale - ' + oj.Config.getLocale());
    self.localeLabel(oj.Translations.getTranslatedString("login.heading"));
    self.testField(oj.Translations.getTranslatedString("login.heading"));
    $('#username').attr('placeholder',oj.Translations.getTranslatedString("login.userName"));
    $('#password').attr('placeholder',oj.Translations.getTranslatedString("login.password"));
    $('#login').html(oj.Translations.getTranslatedString("login.buttonText"));
    $('#label').html(oj.Translations.getTranslatedString("login.language"));
    // $('#submit').html(oj.Translations.getTranslatedString("login.buttonText"));
    $("#submit").prop('value', oj.Translations.getTranslatedString("login.buttonText"));
}
self.testField = ko.observable('test123');
}
return new buttonModel();

});
