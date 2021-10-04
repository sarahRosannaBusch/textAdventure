"use strict";
/**
 * @file       f.js
 * @brief      fundamental web dev toolkit
 * @author     Sarah Rosanna Busch
 * @version    0.2
 * @date       12 April 2020
 * */

var f = (function(){
    var that = {};

    that.html = (function(){
        var html = {};

        html.getElem = function(query, parent){
            if(!parent) {
                parent = document;
            }
            return parent.querySelector(query);
        }

        html.getElems = function(query, parent){
            if(!parent) {
                parent = document;
            }
            return parent.querySelectorAll(query);
        }

        html.spawn = function(parentElem, childType, id) {
            var child = document.createElement(childType);
            if(id !== undefined) {
                child.id = id;
            }
            parentElem.appendChild(child);
            return child;
        }

        html.empty = function(elem) {
            if(elem.hasChildNodes) {
                var numChildren = elem.childNodes.length;
                for(var i = numChildren - 1; i >= 0; i--) {
                    elem.removeChild(elem.childNodes[i]);
                }
            }
        }

        return html;
    }());

    that.http = (function(){
        var http = {};

        http.get = function(file, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(this.readyState === 4) { //request finished and response is ready
                    if(this.status === 200) { //ok
                        callback(this.responseText);
                    }
                }
            };
            xhr.open("GET", file, true);
            xhr.send();
        }

        http.post = function(file, data, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", file, true);
            xhr.onreadystatechange = function() {
                if(this.readyState === 4) { //request finished and response is ready
                    if(this.status === 200) { //ok
                        callback(this.responseText);
                    }
                }
            };
            xhr.setRequestHeader("Content-type", "text/plain");
            xhr.send(data);
        }

        return http;
    }());

    that.js = (function() {
        var js = {};

        js.copyObj = function(obj) {
            return JSON.parse(JSON.stringify(obj));
        }

        return js;
    }());

    that.time = (function() {
        var time = {};

        time.getMonthNameByIdx = function(monthIdx) {
            var m = '';
            switch(monthIdx) {
                case 0: m = 'January'; break; //31
                case 1: m = 'February'; break; //28/29
                case 2: m = 'March'; break; //31
                case 3: m = 'April'; break;
                case 4: m = 'May'; break; //31
                case 5: m = 'June'; break;
                case 6: m = 'July'; break; //31
                case 7: m = 'August'; break; //31
                case 8: m = 'September'; break;
                case 9: m = 'October'; break; //31
                case 10: m = 'November'; break;
                case 11: m = 'December'; break; //31
            }
            return m;
        }

        time.getFirstDayOfTheMonthIdx = function(year, month) {
            var d = new Date(year, month, 1);
            return d.getDay(); //Sunday = 0
        }

        time.getNumDaysInMonth = function(year, month) {
            var n = 0;
            switch(month) {
                case 0: case 2: case 4: case 6: case 7: case 9: case 11:
                    n = 31;
                    break;
                case 3: case 5: case 8: case 10:
                    n = 30;
                    break;
                case 1:
                    const notLeapYear = 28;
                    const leapYear = 29;
                    n = (year % 4 === 0) ? leapYear : notLeapYear;
                    if(year % 100 === 0) {
                        if(year % 400 === 0) {
                            n = leapYear;
                        } else {
                            n = notLeapYear;
                        }
                    }
                    break;
                default: break;
            }
            return n;
        }

        time.getDateString = function(year, month, date) {
            let ret = year + '-' + _formatNum(month+1) + '-' + _formatNum(date);
            return ret;

            function _formatNum(num) {
                var n = JSON.stringify(num);
                if(n.length === 1) {
                    n = "0" + n;
                }
                return n;
            }
        }
        
        // @return index of weekend (sunday = 0)
        // @param date <str> 'YYYY-MM-DD'
        time.getWeekDayIdx = function (date) {
            let d = date.split('-');
            var dateObj = new Date(d[0], d[1]-1, d[2]);
            if(dateObj) {
                return dateObj.getDay();
            } else {
                console.log(date + ' is not a valid date string');
            }
        }

        // @return true if date is on or between range date range
        // @param date <str> 'YYYY-MM-DD'
        // @param range <array> ['YYYY-MM-DD', 'YYYY-MM-DD']
        time.dateIsInRange = function(date, range) {
            var ret = false;
            var date = _convertStrsToInts(date.split('-'));
            var start = _convertStrsToInts(range[0].split('-'));
            var end = _convertStrsToInts(range[1].split('-'));
            
            var y = 0;
            var m = 1;
            var d = 2;

            // year test
            if(start[y] === 0 || end[y] === 0 ||
            (date[y] >= start[y] && date[y] <= end[y])) {
                ret = true;
            }

            // month test
            if(ret) {
                if(start[m] === 0 || end[m] === 0) {
                    ret = true;
                } else if(start[y] === end[y]) {
                    if(start[y] === 0 && end[y] === 0 && start[m] > end[m]) {
                        if((date[m] >= start[m]) || (date[m] <= end[m])) {
                            ret = true;
                        } else {
                            ret =false;
                        }
                    } else if(date[m] >= start[m] && date[m] <= end[m]) {
                        ret = true;
                    } else {
                        ret = false;
                    }
                } else if(start[y] < end[y]) {
                    if(date[y] === start[y] && date[m] >= start[m]) {
                        ret = true;
                    } else if(date[y] === end[y] && date[m] <= end[m]) {
                        ret = true;
                    } else {
                        ret = false;
                    }
                } else {
                    ret = false;
                }
            }

            // day test
            if(ret) {
                if(start[d] === 0 || end[d] === 0) {
                    ret = true;
                } else if(start[m] === end[m]) {
                    if(start[m] === 0 && end[m] === 0 && start[d] > end[d]) {
                        if((date[d] >= start[d]) || (date[d] <= end[d])) {
                            ret = true;
                        } else {
                            ret =false;
                        }
                    }else if(date[d] >= start[d] && date[d] <= end[d]) {
                        ret = true;
                    } else {
                        ret = false;
                    }
                } else if(start[m] !== end[m]) {
                    if(start[y] < end[y] || start[y] === 0 || end[y] === 0) {
                        if(date[m] === start[m] && date[d] >= start[d]) {
                            ret = true;
                        } else if(date[m] === end[m] && date[d] <= end[d]) {
                            ret = true;
                        } else if(date[m] > start[m] || date[m] < end[m]) {
                            ret = true;
                        } else {
                            ret = false;
                        }
                    } else if(start[y] === end[y]) {
                        if(date[m] > start[m] && date[m] < end[m]) {
                            ret = true;
                        } else if((start[m] === date[m] && date[d] >= start[d]) ||
                        (end[m] === date[m] && date[d] <= end[d])) {
                                ret = true;
                        } else {
                            ret = false;
                        }
                    } else {
                        ret = false;
                    }
                } else {
                    ret = false;
                }
            }            

            function _convertStrsToInts(str) {
                var ints = [];
                var l = str.length;
                for(var i = 0; i < l; i++) {
                    ints.push(parseInt(str[i]));
                }
                return ints;
            }

            return ret;
        }

        return time;
    }());

    return that;
}());