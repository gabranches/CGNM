
function updateHeroes (heroes) {

    var totalHeroes = heroes.length;

    for (var i=0; i < totalHeroes; i++) {
        Heroes.findOne({id: i}, function (err, doc) {
            doc.friends = [];
            // Save changes
            doc.save(function(err) {
                if (err) console.log(err);
            });
        });
    }
}

updateHeroes(heroes);
