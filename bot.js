const TwitterPackage = require("twitter");

const DEBUG = process.env.debug;
const secret = {
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
};

function init() {
  bot();
}

function bot() {
  const Twitter = new TwitterPackage(secret);
  console.log("Twitter Bot: Helperbird Running");
  // Call the stream function and pass in 'statuses/filter'
  // our filter object, and our callback
  Twitter.stream(
    "statuses/filter",
    {
      track: "#dyslexia,#dyslexic,#opendyslexic"
    },
    function(stream) {
      var pastUsername = "";
      // ... when we get tweet data...
      stream.on("data", function(tweet) {
        if (DEBUG) {
          console.log(tweet);
        }

        const messages = [
          "Hi @" +
            tweet.user.screen_name +
            ", I saw you brought up '#dyslexia'. You should check out https://www.helperbird.com . Free dyslexia and accessibility app for Google Chrome. Making it easier to read online. #dyslexia #dyslexic",
          "Hey @" +
            tweet.user.screen_name +
            ". I`m Helpebird. A free dyslexia and accessibility app for Google Chrome. Making it easier to read online and help you out. Learn more at https://www.helperbird.com . #dyslexia #dyslexic",
          "Hey @" +
            tweet.user.screen_name +
            ". I`m Helpebird. A free dyslexia and accessibility app for Google Chrome. I saw you brought up '#dyslexia'. I can change the font, colours and more on any webpage. Making it easier for you to read. Learn more at https://www.helperbird.com . #dyslexia #dyslexic"
        ];

        // build our reply object
        let statusObj = {
          status: messages[Math.floor(Math.random() * messages.length)],
          in_reply_to_status_id: tweet.id_str
        };

        if (
          tweet.favorited === true ||
          tweet.retweeted === true ||
          tweet.user.screen_name === "helperbird_" ||
          tweet.user.screen_name === "Antijingoist" ||
          pastUsername === tweet.user.screen_name
        ) {
          return false;
        }

        pastUsername = tweet.user.screen_name; // call the post function to tweet something
        Twitter.post("statuses/update", statusObj, function(
          error,
          tweetReply,
          response
        ) {
          // if we get an error print it out
          if (error) {
            console.log(error);
            return false;
          }
          // print the text of the tweet we sent out
          if (DEBUG) {
            console.log(tweetReply.text);
          }
        });
      });

      // ... when we get an error...
      stream.on("error", function(error) {
        // print out the error
        console.log(error);
      });
    }
  );
}

exports.init = init;

exports.bot = bot;
