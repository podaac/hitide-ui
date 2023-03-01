define([

], function(){

    function dateToString(date){
        var year = date.getUTCFullYear();
        var month = date.getUTCMonth() + 1; if(month < 10) month = "0" + month;
        var day = date.getUTCDate(); if(day < 10) day = "0" + day;
        var hour = date.getUTCHours(); if(hour < 10) hour = "0" + hour;
        var minute = date.getUTCMinutes(); if(minute < 10) minute = "0" + minute;
        var second = date.getUTCSeconds(); if(second < 10) second = "0" + second;
        var milli = date.getUTCMilliseconds(); if(milli < 100) milli = "0" + milli;
                                            if(milli < 10) milli = "0" + milli;

        return "" + year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + ":" + milli + "Z";
    }

    function stringToDate(str){
        var date = new Date();
        date.setUTCFullYear(  Number(str.substr(0, 4))  );
        date.setUTCMonth(  Number(str.substr(5, 2)) - 1  );
        date.setUTCDate(  Number(str.substr(8, 2))  );
        date.setUTCHours(  Number(str.substr(11, 2))  );
        date.setUTCMinutes(  Number(str.substr(14, 2))  );
        date.setUTCSeconds(  Number(str.substr(17, 2))  );
        date.setUTCMilliseconds(  Number(str.substr(20, 3))  );
        return date;
    }


    return {
        dateToString: dateToString,
        stringToDate: stringToDate
    };

});