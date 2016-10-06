
var log = console.log;//To ease change from rhino and browser.

function quote(){

    //Private
    _ApiSrc = "";
    _quote = "";
    _quoteAuthor="";
    
    //Methods

    GetQuote = function (){
        if ($("#quoteContent").html().length > 0)
            fadeOutQuote();
        else
            FetchQuote();

    }

    FetchQuote = function(){
        $.ajax({
            url:GetApi(),
            accept:"application/json" ,
            type:"POST",
            dataType:"json",
            headers:{
                "X-Mashape-Key":"uwILuQ83rumsh8bkj6O4u1ZCjAVbp1vuAGOjsnl2atgDed9iZb",
                "Content-Type":"application/x-www-form-urlencoded",

            },

            success:(function(data){
                _quote = data.quote;
                _quoteAuthor = data.author;

                $("#tweetThis").attr("href","https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="+_quote+" ---"+_quoteAuthor);
            }),
            complete:(function(){
                fadeInQuote();
                $("#quoteAuthor").html("--- "+_quoteAuthor);
            })
            
        });
    }
    
    SetApi = function(src){
        /* Set the Api source */
        _ApiSrc = src
    }

    GetApi = function(){
        /* Get the Api source */
        return _ApiSrc;
    }

    fadeInQuote = function(){
        //Fades in string letter by letter
        $("#quoteContent").html("");
        var str = _quote;
        var strLength = str.length;
        var x = 0;
        var newStr= jQuery.map(str.split(''), function (letter) {
            return $('<span id="lc'+x+++'">'+letter+'</span>');
        });
        var dest = $("#quoteContent");
        var c = 0;
        var i = setInterval(function () {
            newStr[c].appendTo(dest).hide().fadeIn(200);
            c += 1;
            if (c >= newStr.length) clearInterval(i);
        }, 50);

    }

    fadeOutQuote = function(){
        //Fades out string letter by letter backwards
        $("#quoteAuthor").html("");
        var strLength = _quote.length;
        var dest = $("#quoteContent");
        var c = strLength - 1;
        var i = setInterval(function () {
            $("#lc"+c).fadeOut(50);
            c--;
            if (c < 0) {
                clearInterval(i);
                FetchQuote();
            }
        }, 10);

    }
    
    return {
        SetApi: SetApi,  //Return only what you want to use
        GetApi: GetApi,  //Everything else is "private"
        GetQuote: GetQuote
    }
};

//testQuotes();
var myQuote = new quote();
log(myQuote);
myQuote.SetApi("https://andruxnet-random-famous-quotes.p.mashape.com/");
$(document).ready(function(){
    myQuote.GetQuote();
});

