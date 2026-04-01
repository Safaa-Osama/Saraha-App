import { EventEmitter } from "node:events";
import { emailEnum } from "../../enum/email.enum.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on(emailEnum.cofirmEmail, async (fn)=>{
await fn()
})