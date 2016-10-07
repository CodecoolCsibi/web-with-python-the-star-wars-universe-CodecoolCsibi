$(document).ready(function () {
    currentPage = "http://swapi.co/api/planets/?page=1";
    var table = $('#planetTable');
    var fillPlanets = function (url) {
        console.log("filling with URL:", url);
        if (url == undefined) {
            url = currentPage;
        }
        $.getJSON(url, function (response) {
            var keyArray = ['name', 'diameter', 'climate', 'gravity', 'terrain','surface_water', 'population', 'residents']
            var tableBody = $('#planetBody');
            response["results"].forEach(function (planet, index, planets) {
                var planetRow = $('<tr>');
                keyArray.forEach(function (key, index, array) {
                    var tableCell = $('<td>');
                    if (key === 'diameter' && planet[key] !== 'unknown') {
                        tableCell.html(planet[key] + 'km');
                    }
                    else if (key == 'surface_water' && planet[key] !== "unknown") {
                        tableCell.html(planet[key] + '%');
                    }
                    else if (key === 'population' && planet[key] !== 'unknown') {
                        tableCell.html(planet[key] + ' people');
                    }
                    else if (key === 'residents') {
                        if (key !== 'unknown') {
                            if (planet[key].length === 0) {
                                  tableCell.html('No known residents')
                            } else {
                                var button = $('<div>');
                                button.addClass('btn btn-default');
                                button.html(planet[key].length + ' resident(s)');
                                button.click(function () {
                                //openModal(this)
                                });
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
    fillPlanets();
    $("#previous").click(function () {
        $.getJSON(currentPage, function (response) {
            var page = response;
            if (page["previous"] !== null) {
                $("#planetBody").empty();
                console.log("page elozo:", page["previous"]);
                currentPage = page["previous"];
                fillPlanets(currentPage);
                $("#pageNo").html("Page: " + currentPage[currentPage.length - 1])
            }
        })
    });
    $("#next").click(function () {
        $.getJSON(currentPage, function (response) {
            var page = response;
            if (page["next"] !== null) {
                $("#planetBody").empty();
                console.log("page kovetkezo:", page["previous"]);
                currentPage = page["next"];
                fillPlanets(currentPage);
                $("#pageNo").html("Page: " + currentPage[currentPage.length - 1])
            }
        })
    })
});