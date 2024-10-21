import { template } from "./utils/template";
import { config } from "./utils/config";
async function formsRoute( req:Request, path:string, name:string, cb:Function ) {
            
    if (req.method === "POST" && path === `/${name}`) {
        const data = await req.json();
        let res = data[name];
        console.log(res);
        const result = cb(res);
        return Response.json({ success: true, data, result });
    }
    return false
}
let index = {
    IMAGE   : process.env.IMAGE,
    VERSION : process.env.VERSION || 3,
    POD     : process.env.HOSTNAME,
    TIME    :  new Date().toLocaleTimeString(),
    CODE    : JSON.stringify(Bun.env, null, 2)
}
const server = Bun.serve({
    development: true,
    async fetch(req) {
        const url  = new URL(req.url);
        const path = url.pathname;
        console.log(req.method, `${Bun.color("blue","ansi")}${path}${Bun.color("white","ansi")}`);
        let cgf = await config();

        if (url.pathname === "/") {
            let html = await Bun.file("./pages/index.html").text();
            index.TIME = new Date().toLocaleTimeString();
            html = template(html, index);
            return new Response(html, { headers: { "Content-Type": "text/html", }, });
        }

        const ans = await formsRoute(req, path, "sql", (data:any) => {
            console.log(data);
            return {}
        })
        if(ans) return ans

        return new Response("404!");

    },
})
console.log(`Listening on ${server.url}`);