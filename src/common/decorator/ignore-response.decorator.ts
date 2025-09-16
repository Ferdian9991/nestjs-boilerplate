import { SetMetadata } from '@nestjs/common';

export const IGNORE_RESPONSE_KEY = 'ignoreResponse';
export const IgnoreResponse = () => SetMetadata(IGNORE_RESPONSE_KEY, true);
