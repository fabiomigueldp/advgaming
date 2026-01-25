/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { SupportedLocale } from '@util/translate';

declare namespace App {
    interface Locals {
        lang: SupportedLocale;
    }
}

