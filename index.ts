import { template } from "./utils/template";
import { config } from "./utils/config";
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
        const url = new URL(req.url);
        const path = new URL(req.url).pathname;
        console.log(req.method, `${Bun.color("blue","ansi")}${path}${Bun.color("white","ansi")}`);
        let cgf = await config();

        if (url.pathname === "/") {
            let html = await Bun.file("./pages/index.html").text();
            index.TIME = new Date().toLocaleTimeString();
            html = template(html, index);
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }

        if (req.method === "POST" && path === "/form") {
            const data = await req.json();
            let sql = data.sql;
            console.log(sql);
            return Response.json({ success: true, data });
        }

        return new Response("404!");
    },
})
console.log(`Listening on ${server.url}`);