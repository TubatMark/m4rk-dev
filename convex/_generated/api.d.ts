/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aboutSection from "../aboutSection.js";
import type * as adminAuth from "../adminAuth.js";
import type * as contactSection from "../contactSection.js";
import type * as experience from "../experience.js";
import type * as heroSection from "../heroSection.js";
import type * as messages from "../messages.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as siteSettings from "../siteSettings.js";
import type * as skills from "../skills.js";
import type * as socialLinks from "../socialLinks.js";
import type * as stats from "../stats.js";
import type * as technologies from "../technologies.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aboutSection: typeof aboutSection;
  adminAuth: typeof adminAuth;
  contactSection: typeof contactSection;
  experience: typeof experience;
  heroSection: typeof heroSection;
  messages: typeof messages;
  projects: typeof projects;
  seed: typeof seed;
  siteSettings: typeof siteSettings;
  skills: typeof skills;
  socialLinks: typeof socialLinks;
  stats: typeof stats;
  technologies: typeof technologies;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
