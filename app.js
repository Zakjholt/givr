// Adds cors-anywhere to fix "Access-Control-Allow-Origin error"
jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

var charityName;
$(document).ready(function() {
    $("form").submit(function(e) {
        e.preventDefault();

        var params = {
            user_key: "849e80f9644bfb1bba9075371ca52b17",
            zipCode: $("#postCode").val(),
            rows: 35
        };
        $(".resultSpace").empty();
        charitySearch(params);

        $('html, body').animate({
            scrollTop: $(".resultSpace").offset().top
        }, 1000);

    });
});

// Creates cards for each result and populates data
function makeCard(charityName, siteLink, category, acceptingDonations, donationLink) {
    var newCard = $(".template").clone().removeClass("template");
    newCard.find(".charityName").text(charityName);

    newCard.find(".siteLink").attr("href", siteLink);

    newCard.css('background-image', `url(./images/symbols/` + category + '.png)');

    newCard.data("filter", category);

    if (acceptingDonations === 1) {
      newCard.find(".donation-link").attr("href", donationLink);
    } else {
      newCard.find('.donation-link').text('Not Accepting').css('pointer-events', 'none');
    }

    $(".resultSpace").append(newCard);
}

// Finds the charities that match inputs
function charitySearch(params) {
    $.ajax({data: params, url: "http://data.orghunter.com/v1/charitysearch"}).done(function(data) {
        var results = data.data;
        console.log(results);

        // Iterates through results and sets variables based on data
        $.each(results, function(i) {

            var charityName = results[i].charityName;

            var siteLink = results[i].url;

// sets the category; pares down some of orghunters' bloat
            var category;

            switch (results[i].category.toLowerCase().split(' ')[0]) {
              case 'arts':
                category = 'arts';
                break;
              case 'educational':
                category = 'education';
                break;
              case 'environmental':
                category = 'environment';
                break;
              case 'animal':
                category = 'animal';
                break;
              case 'health':
              case 'mental':
              case 'diseases':
              case 'medical':
                category = 'medicine';
                break;
              case 'crime':
                category = 'law';
                break;
              case 'employment':
                category = 'employment';
                break;
              case 'food':
              case 'housing':
              case 'public':
              case 'human':
              case 'philanthropy':
              case 'community':
                category = 'humanitarian';
                break;
              case 'recreation':
              case 'youth':
                category = 'athletics';
                break;
              default:
                category = 'general';

            }

            var donationLink = results[i].donationUrl;

            var acceptingDonations = results[i].acceptingDonations;

            makeCard(charityName, siteLink, category, acceptingDonations, donationLink);
        });

    });
}
