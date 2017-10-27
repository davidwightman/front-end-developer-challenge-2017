$(document).ready(function() {
	//show and hide company input field
	$('#residential').click(function() {
		$('#shipping-company').hide(1000);
	});

	$('#commercial').click(function() {
		$('#shipping-company').show(1000);
	});

	var $state = $('#stateId');
	var $city = $('#city');
	var $zip = $('#zip');

	$zip.on('input', function() {
		//console.log(dInput);
		var zipLength = this.selectionEnd;
		console.log(zipLength);
		//$(".dDimension:contains('" + dInput + "')").css("display","block");

		if (zipLength === 5) {
			$.ajax({
				type: 'GET',
				url: 'https://www.wsjwine.com/api/address/zipcode/' + $zip.val(),
				success: function(data) {
					console.log('sucess', data);
					//if ($zip.val().toString.length >= 5)

					$zip.on('input', function() {
						var dInput = this.value;
						console.log(dInput);

						//$(".dDimension:contains('" + dInput + "')").css("display","block");
					});

					$zip.change(function() {
						$city.val('');

						$city.val($city.val() + data.response.city);
						$state.val(data.response.stateCode);
					});
					//$city.val.append('hello');

					// $.each(zips, function(i, zip) {
					// 	$zips.append('<div> +zip.response.zipCode');
					// });
				}
			});
		}
	});
	//https://www.wsjwine.com/api/address/zipcode/11201

	// $('.application-form').submit(function(e)
	//     {
	//         e.preventDefault();
	//         $.cookie('agreed_to_terms', '1', { path: '/', expires: 999999 });
	//     });

	// //on submit
	//   $('#submit-form').click(function(e) {

	//        var email = $('#email-address').val();
	//        var emailConfirm = $('#email-address-confirm').val();
	//        var state = $( "#stateId option:selected" ).val();
	//        var phoneNumber = $('#phone').val();

	//        //check to make sure email is there
	//        if ($.trim(email).length == 0) {
	//        	e.preventDefault();
	//            alert('Please enter an email address');
	//            throw (new Error('Not an email address'));
	//        }

	//    });
});

//phone validation regex
function validatePhone(phoneNumber) {
	var regExpPhone = /^\d{10}$/;
	if (regExpPhone.test(phoneNumber)) {
		return true;
	} else {
		return false;
	}
}

//email validation regex
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (re.test(email)) {
		return true;
	} else {
		return false;
	}
}

////
// If State value is equal to NY, CA, or MA - show a message on submit saying that we are unable to ship wine to those states and hide submit button. If different state is chosen, onblur - check against eligible states and if can ship to then re-enable submit button.
//show submit button after user reselects a state. Hides Alert.
function doWeShip(value) {
	var submitForm = document.getElementById('submit-form');
	var stateAlert = document.getElementById('stateAlert');
	if (value !== 'NY' || value !== 'CA' || value !== 'MA') {
		submitForm.style.display = 'block';
		stateAlert.style.display = 'none';
	}
}

//prevents users from pasting in email confirmation
window.onload = function() {
	var myInput = document.getElementById('email-address-confirm');
	myInput.onpaste = function(e) {
		e.preventDefault();
	};
};

//Get all values from form inputs and store in an array. Hide completed form and use values in array and format as (below) on the page in place of the form.
var newArray = [];

document.getElementById('submit-form').onclick = function(e) {
	e.preventDefault();

	var confirm = document.getElementById('confirm');
	var form = document.getElementById('formId');
	var emailAddress = document.getElementById('email-address').value;
	var emailConfirm = document.getElementById('email-address-confirm').value;
	var firstName = document.getElementById('first-name').value;
	var lastName = document.getElementById('last-name').value;
	var address1 = document.getElementById('address-1').value;
	var address2 = document.getElementById('address-2').value;
	var city = document.getElementById('city').value;
	var state = document.getElementById('stateId').value;
	var zip = document.getElementById('zip').value;
	var phone = document.getElementById('phone').value;
	var residential = document.getElementById('residential').value;
	var commercial = document.getElementById('commercial').value;
	var company = document.getElementById('company').value;

	//validate email
	if (!validateEmail(emailAddress)) {
		e.preventDefault();
		alert('Invalid Email Address');
		console.log('User entered in ' + emailAddress + '.');
		throw new Error('Invalid email address.');
	}

	//email and confirm email match
	if (emailAddress !== emailConfirm) {
		//$("#email-address-confirm").alert("these do not match")
		e.preventDefault();
		alert('Emails do not match');
		console.log(emailAddress + ' is different from ' + emailConfirm + '.');
		throw new Error('Email addresses do not match');
	}
	//$.cookie('agreed_to_terms', '1', { path: '/', expires: 999999 });

	//throws alert and hides submit for states we don't ship to
	if (state === 'NY' || state === 'CA' || state === 'MA') {
		e.preventDefault();
		document.getElementById('stateAlert').style.display = 'block';
		document.getElementById('submit-form').style.display = 'none';
		throw new Error('We do not deliver to California, New York, or Massachusetts.');
	}

	//validate phone
	if (!validatePhone(phone)) {
		e.preventDefault();
		alert('Not a valid US number. Please enter a valid US number and try again.');
		console.log('User entered in ' + phone + '.');
		throw new Error('Invalid US phone number.');
	}

	console.log(
		'email: ' +
			emailAddress +
			'\n' +
			'first name: ' +
			firstName +
			'\n' +
			'last name: ' +
			lastName +
			'\n' +
			'address1: ' +
			address1 +
			'\n' +
			'address2: ' +
			address2 +
			'\n' +
			'city: ' +
			city +
			'\n' +
			'state: ' +
			state +
			'\n' +
			'zip: ' +
			zip +
			'\n' +
			'phone: ' +
			phone +
			'\n' +
			'residential: ' +
			residential +
			'\n' +
			'commercial: ' +
			commercial +
			'\n' +
			'company: ' +
			company +
			'\n'
	);

	newArray.push(emailAddress);
	newArray.push(firstName);
	newArray.push(lastName);
	newArray.push(address1);
	newArray.push(address2);
	newArray.push(city);
	newArray.push(state);
	newArray.push(zip);
	newArray.push(phone);
	newArray.push(residential);
	newArray.push(commercial);
	newArray.push(company);

	//document.cookie = "email=email"
	//alert(document.cookie);

	confirm.style.display = 'block';
	form.style.display = 'none';

	document.getElementById('screen').innerHTML = newArray.join('<br>');
};

////GEOLOCATION!!!!!!
// var options = {
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0
// };

// function success(pos) {
//   var crd = pos.coords;

//   console.log('Your current position is:');
//   console.log(`Latitude : ${crd.latitude}`);
//   console.log(`Longitude: ${crd.longitude}`);
//   //console.log(`state: ${crd.address_components[2].short_name}`);
//   console.log(`More or less ${crd.accuracy} meters.`);
// };

// function error(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// };

// navigator.geolocation.getCurrentPosition(success, error, options);
////
