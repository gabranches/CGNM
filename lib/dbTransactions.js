var Map = require('../models/model');

module.exports = function () {

    var me = {};

    me.getDate = function () {
        var date = new Date();
        var ms = date.getTime();
        return Math.floor((ms / (1000*60*60*24)));
    }

    me.insertMap = function (map) {
        var newMap = Map(map);

        newMap.save(function(err) {
            if (err) throw err;
        });

    }

    me.getMap = function (tag) {
        Map.find({tag: tag}, function (err, doc) {
            if (err) throw err;
            console.log(doc);
        });
    }

    me.validateVote = function (data, type) {
        return valid;
    }


    me.isInteger = function(num) {
        return num % 1 === 0;
    }


    me.getElement = function (arr, key, value) {
        return arr.filter(function (elem) {
           return elem[key] == value;
        })[0];
    }

    me.checkExist = function (arr, key, value) {
        return arr.filter(function (elem) {
           return elem[key] == value;
        });
    }


    return me;

};