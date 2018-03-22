'use strict';
/**
 *   This robot component handles all the business logic for our robot.
 *   Things like event loops, checking for followers, checking tweets, etc.
 **/

// Import required npm modules to make our robot work!
var fs = require('fs');
var Promise = require('bluebird');
// var _ = require('lodash');

//////////
var config = require('../../config'); // Robot config, personality settings and API keys
var generator = require('../generator'); // Compiles word dictionary and builds new sentences.
var tweet = require('../tweets'); // Methods to interact with Twitter by writing and favoriting tweets and more.
var utils = require('../utilities'); // Various helper functions
var newTweet;

// Create promises
fs = Promise.promisifyAll(fs);
generator = Promise.promisifyAll(generator);

////// Start up tasks //////

// Process a provided list of stop words.
generator.stopwords = fs.readFileAsync('./data/stopwords.txt').toString().split("\n");

// Filename to source or tweets and other content from?
var tweetFile = './tweets.txt';

// Track times of various actions from our robot
var robotActions = {
    lastFollowCheck: 0,
    lastRandomReply: 0,
    lastReply: 0,
    lastRetweet: 0,
    lastTweet: 0
};

module.exports = {

    // Initialize robot and start doing robot things.
    // Example, build word dictionary. Start watching stream, etc.
    init: function () {
        // Load up robot settings.
        console.log('NATBOT', global.botVersion); //jshint ignore: line
        console.log('-== CONFIG SETTINGS ==-'); //jshint ignore: line
        console.log(' -Post to Twitter? ' + config.settings.postTweets); //jshint ignore: line
        console.log(' -Repond to DMs? ' + config.settings.respondDMs); //jshint ignore: line
        console.log(' -Repond to replies? ' + config.settings.respondReplies); //jshint ignore: line
        console.log(' -Random replies? ' + config.settings.randomReplies); //jshint ignore: line
        console.log(' -Follow new users? ' + config.settings.followUsers); //jshint ignore: line
        console.log(' -Mark tweets as favorites? ' + config.settings.canFavoriteTweets); //jshint ignore: line
        console.log(' -Tweet interval: ' + config.settings.postInterval + ' seconds'); //jshint ignore: line

        // Set proper context
        var self = this;

        // Load in text file containing raw Tweet data.
        fs.readFileAsync(tweetFile)
            .then(function (fileContents) {
                console.log('\nAnalyzing data and creating word corpus from file \'' + tweetFile + '\''); //jshint ignore: line
                console.log('(This may take a few minutes to generate...)'); //jshint ignore: line
                //Split content into array, separating by line.
                var content = fileContents.toString().split("\n");
                return content;
            })
            .then(function (content) {
                // Strip usernames and links from content
                console.log('cleaning content'); //jshint ignore: line
                return generator.cleanContent(content);
            })
            .then(function (content) {
                //Build word corpus using content array above.
                console.log('building corpus'); //jshint ignore: line
                return generator.buildCorpus(content);
            })
            .then(function (data) {
                // Once word dictionary is built, kick off the robots actions!

                console.log(data); //jshint ignore: line

                self.onBoot();

                /*
                    *  There may be a better way to handle this. Right now,
                    *  this interval runs every 5 seconds and calls the
                    *  robotTasks function, which handles the logic that checks
                    *  if it's time to send a new tweet, reload the Twitter stream
                    *  etc.
                    */
                setInterval(function () { //jshint ignore: line
                    console.log(generator.makeTweet(200)); //jshint ignore: line
                    self.robotTasks();
                }, 61000);
            })
            .catch(function (err) {
                if (err.code === 'ENOENT') {
                    console.error('ERROR: tweets.txt does not exist'); //jshint ignore: line
                    return;
                }
            })
    },

    /*
        *  These are tasks the robot should do the first time it loads up.
        */
    onBoot: function () {
        // If no credentials are provided in config file, ignore this request.
        if (!config.twitter.consumer_key && !config.twitter.consumer_secret && !config.twitter.access_token_key && !config.twitter.access_token_secret) {
            console.log('Error: No credentials provided.'); //jshint ignore: line
            return;
        }

        // Start watching the Twitter stream.
        tweet.watchStream();

        // Check for new followers.
        if (config.settings.followUsers) {
            robotActions.lastFollowCheck = Math.floor(Date.now() / 1000);
            tweet.getFollowers();
        }

        // Check if the robot is allowed to tweet on startup.
        // If so, post a tweet!
        if (config.settings.tweetOnStartup) {
            robotActions.lastTweet = Math.floor(Date.now() / 1000); // Update time of the last tweet.
            newTweet = generator.makeTweet(200); // Create a new tweet.
            tweet.postNewTweet(newTweet); // Post tweet.
            console.log(utils.currentTime(), newTweet + ''); //jshint ignore: line
        }
    },

    robotTasks: function () {
        /*
            *  Check how long it's been since robot last tweeted.
            *  If amount of time is greater than the tweet interval
            *  defined in the config file. Go ahead and post a new tweet.
            */
        if (Math.floor(Date.now() / 1000) - robotActions.lastTweet >= config.settings.postInterval) {
            robotActions.lastTweet = Math.floor(Date.now() / 1000); // Update time of the last tweet.
            newTweet = generator.makeTweet(200); // Create a new tweet.
            tweet.postNewTweet(newTweet); // Post tweet.
            console.log(utils.currentTime(), newTweet + ''); //jshint ignore: line
        }

        if (config.twitter.consumer_key && config.twitter.consumer_secret && config.twitter.access_token_key && config.twitter.access_token_secret) {
            /*
                *  Check if the Twitter Stream dropped. If so, reinitialize it.
                */
            tweet.checkStream();

            /*
                *   Check for new followers
                */
            if (config.settings.followUsers && Math.floor(Date.now() / 1000) - robotActions.lastFollowCheck >= 300) {
                robotActions.lastFollowCheck = Math.floor(Date.now() / 1000);
                tweet.getFollowers();
            }
        }
    }
};

///// DEBUG STUFF
// var fakeTweet = {
//   id_str: 12345,
//   text: '@Roboderp This is a Dodgers sample tweet to analyze!',
//   user: {
//     screen_name: 'fakeuser',
//   }
// };