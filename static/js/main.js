$(document).ready(function () {
    // I know, it is not a good idea to have globals....
    currentPage = "http://swapi.co/api/planets/?page=1";
    var table = $('#planetTable');


    //Formatting the numbers longer than 4
    // (is not working, uncomment line 47 and 55 to see the magic,
    // I have no idea about what the problem can be...)
    var formatLongNumber =  function(number){
    if (number.length > 4) {
        number = number.toString();
        var count = 0;
        var formattedNumber = [];
        for (var i = number.length - 1; i > 0; i++) {
            formattedNumber.push(number.charAt(i));
            if (count % 3 == 0) {
                formattedNumber.push('.');
            }

        }
        formattedNumber = formattedNumber.join(',').replace(/,/g, '');
    } else{
        formattedNumber = number;
    }
    return formattedNumber
};


    // filling the Planets table
    var fillPlanets = function (url) {
        if (url == undefined) {
            url = currentPage;
        }
        $.getJSON(url, function (response) {
            // It is easier to iterate through only the necessary keys
            var keyArray = ['name', 'diameter', 'climate', 'gravity', 'terrain','surface_water', 'population', 'residents'];
            var tableBody = $('#planetBody');

            // Iterating through planets, making the row elements for Each
            response["results"].forEach(function (planet, index, planets) {
                var planetRow = $('<tr>');
                var number;
                // Iterating through the necessary keys, to set the proper values, making the <TD>-s in a row
                keyArray.forEach(function (key, index, array) {
                    var tableCell = $('<td>');
                    if (key === 'diameter' && planet[key] !== 'unknown') {
                        number = planet[key];
                        //number = formatLongNumber(number);
                        tableCell.html(number + 'km');
                    }
                    else if (key == 'surface_water' && planet[key] !== "unknown") {
                        tableCell.html(planet[key] + '%');
                    }
                    else if (key === 'population' && planet[key] !== 'unknown') {
                        number = planet[key];
                        //number = formatLongNumber(number);
                        tableCell.html(number + ' people');
                    }
                    else if (key === 'residents') {
                        if (key !== 'unknown') {
                            if (planet[key].length === 0) {
                                  tableCell.html('No known residents')
                            } else {
                                var button = $('<button>');
                                button.addClass('btn btn-default');
                                button.attr('type', 'button');
                                button.attr('data-toggle', 'modal');
                                button.attr('data-target', '#residentModal');
                                button.attr('data-residentSource', planet[key]);
                                button.attr('data-planetName', planet['name']);
                                button.html(planet[key].length + ' resident(s)');
                                tableCell.append(button)
                            }
                        }
                    }
                    else {
                        tableCell.html(planet[key]);
                    }
                    planetRow.append(tableCell);
                    tableBody.append(planetRow);
                    table.append(tableBody)
                })
            });
        });
    };

    // "Previous" button logic is here
    $("#previous").click(function () {
        $.getJSON(currentPage, function (response) {
            var page = response;
            if (page["previous"] !== null) {
                $("#planetBody").empty();
                currentPage = page["previous"];
                fillPlanets(currentPage);
                $("#pageNo").html("Page: " + currentPage[currentPage.length - 1])
            }
        })
    });

    // "Next" button logic is here
    $("#next").click(function () {
        $.getJSON(currentPage, function (response) {
            var page = response;
            if (page["next"] !== null) {
                $("#planetBody").empty();
                currentPage = page["next"];
                fillPlanets(currentPage);
                $("#pageNo").html("Page: " + currentPage[currentPage.length - 1])
            }
        })
    });

    // Modal logic, and modal table filling
    $('#residentModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var modal = $(this);
        var data = button.data();
        modal.find('.modal-title').text('Residents of ' + data.planetname);
        var residentRefs = data.residentsource.split(',');
        var attributeArray = ['name', 'height', 'mass', 'hair_color','eye_color', 'skin_color', 'birth_year', 'gender'];
        var residentTableBody = $('#residentTableBody');
        residentTableBody.empty();

        $.each(residentRefs, function(index, personUrl){
            $.getJSON(personUrl, function(result){
                var residentRow = $('<tr>');
                $.each(attributeArray, function (index, attribute) {
                    var content;
                    if (attribute == 'height' && result[attribute] !== 'unknown') {
                        content = result[attribute] / 100 + 'm';
                    }
                    else if (attribute == 'mass' && result[attribute] !== 'unknown') {
                        content = result[attribute] + 'kg';
                    } else {
                        content = result[attribute]
                    }
                    var attributeCell = $('<td>');
                    attributeCell.html(content);
                    residentRow.append(attributeCell);
                    residentTableBody.append(residentRow);
                    });
                });
            });
        modal.find('.modal-body input').val()
});
    // Main logic starts here
    fillPlanets();
});


