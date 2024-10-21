import type { Cfg } from "./shell.service.types"
import path from 'node:path'
import fs from 'node:fs'
import { spawn, spawnSync } from 'node:child_process'
function  abs(...paths: string[]): string {
    let result = ""
    result = path.resolve(...paths).replace(/\\/g, '/')

    if(path.isAbsolute(result)) return result

    result  = path.resolve(abs(process.cwd()), result).replace(/\\/g, '/')
    
    return result
}
// https://bun.sh/docs/api/spawn
export class ShellService {


    config :Cfg= {
        shell     : 'bash',
        args      : ["--login","-c","--"],
        prefix    : "set -euo pipefail;",
    } 
    constructor(config?:Partial<Cfg>){
        if(config) this.config = {...this.config,...config}
    }
    private envs:Record<string,string|undefined> = {}
 
    private cur=abs(process.cwd())

    #exists(path: string) {
        if(!fs.existsSync(path)){
            const msg = `path not found: "${path}"`;
            console.error(msg);
            throw new Error(msg);
        }
    }
    addEnv(obj:Record<string,string|undefined>){
        this.envs= {...this.envs,...obj}
    }
    cd(path:string){
        path = abs(path)
        this.#exists(path)
        if(this.cur == path) return this
        this.cur = path
        return this
    }

    #prepare(Cmd:string) {
        /**
         * https://bun.sh/docs/api/spawn#reference
         * https://bun.sh/docs/runtime/shell
         * -c : exec string
         * -i : use system envs alias etc
         * set -euo pipefail; ???
            
            let aliases = `lx() { ls -laF --color=always; };`
            let f = "some(){ echo 3;};"
            let ans = Bun.spawnSync(["bash","-c","-i","--",`${f}${cmd};exit $?;`])
        */
        
        let { shell, args, prefix } = this.config
        let cmd = [shell,...args, prefix + Cmd]
        let cwd = this.cur
        let env = {...Bun.env, ...this.envs}
        return {cmd,cwd,env}
    }


    exec(Cmd=""){ 
        
        console.info(`${'run'}: ${Cmd}`)

        let { cmd, cwd, env } = this.#prepare(Cmd)
        let command = cmd.shift() as string
        let args = cmd
        const result = spawnSync(command,args, {cwd, env });

        const {
            stderr,stdout,status,output,pid,signal,error
        } = result

        if(stderr.length) throw new Error(stderr.toString())
        
        console.log(`\n${stdout}`)

        return result
        
    }
    execAsync(Cmd=""){ 
    
        console.log(`${'run'}: ${Cmd}`)

        let { cmd, cwd, env } = this.#prepare(Cmd)
        let command = cmd.shift() as string
        let args = cmd
        const subprocess = spawn(command,args, {cwd, env });
       
        
        if(!subprocess.pid) throw new Error(`No pid`)

        return subprocess
        
    }
    
}