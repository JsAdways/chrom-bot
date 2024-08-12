var puppeteer = require('puppeteer')
var http = require('http');
var url = require('url');

let server = http.createServer(async function (req, res) {
    let error_response = {
        code: '400',
        msg: ''
    }
    try{
        const pathname = url.parse(req.url, true)['pathname'];
        const query = url.parse(req.url, true)['query'];
        let query_url = query.url;

        if(typeof query_url !== 'undefined'){
            let available_options = {
                '/pdf':{
                    format:'string',
                    height:'string',
                    width:'string',
                    printBackground:'boolean',
                    margin:'object',
                    wait:'string'
                },
                '/screenshot':{
                    format:'string',
                    location:'string',
                    size:'string',
                    fullPage:'boolean',
                    wait:'string'
                }
            };
            let available_options_keys = Object.keys(available_options[pathname]);

            let print_options = Object.keys(query).reduce(function (result,item){
                if(available_options_keys.includes(item)){
                    if(available_options[pathname][item] === 'boolean'){
                        query[item] = (query[item] === 'true');
                    }
                    if(available_options[pathname][item] === 'object'){
                        query[item] = JSON.parse(decodeURI(query[item]));
                    }
                    result[item] = query[item];
                }
                return result;
            },{});

            const browser = await puppeteer.launch({
                headless: true,
                executablePath: '/usr/bin/chromium',
                args: ['--no-sandbox'],
                ignoreDefaultArgs: [ '--disable-extensions' ],
            });

            const page = await browser.newPage();
            await page.goto(query_url);

            if(print_options.hasOwnProperty('wait')){
                await page.waitForSelector(print_options.wait);
                delete print_options.wait
            }


            if(pathname === '/pdf'){
                let pdf = await page.pdf(print_options);
                await browser.close();
                res.write(pdf);
            }
            if(pathname === '/screenshot'){
                const viewport = {
                    width: 1280,
                    height: 1024,
                    deviceScaleFactor: 2
                };
                const clip = {
                    x:0,
                    y:0,
                    width: 1280,
                    height: 1024
                };

                if(print_options.hasOwnProperty('location')){
                    const [x, y] = print_options.location.split(',').map(item => Number(item));
                    clip.x = x;
                    clip.y = y;
                }
                if(print_options.hasOwnProperty('size')){
                    const [width, height] = print_options.size.split(',').map(item => Number(item));
                    clip.width = width;
                    clip.height = height;
                    viewport.width = width;
                    viewport.height = height;
                }

                let screenshot_option = {
                    type: (print_options.hasOwnProperty('format')) ? print_options.format : 'png'
                };

                if(!print_options.hasOwnProperty('fullPage')){
                    screenshot_option.clip = clip;
                    await page.setViewport(viewport);
                }else{
                    screenshot_option.fullPage = true;
                }


                let screenshot = await page.screenshot(screenshot_option);
                await browser.close();
                res.write(screenshot);
            }
        }

        res.end();


    }catch(e){
        res.statusCode = error_response.code
        error_response.msg = e.message
        res.end(JSON.stringify(error_response))
        console.log(e)
    }

});

server.listen(5000);