$(document).ready(function() {
	//show and hide company input field
	$('#residential').click(function() {
		$('#shipping-company').hide(1000);
	});

	$('#commercial').click(function() {
		$('#shipping-company').show(1000);
	});

	//Get city and state from zip with WSJ API
	var $state = $('#stateId');
	var $city = $('#city');
	var $zip = $('#zip');

	$zip.on('input', function() {
		var zipLength = this.selectionEnd;

		if (zipLength === 5) {
			$.ajax({
				type: 'GET',
				url: 'https://www.wsjwine.com/api/address/zipcode/' + $zip.val(),
				success: function(data) {
					$zip.on('input', function() {
						var dInput = this.value;
					});

					$zip.change(function() {
						$city.val('');

						$city.val($city.val() + data.response.city);
						$state.val(data.response.stateCode);
					});
				}
			});
		}
	});

	//GET red wine with promotion API
	var promotionTemplate = $('#promotionTemplate').html();

	$.ajax({
		type: 'GET',
		url: 'https://www.wsjwine.com/api/offer/9183007',
		success: function(data) {
			//create a new array with only the colourName Red
			var newArray = [];
			for (i = 0; i < data.response.mainItems.length; i++) {
				if (data.response.mainItems[i].product.colourName === 'Red') {
					newArray.push(data.response.mainItems[i]);
				}
			}
			var newObject = {};
			newObject.mainItems = newArray;

			var compiledPromotionTemplate = Handlebars.compile(promotionTemplate);

			$('.promotion-list-container').html(compiledPromotionTemplate(newObject));
		}
	});
});

// Initialize Firebase cloud database for form content
var config = {};
firebase.initializeApp(config);

//reference messages collection
var messagesRef = firebase.database().ref('messages');

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

// check to see if state is one of the 3 we don't ship to
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

//Array for form inputs
var newArray = [];

//submit click
document.getElementById('submit-form').onclick = function(e) {
	e.preventDefault();
	var submit = document.getElementById('submit-form');
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

	submit.style.display = 'none';
	loading.style.display = 'block';

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

	//show confirmation alert message on submit
	confirm.style.display = 'block';
	//hide form
	form.style.display = 'none';
	document.getElementById('screen').innerHTML = newArray.join('<br>');

	//save message call
	saveMessage(
		emailAddress,
		firstName,
		lastName,
		address1,
		address2,
		city,
		state,
		zip,
		phone,
		residential,
		commercial,
		company
	);
	//hide loading message
	loading.style.display = 'none';
};

//save message to firebase
function saveMessage(
	emailAddress,
	firstName,
	lastName,
	address1,
	address2,
	city,
	state,
	zip,
	phone,
	residential,
	commercial,
	company
) {
	var newMessageRef = messagesRef.push();
	newMessageRef.set({
		emailAddress: emailAddress,
		firstName: firstName,
		lastName: lastName,
		address1: address1,
		address2: address2,
		city: city,
		state: state,
		zip: zip,
		phone: phone,
		residential: residential,
		commercial: commercial,
		company: company
	});
}
