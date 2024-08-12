#Install
```
docker run jsadways668/chrome-bot
```
service run in 5000 port for default

---

#Render page as a PDF
```
http://domain:port/pdf?format=A4&height=1024&width=1280&printBackground=true&margin={bottom:1px,left:1px,right:1px,top:1px}&wait=#main&url=http://www.google.com.tw
```
* format in [letter,legal,tabloid,ledger,A0,A1,A2,A3,A4,A5,A6]
more information about format check 
https://pptr.dev/api/puppeteer.paperformat

* wait can be set a dom, class name, id by css selector format

* more option check 
https://pptr.dev/api/puppeteer.pdfoptions

---

#Render page as a image
```
http://domain:port/screenshot?format=png&location=0,0&size=1920,1080&fullPage=false&wait=#main&url=http://www.google.com.tw
```
* format in [png,jpeg]

* location = x,y

* size = width,height

* fullPage is boolean, if is set location and size parameter will be reject

* wait can be set a dom, class name, id by css selector format

* more option check 
https://pptr.dev/api/puppeteer.page.screenshot