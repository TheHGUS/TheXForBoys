/**
 * ALL IMAGE URLS LIVE HERE.
 * ---------------------------------------------------------------------------
 * Photos are hot-linked from the client's existing Wix media library.
 *  - `size` controls the /:/rs=w:XXXX transform (1800 = large, 900 = small).
 *  - `w` / `h` are the intrinsic width/height attributes we render with
 *    (they give the browser a ratio before the photo loads).
 *  - `alt` is the real, written alt text. Every photo has one.
 *
 * NOTE FOR THE CLIENT: alt text below was written from the programme context
 * each photo is used in — please confirm the wording matches the shot.
 */

const BASE =
  'https://img1.wsimg.com/isteam/ip/f58551bb-d6b3-44c4-b114-6ddab0ea1f56/';

export type ImageAsset = {
  /** Large render (used for full-bleed / hero usage). */
  src: string;
  /** Small render (used for tickets, thumbnails, contact sheet). */
  srcSmall: string;
  alt: string;
  w: number;
  h: number;
};

type ImgOpts = {
  alt: string;
  /** Rendered ratio, used for the intrinsic width/height attributes. */
  ratio?: [number, number];
  large?: number;
  small?: number;
};

function img(file: string, { alt, ratio = [3, 2], large = 1800, small = 900 }: ImgOpts): ImageAsset {
  const name = encodeURIComponent(file);
  const [rw, rh] = ratio;
  return {
    src: `${BASE}${name}/:/rs=w:${large}`,
    srcSmall: `${BASE}${name}/:/rs=w:${small}`,
    alt,
    w: large,
    h: Math.round((large * rh) / rw),
  };
}

/** The white logo PNG — used as-is for the nav + footer lockup. */
export const LOGO_PNG =
  'https://img1.wsimg.com/isteam/ip/f58551bb-d6b3-44c4-b114-6ddab0ea1f56/The%20X%20for%20boys%20logo%2004-02%20WHITE.png';

export const HERO_MAIN = img('DSC06682-2.jpg', {
  alt: 'Boys and mentors of The “X” for Boys lined up together in their programme shirts at the Delta hangar in Albany, Georgia.',
  ratio: [16, 9],
});

export const SECTION_ALBANY = img('_DSC8134.JPG', {
  alt: 'A view of Albany, Georgia — the city The “X” for Boys works in.',
  ratio: [16, 10],
});

export const GIRLS_HERO = img('DSC01956.JPG', {
  alt: 'Girls in The X for Boys & Girls shirts posing together at a programme event.',
  ratio: [3, 2],
});

export const AUTO_1 = img('115941536_1928831703917630_8727889694125410655.jpg', {
  alt: 'Boys in The X for Boys shirts gathered around a car in the automotive repair workshop.',
});

export const AUTO_2 = img('115929844_315682949620369_6221762830782405607_.jpg', {
  alt: 'A mentor and a boy working together on a vehicle during an automotive repair workshop.',
});

export const HOME_1 = img('107490527_747809919368645_6947944466898993638_.jpg', {
  alt: 'Boys and mentors working on a home improvement project during a workshop.',
});

export const READ_1 = img('111202590_290813609027739_5402076106700616792_.jpg', {
  alt: 'Boys reading together during a weekly book club session.',
});

export const READ_2 = img('115374703_304621120733579_3822870454740553317_.jpg', {
  alt: 'A boy reading aloud with the group at the weekly book club.',
});

export const WISHLIST_IMG = img('Amazon-Wish-List.jpg', {
  alt: 'The Amazon wish list of supplies The “X” for Boys needs for its workshops.',
  ratio: [4, 3],
});

/** Contact sheet roll — every gallery photo, in the order specified. */
export const GALLERY: ImageAsset[] = [
  img('DSC06682-2.jpg', {
    alt: 'Boys and mentors of The “X” for Boys lined up together at the Delta hangar.',
    ratio: [3, 2],
    large: 1200,
    small: 600,
  }),
  img('115990942_1198274453863333_8796005110036790284.jpg', {
    alt: 'The “X” for Boys group photographed together at a programme session.',
    large: 1200,
    small: 600,
  }),
  img('115941536_1928831703917630_8727889694125410655.jpg', {
    alt: 'Boys in The X for Boys shirts working around a car during the automotive repair workshop.',
    large: 1200,
    small: 600,
  }),
  img('_DSC8134.JPG', {
    alt: 'A street view of Albany, Georgia at golden hour.',
    large: 1200,
    small: 600,
  }),
  img('DSC01956.JPG', {
    alt: 'Girls in The X for Boys & Girls shirts smiling together at an event.',
    large: 1200,
    small: 600,
  }),
  img('111160954_290062202204579_2370814296440233629_.jpg', {
    alt: 'Boys and mentors together during a programme activity.',
    large: 1200,
    small: 600,
  }),
  img('115830922_282651392950498_8991273928329165756_.jpg', {
    alt: 'A mentor working one-on-one with a boy at a workshop.',
    large: 1200,
    small: 600,
  }),
  img('107843755_276930733598966_2003922725532217508_.jpg', {
    alt: 'Boys getting hands-on with tools during a workshop session.',
    large: 1200,
    small: 600,
  }),
  img('110994707_2639230719661263_1074496696028095026.jpg', {
    alt: 'The group at work on a project during a programme session.',
    large: 1200,
    small: 600,
  }),
  img('112296745_2672695399669168_4236440098798381834.jpg', {
    alt: 'Boys and mentors side by side during a workshop.',
    large: 1200,
    small: 600,
  }),
  img('109509535_3311618885729231_3091300661327912455.jpg', {
    alt: 'A boy concentrating on a hands-on task at a workshop.',
    large: 1200,
    small: 600,
  }),
  img('115374703_304621120733579_3822870454740553317_.jpg', {
    alt: 'A boy reading with the weekly book club.',
    large: 1200,
    small: 600,
  }),
  img('111202590_290813609027739_5402076106700616792_.jpg', {
    alt: 'Boys reading together at a book club meeting.',
    large: 1200,
    small: 600,
  }),
  img('107490527_747809919368645_6947944466898993638_.jpg', {
    alt: 'Boys and mentors working on a home improvement project.',
    large: 1200,
    small: 600,
  }),
  img('DY7A8354.jpg', {
    alt: 'A portrait from a The “X” for Boys programme session.',
    large: 1200,
    small: 600,
  }),
  img('IMG_1121.jpg', {
    alt: 'Boys and mentors together at a The “X” for Boys event.',
    large: 1200,
    small: 600,
  }),
  img('IMG_1125.jpg', {
    alt: 'A moment from a The “X” for Boys workshop.',
    large: 1200,
    small: 600,
  }),
  img('IMG_1128.jpg', {
    alt: 'The group gathered at a The “X” for Boys event.',
    large: 1200,
    small: 600,
  }),
  img('IMG_1131.jpg', {
    alt: 'Boys and mentors at the end of a programme session.',
    large: 1200,
    small: 600,
  }),
];
