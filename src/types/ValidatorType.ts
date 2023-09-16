import { Readable } from "stream";
import { ZodTypeAny } from "zod";

type ValidatorPayloadType = {
	validatePayload: (schema: ZodTypeAny, payload: string | object | Readable | Buffer) => void;
};

export { ValidatorPayloadType };
