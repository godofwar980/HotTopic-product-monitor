const rp = require("request-promise-native");
const webhook = "https://discordapp.com/api/webhooks/571911600164831251/NfptyLSbPXNqyw8Qq4L4WWDf4LRS5TnUEOipkSdW1V6kJlHqGLlIhmdSf442JG_pJHJS";

class Hook {
    constructor(event,item,url){
        this.event = event
        this.item = item
        this.url = url
    }
     sendHook(){
        if(this.event === "restocked"){
            const successOpts = {
                uri: webhook,
                method: "POST",
                json:{
                    "embeds": [{
                        "title": `Product page`,
                        "url": this.url,
                        "color": 1768289,
                        "footer": {
                          "text": `[${new Date().toLocaleTimeString()}] HotTopic monitor || by @sharmigu3`
                        },
                        // Needs funko image support
                        // "thumbnail": {
                        //   "url": `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/198/sparkles_2728.png`
                        // },
                        "fields": [
                          {
                            "name": "Item",
                            "value": this.item,
                            "inline": false
                          }
                        ]
                    }]
                }
            }
            rp(successOpts)
            console.log(`[${new Date().toLocaleTimeString()}][Hook sent]`);
        }
    }
}

module.exports = Hook;