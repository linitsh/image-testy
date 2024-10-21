
import type { ChildProcessWithoutNullStreams } from "child_process";
export type Cfg = {
    shell     : string;
    args      : string[];
    prefix    : string;
}

export type TReturnAsync = ChildProcessWithoutNullStreams