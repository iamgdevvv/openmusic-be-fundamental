import { ValidatorPayloadType } from '@/types/ValidatorType';
import InvariantError from '@/exceptions/InvariantError';

const PayloadValidator = {
	validatePayload: (schema, payload) => {
		const validationResult = schema.safeParse(payload);

		if (!validationResult.success) {
			const messageErorrs = validationResult.error.issues.map((issue) => issue.message);

			throw new InvariantError(messageErorrs.join(', '));
		}
	},
} as ValidatorPayloadType;

export default PayloadValidator;
