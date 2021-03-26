$(function () {
	function petFilter() {
		//shows only the selected kind of pets (cat, dog, bird, or other) - sorted by attribute "kind"
		var selectedPet = $("#selectPet option:checked").val().toLowerCase();
		var allPets = $("main .row").children(); //array of all pets on the page
		if (selectedPet === "any pet") {
			Array.from(allPets).forEach((pet) => {
				$(pet).show(); //display all pets if "any pet" selected
			});
			moveEverySecondPetToTheRight(allPets); //fix styles for all pets
			return;
		}
		var visiblePets = [];
		for (var i = 0; i < allPets.length; i++) {
			$(allPets[i]).show();

			if ($(allPets[i]).attr("kind") !== selectedPet) {
				$(allPets[i]).hide(); //hide all non-selected pets
			} else {
				visiblePets.push($(allPets[i])); //put all selected pets to the new array for styles' fixing
			}
		}
		moveEverySecondPetToTheRight(visiblePets); //fix styles for selected pets
	}

	function moveEverySecondPetToTheRight(petArray) {
		//gives right classes to every second pet in a list
		Array.from(petArray).forEach((pet, index) => {
			if (index % 2 !== 0) {
				$(pet).addClass("offset-md-4 flex-row-reverse");
				$(pet).attr("odd", true); //1,3,5 etc pets are moved to the right
			} else {
				$(pet).removeClass("offset-md-4 flex-row-reverse");
				$(pet).attr("odd", false); //0,2,4 etc pets are moved to the left
			}
		});
	}

	function petDisplay(petArray) {
		//displays pets on screen

		petArray.forEach((pet) => {
			var kind = pet.type.toLowerCase(); //the attribute for sorting pets
			if (kind !== "dog" && kind !== "cat" && kind !== "bird")
				kind = "other";

			$("main .row") //appending pets to the div.row
				.append(`<div class="col-md-8 pet_info my-2" kind="${kind}">
		<img class="thumb" src="${pet.primary_photo_cropped.small}" alt="${pet.type} picture" />
		<div>
			<h2 class="headline">${pet.name}</h2>
			<p>
				${pet.description}
			</p>
			<a href="#" class="info_link">Learn more &raquo;</a>
			<div class="additional_info"> 
			<table>
			<tr><td><span class="bold">Gender:</span> ${pet.gender}</td><td><span class="bold">Colors:</span> ${pet.colors.primary}</td></tr>
			<tr><td><span class="bold">Age:</span> ${pet.age}</td><td><span class="bold">Size:</span> ${pet.size}</td></tr>
			<tr><td><span class="bold">Breed:</span> ${pet.breeds.primary}</td><td><span class="bold">Status:</span> ${pet.status}</td></tr>
				</table>
			
			<a class ="btn" href="${pet.url}" target="_blank">Learn more on Petfinder</a>		
				</div>`);
		});
		moveEverySecondPetToTheRight($("main .row").children()); //giving appropriate classes to every second pet in the list
	}

	$("#donate").click(function () {
		$(this).hide(); //hiding Donate button after clicking on it
	});

	$("#selectPet").change(petFilter); //if selected pet changes, petFilter function is invoked

	$("#dialog") //dialog window which is hidden because it's annoying
		.dialog({
			resizable: false,
			dialogClass: "no-close",
			modal: true,
			minWidth: "400",
			autoOpen: false,
			position: { my: "center top", at: "center top", of: window },
			buttons: [
				{
					text: "Ok",
					click: function () {
						$(this).dialog("close");
					},
				},
			],
			create: function (e, ui) {
				$(".no-close button:last").addClass(
					"ui-button ui-corner-all ui-widget"
				);
			},
		})
		.html(`<p>Please don't go, these pets need you!</p>`);
	// $(document).on("mouseleave", function () {
	// 	$("#dialog").dialog("open");
	// });   //dialog is hidden

	$(".row").on("click", ".info_link", function (e) {
		e.preventDefault();
		$(this).next().slideToggle(800); //toggling additional info about pets under "Learn more" link
	});

	//I am using a JS wrapper for the Petfinder API for easier data fetching
	//Here is a link to it: https://github.com/petfinder-com/petfinder-js-sdk

	var pf = new petfinder.Client({
		apiKey: "Zi6ThAR3tXd4W42qzG2sIy3ShpFZfhKN4MZcDhF09lAW6VTXGg",
		secret: "P0Qv4Q4qgibhmA7Ls2M7rc83PrvwKN8cvrJOqcMg",
	});

	async function getLongArrayWithPictures() {
		var longPetArrayWithPictures = [];
		do {
			response = await pf.animal.search({ sort: "random" }); //fetch 20 random animals from Petfinder
			var petsWithPictures = response.data.animals.filter(
				(pet) => pet.primary_photo_cropped && pet.description
			); //only choose those animals who have a picture and a description (to make the page look nice with all the pictures and text in place)
			longPetArrayWithPictures = longPetArrayWithPictures.concat(
				petsWithPictures //add those animals to an array
			);
		} while (longPetArrayWithPictures.length < 50); //keep fetching until at least 50 animals with pictures are in a ready array
		petDisplay(longPetArrayWithPictures); //display those animals
	}

	getLongArrayWithPictures();
});
