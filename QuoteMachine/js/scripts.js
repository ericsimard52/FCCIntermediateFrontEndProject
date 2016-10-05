
var log = console.log;//To ease change from rhino and browser.

function quote(){

    //Private
    _ApiSrc = "";
    _quote = "";
    _quoteAuthor="";
    
    //Methods

    GetQuote = function (){
        $("#quoteRow").fadeOut("slow",function(){

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
            }),
            complete:(function(){
                $("#quoteContent").html(_quote);
                $("#quoteAuthor").html("--- "+_quoteAuthor);
                $("#quoteRow").fadeIn("slow");
                $("#tweetThis").attr("href","https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="+_quote+" ---"+_quoteAuthor);
            })
            
        });
            
        });
        /* Get a new random quotes */
    }
    
    SetApi = function(src){
        /* Set the Api source */
        _ApiSrc = src
    }

    GetApi = function(){
        /* Get the Api source */
        return _ApiSrc;
    }

    return {
        SetApi: SetApi,  //Return only what you want to use
        GetApi: GetApi,  //Everything else is "private"
        GetQuote: GetQuote
    }
};

function testQuotes(){
    /*Provides a series of test I perform against my quote object*/
}
//testQuotes();
var myQuote = new quote();
log(myQuote);
myQuote.SetApi("https://andruxnet-random-famous-quotes.p.mashape.com/");
$(document).ready(function(){myQuote.GetQuote()});

