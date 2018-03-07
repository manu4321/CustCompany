/*
*	Author: Manuel Freites
*/

var db;
var index = 0;
var update = false;
var refreshed = true;
var indexArr = [];
var emailArr = [];
var compEmailsArr = [];
var initRows = true;
var showAllCompanies = false;


//email states
	var deleteemail = false;
	var editEmail = false;


//email states

/*
*
*	Main Page
*
*/
$(document).on('pagebeforeshow', '#mainPage', function () {
	try {     
		if (!window.openDatabase) {       
			alert("not supported"); 
		} else { 
			var shortName = "myCustdb3";
			var version = "1.0"; 
			var displayName = "My Customer Database";
			var maxSize = 65536; 
			db = openDatabase(shortName, version, displayName, maxSize);
			//Store geolocation in the database
			//Solution found on the internet, after researching that Google API has a limit on request.
			//And that is better to store this value than having to request everytime it is needed.
			//It will only be requested when a new row has been added and/or a row's address has been updated
			db.transaction( function (transaction) {
				transaction.executeSql( "CREATE TABLE IF NOT EXISTS Cust3 (compId INTEGER PRIMARY KEY, compName VARCHAR(20), compAddr VARCHAR(200), compCity VARCHAR(20), compCountry VARCHAR(20), comPost VARCHAR(7), compContact VARCHAR (20), compPhone VARCHAR(12), compEmail VARCHAR(20), geolocation VARCHAR (200))", [], trans_correct(null), trans_error);
				transaction.executeSql( "CREATE TABLE IF NOT EXISTS Email (emailId INTEGER PRIMARY KEY, emailTitle VARCHAR(15), emailMessage VARCHAR(200))", [], trans_correct(null), trans_error);
				} );
				initRows = true;
			selectRowEmail(null, initEmail);
		}      
	} catch(e) { alert("Error "+e+"."); }
});

function initEmail(transaction, results){
	var arr = results.rows;
	console.log(arr.length);
	if(arr.length === 0 ){
		addHardCodedEmail();
	}
	emailArr =[];
	for(var i =0;i <arr.length; i++){
		emailArr.push(results.rows.item(i));
	}
	if(initRows){
		selectRow(null, dataHandler);
		initRows = false;
	}
	
}
function addHardCodedEmail(){
	deleteRowEmail(null);
	insertRowEmail("Standard Message", "Hi, This is a standard message!");
	selectRowEmail(null, initEmail);
	
}
function dataHandler(transaction, results){
	var div = $("#list");
	div.empty();
	var arr = results.rows;
	if(arr.length === 0 && refreshed)
	{
		// for the sake of the assignment if there is no data
		// it will store and display 10 hard coded rows as instructed
		addTenRows();
		selectRow(null, dataHandler);
		
	}else{
		compEmailsArr = [];
		$("#rowCount").html ("Rows count:  " + arr.length + "<br />"); 
		for(var i = 0; i < arr.length; i++){
			var row = results.rows.item(i);
			addListItems(div, row.compId, row.compName);
			compEmailsArr[i] = row.compEmail; 
		}
	}
	$("#btnChange").hide();
	$("#btnErase").hide();
	indexArr = [];
	individualEmail = "";

	refreshed = false;
}

function addListItems(div, id, name){
	div.append("<li data-icon='false'>"
		+ "<form> <fieldset data-role='controlgroup' data-iconpost='right'>"
		+ "<input class='checkboxes"+id+"' type='checkbox' name='checkbox-"+id+"' id='"+id+"'>"
		+" <label for='"+id+"'><a href='' class='ui-btn ui-btn-icon-right ui-icon-carat-r' data-id='"+id+"'> "
		+  name + "</a></label></fieldset></form></li>");  
		
		$(".checkboxes"+id).change(checkBoxClicked);
}
		
function checkBoxClicked(){
    if(this.checked) {
        indexArr.push(this.id);
		
    }else{
		for(var i =0 ;i < indexArr.length; i++){
			if(indexArr[i] === this.id){
				indexArr.splice(i, 1);
			}
		}
	}
	
	if(indexArr.length === 1){
		$("#btnChange").show();
	}else{
		$("#btnChange").hide();
	}
	
	if(indexArr.length > 0){
		$("#btnErase").show();
	}else{
		$("#btnErase").hide();
	}

}

$(document).on('vclick', '#btnEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		fillEmailPopup("#emailEditor");
		
});
$(document).on('vclick', '#btnOpenEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		fillEmailPopup("#emailEditor2");
		
});
$(document).on('vclick', '#emailEditor #btnAddEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		editEmail  = false;
		$("#emailEditor #btnEditEmail").html("Edit");
		$( "#emailEditor #emails li a" ).css("background-color", "#29abe2");
		 $("#addEmailPopup #txtSubject").val("");
		 $("#addEmailPopup #txaBody").val("");
		 $("#addEmailPopup #hiddenID").val("");
		$("#addEmailPopup #btnSaveEmail").html("Save");
		$( "#emailEditor" ).popup("close");
		$( "#addEmailPopup" ).css("display", "block");

		 
		
});
$(document).on('vclick', '#emailEditor2 #btnAddEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		editEmail  = false;
		$("#emailEditor2 #btnEditEmail").html("Edit");
		$( "#emailEditor2 #emails li a" ).css("background-color", "#29abe2");
		$("#addEmailPopup2 #txtSubject").val("");
		$("#addEmailPopup2 #txaBody").val("");
		 $("#addEmailPopup2 #hiddenID").val("");
		 $("#addEmailPopup2 #btnSaveEmail").html("Save");


		$( "#emailEditor2" ).popup("close");
		$( "#addEmailPopup2" ).css("display", "block");

		 
		
});

$(document).on('vclick', '#emailEditor #btnDeleteEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		editEmail = false;
		$("#emailEditor #btnEditEmail").html("Edit");
		if(deleteemail){
			deleteemail = false;
			$( "#emailEditor #emails li a" ).css("background-color", "#29abe2");
			$("#emailEditor #btnDeleteEmail").html("Delete");
			$("#emailEditor #emailEditMsg").html("Select the email template you want to send everybody");
		}else{
			deleteemail = true;
			$( "#emailEditor #emails li a" ).css("background-color", "red");
			$(" #emailEditor #btnDeleteEmail").html("Cancel");
			$("#emailEditor #emailEditMsg").html("Select the email template you want to delete");
		}
		

		 
		
});

$(document).on('vclick', '#emailEditor2 #btnDeleteEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		deleteemail = false;
		$("#emailEditor2 #btnEditEmail").html("Edit");
		if(deleteemail){
			deleteemail = false;
			$( "#emailEditor2 #emails li a" ).css("background-color", "#29abe2");
			$("#emailEditor2 #btnDeleteEmail").html("Delete");
			$("#emailEditor2 #emailEditMsg").html("Select the email template you want to this email");
		}else{
			deleteemail = true;
			$( "#emailEditor2 #emails li a" ).css("background-color", "red");
			$("#emailEditor2 #btnDeleteEmail").html("Cancel");
			$("#emailEditor2 #emailEditMsg").html("Select the email template you want to delete");
		}
		

		 
		
});

$(document).on('vclick', '#emailEditor #btnEditEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		deleteemail = false;
		$("#emailEditor #btnDeleteEmail").html("Delete");
		if(editEmail){
			editEmail = false;
			$( "#emailEditor #emails li a" ).css("background-color", "#29abe2");
			$("#emailEditor #btnEditEmail").html("Edit");
			$("#emailEditor #emailEditMsg").html("Select the email template you want to send everybody");
		}else{
			editEmail = true;
			$( "#emailEditor #emails li a" ).css("background-color", "#008000");
			$(" #emailEditor #btnEditEmail").html("Cancel");
			$("#emailEditor #emailEditMsg").html("Select the email template you want to Edit");
		}
		

		 
		
});

$(document).on('vclick', '#emailEditor2 #btnEditEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		deleteemail = false;
		$("#emailEditor2 #btnDeleteEmail").html("Delete");
		if(editEmail){
			editEmail = false;
			$( "#emailEditor2 #emails li a" ).css("background-color", "#29abe2");
			$("#emailEditor2 #btnEditEmail").html("Edit");
			$("#emailEditor2 #emailEditMsg").html("Select the email template you want to this email");
		}else{
			editEmail = true;
			$( "#emailEditor2 #emails li a" ).css("background-color", "#008000");
			$("#emailEditor2 #btnEditEmail").html("Cancel");
			$("#emailEditor2 #emailEditMsg").html("Select the email template you want to Edit");
		}
		

		 
		
});

$(document).on('vclick', '#addEmailPopup #btnEmailCancel', function (e) {
		e.preventDefault();
		e.stopPropagation();
		$( "#addEmailPopup" ).css("display", "none");

		$( "#emailEditor" ).popup("open");

		 
		
});

$(document).on('vclick', '#addEmailPopup #btnSaveEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		var title = $("#addEmailPopup #txtSubject").val();
		var body = $("#addEmailPopup #txaBody").val();
		
		if(editEmail){
			var index = $("#addEmailPopup #hiddenID").val();
			updateRowEmail(index, title, body);
			toast("Email template updated");

		}else{
			insertRowEmail (title, body);
			toast("Email template added");

		}
		$( " #addEmailPopup" ).css("display", "none");
		selectRowEmail(null, initEmail);


});

$(document).on('vclick', '#addEmailPopup2 #btnEmailCancel', function (e) {
		e.preventDefault();
		e.stopPropagation();
		$( "#addEmailPopup2" ).css("display", "none");

		$( "#emailEditor2" ).popup("open");

		 
		
});

$(document).on('vclick', '#addEmailPopup2 #btnSaveEmail', function (e) {
		e.preventDefault();
		e.stopPropagation();
		var title = $("#addEmailPopup2 #txtSubject").val();
		var body = $("#addEmailPopup2 #txaBody").val();
		if(editEmail){
			var index = $("#addEmailPopup2 #hiddenID").val();
			updateRowEmail(index, title, body);
			toast("Email template updated");

		}else{
			insertRowEmail (title, body);
			toast("Email template added");

		}
		$( " #addEmailPopup2" ).css("display", "none");
		selectRowEmail(null, initEmail);


});


function fillEmailPopup(div){
		$(div+" #main #emails" ).empty();
		$(div+" #btnDeleteEmail").html("Delete");
		$(div+" #btnEditEmail").html("Edit");

		deleteemail = false;
		editEmail = false;
		$(div+" #emailEditMsg").html("Select the email template you want to send everybody");
		for( var i = 0; i < emailArr.length; i++){
			$( div+" #main #emails" ).append("<li >"
			+"<a href='' class='ui-btn ui-btn-icon-right ui-icon-carat-r' data-id='"+emailArr[i].emailId+"'>"
			+ emailArr[i].emailTitle
			+"</a></li>");
		}
		$( div ).popup( "open" ); 
}
$(document).on('vclick', '#emails li a', function (e) {
		e.preventDefault();
		e.stopPropagation();
		index = $(this).attr('data-id');
		
		if(deleteemail){
			if(index === "1"){
			
				toast("Can't delete the default message");
			}else{
				deleteRowEmail(index);
				toast("Email Template deleted");
				if(individualEmail === ""){
					$( "#emailEditor" ).popup("close");

				}else{
					$( "#emailEditor2" ).popup("close");
	
				}
				selectRowEmail(null, initEmail);
			}

		}else if(editEmail){
				var x = 0;
				for(var i = 0; i < emailArr.length; i++){
					if(index === (""+emailArr[i].emailId)){
						x = i;
						break;
					}
				}
				
				if(individualEmail === ""){
					$( "#emailEditor" ).popup("close");
					$( "#addEmailPopup" ).css("display", "block");
					$("#addEmailPopup #hiddenID").val(emailArr[x].emailId);
				$("#addEmailPopup #txtSubject").val(emailArr[x].emailTitle);
				$("#addEmailPopup #txaBody").val(emailArr[x].emailMessage);
					$("#addEmailPopup #btnSaveEmail").html("Update");

				}else{
					$( "#emailEditor2" ).popup("close");
					$( "#addEmailPopup2" ).css("display", "block");
					$("#addEmailPopup2 #hiddenID").val(emailArr[x].emailId);
				$("#addEmailPopup2 #txtSubject").val(emailArr[x].emailTitle);
				$("#addEmailPopup2 #txaBody").val(emailArr[x].emailMessage);
					$("#addEmailPopup2 #btnSaveEmail").html("Update");

				}
			
			
		}else{
			var mailTo = "mailto:";
			var x = 0;
			$("#btnSaveEmail").html("Save");

			console.log(individualEmail);
			if(individualEmail === ""){
				//get all users email
				for(var i = 0; i < compEmailsArr.length; i++){
					mailTo +=  compEmailsArr[i];
					if(compEmailsArr.length !== i){
						mailTo += ", ";
					}
				}
			}else{
				mailTo += individualEmail;
			
			}
			//get array index
			for(var i = 0; i < emailArr.length; i++){
				if(index === (""+emailArr[i].emailId)){
					x = i;
					break;
				}
			}
			var sendEmail = mailTo + "?subject=" + emailArr[x].emailTitle + "&body=" + emailArr[x].emailMessage;
			window.open(sendEmail,"_system");
		
		}
	


});

$(document).on('vclick', '#allMap', function (e) {
		e.preventDefault();
		e.stopPropagation();
		//will display all the companies location in the map
		showAllCompanies = true;
		$.mobile.changePage("#mapPage", {
			transition: "flip",
			changeHash: "false"
		});

});
$(document).on('vclick', '#customMap', function (e) {
		e.preventDefault();
		e.stopPropagation();
		//it will only show selected companies
		showAllCompanies = false;
		var activePage = $.mobile.activePage.attr("id");
		if(indexArr.length === 0 && activePage === "mainPage"){
			toast("Choose one or more Companies to display in the map");
		}else{
			$.mobile.changePage("#mapPage", {
				transition: "flip",
				changeHash: "false"
			});
		}
		

});

$(document).on('vclick', '#btnChange', function (e) {

		update = true;
		//if update is available it means that only one element is in the array
		index = indexArr[0];
		$.mobile.changePage("#addPage", {
			transition: "flip",
			changeHash: "false"
		});

});

$(document).on('vclick', '#btnErase', function (e) {
	for(var i = 0; i < indexArr.length; i++){
		deleteRow(indexArr[i], trans_correct(null));
	}
	selectRow(null, dataHandler);
	if(indexArr.length > 1){
		toast("Rows Deleted");
		
	}else{
		toast("Row Deleted");
	}

});


$(document).on('vclick', '#btnAdd', function (e) {
		update = false;
		$.mobile.changePage("#addPage", {
			transition: "flip",
			changeHash: "false"
		});

});
$(document).on('vclick', '#list li a', function (e) {
		index = $(this).attr('data-id');
		$.mobile.changePage("#info", {
			transition: "flip",
			changeHash: "false"
		});
});
/*
*
* Add 10 hard coded rows if the browser was refreshed
* and if there is no more rows
*/
function addTenRows(){
	var handler = trans_correct(null);
	deleteRow(null, handler);
	//Store all the addresses in this array to get their geolocation
	var tempAddr = getHardCodedAddresses();

	
	//Insert the hard coded rows with N0N geolocation then after update with the found geolocation
	insertRow('Comp Name', '2011 Grand Blvd', 'Oakville', 'Canada', 'M1M1M1', 'Comp Contact', '321-321-3333', 'mail@email.com', 'N0N', handler);
	insertRow('Sheridan College', '1430 Trafalgar Rd', 'Oakville', 'Canada', 'S1H3S3', 'John Johns', '289-333-1111', 'manu_4321@hotmail.com', 'N0N', handler);
	insertRow('School College', '1315 Chedboro Cres', 'Oakville', 'Canada', 'K0K1W2', 'Diana Schooly', '333-222-1111', 'mail@cheese.com', 'N0N', handler);
	insertRow('XYZ Corportation', '3319 Steeplechase Dr', 'Burlington', 'Canada', 'Q1M1Q1', 'Leon Tiger', '321-123-4444', 'mail@xyz.com', 'N0N', handler);
	insertRow('Ray Ray', '345 Lakeshore Rd E', 'Oakville', 'Canada', 'N0L9L4', 'Ray Fabian', '444-222-1111', 'mail@ray.com','N0N', handler);
	insertRow('Adrift & Co', '2556 Cavendish Dr', 'Burlington', 'Canada', 'N0N0N0', 'Wilson Ball', '000-000-0000', 'albert@lost.com', 'N0N', handler);
	insertRow('Esdrújula Words', '2378 Maryvale Crt', 'Burlington', 'Canada', 'E1D2D1', 'Person Esdru', '321-321-3333', 'esdru@jula.com','N0N ', handler);
	insertRow('Fake Company Name', '3297 Lakeshore Rd', 'Burlington', 'Canada', 'L0L0L0', 'Fake Man', '321-321-3333', 'company@fake.com','N0N', handler);
	insertRow('Lucky Lucky', '1245 Stephenson Dr 26', 'Burlington', 'Canada', 'M7M7M7', 'Lucky Man', '777-777-7777', 'luck@lucky.com','N0N', handler);
	insertRow('Last One', '103-3105 Dundas St W', 'Mississauga', 'Canada', 'Z9Z9Z9', 'Someone Else', '999-999-9999', 'one@last.com','N0N ', handler);
	
	//try to find geolocation of the 10 rows
	for(var i =0 ;i < 10; i++){
		setTimeout(findGeolocation(tempAddr[i],i + 1, geolocationFound), 2500);
	}
	
	toast("Ten Row has been added");
}

function getHardCodedAddresses(){
	var tempAddr = [
		'2011 Grand Blvd, Oakville, Canada', 
		'1430 Trafalgar Rd, Oakville, Canada', 
		'1315 Chedboro Cres, Oakville, Canada',
		'3319 Steeplechase Dr, Burlington, Canada',
		'345 Lakeshore Rd E, Oakville, Canada',
		'2556 Cavendish Dr, Burlington, Canada',
		'2378 Maryvale Crt, Burlington, Canada',
		'3297 Lakeshore Rd, Burlington, Canada',
		'1245 Stephenson Dr 26, Burlington, Canada',
		'103-3105 Dundas St W, Mississauga, Canada'
	];
	return tempAddr;
}
//Method that will be called to update a record with the geolocation found in findGeolocation
function geolocationFound(result, index){
	updateRowField(index, "geolocation", result);
}

/*
*	Add Page
*/
var recentOpen = true;

$(document).on('pagebeforeshow', '#addPage', function () {
	if(typeof db == 'undefined'){
		$.mobile.changePage("#mainPage", {
			transition: "flip",
			changeHash: "false"
		});
	}
	if(update){
		selectRow(index, editPageHandler);
	}else{
		$("#txtName").val("");
		$("#txtAddress").val("");
		$("#txtCity").val("");
		$("#txtCountry").val("");
		$("#txtPost").val("");
		$("#txtContact").val("");
		$("#txtPhone").val("");
		$("#txtEmail").val("");
		$("#txtGeolocation").val("");
		$("#txtFullAddr").val("");

	}
		
	
});

$(document).on('vclick', '#btnSave', function (e) {
	e.preventDefault();
	e.stopPropagation();
		var company = {
			name : $("#txtName").val(),
			address : $("#txtAddress").val(),
			city : $("#txtCity").val(),
			country : $("#txtCountry").val(),
			postalCode : ($("#txtPost").val()).toUpperCase(),
			contact : $("#txtContact").val(),
			phoneNumber : $("#txtPhone").val(),
			email : $("#txtEmail").val(),
			geolocation : $("#txtGeolocation").val(),
			fullAddr : $("#txtFullAddr").val(),
			message : ""
		};
	
		if(validate(company)){
			if(update){
				var addr = company.address + ", " + company.city + ", " + company.country;
				if(company.fullAddr === addr){
					updateRow(index, company.name, company.address, company.city,company.country, company.postalCode, company.contact, company.phoneNumber, company.email, company.geolocation, trans_correct(company.name + " has been updated"));
					$.mobile.changePage("#mainPage", {
						transition: "flip",
						changeHash: "false"
					});
				}else{
					findGeolocation(addr, company, updateEverything);
				}
			
			}else{
				var fullAddr = company.address + ", " + company.city + ", "+company.country;
				findGeolocation( fullAddr,company, insertNewRow);
			}
		
		}else{
			var errorMessage = "<h3>Errors:</h3><ul>"+company.message+"</ul>";
			recentOpen = true;
			errToast(errorMessage);
		}
		

});
// Function that will be called after getting the geolocation and that it insert the row.
function insertNewRow(geolocation, company){
	insertRow(company.name, company.address, company.city,company.country, company.postalCode, company.contact, company.phoneNumber, company.email, geolocation, trans_correct(company.name + " has been Added") );
	$.mobile.changePage("#mainPage", {
				transition: "flip",
				changeHash: "false"
			});
}
// Function that will called after getting the geolocation and will update the entire row including geolocation
function updateEverything(geolocation, company){
	updateRow(index, company.name, company.address, company.city,company.country, company.postalCode, company.contact, company.phoneNumber, company.email, geolocation, trans_correct(company.name + " has been updated"));
	$.mobile.changePage("#mainPage", {
						transition: "flip",
						changeHash: "false"
					});
}
$(document).click(function(){
	if($(".errorPopup").length > 0 && !recentOpen){
		$(".errorPopup").remove();
			
	}
	recentOpen = false;
});

/*
* Validator
*/
function validate(company){
	var valid = true;
	var emptyString = "";
	if(company.name === emptyString){
		company.message += "<li>Company Name can't be empty</li>";
		valid = false;
	}
	if(company.address === emptyString){
		company.message += "<li>Address can't be empty</li>";
		valid = false;
	}
	if(company.city === emptyString){
		company.message += "<li>City can't be empty</li>";
		valid = false;
	}
	if(company.country === emptyString){
		company.message += "<li>Country can't be empty</li>";
		valid = false;
	}
	if(!validPostalCode(company)){
		valid = false;
	}
	if(company.contact === emptyString){
		company.message += "<li>Contact can't be empty</li>";
		valid = false;
	}
	if(!validPhoneNumber(company)){
		valid = false;
	}
	if(!validEmail(company)){
		valid = false;
	}
	return valid;
}
function postKeyPress(e){
	var key = e.keyCode ? e.keyCode : e.which;
	var post = $("#txtPost").val();

	if(post.length % 2 === 0){	
		if (!((key >= 65 && key <= 90) || (key >= 97 && key <= 122))){
			return false;		
		}
	}else{
		if (key < 48 || key > 57){
			return false;
		}
	}

};


function numberKeyPress(e){
	var key = e.keyCode ? e.keyCode : e.which;
	var post = $("#txtPhone").val();
	if(post.length === 3 || post.length === 7){	
		post = post +  "-";
		$("#txtPhone").val(post);
		if(key < 48 || key > 57){
			return false;
		}
	}else{
		if (key < 48 || key > 57){
			return false;
		}
	}
};
//Canadian Postal Codes Format
function validPostalCode(company){

	var postalCode = company.postalCode;
	var message = "";
	var valid = true;
	if(postalCode === ""){
		company.message += "<li>Postal Code must not be empty </li>";
		valid =  false;
	}else if(postalCode.length < 6){
		company.message += "<li>Postal Code must be 6 characters long </li>";
		valid =  false;
	}else{
		if(postalCode.length === 7 && postalCode.indexOf(" ") !== -1){
			postalCode = (postalCode.substring(0,3) + postalCode.substring(4,7)).toUpperCase();
		}
		if(postalCode.length === 6){
			for (var i = 0; i < postalCode.length; i++){
				if(i % 2 === 1){
					//Odds equals number
					if(isNaN(postalCode.charAt(i))){
						valid = false;
						break;
					}
				}else{
					//Even means letters
					if( (postalCode.charAt(i) < 65) && (postalCode.charAt(i) > 90)){
						valid =  false;
						break;
					}
				}
			}
		
		}else{
			valid = false;
		}
		if(!valid){
			company.message += "<li>Postal Code is incorrect! Try L#L#L# </li>";
		}
	}
	return valid;

}

function validPhoneNumber(company){
	var phoneNumber = company.phoneNumber;
	var valid = true;
	if(phoneNumber === ""){
		company.message += "<li>Phone number must not be empty </li>";
		valid = false;
	}else{
		if(phoneNumber.length === 12){
			for(var i = 0; i < phoneNumber.length; i++){
				if(isNaN(phoneNumber.charAt(i))){
					if((i === 3 || i === 7) && phoneNumber.charAt(i) === "-"){
						continue;
					}else{
						company.message += "<li>Phone Number Must follow this format: ###-###-#### </li>";
						valid = false;
						break;
					}
				}else{
					if(i === 3 || i === 7){
						company.message += "<li>Phone Number Must follow this format: ###-###-#### </li>";
						valid = false;
						break;
					}
				}
			}
		}else{
			company.message += "<li>Phone Number Must follow this format: ###-###-#### </li>";
			valid = false;
		}
		
	}
	return valid;
}
function validEmail(company){
	var email = company.email
	if(email === ""){
		company.message += "<li>Email needs at least one character</li>";
		return false;
	}
	
	if(email.indexOf("@") === -1){
		company.message += "<li>Email Need to have at least one @ </li>";
		return false;
	}
	return true;
}
function editPageHandler(transition, results){
	var row = results.rows.item(0);
	$("#txtName").val(row.compName);
	$("#txtAddress").val(row.compAddr);
	$("#txtCity").val(row.compCity);
	$("#txtCountry").val(row.compCountry);
	$("#txtPost").val(row.comPost);
	$("#txtContact").val(row.compContact);
	$("#txtPhone").val(row.compPhone);
	$("#txtEmail").val(row.compEmail);
	$("#txtGeolocation").val(row.geolocation);
	$("#txtFullAddr").val(row.compAddr + ", " + row.compCity + ", " + row.compCountry);
}

/*
*
*	Info page
*/
$(document).on('pageshow', '#info', function () {
	if(typeof db == 'undefined'){
		$.mobile.changePage("#mainPage", {
			transition: "flip",
			changeHash: "false"
		});
	}else{
		$('#info #companyInfo').empty();
		selectRow(index, handlerInfo);
	}

});

var individualEmail = "";


function handlerInfo(transaction, results){
	
	var row = results.rows.item(0);
	var address = row.compAddr + ", " + row.compCity + ", " +row.compCountry;
	var content = row.compName + "<br>" + address;
	individualEmail = row.compEmail;
    $("#info #companyInfo").append("<h3>#" + row.compId+ "- "+ row.compName + "</h3>");
    $("#info #companyInfo").append("<p>Company Address: " + row.compAddr + "</p>");
    $("#info #companyInfo").append("<p>Company City: " + row.compCity + "</p>");
    $("#info #companyInfo").append("<p>Company Country: " + row.compCountry + "</p>");
    $("#info #companyInfo").append("<p>Company Post: " + row.comPost + "</p>");
    $("#info #companyInfo").append("<p>Company Contact: " + row.compContact + "</p>");
    $("#info #companyInfo").append("<p>Company Phone: " + row.compPhone + "</p>");
    $("#info #companyInfo").append("<p>Company email: " + row.compEmail + "</p>");
	//using the row geolocation make an individual map
	individualMap(row.geolocation, content);
    $('#info #companyInfo').trigger('create');
}


$(document).on('vclick', '#btnDelete', function (e) {
		deleteRow(index, trans_correct("Row has been deleted"));
		$.mobile.changePage("#mainPage", {
			transition: "flip",
			changeHash: "false"
		});

});

$(document).on('vclick', '#btnUpdate', function (e) {
		update = true;
		$.mobile.changePage("#addPage", {
			transition: "flip",
			changeHash: "false"
		});

});

/*
 *Map page
 */


 $(document).on('pageshow', '#mapPage', function (event, data) {

$('#chbLines').prop('checked', false).checkboxradio('refresh');
	if(typeof db == 'undefined'){
		$.mobile.changePage("#mainPage", {
			transition: "flip",
			changeHash: "false"
		});
	}else{
		if(showAllCompanies){
			selectRow(null, handlerMap);
		}else{
			var prevPage = data.prevPage.attr('id');

			if(prevPage !== "mainPage"){
				selectRow(index, handlerMap);
			}else{
				selectRowWithArray(indexArr, handlerMap);
			}
		}
	}

	$("#chbLines").change(function(){
		if(this.checked) {
			fillLines();
		}else{
			removeLines();
		}

	});
});

//HandlerMap which will run when the mapPage is opened and will get the geolocation, user geolocation and message and will create the complete Map
function handlerMap(transaction, results){

	var array = [];
	for(var i = 0; i <results.rows.length; i++){
		var address = results.rows.item(i).compAddr +", " + results.rows.item(i).compCity +", " + results.rows.item(i).compCountry;
		array.push({
			geolocation : results.rows.item(i).geolocation,
			message : results.rows.item(i).compName + "<br>" + address

		});

	}
	if(array.length > 0){
		if (navigator.geolocation) {
			//if there has been an error with getting geolocation it will still display map
			navigator.geolocation.getCurrentPosition(function(pos){
				completeMaps(pos, array);
			}, completeMaps(null, array));	
		
		}else{
			//if it doesn't support navigator then just send null to the 
			navigator.geolocation.getCurrentPosition(function(pos){
					completeMaps(null, array);
				}, trans_error);	
		}
	}else{
		$.mobile.changePage("#mainPage", {
			transition: "flip",
			changeHash: "false"
		});
		toast("No Records to show");
	}
}




/*
* Toast 
* Solution found in https://gist.github.com/kamranzafar/3136584
*/
var toast=function(msg){
	var t = $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
	.css({ display: "block", 
		opacity: 0.9, 
		position: "fixed",
		padding: "7px",   
		"text-align": "center",
		width: "270px",
		cursor: "pointer",
		left: ($(window).width() - 284)/2,
		top: $(window).height()/2 })
	.appendTo( $.mobile.pageContainer ).delay( 1500 )
	.fadeOut( 400, function(){
		$(this).remove();
	});
	t.click(function(){
		$(this).remove();
	});

}


var errToast=function(msg){
	var t = $("<div data-role='popup' class='errorPopup ui-loader ui-body-e ui-corner-all ui-popup'><h3>"+msg+"</h3></div>")
	.css({ display: "block", 
		color: "red",
		position: "fixed",
		background: "#FFF",
		padding: "7px",   
		"text-align": "left",
		width: "auto",
		border: "1px solid #000",
		cursor: "pointer",
		left: ($(window).width() - 284)/2,
		top: 0 })
	.appendTo( $.mobile.pageContainer ).delay( 1500 )
	t.click(function(){
		$(this).remove();
	});
}

/*
*	WebSQl related
*/

function selectRowEmail(compId, handler){
	if(compId === null){
		db.transaction( function (transaction) { transaction.executeSql( "SELECT * FROM Email", [], handler, trans_error); } );
	}else{
		db.transaction( function (transaction) { transaction.executeSql( "SELECT * FROM Email WHERE compId = ?", [compId], handler, trans_error); } );
	}
}
function insertRowEmail(emailSubject, emailBody){
	db.transaction( function (transaction) { transaction.executeSql( "INSERT INTO Email VALUES(null, ?, ?)", [emailSubject, emailBody]); } );

}



function selectRow(compId, handler){
	if(compId === null){
		db.transaction( function (transaction) { transaction.executeSql( "SELECT * FROM Cust3", [], handler, trans_error); } );
	}else{
		db.transaction( function (transaction) { transaction.executeSql( "SELECT * FROM Cust3 WHERE compId = ?", [compId], handler, trans_error); } );
	}
}

//Will select all the rows with the chosen ids that are stored in an array
function selectRowWithArray(idArray, handler){
	if(idArray === null){
		db.transaction( function (transaction) { transaction.executeSql( "SELECT * FROM Cust3", [], handler, trans_error); } );
	}else{
		var selector = "WHERE compId = ";
		for(var i=0; i < idArray.length; i++){
			if(i ===0){
				selector += idArray[i];
			}else{
				selector += " OR compId = " + idArray[i];
			}
		}
		db.transaction( function (transaction) { transaction.executeSql( "SELECT * FROM Cust3 " + selector, [], handler, trans_error); } );
	}
}

function updateRow(compId, compName, compAddr, compCity, compCountry, comPost, compContact, compPhone, compEmail, geolocation, handler){
	db.transaction( function (transaction) { transaction.executeSql( "UPDATE Cust3 set compName = ?, compAddr = ?, compCity = ?, compCountry = ?, comPost = ?, compContact = ?, compPhone = ?, compEmail = ?, geolocation = ? WHERE compId = ? ", [compName, compAddr, compCity, compCountry, comPost, compContact, compPhone, compEmail, geolocation, compId], handler, trans_error); } );

}

function updateRowEmail(emailId, title, body){
	db.transaction( function (transaction) { transaction.executeSql( "UPDATE email set emailTitle = ?, emailMessage = ? WHERE emailId = ? ", [title, body, emailId]); } );

}

//Will update only one field of a row.
function updateRowField(compId, field, value){
	db.transaction( function (transaction) { transaction.executeSql( "UPDATE Cust3 set "+field+ " = ? WHERE compId = ? ", [value, compId], trans_correct(""), trans_error); } );

}

function insertRow( compName, compAddr, compCity, compCountry, comPost, compContact, compPhone, compEmail, geolocation, handler){

	db.transaction( function (transaction) { transaction.executeSql( "INSERT INTO Cust3 VALUES(null, ?, ?, ?, ?,  ?,  ?,  ?, ?, ?)", [compName, compAddr, compCity, compCountry, comPost, compContact, compPhone, compEmail, geolocation], handler, trans_error); } );

}

function deleteRow(compId, handler){
	if(compId === null){
		db.transaction(function (transaction) { transaction.executeSql( "DELETE FROM Cust3", []); handler });
	}else{
		db.transaction(function (transaction) { transaction.executeSql( "DELETE FROM Cust3 where compId = ?", [compId]); handler });
	}
}
function deleteRowEmail(emailId){
	if(emailId === null){
		db.transaction(function (transaction) { transaction.executeSql( "DELETE FROM Email", []);  });
	}else{
		db.transaction(function (transaction) { transaction.executeSql( "DELETE FROM Email where emailId = ?", [emailId]);  });
	}
}
		
function trans_error(transaction, error) {
	console.log("Error : " + error.message + " in");
}
function trans_correct(msg){
	if(msg === null || msg === ""){
		console.log("Good");
	}else{
		toast(msg);
	}
}


