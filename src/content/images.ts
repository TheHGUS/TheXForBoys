/**
 * ALL IMAGES LIVE HERE.
 * ---------------------------------------------------------------------------
 * Every photo is self-hosted from /public/images (ROUND-03 P1 #9). The files
 * are produced by `node scripts/build-assets.mjs`, which downloads the client's
 * originals once and writes WebP + JPEG at 1800w and 900w. The site itself
 * never requests anything from the Wix CDN.
 *
 *  - `w` / `h` are the real pixel dimensions of the largest file, read from
 *    image-manifest.json, so the browser always has the true ratio.
 *  - `alt` describes what is actually in each photo (checked by eye, round 03).
 */
import manifest from './image-manifest.json';

type Size = { name: number; w: number; h: number };
type Entry = { slug: string; w: number; h: number; sizes: Size[] };
const MANIFEST = manifest as Record<string, Entry>;

export type ImageAsset = {
  /** Large JPEG (fallback + lightbox). */
  src: string;
  /** Small JPEG. */
  srcSmall: string;
  /** JPEG srcset, real widths. */
  srcSet: string;
  /** WebP srcset, real widths. */
  webpSet: string;
  alt: string;
  w: number;
  h: number;
};

function img(file: string, { alt }: { alt: string }): ImageAsset {
  const e = MANIFEST[file];
  if (!e) throw new Error(`images.ts: ${file} is missing from image-manifest.json — run scripts/build-assets.mjs`);
  const url = (n: number, ext: string) => `/images/${e.slug}-${n}.${ext}`;
  const set = (ext: string) => e.sizes.map((s) => `${url(s.name, ext)} ${s.w}w`).join(', ');
  const large = e.sizes[0];
  return {
    src: url(large.name, 'jpg'),
    srcSmall: url(e.sizes[e.sizes.length - 1].name, 'jpg'),
    srcSet: set('jpg'),
    webpSet: set('webp'),
    alt,
    w: large.w,
    h: large.h,
  };
}

/**
 * The white logo — the ONLY logo source (brief/PROJECT_BRIEF.md). This is the
 * client's own PNG with its transparent padding trimmed off (the original is
 * 612×612; the artwork sits at x 112–476, y 72–489), served locally. It is
 * never redrawn.
 */
export const LOGO_PNG = '/brand/logo-white.png';

/** Real pixel size of the trimmed logo artwork. */
export const LOGO_INTRINSIC = { w: 365, h: 418 } as const;

export const HERO_MAIN = img('DSC06682-2.jpg', {
  alt: 'Boys and mentors of The “X” for Boys lined up and waving in their programme shirts in front of a Delta Air Lines hangar.',
});

export const SECTION_ALBANY = img('_DSC8134.JPG', {
  alt: 'Boys from The “X” for Boys in a crowd at a fairground, rides and food stands behind them.',
});

export const GIRLS_HERO = img('DSC01956.JPG', {
  alt: 'Girls in pink X for Girls shirts gathered around a mentor working on a project outdoors.',
});

export const AUTO_1 = img('IMG_1128.jpg', {
  alt: 'Boys in The X for Boys shirts changing a tire on a red pickup truck while a mentor watches.',
});

export const AUTO_2 = img('IMG_1125.jpg', {
  alt: 'A boy kneeling beside a truck tire, reaching for tools and brake pads on the ground, as a mentor watches.',
});

export const HOME_1 = img('107490527_747809919368645_6947944466898993638_.jpg', {
  alt: 'A group of boys lifting a long timber beam over their heads together outdoors.',
});

export const READ_1 = img('112296745_2672695399669168_4236440098798381834.jpg', {
  alt: 'Boys sitting in a reading circle with books, an open book held in the foreground.',
});

export const READ_2 = img('115941536_1928831703917630_8727889694125410655.jpg', {
  alt: 'An indoor book club session: boys seated with books and papers while a mentor reads aloud.',
});

/**
 * Contact sheet roll — every gallery photo, in the order specified.
 *
 * DSC01956.JPG is deliberately NOT in the roll: it is the full-bleed
 * photograph in The X for Girls section immediately above, and showing it
 * twice in a row while scrolling on mobile read as a mistake (ROUND-02 P2 #12).
 */
export const GALLERY: ImageAsset[] = [
  img('DSC06682-2.jpg', { alt: 'Boys and mentors of The “X” for Boys lined up and waving in front of a Delta Air Lines hangar.' }),
  img('115990942_1198274453863333_8796005110036790284.jpg', { alt: 'Boys and mentors standing together in an apartment parking lot.' }),
  img('115941536_1928831703917630_8727889694125410655.jpg', { alt: 'Boys seated with books at an indoor book club session while a mentor reads.' }),
  img('_DSC8134.JPG', { alt: 'Boys from the programme in a crowd at a fairground.' }),
  img('111160954_290062202204579_2370814296440233629_.jpg', { alt: 'Boys and mentors working together underneath a car.' }),
  img('115830922_282651392950498_8991273928329165756_.jpg', { alt: 'Boys and mentors gathered around a folding table outdoors among pine trees.' }),
  img('107843755_276930733598966_2003922725532217508_.jpg', { alt: 'Boys and mentors around a car with its hood up in a front yard.' }),
  img('110994707_2639230719661263_1074496696028095026.jpg', { alt: 'A mentor takes a selfie with a group of boys on a bridge.' }),
  img('112296745_2672695399669168_4236440098798381834.jpg', { alt: 'Boys in a reading circle, an open book held in the foreground.' }),
  img('109509535_3311618885729231_3091300661327912455.jpg', { alt: 'A smiling group of boys and a mentor crowded together indoors.' }),
  img('115374703_304621120733579_3822870454740553317_.jpg', { alt: 'Boys leaning in to look at the engine of a car with its hood open.' }),
  img('111202590_290813609027739_5402076106700616792_.jpg', { alt: 'Boys lying under the front of a car, a tray of tools and a drain pan beside them.' }),
  img('107490527_747809919368645_6947944466898993638_.jpg', { alt: 'A group of boys lifting a long timber beam over their heads.' }),
  img('DY7A8354.jpg', { alt: 'Boys in white X polo shirts laughing together outside a brick building.' }),
  img('IMG_1121.jpg', { alt: 'Boys in X shirts and hoodies crowded around the open hood of a truck.' }),
  img('IMG_1125.jpg', { alt: 'A boy kneeling beside a truck tire with tools and brake pads on the ground.' }),
  img('IMG_1128.jpg', { alt: 'Boys in X shirts changing a tire on a red pickup truck.' }),
  img('IMG_1131.jpg', { alt: 'Boys in X shirts gathered around two trucks with their hoods up.' }),
];
