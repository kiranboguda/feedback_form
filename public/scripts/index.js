// index.js

var REST_DATA = '/api/savefeedBack';
var KEY_ENTER = 13;
var defaultItems = [

];


function saveFeedbackForm() {
	
	
    var feedBackVal = jQuery("#feedbackVal").val();
    var firstNameVal = jQuery("#firstname").val();
    var lastNameVal = jQuery("#lastname").val();
    var emailVal = jQuery("#emailAddress").val();
    
    var counter = 0;

    jQuery(".validData").each(function(index) {
        if (jQuery(this).val() == "") {
            counter++;
        }

    });
    jQuery("#registration").find("label").removeClass("ibm-required");
    jQuery("#registration").find("textarea").removeClass("errfeedbackVal");
    if (emailVal == "") {
        jQuery(".errEmailName").addClass("ibm-required");
    } else {
        if (IsEmail(emailVal) == false) {
            counter++;
            jQuery(".errEmailName").addClass("ibm-required");
        } else {

            jQuery(".errEmailName").removeClass("ibm-required");
        }
    }

    if (counter == 0) {
    	//alert("Calling save Feedback");
        console.log("Calling save interconnectexp");
        saveInterconFeedback();


    } else {
    	if (feedBackVal == "") {
            jQuery("#feedbackVal").addClass("errfeedbackVal");
        } else {

            jQuery("#feedbackVal").removeClass("errfeedbackVal");
        }

        if (firstNameVal == "") {
            jQuery(".errFirstName").addClass("ibm-required");
        } else {

            jQuery(".errFirstName").removeClass("ibm-required");
        }
        if (lastNameVal == "") {

            jQuery(".errLastName").addClass("ibm-required");
        } else {
            jQuery(".errLastName").removeClass("ibm-required");
        }
        
        return false;

    }
    document.getElementById("registrationForm").reset();

}

function IsEmail(emailVal) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(emailVal)) {
        return false;
    } else {
        return true;
    }
}

function saveInterconFeedback() {
	
	//alert("Insdie saveInterconFeedback "+ document.getElementById('feedbackVal').value)

    var data = {
    	feedback: document.getElementById("feedbackVal").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        email: document.getElementById("emailAddress").value
      

    };
    
   // alert(data);

    xhrPut(REST_DATA, data, function() {
        IBMCore.common.widget.overlay.show('overlayExampleMed');
    }, function(err) {
        console.log(err);

    });
}
jQuery( "document" ).ready(function() {
	jQuery("#feedbackVal").val("");
	jQuery( "#feedbackVal" ).focus();
    
});