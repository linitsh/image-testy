import { template } from "./utils/template"
import { config as Config } from "./utils/config"
import { ShellService } from "./utils/shell"
import minimist from 'minimist'
let {_, ...args} = minimist(process.argv.slice(2)) ?? {}
console.log(args)
if(args.error){
    console.log(`error mode enabled`)
    let rand = Math.floor(Math.random() * (100 - 1 + 1) + 1);
    if(rand > args.error){
        console.log(`exit`)
        process.exit(1)
    }
}



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

async function probesRoute( req:Request, path:string, name:string ) {
            
    if (req.method === "GET" && path === `/${name}`) {
        let err = args[name] ? true : false
        if(err)
        return new Response(`${path}: 404`,{status:404});
        return new Response(`${path}: 200`,{status:200});
    }
    return false
}

let index = {
    IMAGE   : process.env.IMAGE,
    VERSION : process.env.VERSION || 3,
    POD     : process.env.HOSTNAME,
    TIME    :  new Date().toLocaleTimeString(),
    CODE    : JSON.stringify(Bun.env, null, 2),
}
const server = Bun.serve({
    development: true,
    async fetch(req) {
        const url  = new URL(req.url);
        const path = url.pathname;
        console.log(req.method, `${path}`);
        let config = await Config();

        if (url.pathname === "/") {
            let html = await Bun.file("./index.html").text();
            index.TIME = new Date().toLocaleTimeString();
            html = template(html, index);
            return new Response(html, { headers: { "Content-Type": "text/html" } });
        }

        let result = await formsRoute(req, path, "exec", (data:any) => {
            console.log(data);
            let shell    = new ShellService()
            let result   = shell.exec(data)
            const stdout = result.stdout.toString().trim()
            const stderr = result.stderr.toString().trim()
            const res    = stderr ? stderr : stdout 
            return res
        })
        if(result) return result

        result = await probesRoute(req, path, "startup-probe")
        if(result) return result
        result = await probesRoute(req, path, "liveness-probe")
        if(result) return result
        result = await probesRoute(req, path, "readiness-probe")
        if(result) return result

        return new Response("404!", { status: 404 });

    },
})
console.log(`Listening on ${server.url}`);