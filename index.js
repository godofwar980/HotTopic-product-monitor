const rp = require("request-promise-native");
const webhook = require("./hook");

const pause = (delay)=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, delay);
    });
};

const getStock = async (itemPID)=> {
    try{
        const itemUrl = `https://www.hottopic.com/on/demandware.store/Sites-hottopic-Site/default/Product-GetAvailability?pid=${itemPID}`;

        const options = {
            uri: itemUrl,
            headers: {
                'referer': 'https://www.hottopic.com/product/11610849.html',
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
            json: true
        };
    
        const response = await rp(options);
        return response.status;
    }catch(e){
        console.log(e);
        await pause(5000);
        getStock();
    }
}

const itemStatus = async (itemDesired)=> {
    try{
        const status = await getStock(itemDesired);

        const check = async() => {
            if (status === "IN_STOCK") {
                console.log(`[${new Date().toLocaleTimeString()}] Item in stock: ${itemDesired}`);
                new webhook("restocked",itemDesired,`https://www.hottopic.com/product/${itemDesired}.html`).sendHook();
                await pause(3000); // idk why 3s but xd 
                check(); // watches it until it goes out of stock
            } else {
                console.log(`[${new Date().toLocaleTimeString()}] OOS, Retrying`);
                await pause(1000);
                check();
            }
        }
         check();
    } catch(e){
        console.log(e);
        await pause(5000);
        itemStatus();
    }
};

// product id found in the html of a hot topic item.
itemStatus(11782806);
itemStatus(11679156);
