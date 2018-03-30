'use strict';
require('dotenv').config();

module.exports = {
    twitter: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    },

    /**
     * General Robot Settings
     */
    settings: {
        // Your robot's Twitter username (without the @ symbol)
        // We use this to search for mentions of the robot
        // and to prevent it from replying to itself
        robotName: process.env.TWITTER_ROBOT_NAME,

        // Interval for new tweets in seconds. Most users will
        // probably want to tweet once every hour or so,
        // that way the bot isn't too spammy. (1 hour = 3600 seconds);
        // Note: Since Javascript timers are in milliseconds,
        // we'll multiply by 1,000 in another function.
        postInterval: 2257,

        // Tweet on startup? This will compose a tweet the moment
        // the bot is first run, rather than wait for the full interval.
        tweetOnStartup: true,

        // Recorded time of the last tweet the robot received in the stream,
        // so we can check things and restart the stream, if needed. This will
        // be stored as a Unix Timestamp.
        lastTweetReceivedTime: 0,

        // If true, allows the bot to monitor the live Twitter stream
        // (and enables everything below).
        // Default: true
        monitorStream: true,

        // If true, respond to DMs. False prevents it from responding to DMs.
        // TODO: Fix this.
        respondDMs: false,

        // If true, have the bot randomly reply to tweets that
        // appear in its stream.
        // Default: false
        randomReplies: false,

        // If true, we can repspond to replies!
        respondReplies: false,

        // If true, let the robot post to Twitter.
        // False prevents it from outputting to Twitter.
        postTweets: true,

        // If true, censors the bot based on topics.
        // True means censorship is enforced.
        censorBot: true,

        // If true, allow the bot to favorite tweets
        // based on the robot's personality settings (see below).
        getFavs: true,

        // If true, allow bot to follow new users that have followed it.
        followUsers: true,

        // If set to true, allow bot to randomly favorite tweets based on its interests.
        canFavoriteTweets: true,

        /**
        ** Create an array of replies that we'll wipe out every so often.
        ** Basically, if we've replied to the same user more than X amount
        ** of times within a certain time frame, let's not reply to them
        ** anymore for a bit in order to keep everyone's sanity.
        **/
        trackReplies: [],
    },

    // Configure your robot's interests!
    personality: {
        // A list of things the robot will be interested in and want
        // to favorite (and potentially respond to).
        // These are case insensitive.
        robotInterests: ['cyborgs', 'bot', 'bots', 'robot', 'robots', 'wall-e', 'dnd', 'WoW',
            'World Of Warcraft', 'meatbags', 'drones', 'married women', 'tinder', 'cephalopod', 'sports trivia',
            'crypto', 'bitcoin', 'altcoin', 'cryptocurrency', 'bloog', 'bort', 'fish', 'smig', 'Synergy',
            'company values', 'DnD', 'dungeons and dragons', 'developer', 'botlife', 'botlyfe', 'synergy',
            'business', 'b2b', 'optimization', 'mba', 'growth', 'art', 'rock climbing', 'lapas',
            'video games', 'video games', 'spain', 'travel', 'costa rica', 'tripping', 'philosophy',
            'politics', 'audi', 'audis', 'LAN', 'LAN Enthusiast', 'crypto', 'crypto jockey',
            'dickbutt', 'owen wilson', 'DILF', 'GILF', 'nust', 'bust', 'latex', 'vacuum body suit',
            'tentacle', 'ape', 'apes', 'bidet', 'bidets', 'elitism', 'deep gay'],

        // These are friends' bots and others that we want to interact with
        // but prevent a reply chain loop. Add usernames here without the @ symbol.
        // These are case insensitive.
        otherBots: ['roboderp', 'wikibot', 'boschbot'],

        // Hashtags to ignore so our bot doesn't inadvertantly get drawn into
        // controversial, sensitive, or tragic topics we may have tweeted about in the past.
        // These are case insensitive
        ignoredHashtags: ['Trump', 'politics', '911', 'democrats', 'republicans', 'pence', 'discourse'],

        // List of items to prevent bot from leaking personal information or anything too vulgar.
        // Vulgar being a very relative term.
        // These are case insensitive.
        censoredWords: ['https://drive.google.com'],

        /* Percent chance that the bot will add additional emojis
            ** to the end of a tweet. e.g., .3 = 30%.
            */
        addEmojis: 0.2,

        /* Percent chance that the bot will add additional hashtags
        ** to the end of a tweet. e.g., .2 = 20%.
        */
        addHashtags: 0.4,

        /* Check whether or not our bot is allowed to randomly reply to other
        ** users on its own.
        ** Default: false
        */
        randomReplies: true,

        /* Percent chance that the bot will randomly reply
        *  to tweets that pop up in its stream. e.g., .05 = 5%
        *  You'll probably want to keep random replies at 0.
        */
        randomRepliesChance: 0.01,
    }
};